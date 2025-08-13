import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface EnhancedLoadingScreenProps {
  onComplete?: () => void;
}

export const EnhancedLoadingScreen = ({ onComplete }: EnhancedLoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const planeRef = useRef<HTMLDivElement>(null);
  const [loadingPhase, setLoadingPhase] = useState<'circles' | 'plane' | 'complete'>('circles');

  useEffect(() => {
    if (!containerRef.current) return;

    const circles = circlesRef.current.filter(Boolean);
    let tl = gsap.timeline();

    // Phase 1: Circles Animation (Robin Payot style)
    gsap.set(circles, { scale: 0, opacity: 0 });

    circles.forEach((circle, index) => {
      tl.to(circle, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, index * 0.2)
      .to(circle, {
        scale: 1.1,
        duration: 0.4,
        ease: "power2.inOut",
      }, index * 0.2 + 0.6)
      .to(circle, {
        scale: 1,
        duration: 0.4,
        ease: "power2.inOut",
      }, index * 0.2 + 1);
    });

    // After circles, transition to plane
    const circleTimeout = setTimeout(() => {
      setLoadingPhase('plane');
      
      // Fade out circles
      gsap.to(circles, {
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.1,
        onComplete: () => {
          // Show plane animation
          if (planeRef.current) {
            gsap.fromTo(planeRef.current, 
              { x: -200, opacity: 0 },
              { 
                x: window.innerWidth + 100, 
                opacity: 1,
                duration: 2,
                ease: "power2.inOut",
                onComplete: () => {
                  setLoadingPhase('complete');
                  
                  // Final fade out
                  gsap.to(containerRef.current, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    onComplete,
                  });
                }
              }
            );
          }
        }
      });
    }, 1500);

    return () => {
      clearTimeout(circleTimeout);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Circles Animation */}
      {loadingPhase === 'circles' && (
        <div className="flex items-center justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              ref={(el) => (circlesRef.current[index] = el)}
              className="relative"
            >
              <div className="w-20 h-20 border-2 border-indigo-600 rounded-full relative">
                <div className="absolute inset-2 border border-indigo-400 rounded-full">
                  <div className="absolute inset-2 border border-indigo-300 rounded-full opacity-50"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plane Animation */}
      {loadingPhase === 'plane' && (
        <div
          ref={planeRef}
          className="absolute top-1/2 transform -translate-y-1/2"
        >
          <div className="relative">
            {/* Simple CSS Plane */}
            <div className="w-16 h-4 bg-white rounded-full relative shadow-lg">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-gray-200 rounded-full"></div>
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gray-300 rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-6 bg-gray-200 rounded-full rotate-90"></div>
            </div>
            
            {/* Trail Effect */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-blue-300 to-transparent opacity-60"></div>
          </div>
        </div>
      )}

      {/* Loading Text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-indigo-600 font-light text-lg mb-2">
          {loadingPhase === 'circles' ? 'Initializing...' : 
           loadingPhase === 'plane' ? 'Taking Flight...' : 'Ready!'}
        </p>
        <div className="w-32 h-1 bg-indigo-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
            style={{ 
              width: loadingPhase === 'circles' ? '30%' : 
                     loadingPhase === 'plane' ? '70%' : '100%' 
            }}
          ></div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
