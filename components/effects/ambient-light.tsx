"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Fond lumineux : halos sauge/doré très diffus qui respirent lentement,
 * plus un grain léger. Purement décoratif.
 */
export function AmbientLight() {
  const reduced = useReducedMotion();

  const blobs = [
    { class: "left-[-10%] top-[-8%] h-[46rem] w-[46rem] bg-sage-200/50", d: 18 },
    { class: "right-[-14%] top-[28%] h-[40rem] w-[40rem] bg-[#d9c08a]/35", d: 24 },
    { class: "bottom-[-12%] left-[22%] h-[38rem] w-[38rem] bg-[#e8dcc6]/50", d: 21 },
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-cream" />
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[120px] ${b.class}`}
          animate={reduced ? undefined : { x: [0, 40, -20, 0], y: [0, -30, 25, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Grain subtil (SVG inline, aucune requête réseau) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
