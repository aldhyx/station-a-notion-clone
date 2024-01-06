import { MetadataRoute } from "next"
import { headers } from "next/headers"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers()
  let domain = headersList.get("host") as string

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `https://${domain}/login`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `https://${domain}/signup`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ]
}
