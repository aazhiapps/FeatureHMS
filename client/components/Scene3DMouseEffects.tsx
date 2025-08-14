import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';

interface Scene3DMouseEffectsProps {
  sceneRef?: React.RefObject<HTMLDivElement>;
}

export const Scene3DMouseEffects = ({ sceneRef }: Scene3DMouseEffectsProps) => {
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      targetRef.current = { x, y };
    };

    const animate = () => {
      // Smooth interpolation
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.05;

      // Emit custom event with smooth mouse coordinates
      window.dispatchEvent(new CustomEvent('smooth3DMouseMove', {
        detail: {
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          rawX: targetRef.current.x,
          rawY: targetRef.current.y
        }
      }));

      animationFrameId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null; // This component only provides mouse tracking
};

// Hook for 3D camera mouse following
export const use3DMouseFollow = (cameraRef: React.RefObject<THREE.Camera>) => {
  useEffect(() => {
    if (!cameraRef.current) return;

    const camera = cameraRef.current;

    const handleSmoothMouseMove = (e: CustomEvent) => {
      const { x, y } = e.detail;
      
      // Subtle camera movement based on mouse position
      gsap.to(camera.position, {
        x: x * 2,
        y: y * 1,
        duration: 2,
        ease: "power2.out"
      });

      // Look at direction with mouse influence
      const lookAtX = x * 5;
      const lookAtY = y * 3;
      
      gsap.to(camera.rotation, {
        x: -y * 0.1,
        y: x * 0.1,
        duration: 1.5,
        ease: "power2.out"
      });
    };

    window.addEventListener('smooth3DMouseMove', handleSmoothMouseMove as EventListener);
    
    return () => {
      window.removeEventListener('smooth3DMouseMove', handleSmoothMouseMove as EventListener);
    };
  }, [cameraRef]);
};

// Enhanced parallax effects for background elements
export const useEnhancedParallax = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Parallax background elements
      const parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const speed = parseFloat(htmlElement.dataset.parallax || '0.1');
        
        gsap.to(htmlElement, {
          x: x * speed * 50,
          y: y * speed * 50,
          duration: 1.5,
          ease: "power2.out"
        });
      });

      // Enhanced parallax for medical elements
      const medicalElements = document.querySelectorAll('.medical-element');
      medicalElements.forEach((element, index) => {
        const htmlElement = element as HTMLElement;
        const speed = 0.05 + (index % 3) * 0.02;
        
        gsap.to(htmlElement, {
          x: x * speed * 30,
          y: y * speed * 20,
          rotation: x * speed * 10,
          duration: 2,
          ease: "power2.out"
        });
      });

      // Floating particles mouse influence
      const particles = document.querySelectorAll('.floating-particle');
      particles.forEach((particle, index) => {
        const htmlElement = particle as HTMLElement;
        const distance = 100 + index * 20;
        const influence = Math.max(0, 1 - (Math.abs(x) + Math.abs(y)) / 2);
        
        gsap.to(htmlElement, {
          x: x * distance * influence,
          y: y * distance * influence,
          scale: 1 + influence * 0.2,
          opacity: 0.3 + influence * 0.7,
          duration: 1 + index * 0.1,
          ease: "power2.out"
        });
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
};

// Mouse attraction effect for UI elements
export const useMouseAttraction = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const attractiveElements = document.querySelectorAll('[data-mouse-attract]');
      
      attractiveElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        const rect = htmlElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        const maxDistance = parseFloat(htmlElement.dataset.mouseAttract || '200');
        
        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const deltaX = (e.clientX - centerX) * force * 0.1;
          const deltaY = (e.clientY - centerY) * force * 0.1;
          
          gsap.to(htmlElement, {
            x: deltaX,
            y: deltaY,
            scale: 1 + force * 0.05,
            duration: 0.5,
            ease: "power2.out"
          });
        } else {
          gsap.to(htmlElement, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out"
          });
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
};

// Enhanced glow effect following mouse
export const MouseGlowEffect = () => {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-50"
      style={{
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)',
        filter: 'blur(20px)',
        mixBlendMode: 'screen',
      }}
    />
  );
};
