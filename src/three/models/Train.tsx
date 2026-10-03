"use client";

import { forwardRef } from "react";
import type * as THREE from "three";

export const Train = forwardRef<THREE.Group, { scale?: number }>(function Train({ scale = 1 }, ref) {
  return (
    <group ref={ref} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.25, 1.25, 4]} />
        <meshStandardMaterial color="#e62b2f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.32, 1.55]} rotation={[-0.14, 0, 0]}>
        <boxGeometry args={[1.72, 0.42, 0.08]} />
        <meshStandardMaterial color="#26313a" roughness={0.2} metalness={0.15} />
      </mesh>
      {[-4.3, -8.4].map((z) => (
        <group key={z} position={[0, 0, z]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[2.3, 1.75, 3.6]} />
            <meshStandardMaterial color="#f3f3f1" roughness={0.55} />
          </mesh>
          <mesh position={[0, 1.82, 0]}>
            <boxGeometry args={[2.34, 0.15, 3.64]} />
            <meshStandardMaterial color="#e62b2f" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
});
