"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";
import { journeyStore } from "@/three/animation/journeyStore";

export function JourneyLighting() {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const fillRef = useRef<THREE.HemisphereLight>(null);

  useFrame(() => {
    const p = journeyStore.progress;
    if (keyRef.current) {
      keyRef.current.intensity = 2.0 + Math.sin(p * Math.PI) * 0.45;
      keyRef.current.position.set(12 - p * 8, 24, 16 - p * 5);
    }
    if (fillRef.current) {
      fillRef.current.intensity = 1.2 + p * 0.15;
    }
  });

  return (
    <>
      <hemisphereLight ref={fillRef} args={["#f8fbff", "#cdd4d8", 1.2]} />
      <directionalLight ref={keyRef} position={[12, 24, 16]} intensity={2.2} color="#fff5ec" castShadow shadow-mapSize={[1536, 1536]} shadow-camera-far={70} shadow-camera-left={-35} shadow-camera-right={35} shadow-camera-top={35} shadow-camera-bottom={-35} />
      <directionalLight position={[-18, 10, -12]} intensity={0.65} color="#d6f8f1" />
    </>
  );
}
