import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float, Sphere, Box, Cylinder, Torus, Ring } from '@react-three/drei';
import * as THREE from 'three';

// Medical Scanner Room Environment
export const MedicalScannerRoom = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Room Structure */}
      <mesh position={[0, 0, -50]} receiveShadow>
        <planeGeometry args={[100, 60]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      
      {/* Medical Equipment */}
      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[-15, -5, -20]}>
          {/* MRI Machine */}
          <Cylinder args={[6, 6, 3, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
          </Cylinder>
          <Cylinder args={[3, 3, 4, 32]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#333" />
          </Cylinder>
          
          {/* Scanner Lights */}
          {[...Array(8)].map((_, i) => (
            <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 5.5, 0, Math.sin(i * Math.PI / 4) * 5.5]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      </Float>
      
      {/* Holographic Displays */}
      <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
        <group position={[20, 5, -15]}>
          {[0, 1, 2].map(i => (
            <mesh key={i} position={[0, i * 3, 0]} rotation={[0, Math.PI / 4, 0]}>
              <planeGeometry args={[4, 3]} />
              <meshStandardMaterial 
                color="#00aaff" 
                transparent 
                opacity={0.3}
                emissive="#0066aa"
                emissiveIntensity={0.2}
              />
            </mesh>
          ))}
        </group>
      </Float>
      
      {/* Medical Ceiling Lights */}
      {[...Array(4)].map((_, i) => (
        <Float key={i} speed={0.3} rotationIntensity={0.1} floatIntensity={0.1}>
          <group position={[i * 8 - 12, 15, -25]}>
            <Cylinder args={[2, 2, 0.5, 8]}>
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.8} />
            </Cylinder>
            <pointLight position={[0, -2, 0]} intensity={2} color="#ffffff" />
          </group>
        </Float>
      ))}
    </group>
  );
};

// Laboratory Environment
export const LaboratoryEnvironment = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, -10, -30]}>
      {/* Lab Tables */}
      {[...Array(3)].map((_, i) => (
        <Float key={i} speed={0.2} rotationIntensity={0.05} floatIntensity={0.1}>
          <group position={[i * 10 - 10, 0, 0]}>
            <Box args={[8, 1, 4]} position={[0, 2, 0]}>
              <meshStandardMaterial color="#f0f0f0" metalness={0.1} roughness={0.8} />
            </Box>
            
            {/* Lab Equipment */}
            <Cylinder args={[0.5, 0.5, 2, 8]} position={[-2, 3.5, 0]}>
              <meshStandardMaterial color="#4a5568" />
            </Cylinder>
            <Sphere args={[0.3, 8, 8]} position={[-2, 4.5, 0]}>
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.3} />
            </Sphere>
            
            {/* Test Tubes */}
            {[...Array(5)].map((_, j) => (
              <group key={j} position={[j * 1.2 - 2, 2.5, 1.5]}>
                <Cylinder args={[0.15, 0.15, 1.5, 8]}>
                  <meshStandardMaterial color="#8cc8ff" transparent opacity={0.8} />
                </Cylinder>
                <Cylinder args={[0.12, 0.12, 0.8, 8]} position={[0, -0.35, 0]}>
                  <meshStandardMaterial 
                    color={j % 2 === 0 ? "#ff6b6b" : "#4ecdc4"} 
                    transparent 
                    opacity={0.7}
                  />
                </Cylinder>
              </group>
            ))}
          </group>
        </Float>
      ))}
      
      {/* Microscopes */}
      {[...Array(2)].map((_, i) => (
        <Float key={i} speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[i * 15 - 7.5, 2.5, -8]}>
            <Cylinder args={[1, 1, 0.5, 8]}>
              <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
            </Cylinder>
            <Cylinder args={[0.3, 0.3, 3, 8]} position={[0, 2, 0]}>
              <meshStandardMaterial color="#2d3748" metalness={0.7} roughness={0.3} />
            </Cylinder>
            <Sphere args={[0.4, 8, 8]} position={[0, 3.5, 0]}>
              <meshStandardMaterial color="#4a5568" />
            </Sphere>
          </group>
        </Float>
      ))}
    </group>
  );
};

// Hospital Corridor
export const HospitalCorridor = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });
  
  return (
    <group ref={groupRef} position={[0, 0, -40]}>
      {/* Corridor Walls */}
      <mesh position={[-20, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial color="#f7fafc" />
      </mesh>
      <mesh position={[20, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[2, 20]} />
        <meshStandardMaterial color="#f7fafc" />
      </mesh>
      
      {/* Medical Signs */}
      {[...Array(6)].map((_, i) => (
        <Float key={i} speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[-19.5, 8 - i * 2.5, i * 8 - 15]}>
            <Box args={[0.1, 1.5, 2]}>
              <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.2} />
            </Box>
            <mesh position={[0.1, 0, 0]}>
              <planeGeometry args={[1.8, 1.3]} />
              <meshStandardMaterial color="#ffffff" />
            </mesh>
          </group>
        </Float>
      ))}
      
      {/* Hospital Beds */}
      {[...Array(4)].map((_, i) => (
        <Float key={i} speed={0.2} rotationIntensity={0.1} floatIntensity={0.1}>
          <group position={[i * 8 - 12, -5, i * 5 - 10]}>
            <Box args={[6, 1, 2]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#e2e8f0" />
            </Box>
            <Box args={[6.2, 0.2, 2.2]} position={[0, 0.6, 0]}>
              <meshStandardMaterial color="#ffffff" />
            </Box>
            
            {/* Bed Frame */}
            {[...Array(4)].map((_, j) => (
              <Cylinder 
                key={j} 
                args={[0.1, 0.1, 1, 8]} 
                position={[j % 2 === 0 ? -3 : 3, -0.5, j < 2 ? -1 : 1]}
              >
                <meshStandardMaterial color="#a0aec0" metalness={0.8} roughness={0.2} />
              </Cylinder>
            ))}
          </group>
        </Float>
      ))}
    </group>
  );
};

// Molecular Structure Background
export const MolecularStructure = () => {
  const groupRef = useRef<THREE.Group>(null);
  const moleculeCount = 50;
  
  const molecules = useMemo(() => {
    return [...Array(moleculeCount)].map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ] as [number, number, number],
      scale: Math.random() * 2 + 0.5,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: Math.floor(Math.random() * 3), // 0: atom, 1: molecule, 2: protein
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += molecules[i].rotationSpeed;
        child.rotation.y += molecules[i].rotationSpeed * 0.7;
        child.position.y += Math.sin(state.clock.elapsedTime + i) * 0.01;
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {molecules.map((molecule, i) => (
        <Float 
          key={i} 
          speed={0.5 + Math.random() * 0.5} 
          rotationIntensity={0.3} 
          floatIntensity={0.5}
        >
          <group position={molecule.position} scale={[molecule.scale, molecule.scale, molecule.scale]}>
            {molecule.type === 0 && (
              // Atom
              <Sphere args={[1, 16, 16]}>
                <meshStandardMaterial 
                  color={molecule.color} 
                  emissive={molecule.color}
                  emissiveIntensity={0.2}
                  transparent
                  opacity={0.8}
                />
              </Sphere>
            )}
            
            {molecule.type === 1 && (
              // Molecule (connected spheres)
              <group>
                <Sphere args={[0.8, 12, 12]} position={[-1, 0, 0]}>
                  <meshStandardMaterial color={molecule.color} emissive={molecule.color} emissiveIntensity={0.1} />
                </Sphere>
                <Sphere args={[0.6, 12, 12]} position={[1, 0, 0]}>
                  <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
                </Sphere>
                <Cylinder args={[0.1, 0.1, 2, 8]} rotation={[0, 0, Math.PI / 2]}>
                  <meshStandardMaterial color="#cccccc" />
                </Cylinder>
              </group>
            )}
            
            {molecule.type === 2 && (
              // Complex protein structure
              <group>
                <Torus args={[1, 0.3, 8, 16]}>
                  <meshStandardMaterial 
                    color={molecule.color} 
                    emissive={molecule.color}
                    emissiveIntensity={0.2}
                    wireframe={Math.random() > 0.5}
                  />
                </Torus>
                <Ring args={[0.5, 1.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
                  <meshStandardMaterial 
                    color={molecule.color} 
                    transparent 
                    opacity={0.3}
                    side={THREE.DoubleSide}
                  />
                </Ring>
              </group>
            )}
            
            {/* Connection lines to nearby molecules */}
            {i % 3 === 0 && i < moleculeCount - 1 && (
              <line>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      0, 0, 0,
                      molecules[i + 1].position[0] - molecule.position[0],
                      molecules[i + 1].position[1] - molecule.position[1],
                      molecules[i + 1].position[2] - molecule.position[2]
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#ffffff" opacity={0.1} transparent />
              </line>
            )}
          </group>
        </Float>
      ))}
    </group>
  );
};

// Neural Network Visualization
export const NeuralNetwork = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  const nodeCount = 20;
  
  const networkNodes = useMemo(() => {
    return [...Array(nodeCount)].map((_, i) => ({
      position: [
        Math.cos(i * (Math.PI * 2) / nodeCount) * 8 + (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 10,
        Math.sin(i * (Math.PI * 2) / nodeCount) * 8 + (Math.random() - 0.5) * 4
      ] as [number, number, number],
      connections: [...Array(Math.floor(Math.random() * 3) + 1)].map(() => 
        Math.floor(Math.random() * nodeCount)
      ).filter(c => c !== i)
    }));
  }, []);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      // Animate node pulses
      groupRef.current.children.forEach((child, i) => {
        if (child.type === 'Mesh') {
          const scale = 1 + Math.sin(state.clock.elapsedTime * 2 + i * 0.5) * 0.2;
          child.scale.setScalar(scale);
        }
      });
    }
  });
  
  return (
    <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <group ref={groupRef} position={position}>
        {/* Nodes */}
        {networkNodes.map((node, i) => (
          <mesh key={i} position={node.position}>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshStandardMaterial 
              color="#00aaff" 
              emissive="#0066aa"
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        
        {/* Connections */}
        {networkNodes.map((node, i) => 
          node.connections.map((connectionIndex, j) => {
            const targetNode = networkNodes[connectionIndex];
            if (!targetNode) return null;
            
            return (
              <line key={`${i}-${j}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([
                      ...node.position,
                      ...targetNode.position
                    ])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial 
                  color="#00aaff" 
                  opacity={0.4} 
                  transparent 
                />
              </line>
            );
          })
        )}
        
        {/* Central Core */}
        <mesh>
          <sphereGeometry args={[2, 16, 16]} />
          <meshStandardMaterial 
            color="#ff6b6b" 
            emissive="#ff3333"
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Complete Medical Environment Composer
export const MedicalEnvironment3D = ({ scene = 'scanner' }: { scene?: 'scanner' | 'lab' | 'corridor' | 'molecular' | 'neural' | 'all' }) => {
  return (
    <group>
      {(scene === 'scanner' || scene === 'all') && <MedicalScannerRoom />}
      {(scene === 'lab' || scene === 'all') && <LaboratoryEnvironment />}
      {(scene === 'corridor' || scene === 'all') && <HospitalCorridor />}
      {(scene === 'molecular' || scene === 'all') && <MolecularStructure />}
      {(scene === 'neural' || scene === 'all') && <NeuralNetwork position={[0, 20, -20]} />}
    </group>
  );
};
