import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const circles = circlesRef.current.filter(Boolean);
    const tl = gsap.timeline({ repeat: -1 });

    // Initial setup
    gsap.set(circles, { scale: 0, opacity: 0 });

    // Animation sequence
    circles.forEach((circle, index) => {
      tl.to(circle, {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      }, index * 0.2)
      .to(circle, {
        scale: 1.1,
        duration: 0.4,
        ease: "power2.inOut",
      }, index * 0.2 + 0.6)
      .to(circle, {
        scale: 1,
        duration: 0.4,
        ease: "power2.inOut",
      }, index * 0.2 + 1);
    });

    // Complete loading after a few cycles
    const timeout = setTimeout(() => {
      tl.kill();
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete,
      });
    }, 3000);

    return () => {
      clearTimeout(timeout);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-white z-50 flex items-center justify-center"
    >
      <div className="flex items-center justify-center space-x-2">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            ref={(el) => (circlesRef.current[index] = el)}
            className="relative"
          >
            <div className="w-20 h-20 border-2 border-black rounded-full relative">
              <div className="absolute inset-2 border border-black rounded-full">
                <div className="absolute inset-2 border border-black rounded-full opacity-50">
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
