import React, { useRef, useMemo } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Holographic Medical Shader
const HolographicMaterial = shaderMaterial(
  {
    time: 0,
    opacity: 1,
    color: new THREE.Color(0.2, 0.8, 1.0),
    scanlineStrength: 0.5,
    noiseScale: 10.0,
    glitchStrength: 0.1,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      
      // Add holographic distortion
      pos.x += sin(time * 2.0 + position.y * 5.0) * 0.02;
      pos.z += cos(time * 1.5 + position.x * 4.0) * 0.015;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform float opacity;
    uniform vec3 color;
    uniform float scanlineStrength;
    uniform float noiseScale;
    uniform float glitchStrength;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Noise function
    float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }
    
    float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Scanlines
      float scanline = sin(uv.y * 100.0 + time * 10.0) * scanlineStrength;
      
      // Noise texture
      float n = noise(uv * noiseScale + time * 0.5) * 0.3;
      
      // Holographic interference
      float interference = sin(uv.x * 50.0 + time * 15.0) * sin(uv.y * 30.0 + time * 8.0) * 0.1;
      
      // Edge glow effect
      float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
      
      // Glitch effect
      float glitch = step(0.98, random(vec2(floor(time * 10.0), floor(uv.y * 20.0)))) * glitchStrength;
      uv.x += glitch * (random(vec2(time, uv.y)) - 0.5) * 0.1;
      
      // Combine effects
      vec3 finalColor = color;
      finalColor += scanline * color;
      finalColor += n * vec3(0.5, 1.0, 1.5);
      finalColor += interference * vec3(1.0, 0.5, 1.0);
      finalColor += fresnel * color * 2.0;
      
      float alpha = opacity * (0.7 + scanline * 0.3 + fresnel * 0.5);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ HolographicMaterial });

// DNA Helix Shader
const DNAHelixMaterial = shaderMaterial(
  {
    time: 0,
    color1: new THREE.Color(0.0, 1.0, 0.5),
    color2: new THREE.Color(0.0, 0.5, 1.0),
    speed: 1.0,
    helixRadius: 3.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform float speed;
    uniform float helixRadius;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Create DNA helix motion
      float angle = time * speed + position.y * 0.5;
      pos.x += cos(angle) * helixRadius * 0.1;
      pos.z += sin(angle) * helixRadius * 0.1;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float speed;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      float wave = sin(vPosition.y * 0.5 + time * speed) * 0.5 + 0.5;
      vec3 color = mix(color1, color2, wave);
      
      // Add energy pulse
      float pulse = sin(time * 5.0) * 0.2 + 0.8;
      color *= pulse;
      
      // Add glow
      float glow = pow(1.0 - abs(vUv.x - 0.5) * 2.0, 3.0);
      color += glow * vec3(0.5, 1.0, 1.0);
      
      gl_FragColor = vec4(color, 0.8 + glow * 0.2);
    }
  `
);

extend({ DNAHelixMaterial });

// Medical Particle Shader
const MedicalParticleMaterial = shaderMaterial(
  {
    time: 0,
    pixelRatio: 1,
    size: 1.0,
    opacity: 1.0,
    color: new THREE.Color(1.0, 1.0, 1.0),
  },
  // Vertex Shader
  `
    attribute float size;
    attribute vec3 color;
    
    uniform float time;
    uniform float pixelRatio;
    
    varying vec3 vColor;
    varying float vOpacity;
    
    void main() {
      vColor = color;
      
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Add floating motion
      modelPosition.y += sin(time * 2.0 + position.x * 0.01) * 2.0;
      modelPosition.x += cos(time * 1.5 + position.z * 0.01) * 1.0;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      // Calculate size and opacity based on distance
      float distance = length(viewPosition.xyz);
      vOpacity = 1.0 / (distance * 0.01 + 1.0);
      
      gl_PointSize = size * pixelRatio * (300.0 / -viewPosition.z);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform float opacity;
    
    varying vec3 vColor;
    varying float vOpacity;
    
    void main() {
      // Create circular particle shape
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float alpha = 1.0 - smoothstep(0.2, 0.5, distanceToCenter);
      
      // Add pulsing effect
      float pulse = sin(time * 4.0) * 0.3 + 0.7;
      alpha *= pulse;
      
      // Add inner glow
      float innerGlow = 1.0 - smoothstep(0.0, 0.3, distanceToCenter);
      vec3 color = vColor + innerGlow * vec3(0.5, 1.0, 1.0);
      
      gl_FragColor = vec4(color, alpha * vOpacity * opacity);
    }
  `
);

extend({ MedicalParticleMaterial });

// Heart Monitor Shader
const HeartMonitorMaterial = shaderMaterial(
  {
    time: 0,
    heartbeat: 1.0,
    color: new THREE.Color(1.0, 0.2, 0.3),
    lineWidth: 0.02,
    amplitude: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    uniform float heartbeat;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      vec3 pos = position;
      
      // Heartbeat scaling
      float beat = sin(time * 4.0) * 0.1 + 1.0;
      pos *= beat * heartbeat;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform vec3 color;
    uniform float lineWidth;
    uniform float amplitude;
    uniform float heartbeat;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    float heartbeatWave(float x) {
      // Create ECG-like heartbeat pattern
      float wave = 0.0;
      
      // Main heartbeat spikes
      if (x > 0.3 && x < 0.7) {
        if (x < 0.4) {
          wave = (x - 0.3) * 10.0; // Rising
        } else if (x < 0.5) {
          wave = 1.0 - (x - 0.4) * 20.0; // Sharp drop
        } else if (x < 0.6) {
          wave = -1.0 + (x - 0.5) * 15.0; // Recovery spike
        } else {
          wave = 0.5 - (x - 0.6) * 5.0; // Return to baseline
        }
      }
      
      return wave * amplitude;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Create heartbeat line
      float x = fract((uv.x + time * 0.5) * 2.0); // Moving pattern
      float heartWave = heartbeatWave(x);
      
      // Calculate distance from heartbeat line
      float lineY = 0.5 + heartWave * 0.3;
      float distanceFromLine = abs(uv.y - lineY);
      
      // Create line with glow
      float line = 1.0 - smoothstep(0.0, lineWidth, distanceFromLine);
      float glow = 1.0 - smoothstep(0.0, lineWidth * 3.0, distanceFromLine);
      
      // Pulse intensity based on heartbeat
      float pulse = sin(time * 8.0) * 0.3 + 0.7;
      
      vec3 finalColor = color * (line + glow * 0.3) * pulse * heartbeat;
      float alpha = (line + glow * 0.1) * heartbeat;
      
      // Add grid background
      float grid = 0.1;
      if (mod(uv.x * 20.0, 1.0) < 0.05 || mod(uv.y * 10.0, 1.0) < 0.05) {
        grid = 0.3;
      }
      
      finalColor += color * grid * 0.2;
      alpha += grid * 0.1;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ HeartMonitorMaterial });

// Medical Scanner Beam Shader
const ScannerBeamMaterial = shaderMaterial(
  {
    time: 0,
    intensity: 1.0,
    color: new THREE.Color(0.0, 1.0, 1.0),
    beamWidth: 0.1,
    scanSpeed: 2.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform float time;
    
    void main() {
      vUv = uv;
      vPosition = position;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform float intensity;
    uniform vec3 color;
    uniform float beamWidth;
    uniform float scanSpeed;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vec2 uv = vUv;
      
      // Create scanning beam
      float scanPosition = fract(time * scanSpeed);
      float beamDistance = abs(uv.y - scanPosition);
      
      // Beam intensity with falloff
      float beam = 1.0 - smoothstep(0.0, beamWidth, beamDistance);
      beam = pow(beam, 2.0);
      
      // Add scan interference
      float interference = sin(uv.y * 50.0 + time * 20.0) * 0.1 + 0.9;
      
      // Create data visualization effect
      float data = step(0.7, sin(uv.x * 30.0 + time * 5.0)) * 
                   step(0.8, sin(uv.y * 20.0 + time * 3.0));
      
      vec3 finalColor = color * beam * intensity * interference;
      finalColor += color * data * 0.3;
      
      float alpha = beam * intensity + data * 0.2;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);

extend({ ScannerBeamMaterial });

// Energy Field Shader
const EnergyFieldMaterial = shaderMaterial(
  {
    time: 0,
    energy: 1.0,
    color1: new THREE.Color(0.0, 0.5, 1.0),
    color2: new THREE.Color(1.0, 0.0, 0.5),
    scale: 10.0,
    speed: 1.0,
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float time;
    uniform float energy;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      
      // Add energy field distortion
      pos += normal * sin(time * 3.0 + position.x * 5.0 + position.z * 3.0) * 0.1 * energy;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float time;
    uniform float energy;
    uniform vec3 color1;
    uniform vec3 color2;
    uniform float scale;
    uniform float speed;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // Noise functions
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    void main() {
      vec3 pos = vPosition * scale + time * speed;
      
      // Multi-octave noise for energy field
      float noise1 = snoise(pos * 0.1);
      float noise2 = snoise(pos * 0.05 + vec3(100.0)) * 0.5;
      float noise3 = snoise(pos * 0.02 + vec3(200.0)) * 0.25;
      
      float noiseValue = noise1 + noise2 + noise3;
      
      // Color mixing based on noise
      vec3 color = mix(color1, color2, noiseValue * 0.5 + 0.5);
      
      // Energy intensity
      float intensity = (noiseValue * 0.5 + 0.5) * energy;
      
      // Fresnel effect for edge glow
      float fresnel = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
      fresnel = pow(fresnel, 2.0);
      
      color += fresnel * color * 0.5;
      intensity += fresnel * 0.3;
      
      gl_FragColor = vec4(color, intensity * 0.7);
    }
  `
);

extend({ EnergyFieldMaterial });

// Shader Material Components
export const HolographicMesh = ({ children, ...props }: any) => {
  const materialRef = useRef<any>();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh {...props}>
      {children}
      <holographicMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

export const DNAHelixMesh = ({ children, ...props }: any) => {
  const materialRef = useRef<any>();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh {...props}>
      {children}
      <dNAHelixMaterial ref={materialRef} transparent />
    </mesh>
  );
};

export const MedicalParticles = ({ count = 1000, ...props }: any) => {
  const materialRef = useRef<any>();
  const pointsRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
      
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 0.5;
      } else {
        colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0.0;
      }
      
      sizes[i] = Math.random() * 5 + 1;
    }
    
    return { positions, colors, sizes };
  }, [count]);
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.pixelRatio = Math.min(window.devicePixelRatio, 2);
    }
    
    if (pointsRef.current) {
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + positions[i * 3]) * 0.01;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <points ref={pointsRef} {...props}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={particles.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={count}
          array={particles.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <medicalParticleMaterial 
        ref={materialRef} 
        transparent 
        vertexColors 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const HeartMonitorMesh = ({ children, ...props }: any) => {
  const materialRef = useRef<any>();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
      materialRef.current.heartbeat = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
    }
  });
  
  return (
    <mesh {...props}>
      {children}
      <heartMonitorMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

export const ScannerBeamMesh = ({ children, ...props }: any) => {
  const materialRef = useRef<any>();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh {...props}>
      {children}
      <scannerBeamMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

export const EnergyFieldMesh = ({ children, ...props }: any) => {
  const materialRef = useRef<any>();
  
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.time = state.clock.elapsedTime;
    }
  });
  
  return (
    <mesh {...props}>
      {children}
      <energyFieldMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

// TypeScript declarations
declare module '@react-three/fiber' {
  interface ThreeElements {
    holographicMaterial: any;
    dNAHelixMaterial: any;
    medicalParticleMaterial: any;
    heartMonitorMaterial: any;
    scannerBeamMaterial: any;
    energyFieldMaterial: any;
  }
}
