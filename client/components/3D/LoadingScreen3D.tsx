import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  Float, 
  Sphere, 
  Cylinder, 
  Torus, 
  Html, 
  Plane,
  Ring,
  Cone,
  Box
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface LoadingScreen3DProps {
  progress: number;
  stage: string;
  onComplete: () => void;
  duration?: number;
}

// Holographic Medical Scanner
const HolographicScanner = ({ progress }: { progress: number }) => {
  const scannerRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
    
    if (beamRef.current) {
      // Scanning beam animation
      beamRef.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 8 - 2;
      beamRef.current.material.opacity = Math.sin(state.clock.elapsedTime * 6) * 0.3 + 0.7;
      
      // Progress-based intensity
      beamRef.current.material.emissiveIntensity = progress * 2;
    }
    
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        ring.rotation.z = state.clock.elapsedTime * (1 + index * 0.5);
        ring.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.1);
      });
    }
  });
  
  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={scannerRef}>
        {/* Main Scanner Base */}
        <Cylinder args={[8, 8, 2, 32]} position={[0, -8, 0]}>
          <meshStandardMaterial 
            color="#1a202c" 
            metalness={0.9} 
            roughness={0.1}
            emissive="#2d3748"
            emissiveIntensity={0.3}
          />
        </Cylinder>
        
        {/* Scanner Tube */}
        <Torus args={[12, 3, 16, 100]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#00aaff"
            emissive="#0088cc"
            emissiveIntensity={0.6}
            transparent
            opacity={0.8}
            metalness={0.5}
            roughness={0.3}
          />
        </Torus>
        
        {/* Inner Scanner Rings */}
        <group ref={ringsRef}>
          {[...Array(4)].map((_, i) => (
            <Torus 
              key={i}
              args={[10 - i * 1.5, 0.3, 8, 64]} 
              position={[0, 0, 0]}
            >
              <meshStandardMaterial 
                color="#00ff88"
                emissive="#00cc66"
                emissiveIntensity={0.8 - i * 0.1}
                transparent
                opacity={0.7 - i * 0.1}
              />
            </Torus>
          ))}
        </group>
        
        {/* Scanning Beam */}
        <mesh ref={beamRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 16, 8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        
        {/* Vertical Beam */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[8, 8, 0.2, 32]} />
          <meshStandardMaterial
            color="#00aaff"
            emissive="#00aaff"
            emissiveIntensity={progress}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Medical Data Points */}
        {[...Array(16)].map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const radius = 14;
          return (
            <Sphere 
              key={i}
              args={[0.3, 8, 8]} 
              position={[
                Math.cos(angle) * radius,
                Math.sin(i * 0.5) * 2,
                Math.sin(angle) * radius
              ]}
            >
              <meshStandardMaterial
                color={i % 3 === 0 ? "#ff6b6b" : i % 3 === 1 ? "#4ecdc4" : "#feca57"}
                emissive={i % 3 === 0 ? "#ff6b6b" : i % 3 === 1 ? "#4ecdc4" : "#feca57"}
                emissiveIntensity={progress * 0.8}
              />
            </Sphere>
          );
        })}
        
        {/* Progress Indicators */}
        {[...Array(8)].map((_, i) => {
          const isActive = i < progress * 8;
          return (
            <Box
              key={i}
              args={[0.5, 0.5, 0.5]}
              position={[-10 + i * 2.5, 6, 0]}
            >
              <meshStandardMaterial
                color={isActive ? "#00ff00" : "#333333"}
                emissive={isActive ? "#00aa00" : "#111111"}
                emissiveIntensity={isActive ? 0.8 : 0.1}
              />
            </Box>
          );
        })}
      </group>
    </Float>
  );
};

// Medical Data Visualization
const MedicalDataViz = ({ progress }: { progress: number }) => {
  const dataRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (dataRef.current) {
      dataRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      // Animate individual data points
      dataRef.current.children.forEach((child, index) => {
        if (child.type === 'Mesh') {
          child.position.y = Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 2;
          child.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.2);
        }
      });
    }
  });
  
  const dataTypes = [
    { name: 'ECG', icon: '💓', color: '#ff6b6b', position: [20, 5, 5] },
    { name: 'X-Ray', icon: '🦴', color: '#4ecdc4', position: [-20, 8, -5] },
    { name: 'Blood', icon: '🩸', color: '#ff4757', position: [15, -5, -10] },
    { name: 'DNA', icon: '🧬', color: '#3742fa', position: [-15, -8, 8] },
    { name: 'Brain', icon: '🧠', color: '#ffa502', position: [0, 12, -15] },
    { name: 'Temp', icon: '🌡️', color: '#2ed573', position: [0, -12, 10] }
  ];
  
  return (
    <group ref={dataRef}>
      {dataTypes.map((data, index) => {
        const isVisible = progress > index / dataTypes.length;
        
        return (
          <Float 
            key={data.name}
            speed={1 + index * 0.2} 
            rotationIntensity={0.3} 
            floatIntensity={0.5}
          >
            <group position={data.position}>
              {/* Data Sphere */}
              <Sphere args={[1.5, 16, 16]}>
                <meshStandardMaterial
                  color={data.color}
                  emissive={data.color}
                  emissiveIntensity={isVisible ? 0.5 : 0.1}
                  transparent
                  opacity={isVisible ? 0.9 : 0.3}
                />
              </Sphere>
              
              {/* Data Icon */}
              <Html center>
                <div 
                  className="text-4xl select-none"
                  style={{ 
                    opacity: isVisible ? 1 : 0.3,
                    transform: `scale(${isVisible ? 1 : 0.5})`
                  }}
                >
                  {data.icon}
                </div>
              </Html>
              
              {/* Data Streams */}
              {isVisible && [...Array(3)].map((_, i) => (
                <Ring
                  key={i}
                  args={[2 + i * 0.5, 2.2 + i * 0.5, 32]}
                  rotation={[Math.PI / 2, i * Math.PI / 3, 0]}
                >
                  <meshStandardMaterial
                    color={data.color}
                    transparent
                    opacity={0.3 - i * 0.1}
                    side={THREE.DoubleSide}
                  />
                </Ring>
              ))}
              
              {/* Connection to Scanner */}
              {isVisible && (
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([
                        0, 0, 0,
                        -data.position[0] * 0.5,
                        -data.position[1] * 0.5,
                        -data.position[2] * 0.5
                      ])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial 
                    color={data.color} 
                    opacity={0.6} 
                    transparent 
                  />
                </line>
              )}
            </group>
          </Float>
        );
      })}
    </group>
  );
};

// Circular Progress Ring
const ProgressRing3D = ({ progress, stage }: { progress: number; stage: string }) => {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
    }
  });
  
  return (
    <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.1}>
      <group position={[0, -18, 8]}>
        {/* Background Ring */}
        <Torus args={[6, 0.5, 8, 32]}>
          <meshStandardMaterial 
            color="#333333" 
            transparent 
            opacity={0.3}
          />
        </Torus>
        
        {/* Progress Ring */}
        <mesh ref={ringRef}>
          <torusGeometry 
            args={[6, 0.5, 8, Math.max(1, Math.floor(32 * progress))]} 
          />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00cc66"
            emissiveIntensity={0.8}
          />
        </mesh>
        
        {/* Central Progress Display */}
        <Cylinder args={[4, 4, 1, 32]}>
          <meshStandardMaterial
            color="#1a202c"
            emissive="#2d3748"
            emissiveIntensity={0.3}
          />
        </Cylinder>
        
        {/* Progress Text */}
        <Text
          position={[0, 0, 1]}
          fontSize={2}
          color="#00ff88"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
        >
          {Math.round(progress * 100)}%
        </Text>
        
        {/* Stage Text */}
        <Html position={[0, -8, 0]} center>
          <div className="text-center">
            <div className="text-white text-xl font-bold mb-2">
              {stage}
            </div>
            <div className="text-gray-300 text-sm">
              Initializing Healthcare Systems...
            </div>
          </div>
        </Html>
      </group>
    </Float>
  );
};

// System Status Indicators
const SystemStatus = ({ progress }: { progress: number }) => {
  const systems = [
    { name: 'Patient Database', icon: '👥', threshold: 0.1 },
    { name: 'Medical Records', icon: '📋', threshold: 0.25 },
    { name: 'Scheduling System', icon: '📅', threshold: 0.4 },
    { name: 'Security Protocols', icon: '🔒', threshold: 0.55 },
    { name: 'Analytics Engine', icon: '📊', threshold: 0.7 },
    { name: 'AI Diagnostics', icon: '🤖', threshold: 0.85 },
    { name: 'Integration Layer', icon: '🔗', threshold: 0.95 }
  ];
  
  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.4}>
      <group position={[25, 0, 0]}>
        {systems.map((system, index) => {
          const isActive = progress >= system.threshold;
          const yPos = (index - systems.length / 2) * 3;
          
          return (
            <group key={system.name} position={[0, yPos, 0]}>
              {/* Status Indicator */}
              <Sphere args={[0.5, 8, 8]}>
                <meshStandardMaterial
                  color={isActive ? "#00ff00" : "#333333"}
                  emissive={isActive ? "#00aa00" : "#111111"}
                  emissiveIntensity={isActive ? 0.8 : 0.1}
                />
              </Sphere>
              
              {/* Connection Line */}
              <Cylinder args={[0.05, 0.05, 4, 8]} position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <meshStandardMaterial
                  color={isActive ? "#00ff00" : "#333333"}
                  emissive={isActive ? "#00aa00" : "#111111"}
                  emissiveIntensity={isActive ? 0.5 : 0.1}
                />
              </Cylinder>
              
              {/* System Info */}
              <Html position={[-6, 0, 0]} center>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{system.icon}</span>
                  <div className="text-white text-sm">
                    <div className="font-bold">{system.name}</div>
                    <div className={`text-xs ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                      {isActive ? 'Online' : 'Initializing...'}
                    </div>
                  </div>
                </div>
              </Html>
            </group>
          );
        })}
      </group>
    </Float>
  );
};

// Main Loading Screen Component
export const LoadingScreen3D: React.FC<LoadingScreen3DProps> = ({
  progress,
  stage,
  onComplete,
  duration = 6000
}) => {
  const sceneRef = useRef<THREE.Group>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const startTime = useRef(Date.now());
  
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
      gsap.fromTo(sceneRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.7)" }
      );
    }
  }, []);
  
  const currentProgress = Math.max(progress, animationProgress);
  
  return (
    <group ref={sceneRef}>
      {/* Enhanced Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[0, 20, 10]} intensity={2} color="#00aaff" />
      <spotLight position={[-20, 15, 20]} angle={0.3} intensity={1.5} color="#00ff88" />
      <spotLight position={[20, 15, -20]} angle={0.3} intensity={1.5} color="#ff6b6b" />
      
      {/* Main Scanner */}
      <HolographicScanner progress={currentProgress} />
      
      {/* Medical Data Visualization */}
      <MedicalDataViz progress={currentProgress} />
      
      {/* Progress Ring */}
      <ProgressRing3D progress={currentProgress} stage={stage} />
      
      {/* System Status */}
      <SystemStatus progress={currentProgress} />
      
      {/* Title */}
      <Float speed={0.3} rotationIntensity={0.05} floatIntensity={0.1}>
        <Text
          position={[0, 25, 0]}
          fontSize={4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
        >
          ClinicStreams
        </Text>
        
        <Text
          position={[0, 20, 0]}
          fontSize={1.5}
          color="#00aaff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
        >
          Next-Generation Healthcare Management
        </Text>
      </Float>
      
      {/* Background Particles */}
      {[...Array(100)].map((_, i) => (
        <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh
            position={[
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 60,
              (Math.random() - 0.5) * 80
            ]}
          >
            <sphereGeometry args={[0.1, 4, 4]} />
            <meshStandardMaterial
              color={['#00aaff', '#00ff88', '#ff6b6b', '#feca57'][Math.floor(Math.random() * 4)]}
              emissive={['#0077cc', '#00cc66', '#cc5555', '#cc9944'][Math.floor(Math.random() * 4)]}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
      
      {/* Completion Effect */}
      {currentProgress >= 0.95 && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
          <group>
            {[...Array(20)].map((_, i) => {
              const angle = (i / 20) * Math.PI * 2;
              const radius = 30;
              return (
                <Sphere
                  key={i}
                  args={[0.5, 8, 8]}
                  position={[
                    Math.cos(angle) * radius,
                    Math.sin(angle * 2) * 10,
                    Math.sin(angle) * radius
                  ]}
                >
                  <meshStandardMaterial
                    color="#00ff00"
                    emissive="#00ff00"
                    emissiveIntensity={1}
                  />
                </Sphere>
              );
            })}
          </group>
        </Float>
      )}
    </group>
  );
};
