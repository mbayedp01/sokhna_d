import type { MetadataRoute } from "next";

/** Manifest PWA minimal (installable, thème cohérent avec la palette). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Une invitation — pour Sokhna",
    short_name: "Invitation",
    description: "Une invitation élégante et respectueuse.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8f3",
    theme_color: "#6b8161",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
