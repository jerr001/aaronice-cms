import React from "react";
import { FeatureTab } from "@/types/featureTab";
import Image from "next/image";

const FeaturesTabItem = ({ featureTab }: { featureTab: FeatureTab }) => {
  const { title, desc1, desc2, sub_title, list, image, imageDark } = featureTab;

  return (
    <div className="flex flex-col-reverse items-center gap-10 md:flex-row lg:gap-20">
      <div className="w-full md:w-1/2">
        <h3 className="mb-5 text-sm font-medium text-black dark:text-white">
          {title}
        </h3>
        <p className="text-body mb-4 text-base">{desc1}</p>
        <p className="text-body mb-4 w-11/12 text-base">{desc2}</p>
        <h4 className="mb-2 text-sm font-bold text-black dark:text-white">
          {sub_title}
        </h4>
        <ul className="text-body ml-5 list-disc text-base">
          {list.map((item, index) => (
            <li key={index} className="ml-2">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto hidden aspect-562/366 max-w-[550px] md:block md:w-1/2">
        <Image src={image} alt={title} fill className="dark:hidden" />
        <Image src={imageDark} alt={title} fill className="hidden dark:block" />
      </div>
    </div>
  );
};

export default FeaturesTabItem;
