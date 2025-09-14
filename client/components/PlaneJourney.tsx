import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars, Text } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCloudTexture } from '../utils/createCloudTexture';

interface PlaneJourneyProps {
  works: Array<{
    title: string;
    description: string;
    year: string;
    position: [number, number, number];
  }>;
}

// 3D Plane Model
const Plane = React.forwardRef<
  THREE.Group,
  { position?: [number, number, number] }
>(({ position = [0, 0, 0] }, ref) => {
  const propellerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref && "current" in ref && ref.current) {
      // Subtle bobbing animation
      ref.current.position.y =
        position[1] + Math.sin(clock.elapsedTime * 2) * 0.1;
      ref.current.rotation.z = Math.sin(clock.elapsedTime) * 0.05;
    }

    if (propellerRef.current) {
      // Spinning propeller
      propellerRef.current.rotation.z = clock.elapsedTime * 10;
    }
  });

  return (
    <group ref={ref} position={position}>
      {/* Plane Body */}
      <mesh>
        <boxGeometry args={[2, 0.3, 0.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Wings */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.05, 3]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      {/* Tail */}
      <mesh position={[-0.8, 0.3, 0]}>
        <boxGeometry args={[0.3, 0.8, 0.1]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>

      {/* Propeller */}
      <mesh ref={propellerRef} position={[1, 0, 0]}>
        <boxGeometry args={[0.1, 0.02, 1]} />
        <meshStandardMaterial color="#666666" />
      </mesh>
    </group>
  );
});

// Floating Work Items in 3D Space
function FloatingWork({ work, index }: { work: any; index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        work.position[1] + Math.sin(clock.elapsedTime + index) * 0.2;
      meshRef.current.rotation.y = clock.elapsedTime * 0.2;
    }
  });

  return (
    <group
      ref={meshRef}
      position={work.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh scale={hovered ? 1.2 : 1}>
        <boxGeometry args={[1.5, 1, 0.1]} />
        <meshStandardMaterial
          color={hovered ? "#3b82f6" : "#ffffff"}
          transparent
          opacity={0.9}
        />
      </mesh>

      <Text
        position={[0, 0, 0.1]}
        fontSize={0.2}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {work.title}
      </Text>
    </group>
  );
}

// Main 3D Scene with Plane Journey
function PlaneScene({ works }: { works: any[] }) {
  const { camera } = useThree();
  const planeRef = useRef<THREE.Group>(null);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);

  useEffect(() => {
    // Create flight path points
    const pathPoints = [
      new THREE.Vector3(0, 0, 10),
      new THREE.Vector3(10, 5, 0),
      new THREE.Vector3(0, 10, -10),
      new THREE.Vector3(-10, 5, -20),
      new THREE.Vector3(0, 0, -30),
    ];

    // Create smooth curve
    const curve = new THREE.CatmullRomCurve3(pathPoints);

    // Animate plane along the path based on scroll
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Get position on curve
        const position = curve.getPoint(progress);
        const tangent = curve.getTangent(progress);

        if (planeRef.current) {
          planeRef.current.position.copy(position);
          planeRef.current.lookAt(position.clone().add(tangent));
        }

        // Update camera to follow plane
        const cameraOffset = new THREE.Vector3(5, 3, 5);
        const cameraPosition = position.clone().add(cameraOffset);

        gsap.to(camera.position, {
          x: cameraPosition.x,
          y: cameraPosition.y,
          z: cameraPosition.z,
          duration: 0.1,
        });

        camera.lookAt(position);

        // Trigger work reveals based on progress
        const workIndex = Math.floor(progress * works.length);
        if (workIndex !== currentWorkIndex && workIndex < works.length) {
          setCurrentWorkIndex(workIndex);

          // Trigger work reveal animation
          const workElement = document.querySelector(`#work-${workIndex}`);
          if (workElement) {
            gsap.fromTo(
              workElement,
              { opacity: 0, scale: 0.8, y: 50 },
              {
                opacity: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: "back.out(1.7)",
              },
            );
          }
        }
      },
    });
  }, [camera, works, currentWorkIndex]);

  const [cloudTexture, setCloudTexture] = useState<string>('');
  
  useEffect(() => {
    setCloudTexture(createCloudTexture());
  }, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      {/* Plane */}
      <Plane ref={planeRef} />

      {/* Floating Works */}
      {works.map((work, index) => (
        <FloatingWork key={index} work={work} index={index} />
      ))}

      {/* Environment */}
      <Sphere args={[100, 32, 32]}>
        <meshBasicMaterial
          color="#4c6ef5"
          side={THREE.BackSide}
          transparent
          opacity={0.6}
        />
      </Sphere>

      <Stars radius={40} depth={50} count={1000} factor={2} />

    </>
  );
}

export const PlaneJourney = ({ works }: PlaneJourneyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [5, 3, 5], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <PlaneScene works={works} />
      </Canvas>
    </div>
  );
};
