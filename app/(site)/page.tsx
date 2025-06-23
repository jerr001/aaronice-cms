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
  title: "Aaronice Prime Global Company Ltd - We lead the future of technology with intelligent software solutions and expert-led tech training—empowering individuals and corporate bodies to thrive in a digital-first world.",

  // other metadata
  description: "AI and Tech professionals, Tech Website, AI and automation solutions"
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Brands />
      <Feature />
      <Courses />
  
      <FeaturesTab />
      <FunFact />
      <Team />
       

      <CTA />

      <Testimonial />
      <Contact />
     
    </main>
  );
}
