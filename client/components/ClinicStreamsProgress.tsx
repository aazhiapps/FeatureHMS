import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ClinicStreamsProgressProps {
  features: Array<{
    title: string;
    description: string;
    category: string;
  }>;
  onFeatureClick?: (featureIndex: number) => void;
  onJumpToSection?: (progress: number) => void;
}

export const ClinicStreamsProgress = ({
  features,
  onFeatureClick,
  onJumpToSection,
}: ClinicStreamsProgressProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const droneIconRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [discoveredFeatures, setDiscoveredFeatures] = useState<number[]>([]);
  const [currentAltitude, setCurrentAltitude] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connected");
  const [isInteractive, setIsInteractive] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || !droneIconRef.current || !pathRef.current)
      return;

    const path = pathRef.current;
    const droneIcon = droneIconRef.current;
    const pathLength = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.5, // Smoother scrub for better visual flow
      onUpdate: (self) => {
        const progress = self.progress;

        // Smooth path drawing with subtle glow effect
        gsap.to(path, {
          strokeDashoffset: pathLength * (1 - progress),
          duration: 0.3,
          ease: "power2.out"
        });

        const point = path.getPointAtLength(progress * pathLength);

        // Enhanced drone movement with smooth rotation and scale
        gsap.to(droneIcon, {
          x: point.x - 12,
          y: point.y - 12,
          rotation: progress * 180 + Math.sin(progress * Math.PI * 4) * 10,
          scale: 1 + Math.sin(progress * Math.PI * 8) * 0.1,
          duration: 0.5,
          ease: "power2.out"
        });

        // Medical metrics
        const connectivity = Math.floor(progress * 100 + 95);
        const patientCount = Math.floor(progress * 2547 + 150);
        setCurrentAltitude(patientCount);

        // Workflow-based feature discovery
        const featureIndex = Math.floor(progress * features.length);
        if (
          featureIndex < features.length &&
          !discoveredFeatures.includes(featureIndex)
        ) {
          setDiscoveredFeatures((prev) => [...prev, featureIndex]);

          // Highlight current workflow step
          const currentFeature = features[featureIndex];
          const featureElement = document.querySelector(
            `#feature-${currentFeature.category}`,
          );

          if (featureElement) {
            // Add connection animation effect
            gsap.fromTo(
              featureElement,
              { scale: 0.95, opacity: 0.8, borderColor: "transparent" },
              {
                scale: 1.05,
                opacity: 1,
                duration: 1.2,
                ease: "back.out(1.2)",
                repeat: 1,
                yoyo: true,
              },
            );

            // Add workflow connection highlight
            const connectionElement = featureElement.querySelector(
              ".workflow-connection",
            );
            if (connectionElement) {
              gsap.fromTo(
                connectionElement,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" },
              );
            }
          }
        }

        // Connection status based on progress
        const statuses = [
          "Connecting...",
          "Connected",
          "Streaming",
          "Analytics Active",
          "All Systems Online",
        ];
        const statusIndex = Math.min(
          Math.floor(progress * statuses.length),
          statuses.length - 1,
        );
        setConnectionStatus(statuses[statusIndex]);
      },
    });
  }, []); // Remove dependencies that cause re-renders

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "management":
        return "👥";
      case "scheduling":
        return "📅";
      case "records":
        return "📋";
      case "billing":
        return "💳";
      case "analytics":
        return "📊";
      case "resources":
        return "⏰";
      case "security":
        return "🛡️";
      case "engagement":
        return "💬";
      default:
        return "🏥";
    }
  };

  return (
    <div
      ref={containerRef}
      className="hidden md:block fixed right-2 lg:right-4 xl:right-6 top-16 md:top-20 z-40 pointer-events-none"
    >
      {/* Medical Flight Path */}
      <div className="relative">
        <svg
          width="60"
          height="300"
          viewBox="0 0 60 300"
          className="md:w-[70px] md:h-[350px] lg:w-[80px] lg:h-[400px] overflow-visible"
        >
          <defs>
            <linearGradient
              id="medicalPathGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
              <stop offset="30%" stopColor="#0088ff" stopOpacity="0.9" />
              <stop offset="60%" stopColor="#ff6600" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff0088" stopOpacity="0.7" />
            </linearGradient>

            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <path
            ref={pathRef}
            d="M30,15 Q45,45 30,75 Q15,105 30,135 Q45,165 30,195 Q15,225 30,255 L30,285"
            stroke="url(#medicalPathGradient)"
            strokeWidth="3"
            className="md:stroke-[4] drop-shadow-xl"
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Connected Workflow Points */}
          {features.map((feature, index) => {
            const y = 15 + (270 / (features.length - 1)) * index;
            const isDiscovered = discoveredFeatures.includes(index);
            const isActive = discoveredFeatures.length - 1 === index;

            return (
              <g key={index}>
                {/* Connection line to next point */}
                {index < features.length - 1 && (
                  <line
                    x1="30"
                    y1={y + 8}
                    x2="30"
                    y2={y + 270 / (features.length - 1) - 8}
                    stroke={isDiscovered ? "#00ff88" : "#e5e7eb"}
                    strokeWidth="2"
                    className="md:stroke-[3] transition-all duration-500"
                  />
                )}

                {/* Workflow point circle - now clickable */}
                <circle
                  cx="30"
                  cy={y}
                  r="8"
                  className={`md:r-10 cursor-pointer hover:r-10 md:hover:r-12 transition-all duration-300 ${isDiscovered ? "drop-shadow-lg" : ""} hover:drop-shadow-xl`}
                  fill={isDiscovered ? "#00ff88" : "#f3f4f6"}
                  stroke={
                    hoveredFeature === index ? "#ff6600" :
                    isActive ? "#0066ff" : isDiscovered ? "#00cc66" : "#d1d5db"
                  }
                  strokeWidth={hoveredFeature === index ? "5" : isActive ? "4" : "3"}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => {
                    const targetProgress = index / (features.length - 1);
                    onJumpToSection?.(targetProgress);
                    onFeatureClick?.(index);

                    // Visual feedback
                    const circle = document.querySelector(`circle[data-feature-index="${index}"]`);
                    if (circle) {
                      gsap.fromTo(circle,
                        { scale: 1 },
                        {
                          scale: 1.3,
                          duration: 0.3,
                          yoyo: true,
                          repeat: 1,
                          ease: "power2.out",
                          transformOrigin: "center"
                        }
                      );
                    }
                  }}
                  data-feature-index={index}
                />

                {/* Inner active indicator */}
                {isActive && (
                  <circle
                    cx="30"
                    cy={y}
                    r="4"
                    className="md:r-5 animate-pulse"
                    fill="#0066ff"
                  />
                )}

                {/* Feature category icon - also clickable */}
                <text
                  x="30"
                  y={y + 2}
                  textAnchor="middle"
                  fontSize={hoveredFeature === index ? "12" : "10"}
                  className={`md:text-xs cursor-pointer transition-all duration-300 ${hoveredFeature === index ? 'animate-pulse' : ''}`}
                  fill={hoveredFeature === index ? "#ff6600" : isDiscovered ? "#ffffff" : "#9ca3af"}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => {
                    const targetProgress = index / (features.length - 1);
                    onJumpToSection?.(targetProgress);
                    onFeatureClick?.(index);
                  }}
                >
                  {isDiscovered ? getCategoryIcon(feature.category) : "○"}
                </text>

                {/* Connection pulse effect */}
                {isDiscovered && (
                  <circle
                    cx="30"
                    cy={y}
                    r="12"
                    className="md:r-15"
                    fill="none"
                    stroke="#00ff88"
                    strokeWidth="2"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Workflow label - also clickable */}
                <text
                  x="45"
                  y={y + 3}
                  fontSize={hoveredFeature === index ? "8" : "7"}
                  className={`md:x-60 md:text-[8px] cursor-pointer transition-all duration-300 ${hoveredFeature === index ? 'font-bold' : ''}`}
                  fill={hoveredFeature === index ? "#ff6600" : isDiscovered ? "#00ff88" : "#9ca3af"}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={() => {
                    const targetProgress = index / (features.length - 1);
                    onJumpToSection?.(targetProgress);
                    onFeatureClick?.(index);
                  }}
                >
                  {feature.title.substring(0, 8)}...
                </text>
              </g>
            );
          })}
        </svg>

        {/* Medical Drone Icon - now clickable */}
        <div
          ref={droneIconRef}
          className="absolute w-6 h-6 md:w-8 md:h-8 transition-transform duration-200 cursor-pointer group"
          style={{ left: 0, top: 0 }}
          onClick={() => {
            // Jump to current position or restart journey
            onJumpToSection?.(0);

            // Visual feedback
            gsap.fromTo(droneIconRef.current,
              { scale: 1, rotation: 0 },
              {
                scale: 1.2,
                rotation: 360,
                duration: 0.6,
                ease: "back.out(1.7)",
                onComplete: () => {
                  gsap.to(droneIconRef.current, {
                    scale: 1,
                    duration: 0.3
                  });
                }
              }
            );
          }}
          title="Click to restart journey"
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-xl shadow-xl flex items-center justify-center border-2 border-white group-hover:border-yellow-300 group-hover:scale-110 transition-all duration-300">
            <div className="text-white text-xs md:text-sm font-bold group-hover:animate-bounce">🚁</div>
          </div>

          {/* Enhanced Medical Trail with hover effect */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 md:w-16 h-0.5 md:h-1 bg-gradient-to-r from-green-400 via-blue-400 to-transparent opacity-80 group-hover:opacity-100 group-hover:h-1 md:group-hover:h-2 transition-all duration-300"></div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 rounded-xl bg-yellow-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
        </div>
      </div>

      {/* ClinicStreams Status Panel - now with interaction hints */}
      <div className="mt-6 md:mt-8 bg-gradient-to-br from-white/10 to-blue-500/10 backdrop-blur-md rounded-lg md:rounded-xl p-3 md:p-5 shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-300 group">
        <div className="flex items-center mb-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <div className="text-xs md:text-sm font-semibold text-white group-hover:text-blue-200 transition-colors duration-300">
            ClinicStreams Status
            <span className="text-xs text-white/50 ml-2 group-hover:text-white/70">(Click elements to navigate)</span>
          </div>
        </div>

        <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
          {currentAltitude.toLocaleString()} patients
        </div>

        <div className="text-xs md:text-sm text-white/70 mt-1">
          Features: {discoveredFeatures.length}/{features.length}
        </div>

        <div className="mt-2 md:mt-3 flex items-center space-x-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs md:text-sm text-blue-300 font-medium">
            {connectionStatus}
          </span>
        </div>

        {/* Health Metrics */}
        <div className="mt-2 md:mt-3 space-y-1">
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-white/60">Data Integrity</span>
            <span className="text-green-400 font-medium">99.9%</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-white/60">Response Time</span>
            <span className="text-blue-400 font-medium">&lt;50ms</span>
          </div>
          <div className="flex justify-between text-xs md:text-sm">
            <span className="text-white/60">Uptime</span>
            <span className="text-green-400 font-medium">99.99%</span>
          </div>
        </div>
      </div>

      {/* Latest Feature Discovery */}
      {discoveredFeatures.length > 0 && (
        <div className="mt-3 md:mt-4 bg-gradient-to-r from-green-500/20 to-blue-600/20 backdrop-blur-md text-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-xl max-w-48 md:max-w-60 border border-white/20">
          <div className="text-xs md:text-sm font-medium opacity-90">Latest Feature</div>
          <div className="text-sm md:text-base font-bold flex items-center">
            <span className="mr-2">
              {getCategoryIcon(
                features[discoveredFeatures[discoveredFeatures.length - 1]]
                  ?.category,
              )}
            </span>
            {features[discoveredFeatures[discoveredFeatures.length - 1]]?.title}
          </div>
          <div className="text-xs md:text-sm opacity-80 mt-1">
            {features[
              discoveredFeatures[discoveredFeatures.length - 1]
            ]?.category.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};
