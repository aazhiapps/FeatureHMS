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
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const headerRef = useRef<HTMLDivElement>(null);
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
    if (!headerRef.current) return;

    // Animate header entrance
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
    );

    // Animate navigation items
    if (navRef.current) {
      const navItems = navRef.current.querySelectorAll(".nav-item");
      gsap.fromTo(
        navItems,
        { opacity: 0, y: -10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.05,
          delay: 0.3,
        },
      );
    }
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
          {/* Simplified Header Content */}
          <div className="header-content flex items-center justify-between">
            {/* Navigation with integrated journey steps */}
            <nav
              ref={navRef}
              className="flex items-center space-x-4 relative"
            >
              {/* Navigation Indicator */}
              <div
                ref={indicatorRef}
                className="absolute bottom-0 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"
                style={{ width: 0 }}
              />

              {navigationItems.map((item, index) => {
                const correspondingStep = steps.find(s =>
                  (item.href === "#journey" && s.id === "journey") ||
                  (item.href === "#compare" && s.id === "comparison") ||
                  (item.href === "#demo" && s.id === "demo")
                );

                const isCompleted = correspondingStep?.completed;
                const isActive = correspondingStep?.active;

                return (
                  <button
                    key={item.href}
                    className={`nav-item px-3 py-1.5 rounded-md font-medium transition-all duration-300 group relative flex items-center space-x-2 ${
                      isActive
                        ? "text-white bg-white/10"
                        : isCompleted
                        ? "text-green-300 hover:text-white hover:bg-white/5"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => handleNavItemClick(item)}
                    onMouseEnter={() => handleNavItemHover(index, true)}
                    onMouseLeave={() => handleNavItemHover(index, false)}
                  >
                    <span className="text-sm group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span className="text-sm font-medium">{item.label}</span>

                    {/* Completion indicator */}
                    {isCompleted && !isActive && (
                      <span className="text-xs text-green-400">✓</span>
                    )}

                    {/* Active indicator */}
                    {isActive && (
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                    )}

                    {/* Hover effect */}
                    <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                );
              })}
            </nav>

            {/* Live Status */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-300 font-medium">Live</span>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden ml-4 p-1.5 rounded-md text-white hover:bg-white/10 transition-all duration-300"
                onClick={handleMobileMenuToggle}
              >
                <div className="w-4 h-4 flex flex-col justify-center space-y-0.5">
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
