import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ContentSection {
  id: string;
  title: string;
  description: string;
  position: number;
  icon?: string;
}

const clinicStreamsSections: ContentSection[] = [
  {
    id: "welcome",
    title: "Begin Your Medical Journey",
    description: "Scroll to explore the comprehensive healthcare platform",
    position: 0.05,
    icon: "🏥",
  },
  {
    id: "management",
    title: "Patient Management",
    description:
      "Centralized patient records with comprehensive history, treatments, and visit tracking for personalized care.",
    position: 0.15,
    icon: "👥",
  },
  {
    id: "scheduling",
    title: "Appointment Scheduling",
    description:
      "Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows.",
    position: 0.25,
    icon: "📅",
  },
  {
    id: "records",
    title: "Electronic Medical Records",
    description:
      "Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility.",
    position: 0.35,
    icon: "📋",
  },
  {
    id: "billing",
    title: "Billing & Insurance",
    description:
      "Streamlined billing workflows with insurance verification and claims management for faster reimbursements.",
    position: 0.45,
    icon: "💳",
  },
  {
    id: "analytics",
    title: "Real-time Analytics",
    description:
      "Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions.",
    position: 0.55,
    icon: "📊",
  },
  {
    id: "resources",
    title: "Resource Management",
    description:
      "Optimize staff schedules, inventory, and facility resources to maximize operational efficiency.",
    position: 0.65,
    icon: "⏰",
  },
  {
    id: "security",
    title: "Security Compliance",
    description:
      "HIPAA-compliant security infrastructure with role-based access control and audit trails.",
    position: 0.75,
    icon: "🛡️",
  },
  {
    id: "engagement",
    title: "Patient Engagement",
    description:
      "Patient portal for appointments, test results, and secure communication with healthcare providers.",
    position: 0.85,
    icon: "💬",
  },
  {
    id: "complete",
    title: "Journey Complete!",
    description: "You have discovered all 8 comprehensive healthcare features.",
    position: 0.95,
    icon: "✅",
  },
];

export const ClinicStreamsContent = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    clinicStreamsSections.forEach((section, index) => {
      const sectionElement = document.getElementById(`content-${section.id}`);
      if (!sectionElement) return;

      gsap.set(sectionElement, { opacity: 0, y: 50, scale: 0.9 });

      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const sectionProgress = section.position;
          const threshold = 0.08; // Reduced for better visibility

          // Show section when in range
          if (Math.abs(progress - sectionProgress) < threshold) {
            gsap.to(sectionElement, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: "power2.out",
            });
          } else {
            gsap.to(sectionElement, {
              opacity: 0,
              y: progress > sectionProgress ? -30 : 30,
              scale: 0.95,
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
      {clinicStreamsSections.map((section, index) => (
        <div
          key={section.id}
          id={`content-${section.id}`}
          className="absolute text-center text-white max-w-5xl px-6 md:px-8"
        >
          <div className="mb-4 md:mb-6">
            {section.icon && (
              <div className="text-6xl md:text-8xl mb-4 md:mb-6 opacity-90 animate-pulse">
                {section.icon}
              </div>
            )}

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-6 md:mb-8 leading-tight bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent px-4">
              {section.title}
            </h2>
          </div>

          {section.description && (
            <div className="bg-black/30 backdrop-blur-lg rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/30 shadow-2xl">
              <p className="text-lg md:text-xl lg:text-2xl font-light leading-relaxed opacity-95 max-w-4xl mx-auto">
                {section.description}
              </p>
            </div>
          )}

          {section.id === "complete" && (
            <div className="mt-8 md:mt-12 space-y-4 md:space-y-6">
              <div className="bg-gradient-to-r from-blue-500/30 to-green-500/30 backdrop-blur-lg rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/40 shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-green-400">8</div>
                    <div className="text-xs md:text-sm text-white/80">Features</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-blue-400">100%</div>
                    <div className="text-xs md:text-sm text-white/80">Complete</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-purple-400">24/7</div>
                    <div className="text-xs md:text-sm text-white/80">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-cyan-400">∞</div>
                    <div className="text-xs md:text-sm text-white/80">Possibilities</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full text-white font-medium tracking-wide hover:from-blue-600 hover:to-green-600 transition-all duration-300 pointer-events-auto shadow-xl hover:shadow-2xl transform hover:scale-105">
                  START YOUR JOURNEY
                </button>
                <button className="px-8 md:px-10 py-3 md:py-4 bg-white/20 backdrop-blur-sm rounded-full text-white font-light tracking-wide hover:bg-white/30 transition-all duration-300 pointer-events-auto border border-white/30">
                  SCHEDULE DEMO
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};