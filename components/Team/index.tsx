"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";

const teams = [
  { position: "Founder",  name:"Aina John", image: "/images/teams/founder.jpg" },
  { position: "Project Manager", name:"Kushimo Oyinkansola", image: "/images/teams/project-manager.jpg" },
  { position: "Head of Operations", name:"Temitope Victor", image: "/images/teams/head-of-operations.jpg" },
  { position: "Chief Technical Officer", name:"Adewuyi Timilehin",  image: "/images/teams/chief-technical-officer.jpg" },
  { position: "Customer Service",  name:"Ibrahim Favour", image: "/images/teams/customer-service.jpg" },
];

const Team = () => {
  return (
    <section>
      <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
        <SectionHeader
          headerInfo={{
            title: `OUR TEAMS`,
            subtitle: `Collaborating to Deliver Value`,
            description: `Meet the core teams driving innovation, quality, and client success across our solutions.`,
          }}
        />
      </div>

      <div className="relative z-50 mx-auto mt-15 max-w-c-1154 px-4 md:px-8 xl:mt-20 xl:px-0">
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
              <div className="mx-auto mb-4 h-[100px] w-[100px] md:h-[120px] md:w-[120px] overflow-hidden rounded-full shadow-md">
                <Image
                  src={team.image}
                  alt={team.name}
                  width={120}
                  height={120}
                  className="object-cover"
                />
              </div>
              <h4 className="text-sm font-medium text-orange-400 dark:text-white">{team.name}</h4>
                  <h4 className="text-sm font-medium text-gray-800 dark:text-white">{team.position}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
