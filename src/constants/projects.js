import otaImg from "../assets/images/OTA_website.jpg";
import tourImg from "../assets/images/TourOperator_website.jpg";
import blsImg from "../assets/images/BLS_website.jpg";
import golfImg from "../assets/images/Golf_website.jpg";
import bpdImg from "../assets/images/BPDPortal_website.jpg";
import aiImg from "../assets/images/AI_website.png";
import aiThumbnail from "../assets/images/ai_thumbnail.jpg";
import analyticsImg from "../assets/images/analytics(4).jpg";
import analyticsThumbnail from "../assets/images/analytics (1).jpg";
import analyticsScreenshot2 from "../assets/images/analytics (2).jpg";
import analyticsScreenshot3 from "../assets/images/analytics (3).jpg";

export const PROJECTS = [
  {
    title: "Delightful Analytics",
    category: "Analytics & Data",
    year: "2025",
    img: analyticsImg,
    thumbnail: analyticsThumbnail,
    size: "large",
    description: "A comprehensive analytics platform designed to track and visualize performance metrics for Delightful.ph and ai.delightful.ph, providing real-time insights and data-driven decision making.",
    purpose: "To centralize analytics data from multiple sources including Google Analytics, n8n workflows, and SerpAPI, enabling comprehensive performance tracking and business intelligence for the Delightful ecosystem.",
    stack: ["Next.js", "TypeScript", "Google Analytics API", "n8n", "SerpAPI", "Recharts", "TailwindCSS"],
    link: "https://analytics.delightful.ph/",
    screenshots: [
      analyticsImg,
      analyticsThumbnail,
      analyticsScreenshot2,
      analyticsScreenshot3
    ]
  },
  {
    title: "Online Travel Agency Website",
    category: "Travel & Booking",
    year: "2025",
    img: otaImg,
    size: "small",
    description: "A comprehensive Online Travel Agency platform for the Philippines, featuring seamless booking experiences and curated local destinations.",
    purpose: "To perform efficient booking of flights, hotels, and tours tailored for the Philippine market, simplifying the travel experience for locals and tourists.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Redux", "Stripe API"],
    link: "#"
  },
  {
    title: "Tour Operator System",
    category: "Enterprise Management",
    year: "2024",
    img: tourImg,
    size: "small",
    description: "A robust backend system for tour operators to manage itineraries, bookings, and customer data efficiently.",
    purpose: "To streamline local tour operations, automate booking confirmations, and manage complex itinerary logistics in real-time.",
    stack: ["Vue.js", "Laravel", "MySQL", "Docker", "AWS S3"],
    link: "#"
  },
  {
    title: "Brigada Learning System",
    category: "Educational Tech",
    year: "2024",
    img: blsImg,
    size: "small",
    description: "An interactive Learning Management System (LMS) designed to streamline educational content delivery and student progress tracking.",
    purpose: "To provide a scalable platform for remote learning, enabling educators to create courses and track student performance with analytics.",
    stack: ["CodeIgniter", "MySQL", "jQuery", "Bootstrap", "Chart.js"],
    link: "#"
  },
  {
    title: "AI Travel Companion",
    category: "AI & Automation",
    year: "2025",
    img: aiImg,
    thumbnail: aiThumbnail,
    size: "small",
    description: "An intelligent AI-powered travel companion that assists users with itinerary planning, real-time suggestions, and travel tips.",
    purpose: "To act as a 24/7 personal travel assistant that leverages generative AI to create personalized trip plans and answer travel queries instantly.",
    stack: ["n8n", "OpenAI API", "Python", "FastAPI", "React Native"],
    link: "#"
  },
  {
    title: "Golf Range & Admin System",
    category: "Reservation Platform",
    year: "2024",
    img: golfImg,
    size: "large",
    description: "A clear-cut reservation and administration platform for golf ranges, handling scheduling, memberships, and operational metrics.",
    purpose: "To replace manual booking logs with a digital system that handles tee time reservations, member profiles, and daily revenue reporting.",
    stack: ["React", "Express.js", "PostgreSQL", "TailwindCSS", "Socket.io"],
    link: "#"
  },
  {
    title: "BPD Systems Portal",
    category: "Internal Enterprise Tool",
    year: "2024",
    img: bpdImg,
    size: "small",
    description: "The Brigada Process Department (BPD) Systems Portal—a centralized hub for managing internal company workflows and systems.",
    purpose: "To unify disparate internal tools into a single dashboard, improving employee productivity and system access governance.",
    stack: ["Next.js", "TypeScript", "Supabase", "Prisma", "Vercel"],
    link: "#"
  }
];
