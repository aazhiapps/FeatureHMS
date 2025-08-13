import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollDrivenEffectsProps {
  children: React.ReactNode;
}

export const ScrollDrivenEffects = ({ children }: ScrollDrivenEffectsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !backgroundRef.current ||
      !progressBarRef.current
    )
      return;

    const container = containerRef.current;
    const background = backgroundRef.current;
    const progressBar = progressBarRef.current;

    // Create gradient background animation similar to Atmos sky
    gsap.to(background, {
      background:
        "linear-gradient(180deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Progress bar animation
    gsap.to(progressBar, {
      scaleX: 1,
      transformOrigin: "left center",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // Create floating elements that move with scroll
    const createFloatingElements = () => {
      const elements = [];
      for (let i = 0; i < 20; i++) {
        const element = document.createElement("div");
        element.className = "floating-particle";
        element.style.cssText = `
          position: fixed;
          width: ${Math.random() * 4 + 2}px;
          height: ${Math.random() * 4 + 2}px;
          background: rgba(255, 255, 255, ${Math.random() * 0.5 + 0.2});
          border-radius: 50%;
          left: ${Math.random() * 100}vw;
          top: ${Math.random() * 100}vh;
          pointer-events: none;
          z-index: 5;
        `;
        container.appendChild(element);
        elements.push(element);

        // Animate each particle
        gsap.to(element, {
          y: `-${Math.random() * 200 + 100}vh`,
          x: `${(Math.random() - 0.5) * 200}px`,
          opacity: 0,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          ease: "none",
          delay: Math.random() * 2,
        });
      }

      return elements;
    };

    const floatingElements = createFloatingElements();

    // Scroll velocity effect
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      // Show particles based on scroll velocity
      floatingElements.forEach((element) => {
        const opacity = Math.min(scrollVelocity * 0.01, 0.8);
        gsap.to(element, { opacity, duration: 0.1 });
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      floatingElements.forEach((element) => element.remove());
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Animated Background */}
      <div
        ref={backgroundRef}
        className="fixed inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
        }}
      />

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1">
        <div
          ref={progressBarRef}
          className="h-full bg-white origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};
