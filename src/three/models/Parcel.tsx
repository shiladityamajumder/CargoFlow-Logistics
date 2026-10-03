"use client";

import { forwardRef } from "react";
import type * as THREE from "three";

export const Parcel = forwardRef<THREE.Group>(function Parcel(_, ref) {
  return (
    <group ref={ref}>
      <mesh castShadow>
        <boxGeometry args={[0.75, 0.58, 0.75]} />
        <meshStandardMaterial color="#c99a5b" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.14, 0.025, 0.77]} />
        <meshStandardMaterial color="#e62b2f" roughness={0.55} />
      </mesh>
    </group>
  );
});
