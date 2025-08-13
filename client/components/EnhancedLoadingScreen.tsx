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
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* Circles Animation */}
      {loadingPhase === 'circles' && (
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            CLINICSTREAMS
          </h1>

          <p className="text-sm font-light text-blue-600 tracking-wide mb-12 opacity-80">
            REVOLUTIONIZING HEALTHCARE TECHNOLOGY
          </p>

          <div className="flex items-center justify-center space-x-4 mb-12">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                ref={(el) => (circlesRef.current[index] = el)}
                className="relative"
              >
                <div className="w-24 h-24 border-2 border-blue-400 rounded-full relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                  <div className="absolute inset-3 border border-blue-300 rounded-full">
                    <div className="absolute inset-3 border border-green-200 rounded-full opacity-70"></div>
                  </div>
                  {index === 1 && (
                    <span className="relative z-10 text-blue-600 font-medium text-lg tracking-wide">
                      🏥
                    </span>
                  )}
                  {index === 0 && (
                    <span className="relative z-10 text-green-600 font-medium text-sm">
                      📊
                    </span>
                  )}
                  {index === 2 && (
                    <span className="relative z-10 text-blue-500 font-medium text-sm">
                      💻
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-base font-light text-gray-600 tracking-wide max-w-md mx-auto">
            The Future of Healthcare Streaming & Patient Monitoring
          </p>
        </div>
      )}

      {/* Plane Animation */}
      {loadingPhase === 'plane' && (
        <div
          ref={planeRef}
          className="absolute top-1/2 transform -translate-y-1/2"
        >
          <div className="relative">
            {/* Medical Drone */}
            <div className="w-16 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg relative shadow-lg">
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-red-500 rounded-full"></div>
              <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-red-500 rounded-full"></div>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs">🏥</div>
            </div>

            {/* Medical Trail Effect */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-transparent opacity-70"></div>
          </div>
        </div>
      )}

      {/* Loading Text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-blue-600 font-light text-lg mb-2">
          {loadingPhase === 'circles' ? 'Connecting to Healthcare Network...' :
           loadingPhase === 'plane' ? 'Deploying Medical Drone...' : 'System Ready!'}
        </p>
        <div className="w-40 h-1 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
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
