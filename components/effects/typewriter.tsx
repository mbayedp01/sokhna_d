"use client";

import * as React from "react";

export function Typewriter({
  text,
  speed = 55,
  startDelay = 0,
  onDone,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
}) {
  const [displayed, setDisplayed] = React.useState("");
  const doneRef = React.useRef(false);

  React.useEffect(() => {
    doneRef.current = false;
    setDisplayed("");
    let i = 0;
    const start = window.setTimeout(() => {
      const step = () => {
        if (i >= text.length) {
          if (!doneRef.current) {
            doneRef.current = true;
            onDone?.();
          }
          return;
        }
        i++;
        setDisplayed(text.slice(0, i));
        const ch = text[i - 1];
        const pause = ch === "." || ch === "," || ch === "…" || ch === "?" || ch === "!" ? speed * 4 : speed;
        window.setTimeout(step, pause);
      };
      step();
    }, startDelay);
    return () => window.clearTimeout(start);
  }, [text, speed, startDelay, onDone]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {displayed}
        <span className="inline-block w-[2px] h-[1em] bg-accent/70 ml-0.5 animate-pulse align-text-bottom" />
      </span>
    </>
  );
}
