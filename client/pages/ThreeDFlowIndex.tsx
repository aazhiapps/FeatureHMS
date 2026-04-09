import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, OrbitControls, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import { ViewModeSwitcher } from "../components/ViewModeSwitcher";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  { icon: "🏥", label: "Patient Mgmt", color: "#3b82f6", pos: [0, 0, 0] as [number, number, number] },
  { icon: "📅", label: "Scheduling", color: "#10b981", pos: [4, 1.5, -3] as [number, number, number] },
  { icon: "📋", label: "EMR", color: "#8b5cf6", pos: [-4, -1, -2] as [number, number, number] },
  { icon: "💰", label: "Billing", color: "#f59e0b", pos: [3, -2, -5] as [number, number, number] },
  { icon: "🧪", label: "Lab", color: "#6366f1", pos: [-3, 2, -6] as [number, number, number] },
  { icon: "💊", label: "Pharmacy", color: "#ec4899", pos: [1, 3, -8] as [number, number, number] },
  { icon: "🚑", label: "Ambulance", color: "#ef4444", pos: [-1, -3, -7] as [number, number, number] },
  { icon: "👩‍⚕️", label: "Nursing", color: "#14b8a6", pos: [5, 0.5, -9] as [number, number, number] },
  { icon: "🏢", label: "Front Office", color: "#0ea5e9", pos: [-5, 1, -10] as [number, number, number] },
];

// ─── 3D Sphere Node ──────────────────────────────────────────────────────────

function FeatureNode({
  feature,
  onClick,
  active,
}: {
  feature: (typeof features)[number];
  onClick: () => void;
  active: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = clock.elapsedTime * 0.4;
    const scale = active ? 1.35 : hovered ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
  });

  const color = new THREE.Color(feature.color);

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group position={feature.pos}>
        {/* Glow ring */}
        {(active || hovered) && (
          <mesh>
            <torusGeometry args={[0.7, 0.04, 16, 64]} />
            <meshStandardMaterial
              color={feature.color}
              emissive={feature.color}
              emissiveIntensity={1.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        )}

        {/* Core sphere */}
        <mesh
          ref={meshRef}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          castShadow
        >
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={active ? 0.6 : hovered ? 0.4 : 0.2}
            roughness={0.3}
            metalness={0.5}
          />
        </mesh>

        {/* Label */}
        <Text
          position={[0, -0.9, 0]}
          fontSize={0.28}
          color="white"
          anchorX="center"
          anchorY="top"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {feature.label}
        </Text>
      </group>
    </Float>
  );
}

// ─── Connection Lines ─────────────────────────────────────────────────────────

function Connections({ activeIndex }: { activeIndex: number }) {
  const lineRefs = useRef<THREE.Line[]>([]);

  useFrame(({ clock }) => {
    lineRefs.current.forEach((line, i) => {
      if (line?.material) {
        (line.material as THREE.LineBasicMaterial).opacity =
          0.15 + Math.sin(clock.elapsedTime * 0.8 + i) * 0.1;
      }
    });
  });

  const origin = new THREE.Vector3(...features[0].pos);

  return (
    <>
      {features.slice(1).map((f, i) => {
        const points = [origin, new THREE.Vector3(...f.pos)];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line
            key={f.label}
            ref={(el) => {
              if (el) lineRefs.current[i] = el as unknown as THREE.Line;
            }}
            geometry={geometry}
          >
            <lineBasicMaterial
              color={features[0].color}
              transparent
              opacity={0.2}
            />
          </line>
        );
      })}
    </>
  );
}

// ─── Camera auto-fly ─────────────────────────────────────────────────────────

function CameraRig({ target }: { target: [number, number, number] }) {
  useFrame(({ camera }) => {
    const t = new THREE.Vector3(...target);
    const dest = t.clone().add(new THREE.Vector3(0, 1.5, 5));
    camera.position.lerp(dest, 0.025);
    camera.lookAt(t.lerp(new THREE.Vector3(0, 0, 0), 0.2));
  });
  return null;
}

// ─── Scene ────────────────────────────────────────────────────────────────────

function Scene({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (i: number) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <pointLight
        position={[0, 0, 5]}
        intensity={0.8}
        color="#3b82f6"
        distance={20}
      />

      <Stars radius={80} depth={60} count={3000} factor={4} fade />
      <Connections activeIndex={activeIndex} />
      <CameraRig target={features[activeIndex].pos} />

      {features.map((f, i) => (
        <FeatureNode
          key={f.label}
          feature={f}
          active={i === activeIndex}
          onClick={() => onSelect(i)}
        />
      ))}

      <OrbitControls
        enableZoom
        enablePan={false}
        minDistance={3}
        maxDistance={20}
        autoRotate
        autoRotateSpeed={0.4}
      />
    </>
  );
}

// ─── Info Panel ───────────────────────────────────────────────────────────────

const featureDetails: Record<
  string,
  { description: string; stats: string[] }
> = {
  "Patient Mgmt": {
    description:
      "Centralised patient records with comprehensive visit history, treatment plans and real-time status.",
    stats: ["12,500+ active patients", "98.2% satisfaction", "∞ record history"],
  },
  Scheduling: {
    description:
      "Intelligent scheduling with automated reminders that cut no-shows and reduce wait times.",
    stats: ["2,800 appts / day", "No-show ↓ 45%", "Avg wait ↓ 30 min"],
  },
  EMR: {
    description:
      "HIPAA-compliant Electronic Medical Records that make documentation fast, accurate and always available.",
    stats: ["HIPAA certified", "< 2 s load time", "99.9% availability"],
  },
  Billing: {
    description:
      "Streamlined billing workflows, insurance verification and claims processing in one place.",
    stats: ["95% collection rate", "Claims same-day", "Auto insurance check"],
  },
  Lab: {
    description:
      "Order tests, track samples and receive results — fully integrated with your clinical workflow.",
    stats: ["99.8% accuracy", "2 h avg turnaround", "150+ test types"],
  },
  Pharmacy: {
    description:
      "Automated dispensing, inventory control and drug-interaction checks keep patients safe.",
    stats: ["0 dispensing errors", "Live stock alerts", "Drug-interaction AI"],
  },
  Ambulance: {
    description:
      "Real-time fleet tracking and smart dispatch that shaves minutes off emergency response.",
    stats: ["8 min avg response", "GPS live tracking", "12-vehicle fleet"],
  },
  Nursing: {
    description:
      "Medication administration, vital-sign monitoring and shift handover — all in one screen.",
    stats: ["100% med accuracy", "Vitals every 15 min", "Digital handover"],
  },
  "Front Office": {
    description:
      "Reception, check-in/out and queue management that gives patients a smooth arrival experience.",
    stats: ["Avg wait < 5 min", "Digital check-in", "Queue forecasting"],
  },
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const ThreeDFlowIndex: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = features[activeIndex];
  const details = featureDetails[active.label] ?? {
    description: "",
    stats: [],
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60 }}
        shadows
        className="absolute inset-0"
      >
        <Suspense fallback={null}>
          <Scene activeIndex={activeIndex} onSelect={setActiveIndex} />
        </Suspense>
      </Canvas>

      {/* Header overlay */}
      <div className="absolute top-0 inset-x-0 z-10 px-6 pt-5 pb-4 bg-gradient-to-b from-slate-950/90 to-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-base">
            🏥
          </div>
          <div>
            <h1 className="text-white font-semibold text-lg leading-tight">
              ClinicStreams HMS
            </h1>
            <p className="text-blue-300 text-xs">3D Feature Explorer</p>
          </div>
        </div>
      </div>

      {/* Feature info panel */}
      <div className="absolute bottom-20 left-6 z-10 max-w-xs">
        <div
          className="rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-sm p-5 shadow-2xl transition-all duration-500"
          key={active.label}
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{active.icon}</span>
            <div>
              <h2 className="text-white font-semibold text-base">
                {active.label}
              </h2>
              <p className="text-xs text-slate-400">
                {activeIndex + 1} / {features.length}
              </p>
            </div>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            {details.description}
          </p>
          <ul className="space-y-1">
            {details.stats.map((s) => (
              <li key={s} className="flex items-center gap-2 text-xs">
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: active.color }}
                />
                <span className="text-slate-400">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dot navigation */}
        <div className="flex gap-2 mt-3 pl-1">
          {features.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setActiveIndex(i)}
              title={f.label}
              className={`transition-all duration-200 rounded-full ${
                i === activeIndex
                  ? "w-5 h-2.5"
                  : "w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400"
              }`}
              style={i === activeIndex ? { background: f.color } : {}}
            />
          ))}
        </div>
      </div>

      {/* Hint */}
      <div className="absolute bottom-20 right-6 z-10 text-slate-500 text-xs text-right pointer-events-none">
        <p>Click a node to focus</p>
        <p>Drag to orbit · Scroll to zoom</p>
      </div>

      {/* CTA */}
      <div className="absolute top-5 right-6 z-10 hidden md:flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.open("https://calendly.com/clinicstreams-demo", "_blank");
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 shadow-lg"
        >
          Get a Demo
        </a>
      </div>

      {/* View mode switcher */}
      <ViewModeSwitcher />
    </div>
  );
};

export default ThreeDFlowIndex;
