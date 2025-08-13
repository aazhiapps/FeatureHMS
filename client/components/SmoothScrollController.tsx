import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollControllerProps {
  children: React.ReactNode;
}

export const SmoothScrollController = ({ children }: SmoothScrollControllerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    // Connect Lenis with GSAP ScrollTrigger
    lenisRef.current.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);

    // Cleanup
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {children}
    </div>
  );
};
