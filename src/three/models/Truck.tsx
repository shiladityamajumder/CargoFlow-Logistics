"use client";

import { forwardRef, useMemo } from "react";
import type * as THREE from "three";
import { createBrandTexture } from "@/three/models/brandTexture";

export const Truck = forwardRef<THREE.Group, { scale?: number }>(function Truck({ scale = 1 }, ref) {
  const brandTexture = useMemo(() => createBrandTexture(), []);
  const wheelPositions: Array<[number, number, number]> = [
    [-1.0, 0.42, 1.65], [1.0, 0.42, 1.65],
    [-1.0, 0.42, -0.25], [1.0, 0.42, -0.25],
    [-1.0, 0.42, -2.05], [1.0, 0.42, -2.05]
  ];

  return (
    <group ref={ref} scale={scale}>
      <mesh position={[0, 1.55, -0.9]} castShadow receiveShadow>
        <boxGeometry args={[2.45, 2.25, 4.65]} />
        <meshStandardMaterial color="#e62b2f" roughness={0.38} metalness={0.05} />
      </mesh>
      <mesh position={[0, 1.55, -3.28]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 2.2, 0.18]} />
        <meshStandardMaterial color="#c71f24" roughness={0.45} />
      </mesh>
      <mesh position={[0, 1.15, 2.05]} castShadow receiveShadow>
        <boxGeometry args={[2.15, 1.6, 1.9]} />
        <meshStandardMaterial color="#f23c3f" roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.15, 2.37]} rotation={[-0.14, 0, 0]} castShadow>
        <boxGeometry args={[1.76, 0.62, 0.08]} />
        <meshStandardMaterial color="#18212a" roughness={0.18} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.05, 3.02]} castShadow>
        <boxGeometry args={[2.02, 0.52, 0.55]} />
        <meshStandardMaterial color="#d32227" roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.52, 1.03]} castShadow>
        <boxGeometry args={[2.08, 0.08, 0.36]} />
        <meshStandardMaterial color="#f5f5f2" roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.65, -0.91]}>
        <boxGeometry args={[2.47, 0.46, 3.0]} />
        <meshStandardMaterial color="#f4f4f2" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.65, -0.905]}>
        <boxGeometry args={[2.5, 0.17, 3.04]} />
        <meshStandardMaterial color="#e62b2f" roughness={0.35} />
      </mesh>
      {brandTexture && (
        <mesh position={[1.237, 1.68, -0.91]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.8, 0.7]} />
          <meshBasicMaterial map={brandTexture} transparent toneMapped={false} />
        </mesh>
      )}
      {wheelPositions.map(([x, y, z], index) => (
        <mesh key={index} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.42, 0.42, 0.24, 20]} />
          <meshStandardMaterial color="#191b1f" roughness={0.75} />
        </mesh>
      ))}
      <mesh position={[-0.62, 1.08, 3.31]}>
        <boxGeometry args={[0.34, 0.18, 0.08]} />
        <meshStandardMaterial color="#fff2c7" emissive="#ffcf5b" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.62, 1.08, 3.31]}>
        <boxGeometry args={[0.34, 0.18, 0.08]} />
        <meshStandardMaterial color="#fff2c7" emissive="#ffcf5b" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
});
