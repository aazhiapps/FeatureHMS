import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const AtmosEnhancedEffects = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create dynamic gradient background that changes with scroll
    const gradientSteps = [
      'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)', // Light gray
      'linear-gradient(180deg, #dbeafe 0%, #93c5fd 50%, #3b82f6 100%)', // Blue
      'linear-gradient(180deg, #fef3c7 0%, #fcd34d 50%, #f59e0b 100%)', // Yellow
      'linear-gradient(180deg, #fce7f3 0%, #f9a8d4 50%, #ec4899 100%)', // Pink
      'linear-gradient(180deg, #f3e8ff 0%, #c4b5fd 50%, #8b5cf6 100%)', // Purple
    ];

    // Animate background color changes
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const progress = self.progress;
        const stepIndex = Math.floor(progress * (gradientSteps.length - 1));
        const stepProgress = (progress * (gradientSteps.length - 1)) % 1;
        
        const currentGradient = gradientSteps[stepIndex];
        const nextGradient = gradientSteps[Math.min(stepIndex + 1, gradientSteps.length - 1)];
        
        document.body.style.background = currentGradient;
      }
    });

    // Create velocity-based wind particles
    let particles: HTMLElement[] = [];
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 20 + 10}px;
        background: rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2});
        left: ${Math.random() * 100}vw;
        top: 100vh;
        pointer-events: none;
        z-index: 5;
        border-radius: 2px;
        transform: rotate(${Math.random() * 360}deg);
      `;
      
      document.body.appendChild(particle);
      
      // Animate particle
      gsap.to(particle, {
        y: -window.innerHeight - 100,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 720,
        duration: Math.random() * 2 + 1,
        ease: "none",
        onComplete: () => {
          particle.remove();
          particles = particles.filter(p => p !== particle);
        }
      });
      
      return particle;
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = Math.abs(currentScrollY - lastScrollY);
      lastScrollY = currentScrollY;

      // Create particles based on scroll velocity
      if (scrollVelocity > 5 && particles.length < 20) {
        const numParticles = Math.min(Math.floor(scrollVelocity / 10), 5);
        for (let i = 0; i < numParticles; i++) {
          particles.push(createParticle());
        }
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Create floating ambient elements
    const createAmbientElements = () => {
      const elements = [];
      for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.style.cssText = `
          position: fixed;
          width: ${Math.random() * 8 + 4}px;
          height: ${Math.random() * 8 + 4}px;
          background: rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1});
          border-radius: 50%;
          left: ${Math.random() * 100}vw;
          top: ${Math.random() * 100}vh;
          pointer-events: none;
          z-index: 3;
        `;
        
        document.body.appendChild(element);
        elements.push(element);

        // Floating animation
        gsap.to(element, {
          x: `+=${(Math.random() - 0.5) * 100}`,
          y: `+=${(Math.random() - 0.5) * 100}`,
          duration: Math.random() * 10 + 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // Opacity pulsing
        gsap.to(element, {
          opacity: Math.random() * 0.8 + 0.2,
          duration: Math.random() * 3 + 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
      return elements;
    };

    const ambientElements = createAmbientElements();

    // Section-based lighting effects
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          // Add subtle glow effect to current section
          gsap.to(section, {
            boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1)',
            duration: 1,
            ease: "power2.out",
          });
        },
        onLeave: () => {
          gsap.to(section, {
            boxShadow: 'none',
            duration: 1,
            ease: "power2.out",
          });
        },
        onEnterBack: () => {
          gsap.to(section, {
            boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.1)',
            duration: 1,
            ease: "power2.out",
          });
        },
        onLeaveBack: () => {
          gsap.to(section, {
            boxShadow: 'none',
            duration: 1,
            ease: "power2.out",
          });
        },
      });
    });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      particles.forEach(particle => particle.remove());
      ambientElements.forEach(element => element.remove());
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return <div ref={containerRef} />;
};
