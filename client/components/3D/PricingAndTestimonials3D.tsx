import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Box, Float, Html, Cylinder, Torus } from '@react-three/drei';
import * as THREE from 'three';
import { pricingTiers, testimonials, type PricingTier, type Testimonial } from '../../data/healthcareData';

// 3D Pricing Visualization
export const Pricing3D = () => {
  return (
    <group>
      <Text
        position={[0, 12, 0]}
        fontSize={2.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Pricing Plans
      </Text>
      
      {pricingTiers.map((tier, index) => {
        const xPosition = (index - 1) * 10;
        const isPopular = tier.popular;
        
        return (
          <Float 
            key={tier.name} 
            speed={isPopular ? 1.2 : 0.8} 
            rotationIntensity={isPopular ? 0.4 : 0.2} 
            floatIntensity={isPopular ? 0.6 : 0.4}
          >
            <group position={[xPosition, 0, 0]}>
              {/* Main Pricing Box */}
              <Box args={[6, 8, 1]}>
                <meshStandardMaterial 
                  color={tier.color}
                  emissive={tier.color}
                  emissiveIntensity={isPopular ? 0.4 : 0.2}
                  metalness={0.3}
                  roughness={0.7}
                />
              </Box>
              
              {/* Popular Badge */}
              {isPopular && (
                <Torus args={[3.5, 0.3, 8, 32]} position={[0, 0, 0.6]}>
                  <meshStandardMaterial 
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={0.8}
                  />
                </Torus>
              )}
              
              {/* Price Display */}
              <Cylinder args={[2, 2, 2, 8]} position={[0, 2, 0.6]}>
                <meshStandardMaterial 
                  color={isPopular ? "#fbbf24" : "#374151"}
                  emissive={isPopular ? "#f59e0b" : "#1f2937"}
                  emissiveIntensity={0.4}
                />
              </Cylinder>
              
              {/* Feature Spheres */}
              {tier.features.slice(0, 6).map((_, featureIndex) => {
                const angle = (featureIndex / 6) * Math.PI * 2;
                const radius = 4;
                return (
                  <Sphere 
                    key={featureIndex}
                    args={[0.3, 8, 8]}
                    position={[
                      Math.cos(angle) * radius,
                      -2 + Math.sin(angle) * 2,
                      Math.sin(angle) * 2
                    ]}
                  >
                    <meshStandardMaterial 
                      color="#10b981"
                      emissive="#047857"
                      emissiveIntensity={0.6}
                    />
                  </Sphere>
                );
              })}
              
              {/* Pricing Info Panel */}
              <Html position={[0, 0, 0.6]} center>
                <div className={`text-center bg-black/80 backdrop-blur-md rounded-lg p-4 border-2 max-w-xs ${
                  isPopular ? 'border-yellow-400' : 'border-white/20'
                }`}>
                  {isPopular && (
                    <div className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded mb-2">
                      MOST POPULAR
                    </div>
                  )}
                  
                  <div className="text-white text-xl font-bold mb-1">{tier.name}</div>
                  <div className="text-gray-300 text-sm mb-3">{tier.description}</div>
                  
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                    <span className="text-gray-400 text-sm">{tier.period}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {tier.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="text-xs text-gray-300 flex items-center">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                    {tier.features.length > 4 && (
                      <div className="text-xs text-gray-400">
                        +{tier.features.length - 4} more features
                      </div>
                    )}
                  </div>
                  
                  <button 
                    className={`mt-4 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isPopular 
                        ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                    onClick={() => window.open('https://calendly.com/clinicstreams-demo', '_blank')}
                  >
                    Get Started
                  </button>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
    </group>
  );
};

// 3D Testimonials Visualization
export const Testimonials3D = () => {
  return (
    <group>
      <Text
        position={[0, 10, 0]}
        fontSize={2.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        What Our Customers Say
      </Text>
      
      {testimonials.map((testimonial, index) => {
        const angle = (index / testimonials.length) * Math.PI * 2;
        const radius = 12;
        
        return (
          <Float 
            key={testimonial.name} 
            speed={0.8 + index * 0.2} 
            rotationIntensity={0.3} 
            floatIntensity={0.5}
          >
            <group position={[
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.3,
              Math.sin(angle) * radius * 0.2
            ]}>
              {/* Testimonial Sphere */}
              <Sphere args={[2.5, 16, 16]}>
                <meshStandardMaterial 
                  color="#374151"
                  emissive="#1f2937"
                  emissiveIntensity={0.3}
                  metalness={0.2}
                  roughness={0.8}
                />
              </Sphere>
              
              {/* Rating Stars */}
              {[...Array(testimonial.rating)].map((_, starIndex) => (
                <Sphere 
                  key={starIndex}
                  args={[0.2, 8, 8]}
                  position={[
                    (starIndex - 2) * 0.6,
                    3,
                    0.5
                  ]}
                >
                  <meshStandardMaterial 
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={0.8}
                  />
                </Sphere>
              ))}
              
              {/* Avatar Ring */}
              <Torus args={[3, 0.2, 8, 32]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial 
                  color="#3b82f6"
                  emissive="#1e40af"
                  emissiveIntensity={0.5}
                />
              </Torus>
              
              {/* Testimonial Info Panel */}
              <Html position={[0, -5, 0]} center>
                <div className="bg-black/80 backdrop-blur-md rounded-lg p-4 border border-white/20 max-w-sm text-center">
                  <div className="text-4xl mb-3">{testimonial.avatar}</div>
                  
                  <div className="text-white font-bold text-lg mb-1">{testimonial.name}</div>
                  <div className="text-blue-300 text-sm mb-1">{testimonial.title}</div>
                  <div className="text-gray-400 text-xs mb-3">{testimonial.organization}</div>
                  
                  <div className="text-gray-300 text-sm italic mb-3">
                    "{testimonial.quote}"
                  </div>
                  
                  <div className="flex justify-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </Html>
            </group>
          </Float>
        );
      })}
      
      {/* Central Quote Symbol */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.3}>
        <Text
          position={[0, 0, 0]}
          fontSize={8}
          color="#374151"
          anchorX="center"
          anchorY="middle"
        >
          "
        </Text>
      </Float>
    </group>
  );
};

// ROI Calculator 3D Visualization
export const ROICalculator3D = () => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  const roiData = [
    { label: 'Time Reduction', value: 40, color: '#10b981', icon: '⏱️' },
    { label: 'Cost Savings', value: 35, color: '#3b82f6', icon: '💰' },
    { label: 'Revenue Increase', value: 25, color: '#8b5cf6', icon: '📈' },
    { label: 'Efficiency Gain', value: 50, color: '#f59e0b', icon: '⚡' }
  ];
  
  return (
    <group ref={meshRef}>
      <Text
        position={[0, 12, 0]}
        fontSize={2.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Return on Investment
      </Text>
      
      {roiData.map((item, index) => {
        const angle = (index / roiData.length) * Math.PI * 2;
        const radius = 8;
        const height = (item.value / 10) + 2;
        
        return (
          <Float 
            key={item.label} 
            speed={0.6 + index * 0.1} 
            rotationIntensity={0.2} 
            floatIntensity={0.4}
          >
            <group position={[
              Math.cos(angle) * radius,
              0,
              Math.sin(angle) * radius
            ]}>
              {/* ROI Bar */}
              <Cylinder args={[1, 1, height, 8]} position={[0, height / 2, 0]}>
                <meshStandardMaterial 
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={0.4}
                />
              </Cylinder>
              
              {/* Value Display */}
              <Sphere args={[1.2, 12, 12]} position={[0, height + 1.5, 0]}>
                <meshStandardMaterial 
                  color={item.color}
                  emissive={item.color}
                  emissiveIntensity={0.6}
                />
              </Sphere>
              
              {/* ROI Info */}
              <Html position={[0, height + 3, 0]} center>
                <div className="text-center bg-black/80 backdrop-blur-md rounded-lg p-3 border border-white/20">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-white font-bold text-lg">{item.value}%</div>
                  <div className="text-gray-300 text-sm">{item.label}</div>
                </div>
              </Html>
              
              {/* Base Platform */}
              <Cylinder args={[1.5, 1.5, 0.5, 8]} position={[0, -0.25, 0]}>
                <meshStandardMaterial 
                  color="#374151"
                  emissive="#1f2937"
                  emissiveIntensity={0.2}
                />
              </Cylinder>
            </group>
          </Float>
        );
      })}
      
      {/* Central ROI Hub */}
      <Float speed={0.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <Torus args={[5, 1, 16, 64]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial 
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
            transparent
            opacity={0.3}
          />
        </Torus>
      </Float>
    </group>
  );
};

export default {
  Pricing3D,
  Testimonials3D,
  ROICalculator3D
};
