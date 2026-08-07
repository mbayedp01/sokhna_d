"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CloudLayer({ y, z, speed, opacity }: { y: number; z: number; speed: number; opacity: number }) {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.x = Math.sin(state.clock.elapsedTime * speed) * 3;
    meshRef.current.position.y = y + Math.sin(state.clock.elapsedTime * speed * 0.7) * 0.5;
  });

  return (
    <mesh ref={meshRef} position={[0, y, z]}>
      <planeGeometry args={[40, 8]} />
      <meshBasicMaterial color="#1a2244" transparent opacity={opacity} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export function Clouds() {
  return (
    <group>
      <CloudLayer y={4} z={-20} speed={0.08} opacity={0.15} />
      <CloudLayer y={2} z={-15} speed={0.05} opacity={0.1} />
      <CloudLayer y={-1} z={-25} speed={0.06} opacity={0.12} />
    </group>
  );
}
