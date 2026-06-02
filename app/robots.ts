import type { MetadataRoute } from "next";

// Next.js file-based convention: served at /robots.txt. Allows full
// crawl and points search engines at the sitemap above so they
// discover the canonical URL without guessing.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.krys-madagascar.com/sitemap.xml",
    host: "https://www.krys-madagascar.com",
  };
}
