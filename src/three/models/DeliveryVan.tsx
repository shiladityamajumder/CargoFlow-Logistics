"use client";

import { forwardRef } from "react";
import type * as THREE from "three";

export const DeliveryVan = forwardRef<THREE.Group, { scale?: number }>(function DeliveryVan({ scale = 1 }, ref) {
  return (
    <group ref={ref} scale={scale}>
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 1.55, 3.2]} />
        <meshStandardMaterial color="#e62b2f" roughness={0.38} />
      </mesh>
      <mesh position={[0, 1.28, 1.28]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[1.48, 0.62, 0.08]} />
        <meshStandardMaterial color="#202a32" roughness={0.2} metalness={0.15} />
      </mesh>
      {[-0.7, 0.7].flatMap((x) => [-1.05, 1.05].map((z) => (
        <mesh key={`${x}-${z}`} position={[x, 0.35, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.22, 18]} />
          <meshStandardMaterial color="#1c1e22" roughness={0.8} />
        </mesh>
      )))}
    </group>
  );
});
