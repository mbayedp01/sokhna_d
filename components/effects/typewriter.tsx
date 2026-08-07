"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

type TypewriterProps = {
  text: string;
  /** Délai avant le premier caractère (ms). */
  startDelay?: number;
  /** Vitesse moyenne par caractère (ms). */
  speed?: number;
  className?: string;
  onDone?: () => void;
  showCaret?: boolean;
};

/**
 * Effet machine à écrire.
 * Le texte complet est fourni aux lecteurs d'écran d'emblée (span sr-only),
 * et s'affiche instantanément si l'utilisateur limite les animations.
 */
export function Typewriter({
  text,
  startDelay = 0,
  speed = 55,
  className,
  onDone,
  showCaret = true,
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const [shown, setShown] = React.useState("");
  const doneRef = React.useRef(onDone);
  doneRef.current = onDone;

  React.useEffect(() => {
    if (reduced) {
      setShown(text);
      const id = window.setTimeout(() => doneRef.current?.(), 250);
      return () => window.clearTimeout(id);
    }

    setShown("");
    let i = 0;
    let timer = 0;

    const step = () => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        doneRef.current?.();
        return;
      }
      // Variation légère + pause sur la ponctuation : rythme plus humain.
      const ch = text[i - 1];
      const delay = ",.!?…".includes(ch) ? speed * 6 : speed * (0.7 + Math.random() * 0.7);
      timer = window.setTimeout(step, delay);
    };

    timer = window.setTimeout(step, startDelay);
    return () => window.clearTimeout(timer);
  }, [text, speed, startDelay, reduced]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>{shown}</span>
      {showCaret && !reduced && shown.length < text.length && (
        <span
          aria-hidden
          className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-sage-500 motion-safe:animate-pulse"
        />
      )}
    </span>
  );
}
