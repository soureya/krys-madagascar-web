import type { MetadataRoute } from "next";

// Next.js file-based convention: this exports a typed sitemap that
// Next.js serves at /sitemap.xml. Single-page site → one entry (the
// in-page anchors like #boutiques or #catalogue are sections of the
// same URL, not separate routes, so they don't belong in the sitemap).

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.krys-madagascar.com",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
