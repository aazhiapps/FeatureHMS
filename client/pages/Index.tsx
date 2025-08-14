import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnhancedLoadingScreen } from "../components/EnhancedLoadingScreen";
import { AutoScrollFeatures } from "../components/AutoScrollFeatures";
import { MouseAnimationSystem, useMouseTilt, useMagneticEffect, InteractiveParticles } from "../components/MouseAnimationSystem";
import { InteractiveButton, InteractiveCard, FloatingActionButton } from "../components/InteractiveButton";
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
  const [showAutoScroll, setShowAutoScroll] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [cardInteractionMode, setCardInteractionMode] = useState<
    "scroll" | "manual"
  >("scroll");
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Show auto-scroll after a brief delay
    setTimeout(() => {
      setShowAutoScroll(true);
    }, 1000);
  }, []);

  const handleAutoScrollComplete = useCallback(() => {
    setShowAutoScroll(false);
  }, []);

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

  // Healthcare Management Modules - Based on circular design
  const features = [
    {
      id: "front-office",
      title: "Front Office Management",
      description:
        "Comprehensive front office operations including patient registration, appointment scheduling, and reception management.",
      icon: "🏢",
      color: "from-blue-500 to-cyan-500",
      category: "Front Office",
      delay: 0.1,
      angle: 0,
      radius: 180,
      benefits: [
        "Streamlined patient registration process",
        "Automated appointment scheduling",
        "Real-time front desk operations",
        "Patient check-in/check-out management",
      ],
      stats: [
        { label: "Daily Check-ins", value: "500+" },
        { label: "Efficiency Gain", value: "45%" },
      ],
    },
    {
      id: "lab-management",
      title: "Lab Management",
      description:
        "Complete laboratory information management system with test ordering, result tracking, and quality control.",
      icon: "🧪",
      color: "from-indigo-500 to-purple-500",
      category: "Laboratory",
      delay: 0.15,
      angle: 45,
      radius: 180,
      benefits: [
        "Automated test result processing",
        "Quality control monitoring",
        "Sample tracking and management",
        "Integration with diagnostic equipment",
      ],
      stats: [
        { label: "Tests/Day", value: "1.2K+" },
        { label: "Accuracy", value: "99.8%" },
      ],
    },
    {
      id: "discharge-management",
      title: "Discharge Management",
      description:
        "Comprehensive discharge planning and management system ensuring smooth patient transitions.",
      icon: "🚪",
      color: "from-green-500 to-emerald-500",
      category: "Patient Flow",
      delay: 0.2,
      angle: 90,
      radius: 180,
      benefits: [
        "Automated discharge planning",
        "Care transition coordination",
        "Follow-up appointment scheduling",
        "Medication reconciliation",
      ],
      stats: [
        { label: "Discharge Time", value: "-40%" },
        { label: "Readmission Rate", value: "-25%" },
      ],
    },
    {
      id: "accounts-management",
      title: "Accounts Management",
      description:
        "Complete financial management system with billing, accounts receivable, and revenue cycle management.",
      icon: "💰",
      color: "from-yellow-500 to-orange-500",
      category: "Financial",
      delay: 0.25,
      angle: 135,
      radius: 180,
      benefits: [
        "Automated billing processes",
        "Real-time financial reporting",
        "Insurance claims management",
        "Revenue cycle optimization",
      ],
      stats: [
        { label: "Collection Rate", value: "95%" },
        { label: "Processing Time", value: "-75%" },
      ],
    },
    {
      id: "ambulance-management",
      title: "Ambulance Management",
      description:
        "Emergency medical services coordination with real-time tracking and dispatch management.",
      icon: "🚑",
      color: "from-purple-500 to-pink-500",
      category: "Emergency",
      delay: 0.3,
      angle: 180,
      radius: 180,
      benefits: [
        "Real-time ambulance tracking",
        "Automated dispatch system",
        "Emergency response coordination",
        "Patient transport management",
      ],
      stats: [
        { label: "Response Time", value: "8 min" },
        { label: "Fleet Utilization", value: "92%" },
      ],
    },
    {
      id: "nursing-station",
      title: "Nursing Station Management",
      description:
        "Comprehensive nursing workflow management with patient monitoring and care coordination.",
      icon: "👩‍⚕️",
      color: "from-teal-500 to-blue-500",
      category: "Clinical Care",
      delay: 0.35,
      angle: 225,
      radius: 180,
      benefits: [
        "Patient care workflow optimization",
        "Medication administration tracking",
        "Vital signs monitoring",
        "Nurse-patient communication",
      ],
      stats: [
        { label: "Care Quality", value: "98%" },
        { label: "Response Time", value: "3 min" },
      ],
    },
    {
      id: "insurance-module",
      title: "Insurance Module",
      description:
        "Complete insurance management system with verification, authorization, and claims processing.",
      icon: "📋",
      color: "from-red-500 to-pink-500",
      category: "Insurance",
      delay: 0.4,
      angle: 270,
      radius: 180,
      benefits: [
        "Real-time insurance verification",
        "Pre-authorization management",
        "Claims processing automation",
        "Coverage analysis and reporting",
      ],
      stats: [
        { label: "Verification Speed", value: "30s" },
        { label: "Approval Rate", value: "94%" },
      ],
    },
    {
      id: "admission-management",
      title: "Admission Management",
      description:
        "Streamlined patient admission process with bed management and care team coordination.",
      icon: "🏥",
      color: "from-cyan-500 to-teal-500",
      category: "Patient Flow",
      delay: 0.45,
      angle: 315,
      radius: 180,
      benefits: [
        "Automated bed assignment",
        "Care team coordination",
        "Admission documentation",
        "Patient flow optimization",
      ],
      stats: [
        { label: "Admission Time", value: "15 min" },
        { label: "Bed Utilization", value: "89%" },
      ],
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
            rotationY: 0,
            rotationX: 0,
          });

          // Scroll-triggered card movement
          ScrollTrigger.create({
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 3,
            onUpdate: (self) => {
              if (cardInteractionMode === "manual") return;

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
                  rotationY: 0,
                  rotationX: 0,
                  boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)",
                  filter: "blur(0px)",
                  duration: 1.2,
                  ease: "power2.out",
                });
              } else {
                // Hide other features
                gsap.to(element, {
                  opacity: 0.25,
                  scale: 0.8,
                  z: -60,
                  rotationY: progress > featureProgress ? -20 : 20,
                  rotationX: 8,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                  filter: "blur(2px)",
                  duration: 1,
                  ease: "power2.out",
                });
              }
            },
          });

          // Enhanced hover interaction
          const handleMouseEnter = () => {
            setHoveredFeature(index);
            setCardInteractionMode("manual");

            gsap.to(element, {
              scale: 1.08,
              z: 30,
              rotationY: 0,
              rotationX: -8,
              opacity: 1,
              boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)",
              filter: "blur(0px) brightness(1.1)",
              duration: 0.6,
              ease: "back.out(1.7)",
            });

            // Add glow effect
            gsap.to(element.querySelector(".card-glow"), {
              opacity: 0.6,
              scale: 1.1,
              duration: 0.5,
              ease: "power2.out",
            });
          };

          const handleMouseLeave = () => {
            setHoveredFeature(null);

            // Return to scroll mode after delay
            setTimeout(() => {
              if (!selectedFeature) {
                setCardInteractionMode("scroll");
              }
            }, 1000);

            gsap.to(element, {
              scale: 1,
              z: 0,
              rotationY: 0,
              rotationX: 0,
              duration: 0.5,
              ease: "power2.out",
            });

            // Remove glow effect
            gsap.to(element.querySelector(".card-glow"), {
              opacity: 0,
              scale: 1,
              duration: 0.5,
              ease: "power2.out",
            });
          };

          // Click interaction
          const handleClick = () => {
            setSelectedFeature(selectedFeature === index ? null : index);
            setCardInteractionMode("manual");

            if (selectedFeature !== index) {
              // Expand selected card
              gsap.to(element, {
                scale: 1.1,
                z: 50,
                rotationY: 0,
                rotationX: -10,
                opacity: 1,
                duration: 0.8,
                ease: "back.out(1.2)",
              });

              // Hide other cards
              features.forEach((_, otherIndex) => {
                if (otherIndex !== index) {
                  const otherElement = document.getElementById(
                    `feature-${features[otherIndex].id}`,
                  );
                  if (otherElement) {
                    gsap.to(otherElement, {
                      opacity: 0.2,
                      scale: 0.8,
                      z: -100,
                      rotationY: otherIndex < index ? -30 : 30,
                      duration: 0.8,
                      ease: "power2.out",
                    });
                  }
                }
              });
            } else {
              // Return all cards to normal
              features.forEach((_, cardIndex) => {
                const cardElement = document.getElementById(
                  `feature-${features[cardIndex].id}`,
                );
                if (cardElement) {
                  gsap.to(cardElement, {
                    opacity: 1,
                    scale: 1,
                    z: 0,
                    rotationY: 0,
                    rotationX: 0,
                    duration: 0.8,
                    ease: "power2.out",
                  });
                }
              });
              setCardInteractionMode("scroll");
            }
          };

          element.addEventListener("mouseenter", handleMouseEnter);
          element.addEventListener("mouseleave", handleMouseLeave);
          element.addEventListener("click", handleClick);

          // Store cleanup functions
          element._cleanupHandlers = {
            handleMouseEnter,
            handleMouseLeave,
            handleClick,
          };
        }
      });

      // Mobile scroll-based feature visibility
      features.forEach((feature, index) => {
        const mobileElement = document.getElementById(
          `mobile-feature-${feature.id}`,
        );
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
          element.removeEventListener(
            "click",
            element._cleanupHandlers.handleClick,
          );
          delete element._cleanupHandlers;
        }
      });

      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoading]); // Only depend on isLoading to prevent re-runs while loading

  if (isLoading) {
    return (
      <EnhancedLoadingScreen
        onComplete={handleLoadingComplete}
        features={features.map((f) => ({
          id: f.id,
          title: f.title,
          icon: f.icon,
          color: f.color,
        }))}
      />
    );
  }

  if (showAutoScroll) {
    return (
      <AutoScrollFeatures
        features={features}
        isActive={showAutoScroll}
        onComplete={handleAutoScrollComplete}
      />
    );
  }

  return (
    <MouseAnimationSystem>
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
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 interactive" data-mouse-parallax="0.1">
            Get Demo
          </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-32 px-6 text-center min-h-screen flex items-center relative z-10">
          <div className="max-w-4xl mx-auto w-full">
            <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent" data-mouse-parallax="0.03">
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
        <section
          className="relative min-h-[400vh] py-20 md:py-32"
          ref={featuresRef}
        >
          {/* Section Header */}
          <div className="relative z-30 bg-gradient-to-b from-blue-900/95 to-blue-800/80 backdrop-blur-xl py-12 md:py-16 border-b border-white/30 shadow-2xl mb-20">
            <div className="text-center">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mr-4"></div>
                <span className="text-blue-300 text-sm font-medium tracking-widest uppercase">
                  Healthcare Innovation
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent ml-4"></div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white mb-4 md:mb-6 bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent px-4 leading-tight">
                Healthcare Innovation Journey
              </h2>
              <p className="text-base md:text-xl lg:text-2xl text-white/90 max-w-5xl mx-auto px-4 leading-relaxed font-light">
                Follow our medical drone as it navigates through ClinicStreams'
                revolutionary features
              </p>
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-white/30 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Three Column Layout */}
          <div className="relative min-h-[300vh] py-20">
            <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-12 gap-8 min-h-screen items-start">
              {/* Left Side - Feature Cards */}
              <div className="col-span-4 sticky top-32 max-h-screen overflow-y-auto scrollbar-hide">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Healthcare Modules
                </h3>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      id={`feature-${feature.id}`}
                      className="opacity-80 transform scale-95 cursor-pointer transition-all duration-500 hover:opacity-100 hover:scale-100 interactive"
                      data-mouse-parallax="0.05"
                    >
                      <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-xl p-4 border border-white/30 shadow-lg group hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                        {/* Glow effect overlay */}
                        <div className="card-glow absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>

                        {/* Animated border */}
                        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-teal-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'subtract' }}></div>
                        {/* Card Header */}
                        <div className="flex items-center mb-3">
                          <div
                            className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-lg shadow-lg mr-3 group-hover:scale-110 transition-all duration-300`}
                          >
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-100 transition-colors duration-300">
                              {feature.title}
                            </h4>
                            <div className="text-xs text-blue-300 uppercase tracking-wide font-medium">
                              {feature.category}
                            </div>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              hoveredFeature === index
                                ? "bg-green-400 animate-pulse"
                                : "bg-white/40"
                            }`}
                          ></div>
                        </div>

                        {/* Card Description */}
                        <p className="text-white/80 text-xs leading-relaxed mb-3 group-hover:text-white/95 transition-colors duration-300 line-clamp-2">
                          {feature.description}
                        </p>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2">
                          {feature.stats.map((stat, idx) => (
                            <div
                              key={idx}
                              className="text-center p-2 bg-white/5 rounded-md border border-white/10"
                            >
                              <div className="text-xs font-bold text-blue-400">
                                {stat.value}
                              </div>
                              <div className="text-xs text-white/60">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center - Feature Tree */}
              <div className="col-span-4 sticky top-32 flex items-center justify-center min-h-screen">
                <div className="relative">
                  {/* Circular Healthcare Management System */}
                  <div className="relative w-[500px] h-[500px]">
                    {/* Circular System Structure */}
                    <svg
                      width="500"
                      height="500"
                      viewBox="0 0 500 500"
                      className="absolute inset-0"
                    >
                      <defs>
                        <linearGradient
                          id="circularGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3b82f6"
                            stopOpacity="0.8"
                          />
                          <stop
                            offset="50%"
                            stopColor="#8b5cf6"
                            stopOpacity="0.6"
                          />
                          <stop
                            offset="100%"
                            stopColor="#10b981"
                            stopOpacity="0.8"
                          />
                        </linearGradient>
                        <linearGradient
                          id="innerCircleGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ef4444"
                            stopOpacity="0.6"
                          />
                          <stop
                            offset="50%"
                            stopColor="#f97316"
                            stopOpacity="0.4"
                          />
                          <stop
                            offset="100%"
                            stopColor="#eab308"
                            stopOpacity="0.6"
                          />
                        </linearGradient>
                        <filter id="glow">
                          <feGaussianBlur
                            stdDeviation="3"
                            result="coloredBlur"
                          />
                          <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {/* Outer Circle - Main System */}
                      <circle
                        cx="250"
                        cy="250"
                        r="200"
                        stroke="url(#circularGradient)"
                        strokeWidth="4"
                        fill="none"
                        filter="url(#glow)"
                        className="animate-spin"
                        style={{ animationDuration: "20s" }}
                      />

                      {/* Inner Circle - Core Modules */}
                      <circle
                        cx="250"
                        cy="250"
                        r="120"
                        stroke="url(#innerCircleGradient)"
                        strokeWidth="3"
                        fill="none"
                        filter="url(#glow)"
                        className="animate-spin"
                        style={{
                          animationDuration: "15s",
                          animationDirection: "reverse",
                        }}
                      />

                      {/* Connection Lines from Center */}
                      {features.map((feature, index) => {
                        const angle = (feature.angle * Math.PI) / 180;
                        const x = 250 + Math.cos(angle) * (feature.radius + 20);
                        const y = 250 + Math.sin(angle) * (feature.radius + 20);
                        const isActive = hoveredFeature === index;

                        return (
                          <line
                            key={`line-${index}`}
                            x1="250"
                            y1="250"
                            x2={x}
                            y2={y}
                            stroke={isActive ? "#10b981" : "#3b82f6"}
                            strokeWidth={isActive ? "3" : "1"}
                            opacity={isActive ? "0.8" : "0.3"}
                            className="transition-all duration-500"
                          />
                        );
                      })}

                      {/* Feature Module Nodes */}
                      {features.map((feature, index) => {
                        const angle = (feature.angle * Math.PI) / 180;
                        const x = 250 + Math.cos(angle) * (feature.radius + 20);
                        const y = 250 + Math.sin(angle) * (feature.radius + 20);
                        const isActive = hoveredFeature === index;

                        return (
                          <g key={index}>
                            {/* Module Background */}
                            <rect
                              x={x - 40}
                              y={y - 15}
                              width="80"
                              height="30"
                              rx="15"
                              fill={isActive ? "#10b981" : "#3b82f6"}
                              opacity={isActive ? "0.9" : "0.6"}
                              className="transition-all duration-500 cursor-pointer"
                              onClick={() => {
                                setHoveredFeature(index);
                                setSelectedFeature(index);
                              }}
                            />

                            {/* Module Node */}
                            <circle
                              cx={x}
                              cy={y}
                              r={isActive ? "20" : "16"}
                              fill={isActive ? "#10b981" : "#3b82f6"}
                              stroke="#ffffff"
                              strokeWidth="4"
                              className="transition-all duration-500 cursor-pointer"
                              onClick={() => {
                                setHoveredFeature(index);
                                setSelectedFeature(index);
                              }}
                            />

                            {/* Module Icon */}
                            <text
                              x={x}
                              y={y + 6}
                              textAnchor="middle"
                              fontSize="20"
                              fill="white"
                              className="pointer-events-none"
                            >
                              {feature.icon}
                            </text>

                            {/* Orbital Ring for Active Module */}
                            {isActive && (
                              <g>
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="30"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="3"
                                  opacity="0.6"
                                  className="animate-ping"
                                />
                                <circle
                                  cx={x}
                                  cy={y}
                                  r="36"
                                  fill="none"
                                  stroke="#10b981"
                                  strokeWidth="2"
                                  opacity="0.4"
                                  className="animate-pulse"
                                />
                              </g>
                            )}

                            {/* Data Flow Animation */}
                            {isActive && (
                              <g>
                                {[0, 1, 2].map((dot) => (
                                  <circle
                                    key={dot}
                                    cx={250 + Math.cos(angle) * (80 + dot * 50)}
                                    cy={250 + Math.sin(angle) * (80 + dot * 50)}
                                    r="3"
                                    fill="#10b981"
                                    className="animate-pulse"
                                    style={{
                                      animationDelay: `${dot * 0.3}s`,
                                      animationDuration: "1.5s",
                                    }}
                                  />
                                ))}
                              </g>
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* Central Healthcare Hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/40 to-green-500/40 backdrop-blur-xl border-4 border-white/50 flex items-center justify-center shadow-2xl">
                      <div className="text-5xl animate-bounce">🏥</div>

                      {/* Rotating Ring */}
                      <div
                        className="absolute inset-0 rounded-full border-3 border-blue-400/30 animate-spin"
                        style={{ animationDuration: "8s" }}
                      >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full"></div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
                        <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-purple-400 rounded-full"></div>
                        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full"></div>
                      </div>
                    </div>

                    {/* Core Modules Labels */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      {/* Telemedicine */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-red-500/80 px-3 py-1 rounded-full">
                        TELEMEDICINE
                      </div>
                      {/* Billing Modules */}
                      <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-medium text-white bg-blue-500/80 px-3 py-1 rounded-full">
                        BILLING
                      </div>
                      {/* OPD/CPOE */}
                      <div className="absolute -top-20 -left-12 text-xs font-medium text-white bg-cyan-500/80 px-3 py-1 rounded-full">
                        OPD/CPOE
                      </div>
                      {/* Vital Room */}
                      <div className="absolute -bottom-12 -left-12 text-xs font-medium text-white bg-green-500/80 px-3 py-1 rounded-full">
                        VITAL ROOM
                      </div>
                      {/* CSSD Module */}
                      <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-red-500/80 px-3 py-1 rounded-full">
                        CSSD MODULE
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Drone Explanation */}
              <div className="col-span-4 sticky top-32 max-h-screen overflow-y-auto scrollbar-hide">
                {/* Drone Display */}
                <div className="mb-6">
                  <div className="relative w-40 h-40 mx-auto">
                    {/* Main Drone */}
                    <div
                      className={`absolute inset-0 rounded-full border-3 border-blue-400/60 bg-gradient-to-br from-blue-500/30 to-green-500/30 backdrop-blur-md animate-pulse flex items-center justify-center transition-all duration-500 shadow-xl ${
                        hoveredFeature !== null
                          ? "border-green-400/80 bg-gradient-to-br from-green-500/40 to-blue-500/40 scale-110"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-5xl animate-bounce transition-all duration-500 drop-shadow-lg ${
                          hoveredFeature !== null
                            ? "scale-125 animate-pulse"
                            : ""
                        }`}
                      >
                        🚁
                      </div>
                    </div>

                    {/* Rotating Elements */}
                    <div
                      className="absolute inset-0 animate-spin"
                      style={{ animationDuration: "6s" }}
                    >
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-lg"
                          style={{
                            top: "50%",
                            left: "50%",
                            transform: `rotate(${i * 60}deg) translateX(70px) translateY(-4px)`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Feature Explanation */}
                <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                  {hoveredFeature !== null ? (
                    <div className="animate-fadeIn">
                      <div className="flex items-center mb-4">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${features[hoveredFeature].color} flex items-center justify-center text-xl shadow-lg mr-3`}
                        >
                          {features[hoveredFeature].icon}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">
                            {features[hoveredFeature].title}
                          </h3>
                          <div className="text-sm text-blue-300 uppercase tracking-wide font-medium">
                            {features[hoveredFeature].category}
                          </div>
                        </div>
                      </div>

                      <p className="text-white/90 text-base leading-relaxed mb-4">
                        {features[hoveredFeature].description}
                      </p>

                      <div className="mb-4">
                        <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                          <div className="w-1 h-5 bg-gradient-to-b from-blue-400 to-green-400 rounded-full mr-3"></div>
                          Key Benefits
                        </h4>
                        <div className="space-y-2">
                          {features[hoveredFeature].benefits
                            .slice(0, 3)
                            .map((benefit, idx) => (
                              <div key={idx} className="flex items-start">
                                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                <span className="text-white/80 text-sm leading-relaxed">
                                  {benefit}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {features[hoveredFeature].stats.map((stat, idx) => (
                          <div
                            key={idx}
                            className="text-center p-3 bg-white/10 rounded-lg border border-white/20"
                          >
                            <div className="text-lg font-bold text-blue-400 mb-1">
                              {stat.value}
                            </div>
                            <div className="text-xs text-white/70">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-4">🎯</div>
                      <h3 className="text-lg font-bold text-white mb-3">
                        Explore Healthcare Features
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mb-4">
                        Click on any feature card or tree node to see detailed
                        information about our comprehensive healthcare
                        solutions.
                      </p>
                      <div className="flex justify-center space-x-2">
                        {features.map((_, idx) => (
                          <div
                            key={idx}
                            className="w-2 h-2 bg-white/40 rounded-full animate-pulse"
                            style={{ animationDelay: `${idx * 0.2}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="py-20 md:py-32 px-4 md:px-6 text-center relative z-10 min-h-screen flex items-center bg-gradient-to-t from-blue-900/50 to-transparent">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <div className="text-4xl md:text-6xl lg:text-8xl mb-4 md:mb-6">
                🙏
              </div>
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
                <div className="text-xl md:text-2xl font-bold text-green-400 mb-1">
                  8
                </div>
                <div className="text-xs md:text-sm text-white/80">
                  Features Explored
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-blue-400 mb-1">
                  100%
                </div>
                <div className="text-xs md:text-sm text-white/80">
                  Journey Complete
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">
                  24/7
                </div>
                <div className="text-xs md:text-sm text-white/80">
                  Support Available
                </div>
              </div>
              <div className="bg-white/15 backdrop-blur-lg rounded-xl p-4 border border-white/30 hover:bg-white/20 transition-all duration-300">
                <div className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">
                  ∞
                </div>
                <div className="text-xs md:text-sm text-white/80">
                  Possibilities
                </div>
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

      {/* Interactive Particles */}
      <InteractiveParticles />
      </SmoothScrollController>
    </MouseAnimationSystem>
  );
}
