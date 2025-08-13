import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ClinicStreamsProgressProps {
  features: Array<{
    title: string;
    description: string;
    category: string;
  }>;
}

export const ClinicStreamsProgress = ({
  features,
}: ClinicStreamsProgressProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const droneIconRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [discoveredFeatures, setDiscoveredFeatures] = useState<number[]>([]);
  const [currentAltitude, setCurrentAltitude] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState("Connected");

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
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        gsap.set(path, {
          strokeDashoffset: pathLength * (1 - progress),
        });

        const point = path.getPointAtLength(progress * pathLength);
        gsap.set(droneIcon, {
          x: point.x - 12,
          y: point.y - 12,
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
                duration: 0.6,
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
                { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" },
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
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none"
    >
      {/* Medical Flight Path */}
      <div className="relative">
        <svg
          width="70"
          height="320"
          viewBox="0 0 70 320"
          className="overflow-visible"
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
            d="M35,20 L35,50 L35,80 L35,110 L35,140 L35,170 L35,200 L35,230 L35,260 L35,290"
            stroke="url(#medicalPathGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            filter="url(#glow)"
            className="drop-shadow-lg"
          />

          {/* Connected Workflow Points */}
          {features.map((feature, index) => {
            const y = 20 + (270 / (features.length - 1)) * index;
            const isDiscovered = discoveredFeatures.includes(index);
            const isActive = discoveredFeatures.length - 1 === index;

            return (
              <g key={index}>
                {/* Connection line to next point */}
                {index < features.length - 1 && (
                  <line
                    x1="35"
                    y1={y + 8}
                    x2="35"
                    y2={y + 270 / (features.length - 1) - 8}
                    stroke={isDiscovered ? "#00ff88" : "#e5e7eb"}
                    strokeWidth="2"
                    className="transition-all duration-500"
                  />
                )}

                {/* Workflow point circle */}
                <circle
                  cx="35"
                  cy={y}
                  r="8"
                  fill={isDiscovered ? "#00ff88" : "#f3f4f6"}
                  stroke={
                    isActive ? "#0066ff" : isDiscovered ? "#00cc66" : "#d1d5db"
                  }
                  strokeWidth={isActive ? "3" : "2"}
                  className={`transition-all duration-500 ${isDiscovered ? "drop-shadow-lg" : ""}`}
                />

                {/* Inner active indicator */}
                {isActive && (
                  <circle
                    cx="35"
                    cy={y}
                    r="4"
                    fill="#0066ff"
                    className="animate-pulse"
                  />
                )}

                {/* Feature category icon */}
                <text
                  x="35"
                  y={y + 2}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isDiscovered ? "#ffffff" : "#9ca3af"}
                >
                  {isDiscovered ? getCategoryIcon(feature.category) : "○"}
                </text>

                {/* Connection pulse effect */}
                {isDiscovered && (
                  <circle
                    cx="35"
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="#00ff88"
                    strokeWidth="1"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Workflow label */}
                <text
                  x="50"
                  y={y + 3}
                  fontSize="6"
                  fill={isDiscovered ? "#00ff88" : "#9ca3af"}
                  className="transition-all duration-500"
                >
                  {feature.title.substring(0, 8)}...
                </text>
              </g>
            );
          })}
        </svg>

        {/* Medical Drone Icon */}
        <div
          ref={droneIconRef}
          className="absolute w-6 h-6 transition-transform duration-200"
          style={{ left: 0, top: 0 }}
        >
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-lg shadow-lg flex items-center justify-center border-2 border-white">
            <div className="text-white text-xs font-bold">🚁</div>
          </div>

          {/* Medical Trail */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-transparent opacity-70"></div>
        </div>
      </div>

      {/* ClinicStreams Status Panel */}
      <div className="mt-8 bg-gradient-to-br from-white/95 to-blue-50/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-blue-200">
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <div className="text-xs font-semibold text-gray-700">
            ClinicStreams Status
          </div>
        </div>

        <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
          {currentAltitude.toLocaleString()} patients
        </div>

        <div className="text-xs text-gray-600 mt-1">
          Features: {discoveredFeatures.length}/{features.length}
        </div>

        <div className="mt-3 flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-blue-700 font-medium">
            {connectionStatus}
          </span>
        </div>

        {/* Health Metrics */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Data Integrity</span>
            <span className="text-green-600 font-medium">99.9%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Response Time</span>
            <span className="text-blue-600 font-medium">&lt;50ms</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">Uptime</span>
            <span className="text-green-600 font-medium">99.99%</span>
          </div>
        </div>
      </div>

      {/* Latest Feature Discovery */}
      {discoveredFeatures.length > 0 && (
        <div className="mt-4 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg p-3 shadow-lg max-w-52">
          <div className="text-xs font-medium opacity-90">Latest Feature</div>
          <div className="text-sm font-bold flex items-center">
            <span className="mr-2">
              {getCategoryIcon(
                features[discoveredFeatures[discoveredFeatures.length - 1]]
                  ?.category,
              )}
            </span>
            {features[discoveredFeatures[discoveredFeatures.length - 1]]?.title}
          </div>
          <div className="text-xs opacity-80 mt-1">
            {features[
              discoveredFeatures[discoveredFeatures.length - 1]
            ]?.category.toUpperCase()}
          </div>
        </div>
      )}
    </div>
  );
};
