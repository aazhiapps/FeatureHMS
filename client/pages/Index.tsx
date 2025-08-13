import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EnhancedLoadingScreen } from '../components/EnhancedLoadingScreen';
import { ClinicStreamsJourney } from '../components/ClinicStreamsJourney';
import { ClinicStreamsProgress } from '../components/ClinicStreamsProgress';
import { ClinicStreamsContent } from '../components/ClinicStreamsContent';
import { SmoothScrollController } from '../components/SmoothScrollController';

gsap.registerPlugin(ScrollTrigger);

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
      description: "Centralized patient records with comprehensive history, treatments, and visit tracking for personalized care",
      category: "management",
      position: [8, 5, -10] as [number, number, number]
    },
    {
      title: "Appointment Scheduling",
      description: "Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows",
      category: "scheduling",
      position: [-5, 8, -20] as [number, number, number]
    },
    {
      title: "Electronic Medical Records",
      description: "Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility",
      category: "records",
      position: [12, -3, -30] as [number, number, number]
    },
    {
      title: "Billing & Insurance",
      description: "Streamlined billing workflows with insurance verification and claims management for faster reimbursements",
      category: "billing",
      position: [-8, 6, -40] as [number, number, number]
    },
    {
      title: "Real-time Analytics",
      description: "Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions",
      category: "analytics",
      position: [10, 3, -50] as [number, number, number]
    },
    {
      title: "Resource Management",
      description: "Optimize staff schedules, inventory, and facility resources to maximize operational efficiency",
      category: "resources",
      position: [-6, 9, -60] as [number, number, number]
    },
    {
      title: "Security Compliance",
      description: "HIPAA-compliant security infrastructure with role-based access control and audit trails",
      category: "security",
      position: [14, -1, -70] as [number, number, number]
    },
    {
      title: "Patient Engagement",
      description: "Patient portal for appointments, test results, and secure communication with healthcare providers",
      category: "engagement",
      position: [-10, 7, -80] as [number, number, number]
    }
  ];

  // UI features data for cards - All 8 features from the image
  const features = [
    {
      id: 'management',
      title: 'Patient Management',
      description: 'Centralized patient records with comprehensive history, treatments, and visit tracking for personalized care.',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      id: 'scheduling',
      title: 'Appointment Scheduling',
      description: 'Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows.',
      icon: '📅',
      color: 'from-indigo-500 to-purple-500',
      delay: 0.15
    },
    {
      id: 'records',
      title: 'Electronic Medical Records',
      description: 'Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility.',
      icon: '📋',
      color: 'from-green-500 to-emerald-500',
      delay: 0.2
    },
    {
      id: 'billing',
      title: 'Billing & Insurance',
      description: 'Streamlined billing workflows with insurance verification and claims management for faster reimbursements.',
      icon: '💳',
      color: 'from-yellow-500 to-orange-500',
      delay: 0.25
    },
    {
      id: 'analytics',
      title: 'Real-time Analytics',
      description: 'Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions.',
      icon: '📊',
      color: 'from-purple-500 to-pink-500',
      delay: 0.3
    },
    {
      id: 'resources',
      title: 'Resource Management',
      description: 'Optimize staff schedules, inventory, and facility resources to maximize operational efficiency.',
      icon: '⏰',
      color: 'from-teal-500 to-blue-500',
      delay: 0.35
    },
    {
      id: 'security',
      title: 'Security Compliance',
      description: 'HIPAA-compliant security infrastructure with role-based access control and audit trails.',
      icon: '🛡️',
      color: 'from-red-500 to-pink-500',
      delay: 0.4
    },
    {
      id: 'engagement',
      title: 'Patient Engagement',
      description: 'Patient portal for appointments, test results, and secure communication with healthcare providers.',
      icon: '💬',
      color: 'from-cyan-500 to-teal-500',
      delay: 0.45
    }
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
                  ease: "power2.inOut"
                });
              }
            }
          });

          // Hover interaction with 3D rotation
          const handleMouseEnter = () => {
            gsap.to(element, {
              rotationY: -5,
              rotationX: 5,
              z: 50,
              duration: 0.5,
              ease: "power2.out"
            });
          };

          const handleMouseLeave = () => {
            gsap.to(element, {
              rotationY: 0,
              rotationX: 0,
              z: 0,
              duration: 0.5,
              ease: "power2.out"
            });
          };

          element.addEventListener('mouseenter', handleMouseEnter);
          element.addEventListener('mouseleave', handleMouseLeave);

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
          element.removeEventListener('mouseenter', element._cleanupHandlers.handleMouseEnter);
          element.removeEventListener('mouseleave', element._cleanupHandlers.handleMouseLeave);
          delete element._cleanupHandlers;
        }
      });

      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
            Revolutionizing patient care through AI-powered monitoring, seamless telemedicine, and intelligent healthcare analytics
          </p>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto relative">
              <div className="w-1 h-3 bg-white/70 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
            </div>
            <p className="text-white/50 text-sm mt-2">Scroll to explore</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
              Explore Our Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Follow the medical drone journey to discover how ClinicStreams is transforming healthcare delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                id={`feature-${feature.id}`}
                className="group relative opacity-0"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20 overflow-hidden min-h-[280px] flex flex-col">
                  {/* 3D Discovery Indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded transform rotate-45"></div>
                    </div>
                    <div className="text-xs text-white/60 mt-1 text-center">3D View</div>
                  </div>

                  {/* Feature Icon */}
                  <div className={`w-12 h-12 mb-4 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 relative overflow-hidden flex-shrink-0`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {feature.icon}
                  </div>

                  {/* Feature Content */}
                  <h3 className="text-lg md:text-xl font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300 flex-grow">
                    {feature.description}
                  </p>

                  {/* Discovery Status */}
                  <div className="mt-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Discovered by Medical Drone</span>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-20 px-6 text-center relative z-10 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <div className="text-6xl md:text-8xl mb-6">🙏</div>
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6 bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent">
              Thank You for Exploring ClinicStreams
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            You've discovered all our healthcare technology solutions
          </p>

          <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
            Ready to revolutionize your healthcare organization? Join thousands of providers already transforming patient care with our comprehensive platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-10 py-5 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg">
              Get Demo Now
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-10 py-5 rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300 text-lg">
              Start Free Trial
            </button>
          </div>

          {/* Journey Completion Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-400">8</div>
              <div className="text-sm text-white/70">Features Explored</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-400">100%</div>
              <div className="text-sm text-white/70">Journey Complete</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-purple-400">2k+</div>
              <div className="text-sm text-white/70">Happy Providers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <div className="text-sm text-white/70">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            ClinicStreams
          </div>
          <p className="text-white/60">
            © 2024 ClinicStreams. Revolutionizing Healthcare Technology.
          </p>
        </div>
      </footer>
      </div>
    </SmoothScrollController>
  );
}
