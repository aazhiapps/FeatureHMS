import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  benefits: string[];
  stats: {
    label: string;
    value: string;
  }[];
}

interface FeatureDetailsDisplayProps {
  features: Feature[];
}

export const FeatureDetailsDisplay = ({ features }: FeatureDetailsDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 3,
      onUpdate: (self) => {
        const scrollProgress = self.progress;
        setProgress(scrollProgress);

        // Calculate which feature should be active based on scroll progress
        const featureIndex = Math.floor(scrollProgress * features.length);
        const clampedIndex = Math.min(featureIndex, features.length - 1);
        
        if (clampedIndex >= 0 && features[clampedIndex] !== currentFeature) {
          setCurrentFeature(features[clampedIndex]);
          
          // Animate feature change
          const detailsElement = containerRef.current;
          if (detailsElement) {
            gsap.fromTo(detailsElement, 
              { opacity: 0, scale: 0.95, y: 20 },
              { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power2.out" }
            );
          }
        }
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [features, currentFeature]);

  if (!currentFeature) return null;

  return (
    <div
      ref={containerRef}
      className="hidden xl:block fixed right-4 2xl:right-8 top-1/2 transform -translate-y-1/2 z-30 w-80 2xl:w-96 pointer-events-none"
    >
      {/* Main Feature Details Card */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl 2xl:rounded-3xl p-4 2xl:p-8 border border-white/20 shadow-2xl">
        {/* Feature Header */}
        <div className="flex items-center mb-4 2xl:mb-6">
          <div className={`w-12 h-12 2xl:w-16 2xl:h-16 rounded-xl 2xl:rounded-2xl bg-gradient-to-r ${currentFeature.color} flex items-center justify-center text-lg 2xl:text-2xl shadow-lg mr-3 2xl:mr-4`}>
            {currentFeature.icon}
          </div>
          <div>
            <h3 className="text-lg 2xl:text-2xl font-bold text-white mb-1 line-clamp-2">
              {currentFeature.title}
            </h3>
            <div className="text-xs 2xl:text-sm text-blue-300 uppercase tracking-wide font-medium">
              {currentFeature.category}
            </div>
          </div>
        </div>

        {/* Feature Description */}
        <p className="text-white/80 text-sm 2xl:text-base leading-relaxed mb-4 2xl:mb-6 line-clamp-4">
          {currentFeature.description}
        </p>

        {/* Key Benefits */}
        <div className="mb-4 2xl:mb-6">
          <h4 className="text-base 2xl:text-lg font-semibold text-white mb-2 2xl:mb-3">Key Benefits</h4>
          <div className="space-y-1 2xl:space-y-2">
            {currentFeature.benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 bg-green-400 rounded-full mt-1.5 2xl:mt-2 mr-2 2xl:mr-3 flex-shrink-0"></div>
                <span className="text-white/70 text-xs 2xl:text-sm line-clamp-2">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Stats */}
        <div className="grid grid-cols-2 gap-2 2xl:gap-4 mb-4 2xl:mb-6">
          {currentFeature.stats.map((stat, index) => (
            <div key={index} className="bg-white/5 rounded-lg 2xl:rounded-xl p-2 2xl:p-3 border border-white/10">
              <div className="text-lg 2xl:text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-white/60 line-clamp-2">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Progress Indicator */}
        <div className="mb-3 2xl:mb-4">
          <div className="flex justify-between text-xs 2xl:text-sm text-white/60 mb-1 2xl:mb-2">
            <span>Journey Progress</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-1.5 2xl:h-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-green-400 h-1.5 2xl:h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Feature Navigation */}
        <div className="flex justify-between items-center">
          <div className="text-xs 2xl:text-sm text-white/60">
            Feature {features.findIndex(f => f.id === currentFeature.id) + 1} of {features.length}
          </div>
          <div className="flex space-x-1">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full transition-all duration-500 ${
                  index === features.findIndex(f => f.id === currentFeature.id)
                    ? 'bg-blue-400 scale-125'
                    : 'bg-white/30'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Drone Connection Line */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
        <svg width="60" height="4" viewBox="0 0 60 4" className="2xl:w-[100px] overflow-visible">
          <defs>
            <linearGradient id="connectionLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <line 
            x1="0" y1="2" x2="60" y2="2" 
            stroke="url(#connectionLine)" 
            strokeWidth="2" 
            className="animate-pulse"
          />
          <circle cx="55" cy="2" r="2" fill="#10b981" className="2xl:r-3 2xl:cx-95 animate-ping" />
        </svg>
      </div>

      {/* Floating Status Indicator */}
      <div className="absolute -top-2 -right-2 2xl:-top-4 2xl:-right-4 bg-green-500 text-white text-xs px-2 2xl:px-3 py-1 rounded-full font-medium animate-pulse">
        ACTIVE
      </div>
    </div>
  );
};