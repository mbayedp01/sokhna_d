"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function pad(n: number) { return String(n).padStart(2, "0"); }

export function StarCalendar({
  value,
  onChange,
}: {
  value?: string;
  onChange: (iso: string) => void;
}) {
  const today = new Date();
  const [month, setMonth] = React.useState(today.getMonth());
  const [year, setYear] = React.useState(today.getFullYear());
  const [dir, setDir] = React.useState(1);

  const firstDay = new Date(year, month, 1);
  const startDow = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = () => {
    setDir(-1);
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const next = () => {
    setDir(1);
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button
          type="button"
          onClick={prev}
          className="p-2 rounded-full hover:bg-white/5 text-primary/60 hover:text-primary transition-colors"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="font-display text-lg text-primary">{MONTHS[month]} {year}</span>
        <button
          type="button"
          onClick={next}
          className="p-2 rounded-full hover:bg-white/5 text-primary/60 hover:text-primary transition-colors"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-xs text-dim/60 py-1">{d}</div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={`${year}-${month}`}
          initial={{ opacity: 0, x: dir * 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -dir * 30 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-7 gap-1"
        >
          {Array.from({ length: startDow }).map((_, i) => (
            <div key={`e-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const iso = `${year}-${pad(month + 1)}-${pad(day)}`;
            const isPast = iso < todayStr;
            const isSelected = value === iso;
            const isToday = iso === todayStr;

            return (
              <button
                key={day}
                type="button"
                disabled={isPast}
                onClick={() => onChange(iso)}
                aria-label={`${day} ${MONTHS[month]} ${year}`}
                aria-pressed={isSelected}
                className={cn(
                  "relative aspect-square flex items-center justify-center rounded-full text-sm transition-all duration-300",
                  isPast && "opacity-20 cursor-not-allowed",
                  !isPast && !isSelected && "hover:bg-accent/15 text-primary/80 hover:text-primary",
                  isSelected && "bg-accent/30 text-white shadow-[0_0_20px_rgba(175,198,255,0.3)] border border-accent/40",
                )}
              >
                {day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-accent" />
                )}
                {isSelected && (
                  <motion.span
                    layoutId="star-selected"
                    className="absolute inset-0 rounded-full bg-accent/10 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
