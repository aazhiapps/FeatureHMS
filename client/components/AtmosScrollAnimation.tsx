import { useEffect, useRef, useState } from "react";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Text, Cloud, Stars } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCloudTexture } from "../utils/createCloudTexture";

interface AtmosScrollProps {
  children: React.ReactNode;
}

// Camera controller that follows scroll
function ScrollCamera() {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Create scroll-triggered camera movement
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;

          // Create a smooth flight path
          const radius = 50;
          const height = progress * 100 - 50;
          const angle = progress * Math.PI * 4; // Multiple rotations

          const x = Math.sin(angle) * radius * (1 - progress * 0.8);
          const z = Math.cos(angle) * radius * (1 - progress * 0.8);
          const y = height;

          camera.position.set(x, y, z);
          camera.lookAt(0, height + 10, 0);
        },
      },
    });

    return () => {
      tl.kill();
    };
  }, [camera]);

  return <group ref={groupRef} />;
}

// Animated sky sphere
function AnimatedSky() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Rotate sky slowly
      meshRef.current.rotation.y = clock.elapsedTime * 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} args={[200, 32, 32]}>
      <meshBasicMaterial
        color="#4285f4"
        side={THREE.BackSide}
        transparent
        opacity={0.8}
      />
    </Sphere>
  );
}

// Wind particles that appear during fast scrolling
function WindParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let velocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      velocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;
      setScrollVelocity(velocity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      const material = particlesRef.current.material as THREE.PointsMaterial;
      material.opacity = Math.min(scrollVelocity * 0.01, 0.8);

      // Animate particles
      particlesRef.current.rotation.y += 0.01;
    }
  });

  // Create particle geometry
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.5}
        transparent
        opacity={0}
        color="#ffffff"
        sizeAttenuation
      />
    </points>
  );
}

// Floating clouds along the path
function FloatingClouds() {
  const [cloudTexture, setCloudTexture] = useState<string>("");

  useEffect(() => {
    setCloudTexture(createCloudTexture());
  }, []);

  const cloudPositions = [
    { position: [20, 10, -30], scale: 0.5 },
    { position: [-15, 25, -60], scale: 0.7 },
    { position: [30, -10, -90], scale: 0.6 },
    { position: [-25, 40, -120], scale: 0.8 },
    { position: [10, 60, -150], scale: 0.4 },
  ];

  return (
    <>
      {cloudTexture &&
        cloudPositions.map((cloud, index) => (
          <Cloud
            key={index}
            position={cloud.position as [number, number, number]}
            scale={cloud.scale}
            opacity={0.6}
            speed={0.1}
            width={10}
            depth={1.5}
            segments={20}
            texture={cloudTexture}
          />
        ))}
    </>
  );
}

// 3D Text that appears during scroll
function ScrollText() {
  const textRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!textRef.current) return;

    gsap.set(textRef.current.position, { y: -20, opacity: 0 });

    gsap.to(textRef.current.position, {
      y: 0,
      duration: 2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: "body",
        start: "30% top",
        end: "70% top",
        scrub: 1,
      },
    });
  }, []);

  return (
    <group ref={textRef} position={[0, 20, -50]}>
      <Text fontSize={8} color="#ffffff" anchorX="center" anchorY="middle">
        EXPLORE
      </Text>
    </group>
  );
}

// Main 3D Scene
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <ScrollCamera />
      <AnimatedSky />
      <WindParticles />
      <FloatingClouds />
      <ScrollText />
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
      />
    </>
  );
}

export const AtmosScrollAnimation = ({ children }: AtmosScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enable smooth scrolling behavior
    ScrollTrigger.refresh();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Fixed 3D Canvas Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 50], fov: 75 }}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene3D />
        </Canvas>
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10 bg-transparent">{children}</div>
    </div>
  );
};
