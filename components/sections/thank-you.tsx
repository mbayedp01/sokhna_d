"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flower } from "@/components/effects/flower";
import { Typewriter } from "@/components/effects/typewriter";

/**
 * Écran final : les fleurs s'envolent, la lettre se referme, puis le remerciement.
 */
export function ThankYou() {
  const reduced = useReducedMotion();
  const [line, setLine] = React.useState(0);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-cream px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      role="status"
    >
      {/* Fleurs qui s'envolent */}
      {!reduced &&
        Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute h-10 w-6 opacity-70"
            style={{ left: `${6 + i * 6.6}%`, bottom: "-12%" }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "-125vh", opacity: [0, 0.9, 0], rotate: (i % 2 ? 1 : -1) * 220 }}
            transition={{ duration: 5 + (i % 5), delay: i * 0.18, repeat: Infinity, ease: "easeOut" }}
          >
            <Flower duration={0.01} petals={5} />
          </motion.span>
        ))}

      {/* La lettre se referme puis le message apparaît */}
      <motion.div
        className="relative z-10 w-full max-w-lg rounded-[26px] glass px-8 py-14 text-center shadow-[0_40px_90px_-40px_rgba(65,79,60,0.5)]"
        initial={{ scaleY: 0.15, opacity: 0, rotateX: 45 }}
        animate={{ scaleY: 1, opacity: 1, rotateX: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformPerspective: 1200 }}
        onAnimationComplete={() => setLine(1)}
      >
        <div className="mx-auto mb-7 h-24 w-16">
          <Flower duration={1.6} delay={0.1} />
        </div>

        {line >= 1 && (
          <>
            <h2 className="font-display text-4xl text-sage-700 sm:text-5xl">
              <Typewriter text="Merci 🌸" speed={110} startDelay={200} onDone={() => setLine(2)} />
            </h2>
            <div className="mt-5 min-h-8">
              {line >= 2 && (
                <p className="text-lg text-ink-soft">
                  <Typewriter text="J'ai bien reçu ta réponse." speed={45} startDelay={500} />
                </p>
              )}
            </div>
          </>
        )}

        <motion.p
          className="mt-10 text-xs tracking-[0.3em] text-gold uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 1 }}
        >
          À très bientôt
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
