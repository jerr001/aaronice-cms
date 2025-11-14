"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";

const teams = [
  {
    position: "Chief Executive Officer",
    name: "Aina John",
    image: "/images/teams/founder.jpg",
  },
  {
    position: "Project Manager",
    name: "Kushimo Oyindamola",
    image: "/images/teams/project-manager.jpg",
  },
  {
    position: "Head of Operations",
    name: "Temitope Victor",
    image: "/images/teams/head-of-operations.jpg",
  },
  {
    position: "Fullstack Developer",
    name: "Jeremiah Obembe",
    image: "/images/teams/chief-technical-officer.jpg",
  },
  {
    position: "Customer Service",
    name: "Ibrahim Favour",
    image: "/images/teams/customer-service.jpg",
  },
];

const Team = () => {
  return (
    <section className="relative bg-white py-20 lg:py-25 xl:py-30 dark:bg-black">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 h-64 w-64 rounded-full bg-orange-100 opacity-20 mix-blend-multiply blur-3xl filter dark:opacity-5"></div>
      <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-orange-50 opacity-30 mix-blend-multiply blur-3xl filter dark:opacity-5"></div>

      <div className="max-w-c-1390 mx-auto px-4 md:px-8 2xl:px-0">
        <SectionHeader
          headerInfo={{
            title: `OUR TEAM`,
            subtitle: `Collaborating to Deliver Value`,
            description: `Meet the core team driving innovation, quality, and client success across our solutions.`,
          }}
        />
      </div>

      <div className="max-w-c-1154 relative z-50 mx-auto mt-15 px-4 md:px-8 xl:mt-20 xl:px-0">
        <div className="flex flex-wrap justify-around gap-y-12 text-center">
          {teams.map((team, index) => (
            <motion.div
              key={team.name}
              variants={{
                hidden: { opacity: 0, y: -20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="w-[140px] md:w-[160px]"
            >
              <div className="mx-auto mb-4 h-[100px] w-[100px] overflow-hidden rounded-full shadow-md md:h-[120px] md:w-[120px]">
                <Image
                  src={team.image}
                  alt={team.name}
                  width={120}
                  height={120}
                  className={`h-full w-full object-cover ${
                    team.name === "Kushimo Oyindamola"
                      ? "scale-150"
                      : team.name === "Temitope Victor" ||
                        team.name === "Jeremiah Obembe"
                      ? "scale-110"
                      : ""
                  }`}
                  style={
                    team.name === "Kushimo Oyindamola"
                      ? { objectPosition: "center 30%" }
                      : team.name === "Temitope Victor"
                      ? { objectPosition: "center 20%" }
                      : team.name === "Jeremiah Obembe"
                      ? { objectPosition: "center 15%" }
                      : {}
                  }
                />
              </div>
              <h4 className="text-sm font-medium text-orange-400 dark:text-white">
                {team.name}
              </h4>
              <h4 className="text-sm font-medium text-gray-800 dark:text-white">
                {team.position}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
