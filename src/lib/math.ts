import * as THREE from "three";

export function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function rangeProgress(progress: number, start: number, end: number): number {
  if (end <= start) return progress >= end ? 1 : 0;
  return clamp01((progress - start) / (end - start));
}

export function smooth01(value: number): number {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

export function smoother01(value: number): number {
  const t = clamp01(value);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export type Vec3Keyframe = {
  progress: number;
  value: readonly [number, number, number];
};

export function interpolateVec3(progress: number, frames: readonly Vec3Keyframe[]): THREE.Vector3 {
  if (frames.length === 0) return new THREE.Vector3();
  if (progress <= frames[0].progress) return new THREE.Vector3(...frames[0].value);
  const last = frames[frames.length - 1];
  if (progress >= last.progress) return new THREE.Vector3(...last.value);

  for (let i = 0; i < frames.length - 1; i += 1) {
    const a = frames[i];
    const b = frames[i + 1];
    if (progress >= a.progress && progress <= b.progress) {
      const local = smoother01((progress - a.progress) / (b.progress - a.progress));
      return new THREE.Vector3().lerpVectors(new THREE.Vector3(...a.value), new THREE.Vector3(...b.value), local);
    }
  }

  return new THREE.Vector3(...last.value);
}

export function damp(current: number, target: number, lambda: number, dt: number): number {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}
