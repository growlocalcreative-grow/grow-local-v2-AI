import type { MetadataRoute } from "next";
import { SPECIALTY_SERVICES } from "@/lib/services-data";
import { CITY_LOCATIONS } from "@/lib/locations-data";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://growlocalcreative.com";
  const lastModified = new Date();

  const serviceEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...SPECIALTY_SERVICES.map((svc) => ({
      url: `${baseUrl}/services/${svc.slug}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];

  const locationEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/locations`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    ...CITY_LOCATIONS.map((loc) => ({
      url: `${baseUrl}/locations/${loc.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...serviceEntries,
    ...locationEntries,
    {
      url: `${baseUrl}/partners`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/checklist/google-maps`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
