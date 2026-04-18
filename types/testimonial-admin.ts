export interface Testimonial {
  id: string;
  author: string;
  company: string;
  role: string;
  content: string;
  image?: string;
  featured: boolean;
  createdAt: string;
}
