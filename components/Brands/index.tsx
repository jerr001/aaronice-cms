"use client";
import SectionHeader from "../Common/SectionHeader";

import { Autoplay, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

import { motion } from "framer-motion";
import SingleBrand from "./SingleBrand";
import brandData from "./brandData";

const BrandSlider = () => (
  <>
    <section className="border-y-stroke bg-alabaster dark:border-y-strokedark border border-x-0 py-8 dark:bg-black">
      <div className="max-w-c-1315 mx-auto px-4 md:px-8 xl:px-0">
        <div className="animate_top mx-auto text-center">
          <SectionHeader
            headerInfo={{
              title: `OUR CLIENTS`,
              subtitle: ``,
              description: ``,
            }}
          />
        </div>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true }}
        className="animate_top max-w-c-1390 mx-auto mt-10 px-4 md:px-8 xl:mt-15 xl:px-0"
      >
        <div className="swiper brand-slider mb-8 pb-4">
          <div className="relative pb-10">
            <Swiper
              spaceBetween={30}
              autoplay={{ delay: 2000, disableOnInteraction: false }}
              //pagination={{ clickable: true }}
              modules={[Autoplay, Pagination]}
              loop={true}
              slidesPerView={2} // Default for mobile
              breakpoints={{
                0: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
            >
              {brandData.map((brand, idx) => (
                <SwiperSlide
                  key={idx}
                  className="flex items-center justify-center"
                >
                  <SingleBrand brand={brand} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </motion.div>
    </section>
  </>
);

export default BrandSlider;

// "use client";
// import "keen-slider/keen-slider.min.css";
// import { useKeenSlider } from "keen-slider/react";

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/autoplay";
// import { Autoplay } from "swiper/modules";

// import React from "react";
// import SingleBrand from "./SingleBrand";
// import brandData from "./brandData";
// import SectionHeader from "../Common/SectionHeader";

// const BrandSlider = () => {
//   const [sliderRef] = useKeenSlider<HTMLDivElement>({
//     loop: true,
//     breakpoints: {
//       "(min-width: 768px)": {
//         slides: { perView: 3, spacing: 15 },
//       },
//       "(min-width: 1024px)": {
//         slides: { perView: 5, spacing: 30 },
//       },
//     },
//     slides: { perView: 2, spacing: 10 },
//   });

//   return (
//     <section className="border border-x-0 border-y-stroke bg-alabaster py-5 dark:border-y-strokedark dark:bg-black">
//       <SectionHeader
//         headerInfo={{
//           title: "OUR CLIENTS",
//           subtitle: "",
//           description: ``,
//         }}
//       />

//       <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
//         <div ref={sliderRef} className="keen-slider">
//           {brandData.map((brand, index) => (
//             <div key={index} className="keen-slider__slide">
//               <SingleBrand brand={brand} />
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default BrandSlider;

// const Brands = () => {
//   return (
//     <>
//       {/* <!-- ===== Clients Start ===== --> */}
//       <section className="border border-x-0 border-y-stroke bg-alabaster py-5 dark:border-y-strokedark dark:bg-black">

//            <SectionHeader
//                      headerInfo={{
//                        title: "OUR CLIENTS",
//                        subtitle: "",
//                        description: ``,
//                      }}
//                    />
//         <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
//           <div className="grid grid-cols-3 items-center justify-center gap-7.5 md:grid-cols-6 lg:gap-12.5 xl:gap-29">
//             {brandData.map((brand, key) => (
//               <SingleBrand brand={brand} key={key} />
//             ))}
//           </div>
//         </div>
//       </section>
//       {/* <!-- ===== Clients End ===== --> */}
//     </>
//   );
// };

// export default Brands;
