import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "JustPrem | Sacred Journeys, Pilgrimages & Himalayan Wisdom",
  description: "Journeys that take you closer to what matters. Immerse in sacred pilgrimages, devotional music, silence retreats, and authentic human connection across the Himalayas.",
  keywords: ["JustPrem", "Himalayan Pilgrimage", "Nepal Pilgrimage", "Bhakti Retreat", "Sacred Music", "Meditation", "Spiritual Travel"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-near-black text-ivory">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
