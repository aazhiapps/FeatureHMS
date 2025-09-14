import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Stars, Text, Box, Cylinder } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createCloudTexture } from '../utils/createCloudTexture';

interface ClinicStreamsJourneyProps {
  features: Array<{
    title: string;
    description: string;
    category: string;
    position: [number, number, number];
  }>;
  onFeatureClick?: (featureIndex: number) => void;
  onJumpToSection?: (progress: number) => void;
}

// Medical Drone/Device Model
const MedicalDrone = React.forwardRef<
  THREE.Group,
  { position?: [number, number, number] }
>(({ position = [0, 0, 0] }, ref) => {
  const propellerRefs = useRef<(THREE.Mesh | null)[]>([]);
  const bodyRef = useRef<THREE.Group>(null);
  const [ledIntensity, setLedIntensity] = useState([0.5, 0.5, 0.5, 0.5]);
  const [glowOpacity, setGlowOpacity] = useState([0.2, 0.2, 0.2, 0.2]);

  useFrame(({ clock }) => {
    if (ref && "current" in ref && ref.current) {
      // Enhanced floating motion with more natural movement
      ref.current.position.y =
        position[1] +
        Math.sin(clock.elapsedTime * 1.2) * 0.3 +
        Math.sin(clock.elapsedTime * 2.1) * 0.1;
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.8) * 0.15;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 1.1) * 0.05;
      ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.7) * 0.08;
    }

    // Enhanced spinning propellers with varying speeds
    propellerRefs.current.forEach((propeller, index) => {
      if (propeller) {
        propeller.rotation.y = clock.elapsedTime * (18 + index * 2);
        // Add slight wobble for realism
        propeller.rotation.x = Math.sin(clock.elapsedTime * 5 + index) * 0.02;
      }
    });

    // Enhanced pulsing medical cross with glow effect
    if (bodyRef.current) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2.5) * 0.15;
      bodyRef.current.scale.setScalar(pulse);
    }

    // Update LED animations
    const newLedIntensity = [0, 1, 2, 3].map(
      (index) => 0.5 + Math.sin(clock.elapsedTime * 3 + index) * 0.3,
    );
    const newGlowOpacity = [0, 1, 2, 3].map(
      (index) => 0.2 + Math.sin(clock.elapsedTime * 2 + index) * 0.1,
    );
    setLedIntensity(newLedIntensity);
    setGlowOpacity(newGlowOpacity);
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
        [1, 0.2, 1],
        [-1, 0.2, 1],
        [1, 0.2, -1],
        [-1, 0.2, -1],
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

      {/* Enhanced LED Indicators with pulsing */}
      {[
        [0.8, 0, 0.8],
        [-0.8, 0, 0.8],
        [0.8, 0, -0.8],
        [-0.8, 0, -0.8],
      ].map((pos, index) => (
        <group key={index} position={pos as [number, number, number]}>
          <mesh>
            <Sphere args={[0.06]}>
              <meshStandardMaterial
                color={index % 2 === 0 ? "#00ff00" : "#0066ff"}
                emissive={index % 2 === 0 ? "#00ff00" : "#0066ff"}
                emissiveIntensity={ledIntensity[index] || 0.5}
                transparent
                opacity={0.9}
              />
            </Sphere>
          </mesh>
          {/* Glow effect */}
          <mesh>
            <Sphere args={[0.12]}>
              <meshStandardMaterial
                color={index % 2 === 0 ? "#00ff00" : "#0066ff"}
                transparent
                opacity={glowOpacity[index] || 0.2}
              />
            </Sphere>
          </mesh>
        </group>
      ))}
    </group>
  );
});

// Floating Medical Feature Displays
function FloatingFeature({
  feature,
  index,
  onFeatureClick,
  onJumpToSection,
}: {
  feature: any;
  index: number;
  onFeatureClick?: (featureIndex: number) => void;
  onJumpToSection?: (progress: number) => void;
}) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Enhanced floating with multiple sine waves for more natural movement
      meshRef.current.position.y =
        feature.position[1] +
        Math.sin(clock.elapsedTime * 0.8 + index * 1.5) * 0.4 +
        Math.sin(clock.elapsedTime * 1.3 + index * 0.7) * 0.2;

      // Smooth rotation with slight tilting
      meshRef.current.rotation.y = clock.elapsedTime * 0.15 + index;
      meshRef.current.rotation.x =
        Math.sin(clock.elapsedTime * 0.5 + index) * 0.1;
      meshRef.current.rotation.z =
        Math.sin(clock.elapsedTime * 0.7 + index) * 0.05;

      // Scale pulsing for breathing effect
      const scale = hovered
        ? 1.3
        : 1 + Math.sin(clock.elapsedTime * 1.5 + index) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const getFeatureColor = (category: string) => {
    switch (category) {
      case "management":
        return "#3b82f6";
      case "scheduling":
        return "#8b5cf6";
      case "records":
        return "#10b981";
      case "billing":
        return "#f59e0b";
      case "analytics":
        return "#ec4899";
      case "resources":
        return "#14b8a6";
      case "security":
        return "#ef4444";
      case "engagement":
        return "#06b6d4";
      default:
        return "#ffffff";
    }
  };

  return (
    <group
      ref={meshRef}
      position={feature.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        setClicked(true);

        // Visual feedback
        if (meshRef.current) {
          gsap.fromTo(
            meshRef.current.scale,
            { x: 1, y: 1, z: 1 },
            {
              x: 1.2,
              y: 1.2,
              z: 1.2,
              duration: 0.3,
              yoyo: true,
              repeat: 1,
              ease: "power2.out",
              onComplete: () => setClicked(false),
            },
          );
        }

        // Navigate to feature
        const targetProgress = index / (8 - 1); // Assuming 8 features
        onJumpToSection?.(targetProgress);
        onFeatureClick?.(index);
      }}
    >
      {/* Enhanced Feature Container with glow */}
      <group>
        <Box args={[2, 1.2, 0.2]}>
          <meshStandardMaterial
            color={getFeatureColor(feature.category)}
            transparent
            opacity={clicked ? 1 : hovered ? 0.95 : 0.85}
            emissive={getFeatureColor(feature.category)}
            emissiveIntensity={clicked ? 0.4 : hovered ? 0.2 : 0.1}
          />
        </Box>
        {/* Glow effect */}
        {hovered && (
          <Box args={[2.4, 1.6, 0.4]}>
            <meshStandardMaterial
              color={getFeatureColor(feature.category)}
              transparent
              opacity={0.15}
            />
          </Box>
        )}
      </group>

      {/* Feature Icon */}
      <group position={[0, 0, 0.2]}>
        {feature.category === "management" && (
          <group>
            <Sphere args={[0.12]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
            <Sphere args={[0.08]} position={[0.2, 0, 0]}>
              <meshStandardMaterial color="#ffffff" />
            </Sphere>
          </group>
        )}

        {feature.category === "scheduling" && (
          <group>
            <Box args={[0.3, 0.3, 0.05]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            {Array.from({ length: 9 }).map((_, i) => (
              <Box
                key={i}
                args={[0.03, 0.03, 0.1]}
                position={[
                  ((i % 3) - 1) * 0.08,
                  (Math.floor(i / 3) - 1) * 0.08,
                  0.1,
                ]}
              >
                <meshStandardMaterial color="#8b5cf6" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === "records" && (
          <group>
            <Box args={[0.25, 0.35, 0.05]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            {Array.from({ length: 4 }).map((_, i) => (
              <Box
                key={i}
                args={[0.15, 0.02, 0.1]}
                position={[0, (i - 1.5) * 0.08, 0.1]}
              >
                <meshStandardMaterial color="#10b981" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === "billing" && (
          <group>
            <Box args={[0.3, 0.2, 0.05]} rotation={[0, 0, 0.1]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            <Cylinder args={[0.05, 0.05, 0.1]} position={[0.1, -0.05, 0.1]}>
              <meshStandardMaterial color="#f59e0b" />
            </Cylinder>
          </group>
        )}

        {feature.category === "analytics" && (
          <group>
            {[0.15, 0.25, 0.2, 0.3, 0.35].map((height, i) => (
              <Box
                key={i}
                args={[0.08, height, 0.08]}
                position={[(i - 2) * 0.12, height / 2 - 0.2, 0]}
              >
                <meshStandardMaterial color="#ffffff" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === "resources" && (
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
                  Math.sin((i / 12) * Math.PI * 2) * 0.12,
                ]}
                rotation={[0, (i / 12) * Math.PI * 2, 0]}
              >
                <meshStandardMaterial color="#14b8a6" />
              </Box>
            ))}
          </group>
        )}

        {feature.category === "security" && (
          <group>
            <Box args={[0.2, 0.25, 0.05]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            <Cylinder args={[0.08, 0.08, 0.12]} position={[0, 0.15, 0]}>
              <meshStandardMaterial color="#ef4444" />
            </Cylinder>
          </group>
        )}

        {feature.category === "engagement" && (
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
function MedicalEnvironment({ cloudTexture }: { cloudTexture: string }) {
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
          <group
            key={i}
            position={[0, i * 2 - 20, 0]}
            rotation={[0, (i * Math.PI) / 5, 0]}
          >
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


      {/* Floating Medical Particles */}
      {Array.from({ length: 50 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 200,
          ]}
        >
          <Box args={[0.2, 0.05, 0.2]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </Box>
          <Box args={[0.05, 0.2, 0.2]}>
            <meshStandardMaterial color="#ffffff" transparent opacity={0.6} />
          </Box>
        </mesh>
      ))}

      <Stars
        radius={80}
        depth={60}
        count={3000}
        factor={3}
        saturation={0}
        fade
      />
    </>
  );
}

// Main Medical Scene
function MedicalScene({
  features,
  onFeatureClick,
  onJumpToSection,
  cloudTexture,
}: {
  features: any[];
  onFeatureClick?: (featureIndex: number) => void;
  onJumpToSection?: (progress: number) => void;
  cloudTexture: string;
}) {
  const { camera } = useThree();
  const droneRef = useRef<THREE.Group>(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  useEffect(() => {
    // Create workflow-based flight path matching the connected points pattern
    const workflowPoints = [];

    // Generate points that follow the feature positions in a connected workflow
    features.forEach((feature, index) => {
      const baseY = 15 - index * 5; // Descending pattern
      const alternatingX = index % 2 === 0 ? -8 : 8; // Alternating left/right
      const progressiveZ = -index * 12; // Moving deeper

      workflowPoints.push(new THREE.Vector3(alternatingX, baseY, progressiveZ));
    });

    // Add smooth transition points between workflow nodes
    const smoothedPoints = [];
    workflowPoints.forEach((point, index) => {
      smoothedPoints.push(point);

      // Add intermediate points for smooth connections
      if (index < workflowPoints.length - 1) {
        const nextPoint = workflowPoints[index + 1];
        const midPoint = new THREE.Vector3(
          (point.x + nextPoint.x) * 0.5,
          (point.y + nextPoint.y) * 0.5 + 2, // Slight arc upward
          (point.z + nextPoint.z) * 0.5,
        );
        smoothedPoints.push(midPoint);
      }
    });

    const curve = new THREE.CatmullRomCurve3(smoothedPoints);

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // Smoother scrub value
      onUpdate: (self) => {
        const progress = self.progress;

        const position = curve.getPoint(progress);
        const tangent = curve.getTangent(progress);

        if (droneRef.current) {
          // Smooth drone positioning with enhanced movement
          gsap.to(droneRef.current.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 0.5,
            ease: "power2.out",
          });

          // Enhanced drone orientation with banking
          const lookAtTarget = position.clone().add(tangent);
          droneRef.current.lookAt(lookAtTarget);

          // Add banking effect when turning
          const nextProgress = Math.min(progress + 0.01, 1);
          const nextPosition = curve.getPoint(nextProgress);
          const turnAmount = position.distanceTo(nextPosition);
          droneRef.current.rotation.z = turnAmount * 2; // Banking effect
        }

        // Enhanced camera following with cinematic movement
        const cameraDistance = 12 + Math.sin(progress * Math.PI * 2) * 3;
        const cameraHeight = 8 + Math.cos(progress * Math.PI * 3) * 2;
        const cameraAngle = progress * Math.PI * 0.5;

        const cameraOffset = new THREE.Vector3(
          Math.cos(cameraAngle) * cameraDistance,
          cameraHeight,
          Math.sin(cameraAngle) * cameraDistance,
        );
        const cameraPosition = position.clone().add(cameraOffset);

        gsap.to(camera.position, {
          x: cameraPosition.x,
          y: cameraPosition.y,
          z: cameraPosition.z,
          duration: 0.8,
          ease: "power2.out",
        });

        // Smooth camera look-at with slight anticipation
        const lookAhead = curve.getPoint(Math.min(progress + 0.02, 1));
        camera.lookAt(lookAhead);

        // Enhanced drone highlighting for current feature
        const featureIndex = Math.floor(progress * features.length);
        if (
          featureIndex !== currentFeatureIndex &&
          featureIndex < features.length
        ) {
          setCurrentFeatureIndex(featureIndex);

          // Emit custom event for feature change
          window.dispatchEvent(
            new CustomEvent("featureChange", {
              detail: { featureIndex, feature: features[featureIndex] },
            }),
          );

          // Highlight current feature in workflow
          const currentFeature = features[featureIndex];
          const featureElement = document.querySelector(
            `#feature-${currentFeature.category}`,
          );

          if (featureElement) {
            // Enhanced feature highlighting with drone focus
            gsap.fromTo(
              featureElement,
              {
                opacity: 0.8,
                scale: 0.98,
                rotationY: -5,
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              },
              {
                opacity: 1,
                scale: 1.02,
                rotationY: 0,
                boxShadow: "0 8px 40px rgba(59, 130, 246, 0.3)",
                duration: 1.8,
                ease: "power2.out",
                yoyo: true,
                repeat: 1,
              },
            );

            // Enhanced pulse effect for drone highlighting
            const pulseElement = featureElement.querySelector(".feature-pulse");
            if (pulseElement) {
              gsap.fromTo(
                pulseElement,
                { scale: 1, opacity: 0, borderColor: "transparent" },
                {
                  scale: 1.3,
                  opacity: 0.8,
                  borderColor: "rgb(59, 130, 246)",
                  duration: 1.4,
                  ease: "power2.out",
                  repeat: 2,
                  yoyo: true,
                },
              );
            }
          }

          // Update drone position to point towards current feature
          if (droneRef.current && featureIndex < features.length) {
            const targetFeature = features[featureIndex];
            const targetPosition = new THREE.Vector3(...targetFeature.position);

            // Make drone look at the current feature
            gsap.to(droneRef.current.rotation, {
              y: Math.atan2(
                targetPosition.x - position.x,
                targetPosition.z - position.z,
              ),
              duration: 1.0,
              ease: "power2.out",
            });
          }
        }
      },
    });
  }, [camera, features, currentFeatureIndex]);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[15, 15, 8]} intensity={1.2} />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00ff88" />

      {/* Medical Drone */}
      <MedicalDrone ref={droneRef} />

      {/* Floating Features - now clickable */}
      {features.map((feature, index) => (
        <FloatingFeature
          key={index}
          feature={feature}
          index={index}
          onFeatureClick={onFeatureClick}
          onJumpToSection={onJumpToSection}
        />
      ))}

      <MedicalEnvironment cloudTexture={cloudTexture} />
    </>
  );
}

export const ClinicStreamsJourney = ({
  features,
  onFeatureClick,
  onJumpToSection,
}: ClinicStreamsJourneyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cloudTexture, setCloudTexture] = useState<string>('');
  
  useEffect(() => {
    setCloudTexture(createCloudTexture());
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [8, 5, 8], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <MedicalScene
          features={features}
          onFeatureClick={onFeatureClick}
          onJumpToSection={onJumpToSection}
          cloudTexture={cloudTexture}
        />
      </Canvas>
    </div>
  );
};
