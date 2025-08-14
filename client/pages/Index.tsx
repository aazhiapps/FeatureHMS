import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedHeader } from "../components/AnimatedHeader";
import { EnhancedHeroSection } from "../components/EnhancedHeroSection";
import { ModernFeaturesSection } from "../components/ModernFeaturesSection";
import { ClinicStreamsJourney } from "../components/ClinicStreamsJourney";
import { ClinicStreamsContent } from "../components/ClinicStreamsContent";
import { ClinicStreamsProgress } from "../components/ClinicStreamsProgress";
import { DemoReplaySection } from "../components/DemoReplaySection";
import { FloatingCircularModules } from "../components/FloatingCircularModules";
import { FeatureDetailsDisplay } from "../components/FeatureDetailsDisplay";
import { HeroMedicineInteraction } from "../components/HeroMedicineInteraction";
import { MouseAnimationSystem } from "../components/MouseAnimationSystem";
import { CountdownLoadingScreen } from "../components/CountdownLoadingScreen";
import { EnhancedLoadingScreen } from "../components/EnhancedLoadingScreen";
import { AutoScrollFeatures } from "../components/AutoScrollFeatures";
import { CountdownLoadingScreen } from "../components/CountdownLoadingScreen";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  benefits: string[];
  stats: { label: string; value: string }[];
  position: [number, number, number];
}

export default function Index() {
  const [currentPhase, setCurrentPhase] = useState<'countdown' | 'loading' | 'autoscroll' | 'main'>('countdown');
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const [showCircularModules, setShowCircularModules] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Healthcare management features based on the circular design
  const features: Feature[] = [
    {
      id: 'front-office',
      title: 'Front Office Management',
      description: 'Comprehensive patient registration, appointment scheduling, and front desk operations management.',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-500',
      category: 'management',
      benefits: [
        'Streamlined patient registration',
        'Automated appointment scheduling',
        'Real-time queue management',
        'Insurance verification'
      ],
      stats: [
        { label: 'Registration Time', value: '2 min' },
        { label: 'Efficiency Gain', value: '65%' }
      ],
      position: [0, 15, -10]
    },
    {
      id: 'lab-management',
      title: 'Lab Management',
      description: 'Complete laboratory information system with test ordering, result tracking, and quality control.',
      icon: '🧪',
      color: 'from-green-500 to-emerald-500',
      category: 'laboratory',
      benefits: [
        'Digital test ordering',
        'Automated result delivery',
        'Quality control tracking',
        'Equipment integration'
      ],
      stats: [
        { label: 'Result Speed', value: '3x faster' },
        { label: 'Accuracy', value: '99.9%' }
      ],
      position: [12, 10, -15]
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy Management',
      description: 'Integrated pharmacy system with inventory management, prescription tracking, and drug interaction alerts.',
      icon: '💊',
      color: 'from-purple-500 to-pink-500',
      category: 'pharmacy',
      benefits: [
        'Inventory optimization',
        'Drug interaction alerts',
        'Prescription tracking',
        'Automated reordering'
      ],
      stats: [
        { label: 'Stock Accuracy', value: '98%' },
        { label: 'Cost Savings', value: '25%' }
      ],
      position: [-12, 10, -15]
    },
    {
      id: 'opd-cpoe',
      title: 'OPD/CPOE',
      description: 'Outpatient department management with computerized physician order entry system.',
      icon: '👨‍⚕️',
      color: 'from-indigo-500 to-blue-500',
      category: 'clinical',
      benefits: [
        'Digital order entry',
        'Clinical decision support',
        'Workflow optimization',
        'Error reduction'
      ],
      stats: [
        { label: 'Order Accuracy', value: '99.5%' },
        { label: 'Time Saved', value: '40%' }
      ],
      position: [0, 5, -20]
    },
    {
      id: 'telemedicine',
      title: 'Telemedicine',
      description: 'Remote healthcare delivery platform with video consultations and digital health monitoring.',
      icon: '📱',
      color: 'from-teal-500 to-cyan-500',
      category: 'telehealth',
      benefits: [
        'Remote consultations',
        'Digital health monitoring',
        'Secure video calls',
        'Mobile accessibility'
      ],
      stats: [
        { label: 'Patient Reach', value: '300%' },
        { label: 'Satisfaction', value: '95%' }
      ],
      position: [8, 0, -25]
    },
    {
      id: 'billing',
      title: 'Billing Modules',
      description: 'Comprehensive billing and revenue cycle management with insurance claims processing.',
      icon: '💳',
      color: 'from-yellow-500 to-orange-500',
      category: 'financial',
      benefits: [
        'Automated billing',
        'Insurance claims',
        'Revenue tracking',
        'Payment processing'
      ],
      stats: [
        { label: 'Collection Rate', value: '92%' },
        { label: 'Processing Time', value: '50% faster' }
      ],
      position: [-8, 0, -25]
    },
    {
      id: 'admission',
      title: 'Admission Management',
      description: 'Patient admission workflow with bed management, pre-authorization, and discharge planning.',
      icon: '🏥',
      color: 'from-red-500 to-pink-500',
      category: 'inpatient',
      benefits: [
        'Bed management',
        'Pre-authorization',
        'Discharge planning',
        'Length of stay optimization'
      ],
      stats: [
        { label: 'Bed Utilization', value: '85%' },
        { label: 'Discharge Time', value: '30% faster' }
      ],
      position: [-12, -5, -20]
    },
    {
      id: 'vital-room',
      title: 'Vital Room Management',
      description: 'Critical care monitoring with real-time vital signs tracking and alert systems.',
      icon: '💗',
      color: 'from-rose-500 to-red-500',
      category: 'critical',
      benefits: [
        'Real-time monitoring',
        'Automated alerts',
        'Trend analysis',
        'Emergency protocols'
      ],
      stats: [
        { label: 'Response Time', value: '<30 sec' },
        { label: 'Alert Accuracy', value: '99.8%' }
      ],
      position: [0, -10, -15]
    },
    {
      id: 'accounts',
      title: 'Accounts Management',
      description: 'Financial management system with accounting, budgeting, and financial reporting capabilities.',
      icon: '📊',
      color: 'from-emerald-500 to-green-500',
      category: 'accounting',
      benefits: [
        'Financial reporting',
        'Budget management',
        'Cost analysis',
        'Audit trails'
      ],
      stats: [
        { label: 'Report Generation', value: 'Real-time' },
        { label: 'Accuracy', value: '99.9%' }
      ],
      position: [12, -5, -20]
    },
    {
      id: 'discharge',
      title: 'Discharge Management',
      description: 'Streamlined patient discharge process with documentation, billing, and follow-up care coordination.',
      icon: '📋',
      color: 'from-violet-500 to-purple-500',
      category: 'workflow',
      benefits: [
        'Automated documentation',
        'Billing integration',
        'Follow-up scheduling',
        'Care coordination'
      ],
      stats: [
        { label: 'Discharge Time', value: '45% faster' },
        { label: 'Documentation', value: '100% complete' }
      ],
      position: [8, -15, -10]
    },
    {
      id: 'ambulance',
      title: 'Ambulance Management',
      description: 'Emergency medical services coordination with GPS tracking, dispatch, and resource management.',
      icon: '🚑',
      color: 'from-orange-500 to-red-500',
      category: 'emergency',
      benefits: [
        'GPS tracking',
        'Dispatch optimization',
        'Resource allocation',
        'Emergency protocols'
      ],
      stats: [
        { label: 'Response Time', value: '8 min avg' },
        { label: 'Fleet Efficiency', value: '90%' }
      ],
      position: [0, -20, -5]
    },
    {
      id: 'nursing',
      title: 'Nursing Station Management',
      description: 'Nursing workflow management with patient care plans, medication administration, and shift coordination.',
      icon: '👩‍⚕️',
      color: 'from-cyan-500 to-teal-500',
      category: 'nursing',
      benefits: [
        'Care plan management',
        'Medication tracking',
        'Shift coordination',
        'Patient monitoring'
      ],
      stats: [
        { label: 'Care Quality', value: '98%' },
        { label: 'Efficiency', value: '55% better' }
      ],
      position: [-8, -15, -10]
    },
    {
      id: 'insurance',
      title: 'Insurance Module',
      description: 'Insurance verification, claims processing, and coverage management with real-time eligibility checks.',
      icon: '🛡️',
      color: 'from-blue-500 to-indigo-500',
      category: 'insurance',
      benefits: [
        'Real-time verification',
        'Claims automation',
        'Coverage tracking',
        'Denial management'
      ],
      stats: [
        { label: 'Claim Success', value: '94%' },
        { label: 'Processing Speed', value: '70% faster' }
      ],
      position: [-12, -10, -5]
    },
    {
      id: 'cssd',
      title: 'CSSD Module',
      description: 'Central Sterile Supply Department management with sterilization tracking and instrument management.',
      icon: '🧼',
      color: 'from-green-500 to-lime-500',
      category: 'sterilization',
      benefits: [
        'Sterilization tracking',
        'Instrument management',
        'Quality assurance',
        'Compliance monitoring'
      ],
      stats: [
        { label: 'Sterility Rate', value: '100%' },
        { label: 'Efficiency', value: '60% better' }
      ],
      position: [12, -10, -5]
    }
  ];

  // Phase transition handlers with proper animation resets
  const handleCountdownComplete = useCallback(() => {
    setCurrentPhase('loading');
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setCurrentPhase('autoscroll');
  }, []);

  const handleAutoScrollComplete = useCallback(() => {
    setCurrentPhase('main');
  }, []);

  const handleFeatureClick = useCallback((featureIndex: number) => {
    setSelectedFeature(featureIndex);
  }, []);

  const handleJumpToSection = useCallback((progress: number) => {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScrollY = documentHeight * progress;
    
    gsap.to(window, {
      scrollTo: { y: targetScrollY },
      duration: 2,
      ease: "power2.inOut"
    });
  }, []);

  const handleReplay = useCallback(() => {
    // Reset all states and restart from countdown
    setCurrentPhase('countdown');
    setSelectedFeature(0);
    setShowCircularModules(false);
    
    // Scroll to top
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1,
      ease: "power2.out"
    });
  }, []);

  // Initialize scroll animations for journey phase
  useEffect(() => {
    if (currentPhase !== 'main' || !mainRef.current) return;

    const initializeScrollAnimations = () => {
      // Smooth scroll reveal for sections
      const sections = mainRef.current?.querySelectorAll('section');
      sections?.forEach((section, index) => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );
      });
    };

    const timeout = setTimeout(initializeScrollAnimations, 500);
    
    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [currentPhase]);

  // Countdown loading screen (5 seconds)
  if (currentPhase === 'countdown') {
    return (
      <CountdownLoadingScreen 
        onComplete={handleCountdownComplete}
        duration={5}
        title="ClinicStreams Healthcare"
        subtitle="Initializing Medical Systems..."
      />
    );
  }

  // Enhanced loading screen with circular features
  if (currentPhase === 'loading') {
    return (
      <EnhancedLoadingScreen 
        onComplete={handleLoadingComplete} 
        features={features.map(f => ({
          id: f.id,
          title: f.title,
          icon: f.icon,
          color: f.color
        }))}
      />
    );
  }

  // Auto-scroll features presentation
  if (currentPhase === 'autoscroll') {
    return (
      <AutoScrollFeatures 
        features={features} 
        isActive={true} 
        onComplete={handleAutoScrollComplete}
      />
    );
  }

  // Main website with all existing UI and animations
  return (
    <MouseAnimationSystem>
      <div ref={mainRef} className="min-h-screen bg-white relative overflow-x-hidden">
        {/* Animated Header with Journey Navigator */}
        <AnimatedHeader />

        {/* Hero Medicine Interaction */}
        <HeroMedicineInteraction isActive={currentPhase === 'main'} />

        {/* 3D Healthcare Journey */}
        <ClinicStreamsJourney 
          features={features}
          onFeatureClick={handleFeatureClick}
          onJumpToSection={handleJumpToSection}
        />

        {/* Scroll-driven Content */}
        <ClinicStreamsContent />

        {/* Progress Indicator */}
        <ClinicStreamsProgress 
          features={features}
          onFeatureClick={handleFeatureClick}
          onJumpToSection={handleJumpToSection}
        />

        {/* Feature Details Display */}
        <FeatureDetailsDisplay features={features} />

        {/* Floating Circular Modules */}
        <FloatingCircularModules 
          isVisible={currentPhase === 'main'}
          centerText="Healthcare Ecosystem"
        />

        {/* Main Content Sections */}
        <div className="relative z-10">
          {/* Enhanced Hero Section */}
          <EnhancedHeroSection />

          {/* Circular Healthcare Management System - Restored Original */}
          <section id="features" className="relative py-24 bg-gradient-to-br from-blue-50 via-white to-teal-50 overflow-hidden min-h-screen">
            {/* Background Effects */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-20 right-10 w-60 h-60 bg-teal-200/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl animate-pulse" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
              {/* Section Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center space-x-2 bg-blue-100/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span>Comprehensive Healthcare Management</span>
                </div>
                
                <h2 className="text-heading-1 text-gray-900 mb-6">
                  Integrated Healthcare Ecosystem
                </h2>
                
                <p className="text-body-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Experience our complete healthcare management system with interconnected modules designed for seamless workflow integration.
                </p>
              </div>

              {/* Three Column Layout */}
              <div className="grid grid-cols-12 gap-8 items-start">
                {/* Left Column - Feature Cards */}
                <div className="col-span-12 lg:col-span-3 space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                    Healthcare Modules
                  </h3>
                  
                  <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                    {features.map((feature, index) => (
                      <div
                        key={feature.id}
                        id={`feature-${feature.category}`}
                        className={`feature-card p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                          selectedFeature === index 
                            ? 'border-blue-500 bg-blue-50 shadow-lg scale-105' 
                            : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-102'
                        }`}
                        onClick={() => handleFeatureClick(index)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-lg group-hover:scale-110 transition-transform duration-300`}>
                            {feature.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{feature.title}</h4>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{feature.category}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{feature.description}</p>
                        
                        <div className="grid grid-cols-2 gap-2">
                          {feature.stats.map((stat, statIndex) => (
                            <div key={statIndex} className="text-center p-2 bg-gray-50 rounded-lg">
                              <div className="text-sm font-bold text-gray-900">{stat.value}</div>
                              <div className="text-xs text-gray-500">{stat.label}</div>
                            </div>
                          ))}
                        </div>

                        {/* Pulse effect for active feature */}
                        <div className="feature-pulse absolute inset-0 rounded-xl border-2 border-transparent opacity-0"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Center Column - Circular Healthcare Tree */}
                <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
                  <div className="relative w-[500px] h-[500px]">
                    {/* Outer Orbital Ring */}
                    <div className="absolute inset-0 border-2 border-blue-200/50 rounded-full animate-spin opacity-30" style={{ animationDuration: '30s' }}></div>
                    <div className="absolute inset-4 border border-teal-200/40 rounded-full animate-spin opacity-20" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-8 border border-purple-200/30 rounded-full animate-spin opacity-15" style={{ animationDuration: '20s' }}></div>

                    {/* Central Healthcare Hub */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-blue-500 via-teal-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-2xl border-4 border-white module-glow">
                      🏥
                      <div className="absolute inset-0 rounded-full border-4 border-blue-400/50 animate-ping"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Healthcare Management Modules */}
                    {features.slice(0, 12).map((feature, index) => {
                      const angle = (index / 12) * 2 * Math.PI;
                      const radius = 180;
                      const x = Math.cos(angle) * radius + 250;
                      const y = Math.sin(angle) * radius + 250;

                      return (
                        <div
                          key={feature.id}
                          className={`absolute w-16 h-16 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group circular-module ${
                            selectedFeature === index ? 'active' : ''
                          }`}
                          style={{ left: `${x}px`, top: `${y}px` }}
                          onClick={() => handleFeatureClick(index)}
                        >
                          <div className={`w-full h-full rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-lg shadow-lg border-2 border-white/50 transition-all duration-500 group-hover:scale-110 ${
                            selectedFeature === index ? 'scale-125 shadow-2xl' : ''
                          }`}>
                            {feature.icon}
                          </div>
                          
                          {/* Module Label */}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 text-center whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {feature.title.split(' ')[0]}
                          </div>

                          {/* Connection Line to Center */}
                          <div 
                            className="absolute top-1/2 left-1/2 w-0.5 bg-gradient-to-r from-blue-400/30 to-transparent origin-center transition-all duration-500"
                            style={{
                              height: `${radius - 32}px`,
                              transform: `translate(-50%, -50%) rotate(${angle + Math.PI}rad)`,
                              opacity: selectedFeature === index ? 1 : 0.3
                            }}
                          ></div>

                          {/* Data Flow Animation */}
                          {selectedFeature === index && (
                            <div 
                              className="absolute w-2 h-2 bg-green-400 rounded-full data-flow-animation"
                              style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) rotate(${angle + Math.PI}rad) translateY(-${radius/2}px)`
                              }}
                            ></div>
                          )}

                          {/* Active Ring */}
                          {selectedFeature === index && (
                            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping"></div>
                          )}
                        </div>
                      );
                    })}

                    {/* Core System Labels */}
                    <div className="absolute top-[30%] left-1/2 transform -translate-x-1/2 text-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md border border-blue-200">
                        <span className="text-xs font-medium text-blue-700">TELEMEDICINE</span>
                      </div>
                    </div>

                    <div className="absolute bottom-[30%] left-1/2 transform -translate-x-1/2 text-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md border border-green-200">
                        <span className="text-xs font-medium text-green-700">BILLING CORE</span>
                      </div>
                    </div>

                    <div className="absolute left-[25%] top-1/2 transform -translate-y-1/2 text-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md border border-purple-200">
                        <span className="text-xs font-medium text-purple-700">OPD/CPOE</span>
                      </div>
                    </div>

                    <div className="absolute right-[25%] top-1/2 transform -translate-y-1/2 text-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md border border-orange-200">
                        <span className="text-xs font-medium text-orange-700">VITAL ROOM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Drone Explanation */}
                <div className="col-span-12 lg:col-span-3">
                  <div className="bg-gradient-to-br from-white/80 via-blue-50/80 to-teal-50/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/50">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm mr-3 animate-pulse">
                        🚁
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">System Analysis</h3>
                    </div>

                    {/* Selected Feature Details */}
                    <div className="mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${features[selectedFeature].color} flex items-center justify-center text-white text-xl mb-3 shadow-lg`}>
                        {features[selectedFeature].icon}
                      </div>
                      
                      <h4 className="text-xl font-bold text-gray-900 mb-2">
                        {features[selectedFeature].title}
                      </h4>
                      
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">
                        {features[selectedFeature].description}
                      </p>

                      {/* Key Benefits */}
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-800 mb-2">Key Benefits:</h5>
                        <ul className="space-y-1">
                          {features[selectedFeature].benefits.map((benefit, index) => (
                            <li key={index} className="flex items-start text-xs text-gray-600">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Performance Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        {features[selectedFeature].stats.map((stat, index) => (
                          <div key={index} className="bg-white/70 rounded-lg p-3 text-center border border-gray-200">
                            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-500">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Drone Status */}
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-3 border border-green-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-800">Drone Status</span>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="text-xs text-green-700">
                        Analyzing {features[selectedFeature].category} module...
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        Module {selectedFeature + 1} of {features.length} • Active
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modern Features Section */}
          <ModernFeaturesSection />

          {/* Demo Replay Section */}
          <DemoReplaySection 
            onReplay={handleReplay}
            onDemo={() => console.log('Demo requested')}
            onCompare={() => console.log('Compare requested')}
            features={features}
          />

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
                    <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Company</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-4">Support</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
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
      </div>
    </MouseAnimationSystem>
  );
}