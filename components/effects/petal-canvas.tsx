"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";
import { rand } from "@/lib/utils";

/** Déclenche une explosion de pétales depuis n'importe où dans l'app. */
export function burstPetals(x: number, y: number, count = 26) {
  window.dispatchEvent(new CustomEvent("petals:burst", { detail: { x, y, count } }));
}

type Petal = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vrot: number;
  hueIndex: number;
  life: number; // 1 → 0 ; -1 = pétale d'ambiance (infini)
  drift: number;
  phase: number;
};

const COLORS = ["#dde5d8", "#c2d0b9", "#e8dcc6", "#d9c08a", "#f7f2e7", "#a3b795"];

/**
 * Système de pétales unique (canvas) : ambiance qui tombe lentement,
 * traînée légère qui suit la souris, explosion à chaque clic.
 * Un seul canvas + une seule boucle rAF pour préserver les performances.
 */
export function PetalCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const petals: Petal[] = [];
    const pointer = { x: -999, y: -999, moved: false };
    let raf = 0;
    let last = performance.now();
    let firstFill = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /** Densité adaptée à la taille d'écran (mobile = moins de particules). */
    const ambientTarget = () => (window.innerWidth < 768 ? 14 : 26);

    const makeAmbient = (atTop = false): Petal => ({
      x: rand(0, width),
      y: atTop ? rand(-height * 0.35, -20) : rand(0, height),
      vx: rand(-8, 8),
      vy: rand(26, 58),
      size: rand(7, 16),
      rot: rand(0, Math.PI * 2),
      vrot: rand(-0.6, 0.6),
      hueIndex: Math.floor(rand(0, COLORS.length)),
      life: -1,
      drift: rand(10, 26),
      phase: rand(0, Math.PI * 2),
    });

    const drawPetal = (p: Petal, alpha: number) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS[p.hueIndex];
      ctx.beginPath();
      // Forme de pétale : deux courbes de Bézier symétriques.
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.5, p.size * 0.6, p.size * 0.6, 0, p.size);
      ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.6, -p.size * 0.8, -p.size * 0.5, 0, -p.size);
      ctx.fill();
      ctx.restore();
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      ctx.clearRect(0, 0, width, height);

      // Maintien de la densité d'ambiance.
      // Au premier remplissage on répartit les pétales sur tout l'écran,
      // ensuite les nouveaux arrivent par le haut.
      let ambient = 0;
      for (const p of petals) if (p.life === -1) ambient++;
      while (ambient < ambientTarget()) {
        petals.push(makeAmbient(!firstFill));
        ambient++;
      }
      firstFill = false;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.phase += dt * 1.6;

        if (p.life === -1) {
          // Chute lente + oscillation latérale
          p.x += (p.vx + Math.sin(p.phase) * p.drift) * dt;
          p.y += p.vy * dt;
          p.rot += p.vrot * dt;
          if (p.y - p.size > height) Object.assign(p, makeAmbient(true));
          if (p.x < -40) p.x = width + 40;
          if (p.x > width + 40) p.x = -40;
          drawPetal(p, 0.55);
        } else {
          // Pétales éphémères (clic / souris) : gravité douce + frottement
          p.vy += 240 * dt;
          p.vx *= 1 - 1.4 * dt;
          p.vy *= 1 - 0.5 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.rot += p.vrot * dt;
          p.life -= dt * 0.75;
          if (p.life <= 0) {
            petals.splice(i, 1);
            continue;
          }
          drawPetal(p, Math.min(1, p.life) * 0.9);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    const spawnBurst = (x: number, y: number, count: number) => {
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count + rand(-0.2, 0.2);
        const speed = rand(90, 320);
        petals.push({
          x,
          y,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 60,
          size: rand(5, 13),
          rot: rand(0, Math.PI * 2),
          vrot: rand(-6, 6),
          hueIndex: Math.floor(rand(0, COLORS.length)),
          life: rand(0.8, 1.4),
          drift: 0,
          phase: 0,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      // Traînée très légère : un pétale de temps en temps seulement.
      if (Math.random() > 0.9) {
        petals.push({
          x: e.clientX + rand(-8, 8),
          y: e.clientY + rand(-8, 8),
          vx: rand(-30, 30),
          vy: rand(-10, 30),
          size: rand(4, 9),
          rot: rand(0, Math.PI * 2),
          vrot: rand(-3, 3),
          hueIndex: Math.floor(rand(0, COLORS.length)),
          life: rand(0.5, 0.9),
          drift: 0,
          phase: 0,
        });
      }
    };

    const onClick = (e: PointerEvent) => spawnBurst(e.clientX, e.clientY, 24);
    const onBurst = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number; count: number }>).detail;
      spawnBurst(d.x, d.y, d.count);
    };
    const onVisibility = () => {
      last = performance.now();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onClick, { passive: true });
    window.addEventListener("petals:burst", onBurst as EventListener);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("petals:burst", onBurst as EventListener);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}
