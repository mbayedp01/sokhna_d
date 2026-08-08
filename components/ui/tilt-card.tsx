"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Amplitude d'inclinaison en degrés. */
  intensity?: number;
  onClick?: () => void;
  selected?: boolean;
  ariaLabel?: string;
  role?: "button" | "group";
};

/**
 * Carte 3D : tilt suivant la souris, reflet lumineux dynamique, glow au survol.
 * Utilisable au clavier lorsqu'elle est cliquable (role="button").
 */
export function TiltCard({
  children,
  className,
  intensity = 9,
  onClick,
  selected = false,
  ariaLabel,
  role = "group",
}: TiltCardProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 200, damping: 20 });
  const sy = useSpring(py, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);

  const handleMove = (e: React.MouseEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  const interactive = Boolean(onClick);

  return (
    <motion.div
      ref={ref}
      role={interactive ? "button" : role}
      aria-label={ariaLabel}
      aria-pressed={interactive ? selected : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!interactive) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={
        reduced
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1000, transformStyle: "preserve-3d" }
      }
      whileHover={reduced ? undefined : { scale: 1.025 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl glass will-change-transform",
        "shadow-[0_18px_50px_-24px_rgba(65,79,60,0.45)] transition-shadow duration-500",
        "hover:shadow-[0_30px_70px_-28px_rgba(65,79,60,0.6)]",
        interactive && "cursor-pointer",
        selected && "ring-2 ring-sage-600 ring-offset-2 ring-offset-cream",
        className,
      )}
    >
      {/* Reflet suivant la souris */}
      {!reduced && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(320px circle at var(--gx) var(--gy), rgba(255,255,255,0.55), transparent 62%)`,
            ["--gx" as string]: glareX,
            ["--gy" as string]: glareY,
          }}
        />
      )}
      <div className="relative z-10 h-full" style={reduced ? undefined : { transform: "translateZ(28px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
