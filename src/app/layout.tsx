import type { Metadata } from "next";
import { Poppins, Unbounded } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BackToTop } from "@/components/BackToTop";
import { VisitAlert } from "@/components/VisitAlert";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Imran | Full Stack Developer",
  description:
    "Portfolio of Imran — full stack developer building modern web applications with Next.js, React, and Node.js.",
  openGraph: {
    title: "Imran | Full Stack Developer",
    description:
      "Full stack developer portfolio — projects, skills, and contact.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${unbounded.variable} dark`} suppressHydrationWarning>
      <body className="min-h-screen antialiased" style={{ background: "#080808" }}>
        <ThemeProvider>
          {children}
          <BackToTop />
          <VisitAlert />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

