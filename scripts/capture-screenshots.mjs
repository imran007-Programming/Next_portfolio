#!/usr/bin/env node
/**
 * Re-captures project screenshots from the live sites listed in
 * scripts/screenshots.config.mjs and updates the images in /public — but only
 * when the page actually looks different (see `changeThreshold`), so small
 * animation/slider differences don't create a new commit every day.
 *
 * Usage:
 *   node scripts/capture-screenshots.mjs            check every shot, replace the changed ones
 *   node scripts/capture-screenshots.mjs --if-due   skip if checked < `intervalDays` ago
 *   node scripts/capture-screenshots.mjs --force    replace every image, changed or not
 *   node scripts/capture-screenshots.mjs --only rise-at-seven
 *
 * Needs `playwright-core` plus a Chromium browser:
 *   npm install --no-save playwright-core && npx playwright-core install chromium
 * or point CHROME_PATH at an installed Chrome/Edge instead of installing Chromium.
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile, appendFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "./screenshots.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATE_FILE = path.join(ROOT, "scripts", ".screenshots-last-run");
const MANIFEST_FILE = path.join(ROOT, "src", "data", "screenshots.json");
const DAY_MS = 24 * 60 * 60 * 1000;

const args = process.argv.slice(2);
const ifDue = args.includes("--if-due");
const force = args.includes("--force");
const onlyIdx = args.indexOf("--only");
const only = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

/** Tell a GitHub Actions workflow whether any image changed. */
async function setOutput(name, value) {
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
}

const utcDay = (d) => Math.floor(d.getTime() / DAY_MS);

/* ── Versioned file names ──────────────────────────────────────────
 * Each shot's `file` (e.g. public/tour/tour_main.jpg) is a stable key. The
 * real image lives at a hashed name (public/tour/tour_main.3f2a9c1b.jpg) and
 * src/data/screenshots.json maps "/tour/tour_main.jpg" → the current file.
 */
const toUrl = (file) => "/" + path.posix.relative("public", file.replace(/\\/g, "/"));
const publicPath = (url) => path.join(ROOT, "public", url);
const versionedUrl = (url, buf) =>
  url.replace(/\.jpg$/, `.${createHash("sha1").update(buf).digest("hex").slice(0, 8)}.jpg`);

async function readManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeManifest(manifest) {
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await writeFile(MANIFEST_FILE, JSON.stringify(sorted, null, 2) + "\n");
}

/** Whole calendar days (UTC) since images were last updated. */
async function daysSinceLastUpdate() {
  try {
    const last = new Date((await readFile(STATE_FILE, "utf8")).trim());
    return Number.isNaN(last.getTime()) ? Infinity : utcDay(new Date()) - utcDay(last);
  } catch {
    return Infinity;
  }
}

/** Scroll through the whole page so lazy images and in-view animations fire. */
async function warmUp(page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(200);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);
}

/**
 * Wait until every image that will appear in the shot has finished loading,
 * so a half-loaded picture isn't mistaken for a design change.
 */
async function waitForImages(page, fullPage) {
  await page
    .waitForFunction(
      (whole) =>
        [...document.images]
          .filter((img) => {
            if (whole) return true;
            const r = img.getBoundingClientRect();
            return r.bottom > 0 && r.top < window.innerHeight;
          })
          .every((img) => img.complete && img.naturalWidth > 0),
      fullPage,
      { timeout: 15_000 },
    )
    .catch(() => {}); // a broken image shouldn't block the whole capture
}

async function firstVisible(page, text) {
  for (const el of await page.getByText(text).all()) {
    if (await el.isVisible()) return el;
  }
  return null;
}

async function openPage(page, url) {
  // One retry — free-tier hosts sometimes time out on the first (cold) request
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await page.goto(url, { waitUntil: "load", timeout: 60_000 });
      if (!res || res.status() >= 400) throw new Error(`HTTP ${res?.status() ?? "no response"}`);
      return;
    } catch (err) {
      if (attempt >= 2) throw err;
      await page.waitForTimeout(5000);
    }
  }
}

/** Run simple UI steps: click a button by its exact text, wait for a URL, or pause. */
async function runSteps(page, steps = []) {
  for (const step of steps) {
    if (step.click) {
      await page.getByText(step.click, { exact: true }).first().click({ timeout: 30_000 });
    }
    if (step.waitForURL) await page.waitForURL(step.waitForURL, { timeout: 60_000 });
    if (step.wait) await page.waitForTimeout(step.wait);
  }
}

/** Log in once for a project; the returned browser context keeps the session. */
async function loginContext(browser, project) {
  const context = await browser.newContext({ viewport: config.viewport });
  const page = await context.newPage();
  try {
    await openPage(page, new URL(project.login.path ?? "/", project.url).toString());
    await page.waitForTimeout(2000);
    await runSteps(page, project.login.steps);
  } finally {
    await page.close();
  }
  return context;
}

/**
 * Black out private details (phone numbers, chat text…) before capturing.
 * `mask.text` is a regex matched against each element's own text;
 * `mask.selectors` are CSS selectors to hide completely.
 */
async function maskLocators(page, mask) {
  if (!mask) return [];
  if (mask.text) {
    await page.evaluate((source) => {
      const re = new RegExp(source);
      for (const el of document.querySelectorAll("body *")) {
        const own = [...el.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .map((n) => n.textContent)
          .join("")
          .trim();
        if (own && re.test(own)) el.setAttribute("data-shot-mask", "");
      }
    }, mask.text);
  }
  return ["[data-shot-mask]", ...(mask.selectors ?? [])].map((s) => page.locator(s));
}

/**
 * Full-page capture for sites with scroll-driven/pinned sections, where a
 * normal fullPage screenshot comes out mostly blank. Scrolls one screen at a
 * time, captures each view, and joins them on a canvas — so the image shows
 * what a visitor sees while scrolling. Fixed elements (e.g. the navbar) are
 * hidden after the first screen so they don't repeat down the image.
 */
async function stitchedShot(context, page, mask) {
  const vh = config.viewport.height;
  const frames = [];
  for (let top = 0; ; top += vh) {
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    const y = Math.min(top, total - vh);
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(800);
    if (frames.length === 1) {
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("body *")) {
          if (getComputedStyle(el).position === "fixed") el.style.visibility = "hidden";
        }
      });
    }
    await waitForImages(page, false);
    const buf = await page.screenshot({
      type: "jpeg",
      quality: 90,
      animations: "disabled",
      mask: await maskLocators(page, mask),
      maskColor: "#0a0a0a",
    });
    frames.push({ y, b64: buf.toString("base64") });
    if (y + vh >= total) break;
  }

  // Join the frames in a blank page's canvas and export one JPEG
  const canvasPage = await context.newPage();
  try {
    const dataUrl = await canvasPage.evaluate(
      async ({ frames, width, height }) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        for (const f of frames) {
          const img = new Image();
          img.src = `data:image/jpeg;base64,${f.b64}`;
          await img.decode();
          ctx.drawImage(img, 0, f.y);
        }
        return canvas.toDataURL("image/jpeg", 0.8);
      },
      {
        frames,
        width: config.viewport.width,
        height: frames[frames.length - 1].y + vh,
      },
    );
    return Buffer.from(dataUrl.split(",")[1], "base64");
  } finally {
    await canvasPage.close();
  }
}

async function takeShot(context, project, shot) {
  const url = new URL(shot.path ?? "/", project.url).toString();
  const page = await context.newPage();
  try {
    await openPage(page, url);
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() => {});

    // Don't capture loading skeletons: wait for real content (e.g. tour cards)
    if (shot.waitForSelector) {
      await page
        .waitForSelector(shot.waitForSelector, { state: "attached", timeout: 60_000 })
        .catch(() => {
          throw new Error(`content didn't load (no "${shot.waitForSelector}")`);
        });
    }
    await page.waitForTimeout(1500);
    await warmUp(page);
    await runSteps(page, shot.steps);

    if (shot.scrollToText) {
      const el = await firstVisible(page, shot.scrollToText);
      if (!el) throw new Error(`text "${shot.scrollToText}" not found`);
      const top = await el.evaluate((node) => node.getBoundingClientRect().top + window.scrollY);
      await page.evaluate((y) => window.scrollTo(0, y), top - (shot.offset ?? 80));
      await page.waitForTimeout(1500);
    } else if (shot.scrollTo === "bottom") {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(1500);
    }

    if (shot.stitch) return await stitchedShot(context, page, shot.mask);

    await waitForImages(page, !!shot.fullPage);

    // animations: "disabled" freezes CSS animations (marquees etc.) so repeat
    // captures of an unchanged page look the same
    return await page.screenshot({
      type: "jpeg",
      quality: 80,
      fullPage: !!shot.fullPage,
      animations: "disabled",
      mask: await maskLocators(page, shot.mask),
      maskColor: "#0a0a0a",
    });
  } finally {
    await page.close();
  }
}

/**
 * Fraction (0–1) of pixels that differ noticeably between two JPEGs.
 * Runs inside the browser with a canvas, so no image library is needed.
 * A different height counts the extra rows as fully changed.
 */
async function diffRatio(page, oldBuf, newBuf) {
  return page.evaluate(async ([a64, b64]) => {
    const load = (b64) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `data:image/jpeg;base64,${b64}`;
      });
    const [a, b] = await Promise.all([load(a64), load(b64)]);
    if (a.width !== b.width) return 1;

    const w = a.width;
    const h = Math.min(a.height, b.height);
    const maxH = Math.max(a.height, b.height);
    const pixels = (img) => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, w, h).data;
    };
    const pa = pixels(a);
    const pb = pixels(b);

    // Ignore tiny colour shifts from JPEG compression
    const TOLERANCE = 40;
    let changed = (maxH - h) * w;
    for (let i = 0; i < pa.length; i += 4) {
      if (
        Math.abs(pa[i] - pb[i]) > TOLERANCE ||
        Math.abs(pa[i + 1] - pb[i + 1]) > TOLERANCE ||
        Math.abs(pa[i + 2] - pb[i + 2]) > TOLERANCE
      ) {
        changed++;
      }
    }
    return changed / (w * maxH);
  }, [oldBuf.toString("base64"), newBuf.toString("base64")]);
}

async function main() {
  if (ifDue) {
    const days = await daysSinceLastUpdate();
    if (days < config.intervalDays) {
      console.log(`Images updated ${days} day(s) ago (< ${config.intervalDays}) — nothing to do.`);
      await setOutput("changed", "false");
      return;
    }
  }

  let chromium;
  try {
    ({ chromium } = await import("playwright-core"));
  } catch {
    console.error("playwright-core is not installed. Run: npm install --no-save playwright-core");
    process.exit(1);
  }

  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
  const comparePage = await browser.newPage();
  const manifest = await readManifest();
  let updated = 0;
  let renamed = 0;
  let unchanged = 0;
  let failed = 0;

  for (const project of config.projects) {
    if (only && project.slug !== only) continue;

    // Public shots get a fresh context; shots marked `login: true` share one
    // logged-in session (created lazily, only if such a shot exists).
    const publicContext = await browser.newContext({ viewport: config.viewport });
    let authContext = null;
    let loginError = null;

    for (const shot of project.shots) {
      const url = toUrl(shot.file);
      const currentUrl = manifest[url] ?? url;
      const currentPath = publicPath(currentUrl);
      try {
        let context = publicContext;
        if (shot.login) {
          if (!authContext && !loginError) {
            authContext = await loginContext(browser, project).catch((err) => {
              loginError = err;
              return null;
            });
          }
          if (loginError) throw new Error(`login failed (${loginError.message.split("\n")[0]})`);
          context = authContext;
        }
        const fresh = await takeShot(context, project, shot);
        const old = await readFile(currentPath).catch(() => null);
        const threshold = shot.changeThreshold ?? config.changeThreshold;

        let note = "new file";
        if (old && !force) {
          const ratio = await diffRatio(comparePage, old, fresh);
          note = `${(ratio * 100).toFixed(1)}% changed`;
          if (ratio < threshold) {
            unchanged++;
            // One-time migration: give an un-versioned file its hashed name
            if (!manifest[url]) {
              manifest[url] = versionedUrl(url, old);
              await rename(currentPath, publicPath(manifest[url]));
              renamed++;
              note += ", renamed to versioned file";
            }
            console.log(`= ${shot.file} — ${note}, kept`);
            continue;
          }
        } else if (old) {
          note = "forced";
        }

        // The file name carries a content hash, so every change gets a new URL
        // and no cache (Next.js image optimizer, Vercel CDN, browsers) can keep
        // serving the old picture. Write to a temp file first so a crash never
        // leaves a half-written image.
        const newUrl = versionedUrl(url, fresh);
        const target = publicPath(newUrl);
        const tmp = `${target}.tmp.jpg`;
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(tmp, fresh);
        await rename(tmp, target);
        if (old && currentUrl !== newUrl) await unlink(currentPath).catch(() => {});
        manifest[url] = newUrl;
        updated++;
        console.log(`✓ ${shot.file} — ${note}, updated → ${newUrl}`);
      } catch (err) {
        failed++;
        console.warn(`✗ ${shot.file} — kept the old image (${err.message.split("\n")[0]})`);
      }
    }
    await publicContext.close();
    await authContext?.close();
  }
  await browser.close();

  console.log(`\nDone: ${updated} updated, ${unchanged} unchanged, ${failed} failed.`);
  if (updated > 0 || renamed > 0) await writeManifest(manifest);
  if (updated > 0) await writeFile(STATE_FILE, new Date().toISOString() + "\n");
  await setOutput("changed", updated > 0 || renamed > 0 ? "true" : "false");
  if (updated === 0 && unchanged === 0 && failed > 0) process.exit(1);
}

main();
