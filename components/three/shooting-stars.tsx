"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Streak = {
  start: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  life: number;
  maxLife: number;
  length: number;
};

export function ShootingStars() {
  const lineRef = React.useRef<THREE.LineSegments>(null);
  const streaksRef = React.useRef<Streak[]>([]);
  const timerRef = React.useRef(0);

  const maxStreaks = 4;
  const posArray = React.useMemo(() => new Float32Array(maxStreaks * 6), []);
  const alphaArray = React.useMemo(() => new Float32Array(maxStreaks * 2), []);

  const spawn = React.useCallback(() => {
    const x = (Math.random() - 0.5) * 60;
    const y = 10 + Math.random() * 20;
    const z = -20 - Math.random() * 30;
    const s: Streak = {
      start: new THREE.Vector3(x, y, z),
      dir: new THREE.Vector3(-0.5 - Math.random() * 0.5, -0.6 - Math.random() * 0.4, 0).normalize(),
      speed: 30 + Math.random() * 40,
      life: 0,
      maxLife: 0.6 + Math.random() * 0.8,
      length: 2 + Math.random() * 3,
    };
    if (streaksRef.current.length < maxStreaks) {
      streaksRef.current.push(s);
    }
  }, []);

  useFrame((_, delta) => {
    timerRef.current += delta;
    if (timerRef.current > 1.5 + Math.random() * 3) {
      timerRef.current = 0;
      spawn();
    }

    const geo = lineRef.current?.geometry;
    if (!geo) return;

    const streaks = streaksRef.current;
    for (let i = 0; i < maxStreaks; i++) {
      if (i < streaks.length) {
        const s = streaks[i];
        s.life += delta;
        const pos = s.start.clone().addScaledVector(s.dir, s.life * s.speed);
        const tail = pos.clone().addScaledVector(s.dir, -s.length);
        posArray[i * 6] = tail.x;
        posArray[i * 6 + 1] = tail.y;
        posArray[i * 6 + 2] = tail.z;
        posArray[i * 6 + 3] = pos.x;
        posArray[i * 6 + 4] = pos.y;
        posArray[i * 6 + 5] = pos.z;
        const a = 1 - s.life / s.maxLife;
        alphaArray[i * 2] = a * 0.3;
        alphaArray[i * 2 + 1] = a;
      } else {
        for (let j = 0; j < 6; j++) posArray[i * 6 + j] = 0;
        alphaArray[i * 2] = 0;
        alphaArray[i * 2 + 1] = 0;
      }
    }

    streaksRef.current = streaks.filter((s) => s.life < s.maxLife);

    geo.attributes.position.needsUpdate = true;
    geo.attributes.alpha.needsUpdate = true;
  });

  return (
    <lineSegments ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[posArray, 3]} count={maxStreaks * 2} />
        <bufferAttribute attach="attributes-alpha" args={[alphaArray, 1]} count={maxStreaks * 2} />
      </bufferGeometry>
      <lineBasicMaterial color="#E8EEFF" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}
