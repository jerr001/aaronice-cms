import { FeatureTab } from "@/types/featureTab";

const featuresTabData: FeatureTab[] = [
  {
    id: "tabOne",
    title: "Client: Exceeding University | Sector: Higher Education",
    desc1: `Aaronice Prime designed and deployed an all-in-one University Portal for Exceeding University, digitizing key academic and administrative processes. The platform includes LMS, CBT, attendance tracking, course registration, result processing, hostel & transport management, payments, and more. We also trained staff for seamless adoption.`,
    sub_title: "Impact:",
    list:[
         "Streamlined campus operations","24/7 student self-service","Improved accuracy & transparency","Supported 8,000+ users","Enhanced Exceeding University's digital-first positioning"
    ],

    image: "/images/features/portal.png",
    imageDark: "/images/features/portal.png",
  },
  {
    id: "tabTwo",
    title: "Client: FinSecAfrica — Nigerian FinTech Startup | Sector: Financial Technology",
    desc1: `We partnered with FinSecAfricaNG to architect a cloud-native microservices platform on AWS to support their new mobile payments app. We developed secure, scalable APIs, integrated advanced fraud detection using machine learning, and provided DevOps training for their internal team.`,
    desc2: ``,
    sub_title:"How It Benefited Them",
    list:[
       "Reduced application downtime by 99.9% uptime achieved", "Increased transaction processing capacity by 5x",
       "Accelerated time-to-market by 40% through CI/CD automation","Helped secure $1.2M in seed funding thanks to robust tech architecture"
    ],
    
    image: "/images/features/cloud.png",
    imageDark: "/images/features/cloud.png",
  },
  {
    id: "tabThree",
    title: "Client: Global HXGS Company  | Sector:  Consumer Goods / Global Business",
    desc1: `Aaronice Prime developed a Big Data and AI-powered analytics platform that processes multi-source retail data in real time (sales, customer behavior, supply chain, and marketing data). The platform generates predictive insights to optimize inventory, pricing, and marketing campaigns globally.`,
    desc2: ``,
     sub_title:"How It Benefited Them",
    list:["Improved demand forecasting accuracy by 35%","Reduced inventory waste by 22% globally",
         "Increased marketing ROI by 18% with AI-optimized targeting","Supported real-time decision-making across 50+ global markets"
    ],
   
    image: "/images/features/data.png",
    imageDark: "/images/features/data.png",
  },
];

export default featuresTabData;
