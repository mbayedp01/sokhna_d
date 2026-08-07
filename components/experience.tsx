"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { SmoothScroll } from "@/components/effects/smooth-scroll";

const NightScene = dynamic(
  () => import("@/components/three/scene").then((m) => m.NightScene),
  { ssr: false }
);
const Intro = dynamic(
  () => import("@/components/sections/intro").then((m) => m.Intro),
  { ssr: false }
);
const Planner = dynamic(
  () => import("@/components/sections/planner").then((m) => m.Planner),
  { ssr: false }
);
const Confirmation = dynamic(
  () => import("@/components/sections/confirmation").then((m) => m.Confirmation),
  { ssr: false }
);

type Stage = "intro" | "plan" | "done";

export function Experience() {
  const reduced = useReducedMotion();
  const [stage, setStage] = React.useState<Stage>("intro");
  const [showSphere, setShowSphere] = React.useState(false);
  const [moonClicks, setMoonClicks] = React.useState(0);
  const [showShootingStars, setShowShootingStars] = React.useState(false);

  React.useEffect(() => {
    const t = window.setTimeout(() => setShowSphere(true), reduced ? 800 : 5500);
    return () => window.clearTimeout(t);
  }, [reduced]);

  const handleDiscover = React.useCallback(() => {
    if (reduced) {
      setStage("plan");
      return;
    }
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:100;background:#DCE7FF;opacity:0;pointer-events:none;";
    document.body.appendChild(overlay);
    const tl = gsap.timeline({
      onComplete: () => {
        setStage("plan");
        gsap.to(overlay, { opacity: 0, duration: 1.2, ease: "power2.out", onComplete: () => overlay.remove() });
      },
    });
    tl.to(overlay, { opacity: 0.9, duration: 0.8, ease: "power2.in" });
  }, [reduced]);

  React.useEffect(() => {
    if (stage === "intro" || stage === "done") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [stage]);

  return (
    <SmoothScroll>
      <NightScene
        showSphere={showSphere && stage === "intro"}
        showShootingStars={showShootingStars}
      />

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-primary">
        Aller au contenu
      </a>

      <main id="main">
        <AnimatePresence mode="wait">
          {stage === "intro" && (
            <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              <Intro onContinue={handleDiscover} />
            </motion.div>
          )}

          {stage === "plan" && (
            <motion.div
              key="plan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <Planner onDone={() => setStage("done")} />
            </motion.div>
          )}
        </AnimatePresence>

        {stage === "done" && <Confirmation />}
      </main>
    </SmoothScroll>
  );
}
