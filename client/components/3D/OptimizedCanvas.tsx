import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  PerformanceMonitor, 
  AdaptiveDpr, 
  AdaptiveEvents, 
  Preload, 
  Stats,
  Html
} from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';

interface OptimizedCanvasProps {
  children: React.ReactNode;
  enableStats?: boolean;
  enablePerformanceMonitoring?: boolean;
  fallbackComponent?: React.ComponentType<any>;
  onPerformanceChange?: (averages: any) => void;
}

// Performance monitoring hook
const usePerformanceOptimization = () => {
  const [performanceLevel, setPerformanceLevel] = useState<'low' | 'medium' | 'high'>('high');
  const [adaptiveDpr, setAdaptiveDpr] = useState<[number, number]>([1, 2]);
  const [frameRate, setFrameRate] = useState(60);
  const [isLowPerformance, setIsLowPerformance] = useState(false);
  
  useEffect(() => {
    // Device capability detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 4;
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;
    
    // WebGL capability check
    const renderer = gl?.getParameter(gl.RENDERER) || '';
    const isIntegratedGPU = renderer.toLowerCase().includes('intel') || 
                           renderer.toLowerCase().includes('integrated');
    
    // Set initial performance level
    if (isMobile || isLowEnd || hasLowMemory || isIntegratedGPU) {
      setPerformanceLevel('medium');
      setAdaptiveDpr([1, 1.5]);
      setFrameRate(30);
    }
    
    if (isMobile && (isLowEnd || hasLowMemory)) {
      setPerformanceLevel('low');
      setAdaptiveDpr([0.8, 1]);
      setFrameRate(24);
      setIsLowPerformance(true);
    }
    
    // Cleanup
    canvas.remove();
  }, []);
  
  const handlePerformanceChange = (averages: any) => {
    if (averages.fps < 20) {
      setPerformanceLevel('low');
      setAdaptiveDpr([0.5, 1]);
      setIsLowPerformance(true);
    } else if (averages.fps < 40 && performanceLevel !== 'low') {
      setPerformanceLevel('medium');
      setAdaptiveDpr([1, 1.5]);
    } else if (averages.fps > 50 && performanceLevel === 'low') {
      setPerformanceLevel('medium');
      setAdaptiveDpr([1, 1.5]);
      setIsLowPerformance(false);
    }
  };
  
  return {
    performanceLevel,
    adaptiveDpr,
    frameRate,
    isLowPerformance,
    handlePerformanceChange
  };
};

// Enhanced Error Boundary
const Canvas3DErrorBoundary = ({ children, fallback }: any) => {
  const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900">
      <div className="text-center p-8 bg-black/50 backdrop-blur-md rounded-lg border border-white/20 text-white max-w-md">
        <div className="text-6xl mb-4">🔧</div>
        <h2 className="text-2xl font-bold mb-4">3D Experience Unavailable</h2>
        <p className="text-gray-300 mb-4">
          Your browser or device doesn't support the advanced 3D features.
        </p>
        <div className="space-y-2 text-sm text-gray-400 mb-6">
          <p>• Try updating your browser</p>
          <p>• Enable hardware acceleration</p>
          <p>• Use Chrome, Firefox, or Safari</p>
        </div>
        <div className="space-x-4">
          <button
            onClick={resetErrorBoundary}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => window.location.href = '/legacy'}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg font-semibold transition-colors"
          >
            Use 2D Version
          </button>
        </div>
      </div>
    </div>
  );
  
  return (
    <ErrorBoundary FallbackComponent={fallback || ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
};

// 3D Loading Fallback
const Canvas3DFallback = () => (
  <Html center>
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="absolute inset-0 rounded-full h-16 w-16 border-r-2 border-purple-500 mx-auto animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-white text-xl font-bold mb-2">Loading 3D Experience</div>
      <div className="text-gray-300 text-sm">Preparing advanced visualizations...</div>
      <div className="mt-4 text-xs text-gray-400">
        This may take a moment on slower devices
      </div>
    </div>
  </Html>
);

// Performance Warning Component
const PerformanceWarning = ({ level, onOptimize }: { level: string; onOptimize: () => void }) => {
  if (level === 'high') return null;
  
  return (
    <div className="absolute top-4 right-4 z-50 max-w-sm">
      <div className={`backdrop-blur-md rounded-lg p-4 border ${
        level === 'low' 
          ? 'bg-red-900/80 border-red-600/30 text-red-100' 
          : 'bg-yellow-900/80 border-yellow-600/30 text-yellow-100'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="text-2xl">
            {level === 'low' ? '⚠️' : '⚡'}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold mb-1">
              {level === 'low' ? 'Performance Mode' : 'Optimized Mode'}
            </div>
            <div className="text-xs">
              {level === 'low' 
                ? 'Quality reduced for optimal performance on your device.'
                : 'Some effects disabled to maintain smooth performance.'
              }
            </div>
            <button
              onClick={onOptimize}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Optimized Canvas Component
export const OptimizedCanvas: React.FC<OptimizedCanvasProps> = ({
  children,
  enableStats = false,
  enablePerformanceMonitoring = true,
  fallbackComponent,
  onPerformanceChange
}) => {
  const {
    performanceLevel,
    adaptiveDpr,
    frameRate,
    isLowPerformance,
    handlePerformanceChange
  } = usePerformanceOptimization();
  
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (onPerformanceChange) {
      onPerformanceChange({ level: performanceLevel, frameRate, isLowPerformance });
    }
  }, [performanceLevel, frameRate, isLowPerformance, onPerformanceChange]);
  
  const getCanvasProps = () => {
    const baseProps = {
      ref: canvasRef,
      camera: { position: [0, 5, 30], fov: 75, near: 0.1, far: 1000 },
      performance: { min: 0.2, max: 1, debounce: 200 },
      dpr: adaptiveDpr,
      resize: { debounce: { scroll: 50, resize: 0 } }
    };
    
    switch (performanceLevel) {
      case 'low':
        return {
          ...baseProps,
          gl: {
            antialias: false,
            alpha: true,
            powerPreference: "default",
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false,
            failIfMajorPerformanceCaveat: false
          },
          frameloop: 'demand' as const,
          performance: { min: 0.1, max: 0.5, debounce: 300 }
        };
      case 'medium':
        return {
          ...baseProps,
          gl: {
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            preserveDrawingBuffer: false
          },
          performance: { min: 0.2, max: 0.8, debounce: 250 }
        };
      default:
        return {
          ...baseProps,
          gl: {
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            stencil: true,
            depth: true,
            preserveDrawingBuffer: false
          }
        };
    }
  };
  
  const combinedPerformanceHandler = (averages: any) => {
    handlePerformanceChange(averages);
    if (onPerformanceChange) {
      onPerformanceChange(averages);
    }
  };
  
  return (
    <Canvas3DErrorBoundary fallback={fallbackComponent}>
      <div className="relative w-full h-full">
        <Canvas {...getCanvasProps()}>
          <Suspense fallback={<Canvas3DFallback />}>
            {enablePerformanceMonitoring && (
              <PerformanceMonitor 
                onIncline={combinedPerformanceHandler}
                onDecline={combinedPerformanceHandler}
                flipflops={3}
                factor={0.8}
              />
            )}
            
            {/* Adaptive rendering optimizations */}
            <AdaptiveDpr pixelated />
            <AdaptiveEvents />
            
            {/* Preload assets for better performance */}
            <Preload all />
            
            {children}
            
            {/* Performance stats (development only) */}
            {enableStats && process.env.NODE_ENV === 'development' && <Stats />}
          </Suspense>
        </Canvas>
        
        {/* Performance Warning Overlay */}
        <PerformanceWarning 
          level={performanceLevel} 
          onOptimize={() => setShowOptimizeModal(true)} 
        />
        
        {/* Optimization Tips Modal */}
        {showOptimizeModal && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 border border-white/20 text-white max-w-md">
              <h3 className="text-lg font-bold mb-4">Optimization Tips</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>For better performance:</strong>
                  <ul className="mt-1 space-y-1 text-gray-300">
                    <li>• Close other browser tabs</li>
                    <li>• Enable hardware acceleration</li>
                    <li>• Use latest Chrome or Firefox</li>
                    <li>• Reduce browser zoom level</li>
                  </ul>
                </div>
                <div>
                  <strong>Current settings:</strong>
                  <ul className="mt-1 space-y-1 text-gray-300">
                    <li>• Quality: {performanceLevel.toUpperCase()}</li>
                    <li>• Resolution: {adaptiveDpr.join('-')}</li>
                    <li>• Target FPS: {frameRate}</li>
                  </ul>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => window.location.href = '/legacy'}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                  Use 2D Version
                </button>
                <button
                  onClick={() => setShowOptimizeModal(false)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Canvas3DErrorBoundary>
  );
};

export default OptimizedCanvas;
