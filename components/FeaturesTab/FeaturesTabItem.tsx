import React from "react";
import { FeatureTab } from "@/types/featureTab";
import Image from "next/image";

const FeaturesTabItem = ({ featureTab }: { featureTab: FeatureTab }) => {
  const { title, desc1, desc2, sub_title, list, image, imageDark } = featureTab;

  return (
    <>
      <div className="flex items-center gap-8 lg:gap-19">
        <div className="md:w-1/2 px-4 md:px-8">
          <h3 className="pb-5 pt-3 mb-7 text-sm font-medium text-black dark:text-white ">
            {title}
          </h3>
          <p className="pb-5 pt-1 ml-7">{desc1}</p>
          <p className="pb-5 pt-1 ml-7 w-11/12">{desc2}</p>
          <h3 className="ml-7 text-sm font-bold text-black dark:text-white xl:text-sectiontitle2">
            {sub_title}
          </h3>
           <ul  className="ml-7 list-disc" >
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
