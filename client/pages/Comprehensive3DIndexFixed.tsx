import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Float, Html, Torus, Ring, Cylinder } from '@react-three/drei';
import * as THREE from 'three';
import {
  featuresData,
  competitorsData,
  healthcareModules,
  journeySteps,
  navigationSteps,
  loadingStages,
  systemStatus,
  statistics,
  pricingTiers,
  testimonials,
  type FeatureData,
  type CompetitorData,
  type HealthcareModule,
  type JourneyStep
} from '../data/healthcareData';
import { Pricing3D, Testimonials3D, ROICalculator3D } from '../components/3D/PricingAndTestimonials3D';

// Enhanced Hero Section with Better Statistics Spacing
const ComprehensiveHero = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });
  
  return (
    <group>
      {/* Central Logo */}
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[3, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial 
            color="#3b82f6" 
            emissive="#1e40af" 
            emissiveIntensity={0.4}
            metalness={0.3}
            roughness={0.7}
          />
        </Sphere>
        
        {/* Orbital Rings */}
        {[...Array(3)].map((_, i) => (
          <Torus 
            key={i}
            args={[4 + i * 1.5, 0.1, 8, 32]} 
            rotation={[Math.PI / 2, i * Math.PI / 3, 0]}
          >
            <meshStandardMaterial 
              color="#10b981" 
              emissive="#10b981"
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
            />
          </Torus>
        ))}
      </Float>
      
      {/* Title with Better Spacing */}
      <Text
        position={[0, 9, 0]}
        fontSize={3.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        ClinicStreams
      </Text>
      
      {/* Subtitle with Better Positioning */}
      <Text
        position={[0, 6.5, 0]}
        fontSize={1.4}
        color="#00aaff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.01}
      >
        Next-Generation Healthcare Management
      </Text>
      
      {/* Statistics with Better Spacing and Layout */}
      {statistics.slice(0, 4).map((stat, index) => {
        const angle = (index / 4) * Math.PI * 2 + Math.PI / 4;
        const radius = 15;
        return (
          <Float 
            key={index} 
            speed={0.8 + index * 0.2} 
            rotationIntensity={0.2} 
            floatIntensity={0.4}
          >
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.4 + 2,
              Math.sin(angle) * radius * 0.3
            ]}>
              <Box args={[4, 2.5, 0.8]}>
                <meshStandardMaterial 
                  color={stat.color} 
                  emissive={stat.color}
                  emissiveIntensity={0.3}
                  metalness={0.2}
                  roughness={0.8}
                />
              </Box>
              <Html position={[0, 0, 0.5]} center>
                <div className="text-center text-white bg-black/70 backdrop-blur-md rounded-lg p-3 border border-white/30 min-w-[120px]">
                  <div className="text-2xl font-bold mb-1 text-white drop-shadow-lg">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-200">{stat.label}</div>
                  <div className="text-xs text-gray-300 mt-1">{stat.description}</div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
    </group>
  );
};

// Healthcare Modules with Better Spacing
const HealthcareModulesViz = () => {
  return (
    <group>
      <Text
        position={[0, 12, 0]}
        fontSize={2.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        Healthcare Modules
      </Text>
      
      {healthcareModules.map((module, index) => (
        <Float 
          key={module.id} 
          speed={0.5 + index * 0.1} 
          rotationIntensity={0.3} 
          floatIntensity={0.5}
        >
          <group position={[
            module.position[0] * 1.0,
            module.position[1] * 1.0,
            module.position[2]
          ]}>
            {/* Module Sphere with Better Size */}
            <Sphere args={[1.8, 16, 16]}>
              <meshStandardMaterial 
                color={module.color} 
                emissive={module.color}
                emissiveIntensity={0.4}
                transparent
                opacity={0.9}
                metalness={0.3}
                roughness={0.7}
              />
            </Sphere>
            
            {/* Module Ring */}
            <Ring args={[2.3, 2.6, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial 
                color={module.color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </Ring>
            
            {/* Module Info with Better Styling */}
            <Html position={[0, -3.5, 0]} center>
              <div className="text-center max-w-[140px]">
                <div className="text-3xl mb-2 drop-shadow-lg">{module.icon}</div>
                <div className="text-white text-sm font-bold bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30 shadow-lg">
                  {module.name}
                </div>
                <div className="text-xs text-gray-300 mt-2 bg-black/50 backdrop-blur-md rounded px-2 py-1">
                  {module.description.slice(0, 50)}...
                </div>
              </div>
            </Html>
          </group>
        </Float>
      ))}
      
      {/* Connection Lines with Better Visibility */}
      {healthcareModules.map((module, moduleIndex) => 
        module.connections.map((connectionId, connectionIndex) => {
          const connectedModule = healthcareModules.find(m => m.id === connectionId);
          if (!connectedModule) return null;
          
          return (
            <line key={`${module.id}-${connectionId}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    ...module.position.map(p => p * 1.0),
                    ...connectedModule.position.map(p => p * 1.0)
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial 
                color="#ffffff" 
                opacity={0.4} 
                transparent 
              />
            </line>
          );
        })
      )}
    </group>
  );
};

// Improved Feature Comparison with Better Grid Layout
const ComprehensiveComparison = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['core', 'advanced', 'integration', 'analytics', 'support'];
  const filteredFeatures = selectedCategory 
    ? featuresData.filter(f => f.category === selectedCategory)
    : featuresData.slice(0, 10);
  
  return (
    <group>
      <Text
        position={[0, 12, 0]}
        fontSize={2.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        Feature Comparison
      </Text>
      
      {/* Category Filters with Better Spacing */}
      {categories.map((category, index) => (
        <Float key={category} speed={0.6} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[(index - 2) * 5, 9, 2]}>
            <Box 
              args={[4, 1.2, 0.6]}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <meshStandardMaterial 
                color={selectedCategory === category ? '#10b981' : '#6b7280'}
                emissive={selectedCategory === category ? '#047857' : '#374151'}
                emissiveIntensity={0.3}
                metalness={0.2}
                roughness={0.8}
              />
            </Box>
            <Text
              position={[0, 0, 0.4]}
              fontSize={0.5}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {category.toUpperCase()}
            </Text>
          </group>
        </Float>
      ))}
      
      {/* Competitor Headers with Better Layout */}
      {competitorsData.map((competitor, index) => (
        <Float key={competitor.name} speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[(index - 2) * 7, 5.5, 0]}>
            <Cylinder args={[1.8, 1.8, 0.6, 8]}>
              <meshStandardMaterial 
                color={competitor.color}
                emissive={competitor.color}
                emissiveIntensity={0.3}
                metalness={0.3}
                roughness={0.7}
              />
            </Cylinder>
            <Html position={[0, -2.5, 0]} center>
              <div className="text-center max-w-[120px]">
                <div className="text-3xl mb-2 drop-shadow-lg">{competitor.logo}</div>
                <div className="text-white text-sm font-bold bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 border border-white/30 shadow-lg">
                  {competitor.name}
                </div>
              </div>
            </Html>
          </group>
        </Float>
      ))}
      
      {/* Feature Grid with Better Spacing */}
      {filteredFeatures.map((feature, featureIndex) => (
        <group key={feature.name} position={[0, 2 - featureIndex * 2.5, 0]}>
          {/* Feature Name with Better Design */}
          <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[-18, 0, 0]}>
              <Box args={[6, 1.8, 0.4]}>
                <meshStandardMaterial 
                  color="#374151"
                  emissive="#1f2937"
                  emissiveIntensity={0.2}
                  metalness={0.1}
                  roughness={0.9}
                />
              </Box>
              <Html position={[0, 0, 0.3]} center>
                <div className="text-white text-sm font-bold text-center px-3 py-1 max-w-[140px] leading-tight">
                  <div className="text-lg mb-1">{feature.icon}</div>
                  <div>{feature.name}</div>
                </div>
              </Html>
            </group>
          </Float>
          
          {/* Feature Support by Competitor with Better Layout */}
          {competitorsData.map((competitor, compIndex) => {
            const value = [
              feature.clinicStreams,
              feature.epicMyChart,
              feature.cernerPowerChart,
              feature.allscripts,
              feature.nextGen
            ][compIndex];
            
            const hasFeature = typeof value === 'boolean' ? value : value !== 'No' && value !== false;
            const displayValue = typeof value === 'boolean' 
              ? (value ? '✅' : '❌')
              : value || '❌';
            
            return (
              <Float key={`${feature.name}-${competitor.name}`} speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
                <group position={[(compIndex - 2) * 7, 0, 0]}>
                  <Sphere args={[1, 12, 12]}>
                    <meshStandardMaterial 
                      color={hasFeature ? '#10b981' : '#ef4444'}
                      emissive={hasFeature ? '#047857' : '#dc2626'}
                      emissiveIntensity={0.4}
                      metalness={0.2}
                      roughness={0.8}
                    />
                  </Sphere>
                  <Html position={[0, -2, 0]} center>
                    <div className="text-white text-sm bg-black/80 backdrop-blur-md rounded-lg px-2 py-1 border border-white/30 font-semibold min-w-[60px] text-center">
                      {displayValue}
                    </div>
                  </Html>
                </group>
              </Float>
            );
          })}
        </group>
      ))}
    </group>
  );
};

// Healthcare Journey with Better Spacing
const HealthcareJourney = () => {
  return (
    <group>
      <Text
        position={[0, 10, 0]}
        fontSize={2.8}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.02}
      >
        Healthcare Implementation Journey
      </Text>
      
      {journeySteps.map((step, index) => {
        const angle = (index / journeySteps.length) * Math.PI * 2;
        const radius = 12;
        
        return (
          <Float 
            key={step.id} 
            speed={0.6 + index * 0.1} 
            rotationIntensity={0.3} 
            floatIntensity={0.5}
          >
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.4,
              Math.sin(angle) * radius * 0.2
            ]}>
              {/* Step Sphere with Better Size */}
              <Sphere args={[2.2, 16, 16]}>
                <meshStandardMaterial 
                  color={step.color}
                  emissive={step.color}
                  emissiveIntensity={0.4}
                  metalness={0.3}
                  roughness={0.7}
                />
              </Sphere>
              
              {/* Step Number */}
              <Text
                position={[0, 0, 2.4]}
                fontSize={1.2}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {index + 1}
              </Text>
              
              {/* Progress Ring */}
              <Torus args={[2.8, 0.2, 8, 32]}>
                <meshStandardMaterial 
                  color={step.color}
                  emissive={step.color}
                  emissiveIntensity={0.6}
                />
              </Torus>
              
              {/* Step Info with Better Design */}
              <Html position={[0, -5, 0]} center>
                <div className="text-center bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/30 max-w-xs shadow-xl">
                  <div className="text-xl font-bold text-white mb-2">{step.icon} {step.title}</div>
                  <div className="text-sm text-blue-300 mb-2 font-semibold">{step.subtitle}</div>
                  <div className="text-xs text-gray-300 mb-3 leading-relaxed">{step.description}</div>
                  <div className="text-xs text-yellow-300 font-semibold bg-yellow-900/30 rounded px-2 py-1">
                    ⏱️ {step.timeline}
                  </div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
      
      {/* Connection Path with Better Design */}
      <Torus args={[12, 0.15, 8, 64]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </Torus>
    </group>
  );
};

// Enhanced Loading Screen with Better Layout
const EnhancedLoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <group>
      {/* Central Progress Ring */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group>
          <Torus args={[8, 1.2, 16, 100]}>
            <meshStandardMaterial 
              color="#374151" 
              transparent 
              opacity={0.3}
            />
          </Torus>
          <Torus args={[8, 1.2, 16, Math.max(1, Math.floor(100 * progress))]}>
            <meshStandardMaterial
              color="#10b981"
              emissive="#047857"
              emissiveIntensity={0.8}
            />
          </Torus>
          
          {/* Progress Text with Better Styling */}
          <Text
            position={[0, 0, 0]}
            fontSize={4}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(progress * 100)}%
          </Text>
        </group>
      </Float>
      
      {/* System Status Indicators with Better Spacing */}
      {systemStatus.map((system, index) => {
        const isActive = progress >= system.threshold;
        const angle = (index / systemStatus.length) * Math.PI * 2;
        const radius = 18;
        
        return (
          <Float key={system.name} speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.3,
              Math.sin(angle) * radius * 0.2
            ]}>
              <Sphere args={[1, 12, 12]}>
                <meshStandardMaterial
                  color={isActive ? "#10b981" : "#374151"}
                  emissive={isActive ? "#047857" : "#111827"}
                  emissiveIntensity={isActive ? 0.8 : 0.2}
                />
              </Sphere>
              
              <Html position={[0, -2.5, 0]} center>
                <div className="text-center max-w-[100px]">
                  <div className="text-2xl mb-1">{system.icon}</div>
                  <div className={`text-xs font-bold ${isActive ? 'text-green-400' : 'text-gray-500'} bg-black/70 backdrop-blur-md rounded px-2 py-1`}>
                    {system.name}
                  </div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
      
      {/* Title with Better Positioning */}
      <Text
        position={[0, 18, 0]}
        fontSize={5}
        color="white"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        ClinicStreams
      </Text>
      
      {/* Current Stage with Better Design */}
      <Html position={[0, -15, 0]} center>
        <div className="text-center text-white max-w-md">
          <div className="text-2xl font-bold mb-3 bg-black/70 backdrop-blur-md rounded-lg px-4 py-2">
            {loadingStages[Math.floor(progress * loadingStages.length)] || 'Ready!'}
          </div>
          <div className="text-gray-300 text-lg">
            Preparing your healthcare management experience...
          </div>
        </div>
      </Html>
    </group>
  );
};

// Main Component with Improved Navigation
const Comprehensive3DIndexFixed = () => {
  const [currentPage, setCurrentPage] = useState('loading');
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + 0.02;
        if (newProgress >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            setIsLoading(false);
            setCurrentPage('home');
          }, 500);
          return 1;
        }
        return newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };
  
  const handleDemo = () => {
    window.open('https://calendly.com/clinicstreams-demo', '_blank');
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <pointLight position={[-10, 10, 10]} intensity={0.8} color="#3b82f6" />
          
          <EnhancedLoadingScreen progress={loadingProgress} />
        </Canvas>
      </div>
    );
  }
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Canvas camera={{ position: [0, 0, 30], fov: 75 }}>
        {/* Enhanced Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <pointLight position={[-10, 10, 10]} intensity={0.8} color="#3b82f6" />
        <pointLight position={[10, -10, -10]} intensity={0.6} color="#10b981" />
        <spotLight position={[0, 20, 0]} angle={0.3} intensity={2} color="#8b5cf6" />
        
        {/* Enhanced Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={50}
          minDistance={20}
          autoRotate={true}
          autoRotateSpeed={0.2}
        />
        
        {/* Page Content */}
        {currentPage === 'home' && <ComprehensiveHero />}
        {currentPage === 'features' && <HealthcareModulesViz />}
        {currentPage === 'comparison' && <ComprehensiveComparison />}
        {currentPage === 'journey' && <HealthcareJourney />}
        {currentPage === 'pricing' && <Pricing3D />}
        {currentPage === 'testimonials' && <Testimonials3D />}
        {currentPage === 'roi' && <ROICalculator3D />}
        
        {/* Enhanced Background Particles */}
        {[...Array(80)].map((_, i) => (
          <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.2} floatIntensity={0.3}>
            <Sphere
              args={[0.04, 4, 4]}
              position={[
                (Math.random() - 0.5) * 80,
                (Math.random() - 0.5) * 50,
                (Math.random() - 0.5) * 50
              ]}
            >
              <meshStandardMaterial 
                color={['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 5)]} 
                emissiveIntensity={0.6}
              />
            </Sphere>
          </Float>
        ))}
      </Canvas>
      
      {/* Improved Navigation with Better Responsive Design */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-6xl">
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-2xl">
          <div className="grid grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              { id: 'home', label: '🏠', desc: 'Home', longDesc: 'Overview' },
              { id: 'features', label: '⚡', desc: 'Features', longDesc: 'Modules' },
              { id: 'journey', label: '🏥', desc: 'Journey', longDesc: 'Process' },
              { id: 'comparison', label: '🆚', desc: 'Compare', longDesc: 'Analysis' },
              { id: 'pricing', label: '💰', desc: 'Pricing', longDesc: 'Plans' },
              { id: 'testimonials', label: '💬', desc: 'Reviews', longDesc: 'Stories' },
              { id: 'roi', label: '📈', desc: 'ROI', longDesc: 'Returns' }
            ].map((page) => (
              <button
                key={page.id}
                onClick={() => handleNavigation(page.id)}
                className={`p-3 rounded-lg text-sm font-semibold transition-all group flex flex-col items-center justify-center min-h-[70px] ${
                  currentPage === page.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105 border-2 border-blue-400'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:scale-105 border-2 border-transparent'
                }`}
                title={page.longDesc}
              >
                <div className="text-lg mb-1">{page.label}</div>
                <div className="text-xs opacity-90 leading-tight text-center">{page.desc}</div>
              </button>
            ))}
            <button
              onClick={handleDemo}
              className="p-3 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-all hover:scale-105 flex flex-col items-center justify-center min-h-[70px] border-2 border-green-400 shadow-lg"
              title="Schedule Demo"
            >
              <div className="text-lg mb-1">🎯</div>
              <div className="text-xs opacity-90 leading-tight text-center">Demo</div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Improved Info Panels */}
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 text-white border border-white/30 max-w-sm shadow-xl">
          <div className="text-xl font-bold mb-2 flex items-center">
            🏥 ClinicStreams 3D
          </div>
          <div className="text-sm text-gray-200 mb-3 leading-relaxed">
            Comprehensive healthcare management experience with advanced 3D visualizations
          </div>
          <div className="text-xs text-gray-300 flex items-center justify-between p-2 bg-white/10 rounded">
            <span>Current: <span className="font-bold text-blue-300">{currentPage.toUpperCase()}</span></span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-green-400 font-semibold">Live</span>
            </span>
          </div>
          {currentPage === 'comparison' && (
            <div className="mt-3 p-3 bg-blue-900/40 rounded-lg border border-blue-500/40">
              <div className="text-sm font-bold mb-1 text-blue-300">💡 Navigation Tip</div>
              <div className="text-xs text-gray-200 leading-relaxed">
                Click category filters above to focus on specific feature types. Use mouse to orbit and zoom the 3D view.
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Enhanced Data Summary Panel */}
      <div className="absolute top-4 right-4 z-50">
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-4 text-white border border-white/30 shadow-xl">
          <div className="text-sm font-bold mb-3 text-center">📊 Data Overview</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-white/10 rounded px-2 py-1 text-center">
              <div className="font-bold text-blue-300">{featuresData.length}</div>
              <div className="text-gray-300">Features</div>
            </div>
            <div className="bg-white/10 rounded px-2 py-1 text-center">
              <div className="font-bold text-green-300">{competitorsData.length}</div>
              <div className="text-gray-300">Competitors</div>
            </div>
            <div className="bg-white/10 rounded px-2 py-1 text-center">
              <div className="font-bold text-purple-300">{healthcareModules.length}</div>
              <div className="text-gray-300">Modules</div>
            </div>
            <div className="bg-white/10 rounded px-2 py-1 text-center">
              <div className="font-bold text-yellow-300">{journeySteps.length}</div>
              <div className="text-gray-300">Steps</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comprehensive3DIndexFixed;
