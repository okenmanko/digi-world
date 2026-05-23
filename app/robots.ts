import type { MetadataRoute } from "next";

const siteUrl = "https://digiworld.uz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/profile"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}