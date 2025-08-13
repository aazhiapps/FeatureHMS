import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnhancedLoadingScreen } from "../components/EnhancedLoadingScreen";
import { ClinicStreamsJourney } from "../components/ClinicStreamsJourney";
import { ClinicStreamsProgress } from "../components/ClinicStreamsProgress";
import { ClinicStreamsContent } from "../components/ClinicStreamsContent";
import { SmoothScrollController } from "../components/SmoothScrollController";
import { FeatureDetailsDisplay } from "../components/FeatureDetailsDisplay";

// TypeScript interface for DOM elements with cleanup handlers
declare global {
  interface HTMLElement {
    _cleanupHandlers?: {
      handleMouseEnter: () => void;
      handleMouseLeave: () => void;
    };
  }
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // ClinicStreams 3D features data for medical journey - All 8 features
  const clinicFeatures = [
    {
      title: "Patient Management",
      description:
        "Centralized patient records with comprehensive history, treatments, and visit tracking for personalized care",
      category: "management",
      position: [8, 5, -10] as [number, number, number],
    },
    {
      title: "Appointment Scheduling",
      description:
        "Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows",
      category: "scheduling",
      position: [-5, 8, -20] as [number, number, number],
    },
    {
      title: "Electronic Medical Records",
      description:
        "Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility",
      category: "records",
      position: [12, -3, -30] as [number, number, number],
    },
    {
      title: "Billing & Insurance",
      description:
        "Streamlined billing workflows with insurance verification and claims management for faster reimbursements",
      category: "billing",
      position: [-8, 6, -40] as [number, number, number],
    },
    {
      title: "Real-time Analytics",
      description:
        "Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions",
      category: "analytics",
      position: [10, 3, -50] as [number, number, number],
    },
    {
      title: "Resource Management",
      description:
        "Optimize staff schedules, inventory, and facility resources to maximize operational efficiency",
      category: "resources",
      position: [-6, 9, -60] as [number, number, number],
    },
    {
      title: "Security Compliance",
      description:
        "HIPAA-compliant security infrastructure with role-based access control and audit trails",
      category: "security",
      position: [14, -1, -70] as [number, number, number],
    },
    {
      title: "Patient Engagement",
      description:
        "Patient portal for appointments, test results, and secure communication with healthcare providers",
      category: "engagement",
      position: [-10, 7, -80] as [number, number, number],
    },
  ];

  // UI features data for cards - All 8 features from the image
  const features = [
    {
      id: "management",
      title: "Patient Management",
      description:
        "Centralized patient records with comprehensive history, treatments, and visit tracking for personalized care.",
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
      category: "Core System",
      delay: 0.1,
      benefits: [
        "Unified patient profiles with complete medical history",
        "Real-time updates across all departments",
        "Advanced search and filtering capabilities",
        "Automated care plan recommendations"
      ],
      stats: [
        { label: "Patient Records", value: "50K+" },
        { label: "Data Accuracy", value: "99.9%" }
      ]
    },
    {
      id: "scheduling",
      title: "Appointment Scheduling",
      description:
        "Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows.",
      icon: "📅",
      color: "from-indigo-500 to-purple-500",
      category: "Operations",
      delay: 0.15,
      benefits: [
        "AI-powered optimal scheduling algorithms",
        "Automated SMS and email reminders",
        "Real-time availability updates",
        "Multi-provider calendar synchronization"
      ],
      stats: [
        { label: "No-Show Rate", value: "<5%" },
        { label: "Efficiency Gain", value: "40%" }
      ]
    },
    {
      id: "records",
      title: "Electronic Medical Records",
      description:
        "Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility.",
      icon: "📋",
      color: "from-green-500 to-emerald-500",
      category: "Documentation",
      delay: 0.2,
      benefits: [
        "HIPAA-compliant secure storage",
        "Voice-to-text documentation",
        "Template-based quick entry",
        "Integrated clinical decision support"
      ],
      stats: [
        { label: "Documentation Time", value: "-60%" },
        { label: "Compliance Score", value: "100%" }
      ]
    },
    {
      id: "billing",
      title: "Billing & Insurance",
      description:
        "Streamlined billing workflows with insurance verification and claims management for faster reimbursements.",
      icon: "💳",
      color: "from-yellow-500 to-orange-500",
      category: "Financial",
      delay: 0.25,
      benefits: [
        "Automated insurance verification",
        "Real-time claims processing",
        "Denial management and appeals",
        "Revenue cycle optimization"
      ],
      stats: [
        { label: "Collection Rate", value: "95%" },
        { label: "Processing Time", value: "-75%" }
      ]
    },
    {
      id: "analytics",
      title: "Real-time Analytics",
      description:
        "Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions.",
      icon: "📊",
      color: "from-purple-500 to-pink-500",
      category: "Intelligence",
      delay: 0.3,
      benefits: [
        "Real-time performance dashboards",
        "Predictive analytics and forecasting",
        "Custom report generation",
        "Population health insights"
      ],
      stats: [
        { label: "Data Points", value: "1M+" },
        { label: "Report Speed", value: "<2s" }
      ]
    },
    {
      id: "resources",
      title: "Resource Management",
      description:
        "Optimize staff schedules, inventory, and facility resources to maximize operational efficiency.",
      icon: "⏰",
      color: "from-teal-500 to-blue-500",
      category: "Operations",
      delay: 0.35,
      benefits: [
        "Intelligent staff scheduling",
        "Equipment utilization tracking",
        "Inventory management automation",
        "Capacity planning optimization"
      ],
      stats: [
        { label: "Efficiency Gain", value: "35%" },
        { label: "Cost Reduction", value: "25%" }
      ]
    },
    {
      id: "security",
      title: "Security Compliance",
      description:
        "HIPAA-compliant security infrastructure with role-based access control and audit trails.",
      icon: "🛡️",
      color: "from-red-500 to-pink-500",
      category: "Security",
      delay: 0.4,
      benefits: [
        "End-to-end encryption",
        "Multi-factor authentication",
        "Comprehensive audit logging",
        "Regular security assessments"
      ],
      stats: [
        { label: "Security Score", value: "A+" },
        { label: "Uptime", value: "99.99%" }
      ]
    },
    {
      id: "engagement",
      title: "Patient Engagement",
      description:
        "Patient portal for appointments, test results, and secure communication with healthcare providers.",
      icon: "💬",
      color: "from-cyan-500 to-teal-500",
      category: "Communication",
      delay: 0.45,
      benefits: [
        "Secure patient messaging",
        "Online appointment booking",
        "Test results portal access",
        "Educational content delivery"
      ],
      stats: [
        { label: "Patient Satisfaction", value: "98%" },
        { label: "Portal Usage", value: "85%" }
      ]
    },
  ];

  useEffect(() => {
    if (!featuresRef.current) return;

    // Create a timeout to ensure DOM elements are ready
    const timeout = setTimeout(() => {
      // Central card movement animations
      features.forEach((feature, index) => {
        const element = document.getElementById(`feature-${feature.id}`);
        if (element) {
          // Initial state
          gsap.set(element, {
            opacity: 0,
            scale: 0.9,
            z: -100 * index,
          });

          // Scroll-triggered card movement
          ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 3,
            onUpdate: (self) => {
              const progress = self.progress;
              const featureProgress = index / (features.length - 1);
              const threshold = 0.15;
              
              // Calculate distance from current progress
              const distance = Math.abs(progress - featureProgress);
              
              if (distance < threshold) {
                // Show current feature
                const opacity = 1 - (distance / threshold) * 0.7;
                const scale = 0.9 + (1 - distance / threshold) * 0.1;
                
                gsap.to(element, {
                  opacity: opacity,
                  scale: scale,
                  z: 0,
                  duration: 0.8,
                  ease: "power2.out",
                });
              } else {
                // Hide other features
                gsap.to(element, {
                  opacity: 0.3,
                  scale: 0.85,
                  z: -50,
                  duration: 0.8,
                  ease: "power2.out",
                });
              }
            },
          });

          // Enhanced hover interaction
          const handleMouseEnter = () => {
            gsap.to(element, {
              scale: 1.02,
              z: 20,
              duration: 0.5,
              ease: "power2.out",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(element, {
              scale: 1,
              z: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          };

          element.addEventListener("mouseenter", handleMouseEnter);
          element.addEventListener("mouseleave", handleMouseLeave);

          // Store cleanup functions
          element._cleanupHandlers = { handleMouseEnter, handleMouseLeave };
        }
      });

      // Mobile scroll-based feature visibility
      features.forEach((feature, index) => {
        const mobileElement = document.getElementById(`mobile-feature-${feature.id}`);
        if (mobileElement) {
          gsap.set(mobileElement, {
            opacity: 0,
            y: 50,
            scale: 0.9,
          });

          gsap.to(mobileElement, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: mobileElement,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
            },
          });
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeout);

      // Clean up event listeners
      features.forEach((feature) => {
        const element = document.getElementById(`feature-${feature.id}`);
        if (element && element._cleanupHandlers) {
          element.removeEventListener(
            "mouseenter",
            element._cleanupHandlers.handleMouseEnter,
          );
          element.removeEventListener(
            "mouseleave",
            element._cleanupHandlers.handleMouseLeave,
          );
          delete element._cleanupHandlers;
        }
      });

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoading]); // Only depend on isLoading to prevent re-runs while loading

  if (isLoading) {
    return <EnhancedLoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <SmoothScrollController>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 relative">
        {/* 3D Medical Journey Background */}
        <ClinicStreamsJourney features={clinicFeatures} />

        {/* Progress Indicator */}
        <ClinicStreamsProgress features={clinicFeatures} />

        {/* Dynamic Feature Details Display */}
        <FeatureDetailsDisplay features={features} />

        {/* Scroll-Triggered Content */}
        <ClinicStreamsContent />
        {/* Clean Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 relative">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              ClinicStreams
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
              Get Demo
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-32 px-6 text-center min-h-screen flex items-center relative z-10">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
              ClinicStreams
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8">
              The Future of Healthcare Technology
            </p>
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
              Revolutionizing patient care through AI-powered monitoring,
              seamless telemedicine, and intelligent healthcare analytics
            </p>

            {/* Scroll Indicator */}
            <div className="animate-bounce">
              <div className="w-1 h-3 bg-white/70 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
              <p className="text-white/50 text-sm mt-2">Scroll to explore</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative min-h-[200vh] py-10 md:py-20" ref={featuresRef}>
          {/* Section Header */}
          <div className="sticky top-0 z-30 bg-gradient-to-b from-blue-900/95 to-transparent backdrop-blur-md py-6 md:py-8 border-b border-white/10">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-2 md:mb-4 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent px-4">
                Healthcare Innovation Journey
              </h2>
              <p className="text-sm md:text-lg lg:text-xl text-white/80 max-w-4xl mx-auto px-4">
                Follow our medical drone as it navigates through ClinicStreams' revolutionary features
              </p>
            </div>
          </div>

          {/* Main Features Layout */}
          <div className="relative min-h-[800px] md:min-h-[1000px] lg:min-h-[1200px]">

            {/* Central Feature Cards Display */}
            <div className="flex items-center justify-center min-h-[800px] md:min-h-[1000px] lg:min-h-[1200px] relative">
              <div className="w-full max-w-6xl mx-auto px-4 relative">
                {/* Feature Cards Container */}
                <div className="relative">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      id={`feature-${feature.id}`}
                      className="absolute inset-0 flex items-center justify-center opacity-0 transform scale-90"
                      style={{ zIndex: features.length - index }}
                    >
                      <div className="bg-white/15 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/30 shadow-2xl max-w-4xl w-full mx-4 hover:bg-white/20 transition-all duration-700 hover:scale-105 group">
                        {/* Feature Header */}
                        <div className="flex items-center mb-6 md:mb-8">
                          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl md:text-3xl shadow-xl mr-6 group-hover:scale-110 transition-transform duration-500`}>
                            <span>{feature.icon}</span>
                          </div>
                          <div>
                            <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-500">
                              {feature.title}
                            </h3>
                            <div className="text-sm md:text-base text-blue-300 uppercase tracking-wide font-medium">
                              {feature.category}
                            </div>
                          </div>
                        </div>

                        {/* Feature Description */}
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed mb-8 group-hover:text-white transition-colors duration-500">
                          {feature.description}
                        </p>

                        {/* Feature Benefits */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Key Benefits</h4>
                            <div className="space-y-3">
                              {feature.benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-start">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                  <span className="text-white/80 text-sm md:text-base">{benefit}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-4">Performance Stats</h4>
                            <div className="space-y-4">
                              {feature.stats.map((stat, idx) => (
                                <div key={idx} className="bg-white/10 rounded-xl p-4 border border-white/20">
                                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                                  <div className="text-sm text-white/70">{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-white/60">
                            Feature {index + 1} of {features.length}
                          </div>
                          <div className="flex space-x-2">
                            {features.map((_, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                                  idx === index ? 'bg-blue-400 scale-125' : 'bg-white/30'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Central 3D Drone */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
                  <div className="relative w-32 h-32 md:w-40 md:h-40">
                    {/* Drone Container */}
                    <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 bg-gradient-to-br from-blue-500/20 to-green-500/20 backdrop-blur-sm animate-pulse flex items-center justify-center">
                      <div className="text-4xl md:text-5xl animate-bounce">🚁</div>
                    </div>
                    
                    {/* Rotating Elements */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-400 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 90}deg) translateX(80px) translateY(-4px)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
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
        </section>

        {/* Thank You Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 text-center relative z-10 min-h-screen flex items-center bg-gradient-to-t from-blue-900/50 to-transparent">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <div className="text-4xl md:text-6xl lg:text-8xl mb-4 md:mb-6">🙏</div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light text-white mb-4 md:mb-6 bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent px-4">
                Thank You for Exploring ClinicStreams
              </h2>
            </div>

            <p className="text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 max-w-3xl mx-auto px-4">
              You've discovered all our healthcare technology solutions
            </p>

            <p className="text-sm md:text-base lg:text-lg text-white/70 mb-8 md:mb-12 max-w-2xl mx-auto px-4">
              Ready to revolutionize your healthcare organization? Join
              thousands of providers already transforming patient care with our
              comprehensive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center mb-8 md:mb-12 px-4">
              <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-base md:text-lg border-2 border-transparent hover:border-white/20">
                Get Demo Now
              </button>
              <button className="w-full sm:w-auto bg-white/15 backdrop-blur-md text-white px-8 md:px-10 py-4 md:py-5 rounded-full border border-white/40 hover:bg-white/25 hover:border-white/60 transition-all duration-300 text-base md:text-lg">
                Contact Sales
              </button>
            </div>

            {/* Journey Completion Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto px-4">
              <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-green-400 mb-1">8</div>
                <div className="text-xs md:text-sm text-white/80">Features Explored</div>
              </div>
              <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-blue-400 mb-1">100%</div>
                <div className="text-xs md:text-sm text-white/80">Journey Complete</div>
              </div>
              <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">24/7</div>
                <div className="text-xs md:text-sm text-white/80">Support Available</div>
              </div>
              <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">∞</div>
                <div className="text-xs md:text-sm text-white/80">Possibilities</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 md:py-12 px-4 md:px-6 border-t border-white/30 relative z-10 bg-gradient-to-t from-blue-900/30 to-transparent">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2 md:mb-4">
              ClinicStreams
            </div>
            <p className="text-xs md:text-sm text-white/70">
              © 2024 ClinicStreams. Revolutionizing Healthcare Technology.
            </p>
          </div>
        </footer>
      </div>
    </SmoothScrollController>
  );
}
