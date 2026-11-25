import type { MetadataRoute } from "next";
import templatesData from "@/data/templates.json";
import { TemplateItem } from "@/types/resume";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://resumeflow.studio";
const ALL_TEMPLATES = templatesData as TemplateItem[];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/templates`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
  ];

  const templateRoutes: MetadataRoute.Sitemap = ALL_TEMPLATES.map((t) => ({
    url: `${SITE_URL}/templates/${t.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...templateRoutes];
}
