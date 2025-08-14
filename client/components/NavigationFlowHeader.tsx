import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { InteractiveButton } from "./InteractiveButton";

interface NavigationStep {
  id: string;
  title: string;
  icon: string;
  description: string;
  completed: boolean;
  active: boolean;
}

interface NavigationFlowHeaderProps {
  currentPage: 'loading' | 'autoscroll' | 'journey' | 'comparison' | 'demo';
  onNavigate: (page: 'loading' | 'autoscroll' | 'journey' | 'comparison' | 'demo') => void;
  autoHideOnScroll?: boolean;
}

export const NavigationFlowHeader = ({
  currentPage,
  onNavigate,
  autoHideOnScroll = true
}: NavigationFlowHeaderProps) => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [animatingPath, setAnimatingPath] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const steps: NavigationStep[] = [
    {
      id: 'loading',
      title: 'Welcome',
      icon: '🚀',
      description: 'Initial loading experience',
      completed: currentPage !== 'loading',
      active: currentPage === 'loading'
    },
    {
      id: 'autoscroll',
      title: 'Preview',
      icon: '📱',
      description: 'Auto-scroll feature showcase',
      completed: ['journey', 'comparison', 'demo'].includes(currentPage),
      active: currentPage === 'autoscroll'
    },
    {
      id: 'journey',
      title: 'Explore',
      icon: '🏥',
      description: 'Interactive healthcare journey',
      completed: ['comparison', 'demo'].includes(currentPage),
      active: currentPage === 'journey'
    },
    {
      id: 'comparison',
      title: 'Compare',
      icon: '🆚',
      description: 'Feature comparison analysis',
      completed: currentPage === 'demo',
      active: currentPage === 'comparison'
    },
    {
      id: 'demo',
      title: 'Demo',
      icon: '🎯',
      description: 'Schedule consultation',
      completed: false,
      active: currentPage === 'demo'
    }
  ];

  useEffect(() => {
    if (!headerRef.current || !pathRef.current) return;

    // Animate header entrance
    gsap.fromTo(headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" }
    );

    // Animate progress path
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const completedSteps = steps.filter(step => step.completed).length;
    const progressPercent = (completedSteps + (steps.find(s => s.active) ? 0.5 : 0)) / steps.length;

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength
    });

    gsap.to(path, {
      strokeDashoffset: pathLength * (1 - progressPercent),
      duration: 2,
      ease: "power2.out"
    });

  }, [currentPage]);

  // Scroll detection for auto-hide
  useEffect(() => {
    if (!autoHideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide header
        if (!isHidden) {
          setIsHidden(true);
          gsap.to(headerRef.current, {
            y: -120,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scrolling up or near top - show header
        if (isHidden) {
          setIsHidden(false);
          gsap.to(headerRef.current, {
            y: 0,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      }

      setLastScrollY(currentScrollY);
    };

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [lastScrollY, isHidden, autoHideOnScroll]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);

    const content = headerRef.current?.querySelector('.header-content');
    const quickActions = headerRef.current?.querySelector('.quick-actions');

    if (!isMinimized) {
      // Minimize
      gsap.to(content, { height: 60, opacity: 0.7, duration: 0.4, ease: "power2.out" });
      gsap.to(quickActions, { opacity: 0, height: 0, duration: 0.3, ease: "power2.out" });
      gsap.to(toggleRef.current, { rotation: 180, duration: 0.3, ease: "power2.out" });
    } else {
      // Maximize
      gsap.to(content, { height: 'auto', opacity: 1, duration: 0.4, ease: "power2.out" });
      gsap.to(quickActions, { opacity: 1, height: 'auto', duration: 0.3, delay: 0.2, ease: "power2.out" });
      gsap.to(toggleRef.current, { rotation: 0, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleStepClick = (stepId: string) => {
    setAnimatingPath(true);
    
    // Animate path update
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      const stepIndex = steps.findIndex(s => s.id === stepId);
      const progressPercent = (stepIndex + 0.5) / steps.length;
      
      gsap.to(pathRef.current, {
        strokeDashoffset: pathLength * (1 - progressPercent),
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          setAnimatingPath(false);
          onNavigate(stepId as any);
        }
      });
    } else {
      setTimeout(() => {
        setAnimatingPath(false);
        onNavigate(stepId as any);
      }, 300);
    }
  };

  const canNavigateTo = (stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const currentIndex = steps.findIndex(s => s.id === currentPage);
    // Allow going back to any previous step or current step
    return stepIndex <= currentIndex + 1;
  };

  return (
    <div 
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl transition-all duration-300 ${isMinimized ? 'py-2' : 'py-4'}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        {/* Brand and Toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mr-4">
              ClinicStreams
            </div>
            <div className="text-sm text-white/60">Healthcare Journey Navigator</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-300">Live Experience</span>
            </div>
            {/* Minimize/Maximize Toggle */}
            <button
              ref={toggleRef}
              onClick={toggleMinimize}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
              title={isMinimized ? "Expand Navigation" : "Minimize Navigation"}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/70"
              >
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Flow */}
        <div className="relative">
          {/* Progress Path */}
          <div className="absolute top-8 left-0 right-0 z-0">
            <svg 
              width="100%" 
              height="4" 
              className="overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path
                ref={pathRef}
                d={`M 0,2 L ${window.innerWidth - 100},2`}
                stroke="url(#pathGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              <path
                d={`M 0,2 L ${window.innerWidth - 100},2`}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Navigation Steps */}
          <div className="relative z-10 flex justify-between items-center">
            {steps.map((step, index) => {
              const isClickable = canNavigateTo(step.id);
              const isHovered = hoveredStep === step.id;
              
              return (
                <div
                  key={step.id}
                  className="relative group"
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step Circle */}
                  <button
                    onClick={() => isClickable && !animatingPath && handleStepClick(step.id)}
                    disabled={!isClickable || animatingPath}
                    className={`
                      relative w-16 h-16 rounded-full border-4 transition-all duration-500 transform
                      flex items-center justify-center text-xl font-bold
                      ${step.completed 
                        ? 'bg-gradient-to-br from-green-500 to-blue-500 border-green-400 text-white shadow-lg' 
                        : step.active 
                          ? 'bg-gradient-to-br from-blue-500 to-purple-500 border-blue-400 text-white shadow-lg animate-pulse' 
                          : 'bg-white/10 border-white/30 text-white/60'
                      }
                      ${isClickable && !animatingPath 
                        ? 'cursor-pointer hover:scale-110 hover:shadow-2xl' 
                        : !isClickable 
                          ? 'cursor-not-allowed opacity-50' 
                          : 'cursor-wait'
                      }
                      ${isHovered && isClickable ? 'scale-110 shadow-2xl' : ''}
                    `}
                  >
                    <span className="relative z-10">{step.icon}</span>
                    
                    {/* Glow effect */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : ''}`} />
                    
                    {/* Completion check */}
                    {step.completed && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                    
                    {/* Active indicator */}
                    {step.active && (
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping" />
                    )}
                  </button>

                  {/* Step Info */}
                  <div className="absolute top-20 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                    <div className={`text-sm font-semibold transition-colors duration-300 ${
                      step.active ? 'text-blue-300' : 
                      step.completed ? 'text-green-300' : 
                      'text-white/60'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs mt-1 transition-opacity duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <div className="bg-black/80 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20">
                        <div className="text-white/90">{step.description}</div>
                      </div>
                    </div>
                  </div>

                  {/* Connection Lines */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-16 w-8 h-1 bg-white/20 transform -translate-y-1/2 z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions flex justify-center mt-6 space-x-4">
          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={() => handleStepClick('journey')}
            disabled={!canNavigateTo('journey') || animatingPath}
            className="text-white/70 hover:text-white"
          >
            🏠 Home
          </InteractiveButton>
          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={() => handleStepClick('comparison')}
            disabled={!canNavigateTo('comparison') || animatingPath}
            className="text-white/70 hover:text-white"
          >
            📊 Compare
          </InteractiveButton>
          <InteractiveButton
            variant="ghost"
            size="sm"
            onClick={() => window.open('https://calendly.com/clinicstreams-demo', '_blank')}
            className="text-white/70 hover:text-white"
          >
            📞 Demo
          </InteractiveButton>
        </div>
      </div>
    </div>
  );
};
