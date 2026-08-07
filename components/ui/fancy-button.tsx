"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export function FancyButton({ children, className, ...props }: ButtonProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="relative"
      whileHover={reduced ? undefined : { scale: 1.05 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Glow behind */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 rounded-full bg-accent/20 blur-xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
      />
      <Button
        className={cn(
          "group overflow-hidden",
          "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
