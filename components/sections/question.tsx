"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { FancyButton } from "@/components/ui/fancy-button";
import { RevealWords } from "@/components/effects/reveal";
import { burstPetals } from "@/components/effects/petal-canvas";
import { rand } from "@/lib/utils";

/** Petits mots affichés au fil des esquives du bouton « Non ». */
const DODGE_LINES = [
  "Hmm… il a l'air timide.",
  "Il n'aime pas être attrapé.",
  "Décidément, il s'entraîne au sprint.",
  "Je crois qu'il a un avis sur la question.",
  "Bon… il ne se laissera pas faire.",
  "Et si on essayait l'autre bouton ? 😊",
];

/**
 * Le bouton « Non » : il fuit la souris, tourne, rétrécit, devient transparent,
 * se téléporte et rebondit. Jamais attrapable — et toujours bon enfant.
 */
function RunawayNo({ onDodge }: { onDodge: () => void }) {
  const reduced = useReducedMotion();
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const [dodges, setDodges] = React.useState(0);

  const flee = React.useCallback(() => {
    setDodges((d) => d + 1);
    onDodge();
    // Téléportation dans une zone sûre : l'amplitude s'adapte à l'écran
    // pour que le bouton ne sorte jamais du cadre (pas de scroll horizontal).
    const range = Math.min(150, window.innerWidth * 0.2);
    setPos({ x: rand(-range, range), y: rand(-90, 90) });
  }, [onDodge]);

  // En reduced-motion : le bouton reste statique mais reste inoffensif.
  const shrink = Math.max(0.55, 1 - dodges * 0.06);
  const fade = Math.max(0.35, 1 - dodges * 0.07);

  return (
    <motion.button
      type="button"
      // aria-disabled plutôt que disabled : le bouton reste annonçable,
      // mais ne déclenche aucune action (c'est le gag du site).
      aria-disabled="true"
      aria-label="Non — ce bouton s'échappe, c'est fait exprès"
      onMouseEnter={reduced ? undefined : flee}
      onFocus={reduced ? undefined : flee}
      onPointerDown={(e) => {
        e.preventDefault();
        if (!reduced) flee();
      }}
      onClick={(e) => e.preventDefault()}
      animate={
        reduced
          ? undefined
          : {
              x: pos.x,
              y: pos.y,
              rotate: dodges * 47,
              scale: shrink,
              opacity: fade,
            }
      }
      transition={{ type: "spring", stiffness: 380, damping: 12, mass: 0.6 }}
      className="relative inline-flex h-14 items-center justify-center rounded-full border border-sage-300 bg-white/70 px-9 text-lg text-sage-700 backdrop-blur-sm"
    >
      Non 😅
    </motion.button>
  );
}

/**
 * Section 2 : la question, avec « Oui » et un « Non » facétieux.
 */
export function Question({ onYes }: { onYes: () => void }) {
  const [dodges, setDodges] = React.useState(0);

  return (
    <section
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
      aria-labelledby="question-title"
    >
      <motion.span
        className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/60 px-5 py-2 text-xs tracking-[0.25em] text-gold uppercase backdrop-blur-sm"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <Sparkles className="h-3.5 w-3.5" aria-hidden />
        Une proposition
      </motion.span>

      <h2
        id="question-title"
        className="max-w-4xl font-display text-3xl leading-[1.2] text-sage-700 sm:text-5xl lg:text-6xl"
      >
        <RevealWords text="Ça te dirait qu'on se retrouve un moment autour d'un repas ou d'une activité sympa ?" />
      </h2>

      {/* Zone de jeu : hauteur fixe pour que le « Non » ne déplace rien d'autre. */}
      <div className="relative mt-14 flex h-52 w-full max-w-2xl items-center justify-center gap-4 overflow-hidden sm:gap-10">
        <FancyButton
          size="xl"
          onClick={(e) => {
            burstPetals(e.clientX, e.clientY, 46);
            onYes();
          }}
        >
          Oui 😊
        </FancyButton>
        <RunawayNo onDodge={() => setDodges((d) => d + 1)} />
      </div>

      <div className="h-8" aria-live="polite">
        <AnimatePresence mode="wait">
          {dodges > 0 && (
            <motion.p
              key={Math.min(dodges, DODGE_LINES.length) - 1}
              className="text-sm text-ink-soft/80 italic"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
            >
              {DODGE_LINES[Math.min(dodges, DODGE_LINES.length) - 1]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
