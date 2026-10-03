"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { rangeProgress, smooth01 } from "@/lib/math";
import { journeyStore } from "@/three/animation/journeyStore";
import { CampusEnvironment } from "@/three/environments/CampusEnvironment";
import { Truck } from "@/three/models/Truck";
import { DeliveryVan } from "@/three/models/DeliveryVan";
import { Train } from "@/three/models/Train";
import { Parcel } from "@/three/models/Parcel";

export function JourneyWorld({ reduced }: { reduced: boolean }) {
  const heroTruck = useRef<THREE.Group>(null);
  const secondTruck = useRef<THREE.Group>(null);
  const thirdTruck = useRef<THREE.Group>(null);
  const van = useRef<THREE.Group>(null);
  const train = useRef<THREE.Group>(null);
  const parcel = useRef<THREE.Group>(null);
  const routeGlow = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const p = journeyStore.progress;

    if (heroTruck.current) {
      const depart = smooth01(rangeProgress(p, 0.06, 0.52));
      const returnToHero = smooth01(rangeProgress(p, 0.70, 0.88));
      heroTruck.current.position.x = THREE.MathUtils.lerp(-5.8, 26, depart);
      heroTruck.current.position.z = THREE.MathUtils.lerp(8.0, 11.0, depart);
      heroTruck.current.rotation.y = -Math.PI / 2;
      heroTruck.current.position.y = 0.02;
      if (p > 0.72) {
        heroTruck.current.position.set(
          THREE.MathUtils.lerp(26, 6.2, returnToHero),
          0.02,
          THREE.MathUtils.lerp(11, 10.4, returnToHero)
        );
        heroTruck.current.rotation.y = -Math.PI / 2;
      }
    }

    if (secondTruck.current) {
      const t = smooth01(rangeProgress(p, 0.30, 0.58));
      secondTruck.current.position.set(THREE.MathUtils.lerp(2.8, 22, t), 0.02, 12.55);
      secondTruck.current.rotation.y = -Math.PI / 2;
    }

    if (thirdTruck.current) {
      const t = smooth01(rangeProgress(p, 0.43, 0.72));
      thirdTruck.current.position.set(14, 0.02, THREE.MathUtils.lerp(5, -18, t));
      thirdTruck.current.rotation.y = Math.PI;
    }

    if (van.current) {
      const t = smooth01(rangeProgress(p, 0.50, 0.74));
      van.current.position.set(14, 0.02, THREE.MathUtils.lerp(13.8, -9.5, t));
      van.current.rotation.y = Math.PI;
      van.current.visible = p > 0.38 && p < 0.82;
    }

    if (train.current) {
      const t = smooth01(rangeProgress(p, 0.22, 0.46));
      train.current.position.set(THREE.MathUtils.lerp(-24, 4, t), 0.15, -10);
      train.current.rotation.y = -Math.PI / 2;
      train.current.visible = p > 0.14 && p < 0.58;
    }

    if (parcel.current) {
      const conveyor = smooth01(rangeProgress(p, 0.15, 0.34));
      parcel.current.position.set(
        THREE.MathUtils.lerp(-5.2, 5.0, conveyor),
        0.55,
        THREE.MathUtils.lerp(-1.5, 2.8, conveyor)
      );
      parcel.current.rotation.y = state.clock.elapsedTime * 0.25;
      parcel.current.visible = p > 0.10 && p < 0.45;
    }

    if (routeGlow.current) {
      const material = routeGlow.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0.3 + Math.abs(Math.sin(state.clock.elapsedTime * 2.5)) * 0.8;
      routeGlow.current.scale.x = 0.15 + p * 0.85;
    }
  });

  return (
    <group>
      <CampusEnvironment reduced={reduced} />
      <Truck ref={heroTruck} scale={0.95} />
      <Truck ref={secondTruck} scale={0.72} />
      <Truck ref={thirdTruck} scale={0.72} />
      <DeliveryVan ref={van} scale={0.75} />
      <Train ref={train} scale={0.72} />
      <Parcel ref={parcel} />

      <mesh ref={routeGlow} position={[0, 0.15, 11.06]}>
        <boxGeometry args={[48, 0.035, 0.055]} />
        <meshStandardMaterial color="#ef3438" emissive="#ef3438" emissiveIntensity={0.5} roughness={0.45} />
      </mesh>
    </group>
  );
}
