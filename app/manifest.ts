import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Station note",
    short_name: "Station note",
    description: "Station note app is realtime, free & open source note taking app",
    start_url: "/",
    display: "standalone",
    background_color: "#27272a",
    theme_color: "#27272a",
    icons: [
      {
        src: "/assets/maskable/icon_x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/maskable/icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/maskable/icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/maskable/icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
