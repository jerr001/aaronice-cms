/**
 * Shared in-memory storage for admin data
 * This module maintains state across API route handlers
 */

import { Testimonial } from "@/types/testimonial-admin";
import { Course } from "@/types/course";
import { ContactSubmission } from "@/types/contact-submission";
import { TeamMember } from "@/types/team-member";

export const storage = {
  testimonials: [] as Testimonial[],
  courses: [] as Course[],
  contactSubmissions: [] as ContactSubmission[],
  teamMembers: [] as TeamMember[],
};
