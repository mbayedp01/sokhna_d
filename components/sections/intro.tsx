"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Typewriter } from "@/components/effects/typewriter";
import { FancyButton } from "@/components/ui/fancy-button";

type Phase = "dark" | "stars" | "sphere" | "text1" | "text2" | "text3" | "ready";

export function Intro({ onContinue }: { onContinue: () => void }) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = React.useState<Phase>("dark");
  const [line, setLine] = React.useState(0);

  React.useEffect(() => {
    const k = reduced ? 0.15 : 1;
    const timers = [
      window.setTimeout(() => setPhase("stars"), 3000 * k),
      window.setTimeout(() => setPhase("sphere"), 5500 * k),
      window.setTimeout(() => setPhase("text1"), 7500 * k),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  return (
    <div className="relative flex min-h-[100svh] w-full items-center justify-center px-6 py-16">
      <AnimatePresence mode="wait">
        {phase === "dark" && (
          <motion.div key="dark" exit={{ opacity: 0 }} className="absolute inset-0" />
        )}

        {(phase === "stars" || phase === "sphere") && (
          <motion.div
            key="waiting"
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.p
              className="text-sm tracking-[0.4em] text-dim/40 uppercase"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Un instant
            </motion.p>
          </motion.div>
        )}

        {(phase === "text1" || phase === "text2" || phase === "text3" || phase === "ready") && (
          <motion.div
            key="content"
            className="relative z-10 max-w-2xl text-center pointer-events-auto"
            style={{ marginTop: "-12vh" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            <div className="min-h-[4rem] mb-6">
              {phase === "text1" && (
                <h1 className="font-display text-4xl leading-tight text-moon sm:text-6xl text-glow">
                  <Typewriter
                    text="Bonsoir Sokhna."
                    speed={80}
                    onDone={() => {
                      window.setTimeout(() => setPhase("text2"), 1800);
                    }}
                  />
                </h1>
              )}
              {phase === "text2" && (
                <motion.p
                  className="font-display text-2xl text-primary/80 sm:text-3xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typewriter
                    text="Chaque belle histoire commence par un premier pas."
                    speed={45}
                    onDone={() => {
                      window.setTimeout(() => setPhase("text3"), 2000);
                    }}
                  />
                </motion.p>
              )}
              {phase === "text3" && (
                <motion.p
                  className="font-display text-lg text-primary/70 sm:text-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typewriter
                    text="J'aimerais simplement t'inviter à partager un bon moment."
                    speed={40}
                    onDone={() => {
                      window.setTimeout(() => setPhase("ready"), 800);
                    }}
                  />
                </motion.p>
              )}
              {phase === "ready" && (
                <motion.p
                  className="font-display text-lg text-primary/70 sm:text-2xl"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                >
                  J'aimerais simplement t'inviter à partager un bon moment.
                </motion.p>
              )}
            </div>

            <AnimatePresence>
              {phase === "ready" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <FancyButton size="xl" variant="accent" onClick={onContinue}>
                    Découvrir ✦
                  </FancyButton>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
