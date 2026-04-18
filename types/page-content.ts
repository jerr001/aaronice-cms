/**
 * TypeScript types for PageContent
 */

export interface PageContentSection {
  title?: string;
  content?: string;
  image?: string;
}

export interface SocialLinks {
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
}

export type PageId =
  | "home"
  | "about"
  | "services"
  | "contact"
  | "footer"
  | "pricing";

export interface PageContentData {
  pageId: PageId;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
  mainContent?: string;
  sections: PageContentSection[];
  contactEmail?: string;
  contactPhone?: string;
  socialLinks?: SocialLinks;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Default page content fallbacks
 * Used when CMS content is unavailable
 */
export const DEFAULT_PAGE_CONTENT: Record<PageId, Partial<PageContentData>> = {
  home: {
    heroTitle: "Premier AI & Tech Solutions Training",
    heroSubtitle:
      "Transform your business with cutting-edge AI and custom software development",
  },
  about: {
    heroTitle: "About Aaronice Prime",
    heroSubtitle:
      "Leading technology company specializing in AI automation and digital transformation",
  },
  services: {
    heroTitle: "Our Services",
    heroSubtitle:
      "Comprehensive solutions for your digital transformation journey",
  },
  contact: {
    heroTitle: "Get In Touch",
    heroSubtitle: "Have questions? We'd love to hear from you",
  },
  footer: {
    contactEmail: "info@aaronice.com",
    contactPhone: "+234 (0) XXX XXXX XXX",
  },
  pricing: {
    heroTitle: "Simple, Transparent Pricing",
    heroSubtitle: "Choose the plan that works best for your needs",
  },
};
