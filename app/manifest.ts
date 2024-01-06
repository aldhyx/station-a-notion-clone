import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Station note",
    short_name: "Station note",
    description: "Station note app is realtime, free & open source note taking app",
    start_url: "/login",
    display: "standalone",
    background_color: "#27272a",
    theme_color: "#27272a",
    icons: [
      {
        src: "/assets/logo/icon_x48.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/assets/logo/icon_x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        src: "/assets/logo/icon_x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/assets/logo/icon_x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/assets/logo/icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/logo/icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/assets/logo/icon_x192_any.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Settings",
        description: "Change profile, password, etc",
        url: "/settings",
      },
    ],
    screenshots: [
      {
        src: "/assets/screenshot-desktop.png",
        type: "image/png",
        sizes: "1918x918",
        // @ts-ignore
        form_factor: "wide",
      },
      {
        src: "/assets/screenshot-mobile.png",
        type: "image/png",
        sizes: "361x730",
      },
    ],
  }
}
