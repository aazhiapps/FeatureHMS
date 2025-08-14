import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";

interface FeaturesOverlayProps {
  features: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
  }>;
  isVisible: boolean;
  onComplete?: () => void;
}

export const FeaturesOverlay = ({
  features,
  isVisible,
  onComplete,
}: FeaturesOverlayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleComplete = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    // Fade out animation before completing
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          onComplete?.();
        },
      });
    } else {
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    if (!isVisible) return;

    setCurrentFeatureIndex(0);
    setProgress(0);

    // Fade in animation
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" },
      );
    }

    // Calculate timing: 5 seconds total for all features
    const timePerFeature = 5000 / features.length;

    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / (5000 / 50); // Update every 50ms
        if (newProgress >= 100) {
          if (progressIntervalRef.current)
            clearInterval(progressIntervalRef.current);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Feature cycling
    intervalRef.current = setInterval(() => {
      setCurrentFeatureIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex >= features.length) {
          return prev; // Stay on last feature
        }
        return nextIndex;
      });
    }, timePerFeature);

    // Auto-complete after 5 seconds
    const completeTimeout = setTimeout(() => {
      handleComplete();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
      clearTimeout(completeTimeout);
    };
  }, [isVisible, features.length, handleComplete]);

  useEffect(() => {
    if (!containerRef.current) return;

    features.forEach((feature, index) => {
      const element = document.getElementById(`overlay-feature-${feature.id}`);
      if (!element) return;

      if (index === currentFeatureIndex) {
        // Show current feature
        gsap.fromTo(
          element,
          {
            opacity: 0,
            scale: 0.9,
            y: 20,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
        );
      } else {
        // Hide other features
        gsap.to(element, {
          opacity: 0,
          scale: 0.9,
          y: index < currentFeatureIndex ? -20 : 20,
          duration: 0.3,
          ease: "power2.inOut",
        });
      }
    });
  }, [currentFeatureIndex, features]);

  if (!isVisible) return null;

  const currentFeature = features[currentFeatureIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center"
    >
      {/* Features overlay card */}
      <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/30 shadow-2xl max-w-lg w-full mx-4">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm font-medium">
              Discovering Features
            </span>
            <span className="text-white/60 text-xs">
              {currentFeatureIndex + 1}/{features.length}
            </span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Feature content */}
        <div className="text-center relative min-h-[200px] flex items-center justify-center">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              id={`overlay-feature-${feature.id}`}
              className="absolute inset-0 flex flex-col items-center justify-center opacity-0"
            >
              {/* Feature icon */}
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl shadow-lg`}
              >
                {feature.icon}
              </div>

              {/* Feature title */}
              <h3 className="text-xl font-bold text-white mb-2">
                {feature.title}
              </h3>

              {/* Feature description */}
              <p className="text-sm text-white/80 leading-relaxed px-2">
                {feature.description}
              </p>

              {/* Discovery indicator */}
              <div className="flex items-center justify-center space-x-2 text-green-400 mt-4">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs font-medium">Discovered</span>
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Skip button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleComplete}
            className="text-white/70 hover:text-white text-xs underline transition-colors duration-200"
          >
            Skip Discovery
          </button>
        </div>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1.5 + Math.random() * 1}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
