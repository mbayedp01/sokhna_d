/**
 * Contenu éditorial du site.
 * Centralisé ici pour éviter toute duplication dans les composants.
 */

export type Place = {
  id: string;
  name: string;
  description: string;
  ambiance: string;
  gradient: string;
  emoji: string;
  /** Si vrai, un champ texte permet de préciser le lieu souhaité. */
  custom?: boolean;
};

export const PLACES: Place[] = [
  {
    id: "maison-italie",
    name: "Maison d'Italie — Ngor",
    description: "On traverse jusqu'à la deuxième plage pour y accéder. Un cadre unique, les pieds presque dans le sable.",
    ambiance: "Bord de mer · Authentique",
    gradient: "linear-gradient(150deg,#4a7c9b 0%,#7db4c9 45%,#e8dcc6 100%)",
    emoji: "🍝",
  },
  {
    id: "club-union",
    name: "Club L'Union",
    description: "Un restaurant avec du caractère, une ambiance chaleureuse et une belle carte.",
    ambiance: "Convivial · Raffiné",
    gradient: "linear-gradient(150deg,#6b8161 0%,#a3b795 45%,#e8dcc6 100%)",
    emoji: "🍽️",
  },
  {
    id: "kpopstore",
    name: "KpopStore Dakar",
    description: "Albums K-pop, nouilles Buldak et bonne ambiance — pour changer un peu.",
    ambiance: "Original · Décontracté",
    gradient: "linear-gradient(150deg,#a377b0 0%,#c9a3d6 45%,#eef2ec 100%)",
    emoji: "🍜",
  },
  {
    id: "kayak",
    name: "Kayak — Anse Bernard",
    description: "Pagayer, respirer l'air marin, profiter du paysage. Une activité tranquille, sans pression.",
    ambiance: "Plein air · Paisible",
    gradient: "linear-gradient(150deg,#3f7c8a 0%,#7fb8c4 45%,#eef2ec 100%)",
    emoji: "🛶",
  },
  {
    id: "son-choix",
    name: "Un restaurant de ton choix",
    description: "Tu connais peut-être un endroit que tu apprécies particulièrement. Précise-le ci-dessous.",
    ambiance: "Surprise · À toi de jouer",
    gradient: "linear-gradient(150deg,#b99a5c 0%,#d9c08a 40%,#eef2ec 100%)",
    emoji: "✨",
    custom: true,
  },
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
