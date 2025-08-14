import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Stars, 
  Float, 
  Sparkles,
  Html,
  PerspectiveCamera,
  Effects,
  ContactShadows
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface Scene3DProps {
  children?: React.ReactNode;
  enableControls?: boolean;
  ambientIntensity?: number;
  enablePostProcessing?: boolean;
  background?: 'space' | 'medical' | 'gradient';
}

// 3D Background Environment
const Background3D = ({ type = 'medical' }: { type: 'space' | 'medical' | 'gradient' }) => {
  const { scene } = useThree();
  
  useEffect(() => {
    if (type === 'gradient') {
      const geometry = new THREE.SphereGeometry(500, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          colorA: { value: new THREE.Color(0x0f172a) },
          colorB: { value: new THREE.Color(0x1e293b) },
          colorC: { value: new THREE.Color(0x3730a3) },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            vUv = uv;
            vPosition = position;
            
            vec3 pos = position;
            pos.y += sin(time * 0.5 + position.x * 0.01) * 2.0;
            pos.x += cos(time * 0.3 + position.z * 0.01) * 1.5;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 colorA;
          uniform vec3 colorB;
          uniform vec3 colorC;
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            float mixer = sin(time * 0.2 + vPosition.y * 0.01) * 0.5 + 0.5;
            vec3 color = mix(colorA, colorB, vUv.y);
            color = mix(color, colorC, mixer);
            
            // Add some noise
            float noise = sin(vPosition.x * 0.01 + time) * sin(vPosition.z * 0.01 + time * 1.1) * 0.1;
            color += noise;
            
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.BackSide,
      });
      
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
      
      const animate = () => {
        material.uniforms.time.value = Date.now() * 0.001;
        requestAnimationFrame(animate);
      };
      animate();
      
      return () => {
        scene.remove(sphere);
        geometry.dispose();
        material.dispose();
      };
    }
  }, [type, scene]);
  
  if (type === 'space') {
    return <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} />;
  }
  
  return null;
};

// Floating 3D Particles
const FloatingParticles = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const particleCount = 2000;
  
  const particles = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Position
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
      
      // Color (medical themed - blues, greens, whites)
      const colorChoice = Math.random();
      if (colorChoice < 0.3) {
        colors[i * 3] = 0.2;     // R
        colors[i * 3 + 1] = 0.8; // G
        colors[i * 3 + 2] = 1.0; // B
      } else if (colorChoice < 0.6) {
        colors[i * 3] = 0.1;
        colors[i * 3 + 1] = 0.9;
        colors[i * 3 + 2] = 0.3;
      } else {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 1.0;
        colors[i * 3 + 2] = 1.0;
      }
      
      // Size
      sizes[i] = Math.random() * 3 + 0.5;
    }
    
    return { positions, colors, sizes };
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime + positions[i3]) * 0.01;
        positions[i3] += Math.cos(state.clock.elapsedTime + positions[i3 + 2]) * 0.005;
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
      particlesRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={{
          time: { value: 0 },
          pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
        }}
        vertexShader={`
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float pixelRatio;
          
          void main() {
            vColor = color;
            
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            
            gl_Position = projectedPosition;
            gl_PointSize = size * pixelRatio * (300.0 / -viewPosition.z);
          }
        `}
        fragmentShader={`
          varying vec3 vColor;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.1;
            
            gl_FragColor = vec4(vColor, strength);
          }
        `}
        transparent
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3D DNA Helix
const DNAHelix = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2;
    }
  });
  
  const helixPoints = React.useMemo(() => {
    const points: [number, number, number][] = [];
    const turns = 3;
    const height = 20;
    const radius = 3;
    
    for (let i = 0; i <= 100; i++) {
      const t = (i / 100) * turns * Math.PI * 2;
      const y = (i / 100) * height - height / 2;
      
      // First strand
      points.push([
        Math.cos(t) * radius,
        y,
        Math.sin(t) * radius
      ]);
      
      // Second strand (opposite)
      points.push([
        Math.cos(t + Math.PI) * radius,
        y,
        Math.sin(t + Math.PI) * radius
      ]);
    }
    
    return points;
  }, []);
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position}>
        {helixPoints.map((point, index) => (
          <mesh key={index} position={point}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial 
              color={index % 2 === 0 ? "#00ff88" : "#0088ff"} 
              emissive={index % 2 === 0 ? "#004422" : "#002244"}
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
        
        {/* Connection lines */}
        {helixPoints.slice(0, -2).map((point, index) => {
          if (index % 4 === 0) {
            const nextPoint = helixPoints[index + 2];
            return (
              <line key={`line-${index}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([...point, ...nextPoint])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial color="#ffffff" opacity={0.3} transparent />
              </line>
            );
          }
          return null;
        })}
      </group>
    </Float>
  );
};

// Heart Beat Pulse
const HeartBeatPulse = ({ position = [0, 0, 0] }: { position?: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.3 + 1;
      meshRef.current.scale.setScalar(pulse);
      
      // Heartbeat rhythm
      const beat = Math.sin(state.clock.elapsedTime * 8) > 0.8 ? 1.5 : 1;
      meshRef.current.material.emissiveIntensity = beat * 0.5;
    }
  });
  
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[2, 16, 16]} />
        <meshStandardMaterial 
          color="#ff0055" 
          emissive="#ff0055"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
        
        {/* Pulse rings */}
        <mesh scale={[1.5, 1.5, 1.5]}>
          <ringGeometry args={[2, 2.5, 32]} />
          <meshBasicMaterial color="#ff0055" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
        <mesh scale={[2, 2, 2]}>
          <ringGeometry args={[2, 2.2, 32]} />
          <meshBasicMaterial color="#ff0055" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
      </mesh>
    </Float>
  );
};

// Camera Controller
const CameraController = () => {
  const { camera } = useThree();
  
  useEffect(() => {
    // Smooth camera intro animation
    gsap.fromTo(camera.position, 
      { x: 0, y: 0, z: 100 },
      { x: 0, y: 5, z: 30, duration: 3, ease: "power2.out" }
    );
  }, [camera]);
  
  return null;
};

// Loading Fallback
const Scene3DFallback = () => (
  <Html center>
    <div className="text-white text-xl font-bold animate-pulse">
      Loading 3D Experience...
    </div>
  </Html>
);

export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  enableControls = true,
  ambientIntensity = 0.3,
  enablePostProcessing = true,
  background = 'medical'
}) => {
  return (
    <div className="w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 5, 30], fov: 75 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance" 
        }}
      >
        <Suspense fallback={<Scene3DFallback />}>
          <CameraController />
          
          {/* Lighting Setup */}
          <ambientLight intensity={ambientIntensity} color="#ffffff" />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1.2} 
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <spotLight
            position={[-10, 15, 10]}
            angle={0.3}
            intensity={0.8}
            color="#00ff88"
            castShadow
          />
          <pointLight position={[20, 20, 20]} intensity={0.5} color="#0088ff" />
          
          {/* Background Environment */}
          <Background3D type={background} />
          
          {/* 3D Elements */}
          <FloatingParticles />
          <DNAHelix position={[-20, 0, -10]} />
          <HeartBeatPulse position={[20, 0, -10]} />
          
          {/* Medical Molecules */}
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.7}>
            <Sparkles count={100} scale={[40, 40, 40]} size={2} speed={0.3} color="#00ff88" />
          </Float>
          
          {/* Contact Shadows */}
          <ContactShadows 
            position={[0, -10, 0]} 
            opacity={0.3} 
            scale={100} 
            blur={2} 
            far={20} 
          />
          
          {/* Controls */}
          {enableControls && (
            <OrbitControls
              enablePan={false}
              enableZoom={true}
              enableRotate={true}
              maxDistance={50}
              minDistance={10}
              maxPolarAngle={Math.PI / 2}
              autoRotate={true}
              autoRotateSpeed={0.5}
            />
          )}
          
          {/* Environment Preset */}
          <Environment preset="city" background={false} />
          
          {/* Custom Children */}
          {children}
          
          {/* Post Processing Effects */}
          {enablePostProcessing && (
            <EffectComposer multisampling={8}>
              <Bloom 
                intensity={0.5} 
                luminanceThreshold={0.8} 
                luminanceSmoothing={0.2}
                height={300}
              />
              <ChromaticAberration 
                offset={[0.0005, 0.0012]} 
                radialModulation={true}
                modulationOffset={0.3}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.3} />
            </EffectComposer>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
};
