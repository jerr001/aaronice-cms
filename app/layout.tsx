/**
 * Root Layout
 * Initializes the application on startup
 */

import { initializeApp } from "@/lib/initialization";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Initialize app on server startup
initializeApp().catch(console.error);

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://aaronice.com",
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/logo/banner-light.png" />
        <link rel="canonical" href="https://aaronice.com" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body className={`dark:bg-black ${inter.className}`}>{children}</body>
    </html>
  );
}
