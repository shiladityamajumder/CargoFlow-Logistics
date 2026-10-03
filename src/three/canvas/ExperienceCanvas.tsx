"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { CameraRig } from "@/three/camera/CameraRig";
import { JourneyLighting } from "@/three/lighting/JourneyLighting";
import { JourneyWorld } from "@/three/world/JourneyWorld";
import { journeyStore } from "@/three/animation/journeyStore";
import { useIsMobile } from "@/hooks/useIsMobile";

export function ExperienceCanvas() {
  const mobile = useIsMobile();

  return (
    <Canvas
      className="journey-canvas"
      camera={{ position: [24, 18, 28], fov: 34, near: 0.1, far: 140 }}
      dpr={mobile ? [1, 1.15] : [1, 1.5]}
      shadows={!mobile}
      gl={{ antialias: !mobile, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.06;
        journeyStore.canvasReady = true;
      }}
    >
      <color attach="background" args={["#f8f8f6"]} />
      <fog attach="fog" args={["#f8f8f6", 38, 85]} />
      <JourneyLighting />
      <CameraRig mobile={mobile} />
      <JourneyWorld reduced={mobile} />
    </Canvas>
  );
}
