import type { Metadata } from "next";
import { Space_Grotesk, Archivo_Black, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BackToTop } from "@/components/BackToTop";
import { VisitAlert } from "@/components/VisitAlert";
import { GradientBackground } from "@/components/GradientBackground";
import "./globals.css";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const archivo = Archivo_Black({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-spacemono",
  subsets: ["latin"],
  weight: ["400", "700"],
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
    <html lang="en" className={`${grotesk.variable} ${archivo.variable} ${spaceMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <GradientBackground />
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
