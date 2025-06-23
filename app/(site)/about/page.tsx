import SidebarLink from "@/components/Docs/SidebarLink";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aaronice Prime Global Company Ltd - We lead the future of technology with intelligent software solutions and expert-led tech training—empowering individuals and corporate bodies to thrive in a digital-first world.",

  // other metadata
  description: "AI and Tech professionals, Tech Website, AI and automation solutions"
};

export default function aboutPage() {
  return (
    <>
      <section className="pb-16 pt-24 md:pb-20 md:pt-28 lg:pb-24 lg:pt-32">
        <div className="container mx-auto">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4 lg:w-1/4">
              <div className="sticky top-[74px] rounded-lg border border-white p-4 shadow-solid-4  transition-all  dark:border-strokedark dark:bg-blacksection">
                <ul className="space-y-2">
                  <SidebarLink />
                </ul>
              </div>
            </div>

            <div className="w-full px-4 lg:w-3/4">
              <div className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-xs bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <h3 className="text-orange-400 dark:text-white" >About Aaronice Prime</h3>

                <p className="text-body-color dark:text-body-color-dark text-base">
                  Aaronice Prime Global Company Ltd was established with a clear vision—to provide intelligent technology solutions to real-world challenges and cultivate the next generation of tech professionals. Backed by a team of seasoned experts with decades of industry experience, we have successfully delivered innovative digital products across key sectors including education, healthcare, agriculture, and retail.
                   Through our dedicated training division, Aaronice Academy, we bridge the gap between knowledge and application by equipping individuals with practical, in-demand tech skills tailored to today’s dynamic digital landscape.
                </p>
              </div>
               <div id="vision" className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-xs bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <h3 className="text-orange-400 dark:text-white">Our Vision</h3>

                <p className="text-body-color dark:text-body-color-dark text-base">
                  Become a global catalyst empowering 500,000 AI and Tech professionals while creating Tech driven solutions that uplift and improve the lives of 1 million people.
                </p>

              </div>

               <div id="mission" className="blog-details blog-details-docs shadow-three dark:bg-gray-dark rounded-xs bg-white px-8 py-11 sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]">
                <h3  className="text-orange-400 dark:text-white" >Our Mission</h3>

                <p className="text-body-color dark:text-body-color-dark text-base">
                    To lead as a technology Company by developing cutting-edge software solutions and cultivating top-tier talent—leveraging global standards to power intelligent systems, drive innovation, and transforming industries. Training global innovators in tech skills with latest innovative experience led by experts in each field.
                </p>

              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
