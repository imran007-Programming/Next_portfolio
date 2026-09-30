import screenshotFiles from "./screenshots.json";

export type ProjectDetails = {
  role: string;
  year: string;
  highlights: string[];
};

export type ProjectMetric = {
  value: string;
  label: string;
};

export type Project = {
  title: string;
  slug: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl: string;
  repoUrl?: string;
  scrollPreview?: boolean;
  gallery?: string[];
  details?: ProjectDetails;
  metrics?: ProjectMetric[];
};

/**
 * Auto-captured screenshots are stored under content-hashed names
 * (e.g. /tour/tour_main.3f2a9c1b.jpg) so a refreshed image always gets a new
 * URL and no cache serves the old one. screenshots.json is written by
 * scripts/capture-screenshots.mjs; paths not in it are used as-is.
 */
const versioned: Record<string, string> = screenshotFiles;
const resolveImage = (src: string) => versioned[src] ?? src;

const projectList: Project[] = [
  {
    title: "TourGuide",
    slug: "tourguide",
    description:
      "A full-stack travel marketplace that connects travelers with verified local guides across 50+ destinations. Features advanced destination search with category and location filters, VIP package booking, guide onboarding with profile and availability management, a testimonial and review system, and a comprehensive dashboard-style booking overview. Built with a PostgreSQL database using Prisma ORM for type-safe queries and a REST API powered by Node.js & Express.",
    tech: ["Next.js", "React", "Tailwind CSS", "Node.js", "Express", "Prisma", "PostgreSQL", "Vercel"],
    image: "/tour/tour_main.jpg",
    scrollPreview: true,
    liveUrl: "https://tourguide-five.vercel.app/",
    repoUrl: "https://github.com/imran007-Programming/Local_tour_Guide_frontend",
    details: {
      role: "Full Stack Developer",
      year: "2025",
      highlights: [
        "Destination search with filters by category and location",
        "Guide onboarding flow with profile and availability management",
        "VIP package booking with dashboard-style overview",
        "Tour category browsing with testimonials and review system",
        "PostgreSQL database with Prisma ORM for type-safe queries",
        "REST API built with Node.js & Express for all booking operations",
      ],
    },
    gallery: [
      "/tour/tour_main.jpg",
      "/tour/tour_explore.jpg",
      "/tour/tour_guides.jpg",
      "/tour/tourguide-five.vercel.app_dashboard.png",
      "/tour/tourguide-five.vercel.app_dashboard (1).png",
      "/tour/tourguide-five.vercel.app_dashboard (2).png",
      "/tour/tourguide-five.vercel.app_dashboard (3).png",
      "/tour/tourguide-five.vercel.app_dashboard (4).png",
      "/tour/tourguide-five.vercel.app_dashboard (5).png",
      "/tour/tourguide-five.vercel.app_dashboard (6).png",
      "/tour/tourguide-five.vercel.app_dashboard (7).png",
      "/tour/tourguide-five.vercel.app_dashboard (8).png",
    ],
    metrics: [
      { value: "50+", label: "Destinations" },
      { value: "15+", label: "API Endpoints" },
      { value: "98", label: "Lighthouse" },
    ],
  },
  {
    title: "Parcel Delivery App",
    slug: "parcel-delivery",
    description:
      "A full-stack parcel delivery tracking platform that enables users to create, manage, and monitor shipments in real time. Features role-based access with separate admin and user dashboards, live delivery status updates, analytics charts for shipment volume and performance, and a location tracking interface. The backend is powered by an Express REST API with MongoDB for flexible data modelling, while the frontend uses TypeScript and Vite for a fast, type-safe developer experience.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Mongoose"],
    image: "/percel/percel_main.jpg",
    scrollPreview: true,
    liveUrl: "https://percel-delievey-app.vercel.app/",
    repoUrl: "https://github.com/imran007-Programming/PERCEL_DELIVERY_APP",
    details: {
      role: "Full Stack Developer",
      year: "2025",
      highlights: [
        "Real-time shipment tracking with live delivery status updates",
        "MongoDB & Mongoose for flexible parcel and user data modelling",
        "Express REST API handling all shipment CRUD operations",
        "User dashboard for creating and managing multiple parcels",
        "TypeScript throughout for type-safe frontend and backend code",
        "Clean logistics-focused UI built with Tailwind CSS & Vite",
      ],
    },
    gallery: [
      "/percel/percel_main.jpg",
      "/percel/percel-delievey-app.vercel.app_admin_analytics.png",
      "/percel/percel-delievey-app.vercel.app_admin_analytics (1).png",
      "/percel/percel-delievey-app.vercel.app_admin_analytics (2).png",
      "/percel/percel-delievey-app.vercel.app_admin_analytics (3).png",
      "/percel/percel_about.jpg",
      "/percel/percel_contact.jpg",
      "/percel/percel_location.jpg",
    ],
    metrics: [
      { value: "500+", label: "Shipments Tracked" },
      { value: "Real-time", label: "Status Updates" },
      { value: "12", label: "REST Endpoints" },
    ],
  },
  {
    title: "eMart",
    slug: "emart",
    description:
      "A complete e-commerce storefront built on the MERN stack, featuring product browsing with category filters and keyword search, a fully functional shopping cart with quantity controls, detailed product pages with image galleries and related item suggestions, and a clean checkout flow with order summary. The responsive retail UI is optimised for both desktop and mobile, delivering sub-2-second load times and a smooth shopping experience.",
    tech: ["React", "JavaScript", "CSS", "Node.js", "Vercel"],
    image: "/emart/emart_main.jpg",
    scrollPreview: true,
    liveUrl: "https://emart-frontend-main.vercel.app/",
    repoUrl: "https://github.com/imran007-Programming/Mern_Stack_Ecommerce_Project",
    details: {
      role: "Frontend Developer",
      year: "2024",
      highlights: [
        "Product browsing with category filters and keyword search",
        "Shopping cart with add, remove, and quantity controls",
        "Product detail pages with image gallery and related items",
        "Responsive retail UI optimised for desktop and mobile",
        "Clean checkout flow with order summary UI",
      ],
    },
    metrics: [
      { value: "200+", label: "Products Listed" },
      { value: "95", label: "Performance Score" },
      { value: "<2s", label: "Load Time" },
    ],
  },
  {
    title: "Rise at Seven",
    slug: "rise-at-seven",
    description:
      "A pixel-perfect, high-fidelity clone of Rise at Seven — a global SEO and content marketing agency. Recreates their polished brand experience with 15+ animated hero sections and page transitions powered by Framer Motion, editorial card layouts showcasing featured client work, service offering pages, international office locations, award listings, and a blog section. Fully responsive across all devices with custom typography, smooth 60fps animations, and a 99 Lighthouse performance score.",
    tech: ["Next.js", "React", "Framer Motion", "Tailwind CSS", "Node.js"],
    image: "/rise/rise_main.jpg",
    liveUrl: "https://rise-at-seven-olive.vercel.app/",
    repoUrl: "https://github.com/imran007-Programming/Rise_at_seven",
    gallery: [
      "/rise/rise_main.jpg",
      "/rise/rise_clients.jpg",
      "/rise/rise_featured_work.jpg",
      "/rise/rise_services.jpg",
      "/rise/rise_pioneers.jpg",
      "/rise/rise_whats_new.jpg",
      "/rise/rise_footer.jpg",
    ],
    details: {
      role: "Frontend Developer",
      year: "2025",
      highlights: [
        "Pixel-perfect clone of a global SEO & content marketing agency",
        "Animated hero sections and page transitions with Framer Motion",
        "Featured client work showcase with editorial card layouts",
        "International offices, awards, and blog post listings",
        "Fully responsive across all screen sizes and devices",
        "Polished brand experience with custom typography and spacing",
      ],
    },
    metrics: [
      { value: "15+", label: "Animated Sections" },
      { value: "99", label: "Lighthouse Score" },
      { value: "60fps", label: "Animations" },
    ],
  },
];

export const projects: Project[] = projectList.map((p) => ({
  ...p,
  image: resolveImage(p.image),
  gallery: p.gallery?.map(resolveImage),
}));
