"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Ripple = { id: number; x: number; y: number };

/**
 * Bouton premium : effet magnétique, ripple au clic, halo lumineux, scale au survol.
 * Tous les effets se désactivent si `prefers-reduced-motion` est actif.
 */
export function FancyButton({ className, children, onClick, ...props }: ButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.4 });

  /** Attire légèrement le bouton vers le curseur. */
  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 18);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 12);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!reduced && ref.current) {
      const r = ref.current.getBoundingClientRect();
      const id = Date.now() + Math.random();
      setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
      window.setTimeout(() => setRipples((p) => p.filter((d) => d.id !== id)), 700);
    }
    onClick?.(e);
  };

  return (
    <motion.span
      className="relative inline-block will-change-transform"
      style={reduced ? undefined : { x, y }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      transition={{ type: "spring", stiffness: 320, damping: 20 }}
    >
      {/* Halo lumineux */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-3 rounded-full bg-sage-300/35 opacity-0 blur-2xl transition-opacity duration-500 group-hover/fancy:opacity-100"
      />
      <Button
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        onClick={handleClick}
        className={cn(
          "group/fancy overflow-hidden shadow-[0_10px_30px_-12px_rgba(65,79,60,0.55)]",
          className,
        )}
        {...props}
      >
        {/* Reflet balayant */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 group-hover/fancy:translate-x-full motion-reduce:hidden"
        />
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-white/45"
            initial={{ width: 0, height: 0, opacity: 0.7, x: r.x, y: r.y }}
            animate={{ width: 320, height: 320, opacity: 0, x: r.x - 160, y: r.y - 160 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Button>
    </motion.span>
  );
}
