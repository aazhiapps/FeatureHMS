import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { MedicineWaveEffect, MedicineBurstEffect } from "./MedicineWaveEffect";

interface AutoScrollFeaturesProps {
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  }>;
  isActive: boolean;
  onComplete?: () => void;
}

export const AutoScrollFeatures = ({
  features,
  isActive,
  onComplete,
}: AutoScrollFeaturesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(false);
  const [burstPosition, setBurstPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Memoize the completion callback to prevent re-renders
  const handleComplete = useCallback(() => {
    setIsAutoScrolling(false);
    // Use setTimeout to avoid setState during render
    setTimeout(() => {
      onComplete?.();
    }, 0);
  }, [onComplete]);

  useEffect(() => {
    if (!isActive) return;

    setIsAutoScrolling(true);
    setCurrentFeatureIndex(0);

    // Auto-advance through features
    intervalRef.current = setInterval(() => {
      setCurrentFeatureIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= features.length) {
          handleComplete();
          return prev;
        }

        // Trigger medicine burst on feature change
        setBurstPosition({
          x: window.innerWidth / 2 + (Math.random() - 0.5) * 200,
          y: window.innerHeight / 2 + (Math.random() - 0.5) * 200
        });
        setBurstTrigger(prev => !prev);

        return nextIndex;
      });
    }, 3000); // 3 seconds per feature

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, features.length, handleComplete]);

  useEffect(() => {
    if (!containerRef.current) return;

    features.forEach((feature, index) => {
      const element = document.getElementById(`auto-feature-${feature.id}`);
      if (!element) return;

      if (index === currentFeatureIndex) {
        // Show current feature
        gsap.fromTo(
          element,
          {
            opacity: 0,
            scale: 0.8,
            y: 50,
            rotationY: -20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotationY: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 0.2,
          },
        );
      } else if (index < currentFeatureIndex) {
        // Hide previous features
        gsap.to(element, {
          opacity: 0,
          scale: 0.9,
          y: -30,
          rotationY: 20,
          duration: 0.6,
          ease: "power2.inOut",
        });
      } else {
        // Keep future features hidden
        gsap.set(element, {
          opacity: 0,
          scale: 0.8,
          y: 50,
          rotationY: -20,
        });
      }
    });
  }, [currentFeatureIndex, features]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-30 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-blue-800/95 backdrop-blur-lg flex items-center justify-center"
    >
      {/* Auto-scroll progress indicator */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 border border-white/30">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white font-medium text-sm">
              Auto-discovering features... {currentFeatureIndex + 1}/
              {features.length}
            </span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80 h-2 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-300"
          style={{
            width: `${((currentFeatureIndex + 1) / features.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Feature cards */}
      <div className="max-w-4xl mx-auto px-6">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            id={`auto-feature-${feature.id}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl max-w-2xl w-full text-center">
              {/* Feature icon with animation */}
              <div
                className={`w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl md:text-4xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300`}
              >
                {feature.icon}
              </div>

              {/* Feature title */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                {feature.title}
              </h2>

              {/* Feature description */}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Discovery indicator */}
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Feature Discovered</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>

              {/* Auto-scroll indicator */}
              {index < features.length - 1 && index === currentFeatureIndex && (
                <div className="mt-6 text-white/60 text-sm">
                  Next feature in 3 seconds...
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={handleComplete}
        className="absolute bottom-8 right-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 text-sm font-medium"
      >
        Skip Auto-Discovery →
      </button>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Medicine Wave Effect */}
      <MedicineWaveEffect
        isActive={isActive}
        intensity={1.3}
        particleCount={30}
      />

      {/* Medicine Burst Effect on Feature Change */}
      <MedicineBurstEffect
        trigger={burstTrigger}
        position={burstPosition}
      />
    </div>
  );
};
