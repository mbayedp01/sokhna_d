"use client";

import * as React from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import { Stars } from "./stars";
import { Moon } from "./moon";
import { Clouds } from "./clouds";
import { GlassSphere } from "./glass-sphere";
import { ShootingStars } from "./shooting-stars";

export function NightScene({
  showSphere = false,
  onSphereClick,
  showShootingStars = false,
}: {
  showSphere?: boolean;
  onSphereClick?: () => void;
  showShootingStars?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60, near: 0.1, far: 200 }}
        dpr={[1, reduced ? 1 : 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "#05070D" }}
      >
        <ambientLight intensity={0.15} />
        <directionalLight position={[10, 10, -20]} intensity={0.4} color="#F7F3E9" />
        <pointLight position={[8, 6, -28]} intensity={2} color="#F7F3E9" distance={50} decay={2} />

        <Stars count={reduced ? 600 : 2000} />
        <Moon />
        <Clouds />
        <GlassSphere visible={showSphere} onClick={onSphereClick} />
        {showShootingStars && <ShootingStars />}
      </Canvas>
    </div>
  );
}
