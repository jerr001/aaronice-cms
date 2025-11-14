import { Metadata } from "next";
import Hero from "@/components/Hero";
import Brands from "@/components/Brands";
import Feature from "@/components/Features";
import About from "@/components/About";
import FeaturesTab from "@/components/FeaturesTab";
import FunFact from "@/components/FunFact";
import Integration from "@/components/Integration";
import CTA from "@/components/CTA";
import FAQ from "@/components/FAQ";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Blog from "@/components/Blog";
import Testimonial from "@/components/Testimonial";
import Team from "@/components/Team";
import Courses from "@/components/Courses";

export const metadata: Metadata = {
  title: "Home - Premier AI & Tech Solutions Training in Nigeria",
  description:
    "Aaronice Prime offers AI automation, custom software development, digital transformation consulting, and professional tech training bootcamps in Nigeria. Learn Web Development, Data Analysis, UI/UX Design, Digital Marketing & more.",
  keywords:
    "AI automation Nigeria, software development Lagos, tech bootcamp, digital transformation, web development training, data analysis course, UI/UX design Nigeria, IT consulting, tech skills training",
  openGraph: {
    title: "Aaronice Prime | Premier AI & Tech Solutions Training",
    description:
      "Transform your business with AI automation and custom software solutions. Join our expert-led tech training bootcamps across Nigeria.",
    url: "https://aaronice.com",
    images: [
      {
        url: "/images/logo/logo-dark.svg",
        width: 1200,
        height: 630,
        alt: "Aaronice Prime - AI & Tech Solutions",
      },
    ],
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <div className="bg-gray-50 dark:bg-gray-900">
        <Brands />
      </div>
      <Feature />
      <div className="bg-orange-50 dark:bg-gray-900">
        <Courses />
      </div>
      <FeaturesTab />
      <div className="bg-gray-50 dark:bg-gray-900">
        <FunFact />
      </div>
      <Team />
      <div className="bg-orange-50 dark:bg-gray-900">
        <CTA />
      </div>
      <Testimonial />
      <div className="bg-gray-50 dark:bg-gray-900">
        <Contact />
      </div>
    </main>
  );
}
