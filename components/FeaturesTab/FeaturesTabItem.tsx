import React from "react";
import { FeatureTab } from "@/types/featureTab";
import Image from "next/image";

const FeaturesTabItem = ({ featureTab }: { featureTab: FeatureTab }) => {
  const { title, desc1, desc2, sub_title, list, image, imageDark } = featureTab;

  return (
    <>
      <div className="flex items-center gap-8 lg:gap-19">
        <div className="md:w-1/2">
          <h3 className="mb-7 text-md font-bold text-black dark:text-white xl:text-sectiontitle2">
            {title}
          </h3>
          <p className="mb-5">{desc1}</p>
          <p className="w-11/12">{desc2}</p>
          <h3 className="mb-3 text-sm font-bold text-black dark:text-white xl:text-sectiontitle2">
            {sub_title}
          </h3>
           <ul  className="mb-10 list-disc" >
             {
               list.map((mylist, key) => (
                <li  key={key}  className="ml-5" > {mylist}</li>

               ))
             }

           </ul>

        </div>
        <div className="relative mx-auto hidden aspect-562/366 max-w-[550px] md:block md:w-1/2">
          <Image src={image} alt={title} fill className="dark:hidden" />
          <Image
            src={imageDark}
            alt={title}
            fill
            className="hidden dark:block"
          />
        </div>
      </div>
    </>
  );
};

export default FeaturesTabItem;
