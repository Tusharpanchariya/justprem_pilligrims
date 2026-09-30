import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pilgrimage to Nepal",
  description: "A spiritual journey to the Himalayas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
