"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Flower } from "@/components/effects/flower";
import { Typewriter } from "@/components/effects/typewriter";
import { FancyButton } from "@/components/ui/fancy-button";
import { burstPetals } from "@/components/effects/petal-canvas";

type Phase = "seed" | "envelope" | "opening" | "letter";

/**
 * Ouverture du site : une fleur pousse, une enveloppe apparaît puis s'ouvre,
 * la lettre sort et le texte s'écrit à la machine à écrire.
 */
export function IntroLetter({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("seed");
  const [line, setLine] = React.useState(0);

  // Enchaînement temporel des phases (accéléré en reduced-motion).
  React.useEffect(() => {
    const k = reduced ? 0.15 : 1;
    const timers = [
      window.setTimeout(() => setPhase("envelope"), 2700 * k),
      window.setTimeout(() => setPhase("opening"), 4700 * k),
      window.setTimeout(() => setPhase("letter"), 6300 * k),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  const opened = phase === "opening" || phase === "letter";

  return (
    <div className="relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden px-5 py-16">
      {/* Halo d'ouverture */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fff8e8] blur-[110px]"
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{ opacity: opened ? 0.9 : 0.4, scale: opened ? 1.15 : 0.8 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <AnimatePresence mode="wait">
        {/* ---------- Phase 1 : la fleur pousse ---------- */}
        {phase === "seed" && (
          <motion.div
            key="seed"
            className="relative h-64 w-40 sm:h-80 sm:w-52"
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Flower duration={2.4} />
          </motion.div>
        )}

        {/* ---------- Phases 2-4 : l'enveloppe et la lettre ---------- */}
        {phase !== "seed" && (
          <motion.div
            key="envelope"
            className="relative w-full max-w-xl"
            style={{ perspective: 1400 }}
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Lettre : glisse hors de l'enveloppe */}
            <motion.div
              className="relative z-20 mx-auto w-full origin-bottom rounded-[26px] glass px-7 py-10 text-center shadow-[0_40px_90px_-40px_rgba(65,79,60,0.55)] sm:px-12 sm:py-14"
              initial={{ y: 90, opacity: 0, scale: 0.9, rotateX: 25 }}
              animate={
                phase === "letter"
                  ? { y: 0, opacity: 1, scale: 1, rotateX: 0 }
                  : { y: 90, opacity: 0, scale: 0.9, rotateX: 25 }
              }
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden={phase !== "letter"}
            >
              <div className="mx-auto mb-6 h-16 w-12">
                <Flower duration={1.4} delay={0.2} petals={5} />
              </div>

              {phase === "letter" && (
                <>
                  <h1 className="font-display text-3xl leading-tight text-sage-700 sm:text-5xl">
                    <Typewriter
                      text="Bonjour Sokhna 🌸"
                      speed={70}
                      startDelay={400}
                      onDone={() => setLine(1)}
                    />
                  </h1>

                  <div className="mt-6 min-h-[3.5rem]">
                    {line >= 1 && (
                      <motion.p
                        className="text-lg text-ink-soft sm:text-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Typewriter
                          text="J'ai une petite proposition à te faire."
                          speed={45}
                          startDelay={900}
                          onDone={() => setLine(2)}
                        />
                      </motion.p>
                    )}
                  </div>

                  <AnimatePresence>
                    {line >= 2 && (
                      <motion.div
                        className="mt-9"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <FancyButton
                          size="lg"
                          onClick={(e) => {
                            burstPetals(e.clientX, e.clientY, 20);
                            onContinue();
                          }}
                        >
                          Continuer
                          <ArrowRight className="h-5 w-5" aria-hidden />
                        </FancyButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>

            {/* Corps de l'enveloppe (devant la lettre) */}
            <motion.div
              aria-hidden
              className="absolute inset-x-0 bottom-[-2.5rem] z-30 mx-auto h-52 rounded-b-[22px] rounded-t-lg border border-gold/60 bg-linear-to-b from-[#ece0c4] to-[#d8c49c] shadow-[0_34px_70px_-28px_rgba(65,79,60,0.75)] sm:h-64"
              animate={
                phase === "letter"
                  ? { y: 130, opacity: 0 }
                  : { y: 0, opacity: 1 }
              }
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Rabats latéraux */}
              <span className="absolute inset-0 overflow-hidden rounded-b-[22px]">
                <span className="absolute -left-1/4 top-0 h-full w-3/4 origin-top-left rotate-[18deg] bg-[#f2e8d2]/80" />
                <span className="absolute -right-1/4 top-0 h-full w-3/4 origin-top-right -rotate-[18deg] bg-[#f2e8d2]/80" />
              </span>
              {/* Sceau doré */}
              <span className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-linear-to-br from-[#d9c08a] to-[#b99a5c] font-display text-lg text-white shadow-lg">
                S
              </span>
            </motion.div>

            {/* Rabat supérieur : charnière calée sur le bord haut de l'enveloppe,
                il bascule vers l'arrière à l'ouverture. */}
            <motion.div
              aria-hidden
              className="absolute inset-x-0 bottom-[2.5rem] z-40 mx-auto h-32 origin-top sm:bottom-[5.5rem]"
              style={{ transformStyle: "preserve-3d" }}
              animate={{
                rotateX: opened ? -172 : 0,
                opacity: phase === "letter" ? 0 : 1,
                y: phase === "letter" ? 130 : 0,
              }}
              transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
            >
              <span
                className="block h-full w-full bg-linear-to-b from-[#f4ead6] to-[#dfcda8] drop-shadow-[0_6px_10px_rgba(65,79,60,0.25)]"
                style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indication discrète pendant l'attente */}
      <AnimatePresence>
        {phase !== "letter" && (
          <motion.p
            className="absolute bottom-10 text-sm tracking-[0.3em] text-ink-soft/50 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Un instant
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
