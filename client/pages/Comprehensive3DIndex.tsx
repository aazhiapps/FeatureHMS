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

// Enhanced Hero Section with Statistics
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
      
      {/* Title */}
      <Text
        position={[0, 8, 0]}
        fontSize={3}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto-bold.woff"
      >
        ClinicStreams
      </Text>
      
      {/* Subtitle */}
      <Text
        position={[0, 6, 0]}
        fontSize={1.2}
        color="#00aaff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/roboto-bold.woff"
      >
        Next-Generation Healthcare Management
      </Text>
      
      {/* Statistics Around Hero */}
      {statistics.slice(0, 4).map((stat, index) => {
        const angle = (index / 4) * Math.PI * 2;
        const radius = 12;
        return (
          <Float 
            key={index} 
            speed={0.8 + index * 0.2} 
            rotationIntensity={0.2} 
            floatIntensity={0.4}
          >
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.5,
              Math.sin(angle) * radius * 0.3
            ]}>
              <Box args={[3, 2, 0.5]}>
                <meshStandardMaterial 
                  color={stat.color} 
                  emissive={stat.color}
                  emissiveIntensity={0.3}
                />
              </Box>
              <Html position={[0, 0, 0.3]} center>
                <div className="text-center text-white bg-black/50 backdrop-blur-md rounded p-2 border border-white/20">
                  <div className="text-xl font-bold">{stat.value}</div>
                  <div className="text-xs">{stat.label}</div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
    </group>
  );
};

// Healthcare Modules Visualization
const HealthcareModulesViz = () => {
  return (
    <group>
      <Text
        position={[0, 12, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
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
            module.position[0] * 0.8,
            module.position[1] * 0.8,
            module.position[2]
          ]}>
            {/* Module Sphere */}
            <Sphere args={[1.5, 16, 16]}>
              <meshStandardMaterial 
                color={module.color} 
                emissive={module.color}
                emissiveIntensity={0.4}
                transparent
                opacity={0.9}
              />
            </Sphere>
            
            {/* Module Ring */}
            <Ring args={[2, 2.3, 32]} rotation={[Math.PI / 2, 0, 0]}>
              <meshStandardMaterial 
                color={module.color}
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </Ring>
            
            {/* Module Info */}
            <Html position={[0, -3, 0]} center>
              <div className="text-center">
                <div className="text-2xl mb-1">{module.icon}</div>
                <div className="text-white text-sm font-bold bg-black/50 backdrop-blur-md rounded px-2 py-1 border border-white/20">
                  {module.name}
                </div>
              </div>
            </Html>
          </group>
        </Float>
      ))}
      
      {/* Connection Lines */}
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
                    ...module.position.map(p => p * 0.8),
                    ...connectedModule.position.map(p => p * 0.8)
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial 
                color="#ffffff" 
                opacity={0.2} 
                transparent 
              />
            </line>
          );
        })
      )}
    </group>
  );
};

// Comprehensive Feature Comparison
const ComprehensiveComparison = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = ['core', 'advanced', 'integration', 'analytics', 'support'];
  const filteredFeatures = selectedCategory 
    ? featuresData.filter(f => f.category === selectedCategory)
    : featuresData.slice(0, 12); // Show first 12 features
  
  return (
    <group>
      <Text
        position={[0, 10, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Feature Comparison
      </Text>
      
      {/* Category Filters */}
      {categories.map((category, index) => (
        <Float key={category} speed={0.6} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={[(index - 2) * 4, 7, 2]}>
            <Box 
              args={[3, 1, 0.5]}
              onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
            >
              <meshStandardMaterial 
                color={selectedCategory === category ? '#10b981' : '#6b7280'}
                emissive={selectedCategory === category ? '#047857' : '#374151'}
                emissiveIntensity={0.3}
              />
            </Box>
            <Text
              position={[0, 0, 0.3]}
              fontSize={0.4}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {category.toUpperCase()}
            </Text>
          </group>
        </Float>
      ))}
      
      {/* Competitor Headers */}
      {competitorsData.map((competitor, index) => (
        <Float key={competitor.name} speed={0.4} rotationIntensity={0.1} floatIntensity={0.2}>
          <group position={[(index - 2) * 6, 4, 0]}>
            <Cylinder args={[1.5, 1.5, 0.5, 8]}>
              <meshStandardMaterial 
                color={competitor.color}
                emissive={competitor.color}
                emissiveIntensity={0.3}
              />
            </Cylinder>
            <Html position={[0, -2, 0]} center>
              <div className="text-center">
                <div className="text-2xl mb-1">{competitor.logo}</div>
                <div className="text-white text-xs font-bold bg-black/50 backdrop-blur-md rounded px-2 py-1 border border-white/20">
                  {competitor.name}
                </div>
              </div>
            </Html>
          </group>
        </Float>
      ))}
      
      {/* Feature Grid */}
      {filteredFeatures.map((feature, featureIndex) => (
        <group key={feature.name} position={[0, 2 - featureIndex * 2, 0]}>
          {/* Feature Name */}
          <Float speed={0.3} rotationIntensity={0.1} floatIntensity={0.2}>
            <group position={[-15, 0, 0]}>
              <Box args={[5, 1.5, 0.3]}>
                <meshStandardMaterial 
                  color="#374151"
                  emissive="#1f2937"
                  emissiveIntensity={0.2}
                />
              </Box>
              <Html position={[0, 0, 0.2]} center>
                <div className="text-white text-xs font-bold text-center px-2">
                  {feature.icon} {feature.name}
                </div>
              </Html>
            </group>
          </Float>
          
          {/* Feature Support by Competitor */}
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
                <group position={[(compIndex - 2) * 6, 0, 0]}>
                  <Sphere args={[0.8, 12, 12]}>
                    <meshStandardMaterial 
                      color={hasFeature ? '#10b981' : '#ef4444'}
                      emissive={hasFeature ? '#047857' : '#dc2626'}
                      emissiveIntensity={0.4}
                    />
                  </Sphere>
                  <Html position={[0, -1.5, 0]} center>
                    <div className="text-white text-xs bg-black/50 backdrop-blur-md rounded px-1 py-0.5">
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

// Healthcare Journey Visualization
const HealthcareJourney = () => {
  return (
    <group>
      <Text
        position={[0, 8, 0]}
        fontSize={2.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Healthcare Implementation Journey
      </Text>
      
      {journeySteps.map((step, index) => {
        const angle = (index / journeySteps.length) * Math.PI * 2;
        const radius = 10;
        
        return (
          <Float 
            key={step.id} 
            speed={0.6 + index * 0.1} 
            rotationIntensity={0.3} 
            floatIntensity={0.5}
          >
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.5,
              Math.sin(angle) * radius * 0.2
            ]}>
              {/* Step Sphere */}
              <Sphere args={[2, 16, 16]}>
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
                position={[0, 0, 2.2]}
                fontSize={1}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {index + 1}
              </Text>
              
              {/* Progress Ring */}
              <Torus args={[2.5, 0.2, 8, 32]}>
                <meshStandardMaterial 
                  color={step.color}
                  emissive={step.color}
                  emissiveIntensity={0.6}
                />
              </Torus>
              
              {/* Step Info */}
              <Html position={[0, -4, 0]} center>
                <div className="text-center bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/20 max-w-xs">
                  <div className="text-lg font-bold text-white mb-1">{step.icon} {step.title}</div>
                  <div className="text-sm text-gray-300 mb-2">{step.subtitle}</div>
                  <div className="text-xs text-gray-400">{step.timeline}</div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
      
      {/* Connection Path */}
      <Torus args={[10, 0.1, 8, 64]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.5}
        />
      </Torus>
    </group>
  );
};

// Enhanced Loading Screen with System Status
const EnhancedLoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <group>
      {/* Central Progress Ring */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <group>
          <Torus args={[8, 1, 16, 100]}>
            <meshStandardMaterial 
              color="#374151" 
              transparent 
              opacity={0.3}
            />
          </Torus>
          <Torus args={[8, 1, 16, Math.max(1, Math.floor(100 * progress))]}>
            <meshStandardMaterial
              color="#10b981"
              emissive="#047857"
              emissiveIntensity={0.8}
            />
          </Torus>
          
          {/* Progress Text */}
          <Text
            position={[0, 0, 0]}
            fontSize={3}
            color="#10b981"
            anchorX="center"
            anchorY="middle"
          >
            {Math.round(progress * 100)}%
          </Text>
        </group>
      </Float>
      
      {/* System Status Indicators */}
      {systemStatus.map((system, index) => {
        const isActive = progress >= system.threshold;
        const angle = (index / systemStatus.length) * Math.PI * 2;
        const radius = 15;
        
        return (
          <Float key={system.name} speed={0.8} rotationIntensity={0.3} floatIntensity={0.5}>
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.3,
              Math.sin(angle) * radius * 0.2
            ]}>
              <Sphere args={[0.8, 12, 12]}>
                <meshStandardMaterial
                  color={isActive ? "#10b981" : "#374151"}
                  emissive={isActive ? "#047857" : "#111827"}
                  emissiveIntensity={isActive ? 0.8 : 0.2}
                />
              </Sphere>
              
              <Html position={[0, -2, 0]} center>
                <div className="text-center">
                  <div className="text-lg mb-1">{system.icon}</div>
                  <div className={`text-xs font-bold ${isActive ? 'text-green-400' : 'text-gray-500'}`}>
                    {system.name}
                  </div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
      
      {/* Title */}
      <Text
        position={[0, 15, 0]}
        fontSize={4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ClinicStreams
      </Text>
      
      {/* Current Stage */}
      <Html position={[0, -12, 0]} center>
        <div className="text-center text-white">
          <div className="text-xl font-bold mb-2">
            {loadingStages[Math.floor(progress * loadingStages.length)] || 'Ready!'}
          </div>
          <div className="text-gray-300">
            Preparing your healthcare management experience...
          </div>
        </div>
      </Html>
    </group>
  );
};

// Main Comprehensive 3D Index Component
const Comprehensive3DIndex = () => {
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
      <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
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
          maxDistance={40}
          minDistance={15}
          autoRotate={true}
          autoRotateSpeed={0.3}
        />
        
        {/* Page Content */}
        {currentPage === 'home' && <ComprehensiveHero />}
        {currentPage === 'features' && <HealthcareModulesViz />}
        {currentPage === 'comparison' && <ComprehensiveComparison />}
        {currentPage === 'journey' && <HealthcareJourney />}
        
        {/* Enhanced Background Particles */}
        {[...Array(100)].map((_, i) => (
          <Float key={i} speed={0.5 + Math.random()} rotationIntensity={0.2} floatIntensity={0.3}>
            <Sphere
              args={[0.03, 4, 4]}
              position={[
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 40
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
      
      {/* Enhanced Navigation */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <div className="flex space-x-3">
            {[
              { id: 'home', label: '🏠 Home', desc: 'Overview' },
              { id: 'features', label: '⚡ Features', desc: 'Modules' },
              { id: 'journey', label: '🏥 Journey', desc: 'Process' },
              { id: 'comparison', label: '🆚 Compare', desc: 'Analysis' }
            ].map((page) => (
              <button
                key={page.id}
                onClick={() => handleNavigation(page.id)}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all group ${
                  currentPage === page.id
                    ? 'bg-blue-600 text-white shadow-lg scale-105'
                    : 'bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105'
                }`}
              >
                <div>{page.label}</div>
                <div className="text-xs opacity-60 group-hover:opacity-100">{page.desc}</div>
              </button>
            ))}
            <button
              onClick={handleDemo}
              className="px-4 py-3 rounded-lg text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition-all hover:scale-105"
            >
              <div>🎯 Demo</div>
              <div className="text-xs opacity-80">Schedule</div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Enhanced Info Panel */}
      <div className="absolute top-6 left-6 z-50">
        <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white border border-white/20 max-w-sm">
          <div className="text-xl font-bold mb-2 flex items-center">
            🏥 ClinicStreams 3D
          </div>
          <div className="text-sm text-gray-300 mb-2">
            Comprehensive healthcare management experience
          </div>
          <div className="text-xs text-gray-400 flex items-center justify-between">
            <span>Current: {currentPage.toUpperCase()}</span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Live
            </span>
          </div>
          {currentPage === 'comparison' && (
            <div className="mt-3 p-2 bg-blue-900/30 rounded border border-blue-500/30">
              <div className="text-xs font-bold mb-1">💡 Tip</div>
              <div className="text-xs text-gray-300">
                Click category filters to focus on specific features
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Data Summary Panel */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white border border-white/20">
          <div className="text-sm font-bold mb-2">📊 Data Overview</div>
          <div className="space-y-1 text-xs">
            <div>Features: {featuresData.length}</div>
            <div>Competitors: {competitorsData.length}</div>
            <div>Modules: {healthcareModules.length}</div>
            <div>Journey Steps: {journeySteps.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comprehensive3DIndex;
