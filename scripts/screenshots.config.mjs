/**
 * Which pages to screenshot for each project, and where to save them.
 *
 * Every shot overwrites the file at `file` (relative to the repo root), so the
 * paths used in src/data/projects.ts never change — only the pictures do.
 *
 * Shot options:
 *   path          page path on the live site (default "/")
 *   fullPage      capture the whole scrollable page (used for scroll previews)
 *   scrollToText  scroll until this visible text is `offset` px from the top
 *   offset        see scrollToText (default 80)
 *   scrollTo      "bottom" to capture the end of the page (e.g. the footer)
 *   waitForSelector  wait (up to 60s) for this element before capturing; if it
 *                 never appears the old image is kept — use it for pages whose
 *                 data loads slowly, so a loading skeleton is never saved
 *   changeThreshold  override the global threshold for a noisy shot
 *
 * Pages that need a login (dashboards, admin panels) can't be captured
 * automatically — keep those as manual images in projects.ts.
 */
const config = {
  // Days between automatic refreshes (checked by the GitHub Action)
  intervalDays: 1,

  // Only replace an image when at least this fraction of its pixels changed.
  // Re-capturing an unchanged site differs by 0–9% (sliders, lazy images);
  // a redesign typically changes well over 30%.
  changeThreshold: 0.15,

  viewport: { width: 1440, height: 900 },

  projects: [
    {
      slug: "tourguide",
      url: "https://tourguide-five.vercel.app",
      shots: [
        // The API is slow to wake up — wait for real tour/guide cards so a
        // loading skeleton never replaces a good screenshot
        { file: "public/tour/tour_main.jpg", path: "/", fullPage: true, waitForSelector: 'a[href^="/tours/"]' },
        { file: "public/tour/tour_explore.jpg", path: "/explore", fullPage: true, waitForSelector: 'a[href^="/tours/"]' },
        { file: "public/tour/tour_guides.jpg", path: "/guides", fullPage: true, waitForSelector: 'a[href^="/guides/"]' },
      ],
    },
    {
      slug: "parcel-delivery",
      url: "https://percel-delievey-app.vercel.app",
      shots: [
        { file: "public/percel/percel_main.jpg", path: "/", fullPage: true },
        { file: "public/percel/percel_about.jpg", path: "/about", fullPage: true },
        { file: "public/percel/percel_contact.jpg", path: "/contact", fullPage: true },
        { file: "public/percel/percel_location.jpg", path: "/location", fullPage: true },
      ],
    },
    {
      slug: "emart",
      url: "https://emart-frontend-main.vercel.app",
      shots: [
        { file: "public/emart/emart_main.jpg", path: "/", fullPage: true },
      ],
    },
    {
      slug: "rise-at-seven",
      url: "https://rise-at-seven-olive.vercel.app",
      shots: [
        { file: "public/rise/rise_main.jpg", path: "/" },
        { file: "public/rise/rise_clients.jpg", path: "/", scrollToText: "THE AGENCY BEHIND", offset: 65 },
        { file: "public/rise/rise_featured_work.jpg", path: "/", scrollToText: "FEATURED WORK", offset: 90 },
        { file: "public/rise/rise_services.jpg", path: "/", scrollToText: "View all Services", offset: 110 },
        { file: "public/rise/rise_pioneers.jpg", path: "/", scrollToText: "Legacy In The Making", offset: 110 },
        { file: "public/rise/rise_whats_new.jpg", path: "/", scrollToText: "Explore More Thoughts", offset: 115 },
        { file: "public/rise/rise_footer.jpg", path: "/", scrollTo: "bottom" },
      ],
    },
  ],
};

export default config;
