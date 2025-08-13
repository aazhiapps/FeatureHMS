import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ContentSection {
  id: string;
  title: string;
  description: string;
  position: number; // 0-1 scroll progress
}

const contentSections: ContentSection[] = [
  {
    id: "welcome",
    title: "Scroll to begin the journey",
    description: "",
    position: 0.1,
  },
  {
    id: "greeting",
    title: "Hello, passengers and welcome aboard.",
    description:
      "Please sit back, relax, and enjoy the view while we tell you some of our favourite facts about the aviation world.",
    position: 0.3,
  },
  {
    id: "fact1",
    title: "IN THE DARK",
    description:
      "Airplane lights on board are designed so that in the event of an airplane power loss we are able to evacuate the aircraft in 90 minutes.",
    position: 0.5,
  },
  {
    id: "fact2",
    title: "CREATIVE FLIGHT",
    description:
      "Just like our digital projects, every flight follows a carefully planned route with precise timing and creative problem-solving.",
    position: 0.7,
  },
  {
    id: "thankyou",
    title: "Thank you for choosing Atmos for your trip",
    description: "We hope to see you again very soon!",
    position: 0.9,
  },
];

export const AtmosContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create scroll-triggered content sections
    contentSections.forEach((section, index) => {
      const sectionElement = document.getElementById(`content-${section.id}`);
      if (!sectionElement) return;

      // Initially hide all sections
      gsap.set(sectionElement, { opacity: 0, y: 50 });

      // Create scroll trigger for each section
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const progress = self.progress;
          const sectionProgress = section.position;
          const threshold = 0.1;

          // Show section when we're close to its position
          if (Math.abs(progress - sectionProgress) < threshold) {
            gsap.to(sectionElement, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power2.out",
            });
          } else {
            gsap.to(sectionElement, {
              opacity: 0,
              y: progress > sectionProgress ? -50 : 50,
              duration: 0.8,
              ease: "power2.inOut",
            });
          }
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center"
    >
      {contentSections.map((section, index) => (
        <div
          key={section.id}
          id={`content-${section.id}`}
          className="absolute text-center text-white max-w-2xl px-6"
        >
          <div className="mb-4">
            {section.id === "fact1" && (
              <div className="text-sm font-light mb-2 opacity-70">Fact #1</div>
            )}
            <h2 className="text-2xl md:text-4xl font-light mb-6 leading-tight">
              {section.title}
            </h2>
          </div>

          {section.description && (
            <p className="text-base md:text-lg font-light leading-relaxed opacity-90 max-w-lg mx-auto">
              {section.description}
            </p>
          )}

          {section.id === "thankyou" && (
            <button className="mt-8 px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-light tracking-wide hover:bg-white/30 transition-all duration-300 pointer-events-auto">
              EXPLORE AGAIN
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
