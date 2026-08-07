import type { MetadataRoute } from "next";

/** Site privé : on demande aux moteurs de ne pas l'indexer. */
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", disallow: "/" }] };
}
