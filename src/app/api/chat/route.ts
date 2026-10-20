import { sendChatbotEmail } from "@/lib/mail";

// Google Gemini via its REST API. Flash-Lite is fast and cheap enough for a
// portfolio chatbot; override with GEMINI_MODEL (e.g. "gemini-3.8-flash").
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

type ChatMessage = { role: "user" | "assistant"; content: string };
type GeminiContent = { role: "user" | "model"; parts: { text: string }[] };
type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
};

/**
 * Convert the chat history to Gemini's format: assistant → "model", drop the
 * greeting that comes before the first user message, and merge consecutive
 * turns from the same side (Gemini expects user/model to alternate).
 */
function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
  const contents: GeminiContent[] = [];
  for (const m of messages) {
    const role = m.role === "assistant" ? "model" : "user";
    if (!contents.length && role === "model") continue;
    const last = contents[contents.length - 1];
    if (last?.role === role) last.parts[0].text += `\n\n${m.content}`;
    else contents.push({ role, parts: [{ text: m.content }] });
  }
  return contents;
}

/** The answer text of a Gemini response, skipping any thought parts. */
function responseText(data: GeminiResponse): string {
  return (data.candidates?.[0]?.content?.parts ?? [])
    .filter((p) => !p.thought)
    .map((p) => p.text ?? "")
    .join("");
}

function gemini(apiKey: string, method: "generateContent" | "streamGenerateContent", body: object) {
  const query = method === "streamGenerateContent" ? "?alt=sse" : "";
  return fetch(`${GEMINI_BASE}/${GEMINI_MODEL}:${method}${query}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify(body),
  });
}

const SYSTEM = `You are the portfolio assistant for Imran Hasan, a Full Stack Developer. Answer visitor questions about Imran's work, skills, projects, and availability. Be friendly, concise (2-4 sentences unless more detail is asked for), and professional.

=== ABOUT IMRAN ===
Name: Imran Hasan
Role: Full Stack Developer
Experience: 1+ year, 5+ projects shipped
Status: Open to work — available for remote full-time roles and freelance
Email: imranphero@gmail.com
WhatsApp: +8801647153126
LinkedIn: https://www.linkedin.com/in/imran-hasan-399170171/
GitHub: https://github.com/imran007-Programming

=== PROJECTS ===
1. TourGuide (2025) — Full Stack Developer
   Tech: Next.js, React, Tailwind CSS, Node.js, Express, Prisma, PostgreSQL, Vercel
   Live: https://tourguide-five.vercel.app/
   Features: Destination search, VIP packages, guide onboarding, booking dashboard, testimonials

2. Rise at Seven (2025) — Frontend Developer
   Tech: Next.js, React, Framer Motion, Tailwind CSS
   Live: https://rise-at-seven-olive.vercel.app/
   Features: Animated hero sections, client showcase, blog listings, office locations

3. eMart (2024) — Frontend Developer
   Tech: React, JavaScript, CSS, Vercel
   Live: https://emart-frontend-main.vercel.app/
   Features: Product browsing, cart, product detail pages, checkout flow

4. Parcel Delivery App (2025) — Full Stack Developer
   Tech: React, TypeScript, Vite, Tailwind CSS, Node.js, Express, MongoDB, Mongoose
   Live: https://percel-delievey-app.vercel.app/
   Features: Real-time shipment tracking, delivery status, Express REST API, MongoDB backend

5. AgroMate (2026) — Full Stack Developer
   Tech: Next.js, React, TypeScript, Tailwind CSS, next-intl, MapLibre, Socket.IO, Express, Prisma, PostgreSQL
   Live: https://agromate-one.vercel.app/
   Features: Bilingual (English/Bangla) smart-farming platform — live market prices and weather, field mapping, crop records and account book, AI disease check and assistant, real-time chat with agricultural experts

6. TradeSlot (2026) — Full Stack Developer
   Tech: Next.js, React, TypeScript, Tailwind CSS, Node.js, Express, Prisma, PostgreSQL, Stripe Connect
   Live: https://trade-slot.vercel.app/
   Features: WhatsApp & web chat booking for tradespeople, 30-minute travel buffer scheduling, daily work-area zones, Stripe payments, trader dashboard

=== SKILLS ===
Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, Framer Motion, Vite, HTML/CSS
Backend: Node.js, Express.js, REST APIs, Prisma ORM
Databases: PostgreSQL, MongoDB, Mongoose
Tools: Git, GitHub, Vercel, Figma

=== RULES ===
- Never make up information not listed above.
- When asked about hiring or contacting, share the email and WhatsApp.
- Keep answers short unless more detail is requested.
- Use plain text only — no markdown, no bullet symbols, just clean sentences.`;

const CLASSIFY_SYSTEM = `You are a strict classifier. A user asked a question to a portfolio chatbot.
The chatbot only knows: Imran Hasan's projects, his tech skills, contact details (email/WhatsApp/LinkedIn/GitHub), and that he is open to work.
Reply with exactly one word — YES if the question can be answered from that info, NO if it cannot.
Do not write anything else.`;

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    const lastQuestion =
      [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

    const encoder = new TextEncoder();

    // ── Step 1: Classify (fast, non-streaming) ────────────────────
    // A few spare tokens in case the model thinks briefly before answering.
    // If classification itself fails, assume the bot can answer rather than
    // emailing Imran about every question.
    let canAnswer = true;
    try {
      const res = await gemini(apiKey, "generateContent", {
        systemInstruction: { parts: [{ text: CLASSIFY_SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: lastQuestion }] }],
        generationConfig: { temperature: 0, maxOutputTokens: 32 },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      const verdict = responseText((await res.json()) as GeminiResponse).trim().toUpperCase();
      if (verdict) canAnswer = verdict.startsWith("YES");
    } catch (err) {
      console.error("Gemini classify error:", err instanceof Error ? err.message : err);
    }

    // ── Step 2: Await email before streaming (ensures Vercel doesn't cut it off) ──
    if (!canAnswer) {
      const ip        = req.headers.get("x-forwarded-for")?.split(",")[0].trim()
                      ?? req.headers.get("x-real-ip")
                      ?? "unknown";
      const userAgent = req.headers.get("user-agent") ?? undefined;
      const timestamp = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka", hour12: true });

      await Promise.race([
        sendChatbotEmail({ question: lastQuestion, ip, userAgent, timestamp, history: messages }),
        new Promise<void>((resolve) => setTimeout(resolve, 8000)),
      ]).catch((e) => console.error("Chatbot email failed:", e));
    }

    // ── Step 3: Stream the answer ─────────────────────────────────
    const readable = new ReadableStream({
      async start(controller) {
        try {
          const res = await gemini(apiKey, "streamGenerateContent", {
            systemInstruction: { parts: [{ text: SYSTEM }] },
            contents: toGeminiContents(messages),
            generationConfig: { maxOutputTokens: 1024 },
          });
          if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}: ${await res.text()}`);

          // Server-sent events: each "data: {...}" line is one response chunk
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          const emit = (line: string) => {
            if (!line.startsWith("data:")) return;
            const text = responseText(JSON.parse(line.slice(5)) as GeminiResponse);
            if (text) controller.enqueue(encoder.encode(text));
          };
          let buffer = "";
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";
            lines.forEach(emit);
          }
          emit(buffer.trim());
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.error("Gemini stream error:", msg);
          controller.enqueue(encoder.encode("Sorry, I couldn't answer that right now. Please try again in a moment."));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return Response.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
