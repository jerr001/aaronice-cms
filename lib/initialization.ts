/**
 * App Initialization
 * This module initializes the database and runs migrations on app startup
 */

import { initializeDatabase } from "@/lib/db/migrations";
import { getDatabase } from "@/lib/db/index";
import {
  getTestimonialsStorage,
  waitForTestimonialsStoreReady,
} from "@/lib/testimonials-storage";
import {
  getTeamMembersStorage,
  waitForTeamMembersStoreReady,
} from "@/lib/team-members-storage";
import {
  getCoursesStorage,
  waitForCoursesStoreReady,
} from "@/lib/courses-storage";
import { testimonialData } from "@/components/Testimonial/testimonialData";
import coursesData from "@/components/Courses/coursesData";

let initialized = false;

export async function initializeApp() {
  if (initialized) return;

  try {
    console.log("🚀 Initializing Aaronice application...");

    // Initialize database (create indexes, seed default admin)
    const db = await getDatabase();
    await initializeDatabase(db);

    // Wait for storage systems to be ready
    await waitForTestimonialsStoreReady();
    await waitForTeamMembersStoreReady();
    await waitForCoursesStoreReady();

    // Seed original testimonials from static data
    const testimonialStorage = getTestimonialsStorage();
    if (
      testimonialStorage.getAll().length === 0 &&
      testimonialData.length > 0
    ) {
      const mappedTestimonials = testimonialData.map((t) => ({
        id: `testimonial-${t.id}`,
        author: t.name,
        role: t.designation.split(",")[0] || "Professional",
        company: t.designation.includes(",")
          ? t.designation.split(",").pop()?.trim()
          : "",
        content: t.content,
        image: null as any,
        featured: false,
        createdAt: new Date().toISOString(),
      }));

      for (const testimonial of mappedTestimonials) {
        testimonialStorage.add(testimonial);
      }

      console.log(
        `✅ Seeded ${mappedTestimonials.length} original testimonials`,
      );
    }

    // Seed original team members
    const teamStorage = getTeamMembersStorage();
    if (teamStorage.getAll().length === 0) {
      const defaultTeamMembers = [
        {
          id: "team-1",
          name: "Aina John",
          title: "Chief Executive Officer",
          bio: "Visionary leader driving innovation and strategic growth at Aaronice Prime Global Company Ltd",
          image: "/images/teams/founder.jpg",
          email: "aina@aaronice.com",
          phone: "+234 801 234 5678",
          twitter: "https://twitter.com/ainajohn",
          linkedin: "https://linkedin.com/in/ainajohn",
          createdAt: new Date().toISOString(),
        },
        {
          id: "team-2",
          name: "Kushimo Oyindamola",
          title: "Project Manager",
          bio: "Expert project manager ensuring timely delivery and excellence in all our initiatives",
          image: "/images/teams/project-manager.jpg",
          email: "kushimo@aaronice.com",
          phone: "+234 801 234 5679",
          twitter: "https://twitter.com/kushimo",
          linkedin: "https://linkedin.com/in/kushimooyin",
          createdAt: new Date().toISOString(),
        },
        {
          id: "team-3",
          name: "Temitope Victor",
          title: "Head of Operations",
          bio: "Operations leader optimizing processes and ensuring seamless business execution",
          image: "/images/teams/head-of-operations.jpg",
          email: "temitope@aaronice.com",
          phone: "+234 801 234 5680",
          twitter: "https://twitter.com/temitope",
          linkedin: "https://linkedin.com/in/temitope",
          createdAt: new Date().toISOString(),
        },
        {
          id: "team-4",
          name: "Jeremiah Obembe",
          title: "Fullstack Developer",
          bio: "Passionate fullstack developer building robust and scalable solutions",
          image: "/images/teams/chief-technical-officer.jpg",
          email: "jeremiah@aaronice.com",
          phone: "+234 801 234 5681",
          twitter: "https://twitter.com/jeremiah",
          linkedin: "https://linkedin.com/in/jeremiah",
          createdAt: new Date().toISOString(),
        },
        {
          id: "team-5",
          name: "Ibrahim Favour",
          title: "Customer Service",
          bio: "Dedicated customer service professional committed to delivering exceptional support",
          image: "/images/teams/customer-service.jpg",
          email: "ibrahim@aaronice.com",
          phone: "+234 801 234 5682",
          twitter: "https://twitter.com/ibrahim",
          linkedin: "https://linkedin.com/in/ibrahim",
          createdAt: new Date().toISOString(),
        },
      ];

      for (const member of defaultTeamMembers) {
        teamStorage.add(member);
      }

      console.log(
        `✅ Seeded ${defaultTeamMembers.length} default team members`,
      );
    }

    // Seed original courses from static data
    const coursesStorage = getCoursesStorage();
    if (coursesStorage.getAll().length === 0 && coursesData.length > 0) {
      for (const course of coursesData) {
        coursesStorage.add(course);
      }

      console.log(`✅ Seeded ${coursesData.length} original courses`);
    }

    console.log("✅ Application initialized successfully");
    initialized = true;
  } catch (error) {
    console.error("❌ Failed to initialize application:", error);
    throw error;
  }
}
