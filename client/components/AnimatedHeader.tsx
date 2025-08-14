import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

const navigationItems: NavigationItem[] = [
  { label: 'Features', href: '#features', icon: '🏥' },
  { label: 'Solutions', href: '#solutions', icon: '💡' },
  { label: 'Pricing', href: '#pricing', icon: '💰' },
  { label: 'About', href: '#about', icon: '👥' },
  { label: 'Contact', href: '#contact', icon: '📞' },
];

interface JourneyStep {
  id: string;
  title: string;
  icon: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export const AnimatedHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const [currentJourneyStep, setCurrentJourneyStep] = useState('welcome');
  const [journeyProgress, setJourneyProgress] = useState(0);
  const headerRef = useRef<HTMLHeaderElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLNavElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const journeyRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const journeySteps: JourneyStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      icon: '🏥',
      description: 'Healthcare platform overview',
      completed: journeyProgress > 0.2,
      active: journeyProgress <= 0.2,
    },
    {
      id: 'features',
      title: 'Features',
      icon: '⚡',
      description: 'Explore healthcare modules',
      completed: journeyProgress > 0.5,
      active: journeyProgress > 0.2 && journeyProgress <= 0.5,
    },
    {
      id: 'integration',
      title: 'Integration',
      icon: '🔗',
      description: 'System connectivity',
      completed: journeyProgress > 0.8,
      active: journeyProgress > 0.5 && journeyProgress <= 0.8,
    },
    {
      id: 'complete',
      title: 'Complete',
      icon: '✅',
      description: 'Journey finished',
      completed: false,
      active: journeyProgress > 0.8,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldShowHeader = scrollPosition > 100;
      
      if (shouldShowHeader !== isScrolled) {
        setIsScrolled(shouldShowHeader);
        
        if (headerRef.current) {
          if (shouldShowHeader) {
            gsap.to(headerRef.current, {
              y: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out"
            });
          } else {
            gsap.to(headerRef.current, {
              y: -100,
              opacity: 0.9,
              duration: 0.3,
              ease: "power2.out"
            });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  // Journey progress tracking
  useEffect(() => {
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        setJourneyProgress(progress);
        
        // Update progress bar
        if (progressBarRef.current) {
          gsap.to(progressBarRef.current, {
            width: `${progress * 100}%`,
            duration: 0.3,
            ease: "power2.out"
          });
        }
        
        // Determine current step
        if (progress <= 0.2) setCurrentJourneyStep('welcome');
        else if (progress <= 0.5) setCurrentJourneyStep('features');
        else if (progress <= 0.8) setCurrentJourneyStep('integration');
        else setCurrentJourneyStep('complete');
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  useEffect(() => {
    // Animate header on mount
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 }
      );
    }

    // Animate logo
    if (logoRef.current) {
      gsap.fromTo(logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.8, ease: "back.out(1.7)", delay: 0.7 }
      );
    }

    // Animate navigation items
    if (navRef.current) {
      const navItems = navRef.current.querySelectorAll('.nav-item');
      gsap.fromTo(navItems,
        { opacity: 0, y: -20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5, 
          ease: "power2.out", 
          stagger: 0.1, 
          delay: 0.9 
        }
      );
    }
  }, []);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    if (mobileMenuRef.current) {
      if (!isMobileMenuOpen) {
        gsap.fromTo(mobileMenuRef.current,
          { opacity: 0, y: -20, scale: 0.95 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.3, 
            ease: "power2.out" 
          }
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in"
        });
      }
    }
  };

  const handleNavItemHover = (index: number, isEntering: boolean) => {
    if (indicatorRef.current && navRef.current) {
      const navItems = navRef.current.querySelectorAll('.nav-item');
      const targetItem = navItems[index] as HTMLElement;
      
      if (isEntering && targetItem) {
        const { offsetLeft, offsetWidth } = targetItem;
        gsap.to(indicatorRef.current, {
          x: offsetLeft,
          width: offsetWidth,
          duration: 0.3,
          ease: "power2.out"
        });
      } else if (!isEntering) {
        gsap.to(indicatorRef.current, {
          width: 0,
          duration: 0.2,
          ease: "power2.in"
        });
      }
    }
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setActiveItem(href);

    // Animate journey navigator
    if (journeyRef.current) {
      gsap.fromTo(journeyRef.current,
        { opacity: 0, x: 50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          ease: "power2.out", 
          delay: 1.2 
        }
      );
    }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-blue-100' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              ref={logoRef}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => scrollToSection('#home')}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                🏥
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  isScrolled ? 'text-gray-800' : 'text-white'
                }`}>
                  ClinicStreams
                </h1>
                <p className={`text-xs font-medium transition-colors duration-300 ${
                  isScrolled ? 'text-blue-600' : 'text-blue-200'
                }`}>
                  Healthcare Technology
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav ref={navRef} className="hidden lg:flex items-center space-x-1 relative">
              {/* Navigation Indicator */}
              <div
                ref={indicatorRef}
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full"
                style={{ width: 0 }}
              />
              
              {navigationItems.map((item, index) => (
                <button
                  key={item.href}
                  className={`nav-item px-4 py-2 rounded-lg font-medium transition-all duration-300 group relative ${
                    activeItem === item.href
                      ? isScrolled 
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-blue-200 bg-white/10'
                      : isScrolled
                        ? 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => scrollToSection(item.href)}
                  onMouseEnter={() => handleNavItemHover(index, true)}
                  onMouseLeave={() => handleNavItemHover(index, false)}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-sm group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </span>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </nav>

            {/* Healthcare Journey Navigator - Integrated */}
            <div 
              ref={journeyRef}
              className="hidden md:flex lg:hidden xl:flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20"
            >
              {/* Journey Progress Bar */}
              <div className="relative w-24 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  ref={progressBarRef}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-300"
                  style={{ width: '0%' }}
                />
              </div>
              
              {/* Current Step Indicator */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white text-sm animate-pulse">
                  {journeySteps.find(step => step.id === currentJourneyStep)?.icon}
                </div>
                <div className="text-white/90 text-sm font-medium">
                  {journeySteps.find(step => step.id === currentJourneyStep)?.title}
                </div>
              </div>
              
              {/* Journey Steps Mini Indicators */}
              <div className="flex space-x-1">
                {journeySteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      step.completed 
                        ? 'bg-green-400 scale-125' 
                        : step.active 
                          ? 'bg-blue-400 scale-110 animate-pulse' 
                          : 'bg-white/30 scale-100'
                    }`}
                    title={step.description}
                  />
                ))}
              </div>
              
              {/* Progress Percentage */}
              <div className="text-white/70 text-xs font-mono">
                {Math.round(journeyProgress * 100)}%
              </div>
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center space-x-4">
              <button className={`btn-ghost transition-colors duration-300 ${
                isScrolled ? 'text-gray-600 hover:bg-gray-100' : 'text-white hover:bg-white/10'
              }`}>
                Sign In
              </button>
              <button className="btn-primary bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-6 py-2 rounded-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Get Demo
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center space-x-3">
              {/* Mobile Journey Indicator */}
              <div className="md:hidden flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center text-white text-xs">
                  {journeySteps.find(step => step.id === currentJourneyStep)?.icon}
                </div>
                <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full transition-all duration-300"
                    style={{ width: `${journeyProgress * 100}%` }}
                  />
                </div>
              </div>
              
              <button
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                isScrolled 
                  ? 'text-gray-600 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={handleMobileMenuToggle}
              >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`} />
                <div className={`w-full h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <div className={`w-full h-0.5 bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`} />
              </div>
              </button>
            </div>
          </div>
          
          {/* Enhanced Journey Navigator for Large Screens */}
          <div className="hidden xl:block mt-4 bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60 uppercase tracking-wide font-medium">
                Healthcare Journey Navigator
              </div>
              <div className="text-xs text-white/70 font-mono">
                {Math.round(journeyProgress * 100)}% Complete
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              {journeySteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-2 group">
                  <div className={`w-10 h-10 rounded-full border-2 transition-all duration-500 flex items-center justify-center text-sm ${
                    step.completed 
                      ? 'bg-green-500 border-green-400 text-white shadow-lg scale-110' 
                      : step.active 
                        ? 'bg-blue-500 border-blue-400 text-white shadow-lg animate-pulse scale-105' 
                        : 'bg-white/10 border-white/30 text-white/60 scale-100'
                  }`}>
                    {step.icon}
                  </div>
                  
                  <div className="text-center">
                    <div className={`text-xs font-medium transition-colors duration-300 ${
                      step.active ? 'text-blue-300' : step.completed ? 'text-green-300' : 'text-white/60'
                    }`}>
                      {step.title}
                    </div>
                    
                    {/* Connection Line */}
                    {index < journeySteps.length - 1 && (
                      <div className="absolute top-5 left-10 w-8 h-0.5 bg-white/20 transform -translate-y-1/2">
                        <div 
                          className={`h-full bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-500 ${
                            step.completed ? 'w-full' : 'w-0'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Overall Progress Bar */}
            <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 rounded-full transition-all duration-300"
                style={{ width: `${journeyProgress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 group"
                    onClick={() => scrollToSection(item.href)}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {/* Mobile Journey Status */}
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-800">Journey Progress</span>
                      <span className="text-xs text-blue-600 font-mono">{Math.round(journeyProgress * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-300"
                        style={{ width: `${journeyProgress * 100}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between">
                      {journeySteps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center ${
                            step.completed 
                              ? 'bg-green-500 text-white' 
                              : step.active 
                                ? 'bg-blue-500 text-white animate-pulse' 
                                : 'bg-gray-200 text-gray-500'
                          }`}>
                            {step.icon}
                          </div>
                          <span className="text-xs mt-1 text-blue-700">{step.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <button className="w-full btn-ghost mb-3 justify-center">
                    Sign In
                  </button>
                  <button className="w-full btn-primary bg-gradient-to-r from-blue-500 to-teal-500 justify-center">
                    Get Demo
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};
