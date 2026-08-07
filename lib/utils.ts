import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Fusionne des classes Tailwind sans conflit (convention shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Nombre aléatoire dans un intervalle. */
export const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Contraint une valeur dans un intervalle. */
export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Formate une date ISO (yyyy-mm-dd) en français lisible. */
export function formatDateFr(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}
