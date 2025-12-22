import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://app.nexonoma.de";

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/grid`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/matrix`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/city`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
    },
  ];
}
