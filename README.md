# Une invitation 🌸

Site **one page** — une invitation élégante, respectueuse et animée, pensée comme un mini-film interactif.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · TailwindCSS 4 · Framer Motion · GSAP · Lenis · React Hook Form + Zod · Lucide Icons · Server Actions · Resend · Vercel Analytics.

Aucune librairie CSS supplémentaire : tout le style vient de Tailwind et de quelques utilitaires maison (`app/globals.css`).

## Démarrage

```bash
npm install
```

Copier `.env.example` vers `.env.local` puis renseigner les clés :

```bash
cp .env.example .env.local
```

| Variable | Rôle |
| --- | --- |
| `RESEND_API_KEY` | Clé API Resend (https://resend.com/api-keys) |
| `RESEND_FROM` | Expéditeur vérifié, ex. `Invitation <onboarding@resend.dev>` |
| `RESEND_TO` | Adresse qui reçoit la réponse |
| `NEXT_PUBLIC_SITE_URL` | URL publique (métadonnées Open Graph) |

```bash
npm run dev
```

## Déploiement sur Vercel

1. Pousser le dépôt sur GitHub, puis importer le projet sur Vercel (framework détecté automatiquement).
2. Ajouter les quatre variables d'environnement ci-dessus dans **Settings → Environment Variables**.
3. Déployer — aucune autre configuration n'est nécessaire.

Sans `RESEND_API_KEY` / `RESEND_TO`, le site fonctionne mais la confirmation affiche un message d'erreur au lieu d'envoyer l'email.

## Structure

```
app/
  actions.ts          Server Action : validation + envoi Resend
  layout.tsx          Polices, métadonnées, Open Graph, Analytics
  page.tsx            Page unique
  manifest.ts         Manifest PWA
  opengraph-image.tsx Image OG générée au build
components/
  experience.tsx      Orchestration des 4 actes du « film »
  sections/           Intro (enveloppe), question, planificateur, remerciement
  effects/            Pétales canvas, curseur, smooth scroll, fleur SVG, reveals
  ui/                 Primitives (bouton, carte 3D, calendrier, textarea)
lib/
  content.ts          Contenu éditorial (lieux, activités, créneaux)
  schema.ts           Schéma Zod partagé client / serveur
  utils.ts            Helpers (cn, formats, aléatoire)
```

## Parcours

1. **Intro** — une fleur pousse, une enveloppe apparaît puis s'ouvre, la lettre sort et le texte s'écrit.
2. **La question** — « Oui » déclenche une transition cinématique ; « Non » s'échappe gentiment.
3. **L'organisation** — lieu (cartes 3D), activité, date, heure, message optionnel.
4. **Confirmation** — envoi de l'email et écran de remerciement.

L'email récapitule : nom, lieu, activité, date, heure, message, date de soumission, adresse IP et navigateur.

## Accessibilité

- Toutes les animations sont désactivées si `prefers-reduced-motion: reduce` est actif (canvas de pétales et curseur personnalisé compris).
- Navigation clavier complète, lien d'évitement, `aria-label` / `aria-pressed` / `aria-live` sur les zones dynamiques.
- Le texte des effets machine à écrire est fourni intégralement aux lecteurs d'écran.
- Contrastes conformes sur la palette sauge / beige / doré.
