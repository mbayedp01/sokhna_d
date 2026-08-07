"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Moon({ position = [8, 6, -30] as [number, number, number] }) {
  const groupRef = React.useRef<THREE.Group>(null);
  const glowRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.15) * 0.3;
    }
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
      glowRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[4.5, 32, 32]} />
        <meshBasicMaterial color="#F7F3E9" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      {/* Mid glow */}
      <mesh>
        <sphereGeometry args={[3.2, 32, 32]} />
        <meshBasicMaterial color="#F7F3E9" transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      {/* Moon surface */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <meshStandardMaterial
          color="#F7F3E9"
          emissive="#F7F3E9"
          emissiveIntensity={0.3}
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </group>
  );
}
