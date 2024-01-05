import type { Metadata } from "next"

export const constructMetadata = (
  opt?: {
    title?: string
    description?: string
    image?: string
    noIndex?: boolean
  } & Metadata,
): Metadata => ({
  title: opt?.title || "Station note",
  description:
    opt?.description ||
    "Station note app is realtime, free & open source note taking app",
})
