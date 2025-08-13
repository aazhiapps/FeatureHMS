import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollJourneyProps {
  children: React.ReactNode;
}

export const ScrollJourney = ({ children }: ScrollJourneyProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pathRef.current || !progressRef.current) return;

    const container = containerRef.current;
    const path = pathRef.current;
    const progress = progressRef.current;

    // Create smooth scroll journey path
    const pathLength = path.getTotalLength();
    
    // Set initial state
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    // Animate path drawing based on scroll
    gsap.to(path, {
      strokeDashoffset: 0,
      scrollTrigger: {
        trigger: container,
        start: "top center",
        end: "bottom center",
        scrub: 1,
        onUpdate: (self) => {
          // Update progress indicator
          const progressValue = self.progress * 100;
          gsap.set(progress, { width: `${progressValue}%` });
        }
      }
    });

    // Create floating journey markers
    const createJourneyMarkers = () => {
      const markers = [];
      const sections = ['Work', 'About', 'Contact'];
      
      sections.forEach((section, index) => {
        const marker = document.createElement('div');
        marker.className = 'journey-marker';
        marker.innerHTML = `
          <div class="w-4 h-4 bg-white rounded-full border-2 border-black transform -translate-x-1/2 -translate-y-1/2"></div>
          <span class="ml-4 text-sm font-medium">${section}</span>
        `;
        marker.style.cssText = `
          position: fixed;
          right: 2rem;
          top: ${30 + index * 20}%;
          display: flex;
          align-items: center;
          opacity: 0;
          z-index: 20;
          pointer-events: none;
        `;
        
        container.appendChild(marker);
        markers.push(marker);

        // Animate marker appearance
        gsap.to(marker, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: `#${section.toLowerCase()}`,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          }
        });
      });

      return markers;
    };

    const markers = createJourneyMarkers();

    // Add smooth camera-like movement to content
    const sections = container.querySelectorAll('section');
    sections.forEach((section, index) => {
      gsap.to(section, {
        y: -50,
        opacity: 0.95,
        scale: 0.98,
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        }
      });
    });

    // Create depth of field effect
    const createDepthEffect = () => {
      const sections = Array.from(container.querySelectorAll('section'));
      
      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            const progress = self.progress;
            const blur = Math.abs(0.5 - progress) * 4;
            gsap.set(section, {
              filter: `blur(${blur}px)`,
              scale: 1 - Math.abs(0.5 - progress) * 0.05,
            });
          }
        });
      });
    };

    createDepthEffect();

    // Cleanup
    return () => {
      markers.forEach(marker => marker.remove());
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Journey Path Visualization */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-30 pointer-events-none">
        <svg width="4" height="200" viewBox="0 0 4 200">
          <path
            ref={pathRef}
            d="M2,0 Q2,50 2,100 Q2,150 2,200"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-black/10 z-50">
        <div
          ref={progressRef}
          className="h-full bg-black transition-all duration-300 ease-out"
          style={{ width: '0%' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Ambient Particles */}
      <div className="fixed inset-0 pointer-events-none z-5">
        {Array.from({ length: 50 }).map((_, i) => (
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
    </div>
  );
};
