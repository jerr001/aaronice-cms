"use client";

import Script from "next/script";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Aaronice Prime Global Company Ltd",
    alternateName: "Aaronice Prime",
    url: "https://aaronice.com",
    logo: "https://aaronice.com/images/logo/logo-dark.svg",
    description:
      "Leading technology company specializing in AI automation, custom software development, digital transformation, and expert-led tech training.",
    email: "aaronicepgcltd@gmail.com",
    telephone: "+234-802-472-7665",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
    },
    sameAs: [
      "https://www.facebook.com/share/16oNweMP8F/",
      "https://www.instagram.com/aaronicepgcltd",
      "https://x.com/aaronicepgcltd",
      "https://www.linkedin.com/company/aaronice-prime-global-company-ltd",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aaronice Prime",
    url: "https://aaronice.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://aaronice.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const educationalOrganizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Aaronice Prime Tech Training",
    description:
      "Expert-led tech training bootcamps in AI Automation, Web Development, Data Analysis, UI/UX Design, and more.",
    url: "https://aaronice.com",
    courseMode: ["online", "onsite"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tech Training Courses",
      itemListElement: [
        {
          "@type": "Course",
          name: "AI Automation",
          description:
            "Master AI automation tools and workflows for business efficiency",
          provider: {
            "@type": "Organization",
            name: "Aaronice Prime",
          },
        },
        {
          "@type": "Course",
          name: "Web Design (Frontend Development)",
          description:
            "Learn modern web development with HTML, CSS, JavaScript, and React",
          provider: {
            "@type": "Organization",
            name: "Aaronice Prime",
          },
        },
        {
          "@type": "Course",
          name: "Data Analysis",
          description:
            "Become proficient in data analysis using Excel, SQL, and Python",
          provider: {
            "@type": "Organization",
            name: "Aaronice Prime",
          },
        },
      ],
    },
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="educational-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(educationalOrganizationSchema),
        }}
      />
    </>
  );
}
