import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Une invitation",
    short_name: "Invitation",
    description: "Un voyage parmi les étoiles pour partager un bon moment.",
    start_url: "/",
    display: "standalone",
    background_color: "#05070D",
    theme_color: "#05070D",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
