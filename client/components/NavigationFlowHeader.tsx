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

interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
}

interface NavigationFlowHeaderProps {
  currentPage: "loading" | "autoscroll" | "journey" | "comparison" | "demo";
  onNavigate: (
    page: "loading" | "autoscroll" | "journey" | "comparison" | "demo",
  ) => void;
  autoHideOnScroll?: boolean;
}

const navigationItems: NavigationItem[] = [
  { label: "Features", href: "#features", icon: "🏥" },
  { label: "Journey", href: "#journey", icon: "🚀" },
  { label: "Compare", href: "#compare", icon: "🆚" },
  { label: "Demo", href: "#demo", icon: "🎯" },
];

export const NavigationFlowHeader = ({
  currentPage,
  onNavigate,
  autoHideOnScroll = true,
}: NavigationFlowHeaderProps) => {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [animatingPath, setAnimatingPath] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLNavElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const steps: NavigationStep[] = [
    {
      id: "loading",
      title: "Welcome",
      icon: "🚀",
      description: "Initial loading experience",
      completed: currentPage !== "loading",
      active: currentPage === "loading",
    },
    {
      id: "autoscroll",
      title: "Preview",
      icon: "📱",
      description: "Auto-scroll feature showcase",
      completed: ["journey", "comparison", "demo"].includes(currentPage),
      active: currentPage === "autoscroll",
    },
    {
      id: "journey",
      title: "Explore",
      icon: "🏥",
      description: "Interactive healthcare journey",
      completed: ["comparison", "demo"].includes(currentPage),
      active: currentPage === "journey",
    },
    {
      id: "comparison",
      title: "Compare",
      icon: "🆚",
      description: "Feature comparison analysis",
      completed: currentPage === "demo",
      active: currentPage === "comparison",
    },
    {
      id: "demo",
      title: "Demo",
      icon: "🎯",
      description: "Schedule consultation",
      completed: false,
      active: currentPage === "demo",
    },
  ];

  useEffect(() => {
    if (!headerRef.current || !pathRef.current) return;

    // Animate header entrance with enhanced effects
    gsap.fromTo(
      headerRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "back.out(1.7)" },
    );

    // Animate logo
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 0.3,
        },
      );
    }

    // Animate navigation items
    if (navRef.current) {
      const navItems = navRef.current.querySelectorAll(".nav-item");
      gsap.fromTo(
        navItems,
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          delay: 0.5,
        },
      );
    }

    // Animate progress path
    const path = pathRef.current;
    const pathLength = path.getTotalLength();
    const completedSteps = steps.filter((step) => step.completed).length;
    const progressPercent =
      (completedSteps + (steps.find((s) => s.active) ? 0.5 : 0)) / steps.length;

    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    gsap.to(path, {
      strokeDashoffset: pathLength * (1 - progressPercent),
      duration: 2,
      ease: "power2.out",
      delay: 0.8,
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
            ease: "power2.out",
          });
        }
      } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
        // Scrolling up or near top - show header
        if (isHidden) {
          setIsHidden(false);
          gsap.to(headerRef.current, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        }
      }

      setLastScrollY(currentScrollY);
    };

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [lastScrollY, isHidden, autoHideOnScroll]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);

    const content = headerRef.current?.querySelector(".header-content");
    const journeyFlow = headerRef.current?.querySelector(".journey-flow");

    if (!isMinimized) {
      // Minimize
      gsap.to(content, {
        height: 50,
        opacity: 0.8,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(journeyFlow, {
        opacity: 0,
        height: 0,
        duration: 0.3,
        ease: "power2.out",
      });
      gsap.to(toggleRef.current, {
        rotation: 180,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      // Maximize
      gsap.to(content, {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
      gsap.to(journeyFlow, {
        opacity: 1,
        height: "auto",
        duration: 0.3,
        delay: 0.2,
        ease: "power2.out",
      });
      gsap.to(toggleRef.current, {
        rotation: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleStepClick = (stepId: string) => {
    setAnimatingPath(true);

    // Animate path update
    if (pathRef.current) {
      const pathLength = pathRef.current.getTotalLength();
      const stepIndex = steps.findIndex((s) => s.id === stepId);
      const progressPercent = (stepIndex + 0.5) / steps.length;

      gsap.to(pathRef.current, {
        strokeDashoffset: pathLength * (1 - progressPercent),
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
          setAnimatingPath(false);
          onNavigate(stepId as any);
        },
      });
    } else {
      setTimeout(() => {
        setAnimatingPath(false);
        onNavigate(stepId as any);
      }, 300);
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);

    if (mobileMenuRef.current) {
      if (!isMobileMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, y: -20, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          },
        );
      } else {
        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  };

  const handleNavItemHover = (index: number, isEntering: boolean) => {
    if (indicatorRef.current && navRef.current) {
      const navItems = navRef.current.querySelectorAll(".nav-item");
      const targetItem = navItems[index] as HTMLElement;

      if (isEntering && targetItem) {
        const { offsetLeft, offsetWidth } = targetItem;
        gsap.to(indicatorRef.current, {
          x: offsetLeft,
          width: offsetWidth,
          duration: 0.3,
          ease: "power2.out",
        });
      } else if (!isEntering) {
        gsap.to(indicatorRef.current, {
          width: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  };

  const canNavigateTo = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentIndex = steps.findIndex((s) => s.id === currentPage);
    // Allow going back to any previous step or current step
    return stepIndex <= currentIndex + 1;
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveNavItem(href);
    }
    setIsMobileMenuOpen(false);
  };

  const handleNavItemClick = (item: NavigationItem) => {
    switch (item.href) {
      case "#journey":
        onNavigate("journey");
        break;
      case "#compare":
        onNavigate("comparison");
        break;
      case "#demo":
        onNavigate("demo");
        break;
      default:
        scrollToSection(item.href);
    }
  };

  return (
    <>
      <div
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl transition-all duration-300 ${
          isMinimized ? "py-2" : "py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Header Content */}
          <div className="header-content flex items-center justify-between">
            {/* Logo and Brand */}
            <div
              ref={logoRef}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onNavigate("journey")}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                🏥
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ClinicStreams</h1>
                <p className="text-xs text-blue-200">Healthcare Technology</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav
              ref={navRef}
              className="hidden md:flex items-center space-x-1 relative"
            >
              {/* Navigation Indicator */}
              <div
                ref={indicatorRef}
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"
                style={{ width: 0 }}
              />

              {navigationItems.map((item, index) => (
                <button
                  key={item.href}
                  className="nav-item px-3 py-2 rounded-lg font-medium transition-all duration-300 group relative text-white/80 hover:text-white hover:bg-white/10"
                  onClick={() => handleNavItemClick(item)}
                  onMouseEnter={() => handleNavItemHover(index, true)}
                  onMouseLeave={() => handleNavItemHover(index, false)}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-sm group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.label}</span>
                  </span>

                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-300">Live</span>
              </div>

              {/* CTA Button */}
              <button
                className="hidden md:block bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-4 py-2 rounded-lg font-semibold text-white text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() =>
                  window.open("https://calendly.com/clinicstreams-demo", "_blank")
                }
              >
                Get Demo
              </button>

              {/* Minimize/Maximize Toggle */}
              <button
                ref={toggleRef}
                onClick={toggleMinimize}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all duration-300 hover:scale-110"
                title={isMinimized ? "Expand Navigation" : "Minimize Navigation"}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white/70"
                >
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-all duration-300"
                onClick={handleMobileMenuToggle}
              >
                <div className="w-5 h-5 flex flex-col justify-center space-y-1">
                  <div
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 translate-y-1" : ""
                    }`}
                  />
                  <div
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : ""
                    }`}
                  />
                  <div
                    className={`w-full h-0.5 bg-current transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Journey Flow Progress - Collapsible */}
          {!isMinimized && (
            <div className="journey-flow mt-4">
              {/* Progress Path */}
              <div className="relative">
                <div className="absolute top-4 left-0 right-0 z-0">
                  <svg
                    width="100%"
                    height="4"
                    className="overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="pathGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <path
                      ref={pathRef}
                      d={`M 0,2 L ${window.innerWidth - 100},2`}
                      stroke="url(#pathGradient)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      className="drop-shadow-lg"
                    />
                    <path
                      d={`M 0,2 L ${window.innerWidth - 100},2`}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                {/* Journey Steps */}
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
                          onClick={() =>
                            isClickable && !animatingPath && handleStepClick(step.id)
                          }
                          disabled={!isClickable || animatingPath}
                          className={`
                            relative w-8 h-8 rounded-full border-2 transition-all duration-500 transform
                            flex items-center justify-center text-sm font-bold
                            ${
                              step.completed
                                ? "bg-gradient-to-br from-green-500 to-blue-500 border-green-400 text-white shadow-lg"
                                : step.active
                                ? "bg-gradient-to-br from-blue-500 to-purple-500 border-blue-400 text-white shadow-lg animate-pulse"
                                : "bg-white/10 border-white/30 text-white/60"
                            }
                            ${
                              isClickable && !animatingPath
                                ? "cursor-pointer hover:scale-110 hover:shadow-xl"
                                : !isClickable
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-wait"
                            }
                            ${isHovered && isClickable ? "scale-110 shadow-xl" : ""}
                          `}
                        >
                          <span className="relative z-10 text-xs">{step.icon}</span>

                          {/* Completion check */}
                          {step.completed && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                              ✓
                            </div>
                          )}

                          {/* Active indicator */}
                          {step.active && (
                            <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping" />
                          )}
                        </button>

                        {/* Step Info - Tooltip */}
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                          <div
                            className={`text-xs font-medium transition-colors duration-300 ${
                              step.active
                                ? "text-blue-300"
                                : step.completed
                                ? "text-green-300"
                                : "text-white/60"
                            }`}
                          >
                            {step.title}
                          </div>
                          <div
                            className={`text-xs mt-1 transition-opacity duration-300 ${
                              isHovered ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            <div className="bg-black/80 backdrop-blur-md rounded px-2 py-1 border border-white/20">
                              <div className="text-white/90 text-xs">
                                {step.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full left-0 right-0 bg-blue-900/95 backdrop-blur-xl border-t border-white/20 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-6 py-4">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <button
                    key={item.href}
                    className="flex items-center space-x-3 p-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                    onClick={() => handleNavItemClick(item)}
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}

                <div className="border-t border-white/20 pt-4 mt-4">
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 px-4 py-2 rounded-lg font-semibold text-white shadow-lg transition-all duration-300"
                    onClick={() =>
                      window.open(
                        "https://calendly.com/clinicstreams-demo",
                        "_blank",
                      )
                    }
                  >
                    Get Demo
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>

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
