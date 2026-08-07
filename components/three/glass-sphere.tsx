"use client";

import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

export function GlassSphere({
  visible = true,
  onClick,
}: {
  visible?: boolean;
  onClick?: () => void;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * 0.3,
      0.02
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -pointer.x * 0.2,
      0.02
    );
    meshRef.current.position.y = -4 + Math.sin(state.clock.elapsedTime * 0.4) * 0.3;
  });

  if (!visible) return null;

  return (
    <group>
      {/* Inner glow core */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial color="#AFC6FF" transparent opacity={0.08} />
      </mesh>
      {/* Glass sphere */}
      <mesh ref={meshRef} onClick={onClick}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          thickness={0.5}
          chromaticAberration={0.15}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          ior={1.5}
          color="#DCE7FF"
          roughness={0}
          transmission={1}
        />
      </mesh>
      {/* Outer ring glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.1, 2.4, 64]} />
        <meshBasicMaterial color="#AFC6FF" transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
