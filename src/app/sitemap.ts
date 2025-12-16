import { MetadataRoute } from "next";
import { fetchAllResorts } from "@/lib/api";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  let resortEntries: MetadataRoute.Sitemap = [];

  try {
    const resorts = await fetchAllResorts({ limit: 200 });
    resortEntries = resorts
      .filter((resort) => typeof resort.id === "number")
      .map((resort) => ({
        url: absoluteUrl(`/wetter/${resort.id}`),
        lastModified: resort.last_update ? new Date(resort.last_update) : now,
        changeFrequency: "daily",
        priority: 0.7,
      }));
  } catch (error) {
    console.error("Failed to load resorts for sitemap", error);
  }

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: absoluteUrl("/landing"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    ...resortEntries,
  ];
}
