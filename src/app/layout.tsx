import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MusicPlayer } from "@/components/MusicPlayer";
import { VisitAlert } from "@/components/VisitAlert";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    <html lang="en" className={poppins.variable} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          {children}
          <MusicPlayer />
          <VisitAlert />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
