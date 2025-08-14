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
  const moleculesRef = useRef<HTMLDivElement[]>([]);
  const [molecules, setMolecules] = useState<Molecule[]>([]);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  // Generate floating molecules
  useEffect(() => {
    if (!isActive) return;

    const generateMolecules = (): Molecule[] => {
      const moleculeColors = [
        "#3b82f6", // blue
        "#10b981", // green
        "#8b5cf6", // purple
        "#f59e0b", // amber
        "#ef4444", // red
        "#06b6d4", // cyan
        "#84cc16", // lime
        "#f97316", // orange
      ];

      return Array.from({ length: 25 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: 8 + Math.random() * 16,
        color: moleculeColors[Math.floor(Math.random() * moleculeColors.length)],
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 4,
      }));
    };

    setMolecules(generateMolecules());
  }, [isActive]);

  // Animate molecules
  useEffect(() => {
    if (!isActive || molecules.length === 0) return;

    const animateMolecules = () => {
      setMolecules(prev => 
        prev.map(molecule => {
          let newX = molecule.x + molecule.velocity.x;
          let newY = molecule.y + molecule.velocity.y;
          let newVelX = molecule.velocity.x;
          let newVelY = molecule.velocity.y;

          // Bounce off walls
          if (newX <= 0 || newX >= window.innerWidth - molecule.size) {
            newVelX = -newVelX;
            newX = Math.max(0, Math.min(newX, window.innerWidth - molecule.size));
          }
          if (newY <= 0 || newY >= window.innerHeight - molecule.size) {
            newVelY = -newVelY;
            newY = Math.max(0, Math.min(newY, window.innerHeight - molecule.size));
          }

          return {
            ...molecule,
            x: newX,
            y: newY,
            velocity: { x: newVelX, y: newVelY },
            rotation: molecule.rotation + molecule.rotationSpeed,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animateMolecules);
    };

    animationRef.current = requestAnimationFrame(animateMolecules);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, molecules.length]);

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

    // Animate molecules entrance
    moleculesRef.current.forEach((moleculeEl, index) => {
      if (moleculeEl) {
        gsap.fromTo(
          moleculeEl,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.02,
            ease: "back.out(1.7)",
          }
        );
      }
    });
  }, [isActive, molecules.length]);

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

      {/* Floating Molecules */}
      <div className="absolute inset-0 pointer-events-none">
        {molecules.map((molecule, index) => (
          <div
            key={molecule.id}
            ref={(el) => {
              if (el) moleculesRef.current[index] = el;
            }}
            className="absolute rounded-full shadow-lg opacity-80"
            style={{
              left: molecule.x,
              top: molecule.y,
              width: molecule.size,
              height: molecule.size,
              backgroundColor: molecule.color,
              transform: `rotate(${molecule.rotation}deg)`,
              boxShadow: `0 0 ${molecule.size}px ${molecule.color}40`,
            }}
          >
            {/* Molecule Core */}
            <div className="absolute inset-1 rounded-full bg-white/30"></div>
            
            {/* Molecule Bonds */}
            <div className="absolute top-1/2 left-1/2 w-full h-0.5 bg-white/50 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-white/50 transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        ))}
      </div>

      {/* Connection Lines between nearby molecules */}
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        {molecules.map((molecule, index) => {
          return molecules
            .slice(index + 1)
            .filter(otherMolecule => {
              const distance = Math.sqrt(
                Math.pow(molecule.x - otherMolecule.x, 2) + 
                Math.pow(molecule.y - otherMolecule.y, 2)
              );
              return distance < 150; // Only connect nearby molecules
            })
            .map((otherMolecule, otherIndex) => (
              <line
                key={`${molecule.id}-${otherMolecule.id}`}
                x1={molecule.x + molecule.size / 2}
                y1={molecule.y + molecule.size / 2}
                x2={otherMolecule.x + otherMolecule.size / 2}
                y2={otherMolecule.y + otherMolecule.size / 2}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1"
                className="animate-pulse"
              />
            ));
        })}
      </svg>

      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
    </div>
  );
};
