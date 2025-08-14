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

  // Helper function to get step status based on current page
  const getStepStatus = (pageId: string) => {
    const pageOrder = ["loading", "autoscroll", "journey", "comparison", "demo"];
    const currentIndex = pageOrder.indexOf(currentPage);
    const stepIndex = pageOrder.indexOf(pageId);

    return {
      completed: stepIndex < currentIndex,
      active: stepIndex === currentIndex
    };
  };

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
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-900/95 via-purple-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/20 shadow-2xl transition-all duration-300 py-2"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Simplified Header Content */}
          <div className="header-content flex items-center justify-between">
            {/* Logo */}
            <div
              ref={logoRef}
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => onNavigate("journey")}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                🏥
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-white">ClinicStreams</h1>
                <p className="text-xs text-blue-200">Healthcare Platform</p>
              </div>
            </div>

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
                const pageId = item.href === "#features" ? "autoscroll" :
                             item.href === "#journey" ? "journey" :
                             item.href === "#compare" ? "comparison" :
                             item.href === "#demo" ? "demo" : "";

                const { completed: isCompleted, active: isActive } = pageId ? getStepStatus(pageId) : { completed: false, active: false };

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
            <div className="max-w-7xl mx-auto px-6 py-3">
              <nav className="flex flex-col space-y-1">
                {navigationItems.map((item) => {
                  const pageId = item.href === "#features" ? "autoscroll" :
                               item.href === "#journey" ? "journey" :
                               item.href === "#compare" ? "comparison" :
                               item.href === "#demo" ? "demo" : "";

                  const { completed: isCompleted, active: isActive } = pageId ? getStepStatus(pageId) : { completed: false, active: false };

                  return (
                    <button
                      key={item.href}
                      className={`flex items-center space-x-3 p-2 rounded-md transition-all duration-300 group ${
                        isActive
                          ? "text-white bg-white/10"
                          : isCompleted
                          ? "text-green-300 hover:text-white hover:bg-white/5"
                          : "text-white/70 hover:text-white hover:bg-white/5"
                      }`}
                      onClick={() => handleNavItemClick(item)}
                    >
                      <span className="text-base group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.label}</span>

                      {/* Completion indicator */}
                      {isCompleted && !isActive && (
                        <span className="text-xs text-green-400 ml-auto">✓</span>
                      )}

                      {/* Active indicator */}
                      {isActive && (
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse ml-auto"></div>
                      )}
                    </button>
                  );
                })}
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
