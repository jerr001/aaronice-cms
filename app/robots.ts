import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/payment-success/"],
      },
    ],
    sitemap: "https://aaronice.com/sitemap.xml",
  };
}
