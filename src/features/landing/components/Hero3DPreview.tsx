import { Suspense, useEffect, useRef } from "react";
import {
  OrbitControls,
  Float,
  Environment,
  RoundedBox,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import type { Mesh, MeshStandardMaterial } from "three";
import type { FabricSwatch, FitSwatch } from "../types/heroTypes";

interface ShirtModelProps {
  color: string;
  fabric: FabricSwatch;
  fit: FitSwatch;
}

function FallbackShirtModel({ color, fabric, fit }: ShirtModelProps) {
  const bodyRef = useRef<Mesh>(null);

  return (
    <group rotation={[0.05, -0.2, 0]} scale={fit.scale * 1.4}>
      <RoundedBox
        ref={bodyRef}
        args={[2.1, 2.6, 0.18]}
        radius={0.12}
        smoothness={8}
      >
        <meshStandardMaterial
          color={color}
          roughness={fabric.roughness}
          metalness={fabric.metalness}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.65, 1.25, 0.16]}
        radius={0.1}
        smoothness={8}
        position={[-1.36, 0.45, 0]}
        rotation={[0, 0, -0.35]}
      >
        <meshStandardMaterial
          color={color}
          roughness={fabric.roughness}
          metalness={fabric.metalness}
        />
      </RoundedBox>

      <RoundedBox
        args={[0.65, 1.25, 0.16]}
        radius={0.1}
        smoothness={8}
        position={[1.36, 0.45, 0]}
        rotation={[0, 0, 0.35]}
      >
        <meshStandardMaterial
          color={color}
          roughness={fabric.roughness}
          metalness={fabric.metalness}
        />
      </RoundedBox>
    </group>
  );
}

function GltfShirtModel({ color, fabric, fit }: ShirtModelProps) {
  const { scene } = useGLTF("/models/oversized_t-shirt.glb");

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as Mesh;

      if (mesh.isMesh && mesh.material) {
        const material = mesh.material as MeshStandardMaterial;
        material.color.set(color);
        material.roughness = fabric.roughness;
        material.metalness = fabric.metalness;
        material.needsUpdate = true;
      }
    });
  }, [scene, color, fabric]);

  return (
    <primitive
      object={scene}
      scale={fit.scale * 1.8}
      position={[0, -2.2, 0]}
      rotation={[0, -0.15, 0]}
    />
  );
}

const USE_GLTF_MODEL = true;

function ShirtScene({ color, fabric, fit }: ShirtModelProps) {
  return (
    <Float speed={1.15} rotationIntensity={0.18} floatIntensity={0.45}>
      {USE_GLTF_MODEL ? (
        <GltfShirtModel color={color} fabric={fabric} fit={fit} />
      ) : (
        <FallbackShirtModel color={color} fabric={fabric} fit={fit} />
      )}
    </Float>
  );
}

interface Hero3DPreviewProps {
  color: string;
  fabric: FabricSwatch;
  fit: FitSwatch;
}

export default function Hero3DPreview({
  color,
  fabric,
  fit,
}: Hero3DPreviewProps) {
  return (
    <div className="relative h-[520px] w-full sm:h-[620px] lg:h-[760px]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300/20 blur-[140px]" />
        <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/15 blur-[100px]" />
      </div>

      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0.2, 4], fov: 28 }}
        className="!bg-transparent"
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 5, 5]} intensity={1.7} />
        <Environment preset="studio" />

        <Suspense fallback={null}>
          <ShirtScene color={color} fabric={fabric} fit={fit} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.8}
          autoRotate={false}
          minPolarAngle={Math.PI / 2.5}
          maxPolarAngle={Math.PI / 1.85}
        />
      </Canvas>

      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm font-semibold text-primary-900">
          Oversized Cotton Tee
        </p>
        <p className="mt-1 text-xs text-primary-500">Drag to rotate</p>
      </div>
    </div>
  );
}

useGLTF.preload("/models/oversized_t-shirt.glb");
