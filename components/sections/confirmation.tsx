"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "@/components/effects/typewriter";

export function Confirmation() {
  const [line, setLine] = React.useState(0);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      <div className="max-w-lg px-8 text-center">
        <motion.div
          className="mx-auto mb-8 text-5xl"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
        >
          ✦
        </motion.div>

        <h2 className="font-display text-3xl text-moon sm:text-5xl text-glow">
          <Typewriter
            text="Merci ✦"
            speed={80}
            startDelay={1000}
            onDone={() => setLine(1)}
          />
        </h2>

        {line >= 1 && (
          <motion.p
            className="mt-6 text-lg text-primary/70"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <Typewriter
              text="Merci d'avoir pris le temps de répondre."
              speed={40}
              startDelay={800}
              onDone={() => setLine(2)}
            />
          </motion.p>
        )}

        {line >= 2 && (
          <motion.p
            className="mt-8 font-display text-xl text-accent/80 italic"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <Typewriter
              text="Si cette rencontre est un bien, qu'Allah la facilite."
              speed={45}
              startDelay={1000}
            />
          </motion.p>
        )}

        <motion.p
          className="mt-10 text-sm tracking-[0.3em] text-dim/30 uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 6, duration: 2 }}
        >
          À très bientôt
        </motion.p>
      </div>
    </motion.div>
  );
}
