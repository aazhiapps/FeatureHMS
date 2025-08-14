import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnhancedLoadingScreen } from "../components/EnhancedLoadingScreen";
import { AutoScrollFeatures } from "../components/AutoScrollFeatures";
import { AnimatedHeader } from "../components/AnimatedHeader";
import { EnhancedHeroSection } from "../components/EnhancedHeroSection";
import { ModernFeaturesSection } from "../components/ModernFeaturesSection";
import { MouseAnimationSystem } from "../components/MouseAnimationSystem";
import { MedicineWaveEffect } from "../components/MedicineWaveEffect";

gsap.registerPlugin(ScrollTrigger);

interface HealthcareModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'outer' | 'inner';
  angle: number;
  benefits: string[];
  stats: { label: string; value: string }[];
}

export default function Index() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAutoScroll, setShowAutoScroll] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [hoveredModule, setHoveredModule] = useState<string | null>(null);
  const [interactionMode, setInteractionMode] = useState<'scroll' | 'manual'>('scroll');
  const mainRef = useRef<HTMLDivElement>(null);
  const circularSystemRef = useRef<HTMLDivElement>(null);
  const droneRef = useRef<HTMLDivElement>(null);

  const healthcareModules: HealthcareModule[] = [
    {
      id: 'front-office',
      title: 'Front Office Management',
      description: 'Streamline patient registration, appointment scheduling, and front desk operations with intelligent workflow automation.',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-500',
      category: 'outer',
      angle: 0,
      benefits: ['Patient Registration', 'Appointment Booking', 'Insurance Verification', 'Queue Management'],
      stats: [{ label: 'Efficiency Gain', value: '45%' }, { label: 'Wait Time Reduction', value: '60%' }]
    },
    {
      id: 'lab-management',
      title: 'Lab Management',
      description: 'Complete laboratory information system with sample tracking, result management, and quality control protocols.',
      icon: '🧪',
      color: 'from-purple-500 to-indigo-500',
      category: 'outer',
      angle: 45,
      benefits: ['Sample Tracking', 'Result Management', 'Quality Control', 'Report Generation'],
      stats: [{ label: 'Processing Speed', value: '3x Faster' }, { label: 'Accuracy Rate', value: '99.8%' }]
    },
    {
      id: 'discharge-management',
      title: 'Discharge Management',
      description: 'Efficient patient discharge planning with medication reconciliation, follow-up scheduling, and care coordination.',
      icon: '🚪',
      color: 'from-green-500 to-emerald-500',
      category: 'outer',
      angle: 90,
      benefits: ['Discharge Planning', 'Medication Review', 'Follow-up Care', 'Care Coordination'],
      stats: [{ label: 'Discharge Time', value: '40% Faster' }, { label: 'Readmission Rate', value: '25% Lower' }]
    },
    {
      id: 'accounts-management',
      title: 'Accounts Management',
      description: 'Comprehensive financial management with billing automation, revenue cycle optimization, and financial reporting.',
      icon: '💰',
      color: 'from-yellow-500 to-orange-500',
      category: 'outer',
      angle: 135,
      benefits: ['Automated Billing', 'Revenue Tracking', 'Financial Reports', 'Payment Processing'],
      stats: [{ label: 'Revenue Increase', value: '30%' }, { label: 'Collection Rate', value: '95%' }]
    },
    {
      id: 'ambulance-management',
      title: 'Ambulance Management',
      description: 'Emergency medical services coordination with GPS tracking, resource allocation, and response optimization.',
      icon: '🚑',
      color: 'from-red-500 to-pink-500',
      category: 'outer',
      angle: 180,
      benefits: ['GPS Tracking', 'Resource Allocation', 'Response Optimization', 'Emergency Protocols'],
      stats: [{ label: 'Response Time', value: '8 Minutes' }, { label: 'Fleet Efficiency', value: '85%' }]
    },
    {
      id: 'nursing-station',
      title: 'Nursing Station Management',
      description: 'Clinical workflow management with medication administration, patient monitoring, and care documentation.',
      icon: '👩‍⚕️',
      color: 'from-teal-500 to-cyan-500',
      category: 'outer',
      angle: 225,
      benefits: ['Medication Management', 'Patient Monitoring', 'Care Documentation', 'Shift Management'],
      stats: [{ label: 'Medication Errors', value: '90% Reduction' }, { label: 'Documentation Time', value: '50% Less' }]
    },
    {
      id: 'insurance-module',
      title: 'Insurance Module',
      description: 'Insurance verification, claims processing, and coverage management with real-time eligibility checking.',
      icon: '📋',
      color: 'from-indigo-500 to-purple-500',
      category: 'outer',
      angle: 270,
      benefits: ['Eligibility Verification', 'Claims Processing', 'Coverage Analysis', 'Prior Authorization'],
      stats: [{ label: 'Claim Approval', value: '92%' }, { label: 'Processing Time', value: '24 Hours' }]
    },
    {
      id: 'admission-management',
      title: 'Admission Management',
      description: 'Patient admission workflows with bed management, pre-admission planning, and clinical assessments.',
      icon: '🏥',
      color: 'from-cyan-500 to-blue-500',
      category: 'outer',
      angle: 315,
      benefits: ['Bed Management', 'Pre-admission Planning', 'Clinical Assessment', 'Transfer Coordination'],
      stats: [{ label: 'Bed Utilization', value: '95%' }, { label: 'Admission Time', value: '30% Faster' }]
    },
    // Inner circle modules
    {
      id: 'telemedicine',
      title: 'Telemedicine',
      description: 'Virtual care platform with video consultations, remote monitoring, and digital health tools.',
      icon: '💻',
      color: 'from-emerald-500 to-green-500',
      category: 'inner',
      angle: 0,
      benefits: ['Video Consultations', 'Remote Monitoring', 'Digital Prescriptions', 'Virtual Triage'],
      stats: [{ label: 'Patient Satisfaction', value: '96%' }, { label: 'Access Improvement', value: '200%' }]
    },
    {
      id: 'billing-modules',
      title: 'Billing Modules',
      description: 'Advanced billing system with automated coding, insurance claims, and revenue cycle management.',
      icon: '💳',
      color: 'from-orange-500 to-red-500',
      category: 'inner',
      angle: 90,
      benefits: ['Automated Coding', 'Claims Management', 'Revenue Analytics', 'Payment Gateway'],
      stats: [{ label: 'Coding Accuracy', value: '98%' }, { label: 'Revenue Cycle', value: '15 Days' }]
    },
    {
      id: 'opd-cpoe',
      title: 'OPD/CPOE',
      description: 'Outpatient department management with computerized physician order entry and clinical decision support.',
      icon: '📝',
      color: 'from-blue-500 to-indigo-500',
      category: 'inner',
      angle: 180,
      benefits: ['Order Entry', 'Clinical Decisions', 'Drug Interactions', 'Protocol Compliance'],
      stats: [{ label: 'Order Accuracy', value: '99.5%' }, { label: 'Safety Alerts', value: '15,000/month' }]
    },
    {
      id: 'vital-room',
      title: 'Vital Room Management',
      description: 'Critical care monitoring with real-time vital signs, alerts, and emergency response protocols.',
      icon: '❤️',
      color: 'from-red-500 to-orange-500',
      category: 'inner',
      angle: 270,
      benefits: ['Real-time Monitoring', 'Emergency Alerts', 'Vital Trends', 'Critical Care Protocols'],
      stats: [{ label: 'Response Time', value: '30 Seconds' }, { label: 'Alert Accuracy', value: '99.9%' }]
    }
  ];

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    setTimeout(() => {
      setShowAutoScroll(true);
    }, 1000);
  }, []);

  const handleAutoScrollComplete = useCallback(() => {
    setShowAutoScroll(false);
  }, []);

  const handleModuleClick = (moduleId: string) => {
    setSelectedModule(moduleId);
    setInteractionMode('manual');
    
    // Animate selection
    const moduleElement = document.getElementById(`module-${moduleId}`);
    if (moduleElement) {
      gsap.fromTo(moduleElement,
        { scale: 1 },
        { scale: 1.2, duration: 0.3, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }
  };

  const handleModuleHover = (moduleId: string | null) => {
    setHoveredModule(moduleId);
    
    if (moduleId) {
      // Animate hover effect
      const moduleElement = document.getElementById(`module-${moduleId}`);
      if (moduleElement) {
        gsap.to(moduleElement, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    } else {
      // Reset all modules
      healthcareModules.forEach(module => {
        const moduleElement = document.getElementById(`module-${module.id}`);
        if (moduleElement && module.id !== selectedModule) {
          gsap.to(moduleElement, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });
    }
  };

  useEffect(() => {
    if (!circularSystemRef.current || isLoading || showAutoScroll) return;

    // Initialize circular system animations
    const initializeCircularAnimations = () => {
      // Animate system entrance
      gsap.fromTo(circularSystemRef.current,
        { scale: 0, opacity: 0, rotation: -180 },
        { scale: 1, opacity: 1, rotation: 0, duration: 2, ease: "back.out(1.7)" }
      );

      // Animate modules entrance with stagger
      healthcareModules.forEach((module, index) => {
        const moduleElement = document.getElementById(`module-${module.id}`);
        if (moduleElement) {
          gsap.fromTo(moduleElement,
            { scale: 0, opacity: 0 },
            { 
              scale: 1, 
              opacity: 1, 
              duration: 0.8, 
              delay: 0.5 + index * 0.1,
              ease: "back.out(1.7)" 
            }
          );
        }
      });

      // Start orbital animations
      const outerOrbit = document.querySelector('.outer-orbit');
      const innerOrbit = document.querySelector('.inner-orbit');
      
      if (outerOrbit) {
        gsap.to(outerOrbit, {
          rotation: 360,
          duration: 60,
          repeat: -1,
          ease: "none"
        });
      }
      
      if (innerOrbit) {
        gsap.to(innerOrbit, {
          rotation: -360,
          duration: 45,
          repeat: -1,
          ease: "none"
        });
      }
    };

    const timeout = setTimeout(initializeCircularAnimations, 500);
    
    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading, showAutoScroll]);

  // Loading screen
  if (isLoading) {
    return (
      <EnhancedLoadingScreen 
        onComplete={handleLoadingComplete} 
        features={healthcareModules.slice(0, 8).map(m => ({
          id: m.id,
          title: m.title,
          icon: m.icon,
          color: m.color
        }))}
      />
    );
  }

  // Auto-scroll features presentation
  if (showAutoScroll) {
    return (
      <AutoScrollFeatures 
        features={healthcareModules.slice(0, 8).map(m => ({
          id: m.id,
          title: m.title,
          description: m.description,
          icon: m.icon,
          color: m.color
        }))} 
        isActive={showAutoScroll} 
        onComplete={handleAutoScrollComplete}
      />
    );
  }

  const activeModule = selectedModule || hoveredModule;
  const currentModule = healthcareModules.find(m => m.id === activeModule);

  return (
    <MouseAnimationSystem>
      <div ref={mainRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Animated Header */}
        <AnimatedHeader />

        {/* Enhanced Hero Section */}
        <EnhancedHeroSection />

        {/* Circular Healthcare Management System */}
        <section id="features" className="relative min-h-screen py-24 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/10 to-teal-100/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center space-x-2 bg-blue-100/80 backdrop-blur-sm text-blue-700 px-6 py-3 rounded-full text-sm font-medium mb-8 shadow-lg">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span>Comprehensive Healthcare Management System</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                Integrated Healthcare Ecosystem
              </h2>
              
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Explore our comprehensive healthcare management platform with interconnected modules designed for seamless workflow integration.
              </p>
            </div>

            {/* Three Column Layout */}
            <div className="grid grid-cols-12 gap-8 min-h-[800px]">
              
              {/* Left Column - Feature Cards */}
              <div className="col-span-12 lg:col-span-3 space-y-4">
                <div className="sticky top-32">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white mr-3">📋</span>
                    Healthcare Modules
                  </h3>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
                    {healthcareModules.map((module, index) => (
                      <div
                        key={module.id}
                        id={`card-${module.id}`}
                        className={`
                          feature-card group cursor-pointer p-4 rounded-xl border-2 transition-all duration-300
                          ${selectedModule === module.id 
                            ? 'bg-gradient-to-r from-blue-50 to-teal-50 border-blue-300 shadow-xl scale-105' 
                            : hoveredModule === module.id
                              ? 'bg-white border-blue-200 shadow-lg scale-102'
                              : 'bg-white/80 border-gray-200 hover:border-blue-200 hover:shadow-md'
                          }
                        `}
                        onClick={() => handleModuleClick(module.id)}
                        onMouseEnter={() => handleModuleHover(module.id)}
                        onMouseLeave={() => handleModuleHover(null)}
                        data-mouse-parallax="0.02"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`
                            w-12 h-12 rounded-xl bg-gradient-to-r ${module.color} 
                            flex items-center justify-center text-white text-xl shadow-lg
                            group-hover:scale-110 transition-transform duration-300
                          `}>
                            {module.icon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                              {module.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {module.description}
                            </p>
                            
                            {/* Quick Stats */}
                            <div className="mt-2 flex space-x-4">
                              {module.stats.slice(0, 1).map((stat, statIndex) => (
                                <div key={statIndex} className="text-xs">
                                  <span className={`font-bold bg-gradient-to-r ${module.color} bg-clip-text text-transparent`}>
                                    {stat.value}
                                  </span>
                                  <span className="text-gray-500 ml-1">{stat.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        {selectedModule === module.id && (
                          <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-teal-500 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Interaction Mode Toggle */}
                  <div className="mt-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Interaction Mode</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        interactionMode === 'manual' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {interactionMode === 'manual' ? 'Manual' : 'Auto-Scroll'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Column - Circular System */}
              <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
                <div ref={circularSystemRef} className="relative w-[600px] h-[600px]">
                  
                  {/* Central Healthcare Hub */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-20">
                    <div className="w-full h-full bg-gradient-to-br from-white via-blue-50 to-teal-50 rounded-full border-4 border-blue-200 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden">
                      <div className="text-4xl mb-1">🏥</div>
                      <div className="text-xs font-bold text-blue-700 text-center leading-tight">
                        Healthcare<br />Ecosystem
                      </div>
                      
                      {/* Central Pulse Ring */}
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping" />
                      <div className="absolute inset-2 rounded-full border border-teal-400/30 animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                  </div>

                  {/* Outer Circle - Main Modules */}
                  <div className="outer-orbit absolute inset-0">
                    <div className="relative w-full h-full">
                      {/* Outer Circle Path */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
                        <defs>
                          <linearGradient id="outerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="300"
                          cy="300"
                          r="250"
                          stroke="url(#outerGradient)"
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray="10,5"
                          className="animate-pulse"
                        />
                      </svg>

                      {/* Outer Modules */}
                      {healthcareModules.filter(m => m.category === 'outer').map((module, index) => {
                        const angle = (module.angle * Math.PI) / 180;
                        const radius = 250;
                        const x = 300 + Math.cos(angle) * radius;
                        const y = 300 + Math.sin(angle) * radius;
                        const isActive = selectedModule === module.id || hoveredModule === module.id;

                        return (
                          <div
                            key={module.id}
                            id={`module-${module.id}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                            style={{ left: x, top: y }}
                            onClick={() => handleModuleClick(module.id)}
                            onMouseEnter={() => handleModuleHover(module.id)}
                            onMouseLeave={() => handleModuleHover(null)}
                          >
                            {/* Module Container */}
                            <div className={`
                              relative w-24 h-16 rounded-xl backdrop-blur-md border-2 shadow-xl
                              flex flex-col items-center justify-center transition-all duration-300
                              ${isActive 
                                ? `bg-gradient-to-r ${module.color} border-white text-white scale-110 shadow-2xl`
                                : 'bg-white/90 border-gray-200 text-gray-700 hover:border-blue-300'
                              }
                            `}>
                              <div className="text-lg mb-1">{module.icon}</div>
                              <div className="text-xs font-bold text-center leading-tight px-1">
                                {module.title.split(' ')[0]}<br />{module.title.split(' ').slice(1).join(' ')}
                              </div>
                              
                              {/* Active Indicator */}
                              {isActive && (
                                <div className="absolute inset-0 rounded-xl border-2 border-white/50 animate-ping" />
                              )}
                            </div>

                            {/* Connection Line to Center */}
                            {isActive && (
                              <div className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-r from-blue-400 to-teal-400 transform origin-center animate-pulse"
                                style={{
                                  height: `${radius - 60}px`,
                                  transform: `translate(-50%, -50%) rotate(${module.angle + 180}deg)`,
                                  transformOrigin: 'center bottom'
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Inner Circle - Core Modules */}
                  <div className="inner-orbit absolute inset-0">
                    <div className="relative w-full h-full">
                      {/* Inner Circle Path */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
                        <defs>
                          <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                            <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="300"
                          cy="300"
                          r="150"
                          stroke="url(#innerGradient)"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="8,4"
                          className="animate-pulse"
                          style={{ animationDelay: '0.5s' }}
                        />
                      </svg>

                      {/* Inner Modules */}
                      {healthcareModules.filter(m => m.category === 'inner').map((module, index) => {
                        const angle = (module.angle * Math.PI) / 180;
                        const radius = 150;
                        const x = 300 + Math.cos(angle) * radius;
                        const y = 300 + Math.sin(angle) * radius;
                        const isActive = selectedModule === module.id || hoveredModule === module.id;

                        return (
                          <div
                            key={module.id}
                            id={`module-${module.id}`}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-15"
                            style={{ left: x, top: y }}
                            onClick={() => handleModuleClick(module.id)}
                            onMouseEnter={() => handleModuleHover(module.id)}
                            onMouseLeave={() => handleModuleHover(null)}
                          >
                            <div className={`
                              relative w-20 h-14 rounded-lg backdrop-blur-md border-2 shadow-lg
                              flex flex-col items-center justify-center transition-all duration-300
                              ${isActive 
                                ? `bg-gradient-to-r ${module.color} border-white text-white scale-110 shadow-xl`
                                : 'bg-white/95 border-gray-300 text-gray-700 hover:border-purple-300'
                              }
                            `}>
                              <div className="text-base mb-1">{module.icon}</div>
                              <div className="text-xs font-semibold text-center leading-tight px-1">
                                {module.title.includes('/') ? module.title : module.title.split(' ')[0]}
                              </div>
                              
                              {isActive && (
                                <div className="absolute inset-0 rounded-lg border-2 border-white/50 animate-ping" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Data Flow Animation */}
                  {activeModule && (
                    <div className="absolute inset-0 pointer-events-none">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full animate-pulse"
                          style={{
                            left: '50%',
                            top: '50%',
                            transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateX(100px)`,
                            animationDelay: `${i * 0.2}s`,
                            animationDuration: '2s'
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Detailed Information with Drone */}
              <div className="col-span-12 lg:col-span-3 space-y-6">
                <div className="sticky top-32">
                  
                  {/* Drone Display */}
                  <div className="mb-8 flex justify-center">
                    <div ref={droneRef} className="relative">
                      <div className={`
                        w-24 h-24 rounded-2xl bg-gradient-to-br shadow-2xl
                        flex items-center justify-center text-4xl transition-all duration-500
                        ${currentModule 
                          ? `${currentModule.color} scale-110 animate-pulse` 
                          : 'from-gray-400 to-gray-500'
                        }
                      `}>
                        🚁
                      </div>
                      
                      {/* Drone Effects */}
                      {currentModule && (
                        <>
                          <div className="absolute inset-0 rounded-2xl border-2 border-white/50 animate-ping" />
                          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-400/20 to-teal-400/20 blur-lg animate-pulse" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Module Details */}
                  {currentModule ? (
                    <div className="space-y-6">
                      {/* Module Header */}
                      <div className={`p-6 rounded-2xl bg-gradient-to-r ${currentModule.color} text-white shadow-xl`}>
                        <div className="flex items-center mb-4">
                          <div className="text-3xl mr-4">{currentModule.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">{currentModule.title}</h3>
                            <div className="text-sm opacity-90 capitalize">{currentModule.category} Module</div>
                          </div>
                        </div>
                        <p className="text-white/95 leading-relaxed">{currentModule.description}</p>
                      </div>

                      {/* Key Benefits */}
                      <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                          <span className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-sm mr-3">✓</span>
                          Key Benefits
                        </h4>
                        <div className="space-y-3">
                          {currentModule.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3 group">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${currentModule.color} flex items-center justify-center text-white text-xs font-bold group-hover:scale-110 transition-transform duration-300`}>
                                {index + 1}
                              </div>
                              <span className="text-gray-700 font-medium group-hover:text-blue-600 transition-colors">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        {currentModule.stats.map((stat, index) => (
                          <div key={index} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg text-center">
                            <div className={`text-2xl font-bold bg-gradient-to-r ${currentModule.color} bg-clip-text text-transparent mb-1`}>
                              {stat.value}
                            </div>
                            <div className="text-xs text-gray-600 uppercase tracking-wide font-medium">
                              {stat.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Button */}
                      <button className={`
                        w-full py-4 px-6 rounded-xl font-semibold text-white shadow-xl
                        bg-gradient-to-r ${currentModule.color} hover:shadow-2xl
                        transition-all duration-300 hover:scale-105 active:scale-95
                      `}>
                        Explore {currentModule.title}
                      </button>
                    </div>
                  ) : (
                    /* Default State */
                    <div className="text-center space-y-6">
                      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
                        <div className="text-6xl mb-4">🏥</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Healthcare Management System</h3>
                        <p className="text-gray-600 leading-relaxed mb-6">
                          Select any module from the left panel or click on the circular system to explore detailed information about our comprehensive healthcare platform.
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-blue-600">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                          <span>Click any module to begin exploration</span>
                        </div>
                      </div>

                      {/* System Overview Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Total Modules</div>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg text-center">
                          <div className="text-2xl font-bold text-teal-600 mb-1">100%</div>
                          <div className="text-xs text-gray-600 uppercase tracking-wide">Integration</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medicine Wave Effect */}
          <MedicineWaveEffect isActive={true} intensity={0.8} particleCount={20} />
        </section>

        {/* Modern Features Section */}
        <ModernFeaturesSection />

        {/* Footer */}
        <footer className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                    🏥
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">ClinicStreams</h3>
                    <p className="text-sm text-gray-400">Healthcare Technology</p>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  Transforming healthcare through intelligent technology and innovative solutions.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 ClinicStreams. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </MouseAnimationSystem>
  );
}