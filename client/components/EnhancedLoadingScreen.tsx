import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { MedicineWaveEffect } from "./MedicineWaveEffect";

interface EnhancedLoadingScreenProps {
  onComplete?: () => void;
  features?: Array<{
    id: string;
    title: string;
    icon: string;
    color: string;
  }>;
}

export const EnhancedLoadingScreen = ({
  onComplete,
  features = [],
}: EnhancedLoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const planeRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const [loadingPhase, setLoadingPhase] = useState<
    "countdown" | "circles" | "plane" | "systemready" | "complete"
  >("countdown");
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!containerRef.current) return;

    const circles = circlesRef.current.filter(Boolean);
    let tl = gsap.timeline();

    // Phase 0: 3D Countdown Animation
    if (loadingPhase === "countdown") {
      let countdownValue = 3;
      setCountdown(countdownValue);

      const countdownInterval = setInterval(() => {
        countdownValue--;
        if (countdownValue > 0) {
          setCountdown(countdownValue);

          // 3D rotation animation for each number
          if (countdownRef.current) {
            gsap.fromTo(
              countdownRef.current,
              {
                rotationY: -90,
                scale: 0.5,
                opacity: 0,
                rotationX: 30,
              },
              {
                rotationY: 0,
                scale: 1.2,
                opacity: 1,
                rotationX: 0,
                duration: 0.6,
                ease: "back.out(2.5)",
                transformOrigin: "center center",
              },
            );

            // Scale down before next number
            gsap.to(countdownRef.current, {
              scale: 0.8,
              opacity: 0.7,
              delay: 0.6,
              duration: 0.3,
              ease: "power2.in",
            });
          }
        } else {
          clearInterval(countdownInterval);

          // Final countdown animation - blast off effect
          if (countdownRef.current) {
            gsap.to(countdownRef.current, {
              scale: 2,
              opacity: 0,
              rotationY: 360,
              rotationX: 360,
              duration: 0.8,
              ease: "power3.out",
              onComplete: () => {
                setLoadingPhase("circles");
              },
            });
          }
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    }

    // Phase 1: Circles Animation (Robin Payot style)
    if (loadingPhase === "circles") {
      gsap.set(circles, { scale: 0, opacity: 0 });

      circles.forEach((circle, index) => {
        tl.to(
          circle,
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          index * 0.2,
        )
          .to(
            circle,
            {
              scale: 1.1,
              duration: 0.4,
              ease: "power2.inOut",
            },
            index * 0.2 + 0.6,
          )
          .to(
            circle,
            {
              scale: 1,
              duration: 0.4,
              ease: "power2.inOut",
            },
            index * 0.2 + 1,
          );
      });

      // After circles, transition to plane
      const circleTimeout = setTimeout(() => {
        setLoadingPhase("plane");

        // Fade out circles
        gsap.to(circles, {
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          stagger: 0.1,
          onComplete: () => {
            // Show plane animation
            if (planeRef.current) {
              gsap.fromTo(
                planeRef.current,
                { x: -200, opacity: 0 },
                {
                  x: window.innerWidth + 100,
                  opacity: 1,
                  duration: 2,
                  ease: "power2.inOut",
                  onComplete: () => {
                    if (features.length > 0) {
                      setLoadingPhase("systemready");

                      // Show system ready screen for 3 seconds
                      setTimeout(() => {
                        setLoadingPhase("complete");

                        // Final fade out
                        gsap.to(containerRef.current, {
                          opacity: 0,
                          duration: 0.8,
                          ease: "power2.out",
                          onComplete,
                        });
                      }, 3000);
                    } else {
                      setLoadingPhase("complete");

                      // Final fade out
                      gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        onComplete,
                      });
                    }
                  },
                },
              );
            }
          },
        });
      }, 1500);

      return () => {
        clearTimeout(circleTimeout);
        tl.kill();
      };
    }
  }, [loadingPhase, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 z-50 flex items-center justify-center overflow-hidden"
    >
      {/* 3D Countdown Animation */}
      {loadingPhase === "countdown" && (
        <div className="text-center relative">
          <h1 className="text-3xl md:text-5xl font-light tracking-tight mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            CLINICSTREAMS
          </h1>

          <p className="text-sm font-light text-blue-600 tracking-wide mb-16 opacity-80">
            LAUNCHING HEALTHCARE REVOLUTION
          </p>

          {/* 3D Countdown Number */}
          <div className="relative mb-16">
            <div
              ref={countdownRef}
              className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text text-transparent relative"
              style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
            >
              {countdown}

              {/* 3D Shadow Effect */}
              <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold text-blue-200/30 transform translate-x-2 translate-y-2 -z-10">
                {countdown}
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent opacity-50 blur-sm">
                {countdown}
              </div>
            </div>

            {/* Orbiting Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-pulse"
                  style={{
                    transform: `rotate(${index * 90}deg) translateX(120px)`,
                    animation: `spin 2s linear infinite`,
                    animationDelay: `${index * 0.5}s`,
                  }}
                />
              ))}
            </div>
          </div>

          <p className="text-lg font-medium text-gray-600 tracking-wide animate-pulse">
            Initializing Medical Systems...
          </p>
        </div>
      )}

      {/* Circles Animation */}
      {loadingPhase === "circles" && (
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
      {loadingPhase === "plane" && (
        <div
          ref={planeRef}
          className="absolute top-1/2 transform -translate-y-1/2"
        >
          <div className="relative">
            {/* Medical Drone */}
            <div className="w-16 h-6 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg relative shadow-lg">
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-red-500 rounded-full"></div>
              <div className="absolute top-1.5 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-red-500 rounded-full"></div>
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-white rounded-full opacity-80 animate-spin"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80 animate-spin"></div>
              <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-white rounded-full opacity-80 animate-spin"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-white rounded-full opacity-80 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs">
                🏥
              </div>
            </div>

            {/* Medical Trail Effect */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-transparent opacity-70"></div>
          </div>
        </div>
      )}

      {/* System Ready - Circular Feature List */}
      {loadingPhase === "systemready" && (
        <div className="text-center animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-8 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            SYSTEM READY
          </h1>

          <p className="text-lg font-medium text-blue-600 mb-12 tracking-wide">
            All {features.length} healthcare features are now available
          </p>

          {/* Circular Feature Display */}
          <div className="relative w-80 h-80 mx-auto mb-8">
            <div
              className="absolute inset-0 border-2 border-blue-300 rounded-full opacity-30 animate-spin"
              style={{ animationDuration: "20s" }}
            ></div>
            <div
              className="absolute inset-4 border border-green-300 rounded-full opacity-20 animate-spin"
              style={{
                animationDuration: "15s",
                animationDirection: "reverse",
              }}
            ></div>

            {features.map((feature, index) => {
              const angle = (index / features.length) * 2 * Math.PI;
              const radius = 120;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={feature.id}
                  className="absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                  style={{
                    left: `50%`,
                    top: `50%`,
                    transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-xl shadow-lg border-2 border-white/30`}
                  >
                    {feature.icon}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-600 font-medium whitespace-nowrap">
                    {feature.title.split(" ")[0]}
                  </div>
                </div>
              );
            })}

            {/* Center logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-xl">
                🏥
              </div>
            </div>
          </div>

          <p className="text-base text-gray-600 animate-pulse">
            Initializing comprehensive healthcare platform...
          </p>
        </div>
      )}

      {/* Loading Text */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-blue-600 font-light text-lg mb-2">
          {loadingPhase === "countdown"
            ? "Preparing to Launch..."
            : loadingPhase === "circles"
              ? "Connecting to Healthcare Network..."
              : loadingPhase === "plane"
                ? "Deploying Medical Drone..."
                : loadingPhase === "systemready"
                  ? "All Systems Online!"
                  : "Ready to Begin!"}
        </p>
        <div className="w-40 h-1 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-1000"
            style={{
              width:
                loadingPhase === "countdown"
                  ? "15%"
                  : loadingPhase === "circles"
                    ? "35%"
                    : loadingPhase === "plane"
                      ? "65%"
                      : loadingPhase === "systemready"
                        ? "95%"
                        : "100%",
            }}
          ></div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
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

      {/* Medicine Wave Effect for Loading */}
      <MedicineWaveEffect
        isActive={loadingPhase !== "complete"}
        intensity={
          loadingPhase === "countdown"
            ? 1.5
            : loadingPhase === "systemready"
              ? 0.8
              : 1.0
        }
        particleCount={loadingPhase === "systemready" ? 35 : 20}
      />

      {/* CSS for spinning animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg) translateX(120px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(120px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};
