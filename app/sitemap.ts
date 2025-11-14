import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aaronice.com";

  const courses = [
    "ai-automation",
    "frontend",
    "data-analysis",
    "product-design",
    "digital-marketing",
    "project-management",
    "graphic-design",
    "content-creation",
    "virtual-assistant",
  ];

  const courseUrls = courses.map((course) => ({
    url: `${baseUrl}/courses/${course}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/waitlist`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...courseUrls,
  ];
}
