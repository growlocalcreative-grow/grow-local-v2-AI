import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Grow Local Creative",
    short_name: "Grow Local",
    description: "Simple, phone-friendly websites for small businesses and nonprofits across the Georgetown Divide.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F4ED",
    theme_color: "#3D4337",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
