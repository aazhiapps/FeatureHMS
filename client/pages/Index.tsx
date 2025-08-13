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
      // Enhanced scroll animations for features
      features.forEach((feature, index) => {
        const element = document.getElementById(`feature-${feature.id}`);
        if (element) {
          // Initial state
          gsap.set(element, {
            opacity: 0,
            y: 100,
            scale: 0.8,
            rotationY: 15,
          });

          // Scroll-triggered animation
          gsap.to(element, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            delay: feature.delay,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: element,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse",
              onEnter: () => {
                // Add pulsing effect when discovered
                gsap.to(element, {
                  scale: 1.05,
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1,
                  ease: "power2.inOut",
                });
              },
            },
          });

          // Hover interaction with 3D rotation
          const handleMouseEnter = () => {
            gsap.to(element, {
              rotationY: -5,
              rotationX: 5,
              z: 50,
              duration: 0.5,
              ease: "power2.out",
            });
          };

          const handleMouseLeave = () => {
            gsap.to(element, {
              rotationY: 0,
              rotationX: 0,
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
            {/* All Features on Left Side */}
            <div className="hidden lg:block fixed left-2 xl:left-6 top-24 z-20 w-72 xl:w-80 space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  id={`feature-${feature.id}`}
                  className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4 xl:p-5 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
                    <div className={`w-10 h-10 xl:w-14 xl:h-14 mb-2 xl:mb-3 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-base xl:text-xl group-hover:scale-110 transition-transform duration-500 relative overflow-hidden shadow-lg`}>
                      <span className="relative z-10">{feature.icon}</span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <h3 className="text-sm xl:text-base font-bold text-white mb-2 group-hover:text-blue-200 transition-colors duration-500 line-clamp-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs xl:text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-500 line-clamp-3">
                      {feature.description}
                    </p>
                    <div className="mt-2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {feature.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Features List */}
            <div className="lg:hidden px-4 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={feature.id}
                    id={`mobile-feature-${feature.id}`}
                    className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 mb-3 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-lg shadow-lg`}>
                      <span>{feature.icon}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/70 leading-relaxed line-clamp-3">
                      {feature.description}
                    </p>
                    <div className="mt-2 text-xs text-blue-300">
                      {feature.category}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Central 3D Drone Space */}
            <div className="lg:absolute lg:left-[320px] xl:left-[420px] lg:right-0 lg:top-0 lg:bottom-0 flex items-center justify-center pointer-events-none mt-8 lg:mt-0">
              <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] xl:w-[700px] xl:h-[700px]">
                {/* Outer Ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/20 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm animate-pulse">
                  <div className="absolute inset-4 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm">
                    <div className="absolute inset-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center text-white">
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-4">🚁</div>
                        <p className="text-sm md:text-base lg:text-lg font-light px-2 mb-2">Medical Drone Navigation</p>
                        <p className="text-xs md:text-sm opacity-70 px-2 mb-4">Follow the journey through our features</p>
                    <div className="mt-3 md:mt-6 grid grid-cols-2 gap-2 md:gap-4 text-xs px-4">
                          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="text-green-400 font-bold">Active</div>
                        <div>System Online</div>
                      </div>
                          <div className="bg-white/15 backdrop-blur-sm rounded-lg p-2 border border-white/20">
                        <div className="text-blue-400 font-bold">Scanning</div>
                        <div>Features</div>
                      </div>
                    </div>
                  </div>
                    </div>
                  </div>
                </div>
                
                {/* Rotating Elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-blue-400 rounded-full opacity-60"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${i * 90}deg) translateX(${150 + i * 20}px) translateY(-6px)`,
                      }}
                    />
                  ))}
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

            {/* Connection Lines from Left Features to Center */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-30">
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                {[15, 25, 35, 45, 55, 65, 75, 85].map((y, index) => (
                  <line
                    key={index}
                    x1="22%"
                    y1={`${y}%`}
                    x2="55%"
                    y2="50%"
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    className="animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                ))}
              </svg>
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
