import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface PlaneProgressIndicatorProps {
  works: Array<{
    title: string;
    description: string;
    year: string;
  }>;
}

export const PlaneProgressIndicator = ({
  works,
}: PlaneProgressIndicatorProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeIconRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [discoveredWorks, setDiscoveredWorks] = useState<number[]>([]);
  const [currentAltitude, setCurrentAltitude] = useState(0);

  useEffect(() => {
    if (!containerRef.current || !planeIconRef.current || !pathRef.current)
      return;

    const path = pathRef.current;
    const planeIcon = planeIconRef.current;
    const pathLength = path.getTotalLength();

    // Set up path animation
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Scroll-triggered flight path
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Update path drawing
        gsap.set(path, {
          strokeDashoffset: pathLength * (1 - progress),
        });

        // Move plane along path
        const point = path.getPointAtLength(progress * pathLength);
        gsap.set(planeIcon, {
          x: point.x - 10,
          y: point.y - 10,
        });

        // Update altitude display
        const altitude = Math.floor(progress * 35000 + 5000); // 5000 - 40000 feet
        setCurrentAltitude(altitude);

        // Discover works based on progress
        const workIndex = Math.floor(progress * works.length);
        if (workIndex < works.length && !discoveredWorks.includes(workIndex)) {
          setDiscoveredWorks((prev) => [...prev, workIndex]);

          // Trigger discovery animation
          const workElement = document.querySelector(`#work-${workIndex}`);
          if (workElement) {
            gsap.fromTo(
              workElement,
              { scale: 0.9, opacity: 0.7 },
              {
                scale: 1.05,
                opacity: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)",
                yoyo: true,
                repeat: 1,
              },
            );
          }
        }
      },
    });
  }, [works, discoveredWorks]);

  return (
    <div
      ref={containerRef}
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none"
    >
      {/* Flight Path */}
      <div className="relative">
        <svg
          width="60"
          height="300"
          viewBox="0 0 60 300"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <path
            ref={pathRef}
            d="M30,10 Q50,75 30,150 Q10,225 30,290"
            stroke="url(#pathGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="drop-shadow-sm"
          />

          {/* Work Markers */}
          {works.map((_, index) => {
            const y = 10 + (280 / (works.length - 1)) * index;
            const isDiscovered = discoveredWorks.includes(index);

            return (
              <g key={index}>
                <circle
                  cx="30"
                  cy={y}
                  r="4"
                  fill={isDiscovered ? "#10b981" : "#e5e7eb"}
                  stroke={isDiscovered ? "#059669" : "#9ca3af"}
                  strokeWidth="2"
                  className={`transition-all duration-500 ${isDiscovered ? "drop-shadow-md" : ""}`}
                />
                {isDiscovered && (
                  <circle
                    cx="30"
                    cy={y}
                    r="6"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1"
                    opacity="0.5"
                    className="animate-ping"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Plane Icon */}
        <div
          ref={planeIconRef}
          className="absolute w-5 h-5 transition-transform duration-200"
          style={{ left: 0, top: 0 }}
        >
          <div className="w-full h-full bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-blue-500">
            <div className="w-2 h-2 bg-blue-500 rounded-sm transform rotate-45"></div>
          </div>

          {/* Contrail */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-0.5 bg-gradient-to-r from-blue-300 to-transparent opacity-60"></div>
        </div>
      </div>

      {/* Flight Info Panel */}
      <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
        <div className="text-xs font-medium text-gray-700 mb-1">
          Flight Status
        </div>
        <div className="text-sm font-bold text-blue-600">
          {currentAltitude.toLocaleString()} ft
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Works Discovered: {discoveredWorks.length}/{works.length}
        </div>

        {/* Speed indicator */}
        <div className="mt-2 flex items-center space-x-1">
          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-600">Flying</span>
        </div>
      </div>

      {/* Current Work Display */}
      {discoveredWorks.length > 0 && (
        <div className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-3 shadow-lg max-w-48">
          <div className="text-xs font-medium opacity-90">Latest Discovery</div>
          <div className="text-sm font-bold">
            {works[discoveredWorks[discoveredWorks.length - 1]]?.title}
          </div>
        </div>
      )}
    </div>
  );
};
