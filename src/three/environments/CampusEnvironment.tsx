"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { rangeProgress, smooth01 } from "@/lib/math";
import { journeyStore } from "@/three/animation/journeyStore";
import { createBrandTexture } from "@/three/models/brandTexture";

function Tree({ x, z, scale = 1 }: { x: number; z: number; scale?: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.46, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 0.9, 8]} />
        <meshStandardMaterial color="#8c7d68" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.26, 0]} castShadow>
        <icosahedronGeometry args={[0.67, 1]} />
        <meshStandardMaterial color="#22c7a6" roughness={0.72} />
      </mesh>
      <mesh position={[0.25, 1.02, 0.15]} castShadow>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#4ed3b7" roughness={0.75} />
      </mesh>
    </group>
  );
}

function YardPerson({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} scale={0.58}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.42, 3, 6]} />
        <meshStandardMaterial color="#303638" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.83, 0]} castShadow>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#d8c1a2" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Warehouse() {
  const roofRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const brandTexture = useMemo(() => createBrandTexture(), []);

  useFrame(() => {
    const p = journeyStore.progress;
    const reveal = smooth01(rangeProgress(p, 0.14, 0.30));
    if (roofRef.current) {
      roofRef.current.position.y = reveal * 6.5;
      roofRef.current.rotation.z = reveal * -0.08;
      roofRef.current.visible = p < 0.42;
    }
    if (shellRef.current) {
      const material = shellRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 1 - reveal * 0.78;
      material.transparent = true;
      material.depthWrite = material.opacity > 0.35;
    }
  });

  const rackRows = [-3.8, -1.9, 0, 1.9, 3.8];
  const rackCols = [-4.8, -2.4, 0, 2.4, 4.8];

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={shellRef} position={[0, 3.0, 0]} receiveShadow castShadow>
        <boxGeometry args={[24, 6, 13]} />
        <meshStandardMaterial color="#d9dddc" roughness={0.72} />
      </mesh>

      <group ref={roofRef}>
        <mesh position={[0, 6.2, 0]} castShadow>
          <boxGeometry args={[24.8, 0.42, 13.8]} />
          <meshStandardMaterial color="#d71925" roughness={0.5} />
        </mesh>
        <mesh position={[0, 5.65, 6.58]}>
          <boxGeometry args={[24.4, 1.12, 0.32]} />
          <meshStandardMaterial color="#e62b2f" roughness={0.42} />
        </mesh>
        {brandTexture && (
          <mesh position={[0, 5.66, 6.76]}>
            <planeGeometry args={[3.0, 0.72]} />
            <meshBasicMaterial map={brandTexture} transparent toneMapped={false} />
          </mesh>
        )}
      </group>

      {[-9, -6, -3, 0, 3, 6, 9].map((x) => (
        <group key={x} position={[x, 0, 6.68]}>
          <mesh position={[0, 1.8, 0.13]}>
            <boxGeometry args={[2.65, 3.35, 0.12]} />
            <meshStandardMaterial color="#737a7c" roughness={0.65} />
          </mesh>
          <mesh position={[0, 0.35, 0.32]}>
            <boxGeometry args={[2.8, 0.42, 1.1]} />
            <meshStandardMaterial color="#c4c9c8" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {rackRows.flatMap((z, row) => rackCols.map((x, col) => (
        <group key={`${row}-${col}`} position={[x, 0.4, z]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[1.75, 2.4, 0.65]} />
            <meshStandardMaterial color="#81888b" roughness={0.65} />
          </mesh>
          {[0.45, 1.15, 1.85].map((y) => (
            <mesh key={y} position={[0, y, 0.38]} castShadow>
              <boxGeometry args={[1.55, 0.48, 0.55]} />
              <meshStandardMaterial color={(row + col) % 3 === 0 ? "#d9a463" : "#be8a4f"} roughness={0.85} />
            </mesh>
          ))}
        </group>
      )))}
    </group>
  );
}

function OfficeHub() {
  return (
    <group position={[22, 0, -11]}>
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[15, 4.6, 10]} />
        <meshStandardMaterial color="#e5e7e5" roughness={0.72} />
      </mesh>
      <mesh position={[0, 4.66, 5.05]}>
        <boxGeometry args={[14.8, 0.55, 0.18]} />
        <meshStandardMaterial color="#e21d2b" roughness={0.45} />
      </mesh>
      {[-4.5, 0, 4.5].map((x) => (
        <mesh key={x} position={[x, 1.9, 5.12]}>
          <boxGeometry args={[3.1, 3.3, 0.1]} />
          <meshStandardMaterial color="#c8ccca" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function RoadNetwork() {
  return (
    <group>
      <mesh position={[0, 0.03, 11]} receiveShadow>
        <boxGeometry args={[56, 0.12, 5.5]} />
        <meshStandardMaterial color="#e1e3e1" roughness={0.92} />
      </mesh>
      <mesh position={[14, 0.04, -5]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[36, 0.13, 4.6]} />
        <meshStandardMaterial color="#e3e4e2" roughness={0.92} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={`mark-${i}`} position={[-25 + i * 4.6, 0.12, 11]}>
          <boxGeometry args={[1.8, 0.03, 0.12]} />
          <meshStandardMaterial color="#f6f6f4" roughness={0.75} />
        </mesh>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`markv-${i}`} position={[14, 0.12, -20 + i * 4.6]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.8, 0.03, 0.12]} />
          <meshStandardMaterial color="#f6f6f4" roughness={0.75} />
        </mesh>
      ))}
      <mesh position={[-7, 0.08, -10]} receiveShadow>
        <boxGeometry args={[18, 0.15, 4.6]} />
        <meshStandardMaterial color="#e6e7e5" roughness={0.9} />
      </mesh>
      {[-7.7, -6.2].map((x) => (
        <group key={x}>
          <mesh position={[x, 0.18, -10]}>
            <boxGeometry args={[0.08, 0.08, 18]} />
            <meshStandardMaterial color="#7c858a" metalness={0.25} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function CampusEnvironment({ reduced = false }: { reduced?: boolean }) {
  const trees = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const count = reduced ? 24 : 56;
    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const x = side * (11 + ((i * 7) % 19));
      const z = -20 + ((i * 13) % 45);
      const scale = 0.72 + ((i * 11) % 7) * 0.06;
      positions.push([x, z, scale]);
    }
    return positions;
  }, [reduced]);

  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[78, 0.2, 62]} />
        <meshStandardMaterial color="#f4f5f3" roughness={1} />
      </mesh>
      <RoadNetwork />
      <Warehouse />
      <OfficeHub />
      <YardPerson position={[-7.8, 0.05, 9.1]} />
      <YardPerson position={[-6.8, 0.05, 8.8]} />
      {trees.map(([x, z, scale], index) => <Tree key={index} x={x} z={z} scale={scale} />)}

      <group position={[-20, 0, -17]}>
        <mesh position={[0, 2.1, 0]} castShadow>
          <boxGeometry args={[8.5, 4.2, 6.5]} />
          <meshStandardMaterial color="#e9eae8" roughness={0.75} />
        </mesh>
        <mesh position={[0, 4.25, 0]}>
          <boxGeometry args={[8.8, 0.2, 6.8]} />
          <meshStandardMaterial color="#e62b2f" roughness={0.45} />
        </mesh>
      </group>
    </group>
  );
}
