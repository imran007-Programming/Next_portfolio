export type Project = {
  title: string;
  description: string;
  tech: string[];
  image: string;
  liveUrl: string;
  repoUrl?: string;
};

export const projects: Project[] = [
  {
    title: "TourGuide",
    description:
      "A travel marketplace that connects travelers with verified local guides. Includes destination search, tour categories, VIP packages, guide onboarding, testimonials, FAQs, and a dashboard-style booking overview.",
    tech: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    image: "/projects/tourguide.jpg",
    liveUrl: "https://tourguide-five.vercel.app/",
  },
  {
    title: "Quran Mazid",
    description:
      "A full-featured Quran reader with all 114 surahs and 6,236 ayahs. Browse by surah, juz, or page; listen to multiple reciters; customize Arabic fonts and sizes; bookmark ayahs; and jump to any verse instantly.",
    tech: ["React", "TypeScript", "Vite", "Audio API"],
    image: "/projects/quran-mazid.jpg",
    liveUrl: "https://quranmazid-eta.vercel.app/",
  },
  {
    title: "Rise at Seven",
    description:
      "A high-fidelity clone of a global SEO and content marketing agency site. Showcases featured client work, service offerings, international offices, awards, blog posts, and animated hero sections with a polished brand experience.",
    tech: ["Next.js", "React", "Framer Motion", "Tailwind CSS"],
    image: "/projects/rise-at-seven.jpg",
    liveUrl: "https://rise-at-seven-olive.vercel.app/",
  },
  {
    title: "eMart",
    description:
      "An e-commerce storefront frontend for online shopping — product browsing, cart flows, and a responsive retail UI built for modern consumers on desktop and mobile.",
    tech: ["React", "JavaScript", "CSS", "Vercel"],
    image: "/projects/emart.jpg",
    liveUrl: "https://emart-frontend-main.vercel.app/",
  },
  {
    title: "Parcel Delivery App",
    description:
      "A parcel delivery tracking application built with Vite and React. Helps users manage shipments, follow delivery status, and interact with a clean logistics-focused interface.",
    tech: ["React", "TypeScript", "Vite", "Tailwind CSS"],
    image: "/projects/parcel-delivery.jpg",
    liveUrl: "https://percel-delievey-app.vercel.app/",
  },
];
