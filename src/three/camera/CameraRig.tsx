"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { interpolateVec3, smoother01 } from "@/lib/math";
import { journeyStore } from "@/three/animation/journeyStore";

const CAMERA_POSITION = [
  { progress: 0.00, value: [24, 18, 28] as const },
  { progress: 0.10, value: [17, 13, 21] as const },
  { progress: 0.20, value: [8, 15, 11] as const },
  { progress: 0.34, value: [-1, 17, 2] as const },
  { progress: 0.48, value: [22, 10, 18] as const },
  { progress: 0.62, value: [34, 13, -4] as const },
  { progress: 0.74, value: [24, 8, -4] as const },
  { progress: 0.88, value: [10, 5.8, 20] as const },
  { progress: 1.00, value: [7.8, 4.5, 15] as const }
];

const CAMERA_TARGET = [
  { progress: 0.00, value: [0, 1.8, 0] as const },
  { progress: 0.10, value: [0, 2.0, 0] as const },
  { progress: 0.20, value: [0, 1.8, 0] as const },
  { progress: 0.34, value: [1, 1.3, 0] as const },
  { progress: 0.48, value: [11, 1.3, 10] as const },
  { progress: 0.62, value: [23, 3.2, -11] as const },
  { progress: 0.74, value: [28, 3.2, -12] as const },
  { progress: 0.88, value: [6, 1.3, 10] as const },
  { progress: 1.00, value: [6, 1.3, 10] as const }
];

function fovAt(progress: number, mobile: boolean): number {
  const stops = [
    [0, 34], [0.18, 38], [0.36, 42], [0.60, 38], [0.76, 34], [1, 36]
  ] as const;
  for (let i = 0; i < stops.length - 1; i += 1) {
    const a = stops[i];
    const b = stops[i + 1];
    if (progress >= a[0] && progress <= b[0]) {
      const t = smoother01((progress - a[0]) / (b[0] - a[0]));
      return THREE.MathUtils.lerp(a[1], b[1], t) + (mobile ? 9 : 0);
    }
  }
  return 36 + (mobile ? 9 : 0);
}

export function CameraRig({ mobile }: { mobile: boolean }) {
  const camera = useThree((state) => state.camera as THREE.PerspectiveCamera);
  const desiredTarget = new THREE.Vector3();

  useFrame(() => {
    const p = journeyStore.progress;
    const position = interpolateVec3(p, CAMERA_POSITION);
    const target = interpolateVec3(p, CAMERA_TARGET);

    if (mobile) {
      position.x *= 0.88;
      position.y += 2.4;
      position.z += 4.5;
      target.y += 0.5;
    }

    camera.position.copy(position);
    desiredTarget.copy(target);
    camera.lookAt(desiredTarget);
    camera.fov = fovAt(p, mobile);
    camera.updateProjectionMatrix();
  });

  return null;
}
