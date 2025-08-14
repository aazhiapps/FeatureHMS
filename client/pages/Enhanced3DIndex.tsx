import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, PerformanceMonitor, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { ErrorBoundary } from 'react-error-boundary';
import { gsap } from 'gsap';

// Lazy load heavy 3D components for better performance
const Scene3D = lazy(() => import('../components/3D/Scene3D').then(m => ({ default: m.Scene3D })));
const HeroSection3D = lazy(() => import('../components/3D/HeroSection3D').then(m => ({ default: m.HeroSection3D })));
const Navigation3D = lazy(() => import('../components/3D/Navigation3D').then(m => ({ default: m.Navigation3D })));
const FloatingActionMenu3D = lazy(() => import('../components/3D/Navigation3D').then(m => ({ default: m.FloatingActionMenu3D })));
const FeatureComparison3D = lazy(() => import('../components/3D/FeatureComparison3D').then(m => ({ default: m.FeatureComparison3D })));
const LoadingScreen3D = lazy(() => import('../components/3D/LoadingScreen3D').then(m => ({ default: m.LoadingScreen3D })));
const MedicalEnvironment3D = lazy(() => import('../components/3D/MedicalEnvironment3D').then(m => ({ default: m.MedicalEnvironment3D })));
const MedicalParticles = lazy(() => import('../components/3D/Shaders3D').then(m => ({ default: m.MedicalParticles })));
const DNAHelixMesh = lazy(() => import('../components/3D/Shaders3D').then(m => ({ default: m.DNAHelixMesh })));
const HeartMonitorMesh = lazy(() => import('../components/3D/Shaders3D').then(m => ({ default: m.HeartMonitorMesh })));
const ScannerBeamMesh = lazy(() => import('../components/3D/Shaders3D').then(m => ({ default: m.ScannerBeamMesh })));
const EnergyFieldMesh = lazy(() => import('../components/3D/Shaders3D').then(m => ({ default: m.EnergyFieldMesh })));

interface Enhanced3DIndexProps {
  initialPage?: 'loading' | 'hero' | 'journey' | 'comparison' | 'demo';
}

type PageState = 'loading' | 'hero' | 'journey' | 'comparison' | 'demo';
type QualityLevel = 'low' | 'medium' | 'high';

// Performance monitoring and optimization
const usePerformanceOptimization = () => {
  const [qualityLevel, setQualityLevel] = useState<QualityLevel>('high');
  const [dpr, setDpr] = useState([1, 2]);
  const [enablePostProcessing, setEnablePostProcessing] = useState(true);
  const [particleCount, setParticleCount] = useState(2000);
  
  useEffect(() => {
    // Detect device capabilities
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEndDevice = navigator.hardwareConcurrency <= 4;
    const hasLowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4;
    
    if (isMobile || isLowEndDevice || hasLowMemory) {
      setQualityLevel('medium');
      setDpr([1, 1.5]);
      setEnablePostProcessing(false);
      setParticleCount(500);
    }
    
    // Further optimize for very low-end devices
    if (isMobile && (isLowEndDevice || hasLowMemory)) {
      setQualityLevel('low');
      setDpr([1, 1]);
      setParticleCount(200);
    }
  }, []);
  
  const handlePerformance = (averages: any) => {
    // Dynamically adjust quality based on performance
    if (averages.fps < 30) {
      if (qualityLevel !== 'low') {
        setQualityLevel('low');
        setDpr([1, 1]);
        setParticleCount(200);
        setEnablePostProcessing(false);
      }
    } else if (averages.fps < 45 && qualityLevel === 'high') {
      setQualityLevel('medium');
      setDpr([1, 1.5]);
      setParticleCount(800);
    }
  };
  
  return {
    qualityLevel,
    dpr,
    enablePostProcessing,
    particleCount,
    handlePerformance
  };
};

// Loading Progress Hook
const useLoadingProgress = (duration: number = 6000) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing Systems...');
  const startTime = useRef(Date.now());
  
  useEffect(() => {
    const stages = [
      'Initializing Healthcare Systems...',
      'Loading Patient Database...',
      'Configuring Medical Records...',
      'Setting up Security Protocols...',
      'Activating AI Analytics...',
      'Finalizing Setup...'
    ];
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.current;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      
      const stageIndex = Math.floor(newProgress * stages.length);
      if (stageIndex < stages.length) {
        setStage(stages[stageIndex]);
      }
      
      if (newProgress >= 1) {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [duration]);
  
  return { progress, stage };
};

// Responsive 3D Scene Component
const Responsive3DScene = ({ 
  currentPage, 
  onNavigate, 
  qualityLevel, 
  enablePostProcessing,
  particleCount,
  onActionMenu
}: {
  currentPage: PageState;
  onNavigate: (page: PageState) => void;
  qualityLevel: QualityLevel;
  enablePostProcessing: boolean;
  particleCount: number;
  onActionMenu: (action: string) => void;
}) => {
  const getSceneProps = () => {
    switch (qualityLevel) {
      case 'low':
        return {
          ambientIntensity: 0.5,
          enablePostProcessing: false,
          background: 'gradient' as const
        };
      case 'medium':
        return {
          ambientIntensity: 0.4,
          enablePostProcessing: false,
          background: 'medical' as const
        };
      default:
        return {
          ambientIntensity: 0.3,
          enablePostProcessing,
          background: 'medical' as const
        };
    }
  };
  
  return (
    <Scene3D {...getSceneProps()}>
      {/* Medical Environment */}
      {qualityLevel !== 'low' && (
        <MedicalEnvironment3D scene={qualityLevel === 'medium' ? 'scanner' : 'all'} />
      )}
      
      {/* Medical Particles */}
      {qualityLevel !== 'low' && (
        <MedicalParticles count={particleCount} />
      )}
      
      {/* Page-specific Content */}
      {currentPage === 'hero' && (
        <HeroSection3D showTitle={true} interactive={qualityLevel === 'high'} />
      )}
      
      {currentPage === 'journey' && (
        <group>
          <HeroSection3D showTitle={false} interactive={true} />
          
          {/* Enhanced Medical Visualizations */}
          {qualityLevel === 'high' && (
            <group>
              <DNAHelixMesh position={[-30, 0, -20]}>
                <cylinderGeometry args={[0.5, 0.5, 20, 8]} />
              </DNAHelixMesh>
              
              <HeartMonitorMesh position={[30, 0, -20]}>
                <planeGeometry args={[20, 10]} />
              </HeartMonitorMesh>
              
              <ScannerBeamMesh position={[0, 20, -30]}>
                <planeGeometry args={[40, 20]} />
              </ScannerBeamMesh>
              
              <EnergyFieldMesh position={[0, -20, -10]}>
                <sphereGeometry args={[15, 32, 32]} />
              </EnergyFieldMesh>
            </group>
          )}
        </group>
      )}
      
      {currentPage === 'comparison' && <FeatureComparison3D />}
      
      {/* Navigation */}
      <Navigation3D
        currentPage={currentPage}
        onNavigate={onNavigate}
        isVisible={currentPage !== 'loading'}
      />
      
      {/* Floating Action Menu */}
      {currentPage !== 'loading' && qualityLevel !== 'low' && (
        <FloatingActionMenu3D onAction={onActionMenu} />
      )}
      
      {/* Performance Optimizations */}
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />
    </Scene3D>
  );
};

// Error Fallback Component
const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center text-white">
    <div className="text-center p-8 bg-black/50 backdrop-blur-md rounded-lg border border-white/20">
      <h2 className="text-2xl font-bold mb-4">3D Experience Error</h2>
      <p className="text-gray-300 mb-6">Something went wrong with the 3D visualization.</p>
      <div className="space-y-4">
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          Try Again
        </button>
        <div className="text-sm text-gray-400">
          <p>Your device might not support all 3D features.</p>
          <p>Try refreshing the page or use a different browser.</p>
        </div>
      </div>
    </div>
  </div>
);

// Fallback for 3D Loading
const Scene3DFallback = () => (
  <Html center>
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <div className="text-white text-xl font-bold">Loading 3D Experience...</div>
      <div className="text-gray-300 text-sm mt-2">Please wait while we prepare your journey</div>
    </div>
  </Html>
);

// Main Enhanced 3D Index Component
export const Enhanced3DIndex: React.FC<Enhanced3DIndexProps> = ({ 
  initialPage = 'loading' 
}) => {
  const [currentPage, setCurrentPage] = useState<PageState>(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [showUI, setShowUI] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { progress, stage } = useLoadingProgress(6000);
  const {
    qualityLevel,
    dpr,
    enablePostProcessing,
    particleCount,
    handlePerformance
  } = usePerformanceOptimization();
  
  useEffect(() => {
    if (currentPage === 'loading' && progress >= 1) {
      setTimeout(() => {
        setCurrentPage('hero');
        setIsLoading(false);
        setShowUI(true);
      }, 1000);
    }
  }, [currentPage, progress]);
  
  const handleNavigation = (page: PageState) => {
    if (page === currentPage) return;
    
    // Smooth page transition
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0.7,
        duration: 0.3,
        onComplete: () => {
          setCurrentPage(page);
          gsap.to(containerRef.current, {
            opacity: 1,
            duration: 0.5
          });
        }
      });
    } else {
      setCurrentPage(page);
    }
  };
  
  const handleActionMenu = (action: string) => {
    switch (action) {
      case 'home':
        handleNavigation('hero');
        break;
      case 'compare':
        handleNavigation('comparison');
        break;
      case 'demo':
        window.open('https://calendly.com/clinicstreams-demo', '_blank');
        break;
      case 'help':
        // Open help modal or navigate to help
        break;
    }
  };
  
  const handleLoadingComplete = () => {
    setCurrentPage('hero');
    setIsLoading(false);
    setShowUI(true);
  };
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div 
        ref={containerRef}
        className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden"
      >
        <Canvas
          dpr={dpr}
          camera={{ position: [0, 5, 30], fov: 75 }}
          gl={{ 
            antialias: qualityLevel !== 'low', 
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          performance={{ min: 0.1 }}
          resize={{ debounce: { scroll: 50, resize: 0 } }}
        >
          <Suspense fallback={<Scene3DFallback />}>
            <PerformanceMonitor onIncline={handlePerformance} onDecline={handlePerformance}>
              {currentPage === 'loading' ? (
                <LoadingScreen3D
                  progress={progress}
                  stage={stage}
                  onComplete={handleLoadingComplete}
                />
              ) : (
                <Responsive3DScene
                  currentPage={currentPage}
                  onNavigate={handleNavigation}
                  qualityLevel={qualityLevel}
                  enablePostProcessing={enablePostProcessing}
                  particleCount={particleCount}
                  onActionMenu={handleActionMenu}
                />
              )}
            </PerformanceMonitor>
          </Suspense>
        </Canvas>
        
        {/* UI Overlay */}
        {showUI && (
          <div className="absolute top-4 left-4 z-50">
            <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 text-white border border-white/20">
              <div className="text-sm font-bold mb-2">Performance</div>
              <div className="text-xs space-y-1">
                <div>Quality: {qualityLevel.toUpperCase()}</div>
                <div>DPR: {dpr.join('-')}</div>
                <div>Particles: {particleCount}</div>
                <div>PostFX: {enablePostProcessing ? 'ON' : 'OFF'}</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Page Navigation */}
        {showUI && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/20">
              <div className="flex space-x-2">
                {[
                  { id: 'hero', label: '🏠 Home', icon: '🏠' },
                  { id: 'journey', label: '🏥 Journey', icon: '🏥' },
                  { id: 'comparison', label: '🆚 Compare', icon: '🆚' },
                  { id: 'demo', label: '🎯 Demo', icon: '🎯' }
                ].map((page) => (
                  <button
                    key={page.id}
                    onClick={() => handleNavigation(page.id as PageState)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      currentPage === page.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    <span className="mr-2">{page.icon}</span>
                    <span className="hidden sm:inline">{page.label.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Performance Warning */}
        {qualityLevel === 'low' && showUI && (
          <div className="absolute top-4 right-4 z-50">
            <div className="bg-yellow-900/80 backdrop-blur-md rounded-lg p-4 text-yellow-100 border border-yellow-600/30 max-w-sm">
              <div className="text-sm font-bold mb-2">⚡ Performance Mode</div>
              <div className="text-xs">
                Reduced quality for optimal performance on your device.
              </div>
            </div>
          </div>
        )}
        
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-pulse text-lg font-bold mb-2">
                Preparing 3D Experience...
              </div>
              <div className="text-sm text-gray-300">
                {Math.round(progress * 100)}% Complete
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Enhanced3DIndex;
