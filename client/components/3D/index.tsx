// 3D Components Export Index
// This file serves as the main entry point for all 3D components

// Core 3D Scene Components
export { Scene3D } from './Scene3D';
export { OptimizedCanvas } from './OptimizedCanvas';

// Medical Environment Components
export { MedicalEnvironment3D } from './MedicalEnvironment3D';

// Interactive 3D Elements
export { Navigation3D, FloatingActionMenu3D } from './Navigation3D';
export { HeroSection3D } from './HeroSection3D';
export { FeatureComparison3D } from './FeatureComparison3D';
export { LoadingScreen3D } from './LoadingScreen3D';

// Shader Materials and Effects
export {
  HolographicMesh,
  DNAHelixMesh,
  MedicalParticles,
  HeartMonitorMesh,
  ScannerBeamMesh,
  EnergyFieldMesh
} from './Shaders3D';

// Type Definitions
export interface Scene3DProps {
  children?: React.ReactNode;
  enableControls?: boolean;
  ambientIntensity?: number;
  enablePostProcessing?: boolean;
  background?: 'space' | 'medical' | 'gradient';
}

export interface Navigation3DProps {
  currentPage: 'loading' | 'autoscroll' | 'journey' | 'comparison' | 'demo';
  onNavigate: (page: 'loading' | 'autoscroll' | 'journey' | 'comparison' | 'demo') => void;
  isVisible: boolean;
}

export interface LoadingScreen3DProps {
  progress: number;
  stage: string;
  onComplete: () => void;
  duration?: number;
}

export interface HeroSection3DProps {
  showTitle?: boolean;
  interactive?: boolean;
}

// Performance Optimization Types
export type QualityLevel = 'low' | 'medium' | 'high';
export type PageState = 'loading' | 'hero' | 'journey' | 'comparison' | 'demo';

// Re-export from React Three Fiber for convenience
export { Canvas, useFrame, useThree } from '@react-three/fiber';
export {
  OrbitControls,
  Environment,
  Stars,
  Float,
  Sparkles,
  Html,
  PerspectiveCamera,
  Effects,
  ContactShadows,
  Text,
  Sphere,
  Box,
  Cylinder,
  Torus,
  Ring,
  Plane,
  Cone,
  PerformanceMonitor,
  AdaptiveDpr,
  AdaptiveEvents,
  Preload,
  Stats
} from '@react-three/drei';

// Three.js essentials
export * as THREE from 'three';

// Performance utilities
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const isLowEndDevice = () => {
  return navigator.hardwareConcurrency <= 4 || 
         ((navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4);
};

export const getOptimalQuality = (): QualityLevel => {
  if (isMobileDevice() || isLowEndDevice()) {
    return 'medium';
  }
  return 'high';
};

// Error handling utilities
export class WebGLNotSupportedError extends Error {
  constructor(message = 'WebGL is not supported in this browser') {
    super(message);
    this.name = 'WebGLNotSupportedError';
  }
}

export const checkWebGLSupport = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    canvas.remove();
    return !!gl;
  } catch (e) {
    return false;
  }
};

// Default configurations for different quality levels
export const qualityConfigs = {
  low: {
    dpr: [0.8, 1] as [number, number],
    antialias: false,
    shadows: false,
    postProcessing: false,
    particleCount: 200,
    ambientIntensity: 0.6,
    frameRate: 24
  },
  medium: {
    dpr: [1, 1.5] as [number, number],
    antialias: true,
    shadows: false,
    postProcessing: false,
    particleCount: 800,
    ambientIntensity: 0.4,
    frameRate: 30
  },
  high: {
    dpr: [1, 2] as [number, number],
    antialias: true,
    shadows: true,
    postProcessing: true,
    particleCount: 2000,
    ambientIntensity: 0.3,
    frameRate: 60
  }
};

// Animation easing functions
export const easing = {
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number) => t * (2 - t),
  easeIn: (t: number) => t * t,
  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  }
};

// Color utilities for medical themes
export const medicalColors = {
  primary: '#3b82f6',      // Blue
  secondary: '#10b981',    // Green
  accent: '#8b5cf6',       // Purple
  warning: '#f59e0b',      // Amber
  danger: '#ef4444',       // Red
  info: '#06b6d4',         // Cyan
  
  // Medical specific colors
  heartRate: '#ff4757',    // Heart monitor red
  oxygen: '#00d2d3',       // Oxygen blue
  blood: '#dc2626',        // Blood red
  dna: '#10b981',          // DNA green
  xray: '#64748b',         // X-ray gray
  
  // Gradients
  holographic: ['#00aaff', '#00ff88', '#ff6b6b'],
  medical: ['#3b82f6', '#10b981', '#8b5cf6'],
  scanner: ['#00ffff', '#0088ff', '#0044ff']
};

// Lighting presets
export const lightingPresets = {
  medical: {
    ambient: { intensity: 0.3, color: '#ffffff' },
    directional: { position: [10, 10, 5], intensity: 1.2, color: '#ffffff' },
    spot: { position: [-10, 15, 10], angle: 0.3, intensity: 0.8, color: '#00ff88' },
    point: { position: [20, 20, 20], intensity: 0.5, color: '#0088ff' }
  },
  dramatic: {
    ambient: { intensity: 0.2, color: '#ffffff' },
    directional: { position: [5, 20, 10], intensity: 2, color: '#ffffff' },
    spot: { position: [0, 30, 0], angle: 0.2, intensity: 3, color: '#3b82f6' },
    point: { position: [-20, 10, 20], intensity: 1.5, color: '#8b5cf6' }
  },
  soft: {
    ambient: { intensity: 0.6, color: '#ffffff' },
    directional: { position: [5, 5, 5], intensity: 0.8, color: '#ffffff' },
    spot: { position: [10, 10, 10], angle: 0.5, intensity: 0.5, color: '#ffffff' },
    point: { position: [0, 10, 0], intensity: 0.3, color: '#ffffff' }
  }
};

// Debug utilities (development only)
export const debug = {
  logPerformance: (fps: number, quality: QualityLevel) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[3D Performance] FPS: ${fps}, Quality: ${quality}`);
    }
  },
  
  logError: (error: Error, context: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[3D Error] ${context}:`, error);
    }
  },
  
  measureRenderTime: <T extends any[], R>(
    fn: (...args: T) => R,
    name: string
  ): ((...args: T) => R) => {
    return (...args: T): R => {
      if (process.env.NODE_ENV === 'development') {
        const start = performance.now();
        const result = fn(...args);
        const end = performance.now();
        console.log(`[3D Timing] ${name}: ${(end - start).toFixed(2)}ms`);
        return result;
      }
      return fn(...args);
    };
  }
};

// Version information
export const version = '1.0.0';
export const buildDate = new Date().toISOString();

// Documentation links
export const docs = {
  threejs: 'https://threejs.org/docs/',
  r3f: 'https://docs.pmnd.rs/react-three-fiber/',
  drei: 'https://docs.pmnd.rs/drei/',
  performance: 'https://docs.pmnd.rs/react-three-fiber/advanced/scaling-performance'
};

console.log(`🎭 ClinicStreams 3D Experience v${version} loaded successfully!`);
console.log(`🚀 Build: ${buildDate}`);
console.log(`💡 WebGL Support: ${checkWebGLSupport() ? '✓' : '✗'}`);
console.log(`📱 Mobile Device: ${isMobileDevice() ? '✓' : '✗'}`);
console.log(`⚡ Optimal Quality: ${getOptimalQuality()}`);
