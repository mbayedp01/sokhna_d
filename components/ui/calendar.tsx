"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * Calendrier maison, animé, entièrement navigable au clavier.
 * Les dates passées sont désactivées.
 */
export function Calendar({
  value,
  onChange,
  className,
}: {
  value?: string;
  onChange: (iso: string) => void;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const today = React.useMemo(() => startOfDay(new Date()), []);
  const [cursor, setCursor] = React.useState(() => {
    const base = value ? new Date(`${value}T12:00:00`) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });
  const [direction, setDirection] = React.useState(1);

  const move = (delta: number) => {
    setDirection(delta);
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  };

  // Grille : décalage lundi-first + jours du mois.
  const firstWeekday = (cursor.getDay() + 6) % 7;
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  const monthLabel = `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;

  return (
    <div className={cn("glass w-full rounded-3xl p-5 sm:p-7", className)}>
      <div className="mb-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          aria-label="Mois précédent"
          className="grid h-11 w-11 place-items-center rounded-full border border-sage-200 bg-white/70 text-sage-700 transition hover:bg-sage-50"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden />
        </button>

        <div className="relative h-7 overflow-hidden px-4" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={monthLabel}
              className="block font-display text-lg capitalize text-sage-700"
              initial={reduced ? false : { y: direction * 22, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? undefined : { y: direction * -22, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {monthLabel}
            </motion.span>
          </AnimatePresence>
        </div>

        <button
          type="button"
          onClick={() => move(1)}
          aria-label="Mois suivant"
          className="grid h-11 w-11 place-items-center rounded-full border border-sage-200 bg-white/70 text-sage-700 transition hover:bg-sage-50"
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium tracking-widest text-ink-soft/70">
        {WEEKDAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {cells.map((date, i) => {
          if (!date) return <span key={`e-${i}`} />;
          const iso = toISO(date);
          const disabled = date < today;
          const selected = value === iso;
          return (
            <motion.button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onChange(iso)}
              aria-label={date.toLocaleDateString("fr-FR", { dateStyle: "full" })}
              aria-pressed={selected}
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: reduced ? 0 : i * 0.008 }}
              whileHover={disabled || reduced ? undefined : { scale: 1.12 }}
              whileTap={disabled || reduced ? undefined : { scale: 0.92 }}
              className={cn(
                "relative aspect-square rounded-xl text-sm font-medium transition-colors duration-200",
                disabled && "cursor-not-allowed text-ink-soft/25",
                !disabled && !selected && "text-ink hover:bg-sage-100",
                selected && "bg-sage-600 text-cream shadow-[0_8px_20px_-8px_rgba(65,79,60,0.8)]",
              )}
            >
              {date.getDate()}
              {toISO(today) === iso && !selected && (
                <span aria-hidden className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
