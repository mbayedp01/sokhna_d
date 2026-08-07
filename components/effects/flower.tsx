"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type FlowerProps = {
  className?: string;
  /** Délai avant le début de la pousse (s). */
  delay?: number;
  /** Durée de la pousse (s). */
  duration?: number;
  petals?: number;
};

/**
 * Fleur SVG qui « pousse » : la tige se dessine, puis les pétales s'ouvrent
 * un à un, puis le cœur doré apparaît. Utilisée à l'intro et au fil du scroll.
 */
export function Flower({ className, delay = 0, duration = 2.2, petals = 6 }: FlowerProps) {
  const reduced = useReducedMotion();
  const t = reduced ? 0 : duration;

  return (
    <svg
      viewBox="0 0 120 200"
      className={cn("h-full w-full", className)}
      aria-hidden
      focusable="false"
    >
      {/* Tige */}
      <motion.path
        d="M60 196 C 60 150, 58 120, 60 92"
        fill="none"
        stroke="#869c77"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: t * 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      />
      {/* Feuilles */}
      {[
        { d: "M60 155 C 40 148, 30 132, 34 122 C 48 122, 58 138, 60 155 Z", delay: 0.42 },
        { d: "M60 138 C 80 132, 90 116, 86 106 C 72 107, 62 122, 60 138 Z", delay: 0.52 },
      ].map((leaf) => (
        <motion.path
          key={leaf.d}
          d={leaf.d}
          fill="#a3b795"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ transformOrigin: "60px 145px" }}
          transition={{ duration: t * 0.3, delay: delay + t * leaf.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      {/* Pétales */}
      {Array.from({ length: petals }).map((_, i) => (
        <motion.ellipse
          key={i}
          cx="60"
          cy="62"
          rx="11"
          ry="26"
          fill={i % 2 === 0 ? "#e8dcc6" : "#f7f2e7"}
          stroke="#d9c08a"
          strokeWidth="0.8"
          style={{ transformOrigin: "60px 88px" }}
          initial={{ scale: 0, rotate: (360 / petals) * i, opacity: 0 }}
          animate={{ scale: 1, rotate: (360 / petals) * i, opacity: 1 }}
          transition={{
            duration: t * 0.35,
            delay: delay + t * 0.55 + i * (t * 0.06),
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      ))}
      {/* Cœur doré */}
      <motion.circle
        cx="60"
        cy="88"
        r="9"
        fill="#b99a5c"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: t * 0.25, delay: delay + t * 0.9, ease: [0.34, 1.56, 0.64, 1] }}
      />
    </svg>
  );
}
