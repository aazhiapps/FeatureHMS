import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { 
  Text, 
  Float, 
  Sphere, 
  Box, 
  Cylinder, 
  Torus, 
  Html, 
  useTexture,
  Plane,
  Ring,
  Cone
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Holographic Medical Scanner
const MedicalScanner3D = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const scannerRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const [scanActive, setScanActive] = useState(false);
  
  useFrame((state) => {
    if (scannerRef.current) {
      scannerRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      // Scanning beam animation
      if (beamRef.current && scanActive) {
        beamRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 5;
        beamRef.current.material.opacity = Math.sin(state.clock.elapsedTime * 4) * 0.5 + 0.5;
      }
    }
  });
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanActive(prev => !prev);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={scannerRef} position={position}>
        {/* Scanner Base */}
        <Cylinder args={[4, 4, 1, 32]} position={[0, -3, 0]}>
          <meshStandardMaterial 
            color="#2d3748" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#4a5568"
            emissiveIntensity={0.2}
          />
        </Cylinder>
        
        {/* Scanner Ring */}
        <Torus args={[6, 1, 16, 100]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#00aaff"
            emissive="#0077cc"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Torus>
        
        {/* Inner Scanner Ring */}
        <Torus args={[4.5, 0.3, 8, 64]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#00ff88"
            emissive="#00cc66"
            emissiveIntensity={0.8}
          />
        </Torus>
        
        {/* Scanning Beam */}
        <mesh ref={beamRef} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 10, 8]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={1}
            transparent
            opacity={0.6}
          />
        </mesh>
        
        {/* Scanner Lights */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle) * 6.5, 0, Math.sin(angle) * 6.5]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial
                color={scanActive ? "#00ff00" : "#ff4444"}
                emissive={scanActive ? "#00ff00" : "#ff4444"}
                emissiveIntensity={scanActive ? 0.8 : 0.3}
              />
            </mesh>
          );
        })}
        
        {/* Holographic Display */}
        <Plane args={[6, 4]} position={[0, 6, 0]} rotation={[-Math.PI / 6, 0, 0]}>
          <meshStandardMaterial
            color="#00aaff"
            transparent
            opacity={0.3}
            emissive="#0077cc"
            emissiveIntensity={0.4}
            side={THREE.DoubleSide}
          />
        </Plane>
        
        {/* Holographic Text */}
        <Text
          position={[0, 6, 0.1]}
          rotation={[-Math.PI / 6, 0, 0]}
          fontSize={0.8}
          color="#00ffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
        >
          {scanActive ? "SCANNING..." : "READY"}
        </Text>
      </group>
    </Float>
  );
};

// 3D Heart with Pulse Animation
const AnimatedHeart3D = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const heartRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (heartRef.current) {
      // Heartbeat animation
      const beat = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 1;
      heartRef.current.scale.setScalar(beat);
      
      // Floating
      heartRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
    
    if (pulseRef.current) {
      // Pulse wave effect
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 1;
      pulseRef.current.scale.setScalar(pulse);
      pulseRef.current.material.opacity = 1 - (pulse - 1) / 0.3 * 0.8;
    }
  });
  
  const heartShape = new THREE.Shape();
  const x = 0, y = 0;
  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 3.5, x - 6, y + 3.5);
  heartShape.bezierCurveTo(x - 6, y + 5.5, x - 4, y + 7.7, x, y + 10);
  heartShape.bezierCurveTo(x + 4, y + 7.7, x + 6, y + 5.5, x + 6, y + 3.5);
  heartShape.bezierCurveTo(x + 6, y + 3.5, x + 6, y, x, y);
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
      <group ref={heartRef} position={position}>
        {/* Main Heart */}
        <mesh>
          <extrudeGeometry args={[heartShape, { depth: 2, bevelEnabled: true, bevelSize: 0.5 }]} />
          <meshStandardMaterial
            color="#ff4757"
            emissive="#ff3838"
            emissiveIntensity={0.5}
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
        
        {/* Pulse Ring */}
        <mesh ref={pulseRef}>
          <torusGeometry args={[8, 1, 8, 32]} />
          <meshStandardMaterial
            color="#ff4757"
            emissive="#ff4757"
            emissiveIntensity={0.6}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Arteries/Veins */}
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <Cylinder
              key={i}
              args={[0.3, 0.1, 12, 8]}
              position={[Math.cos(angle) * 5, 0, Math.sin(angle) * 5]}
              rotation={[Math.PI / 2, 0, angle]}
            >
              <meshStandardMaterial
                color="#c44569"
                emissive="#c44569"
                emissiveIntensity={0.3}
              />
            </Cylinder>
          );
        })}
      </group>
    </Float>
  );
};

// DNA Double Helix
const DNAHelix3D = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const helixRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      helixRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 1;
    }
  });
  
  const helixPoints = React.useMemo(() => {
    const points: { pos: [number, number, number], color: string, type: 'A' | 'T' | 'G' | 'C' }[] = [];
    const height = 20;
    const radius = 3;
    const turns = 4;
    
    for (let i = 0; i <= 200; i++) {
      const t = (i / 200) * turns * Math.PI * 2;
      const y = (i / 200) * height - height / 2;
      
      // First strand
      points.push({
        pos: [Math.cos(t) * radius, y, Math.sin(t) * radius],
        color: '#00ff88',
        type: ['A', 'T', 'G', 'C'][i % 4] as any
      });
      
      // Second strand
      points.push({
        pos: [Math.cos(t + Math.PI) * radius, y, Math.sin(t + Math.PI) * radius],
        color: '#0088ff',
        type: ['T', 'A', 'C', 'G'][i % 4] as any
      });
    }
    
    return points;
  }, []);
  
  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={helixRef} position={position}>
        {helixPoints.map((point, index) => (
          <mesh key={index} position={point.pos}>
            <sphereGeometry args={[0.3, 8, 8]} />
            <meshStandardMaterial
              color={point.color}
              emissive={point.color}
              emissiveIntensity={0.4}
            />
          </mesh>
        ))}
        
        {/* Base Pairs */}
        {helixPoints.filter((_, i) => i % 8 === 0).map((point, index) => {
          if (index >= helixPoints.length / 2) return null;
          const oppositePoint = helixPoints[index * 8 + 1];
          
          return (
            <line key={`base-${index}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([...point.pos, ...oppositePoint.pos])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" opacity={0.6} transparent />
            </line>
          );
        })}
        
        {/* Information Display */}
        <Html position={[0, 12, 0]} center>
          <div className="text-center bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
            <div className="text-lg font-bold">DNA Structure</div>
            <div className="text-sm text-gray-300">Double Helix Model</div>
          </div>
        </Html>
      </group>
    </Float>
  );
};

// Medical Molecule Visualization
const MedicalMolecule = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const moleculeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (moleculeRef.current) {
      moleculeRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      moleculeRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      moleculeRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });
  
  const atoms = [
    { pos: [0, 0, 0], color: '#ff6b6b', size: 1.2, label: 'O' },
    { pos: [2, 1, 0], color: '#4ecdc4', size: 1.0, label: 'C' },
    { pos: [-2, 1, 0], color: '#45b7d1', size: 0.8, label: 'N' },
    { pos: [0, -2, 1], color: '#96ceb4', size: 0.9, label: 'H' },
    { pos: [1, 1, 2], color: '#feca57', size: 1.1, label: 'S' },
    { pos: [-1, -1, -2], color: '#ff9ff3', size: 0.7, label: 'P' }
  ];
  
  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <group ref={moleculeRef} position={position}>
        {atoms.map((atom, index) => (
          <group key={index}>
            <mesh position={atom.pos}>
              <sphereGeometry args={[atom.size, 16, 16]} />
              <meshStandardMaterial
                color={atom.color}
                emissive={atom.color}
                emissiveIntensity={0.3}
                metalness={0.2}
                roughness={0.8}
              />
            </mesh>
            
            <Text
              position={[atom.pos[0], atom.pos[1] + atom.size + 0.5, atom.pos[2]]}
              fontSize={0.6}
              color="white"
              anchorX="center"
              anchorY="middle"
              font="/fonts/roboto-bold.woff"
            >
              {atom.label}
            </Text>
          </group>
        ))}
        
        {/* Bonds */}
        {atoms.slice(0, -1).map((atom, index) => {
          const nextAtom = atoms[index + 1];
          return (
            <line key={`bond-${index}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([...atom.pos, ...nextAtom.pos])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#ffffff" opacity={0.8} transparent linewidth={2} />
            </line>
          );
        })}
        
        {/* Orbital Electrons */}
        {[...Array(3)].map((_, i) => (
          <Ring
            key={i}
            args={[3 + i, 3.2 + i, 32]}
            rotation={[Math.PI / 2, i * Math.PI / 3, 0]}
          >
            <meshStandardMaterial
              color="#00aaff"
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </Ring>
        ))}
      </group>
    </Float>
  );
};

// Main Hero Section Component
export const HeroSection3D = ({ 
  showTitle = true,
  interactive = true
}: { 
  showTitle?: boolean; 
  interactive?: boolean;
}) => {
  const heroRef = useRef<THREE.Group>(null);
  const [activeModel, setActiveModel] = useState<'scanner' | 'heart' | 'dna' | 'molecule'>('scanner');
  
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.position,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 2, ease: "back.out(1.7)" }
      );
    }
  }, []);
  
  useFrame((state) => {
    if (heroRef.current) {
      heroRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });
  
  return (
    <group ref={heroRef}>
      {/* Background Elements */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, 5, 10]} intensity={1} color="#00aaff" />
      <spotLight position={[0, 20, 0]} angle={0.3} intensity={2} color="#00ff88" />
      
      {/* Main Medical Models */}
      {activeModel === 'scanner' && <MedicalScanner3D position={[0, 0, -5]} />}
      {activeModel === 'heart' && <AnimatedHeart3D position={[0, 0, -5]} />}
      {activeModel === 'dna' && <DNAHelix3D position={[0, -5, -5]} />}
      {activeModel === 'molecule' && <MedicalMolecule position={[0, 0, -5]} />}
      
      {/* Supporting Elements */}
      <DNAHelix3D position={[-25, -10, -15]} />
      <MedicalMolecule position={[25, 5, -20]} />
      <AnimatedHeart3D position={[-30, 10, -25]} />
      
      {/* Floating Info Panels */}
      {showTitle && (
        <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <Html position={[0, 15, 0]} center>
            <div className="text-center">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-green-400 bg-clip-text text-transparent mb-4">
                ClinicStreams
              </h1>
              <p className="text-2xl text-white/80 mb-6">
                Next-Generation Healthcare Management
              </p>
              <div className="text-lg text-white/60">
                Experience the future of medical technology in 3D
              </div>
            </div>
          </Html>
        </Float>
      )}
      
      {/* Interactive Model Selector */}
      {interactive && (
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
          <Html position={[20, -10, 5]} center>
            <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
              <div className="text-sm font-bold mb-3">3D Models</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'scanner', label: '🔬 Scanner', desc: 'Medical Scanner' },
                  { id: 'heart', label: '❤️ Heart', desc: 'Heart Monitor' },
                  { id: 'dna', label: '🧬 DNA', desc: 'DNA Analysis' },
                  { id: 'molecule', label: '⚛️ Molecule', desc: 'Molecular Structure' }
                ].map((model) => (
                  <button
                    key={model.id}
                    onClick={() => setActiveModel(model.id as any)}
                    className={`p-2 rounded text-xs transition-all ${
                      activeModel === model.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    <div>{model.label}</div>
                    <div className="text-xs opacity-70">{model.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </Html>
        </Float>
      )}
      
      {/* Floating Statistics */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.4}>
        <Html position={[-20, 8, 0]} center>
          <div className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-md rounded-lg p-6 text-white border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-sm">System Uptime</div>
            </div>
          </div>
        </Html>
      </Float>
      
      <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.3}>
        <Html position={[0, -15, 8]} center>
          <div className="bg-gradient-to-br from-green-900/80 to-blue-900/80 backdrop-blur-md rounded-lg p-6 text-white border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-sm">Healthcare Facilities</div>
            </div>
          </div>
        </Html>
      </Float>
      
      {/* Ambient Particles */}
      {[...Array(50)].map((_, i) => (
        <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.1} floatIntensity={0.2}>
          <mesh
            position={[
              (Math.random() - 0.5) * 80,
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 60
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
    </group>
  );
};
