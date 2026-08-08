"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";

import { IntroLetter } from "@/components/sections/intro-letter";
import { Question } from "@/components/sections/question";
import { Planner } from "@/components/sections/planner";
import { ThankYou } from "@/components/sections/thank-you";
import { AmbientLight } from "@/components/effects/ambient-light";
import { PetalCanvas } from "@/components/effects/petal-canvas";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { SmoothScroll } from "@/components/effects/smooth-scroll";
import { Flower } from "@/components/effects/flower";

type Stage = "intro" | "question" | "plan" | "done";

/**
 * Chef d'orchestre de l'expérience : enchaîne les actes du « mini film »
 * (intro → question → organisation → remerciement) et gère les transitions
 * cinématiques entre chacun.
 */
export function Experience() {
  const reduced = useReducedMotion();
  const [stage, setStage] = React.useState<Stage>("intro");
  const [flash, setFlash] = React.useState(false);
  const stageRef = React.useRef<HTMLDivElement>(null);

  /** Bloque le scroll tant que l'expérience n'a pas atteint l'étape « plan ». */
  React.useEffect(() => {
    const lock = stage === "intro" || stage === "question" || stage === "done";
    document.documentElement.style.overflow = lock ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [stage]);

  /** Transition cinématique : zoom caméra + éclat lumineux, puis on révèle la suite. */
  const handleYes = () => {
    if (reduced) {
      setStage("plan");
      return;
    }
    setFlash(true);
    const tl = gsap.timeline();
    tl.to(stageRef.current, {
      scale: 1.35,
      opacity: 0,
      filter: "blur(14px)",
      duration: 1,
      ease: "power3.in",
    }).add(() => {
      setStage("plan");
      setFlash(false);
      window.scrollTo({ top: 0 });
    });
  };

  return (
    <SmoothScroll>
      <AmbientLight />
      <PetalCanvas />
      <CustomCursor />

      {/* Lien d'évitement : accessibilité clavier */}
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-sage-600 focus:px-5 focus:py-3 focus:text-cream"
      >
        Aller au contenu
      </a>

      <main id="contenu" className="relative">
        <AnimatePresence mode="wait">
          {/* ------------------- Acte I : la lettre ------------------- */}
          {stage === "intro" && (
            <motion.div
              key="intro"
              exit={{ opacity: 0, scale: 1.06, filter: "blur(10px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <IntroLetter onContinue={() => setStage("question")} />
            </motion.div>
          )}

          {/* ------------------ Acte II : la question ------------------ */}
          {stage === "question" && (
            <motion.div
              key="question"
              ref={stageRef}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="will-change-transform"
            >
              <Question onYes={handleYes} />
            </motion.div>
          )}

          {/* --------------- Acte III : l'organisation --------------- */}
          {(stage === "plan" || stage === "done") && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <PlanHeader />
              <Planner onConfirmed={() => setStage("done")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Éclat lumineux de la transition */}
      <AnimatePresence>
        {flash && (
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[60] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.85, 0] }}
            transition={{ duration: 1, times: [0, 0.55, 1] }}
          />
        )}
      </AnimatePresence>

      {/* ------------------ Acte IV : le remerciement ------------------ */}
      <AnimatePresence>{stage === "done" && <ThankYou />}</AnimatePresence>
    </SmoothScroll>
  );
}

/** Bandeau d'ouverture de la partie « organisation ». */
function PlanHeader() {
  return (
    <header className="relative flex min-h-[70svh] flex-col items-center justify-center px-6 text-center">
      <motion.div
        className="mb-8 h-28 w-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <Flower duration={2} delay={0.4} />
      </motion.div>

      <motion.p
        className="mb-5 text-xs tracking-[0.35em] text-gold uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.9 }}
      >
        Merci pour ce oui
      </motion.p>

      <motion.h2
        className="max-w-3xl font-display text-4xl leading-tight text-sage-700 sm:text-6xl"
        initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        Organisons cela ensemble.
      </motion.h2>

      <motion.p
        className="mt-6 max-w-xl text-base text-ink-soft sm:text-lg"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        Quatre petites étapes, et tu choisis absolument tout.
      </motion.p>

      <motion.span
        aria-hidden
        className="absolute bottom-10 h-12 w-6 rounded-full border border-sage-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <motion.span
          className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded-full bg-sage-400"
          animate={{ y: [0, 18, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.span>
    </header>
  );
}
