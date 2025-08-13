import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnhancedLoadingScreen } from "../components/EnhancedLoadingScreen";
import { ClinicStreamsJourney } from "../components/ClinicStreamsJourney";
import { ClinicStreamsProgress } from "../components/ClinicStreamsProgress";
import { ClinicStreamsContent } from "../components/ClinicStreamsContent";
import { SmoothScrollController } from "../components/SmoothScrollController";

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
      delay: 0.1,
    },
    {
      id: "scheduling",
      title: "Appointment Scheduling",
      description:
        "Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows.",
      icon: "📅",
      color: "from-indigo-500 to-purple-500",
      delay: 0.15,
    },
    {
      id: "records",
      title: "Electronic Medical Records",
      description:
        "Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility.",
      icon: "📋",
      color: "from-green-500 to-emerald-500",
      delay: 0.2,
    },
    {
      id: "billing",
      title: "Billing & Insurance",
      description:
        "Streamlined billing workflows with insurance verification and claims management for faster reimbursements.",
      icon: "💳",
      color: "from-yellow-500 to-orange-500",
      delay: 0.25,
    },
    {
      id: "analytics",
      title: "Real-time Analytics",
      description:
        "Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions.",
      icon: "📊",
      color: "from-purple-500 to-pink-500",
      delay: 0.3,
    },
    {
      id: "resources",
      title: "Resource Management",
      description:
        "Optimize staff schedules, inventory, and facility resources to maximize operational efficiency.",
      icon: "⏰",
      color: "from-teal-500 to-blue-500",
      delay: 0.35,
    },
    {
      id: "security",
      title: "Security Compliance",
      description:
        "HIPAA-compliant security infrastructure with role-based access control and audit trails.",
      icon: "🛡️",
      color: "from-red-500 to-pink-500",
      delay: 0.4,
    },
    {
      id: "engagement",
      title: "Patient Engagement",
      description:
        "Patient portal for appointments, test results, and secure communication with healthcare providers.",
      icon: "💬",
      color: "from-cyan-500 to-teal-500",
      delay: 0.45,
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
        <section className="relative min-h-[400vh] py-20 px-6" ref={featuresRef}>
          {/* Section Header */}
          <div className="sticky top-0 z-30 bg-gradient-to-b from-blue-900/95 to-blue-900/20 backdrop-blur-md py-12 mb-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-light text-white mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
                Healthcare Innovation Journey
              </h2>
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
                Follow our medical drone as it navigates through ClinicStreams' revolutionary features
              </p>
            </div>
          </div>

          {/* Main Features Layout */}
          <div className="relative min-h-[300vh] pt-8">
            {/* All Features on Left Side */}
            <div className="fixed left-6 top-32 z-20 w-80 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
              {features.map((feature, index) => (
                <div
                  key={feature.id}
                  id={`feature-${feature.id}`}
                  className="group bg-white/8 backdrop-blur-xl rounded-2xl p-4 border border-white/15 hover:bg-white/12 transition-all duration-500 hover:scale-102 hover:shadow-xl relative overflow-hidden"
                >
                  {/* Feature pulse effect */}
                  <div className="feature-pulse absolute inset-0 rounded-2xl border-2 border-transparent opacity-0"></div>

                  {/* Workflow connection indicator */}
                  <div className="workflow-connection absolute -right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-0 shadow-lg"></div>

                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-500 relative overflow-hidden shadow-lg flex-shrink-0`}>
                      <span className="relative z-10">{feature.icon}</span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-200 transition-colors duration-500 leading-tight">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-500 line-clamp-3">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Central 3D Drone Space */}
            <div className="absolute left-[360px] right-6 top-0 bottom-0 flex items-center justify-center pointer-events-none">
              <div className="w-full max-w-4xl h-[600px] flex items-center justify-center">
                {/* Outer Ring */}
                <div className="w-[500px] h-[500px] rounded-full border-2 border-white/20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md flex items-center justify-center relative">
                  {/* Inner Ring */}
                  <div className="w-[350px] h-[350px] rounded-full border border-white/30 bg-white/5 backdrop-blur-sm flex items-center justify-center relative">
                    {/* Core Content */}
                    <div className="text-center text-white">
                      <div className="text-5xl mb-4 animate-pulse">🚁</div>
                      <h3 className="text-xl font-light mb-2">Medical Drone Navigation</h3>
                      <p className="text-sm text-white/70 mb-6 max-w-xs">Follow the journey through our healthcare features</p>
                      
                      {/* Status Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs max-w-xs">
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                          <div className="text-green-400 font-semibold mb-1">Active</div>
                          <div className="text-white/80">System Online</div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                          <div className="text-blue-400 font-semibold mb-1">Scanning</div>
                          <div className="text-white/80">Features</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Rotating Elements */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-400 rounded-full"
                          style={{
                            top: '50%',
                            left: '50%',
                            transform: `rotate(${i * 90}deg) translateX(160px) translateY(-50%)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Pulse Rings */}
                  <div className="absolute inset-0 rounded-full border border-white/20 animate-ping opacity-20"></div>
                  <div className="absolute inset-4 rounded-full border border-white/30 animate-ping opacity-30" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>

            {/* Enhanced Floating Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10 animate-pulse"
                  style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${2 + Math.random() * 3}s`,
                  }}
                />
              ))}
            </div>

            {/* Medical Grid Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px'
              }}></div>
            </div>

            {/* Connection Lines */}
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full opacity-30">
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Connection lines from left features to center */}
                {features.map((_, index) => {
                  const startY = 15 + (index * 10); // Distribute evenly
                  return (
                    <line
                      key={index}
                      x1="22%"
                      y1={`${startY}%`}
                      x2="50%"
                      y2="50%"
                      stroke="url(#connectionGradient)"
                      strokeWidth="1"
                      filter="url(#glow)"
                      className="animate-pulse"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                  );
                })}
                
                {/* Central hub lines */}
                <circle
                  cx="50%"
                  cy="50%"
                  r="150"
                  fill="none"
                  stroke="url(#connectionGradient)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  opacity="0.3"
                  className="animate-spin"
                  style={{ animationDuration: '30s' }}
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="py-32 px-6 text-center relative z-10 min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-12">
              <div className="text-6xl md:text-8xl mb-8 animate-bounce">🙏</div>
              <h2 className="text-4xl md:text-6xl font-light text-white mb-8 bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
                Thank You for Exploring ClinicStreams
              </h2>
            </div>

            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              You've discovered all our healthcare technology solutions
            </p>

            <p className="text-lg text-white/60 mb-16 max-w-2xl mx-auto leading-relaxed">
              Ready to revolutionize your healthcare organization? Join
              thousands of providers already transforming patient care with our
              comprehensive platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-12 py-6 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg">
                Get Demo Now
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white px-12 py-6 rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 text-lg">
                Schedule Consultation
              </button>
            </div>

            {/* Journey Completion Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-green-400 mb-2">8</div>
                <div className="text-sm text-white/70">Features Explored</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-sm text-white/70">Journey Complete</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-purple-400 mb-2">2k+</div>
                <div className="text-sm text-white/70">Healthcare Providers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-cyan-400 mb-2">24/7</div>
                <div className="text-sm text-white/70">Support Available</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 px-6 border-t border-white/20 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-6">
              ClinicStreams
            </div>
            <p className="text-white/60 text-lg">
              © 2024 ClinicStreams. Revolutionizing Healthcare Technology.
            </p>
          </div>
        </footer>
      </div>
    </SmoothScrollController>
  );
}