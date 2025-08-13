import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    // Use a timeout to ensure DOM elements are ready
    const timeout = setTimeout(() => {
      clinicStreamsSections.forEach((section, index) => {
        const sectionElement = document.getElementById(`content-${section.id}`);
        if (!sectionElement) return;

        gsap.set(sectionElement, { opacity: 0, y: 50 });

        ScrollTrigger.create({
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const progress = self.progress;
            const sectionProgress = section.position;
            const threshold = 0.12;

            if (Math.abs(progress - sectionProgress) < threshold) {
              gsap.to(sectionElement, {
                opacity: 1,
                y: 0,
                duration: 1.2,
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
    }, 200);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []); // Empty dependency is OK here since clinicStreamsSections is static

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-20 pointer-events-none flex items-center justify-center"
    >
      {clinicStreamsSections.map((section, index) => (
        <div
          key={section.id}
          id={`content-${section.id}`}
          className="absolute text-center text-white max-w-3xl px-6"
        >
          <div className="mb-6">
            {section.icon && (
              <div className="text-6xl mb-4 opacity-80">{section.icon}</div>
            )}

            <h2 className="text-3xl md:text-5xl font-light mb-8 leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              {section.title}
            </h2>
          </div>

          {section.description && (
            <p className="text-lg md:text-xl font-light leading-relaxed opacity-90 max-w-2xl mx-auto">
              {section.description}
            </p>
          )}

          {section.id === "future" && (
            <div className="mt-12 space-y-4">
              <button className="mx-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 rounded-full text-white font-medium tracking-wide hover:from-blue-600 hover:to-green-600 transition-all duration-300 pointer-events-auto shadow-lg hover:shadow-xl">
                START FREE TRIAL
              </button>
              <button className="mx-2 px-8 py-4 bg-white/20 backdrop-blur-sm rounded-full text-white font-light tracking-wide hover:bg-white/30 transition-all duration-300 pointer-events-auto">
                SCHEDULE DEMO
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
