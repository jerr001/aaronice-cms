import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ThemeProviderWrapper from "@/components/ThemeProviderWrapper";
import ScrollToTop from "@/components/ScrollToTop";
import StructuredData from "@/components/StructuredData";
import { Inter } from "next/font/google";
import Script from "next/script";
import "../globals.css";
import type { Metadata } from "next";
const inter = Inter({ subsets: ["latin"] });

import ToasterContext from "../context/ToastContext";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://aaronice.com",
  ),
  title: {
    default: "Aaronice Prime Global Company Ltd | AI & Tech Solutions Training",
    template: "%s | Aaronice Prime",
  },
  description:
    "Leading technology company specializing in AI automation, custom software development, digital transformation, and expert-led tech training. Empowering businesses and individuals across Nigeria and Africa.",
  keywords: [
    "Aaronice Prime Academy",
    "Aaroniceprime Academy",
    "Aaronice Prime Global Company Ltd",
    "digital skills",
    "tech skills",
    "technical and non-technical skills",
    "Education Technology Solutions",
    "Website Development Nigeria",
    "Software Development",
    "Technology Company in Nigeria",
    "School Portal Solutions",
    "Data Analysis Course Nigeria",
    "Website Training",
    "AI automation Nigeria",
    "software development Lagos",
    "tech training bootcamp",
    "digital transformation Africa",
    "web development courses",
    "data analysis training",
    "UI/UX design Nigeria",
    "IT consulting services",
    "custom software solutions",
    "tech skills training",
    "Aaronice Prime",
    "digital marketing courses",
    "project management training",
    "virtual assistant courses",
  ],
  authors: [{ name: "Aaronice Prime Global Company Ltd" }],
  creator: "Aaronice Prime Global Company Ltd",
  publisher: "Aaronice Prime Global Company Ltd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://aaronice.com",
    siteName: "Aaronice Prime Global Company Ltd",
    title: "Aaronice Prime | AI & Tech Solutions Training",
    description:
      "Leading technology company specializing in AI automation, custom software development, digital transformation, and expert-led tech training.",
    images: [
      {
        url: "/images/logo/logo-dark.svg",
        width: 1200,
        height: 630,
        alt: "Aaronice Prime Global Company Ltd",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aaronice Prime | AI & Tech Solutions Training",
    description:
      "Leading technology company specializing in AI automation, custom software development, and expert-led tech training.",
    site: "@aaronicepgcltd",
    creator: "@aaronicepgcltd",
    images: ["/images/logo/logo-dark.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add these after setting up in Google Search Console and Bing Webmaster Tools
    // google: 'your-google-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.ico" />
        <link rel="canonical" href="https://aaronice.com" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <Script
        src="https://checkout.flutterwave.com/v3.js"
        strategy="lazyOnload"
      />
      <body className={`dark:bg-black ${inter.className}`}>
        <StructuredData />
        <ThemeProviderWrapper>
          <Header />
          <ToasterContext />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
