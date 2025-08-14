import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Float } from '@react-three/drei';
import * as THREE from 'three';

// Simple 3D Components for faster loading
const SimpleHero = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <group>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[2, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.3} />
        </Sphere>
      </Float>
      
      <Text
        position={[0, 5, 0]}
        fontSize={2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ClinicStreams
      </Text>
      
      <Text
        position={[0, 3, 0]}
        fontSize={0.8}
        color="#00aaff"
        anchorX="center"
        anchorY="middle"
      >
        Healthcare Management System
      </Text>
    </group>
  );
};

const SimpleNavigation = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const pages = [
    { id: 'home', label: 'Home', position: [-10, 0, 0], color: '#3b82f6' },
    { id: 'features', label: 'Features', position: [-3, 0, 0], color: '#10b981' },
    { id: 'comparison', label: 'Compare', position: [3, 0, 0], color: '#8b5cf6' },
    { id: 'demo', label: 'Demo', position: [10, 0, 0], color: '#f59e0b' }
  ];
  
  return (
    <group position={[0, -5, 0]}>
      {pages.map((page) => (
        <Float key={page.id} speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <group position={page.position}>
            <Box args={[2, 1, 0.5]} onClick={() => onNavigate(page.id)}>
              <meshStandardMaterial color={page.color} />
            </Box>
            <Text
              position={[0, 0, 0.3]}
              fontSize={0.3}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {page.label}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
};

const SimpleComparison = () => {
  const features = [
    { name: 'Patient Portal', position: [-6, 2, 0], supported: true },
    { name: 'AI Analytics', position: [0, 2, 0], supported: true },
    { name: 'Telemedicine', position: [6, 2, 0], supported: true },
    { name: 'Mobile App', position: [-6, -2, 0], supported: true },
    { name: 'Real-time Monitor', position: [0, -2, 0], supported: true },
    { name: '24/7 Support', position: [6, -2, 0], supported: true }
  ];
  
  return (
    <group>
      <Text
        position={[0, 5, 0]}
        fontSize={1.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Feature Comparison
      </Text>
      
      {features.map((feature, index) => (
        <Float key={index} speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
          <group position={feature.position}>
            <Box args={[2.5, 1, 0.3]}>
              <meshStandardMaterial 
                color={feature.supported ? '#10b981' : '#ef4444'} 
                emissive={feature.supported ? '#047857' : '#dc2626'}
                emissiveIntensity={0.2}
              />
            </Box>
            <Text
              position={[0, 0, 0.2]}
              fontSize={0.25}
              color="white"
              anchorX="center"
              anchorY="middle"
              maxWidth={2.3}
            >
              {feature.name}
            </Text>
          </group>
        </Float>
      ))}
    </group>
  );
};

const Simple3DIndex = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simple loading timeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };
  
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-2xl font-bold">Loading 3D Experience...</div>
          <div className="text-gray-300 mt-2">Simplified for faster loading</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, 10, 10]} intensity={0.5} color="#3b82f6" />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          maxDistance={30}
          minDistance={10}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
        
        {/* Content based on current page */}
        {currentPage === 'home' && <SimpleHero />}
        {currentPage === 'comparison' && <SimpleComparison />}
        {currentPage === 'features' && <SimpleHero />}
        {currentPage === 'demo' && <SimpleHero />}
        
        {/* Navigation */}
        <SimpleNavigation onNavigate={handleNavigation} />
        
        {/* Background particles */}
        {[...Array(50)].map((_, i) => (
          <Sphere
            key={i}
            args={[0.02, 4, 4]}
            position={[
              (Math.random() - 0.5) * 40,
              (Math.random() - 0.5) * 20,
              (Math.random() - 0.5) * 20
            ]}
          >
            <meshStandardMaterial 
              color={['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'][Math.floor(Math.random() * 4)]} 
              emissiveIntensity={0.5}
            />
          </Sphere>
        ))}
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/20">
          <div className="flex space-x-2">
            {[
              { id: 'home', label: '🏠 Home' },
              { id: 'features', label: '⚡ Features' },
              { id: 'comparison', label: '🆚 Compare' },
              { id: 'demo', label: '🎯 Demo' }
            ].map((page) => (
              <button
                key={page.id}
                onClick={() => handleNavigation(page.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentPage === page.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Info Panel */}
      <div className="absolute top-4 left-4 z-50">
        <div className="bg-black/50 backdrop-blur-md rounded-lg p-4 text-white border border-white/20">
          <div className="text-lg font-bold mb-2">ClinicStreams 3D</div>
          <div className="text-sm text-gray-300">
            Simplified 3D experience for optimal performance
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Current view: {currentPage.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simple3DIndex;
