import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Stars, Cloud, Text, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ClinicStreamsJourneyProps {
  features: Array<{
    title: string;
    description: string;
    category: string;
    position: [number, number, number];
  }>;
}

// Medical Drone/Device Model
const MedicalDrone = React.forwardRef<THREE.Group, { position?: [number, number, number] }>(
  ({ position = [0, 0, 0] }, ref) => {
    const propellerRefs = useRef<(THREE.Mesh | null)[]>([]);
    const bodyRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock }) => {
      if (ref && 'current' in ref && ref.current) {
        // Gentle floating motion
        ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.5) * 0.2;
        ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.1;
      }
      
      // Spinning propellers
      propellerRefs.current.forEach((propeller) => {
        if (propeller) {
          propeller.rotation.y = clock.elapsedTime * 20;
        }
      });

      // Pulsing medical cross
      if (bodyRef.current) {
        bodyRef.current.scale.setScalar(1 + Math.sin(clock.elapsedTime * 3) * 0.1);
      }
    });

    return (
      <group ref={ref} position={position}>
        {/* Main Drone Body */}
        <Box args={[2, 0.5, 2]}>
          <meshStandardMaterial color="#ffffff" />
        </Box>
        
        {/* Medical Cross on top */}
        <group position={[0, 0.3, 0]} ref={bodyRef}>
          <Box args={[0.8, 0.1, 0.2]}>
            <meshStandardMaterial color="#ff3333" />
          </Box>
          <Box args={[0.2, 0.1, 0.8]}>
            <meshStandardMaterial color="#ff3333" />
          </Box>
        </group>
        
        {/* Propellers */}
        {[
          [1, 0.2, 1], [-1, 0.2, 1], [1, 0.2, -1], [-1, 0.2, -1]
        ].map((pos, index) => (
          <group key={index} position={pos as [number, number, number]}>
            <Cylinder args={[0.02, 0.02, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial color="#333333" />
            </Cylinder>
            <mesh
              ref={(el) => (propellerRefs.current[index] = el)}
              position={[0, 0, 0.2]}
            >
              <Box args={[1.5, 0.02, 0.1]}>
                <meshStandardMaterial color="#666666" transparent opacity={0.7} />
              </Box>
            </mesh>
          </group>
        ))}
        
        {/* LED Indicators */}
        {[
          [0.8, 0, 0.8], [-0.8, 0, 0.8], [0.8, 0, -0.8], [-0.8, 0, -0.8]
        ].map((pos, index) => (
          <mesh key={index} position={pos as [number, number, number]}>
            <Sphere args={[0.05]}>
              <meshStandardMaterial 
                color={index % 2 === 0 ? "#00ff00" : "#0066ff"} 
                emissive={index % 2 === 0 ? "#003300" : "#001133"}
              />
            </Sphere>
          </mesh>
        ))}
      </group>
    );
  }
);

// Floating Medical Feature Displays
function FloatingFeature({ feature, index }: { feature: any; index: number }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y = feature.position[1] + Math.sin(clock.elapsedTime + index * 1.5) * 0.3;
      meshRef.current.rotation.y = clock.elapsedTime * 0.1 + index;
    }
  });

  const getFeatureColor = (category: string) => {
    switch (category) {
      case 'monitoring': return '#00ff88';
      case 'analytics': return '#0088ff';
      case 'telemedicine': return '#ff6600';
      case 'integration': return '#ff0088';
      default: return '#ffffff';
    }
  };

  return (
    <group
      ref={meshRef}
      position={feature.position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Feature Container */}
      <Box args={[2, 1.2, 0.2]} scale={hovered ? 1.2 : 1}>
        <meshStandardMaterial 
          color={getFeatureColor(feature.category)} 
          transparent 
          opacity={0.8}
        />
      </Box>
      
      {/* Feature Icon */}
      <group position={[0, 0, 0.2]}>
        {feature.category === 'management' && (
          <group>
            <Sphere args={[0.12]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.08]} position={[0.2, 0, 0]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
          </group>
        )}

        {feature.category === 'scheduling' && (
          <group>
            <Box args={[0.3, 0.3, 0.05]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            {Array.from({ length: 9 }).map((_, i) => (
              <Box key={i} args={[0.03, 0.03, 0.1]} position={[
                ((i % 3) - 1) * 0.08,
                (Math.floor(i / 3) - 1) * 0.08,
                0.1
              ]}>
                <meshStandardMaterial color="#8b5cf6" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === 'records' && (
          <group>
            <Box args={[0.25, 0.35, 0.05]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box key={i} args={[0.15, 0.02, 0.1]} position={[0, (i - 1.5) * 0.08, 0.1]}>
                <meshStandardMaterial color="#10b981" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === 'billing' && (
          <group>
            <Box args={[0.3, 0.2, 0.05]} rotation={[0, 0, 0.1]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            <Cylinder args={[0.05, 0.05, 0.1]} position={[0.1, -0.05, 0.1]}>
              <meshStandardMaterial color="#f59e0b" />
            </Cylinder>
          </group>
        )}

        {feature.category === 'analytics' && (
          <group>
            {[0.15, 0.25, 0.2, 0.3, 0.35].map((height, i) => (
              <Box key={i} args={[0.08, height, 0.08]} position={[(i - 2) * 0.12, height / 2 - 0.2, 0]}>
                <meshStandardMaterial color="#ffffff" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === 'resources' && (
          <group>
            <Cylinder args={[0.15, 0.15, 0.05]}>
              <meshStandardMaterial color="#ffffff" />
            </Cylinder>
            {Array.from({ length: 12 }).map((_, i) => (
              <Box
                key={i}
                args={[0.015, 0.1, 0.015]}
                position={[
                  Math.cos((i / 12) * Math.PI * 2) * 0.12,
                  0,
                  Math.sin((i / 12) * Math.PI * 2) * 0.12
                ]}
                rotation={[0, (i / 12) * Math.PI * 2, 0]}
              >
                <meshStandardMaterial color="#14b8a6" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === 'security' && (
          <group>
            <Box args={[0.2, 0.25, 0.05]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            <Cylinder args={[0.08, 0.08, 0.12]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#ef4444" />
            </Cylinder>
          </group>
        )}

        {feature.category === 'engagement' && (
          <group>
            <Sphere args={[0.1]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.06]} position={[0.15, 0.1, 0]}>
              <meshStandardMaterial color="#06b6d4" />
            </Sphere>
            <Sphere args={[0.04]} position={[0.08, -0.12, 0]}>
              <meshStandardMaterial color="#06b6d4" />
            </Sphere>
          </group>
        )}
      </group>
      
      {/* Feature Label */}
      <Text
        position={[0, -0.8, 0.1]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={1.8}
      >
        {feature.title}
      </Text>
    </group>
  );
}

// Medical Environment with DNA Helix and Medical Equipment
function MedicalEnvironment() {
  const helixRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = clock.elapsedTime * 0.5;
    }
  });

  return (
    <>
      {/* Medical Sky Environment */}
      <Sphere args={[120, 32, 32]}>
        <meshBasicMaterial 
          color="#1e40af" 
          side={THREE.BackSide}
          transparent
          opacity={0.8}
        />
      </Sphere>
      
      {/* DNA Helix in the background */}
      <group ref={helixRef} position={[30, 0, -40]}>
        {Array.from({ length: 20 }).map((_, i) => (
          <group key={i} position={[0, i * 2 - 20, 0]} rotation={[0, (i * Math.PI) / 5, 0]}>
            <Sphere args={[0.3]} position={[2, 0, 0]}>
              <meshStandardMaterial color="#ff6b6b" />
            </Sphere>
            <Sphere args={[0.3]} position={[-2, 0, 0]}>
              <meshStandardMaterial color="#4ecdc4" />
            </Sphere>
            <Cylinder args={[0.05, 0.05, 4]} rotation={[0, 0, Math.PI / 2]}>
              <meshStandardMaterial color="#ffffff" />
            </Cylinder>
          </group>
        ))}
      </group>
      
      {/* Medical Clouds with plus signs */}
      <Cloud position={[20, 8, -15]} opacity={0.6} speed={0.1} width={18} depth={10} color="#e8f4fd" />
      <Cloud position={[-15, 12, -25]} opacity={0.7} speed={0.15} width={15} depth={8} color="#f0f9ff" />
      <Cloud position={[35, 5, -35]} opacity={0.5} speed={0.08} width={20} depth={12} color="#e8f4fd" />
      
      {/* Floating Medical Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 100,
          (Math.random() - 0.5) * 200
        ]}>
          <Box args={[0.2, 0.05, 0.2]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </Box>
          <Box args={[0.05, 0.2, 0.2]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </Box>
        </mesh>
      ))}
      
      <Stars radius={80} depth={60} count={3000} factor={3} saturation={0} fade />
    </>
  );
}

// Main Medical Scene
function MedicalScene({ features }: { features: any[] }) {
  const { camera } = useThree();
  const droneRef = useRef<THREE.Group>(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    // Create medical flight path
    const pathPoints = [
      new THREE.Vector3(0, 0, 15),
      new THREE.Vector3(15, 8, 0),
      new THREE.Vector3(0, 15, -15),
      new THREE.Vector3(-15, 8, -30),
      new THREE.Vector3(0, 0, -45),
    ];

    const curve = new THREE.CatmullRomCurve3(pathPoints);
    
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        
        const position = curve.getPoint(progress);
        const tangent = curve.getTangent(progress);
        
        if (droneRef.current) {
          droneRef.current.position.copy(position);
          droneRef.current.lookAt(position.clone().add(tangent));
        }

        // Medical camera following
        const cameraOffset = new THREE.Vector3(8, 5, 8);
        const cameraPosition = position.clone().add(cameraOffset);
        
        gsap.to(camera.position, {
          x: cameraPosition.x,
          y: cameraPosition.y,
          z: cameraPosition.z,
          duration: 0.1,
        });
        
        camera.lookAt(position);

        // Trigger feature discovery
        const featureIndex = Math.floor(progress * features.length);
        if (featureIndex !== currentFeatureIndex && featureIndex < features.length) {
          setCurrentFeatureIndex(featureIndex);
          
          const featureElement = document.querySelector(`#feature-${featureIndex}`);
          if (featureElement) {
            gsap.fromTo(featureElement, 
              { opacity: 0, scale: 0.8, y: 50 },
              { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.7)" }
            );
          }
        }
      }
    });
  }, [camera, features, currentFeatureIndex]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[15, 15, 8]} intensity={1.2} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ff88" />
      
      {/* Medical Drone */}
      <MedicalDrone ref={droneRef} />
      
      {/* Floating Features */}
      {features.map((feature, index) => (
        <FloatingFeature key={index} feature={feature} index={index} />
      ))}
      
      <MedicalEnvironment />
    </>
  );
}

export const ClinicStreamsJourney = ({ features }: ClinicStreamsJourneyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <MedicalScene features={features} />
      </Canvas>
    </div>
  );
};
