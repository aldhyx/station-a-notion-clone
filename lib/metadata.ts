import type { Metadata } from "next"

export const constructMetadata = ({
  title = "Station note",
  description = "Station note app is a realtime, free & open source note taking app",
  image = "https://station-proto.netlify.app/_static/thumbnail.png", // todo: not yet
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string | URL
  icons?: Metadata["icons"]
  noIndex?: boolean
} = {}): Metadata => ({
  title,
  description,
  icons,
  openGraph: {
    title,
    description,
    images: [
      {
        url: image,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [image],
    creator: "@station_note",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  ...(noIndex && {
    robots: {
      index: false,
      follow: false,
    },
  }),
})
