"use client";
import Image from "next/image";
import { useState } from "react";

const Hero = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <section className="overflow-hidden pb-20 pt-35 md:pt-40 xl:pb-25 xl:pt-46">
      <div className="mx-auto max-w-c-1390 px-6 sm:px-8 md:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col-reverse items-center gap-10 md:flex-row lg:gap-14 xl:gap-20">
          {/* Left content */}
          <div className="w-full md:w-1/2">
            <h5 className="mb-4.5 text-sm font-medium text-black dark:text-white">
              Driving Innovation, Empowering Talents
            </h5>
            <p className="text-base text-body">
              We lead the future of technology with intelligent software
              solutions and expert-led tech training, empowering individuals and
              corporate bodies to thrive in a digital-first world.
            </p>
          </div>

          {/* Right image */}
          <div className="w-full md:w-1/2">
            <div className="relative mx-auto w-full max-w-[550px] sm:max-w-[400px] md:max-w-full aspect-[700/444]">
              {/* Background Shapes */}
              <Image
                src="/images/shape/shape-01.png"
                alt="shape"
                width={46}
                height={246}
                className="absolute -left-10 top-0 z-0 hidden md:block"
              />
              <Image
                src="/images/shape/shape-02.svg"
                alt="shape"
                width={36.9}
                height={36.7}
                className="absolute bottom-0 right-0 z-10"
              />
              <Image
                src="/images/shape/shape-03.svg"
                alt="shape"
                width={21.64}
                height={21.66}
                className="absolute -right-6 bottom-0 z-0"
              />

              {/* Hero Images */}
              <Image
                className="rounded-md shadow-solid-l dark:hidden object-cover"
                src="/images/hero/hero-light.jpg"
                alt="Hero"
                fill
              />
              <Image
                className="hidden rounded-md shadow-solid-l dark:block object-cover"
                src="/images/hero/hero-dark.jpg"
                alt="Hero"
                fill
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
