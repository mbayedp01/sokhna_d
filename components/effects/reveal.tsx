"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? undefined : { opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function RevealWords({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((word, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block mr-[0.3em]"
          initial={reduced ? undefined : { opacity: 0, y: 20, rotateX: 60 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: i * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ perspective: 600 }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
