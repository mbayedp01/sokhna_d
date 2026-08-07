"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Trees, CupSoda, Landmark, BookOpen, Frame, Footprints,
  MapPin, Sparkles, Calendar, Clock, MessageCircle, Send,
} from "lucide-react";
import { invitationSchema, type InvitationInput } from "@/lib/schema";
import { PLACES, ACTIVITIES, TIME_SLOTS, type Place, type Activity } from "@/lib/content";
import { submitInvitation } from "@/app/actions";
import { StarCalendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { FancyButton } from "@/components/ui/fancy-button";
import { Reveal } from "@/components/effects/reveal";
import { cn, formatDateFr } from "@/lib/utils";

const ICONS: Record<Activity["icon"], React.ComponentType<{ className?: string }>> = {
  Trees, CupSoda, Landmark, BookOpen, Frame, Footprints,
};

function SectionBadge({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <motion.span
      className="mb-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2 text-xs tracking-[0.25em] text-accent uppercase"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {label}
    </motion.span>
  );
}

function PlaceCard({
  place,
  selected,
  onSelect,
}: {
  place: Place;
  selected: boolean;
  onSelect: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative flex flex-col items-center gap-3 rounded-3xl glass p-6 text-center transition-all duration-300",
        selected && "border-accent/50 shadow-[0_0_30px_rgba(175,198,255,0.15)] bg-accent/10",
        !selected && "hover:bg-white/5 hover:border-white/20"
      )}
      whileHover={reduced ? undefined : { scale: 1.03, y: -4 }}
      whileTap={reduced ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <span className="text-4xl">{place.emoji}</span>
      <span className="font-display text-lg text-primary">{place.name}</span>
      <span className="text-sm text-dim/70 leading-relaxed">{place.description}</span>
      <span className="text-xs text-accent/70 tracking-wider">{place.ambiance}</span>
      {selected && (
        <motion.span
          layoutId="place-glow"
          className="absolute inset-0 rounded-3xl border border-accent/30 -z-10"
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        />
      )}
    </motion.button>
  );
}

function ActivityButton({
  activity,
  selected,
  onSelect,
}: {
  activity: Activity;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = ICONS[activity.icon];
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex flex-col items-center gap-2 rounded-2xl glass p-5 text-center transition-all duration-300",
        selected && "border-accent/50 bg-accent/10 shadow-[0_0_20px_rgba(175,198,255,0.12)]",
        !selected && "hover:bg-white/5"
      )}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <Icon className={cn("h-6 w-6 transition-colors", selected ? "text-accent" : "text-primary/60")} />
      <span className="text-sm font-medium text-primary">{activity.label}</span>
      <span className="text-xs text-dim/60">{activity.detail}</span>
    </motion.button>
  );
}

export function Planner({ onDone }: { onDone: () => void }) {
  const {
    setValue,
    watch,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<InvitationInput>({
    resolver: zodResolver(invitationSchema),
    defaultValues: { place: "", activity: "", date: "", time: "", message: "" },
  });

  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState("");
  const place = watch("place");
  const activity = watch("activity");
  const date = watch("date");
  const time = watch("time");

  const onSubmit = (data: InvitationInput) => {
    startTransition(async () => {
      const res = await submitInvitation(data);
      if (res.ok) onDone();
      else setError(res.error ?? "Une erreur est survenue.");
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative z-10 mx-auto max-w-5xl space-y-28 px-6 py-32"
    >
      {/* Places */}
      <section aria-labelledby="place-title">
        <div className="text-center">
          <SectionBadge icon={MapPin} label="Le lieu" />
          <Reveal>
            <h2 id="place-title" className="font-display text-3xl text-primary sm:text-5xl text-glow">
              Où aimerais-tu aller ?
            </h2>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLACES.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <PlaceCard place={p} selected={place === p.id} onSelect={() => setValue("place", p.id)} />
            </Reveal>
          ))}
        </div>
        {errors.place && <p className="mt-4 text-center text-sm text-red-400">{errors.place.message}</p>}
      </section>

      {/* Activities */}
      <section aria-labelledby="activity-title">
        <div className="text-center">
          <SectionBadge icon={Sparkles} label="L'activité" />
          <Reveal>
            <h2 id="activity-title" className="font-display text-3xl text-primary sm:text-5xl text-glow">
              Quelle activité te ferait plaisir ?
            </h2>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {ACTIVITIES.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06}>
              <ActivityButton activity={a} selected={activity === a.id} onSelect={() => setValue("activity", a.id)} />
            </Reveal>
          ))}
        </div>
        {errors.activity && <p className="mt-4 text-center text-sm text-red-400">{errors.activity.message}</p>}
      </section>

      {/* Date & Time */}
      <section aria-labelledby="date-title">
        <div className="text-center">
          <SectionBadge icon={Calendar} label="Le moment" />
          <Reveal>
            <h2 id="date-title" className="font-display text-3xl text-primary sm:text-5xl text-glow">
              Quel jour te conviendrait ?
            </h2>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="glass rounded-3xl p-6">
              <StarCalendar value={date} onChange={(v) => setValue("date", v)} />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-sm tracking-[0.2em] text-accent uppercase">
                <Clock className="h-4 w-4" aria-hidden /> Horaire
              </h3>
              <div className="grid grid-cols-4 gap-3">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setValue("time", t)}
                    aria-pressed={time === t}
                    className={cn(
                      "rounded-xl glass py-3 text-sm transition-all duration-300",
                      time === t
                        ? "border-accent/50 bg-accent/15 text-white shadow-[0_0_15px_rgba(175,198,255,0.15)]"
                        : "text-primary/60 hover:text-primary hover:bg-white/5"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        {(errors.date || errors.time) && (
          <p className="mt-4 text-center text-sm text-red-400">
            {errors.date?.message || errors.time?.message}
          </p>
        )}
      </section>

      {/* Message & Submit */}
      <section aria-labelledby="msg-title">
        <div className="text-center">
          <SectionBadge icon={MessageCircle} label="Un mot ?" />
          <Reveal>
            <h2 id="msg-title" className="font-display text-3xl text-primary sm:text-5xl text-glow">
              Un petit message ? (optionnel)
            </h2>
          </Reveal>
        </div>
        <Reveal>
          <div className="mx-auto mt-10 max-w-lg">
            <Textarea
              {...register("message")}
              rows={4}
              maxLength={600}
              placeholder="Si tu veux ajouter quelque chose…"
            />
          </div>
        </Reveal>

        {/* Summary */}
        <AnimatePresence>
          {(place || activity || date || time) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto mt-12 max-w-md glass rounded-3xl p-6"
            >
              <h3 className="mb-4 text-center text-sm tracking-[0.2em] text-accent uppercase">Récapitulatif</h3>
              <dl className="space-y-2 text-sm">
                {place && (
                  <div className="flex justify-between">
                    <dt className="text-dim/60">Lieu</dt>
                    <dd className="text-primary">{PLACES.find((p) => p.id === place)?.name}</dd>
                  </div>
                )}
                {activity && (
                  <div className="flex justify-between">
                    <dt className="text-dim/60">Activité</dt>
                    <dd className="text-primary">{ACTIVITIES.find((a) => a.id === activity)?.label}</dd>
                  </div>
                )}
                {date && (
                  <div className="flex justify-between">
                    <dt className="text-dim/60">Date</dt>
                    <dd className="text-primary">{formatDateFr(date)}</dd>
                  </div>
                )}
                {time && (
                  <div className="flex justify-between">
                    <dt className="text-dim/60">Heure</dt>
                    <dd className="text-primary">{time}</dd>
                  </div>
                )}
              </dl>
            </motion.div>
          )}
        </AnimatePresence>

        {error && <p className="mt-4 text-center text-sm text-red-400">{error}</p>}

        <Reveal>
          <div className="mt-12 text-center">
            <FancyButton type="submit" size="xl" variant="accent" disabled={isPending}>
              {isPending ? "Envoi…" : "Confirmer"}
              <Send className="h-5 w-5" aria-hidden />
            </FancyButton>
          </div>
        </Reveal>
      </section>
    </form>
  );
}
