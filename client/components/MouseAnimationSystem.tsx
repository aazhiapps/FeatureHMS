import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FloatingMoleculeAnimation } from './FloatingMoleculeAnimation';

interface MousePosition {
  x: number;
  y: number;
}

interface MouseAnimationSystemProps {
  children: React.ReactNode;
}

export const MouseAnimationSystem = ({ children }: MouseAnimationSystemProps) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'hover' | 'click' | 'text'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const trailDotsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    const trail: MousePosition[] = Array(12).fill({ x: 0, y: 0 });

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      setMousePos(newPos);
      setIsVisible(true);

      // Smooth cursor movement
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: newPos.x,
          y: newPos.y,
          duration: 0.1,
          ease: "power2.out"
        });
      }

      // Cursor dot with slight delay
      if (cursorDotRef.current) {
        gsap.to(cursorDotRef.current, {
          x: newPos.x,
          y: newPos.y,
          duration: 0.05,
          ease: "power2.out"
        });
      }

      // Trail effect
      trail.unshift({ x: newPos.x, y: newPos.y });
      trail.pop();

      trailDotsRef.current.forEach((dot, index) => {
        if (dot && trail[index]) {
          gsap.set(dot, {
            x: trail[index].x,
            y: trail[index].y,
            opacity: (12 - index) / 12 * 0.8,
            scale: (12 - index) / 12 * 0.8
          });
        }
      });
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Enhanced hover detection for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.matches('button, a, [role="button"], .interactive')) {
        setCursorVariant('hover');
      } else if (target.matches('input, textarea, [contenteditable]')) {
        setCursorVariant('text');
      } else {
        setCursorVariant('default');
      }
    };

    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant('default');

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const getCursorStyles = () => {
    switch (cursorVariant) {
      case 'hover':
        return {
          width: '60px',
          height: '60px',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          border: '2px solid rgb(59, 130, 246)',
          mixBlendMode: 'difference' as const,
        };
      case 'click':
        return {
          width: '30px',
          height: '30px',
          backgroundColor: 'rgba(239, 68, 68, 0.3)',
          border: '2px solid rgb(239, 68, 68)',
        };
      case 'text':
        return {
          width: '2px',
          height: '24px',
          backgroundColor: 'rgb(59, 130, 246)',
          borderRadius: '1px',
        };
      default:
        return {
          width: '40px',
          height: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
        };
    }
  };

  return (
    <div className="relative">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`fixed pointer-events-none z-[9999] rounded-full backdrop-blur-sm transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'translate(-50%, -50%)',
          ...getCursorStyles(),
        }}
      >
        {/* Inner cursor dot */}
        <div
          ref={cursorDotRef}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Mouse Trail */}
      <div ref={trailRef} className="fixed pointer-events-none z-[9998]">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) trailDotsRef.current[index] = el;
            }}
            className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-0"
            style={{
              transform: 'translate(-50%, -50%)',
              filter: `blur(${index * 0.5}px)`,
            }}
          />
        ))}
      </div>

      {/* Floating Molecule Animation */}
      <FloatingMoleculeAnimation isActive={true} />

      {/* Magnetic Field Indicator */}
      <MouseParallaxContainer mousePos={mousePos}>
        {children}
      </MouseParallaxContainer>
    </div>
  );
};

// Mouse Parallax Container
interface MouseParallaxContainerProps {
  children: React.ReactNode;
  mousePos: MousePosition;
}

const MouseParallaxContainer = ({ children, mousePos }: MouseParallaxContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll('[data-mouse-parallax]');
    
    elements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const speed = parseFloat(htmlElement.dataset.mouseParallax || '0.1');
      const rect = htmlElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (mousePos.x - centerX) * speed;
      const deltaY = (mousePos.y - centerY) * speed;
      
      gsap.to(htmlElement, {
        x: deltaX,
        y: deltaY,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }, [mousePos]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {children}
    </div>
  );
};

// Mouse 3D Tilt Effect Hook
export const useMouseTilt = (elementRef: React.RefObject<HTMLElement>, intensity = 0.3) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      const rotateY = deltaX * intensity * 20;
      const rotateX = -deltaY * intensity * 20;
      
      gsap.to(element, {
        rotationY: rotateY,
        rotationX: rotateX,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [elementRef, intensity]);
};

// Magnetic Button Effect Hook
export const useMagneticEffect = (elementRef: React.RefObject<HTMLElement>, strength = 0.3) => {
  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );
      
      if (distance < 100) {
        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;
        
        gsap.to(element, {
          x: deltaX,
          y: deltaY,
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(element, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [elementRef, strength]);
};

// Interactive Particles Component
export const InteractiveParticles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const particles = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      particles.forEach((particle, index) => {
        const dx = e.clientX - particle.x;
        const dy = e.clientY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.vx -= (dx / distance) * force * 0.5;
          particle.vy -= (dy / distance) * force * 0.5;
        }
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        
        // Boundary collision
        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;
        
        const particleElement = particlesRef.current[index];
        if (particleElement) {
          gsap.set(particleElement, {
            x: particle.x,
            y: particle.y,
          });
        }
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) particlesRef.current[index] = el;
          }}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
          }}
        />
      ))}
    </div>
  );
};
