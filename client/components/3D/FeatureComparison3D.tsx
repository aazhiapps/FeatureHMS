import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Box, Sphere, Html, Plane, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface FeatureData {
  name: string;
  clinicStreams: boolean | string;
  competitor1: boolean | string;
  competitor2: boolean | string;
  competitor3: boolean | string;
  competitor4: boolean | string;
  category: 'core' | 'advanced' | 'integration' | 'analytics' | 'support';
  importance: 'high' | 'medium' | 'low';
  description: string;
}

interface CompetitorInfo {
  name: string;
  color: string;
  position: [number, number, number];
  logo: string;
}

// 3D Feature Card Component
const FeatureCard3D = ({ 
  feature, 
  position, 
  isHovered, 
  isSelected,
  onHover, 
  onSelect,
  competitorData
}: {
  feature: FeatureData;
  position: [number, number, number];
  isHovered: boolean;
  isSelected: boolean;
  onHover: (hovered: boolean) => void;
  onSelect: () => void;
  competitorData: CompetitorInfo[];
}) => {
  const cardRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (cardRef.current) {
      // Floating animation
      cardRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
      
      // Hover scale effect
      const targetScale = isHovered ? 1.1 : isSelected ? 1.05 : 1;
      cardRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
      
      // Rotation based on importance
      if (feature.importance === 'high') {
        cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    }
    
    if (glowRef.current) {
      const intensity = isHovered ? 0.8 : isSelected ? 0.5 : 0.2;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });
  
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'core': return '#3b82f6';
      case 'advanced': return '#8b5cf6';
      case 'integration': return '#10b981';
      case 'analytics': return '#f59e0b';
      case 'support': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  const getImportanceHeight = (importance: string) => {
    switch (importance) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  };
  
  return (
    <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.3}>
      <group 
        ref={cardRef}
        position={position}
        onPointerEnter={() => onHover(true)}
        onPointerLeave={() => onHover(false)}
        onClick={onSelect}
      >
        {/* Main Card Body */}
        <Box args={[4, getImportanceHeight(feature.importance), 0.2]}>
          <meshStandardMaterial
            color={getCategoryColor(feature.category)}
            emissive={getCategoryColor(feature.category)}
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.7}
            transparent
            opacity={0.9}
          />
        </Box>
        
        {/* Glow Effect */}
        <Box ref={glowRef} args={[4.2, getImportanceHeight(feature.importance) + 0.2, 0.1]} position={[0, 0, -0.2]}>
          <meshStandardMaterial
            color={getCategoryColor(feature.category)}
            emissive={getCategoryColor(feature.category)}
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </Box>
        
        {/* Feature Title */}
        <Text
          position={[0, getImportanceHeight(feature.importance) / 2 + 0.5, 0.2]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
          maxWidth={3.5}
        >
          {feature.name}
        </Text>
        
        {/* Category Badge */}
        <Sphere args={[0.3, 8, 8]} position={[-1.5, getImportanceHeight(feature.importance) / 2, 0.3]}>
          <meshStandardMaterial
            color={getCategoryColor(feature.category)}
            emissive={getCategoryColor(feature.category)}
            emissiveIntensity={0.6}
          />
        </Sphere>
        
        {/* Importance Indicator */}
        {[...Array(feature.importance === 'high' ? 3 : feature.importance === 'medium' ? 2 : 1)].map((_, i) => (
          <Sphere 
            key={i} 
            args={[0.1, 6, 6]} 
            position={[1.5, getImportanceHeight(feature.importance) / 2 - 0.3 + i * 0.3, 0.3]}
          >
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#fbbf24"
              emissiveIntensity={0.8}
            />
          </Sphere>
        ))}
        
        {/* Competitor Comparison Dots */}
        {competitorData.map((competitor, index) => {
          const value = [
            feature.clinicStreams,
            feature.competitor1,
            feature.competitor2,
            feature.competitor3,
            feature.competitor4
          ][index];
          
          const hasFeature = typeof value === 'boolean' ? value : value !== 'No' && value !== '';
          const dotColor = hasFeature ? '#10b981' : '#ef4444';
          
          return (
            <Sphere
              key={competitor.name}
              args={[0.15, 8, 8]}
              position={[-1.5 + index * 0.6, -getImportanceHeight(feature.importance) / 2 + 0.3, 0.3]}
            >
              <meshStandardMaterial
                color={dotColor}
                emissive={dotColor}
                emissiveIntensity={0.6}
              />
            </Sphere>
          );
        })}
        
        {/* Connection Lines to Competitors */}
        {isSelected && competitorData.map((competitor, index) => {
          const value = [
            feature.clinicStreams,
            feature.competitor1,
            feature.competitor2,
            feature.competitor3,
            feature.competitor4
          ][index];
          
          const hasFeature = typeof value === 'boolean' ? value : value !== 'No' && value !== '';
          
          if (!hasFeature) return null;
          
          return (
            <line key={`line-${index}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    0, 0, 0,
                    competitor.position[0] - position[0],
                    competitor.position[1] - position[1],
                    competitor.position[2] - position[2]
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color={competitor.color} opacity={0.6} transparent />
            </line>
          );
        })}
        
        {/* Detailed Info Panel */}
        {isSelected && (
          <Html position={[0, getImportanceHeight(feature.importance) + 2, 0]} center>
            <div className="bg-black/80 backdrop-blur-md rounded-lg p-4 text-white border border-white/20 max-w-sm">
              <div className="text-lg font-bold mb-2">{feature.name}</div>
              <div className="text-sm text-gray-300 mb-3">{feature.description}</div>
              
              <div className="space-y-2">
                {competitorData.map((competitor, index) => {
                  const value = [
                    feature.clinicStreams,
                    feature.competitor1,
                    feature.competitor2,
                    feature.competitor3,
                    feature.competitor4
                  ][index];
                  
                  const displayValue = typeof value === 'boolean' 
                    ? (value ? '✅ Yes' : '❌ No')
                    : value || '❌ No';
                  
                  return (
                    <div key={competitor.name} className="flex justify-between items-center">
                      <span className="text-xs" style={{ color: competitor.color }}>
                        {competitor.name}
                      </span>
                      <span className="text-xs">{displayValue}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
};

// 3D Competitor Hub
const CompetitorHub3D = ({ 
  competitor, 
  isActive,
  onClick 
}: {
  competitor: CompetitorInfo;
  isActive: boolean;
  onClick: () => void;
}) => {
  const hubRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (hubRef.current) {
      hubRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        hubRef.current.scale.setScalar(scale);
      }
    }
  });
  
  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={hubRef} position={competitor.position} onClick={onClick}>
        {/* Main Hub Sphere */}
        <Sphere args={[2, 32, 32]}>
          <meshStandardMaterial
            color={competitor.color}
            emissive={competitor.color}
            emissiveIntensity={isActive ? 0.6 : 0.3}
            metalness={0.7}
            roughness={0.3}
          />
        </Sphere>
        
        {/* Orbital Rings */}
        {[...Array(3)].map((_, i) => (
          <Ring
            key={i}
            args={[2.5 + i * 0.5, 2.7 + i * 0.5, 32]}
            rotation={[Math.PI / 2, i * Math.PI / 3, 0]}
          >
            <meshStandardMaterial
              color={competitor.color}
              transparent
              opacity={isActive ? 0.4 : 0.2}
              side={THREE.DoubleSide}
            />
          </Ring>
        ))}
        
        {/* Logo/Text */}
        <Text
          position={[0, 0, 2.2]}
          fontSize={0.8}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
        >
          {competitor.logo}
        </Text>
        
        {/* Company Name */}
        <Html position={[0, -3, 0]} center>
          <div 
            className="text-center font-bold text-sm bg-black/50 backdrop-blur-md rounded px-3 py-1"
            style={{ color: competitor.color }}
          >
            {competitor.name}
          </div>
        </Html>
        
        {/* Active Pulse Effect */}
        {isActive && (
          <Sphere args={[3, 16, 16]}>
            <meshStandardMaterial
              color={competitor.color}
              emissive={competitor.color}
              emissiveIntensity={0.2}
              transparent
              opacity={0.2}
            />
          </Sphere>
        )}
      </group>
    </Float>
  );
};

// Main Feature Comparison 3D Component
export const FeatureComparison3D = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);
  const [activeCompetitor, setActiveCompetitor] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'category' | 'importance'>('grid');
  const sceneRef = useRef<THREE.Group>(null);
  
  const competitorData: CompetitorInfo[] = [
    { name: 'ClinicStreams', color: '#3b82f6', position: [0, 0, 0], logo: '🏥' },
    { name: 'Epic MyChart', color: '#8b5cf6', position: [-15, 5, -10], logo: '📊' },
    { name: 'Cerner PowerChart', color: '#10b981', position: [15, 5, -10], logo: '⚕️' },
    { name: 'Allscripts', color: '#f59e0b', position: [-10, -5, -15], logo: '📋' },
    { name: 'NextGen', color: '#ef4444', position: [10, -5, -15], logo: '🔬' }
  ];
  
  const featuresData: FeatureData[] = [
    {
      name: 'Patient Portal',
      clinicStreams: true,
      competitor1: true,
      competitor2: true,
      competitor3: 'Limited',
      competitor4: true,
      category: 'core',
      importance: 'high',
      description: 'Comprehensive patient portal with appointment scheduling, medical records access, and secure messaging.'
    },
    {
      name: 'AI-Powered Analytics',
      clinicStreams: true,
      competitor1: 'Limited',
      competitor2: false,
      competitor3: false,
      competitor4: 'Basic',
      category: 'analytics',
      importance: 'high',
      description: 'Advanced AI analytics for predictive healthcare insights and personalized treatment recommendations.'
    },
    {
      name: 'Telemedicine Integration',
      clinicStreams: true,
      competitor1: true,
      competitor2: 'Limited',
      competitor3: 'Add-on',
      competitor4: true,
      category: 'advanced',
      importance: 'high',
      description: 'Seamless telemedicine capabilities with HD video calls, screen sharing, and remote monitoring.'
    },
    {
      name: 'Mobile Application',
      clinicStreams: true,
      competitor1: true,
      competitor2: true,
      competitor3: 'iOS Only',
      competitor4: 'Android Only',
      category: 'core',
      importance: 'medium',
      description: 'Full-featured mobile apps for iOS and Android with offline capabilities.'
    },
    {
      name: 'Real-time Monitoring',
      clinicStreams: true,
      competitor1: false,
      competitor2: 'Limited',
      competitor3: false,
      competitor4: false,
      category: 'advanced',
      importance: 'high',
      description: 'Real-time patient monitoring with IoT device integration and automated alerts.'
    },
    {
      name: 'Custom Workflows',
      clinicStreams: true,
      competitor1: 'Limited',
      competitor2: 'Premium',
      competitor3: 'Custom Dev',
      competitor4: false,
      category: 'advanced',
      importance: 'medium',
      description: 'Flexible workflow customization to match your clinic\'s specific processes.'
    },
    {
      name: 'API Integration',
      clinicStreams: true,
      competitor1: 'Limited',
      competitor2: true,
      competitor3: 'Premium',
      competitor4: 'Basic',
      category: 'integration',
      importance: 'medium',
      description: 'Comprehensive API suite for third-party integrations and custom applications.'
    },
    {
      name: '24/7 Support',
      clinicStreams: true,
      competitor1: 'Business Hours',
      competitor2: 'Premium',
      competitor3: 'Email Only',
      competitor4: 'Limited',
      category: 'support',
      importance: 'medium',
      description: 'Round-the-clock technical support with dedicated account managers.'
    },
    {
      name: 'HIPAA Compliance',
      clinicStreams: true,
      competitor1: true,
      competitor2: true,
      competitor3: true,
      competitor4: true,
      category: 'core',
      importance: 'high',
      description: 'Full HIPAA compliance with advanced encryption and audit trails.'
    },
    {
      name: 'Predictive Analytics',
      clinicStreams: true,
      competitor1: false,
      competitor2: 'Basic',
      competitor3: false,
      competitor4: false,
      category: 'analytics',
      importance: 'high',
      description: 'Machine learning-powered predictive analytics for patient outcomes and resource planning.'
    }
  ];
  
  const getFeaturePosition = (index: number, mode: string): [number, number, number] => {
    const feature = featuresData[index];
    
    switch (mode) {
      case 'category':
        const categoryIndex = ['core', 'advanced', 'integration', 'analytics', 'support'].indexOf(feature.category);
        const categoryOffset = (categoryIndex - 2) * 12;
        const itemsInCategory = featuresData.filter(f => f.category === feature.category);
        const indexInCategory = itemsInCategory.indexOf(feature);
        return [categoryOffset, (indexInCategory - itemsInCategory.length / 2) * 4, -5];
        
      case 'importance':
        const importanceLevel = feature.importance === 'high' ? 0 : feature.importance === 'medium' ? 1 : 2;
        const importanceOffset = (importanceLevel - 1) * 15;
        const itemsInImportance = featuresData.filter(f => f.importance === feature.importance);
        const indexInImportance = itemsInImportance.indexOf(feature);
        return [importanceOffset, (indexInImportance - itemsInImportance.length / 2) * 4, -8];
        
      default: // grid
        const cols = 4;
        const row = Math.floor(index / cols);
        const col = index % cols;
        return [(col - cols / 2) * 6, (row - Math.ceil(featuresData.length / cols) / 2) * 5, -10];
    }
  };
  
  useEffect(() => {
    if (sceneRef.current) {
      gsap.fromTo(sceneRef.current.children,
        { scale: 0, rotationY: Math.PI },
        { 
          scale: 1, 
          rotationY: 0, 
          duration: 1.5, 
          ease: "back.out(1.7)",
          stagger: 0.1
        }
      );
    }
  }, [viewMode]);
  
  return (
    <group ref={sceneRef}>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, 10, 10]} intensity={0.8} color="#3b82f6" />
      <pointLight position={[10, -10, 10]} intensity={0.8} color="#10b981" />
      
      {/* Competitor Hubs */}
      {competitorData.map((competitor) => (
        <CompetitorHub3D
          key={competitor.name}
          competitor={competitor}
          isActive={activeCompetitor === competitor.name}
          onClick={() => setActiveCompetitor(
            activeCompetitor === competitor.name ? null : competitor.name
          )}
        />
      ))}
      
      {/* Feature Cards */}
      {featuresData.map((feature, index) => (
        <FeatureCard3D
          key={feature.name}
          feature={feature}
          position={getFeaturePosition(index, viewMode)}
          isHovered={hoveredFeature === feature.name}
          isSelected={selectedFeature === feature.name}
          onHover={(hovered) => setHoveredFeature(hovered ? feature.name : null)}
          onSelect={() => setSelectedFeature(
            selectedFeature === feature.name ? null : feature.name
          )}
          competitorData={competitorData}
        />
      ))}
      
      {/* Control Panel */}
      <Html position={[0, 20, 0]} center>
        <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 text-white border border-white/20">
          <div className="text-xl font-bold mb-4 text-center">Feature Comparison 3D</div>
          
          <div className="flex space-x-2 mb-4">
            {['grid', 'category', 'importance'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  viewMode === mode 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="text-sm text-gray-300 text-center">
            Click cards for details • Click competitors to highlight connections
          </div>
          
          {selectedFeature && (
            <div className="mt-4 p-3 bg-blue-900/30 rounded border border-blue-500/30">
              <div className="text-sm font-bold">Selected: {selectedFeature}</div>
            </div>
          )}
        </div>
      </Html>
      
      {/* Legend */}
      <Html position={[-25, -15, 0]} center>
        <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 text-white border border-white/20">
          <div className="text-sm font-bold mb-2">Categories</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>Core</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>Advanced</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-2"></div>Integration</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>Analytics</div>
            <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-2"></div>Support</div>
          </div>
        </div>
      </Html>
    </group>
  );
};
