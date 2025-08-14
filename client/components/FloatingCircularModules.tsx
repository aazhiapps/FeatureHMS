import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface CircularModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  angle: number;
  radius: number;
  size: number;
}

interface FloatingCircularModulesProps {
  isVisible?: boolean;
  centerText?: string;
}

export const FloatingCircularModules = ({
  isVisible = true,
  centerText = "All Systems Online!",
}: FloatingCircularModulesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const [animationActive, setAnimationActive] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const modules: CircularModule[] = [
    {
      id: "insurance",
      title: "Insurance",
      icon: "📋",
      color: "from-pink-400 to-red-400",
      angle: 0,
      radius: 180,
      size: 80,
    },
    {
      id: "admission",
      title: "Admission",
      icon: "🏥",
      color: "from-teal-400 to-cyan-400",
      angle: 45,
      radius: 180,
      size: 70,
    },
    {
      id: "front",
      title: "Front",
      icon: "🏢",
      color: "from-blue-400 to-indigo-400",
      angle: 90,
      radius: 180,
      size: 85,
    },
    {
      id: "lab",
      title: "Lab",
      icon: "🧪",
      color: "from-purple-400 to-violet-400",
      angle: 135,
      radius: 180,
      size: 75,
    },
    {
      id: "accounts",
      title: "Accounts",
      icon: "💰",
      color: "from-orange-400 to-yellow-400",
      angle: 180,
      radius: 180,
      size: 90,
    },
    {
      id: "ambulance",
      title: "Ambulance",
      icon: "🚑",
      color: "from-purple-400 to-pink-400",
      angle: 225,
      radius: 180,
      size: 80,
    },
    {
      id: "nursing",
      title: "Nursing",
      icon: "👩‍⚕️",
      color: "from-cyan-400 to-teal-400",
      angle: 270,
      radius: 180,
      size: 85,
    },
    {
      id: "central",
      title: "Systems",
      icon: "⚙️",
      color: "from-green-400 to-emerald-400",
      angle: 315,
      radius: 120,
      size: 100,
    },
  ];

  // Scroll detection effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);

      // Hide center text while scrolling
      if (centerTextRef.current) {
        gsap.to(centerTextRef.current, {
          opacity: 0,
          scale: 0.8,
          duration: 0.2,
          ease: "power2.out"
        });
      }

      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Show center text after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        if (centerTextRef.current) {
          gsap.to(centerTextRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            ease: "back.out(1.2)"
          });
        }
      }, 150); // Wait 150ms after scroll stops
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isVisible) return;

    setAnimationActive(true);

    // Create floating animation for each module
    modules.forEach((module, index) => {
      const element = document.getElementById(`module-${module.id}`);
      if (element) {
        // Initial position based on angle and radius
        const x = Math.cos((module.angle * Math.PI) / 180) * module.radius;
        const y = Math.sin((module.angle * Math.PI) / 180) * module.radius;

        // Set initial position
        gsap.set(element, {
          x: x,
          y: y,
          scale: 0,
          rotation: 0,
          opacity: 0,
        });

        // Entrance animation with stagger
        gsap.to(element, {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          delay: index * 0.15,
          ease: "back.out(1.7)",
        });

        // Continuous floating animation
        gsap.to(element, {
          y: y + Math.sin(index * 0.5) * 15,
          rotation: 360,
          duration: 8 + index * 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });

        // Orbital motion around center
        gsap.to(element, {
          rotation: 360,
          transformOrigin: `${-x}px ${-y}px`,
          duration: 20 + index * 2,
          repeat: -1,
          ease: "none",
        });

        // Pulsing animation
        gsap.to(element, {
          scale: 1.1,
          duration: 2 + index * 0.3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });
      }
    });

    // Center element animation
    if (centerRef.current) {
      gsap.fromTo(
        centerRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 2,
          delay: 1,
          ease: "back.out(1.7)",
        },
      );

      // Continuous rotation for center
      gsap.to(centerRef.current, {
        rotation: 360,
        duration: 15,
        repeat: -1,
        ease: "none",
      });
    }

    return () => {
      setAnimationActive(false);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden"
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20" />

      {/* Floating circular modules container */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Central system indicator */}
        <div
          ref={centerRef}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border-2 border-white/30 flex flex-col items-center justify-center shadow-2xl"
        >
          <div className="text-3xl mb-2">🏥</div>
          <div className="text-white text-xs font-bold text-center leading-tight px-2">
            {centerText}
          </div>

          {/* Animated rings around center */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping" />
          <div
            className="absolute inset-0 rounded-full border border-green-400/30 animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        {/* Floating modules */}
        {modules.map((module) => (
          <div
            key={module.id}
            id={`module-${module.id}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{
              width: `${module.size}px`,
              height: `${module.size}px`,
              filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
            }}
          >
            {/* Module circle */}
            <div
              className={`
              w-full h-full rounded-full bg-gradient-to-br ${module.color} 
              flex flex-col items-center justify-center text-white
              border-2 border-white/50 shadow-xl
              transition-all duration-300 group-hover:scale-110
              backdrop-blur-sm
            `}
            >
              <div className="text-2xl mb-1">{module.icon}</div>
              <div className="text-xs font-bold text-center leading-tight px-1">
                {module.title}
              </div>
            </div>

            {/* Glow effect */}
            <div
              className={`
              absolute inset-0 rounded-full bg-gradient-to-br ${module.color} 
              opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl
            `}
            />

            {/* Connection lines to center */}
            <div
              className="absolute top-1/2 left-1/2 w-0.5 bg-white/20 transform -translate-x-1/2 origin-top"
              style={{
                height: `${module.radius - module.size / 2}px`,
                transform: `translate(-50%, -50%) rotate(${module.angle + 180}deg)`,
              }}
            />

            {/* Floating particles around module */}
            {animationActive && (
              <div className="absolute inset-0">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/60 rounded-full animate-ping"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${20 + i * 20}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: `${2 + i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Orbital rings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="w-96 h-96 rounded-full border border-white/10 animate-spin"
            style={{ animationDuration: "30s" }}
          />
          <div
            className="absolute inset-4 rounded-full border border-blue-400/20 animate-spin"
            style={{ animationDuration: "25s", animationDirection: "reverse" }}
          />
          <div
            className="absolute inset-8 rounded-full border border-purple-400/20 animate-spin"
            style={{ animationDuration: "20s" }}
          />
        </div>

        {/* Data flow indicators */}
        {animationActive && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-pulse"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateX(140px)`,
                  animationDelay: `${i * 0.25}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full animate-pulse" />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 border border-white/20 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-16 h-16 border border-white/20 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  );
};
