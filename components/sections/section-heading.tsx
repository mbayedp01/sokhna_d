"use client";

import { motion } from "framer-motion";
import { RevealWords } from "@/components/effects/reveal";

/** En-tête de section réutilisable : numéro, titre révélé mot à mot, sous-titre. */
export function SectionHeading({
  step,
  title,
  subtitle,
  id,
}: {
  step: string;
  title: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <motion.span
        className="mb-5 inline-block rounded-full border border-gold/30 bg-white/60 px-4 py-1.5 text-[11px] tracking-[0.3em] text-gold uppercase backdrop-blur-sm"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        {step}
      </motion.span>
      <h2 id={id} className="font-display text-3xl leading-tight text-sage-700 sm:text-5xl">
        <RevealWords text={title} />
      </h2>
      {subtitle && (
        <motion.p
          className="mx-auto mt-5 max-w-xl text-base text-ink-soft sm:text-lg"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
