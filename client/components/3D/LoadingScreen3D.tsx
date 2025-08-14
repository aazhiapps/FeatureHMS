import React, { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Text,
  Float,
  Sphere,
  Cylinder,
  Torus,
  Html,
  Plane,
  Ring,
  Box,
  RoundedBox,
} from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

interface LoadingScreen3DProps {
  progress: number;
  stage: string;
  onComplete: () => void;
  duration?: number;
}

// Healthcare System Icons Component
const HealthcareIcon = ({
  position,
  icon,
  label,
  color,
  isActive,
  index,
}: {
  position: [number, number, number];
  icon: string;
  label: string;
  color: string;
  isActive: boolean;
  index: number;
}) => {
  const iconRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (iconRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 3 + index) * 0.1 + 1;
      iconRef.current.scale.setScalar(isActive ? pulse : 0.8);

      if (isActive) {
        iconRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      }
    }
  });

  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={iconRef} position={position}>
        {/* Icon Background */}
        <RoundedBox args={[2.5, 2.5, 0.3]} radius={0.3}>
          <meshStandardMaterial
            color={isActive ? color : "#2a2a3a"}
            emissive={isActive ? color : "#111"}
            emissiveIntensity={isActive ? 0.3 : 0.1}
            metalness={0.2}
            roughness={0.8}
          />
        </RoundedBox>

        {/* Icon Display */}
        <Html center position={[0, 0, 0.2]}>
          <div className="flex flex-col items-center">
            <div
              className="text-3xl mb-1 transition-all duration-500"
              style={{
                opacity: isActive ? 1 : 0.4,
                transform: `scale(${isActive ? 1 : 0.8})`,
              }}
            >
              {icon}
            </div>
            <div
              className="text-xs font-semibold text-center max-w-20 leading-tight"
              style={{
                color: isActive ? "#ffffff" : "#888888",
                fontSize: "10px",
              }}
            >
              {label}
            </div>
          </div>
        </Html>

        {/* Active Glow Effect */}
        {isActive && (
          <Ring args={[1.8, 2.2, 32]} rotation={[0, 0, 0]}>
            <meshStandardMaterial
              color={color}
              transparent
              opacity={0.3}
              emissive={color}
              emissiveIntensity={0.4}
              side={THREE.DoubleSide}
            />
          </Ring>
        )}
      </group>
    </Float>
  );
};

// Central Progress Circle
const ProgressCircle = ({
  progress,
  stage,
}: {
  progress: number;
  stage: string;
}) => {
  const circleRef = useRef<THREE.Group>(null);
  const progressRingRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (circleRef.current) {
      circleRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }

    if (progressRingRef.current) {
      // Update progress ring based on actual progress
      const geometry = progressRingRef.current.geometry as THREE.TorusGeometry;
      const newThetaLength = progress * Math.PI * 2;
      progressRingRef.current.geometry = new THREE.TorusGeometry(
        6,
        0.4,
        16,
        64,
        0,
        newThetaLength,
      );
    }
  });

  return (
    <Float speed={0.2} rotationIntensity={0.05} floatIntensity={0.1}>
      <group ref={circleRef} position={[0, 0, 0]}>
        {/* Background Circle */}
        <Torus args={[6, 0.4, 16, 64]}>
          <meshStandardMaterial
            color="#2a2a3a"
            transparent
            opacity={0.6}
            metalness={0.3}
            roughness={0.7}
          />
        </Torus>

        {/* Progress Ring */}
        <mesh ref={progressRingRef}>
          <torusGeometry args={[6, 0.4, 16, 64, 0, progress * Math.PI * 2]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00a688"
            emissiveIntensity={0.6}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>

        {/* Central Display Background */}
        <Cylinder args={[4.5, 4.5, 0.5, 32]}>
          <meshStandardMaterial
            color="#1a1a2e"
            emissive="#0f0f1a"
            emissiveIntensity={0.3}
            metalness={0.5}
            roughness={0.6}
          />
        </Cylinder>

        {/* Progress Percentage */}
        <Text
          position={[0, 0.5, 0.3]}
          fontSize={2.2}
          color="#00d4aa"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
        >
          {Math.round(progress * 100)}%
        </Text>

        {/* Stage Information */}
        <Html position={[0, -6, 0]} center>
          <div className="text-center">
            <div className="text-white text-lg font-bold mb-1">
              Loading Integration Layer...
            </div>
            <div className="text-gray-300 text-sm max-w-64">
              Preparing your healthcare workflow
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
};

// Healthcare Particle System
const HealthcareParticles = ({ progress }: { progress: number }) => {
  const particlesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, index) => {
        const time = state.clock.elapsedTime;
        particle.position.y += Math.sin(time + index) * 0.01;
        particle.rotation.y = time * 0.5 + index;

        // Fade in based on progress
        if (
          particle instanceof THREE.Mesh &&
          particle.material instanceof THREE.MeshStandardMaterial
        ) {
          particle.material.opacity = Math.min(progress * 2, 0.6);
        }
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {[...Array(50)].map((_, i) => (
        <Float
          key={i}
          speed={0.3 + Math.random() * 0.5}
          rotationIntensity={0.1}
          floatIntensity={0.3}
        >
          <mesh
            position={[
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 50,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#00d4aa"
              emissive="#00a688"
              emissiveIntensity={0.4}
              transparent
              opacity={0.3}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

// Main Loading Screen Component
export const LoadingScreen3D: React.FC<LoadingScreen3DProps> = ({
  progress,
  stage,
  onComplete,
  duration = 6000,
}) => {
  const sceneRef = useRef<THREE.Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const startTime = useRef(Date.now());

  // Healthcare system icons configuration
  const healthcareSystems = [
    { icon: "👥", label: "Patient Database", color: "#00d4aa", angle: 0 },
    {
      icon: "📋",
      label: "Medical Records",
      color: "#4fc3f7",
      angle: Math.PI / 4,
    },
    {
      icon: "📅",
      label: "Scheduling System",
      color: "#66bb6a",
      angle: Math.PI / 2,
    },
    {
      icon: "🔒",
      label: "Security Protocols",
      color: "#ffca28",
      angle: (3 * Math.PI) / 4,
    },
    { icon: "📊", label: "Analytics Engine", color: "#ff7043", angle: Math.PI },
    {
      icon: "🤖",
      label: "AI Diagnostics",
      color: "#ab47bc",
      angle: (5 * Math.PI) / 4,
    },
    {
      icon: "🔗",
      label: "Integration Layer",
      color: "#ec407a",
      angle: (3 * Math.PI) / 2,
    },
    {
      icon: "✅",
      label: "Final Checks",
      color: "#26a69a",
      angle: (7 * Math.PI) / 4,
    },
  ];

  useFrame(() => {
    const elapsed = Date.now() - startTime.current;
    const newProgress = Math.min(elapsed / duration, 1);
    setAnimationProgress(newProgress);

    if (newProgress >= 1 && progress >= 1) {
      setTimeout(onComplete, 500);
    }
  });

  useEffect(() => {
    if (sceneRef.current) {
      gsap.fromTo(
        sceneRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.7)" },
      );
    }
  }, []);

  const currentProgress = Math.max(progress, animationProgress);

  return (
    <group ref={sceneRef}>
      {/* Enhanced Lighting Setup */}
      <ambientLight intensity={0.4} color="#f0f0ff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
        color="#ffffff"
      />
      <pointLight position={[0, 15, 8]} intensity={1.5} color="#00d4aa" />
      <spotLight
        position={[-15, 10, 15]}
        angle={0.4}
        intensity={1}
        color="#4fc3f7"
      />
      <spotLight
        position={[15, 10, -15]}
        angle={0.4}
        intensity={1}
        color="#66bb6a"
      />

      {/* Brand Title */}
      <Float speed={0.2} rotationIntensity={0.02} floatIntensity={0.05}>
        <Text
          position={[0, 15, 0]}
          fontSize={4.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
          letterSpacing={0.05}
        >
          ClinicStreams
        </Text>
      </Float>

      {/* Central Progress Circle */}
      <ProgressCircle progress={currentProgress} stage={stage} />

      {/* Healthcare System Icons in Circle */}
      {healthcareSystems.map((system, index) => {
        const radius = 12;
        const x = Math.cos(system.angle) * radius;
        const z = Math.sin(system.angle) * radius;
        const isActive = currentProgress >= index / healthcareSystems.length;

        return (
          <HealthcareIcon
            key={system.label}
            position={[x, 0, z]}
            icon={system.icon}
            label={system.label}
            color={system.color}
            isActive={isActive}
            index={index}
          />
        );
      })}

      {/* Background Particles */}
      <HealthcareParticles progress={currentProgress} />

      {/* Connection Lines between Active Systems */}
      {healthcareSystems.map((system, index) => {
        const isActive = currentProgress >= index / healthcareSystems.length;
        const nextIndex = (index + 1) % healthcareSystems.length;
        const isNextActive =
          currentProgress >= nextIndex / healthcareSystems.length;

        if (isActive && isNextActive) {
          const radius = 12;
          const x1 = Math.cos(system.angle) * radius;
          const z1 = Math.sin(system.angle) * radius;
          const x2 = Math.cos(healthcareSystems[nextIndex].angle) * radius;
          const z2 = Math.sin(healthcareSystems[nextIndex].angle) * radius;

          const midX = (x1 + x2) / 2;
          const midZ = (z1 + z2) / 2;
          const distance = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
          const angle = Math.atan2(z2 - z1, x2 - x1);

          return (
            <Float
              key={`connection-${index}`}
              speed={0.3}
              rotationIntensity={0.05}
              floatIntensity={0.1}
            >
              <mesh position={[midX, 0, midZ]} rotation={[0, angle, 0]}>
                <cylinderGeometry args={[0.02, 0.02, distance, 8]} />
                <meshStandardMaterial
                  color="#00d4aa"
                  emissive="#00a688"
                  emissiveIntensity={0.4}
                  transparent
                  opacity={0.6}
                />
              </mesh>
            </Float>
          );
        }
        return null;
      })}

      {/* Completion Effect */}
      {currentProgress >= 0.95 && (
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <group>
            {[...Array(12)].map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const radius = 20;
              return (
                <Sphere
                  key={i}
                  args={[0.3, 8, 8]}
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(angle * 3) * 5,
                    Math.sin(angle) * radius,
                  ]}
                >
                  <meshStandardMaterial
                    color="#00ff00"
                    emissive="#00d4aa"
                    emissiveIntensity={1.2}
                  />
                </Sphere>
              );
            })}
          </group>
        </Float>
      )}

      {/* Background Gradient Plane */}
      <Plane args={[100, 100]} position={[0, 0, -25]} rotation={[0, 0, 0]}>
        <meshStandardMaterial
          color="#0a0a1a"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </Plane>
    </group>
  );
};
