"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  BookOpen,
  Check,
  Clock,
  CupSoda,
  Footprints,
  Frame,
  Landmark,
  Loader2,
  Trees,
  type LucideIcon,
} from "lucide-react";

import { ACTIVITIES, PLACES, TIME_SLOTS } from "@/lib/content";
import { invitationSchema, type InvitationInput } from "@/lib/schema";
import { formatDateFr, cn } from "@/lib/utils";
import { submitInvitation } from "@/app/actions";

import { SectionHeading } from "@/components/sections/section-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { FancyButton } from "@/components/ui/fancy-button";
import { Reveal } from "@/components/effects/reveal";
import { burstPetals } from "@/components/effects/petal-canvas";

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  Trees,
  CupSoda,
  Landmark,
  BookOpen,
  Frame,
  Footprints,
};

/**
 * Bloc principal : choix du lieu, de l'activité, de la date, de l'heure,
 * message optionnel puis confirmation (Server Action + Resend).
 */
export function Planner({ onConfirmed }: { onConfirmed: () => void }) {
  const reduced = useReducedMotion();
  const [pending, startTransition] = React.useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<InvitationInput>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { place: "", activity: "", date: "", time: "", message: "" },
    mode: "onSubmit",
  });

  const place = watch("place");
  const activity = watch("activity");
  const date = watch("date");
  const time = watch("time");

  const onSubmit = (values: InvitationInput, e?: React.BaseSyntheticEvent) => {
    setServerError(null);
    const native = e?.nativeEvent as PointerEvent | undefined;
    startTransition(async () => {
      const res = await submitInvitation(values);
      if (res.ok) {
        burstPetals(native?.clientX ?? window.innerWidth / 2, native?.clientY ?? window.innerHeight / 2, 60);
        onConfirmed();
      } else {
        setServerError(res.error ?? "Une erreur est survenue.");
      }
    });
  };

  /** Sélection d'une option + petite explosion de pétales au point cliqué. */
  const select = (field: "place" | "activity" | "time", value: string) => (e?: React.MouseEvent) => {
    setValue(field, value, { shouldValidate: true });
    if (e) burstPetals(e.clientX, e.clientY, 14);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      {/* ------------------------- Lieux ------------------------- */}
      <section id="lieux" className="px-6 py-24 sm:py-32" aria-labelledby="lieux-title">
        <SectionHeading
          id="lieux-title"
          step="Étape 1"
          title="Où aimerais-tu aller ?"
          subtitle="Quatre ambiances, toutes calmes et agréables. À toi de choisir."
        />

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PLACES.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.09}>
              <TiltCard
                selected={place === p.id}
                onClick={() => setValue("place", p.id, { shouldValidate: true })}
                ariaLabel={`Choisir : ${p.name}. ${p.description}`}
                className="h-full"
              >
                <div className="flex h-full flex-col">
                  <div
                    className="relative h-40 w-full overflow-hidden"
                    style={{ background: p.gradient }}
                    aria-hidden
                  >
                    <span className="absolute inset-0 grid place-items-center text-5xl drop-shadow-sm">
                      {p.emoji}
                    </span>
                    <span className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white/70 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <span className="text-[10px] tracking-[0.28em] text-gold uppercase">{p.ambiance}</span>
                    <h3 className="mt-2 font-display text-xl text-sage-700">{p.name}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                    <span
                      className={cn(
                        "mt-5 inline-flex items-center gap-2 text-sm font-medium transition-colors",
                        place === p.id ? "text-sage-600" : "text-ink-soft/60",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-5 w-5 place-items-center rounded-full border transition-all",
                          place === p.id ? "border-sage-600 bg-sage-600" : "border-sage-300",
                        )}
                      >
                        {place === p.id && <Check className="h-3 w-3 text-cream" aria-hidden />}
                      </span>
                      {place === p.id ? "Choisi" : "Choisir"}
                    </span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
        <FieldError message={errors.place?.message} />
      </section>

      {/* ------------------------ Activités ------------------------ */}
      <section id="activites" className="px-6 py-24 sm:py-32" aria-labelledby="activites-title">
        <SectionHeading
          id="activites-title"
          step="Étape 2"
          title="Et pour prolonger un peu ?"
          subtitle="Une activité tranquille, sans pression, juste pour le plaisir de discuter."
        />

        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ACTIVITIES.map((a, i) => {
            const Icon = ACTIVITY_ICONS[a.icon];
            const selected = activity === a.id;
            return (
              <Reveal key={a.id} delay={i * 0.07}>
                <button
                  type="button"
                  onClick={select("activity", a.id)}
                  aria-pressed={selected}
                  className={cn(
                    "group flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-400",
                    "glass hover:-translate-y-1 hover:shadow-[0_22px_44px_-24px_rgba(65,79,60,0.55)]",
                    selected ? "border-sage-500 bg-white/85" : "border-transparent",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                      selected ? "bg-sage-600 text-cream" : "bg-sage-100 text-sage-600",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-lg text-sage-700">{a.label}</span>
                    <span className="block text-sm text-ink-soft">{a.detail}</span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
        <FieldError message={errors.activity?.message} />
      </section>

      {/* --------------------- Date et heure --------------------- */}
      <section id="quand" className="px-6 py-24 sm:py-32" aria-labelledby="quand-title">
        <SectionHeading
          id="quand-title"
          step="Étape 3"
          title="Quel jour te conviendrait ?"
          subtitle="Choisis la date, puis l'horaire qui t'arrange le mieux."
        />

        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-2">
          <Reveal>
            <Calendar value={date} onChange={(iso) => setValue("date", iso, { shouldValidate: true })} />
            <FieldError message={errors.date?.message} />
          </Reveal>

          <Reveal delay={0.15}>
            <div className="glass rounded-3xl p-6 sm:p-8">
              <h3 className="mb-1 flex items-center gap-2 font-display text-xl text-sage-700">
                <Clock className="h-5 w-5" aria-hidden />
                Horaire
              </h3>
              <p className="mb-6 text-sm text-ink-soft">
                {date ? <span className="capitalize">{formatDateFr(date)}</span> : "Choisis d'abord une date."}
              </p>

              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {TIME_SLOTS.map((t) => (
                  <motion.button
                    key={t}
                    type="button"
                    onClick={select("time", t)}
                    aria-pressed={time === t}
                    whileHover={reduced ? undefined : { scale: 1.06 }}
                    whileTap={reduced ? undefined : { scale: 0.94 }}
                    className={cn(
                      "h-12 rounded-xl border text-sm font-medium transition-colors duration-250",
                      time === t
                        ? "border-sage-600 bg-sage-600 text-cream shadow-[0_10px_24px_-12px_rgba(65,79,60,0.9)]"
                        : "border-sage-200 bg-white/70 text-sage-700 hover:bg-sage-50",
                    )}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
              <FieldError message={errors.time?.message} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Message + confirmation ---------------- */}
      <section id="confirmation" className="px-6 pb-32 pt-16 sm:pb-40" aria-labelledby="confirmation-title">
        <SectionHeading
          id="confirmation-title"
          step="Étape 4"
          title="As-tu une préférence ?"
          subtitle="Un mot, une idée, une contrainte d'horaire — tout est le bienvenu. C'est optionnel."
        />

        <div className="mx-auto max-w-2xl">
          <Reveal>
            <label htmlFor="message" className="mb-3 block text-sm font-medium text-sage-700">
              Ton message (optionnel)
            </label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Par exemple : « Plutôt en fin d'après-midi, si possible. »"
              aria-describedby="message-hint"
              {...register("message")}
            />
            <p id="message-hint" className="mt-2 text-xs text-ink-soft/70">
              600 caractères maximum.
            </p>
            <FieldError message={errors.message?.message} />
          </Reveal>

          {/* Récapitulatif animé */}
          <Reveal delay={0.1}>
            <div className="mt-10 rounded-3xl border border-gold/25 bg-white/55 p-6 backdrop-blur-md">
              <h3 className="mb-4 font-display text-lg text-sage-700">Récapitulatif</h3>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <SummaryItem label="Lieu" value={PLACES.find((p) => p.id === place)?.name} />
                <SummaryItem label="Activité" value={ACTIVITIES.find((a) => a.id === activity)?.label} />
                <SummaryItem label="Date" value={date ? formatDateFr(date) : undefined} />
                <SummaryItem label="Heure" value={time || undefined} />
              </dl>
            </div>
          </Reveal>

          <div className="mt-12 text-center">
            <FancyButton type="submit" size="xl" variant="gold" disabled={pending} className="w-full sm:w-auto">
              {pending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  Envoi…
                </>
              ) : (
                <>Confirmer</>
              )}
            </FancyButton>

            <div className="mt-5 min-h-6" aria-live="assertive">
              <AnimatePresence>
                {serverError && (
                  <motion.p
                    className="text-sm text-sage-700"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {serverError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}

/** Message d'erreur de champ, annoncé aux lecteurs d'écran. */
function FieldError({ message }: { message?: string }) {
  return (
    <div className="mt-4 text-center" aria-live="polite">
      <AnimatePresence>
        {message && (
          <motion.p
            className="text-sm font-medium text-sage-700"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Ligne du récapitulatif. */
function SummaryItem({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="text-[11px] tracking-[0.2em] text-ink-soft/60 uppercase">{label}</dt>
      <dd className="font-display text-base text-sage-700">
        <AnimatePresence mode="wait">
          <motion.span
            key={value ?? "vide"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            {value ?? "—"}
          </motion.span>
        </AnimatePresence>
      </dd>
    </div>
  );
}
