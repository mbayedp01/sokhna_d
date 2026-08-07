"use client";

import * as React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    vec3 pos = position;
    float twinkle = sin(uTime * 0.8 + aPhase) * 0.5 + 0.5;
    vAlpha = 0.4 + twinkle * 0.6;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = 1.0 - smoothstep(0.0, 0.5, d);
    glow = pow(glow, 1.5);
    gl_FragColor = vec4(0.9, 0.93, 1.0, glow * vAlpha);
  }
`;

export function Stars({ count = 2000 }: { count?: number }) {
  const meshRef = React.useRef<THREE.Points>(null);
  const uniformsRef = React.useRef({ uTime: { value: 0 } });

  const { positions, sizes, phases } = React.useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 60;
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
      s[i] = 0.5 + Math.random() * 2.5;
      ph[i] = Math.random() * Math.PI * 2;
    }
    return { positions: p, sizes: s, phases: ph };
  }, [count]);

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniformsRef.current}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
