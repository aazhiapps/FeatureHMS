import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Float, Sphere, Box, Cylinder, Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

interface Navigation3DProps {
  currentPage: 'loading' | 'autoscroll' | 'journey' | 'comparison' | 'demo';
  onNavigate: (page: 'loading' | 'autoscroll' | 'journey' | 'comparison' | 'demo') => void;
  isVisible: boolean;
}

interface NavItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  position: [number, number, number];
  color: string;
  emissiveColor: string;
}

// 3D Navigation Orb
const NavigationOrb = ({ 
  item, 
  isActive, 
  isHovered, 
  onClick, 
  onHover, 
  canNavigate 
}: {
  item: NavItem;
  isActive: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
  canNavigate: boolean;
}) => {
  const orbRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (orbRef.current) {
      // Floating animation
      orbRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime + item.position[0]) * 0.5;
      
      // Rotation
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.3;
      
      // Active pulsing
      if (isActive) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
        orbRef.current.scale.setScalar(scale);
      }
      
      // Hover effects
      if (isHovered && canNavigate) {
        orbRef.current.scale.setScalar(1.2);
      } else if (!isActive) {
        orbRef.current.scale.setScalar(1);
      }
    }
    
    // Glow ring animation
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
      const opacity = isHovered ? 0.8 : isActive ? 0.6 : 0.3;
      (ringRef.current.material as THREE.MeshStandardMaterial).opacity = opacity;
    }
    
    // Glow sphere
    if (glowRef.current) {
      const intensity = isActive ? 0.8 : isHovered ? 0.6 : 0.3;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });
  
  return (
    <Float 
      speed={isActive ? 2 : 1} 
      rotationIntensity={isHovered ? 0.5 : 0.2} 
      floatIntensity={isActive ? 0.8 : 0.4}
    >
      <group 
        ref={orbRef}
        position={item.position}
        onClick={canNavigate ? onClick : undefined}
        onPointerEnter={() => canNavigate && onHover(true)}
        onPointerLeave={() => onHover(false)}
      >
        {/* Main Orb */}
        <Sphere ref={glowRef} args={[2, 32, 32]}>
          <meshStandardMaterial
            color={item.color}
            emissive={item.emissiveColor}
            emissiveIntensity={isActive ? 0.8 : 0.3}
            transparent
            opacity={canNavigate ? 0.9 : 0.5}
            metalness={0.3}
            roughness={0.2}
          />
        </Sphere>
        
        {/* Icon Text */}
        <Text
          position={[0, 0, 2.1]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/roboto-bold.woff"
        >
          {item.icon}
        </Text>
        
        {/* Glow Ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[3, 0.2, 8, 32]} />
          <meshStandardMaterial
            color={item.color}
            emissive={item.emissiveColor}
            emissiveIntensity={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
        
        {/* Outer Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3.5, 4, 32]} />
          <meshStandardMaterial
            color={item.color}
            transparent
            opacity={isHovered ? 0.3 : 0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        
        {/* Particles around orb */}
        {[...Array(8)].map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const radius = 4;
          return (
            <mesh
              key={i}
              position={[
                Math.cos(angle) * radius,
                Math.sin(angle * 0.5) * 0.5,
                Math.sin(angle) * radius
              ]}
            >
              <sphereGeometry args={[0.1, 8, 8]} />
              <meshStandardMaterial
                color={item.color}
                emissive={item.emissiveColor}
                emissiveIntensity={0.8}
              />
            </mesh>
          );
        })}
        
        {/* Title Label */}
        <Html
          position={[0, -4, 0]}
          center
          style={{
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          <div className="text-center">
            <div className={`text-lg font-bold ${isActive ? 'text-blue-300' : canNavigate ? 'text-white' : 'text-gray-500'}`}>
              {item.title}
            </div>
            {isHovered && (
              <div className="text-sm text-gray-300 mt-1 bg-black/50 backdrop-blur-md rounded px-2 py-1">
                {item.description}
              </div>
            )}
          </div>
        </Html>
        
        {/* Connection Beam (for active item) */}
        {isActive && (
          <mesh position={[0, -10, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 20, 8]} />
            <meshStandardMaterial
              color={item.color}
              emissive={item.emissiveColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.7}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
};

// 3D Progress Path
const ProgressPath3D = ({ currentPage }: { currentPage: string }) => {
  const pathRef = useRef<THREE.Group>(null);
  
  const navItems: NavItem[] = [
    {
      id: 'loading',
      title: 'Welcome',
      icon: '🚀',
      description: 'Start your journey',
      position: [-20, 5, 0],
      color: '#3b82f6',
      emissiveColor: '#1e40af'
    },
    {
      id: 'autoscroll',
      title: 'Preview',
      icon: '📱',
      description: 'Feature showcase',
      position: [-10, 8, -5],
      color: '#8b5cf6',
      emissiveColor: '#6d28d9'
    },
    {
      id: 'journey',
      title: 'Explore',
      icon: '🏥',
      description: 'Interactive experience',
      position: [0, 10, -8],
      color: '#06b6d4',
      emissiveColor: '#0891b2'
    },
    {
      id: 'comparison',
      title: 'Compare',
      icon: '🆚',
      description: 'Feature analysis',
      position: [10, 8, -5],
      color: '#10b981',
      emissiveColor: '#047857'
    },
    {
      id: 'demo',
      title: 'Demo',
      icon: '🎯',
      description: 'Schedule consultation',
      position: [20, 5, 0],
      color: '#f59e0b',
      emissiveColor: '#d97706'
    }
  ];
  
  useFrame((state) => {
    if (pathRef.current) {
      // Gentle rotation
      pathRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });
  
  // Create connection lines between navigation items
  const connectionLines = navItems.slice(0, -1).map((item, index) => {
    const nextItem = navItems[index + 1];
    const currentIndex = navItems.findIndex(nav => nav.id === currentPage);
    const isCompleted = index < currentIndex;
    const isActive = index === currentIndex - 1;
    
    return (
      <line key={`connection-${index}`}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={new Float32Array([
              ...item.position,
              ...nextItem.position
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={isCompleted ? '#10b981' : isActive ? '#3b82f6' : '#64748b'}
          opacity={isCompleted ? 0.8 : isActive ? 0.6 : 0.3}
          transparent
          linewidth={isCompleted || isActive ? 3 : 1}
        />
      </line>
    );
  });
  
  return (
    <group ref={pathRef}>
      {connectionLines}
      
      {/* Progress Flow Particles */}
      {navItems.slice(0, -1).map((item, index) => {
        const nextItem = navItems[index + 1];
        const currentIndex = navItems.findIndex(nav => nav.id === currentPage);
        const isActive = index < currentIndex;
        
        if (!isActive) return null;
        
        return (
          <Float key={`particle-${index}`} speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
            <mesh
              position={[
                (item.position[0] + nextItem.position[0]) / 2,
                (item.position[1] + nextItem.position[1]) / 2,
                (item.position[2] + nextItem.position[2]) / 2
              ]}
            >
              <sphereGeometry args={[0.3, 8, 8]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={0.8}
              />
            </mesh>
          </Float>
        );
      })}
    </group>
  );
};

// Main Navigation 3D Component
export const Navigation3D: React.FC<Navigation3DProps> = ({
  currentPage,
  onNavigate,
  isVisible
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [animating, setAnimating] = useState(false);
  const navigationRef = useRef<THREE.Group>(null);
  
  const navItems: NavItem[] = [
    {
      id: 'loading',
      title: 'Welcome',
      icon: '🚀',
      description: 'Start your healthcare journey',
      position: [-20, 5, 0],
      color: '#3b82f6',
      emissiveColor: '#1e40af'
    },
    {
      id: 'autoscroll',
      title: 'Preview',
      icon: '📱',
      description: 'Auto-scroll feature showcase',
      position: [-10, 8, -5],
      color: '#8b5cf6',
      emissiveColor: '#6d28d9'
    },
    {
      id: 'journey',
      title: 'Explore',
      icon: '🏥',
      description: 'Interactive healthcare journey',
      position: [0, 10, -8],
      color: '#06b6d4',
      emissiveColor: '#0891b2'
    },
    {
      id: 'comparison',
      title: 'Compare',
      icon: '🆚',
      description: 'Feature comparison analysis',
      position: [10, 8, -5],
      color: '#10b981',
      emissiveColor: '#047857'
    },
    {
      id: 'demo',
      title: 'Demo',
      icon: '🎯',
      description: 'Schedule your consultation',
      position: [20, 5, 0],
      color: '#f59e0b',
      emissiveColor: '#d97706'
    }
  ];
  
  useEffect(() => {
    if (navigationRef.current) {
      if (isVisible) {
        gsap.fromTo(navigationRef.current.position,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.5, ease: "back.out(1.7)" }
        );
      } else {
        gsap.to(navigationRef.current.position,
          { y: -20, duration: 0.8, ease: "power2.in" }
        );
      }
    }
  }, [isVisible]);
  
  const canNavigateTo = (itemId: string): boolean => {
    const itemIndex = navItems.findIndex(item => item.id === itemId);
    const currentIndex = navItems.findIndex(item => item.id === currentPage);
    return itemIndex <= currentIndex + 1 && !animating;
  };
  
  const handleNavigation = (itemId: string) => {
    if (!canNavigateTo(itemId)) return;
    
    setAnimating(true);
    
    // Smooth transition animation
    if (navigationRef.current) {
      gsap.to(navigationRef.current.rotation, {
        y: navigationRef.current.rotation.y + Math.PI * 0.1,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          setAnimating(false);
          onNavigate(itemId as any);
        }
      });
    } else {
      setTimeout(() => {
        setAnimating(false);
        onNavigate(itemId as any);
      }, 800);
    }
  };
  
  if (!isVisible) return null;
  
  return (
    <group ref={navigationRef}>
      {/* Progress Path */}
      <ProgressPath3D currentPage={currentPage} />
      
      {/* Navigation Orbs */}
      {navItems.map((item) => (
        <NavigationOrb
          key={item.id}
          item={item}
          isActive={currentPage === item.id}
          isHovered={hoveredItem === item.id}
          onClick={() => handleNavigation(item.id)}
          onHover={(hovered) => setHoveredItem(hovered ? item.id : null)}
          canNavigate={canNavigateTo(item.id)}
        />
      ))}
      
      {/* Central Hub */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 0, -15]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#1a202c"
            emissive="#2d3748"
            emissiveIntensity={0.3}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </Float>
      
      {/* Ambient Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 10]} intensity={1} color="#ffffff" />
      <spotLight
        position={[10, 20, 10]}
        angle={0.3}
        intensity={0.8}
        color="#3b82f6"
        castShadow
      />
    </group>
  );
};

// Floating Action Menu
export const FloatingActionMenu3D = ({ onAction }: { onAction: (action: string) => void }) => {
  const menuRef = useRef<THREE.Group>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const actions = [
    { id: 'home', icon: '🏠', label: 'Home', color: '#3b82f6' },
    { id: 'compare', icon: '📊', label: 'Compare', color: '#10b981' },
    { id: 'demo', icon: '📞', label: 'Demo', color: '#f59e0b' },
    { id: 'help', icon: '❓', label: 'Help', color: '#8b5cf6' }
  ];
  
  useFrame((state) => {
    if (menuRef.current) {
      menuRef.current.position.y = 15 + Math.sin(state.clock.elapsedTime) * 0.5;
      menuRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
      <group ref={menuRef} position={[25, 15, -10]}>
        {/* Main Menu Button */}
        <mesh
          onClick={() => setIsOpen(!isOpen)}
          onPointerEnter={() => setIsOpen(true)}
        >
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial
            color="#1a202c"
            emissive="#4a5568"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        
        <Text
          position={[0, 0, 1.6]}
          fontSize={1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          ⚙️
        </Text>
        
        {/* Action Items */}
        {isOpen && actions.map((action, index) => {
          const angle = (index / actions.length) * Math.PI * 2;
          const radius = 4;
          
          return (
            <Float key={action.id} speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
              <group
                position={[
                  Math.cos(angle) * radius,
                  Math.sin(angle) * radius * 0.5,
                  Math.sin(angle) * radius
                ]}
                onClick={() => onAction(action.id)}
              >
                <mesh>
                  <sphereGeometry args={[0.8, 12, 12]} />
                  <meshStandardMaterial
                    color={action.color}
                    emissive={action.color}
                    emissiveIntensity={0.3}
                  />
                </mesh>
                
                <Text
                  position={[0, 0, 0.9]}
                  fontSize={0.6}
                  color="white"
                  anchorX="center"
                  anchorY="middle"
                >
                  {action.icon}
                </Text>
                
                <Html position={[0, -2, 0]} center>
                  <div className="text-white text-xs font-bold bg-black/50 backdrop-blur-md rounded px-2 py-1">
                    {action.label}
                  </div>
                </Html>
              </group>
            </Float>
          );
        })}
      </group>
    </Float>
  );
};
