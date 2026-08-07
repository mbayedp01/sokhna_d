/**
 * Contenu éditorial du site.
 * Centralisé ici pour éviter toute duplication dans les composants.
 */

export type Place = {
  id: string;
  name: string;
  description: string;
  ambiance: string;
  /** Dégradé décoratif utilisé comme visuel (aucune image externe = zéro latence). */
  gradient: string;
  emoji: string;
};

export const PLACES: Place[] = [
  {
    id: "chic",
    name: "Restaurant chic",
    description: "Une table soignée, une cuisine précise, un service discret.",
    ambiance: "Feutré · Élégant",
    gradient: "linear-gradient(150deg,#6b8161 0%,#a3b795 45%,#e8dcc6 100%)",
    emoji: "🍽️",
  },
  {
    id: "salon-de-the",
    name: "Salon de thé",
    description: "Théières fumantes, pâtisseries fines et conversations sans hâte.",
    ambiance: "Doux · Chaleureux",
    gradient: "linear-gradient(150deg,#d6c4a3 0%,#e8dcc6 45%,#faf8f3 100%)",
    emoji: "🫖",
  },
  {
    id: "cafe-calme",
    name: "Café calme",
    description: "Un endroit tranquille où l'on s'entend parler.",
    ambiance: "Paisible · Simple",
    gradient: "linear-gradient(150deg,#869c77 0%,#c2d0b9 50%,#f2ede2 100%)",
    emoji: "☕️",
  },
  {
    id: "vue",
    name: "Restaurant avec vue",
    description: "De grandes baies, la ville en contrebas, la lumière qui baisse.",
    ambiance: "Panoramique · Lumineux",
    gradient: "linear-gradient(150deg,#b99a5c 0%,#d9c08a 40%,#eef2ec 100%)",
    emoji: "🌇",
  },
];

export type Activity = {
  id: string;
  label: string;
  detail: string;
  icon: "Trees" | "CupSoda" | "Landmark" | "BookOpen" | "Frame" | "Footprints";
};

export const ACTIVITIES: Activity[] = [
  { id: "parc", label: "Marcher dans un parc", detail: "De l'air, des arbres, du temps.", icon: "Trees" },
  { id: "the", label: "Salon de thé", detail: "Une pause posée, à l'abri du bruit.", icon: "CupSoda" },
  { id: "musee", label: "Musée", detail: "Regarder, commenter, apprendre.", icon: "Landmark" },
  { id: "librairie", label: "Librairie", detail: "Flâner entre les rayons.", icon: "BookOpen" },
  { id: "expo", label: "Exposition", detail: "Une découverte à partager.", icon: "Frame" },
  { id: "balade", label: "Balade tranquille", detail: "Marcher, discuter, respirer.", icon: "Footprints" },
];

export const TIME_SLOTS = [
  "11:00",
  "12:00",
  "13:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
] as const;
