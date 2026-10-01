/**
 * Which pages to screenshot for each project, and where to save them.
 *
 * Every shot overwrites the file at `file` (relative to the repo root), so the
 * paths used in src/data/projects.ts never change — only the pictures do.
 *
 * Shot options:
 *   path          page path on the live site (default "/")
 *   fullPage      capture the whole scrollable page (used for scroll previews)
 *   stitch        like fullPage, but scrolls screen by screen and joins the
 *                 views — use for sites with scroll-driven/pinned sections
 *                 that come out blank in a normal fullPage capture
 *   scrollToText  scroll until this visible text is `offset` px from the top
 *   offset        see scrollToText (default 80)
 *   scrollTo      "bottom" to capture the end of the page (e.g. the footer)
 *   waitForSelector  wait (up to 60s) for this element before capturing; if it
 *                 never appears the old image is kept — use it for pages whose
 *                 data loads slowly, so a loading skeleton is never saved
 *   changeThreshold  override the global threshold for a noisy shot
 *   steps         UI steps before capturing: { click: "Exact button text" },
 *                 { waitForURL: "**\/path" }, { wait: ms }
 *   login         true = capture with the project's logged-in session
 *                 (see the project's `login.steps`)
 *   mask          { text: "regex", selectors: ["css"] } — black out private
 *                 details (phone numbers, messages) before capturing
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
        // Featured Work is a pinned, scroll-driven section — stitch instead of fullPage
        { file: "public/rise/rise_full.jpg", path: "/", stitch: true },
        { file: "public/rise/rise_clients.jpg", path: "/", scrollToText: "THE AGENCY BEHIND", offset: 65 },
        { file: "public/rise/rise_featured_work.jpg", path: "/", scrollToText: "FEATURED WORK", offset: 90 },
        { file: "public/rise/rise_services.jpg", path: "/", scrollToText: "View all Services", offset: 110 },
        { file: "public/rise/rise_pioneers.jpg", path: "/", scrollToText: "Legacy In The Making", offset: 110 },
        { file: "public/rise/rise_whats_new.jpg", path: "/", scrollToText: "Explore More Thoughts", offset: 115 },
        { file: "public/rise/rise_footer.jpg", path: "/", scrollTo: "bottom" },
      ],
    },
    {
      slug: "tradeslot",
      url: "https://trade-slot.vercel.app",
      // The site shows a public demo trader account with an "Auto Fill"
      // button, so no password is stored here.
      login: {
        path: "/",
        steps: [
          { click: "Trader Portal" },
          { click: "Auto Fill" },
          { click: "Sign In to Dashboard" },
          { waitForURL: "**/dashboard**" },
        ],
      },
      shots: [
        // The hero is an auto-playing image slider, so allow for its noise
        { file: "public/tradeslot/tradeslot_main.jpg", path: "/", fullPage: true, changeThreshold: 0.25 },
        { file: "public/tradeslot/tradeslot_services.jpg", path: "/", scrollToText: "Popular Home Services & Trade Categories", offset: 110 },
        { file: "public/tradeslot/tradeslot_how_it_works.jpg", path: "/", scrollToText: "How TradeSlot Intelligent Booking Works", offset: 110 },
        { file: "public/tradeslot/tradeslot_buffer.jpg", path: "/", scrollToText: "Changes Everything", offset: 160 },
        { file: "public/tradeslot/tradeslot_faq.jpg", path: "/", scrollToText: "Frequently Asked Questions", offset: 110 },
        { file: "public/tradeslot/tradeslot_chat.jpg", path: "/", steps: [{ click: "Book a Service" }, { wait: 1500 }], changeThreshold: 0.6 },

        // Trader dashboard — real customers' phone numbers and chat messages
        // are blacked out; the backend is slow to wake, so wait for the stats bar.
        ...["messages", "bookings", "customers", "workareas"].map((page) => ({
          file: `public/tradeslot/tradeslot_dashboard_${page}.jpg`,
          path: `/dashboard/${page}`,
          login: true,
          waitForSelector: "text=Total Customers",
          mask: { text: String.raw`\+?\d[\d\s-]{8,}\d`, selectors: ["p.whitespace-pre-wrap"] },
        })),
      ],
    },
  ],
};

export default config;
