import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface AllSystemsActiveScreenProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number; // Duration in seconds
}

interface DNABase {
  id: number;
  x: number;
  y: number;
  type: 'A' | 'T' | 'G' | 'C';
  strand: 'top' | 'bottom';
  rotation: number;
}

export const AllSystemsActiveScreen = ({
  isActive,
  onComplete,
  duration = 4,
}: AllSystemsActiveScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dnaRef = useRef<HTMLDivElement>(null);
  const [dnaBases, setDnaBases] = useState<DNABase[]>([]);
  const [progress, setProgress] = useState(0);
  const [dnaProgress, setDnaProgress] = useState(0);
  const animationRef = useRef<number>();

  // Generate DNA structure
  useEffect(() => {
    if (!isActive) return;

    const generateDNABases = (): DNABase[] => {
      const baseTypes: ('A' | 'T' | 'G' | 'C')[] = ['A', 'T', 'G', 'C'];
      const bases: DNABase[] = [];
      const baseCount = 40; // Number of base pairs
      const baseSpacing = 20; // Distance between bases

      for (let i = 0; i < baseCount; i++) {
        const x = i * baseSpacing;
        const centerY = window.innerHeight / 2;

        // Top strand base
        const topBase = baseTypes[Math.floor(Math.random() * baseTypes.length)];
        bases.push({
          id: i * 2,
          x,
          y: centerY - 30,
          type: topBase,
          strand: 'top',
          rotation: 0,
        });

        // Bottom strand base (complementary)
        const bottomBase = topBase === 'A' ? 'T' : topBase === 'T' ? 'A' : topBase === 'G' ? 'C' : 'G';
        bases.push({
          id: i * 2 + 1,
          x,
          y: centerY + 30,
          type: bottomBase,
          strand: 'bottom',
          rotation: 0,
        });
      }

      return bases;
    };

    setDnaBases(generateDNABases());
  }, [isActive]);

  // Animate DNA helix
  useEffect(() => {
    if (!isActive || dnaBases.length === 0) return;

    const animateDNA = () => {
      setDnaProgress(prev => (prev + 2) % 360); // Continuous rotation

      setDnaBases(prev =>
        prev.map(base => ({
          ...base,
          rotation: base.rotation + (base.strand === 'top' ? 1 : -1),
        }))
      );

      animationRef.current = requestAnimationFrame(animateDNA);
    };

    animationRef.current = requestAnimationFrame(animateDNA);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, dnaBases.length]);

  // Progress animation and completion
  useEffect(() => {
    if (!isActive) return;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (duration * 10)); // Update every 100ms
        if (newProgress >= 100) {
          setTimeout(() => {
            onComplete?.();
          }, 500); // Small delay before completion
          return 100;
        }
        return newProgress;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isActive, duration, onComplete]);

  // Entrance animation
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    gsap.fromTo(
      containerRef.current,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }
    );

    // Animate DNA entrance
    if (dnaRef.current) {
      gsap.fromTo(
        dnaRef.current,
        { opacity: 0, x: -200 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          delay: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [isActive, dnaBases.length]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-30 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-blue-800/95 backdrop-blur-lg flex items-center justify-center overflow-hidden"
    >
      {/* Central Content */}
      <div className="text-center z-20">
        {/* Main Status */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Central Core */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-green-500 animate-pulse shadow-2xl">
              <div className="absolute inset-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400 flex items-center justify-center text-4xl animate-bounce">
                🏥
              </div>
            </div>
            
            {/* Orbital Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-spin" style={{ animationDuration: "8s" }}>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
            </div>
            <div className="absolute inset-4 rounded-full border-2 border-green-400/50 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }}>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
            All Systems Active
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Healthcare Platform Initialized Successfully
          </p>
        </div>

        {/* System Status Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto px-6">
          {[
            { name: "Database", icon: "💾", status: "Online" },
            { name: "Services", icon: "⚙️", status: "Running" },
            { name: "Security", icon: "🔒", status: "Protected" },
            { name: "Analytics", icon: "📊", status: "Active" },
          ].map((system, index) => (
            <div
              key={system.name}
              className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20 transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl mb-2">{system.icon}</div>
              <div className="text-sm text-white font-medium">{system.name}</div>
              <div className="text-xs text-green-400 flex items-center justify-center mt-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1 animate-pulse"></div>
                {system.status}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-white/80 text-sm mb-2">
            <span>Initialization Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-green-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => onComplete?.()}
          className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
        >
          Continue to Dashboard →
        </button>
      </div>

      {/* Horizontal DNA Double Helix */}
      <div
        ref={dnaRef}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* DNA Background Container */}
        <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
          {/* DNA Strands */}
          <svg
            width="100%"
            height="200"
            viewBox="0 0 800 200"
            className="absolute top-1/2 left-0 transform -translate-y-1/2"
            style={{ transform: `translateY(-50%) translateX(${-dnaProgress * 2}px)` }}
          >
            <defs>
              <linearGradient id="dnaGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="dnaGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* DNA Backbone - Top Strand */}
            <path
              d={Array.from({ length: 100 }, (_, i) => {
                const x = i * 8;
                const y = 60 + Math.sin((x + dnaProgress) * 0.05) * 20;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              stroke="url(#dnaGradient1)"
              strokeWidth="4"
              fill="none"
              className="drop-shadow-lg"
            />

            {/* DNA Backbone - Bottom Strand */}
            <path
              d={Array.from({ length: 100 }, (_, i) => {
                const x = i * 8;
                const y = 140 + Math.sin((x + dnaProgress + 180) * 0.05) * 20;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              stroke="url(#dnaGradient2)"
              strokeWidth="4"
              fill="none"
              className="drop-shadow-lg"
            />

            {/* Base Pairs - Connecting Lines */}
            {Array.from({ length: 50 }, (_, i) => {
              const x = i * 16;
              const topY = 60 + Math.sin((x + dnaProgress) * 0.05) * 20;
              const bottomY = 140 + Math.sin((x + dnaProgress + 180) * 0.05) * 20;
              return (
                <line
                  key={i}
                  x1={x}
                  y1={topY}
                  x2={x}
                  y2={bottomY}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="2"
                  className="animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              );
            })}
          </svg>

          {/* DNA Bases */}
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
            {dnaBases.map((base, index) => {
              const baseColors = {
                A: '#ef4444', // red
                T: '#3b82f6', // blue
                G: '#10b981', // green
                C: '#f59e0b', // amber
              };

              const helixOffset = Math.sin((base.x + dnaProgress) * 0.05) * (base.strand === 'top' ? -20 : 20);

              return (
                <div
                  key={base.id}
                  className="absolute w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-300"
                  style={{
                    left: `${base.x - 200 + (dnaProgress * 2)}px`,
                    top: `${base.y + helixOffset}px`,
                    backgroundColor: baseColors[base.type],
                    transform: `rotate(${base.rotation}deg) scale(${1 + Math.sin(dnaProgress * 0.1 + index) * 0.1})`,
                    boxShadow: `0 0 10px ${baseColors[base.type]}80`,
                    zIndex: base.strand === 'top' ? 10 : 5,
                  }}
                >
                  {base.type}
                </div>
              );
            })}
          </div>

          {/* DNA Information Flow Particles */}
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full animate-pulse"
                style={{
                  left: `${(i * 100 + dnaProgress * 3) % window.innerWidth}px`,
                  top: `${100 + Math.sin((i * 50 + dnaProgress) * 0.03) * 40}px`,
                  animationDelay: `${i * 0.3}s`,
                  boxShadow: '0 0 8px #3b82f6',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
    </div>
  );
};
