import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { LiquidMorphButton } from "./VisuallyStunningComponents";

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const navigationItems: NavigationItem[] = [
  { id: "home", label: "Home", icon: "🏠", href: "#home" },
  { id: "features", label: "Features", icon: "✨", href: "#features" },
  { id: "dashboard", label: "Dashboard", icon: "📊", href: "#dashboard" },
  { id: "analytics", label: "Analytics", icon: "🧬", href: "#analytics" },
  { id: "contact", label: "Contact", icon: "📞", href: "#contact" },
];

export const AnimatedNavigation: React.FC = () => {
  const navRef = useRef<HTMLNavElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [activeItem, setActiveItem] = useState("home");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    const logo = logoRef.current;
    if (!nav || !logo) return;

    // Initial animation
    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "back.out(1.7)", delay: 0.5 },
    );

    gsap.fromTo(
      logo,
      { scale: 0, rotation: -180 },
      {
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "elastic.out(1, 0.3)",
        delay: 0.7,
      },
    );

    // Scroll effect
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);

        gsap.to(nav, {
          backdropFilter: scrolled ? "blur(20px)" : "blur(10px)",
          backgroundColor: scrolled
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(0, 0, 0, 0.4)",
          duration: 0.3,
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolled]);

  const handleNavClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-lg bg-black/40 border-b border-white/20"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Animated Logo */}
        <div ref={logoRef} className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🏥</span>
            </div>
            {/* Holographic ring */}
            <div className="absolute inset-0 rounded-xl border-2 border-cyan-400/50 animate-ping" />
            <div className="absolute inset-0 rounded-xl border border-purple-400/30 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              ClinicStreams
            </h1>
            <p className="text-xs text-white/60">Quantum Healthcare</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-2">
          {navigationItems.map((item, index) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeItem === item.id}
              onClick={() => handleNavClick(item.id)}
              index={index}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <LiquidMorphButton variant="holographic" size="sm">
            🚀 Get Started
          </LiquidMorphButton>
        </div>

        {/* Mobile Menu Button */}
        <MobileMenuButton />
      </div>
    </nav>
  );
};

// Individual Navigation Item Component
const NavItem: React.FC<{
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
  index: number;
}> = ({ item, isActive, onClick, index }) => {
  const itemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const element = itemRef.current;
    if (!element) return;

    // Entrance animation
    gsap.fromTo(
      element,
      { opacity: 0, y: -20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)",
        delay: 1 + index * 0.1,
      },
    );

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.1,
        y: -2,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index]);

  return (
    <button
      ref={itemRef}
      onClick={onClick}
      className={`
        relative px-4 py-2 rounded-lg font-medium transition-all duration-300
        ${
          isActive
            ? "text-cyan-400 bg-white/10 shadow-lg"
            : "text-white/80 hover:text-white hover:bg-white/5"
        }
      `}
    >
      {/* Active indicator */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 to-purple-500/20 border border-cyan-400/50" />
      )}

      <span className="relative z-10 flex items-center space-x-2">
        <span className="text-lg">{item.icon}</span>
        <span>{item.label}</span>
      </span>

      {/* Holographic glow for active item */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/10 to-purple-500/10 animate-pulse" />
      )}
    </button>
  );
};

// Mobile Menu Button with Animation
const MobileMenuButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <button
      ref={buttonRef}
      onClick={toggleMenu}
      className="md:hidden p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300"
    >
      <div className="w-6 h-6 flex flex-col justify-center space-y-1">
        <div
          className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "rotate-45 translate-y-1" : ""}`}
        />
        <div
          className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}
        />
        <div
          className={`w-full h-0.5 bg-white transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-1" : ""}`}
        />
      </div>
    </button>
  );
};

// Floating Action Menu
export const FloatingActionMenu: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: "🚨", label: "Emergency", color: "from-red-500 to-pink-600" },
    { icon: "💬", label: "Support", color: "from-blue-500 to-cyan-600" },
    { icon: "📊", label: "Analytics", color: "from-purple-500 to-indigo-600" },
    { icon: "⚙️", label: "Settings", color: "from-gray-500 to-slate-600" },
  ];

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    // Entrance animation
    gsap.fromTo(
      menu,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 2 },
    );
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);

    const actionButtons = menuRef.current?.querySelectorAll(".action-btn");
    if (actionButtons) {
      actionButtons.forEach((btn, index) => {
        gsap.to(btn, {
          scale: isOpen ? 0 : 1,
          y: isOpen ? 0 : -(index + 1) * 60,
          opacity: isOpen ? 0 : 1,
          duration: 0.3,
          ease: "back.out(1.7)",
          delay: index * 0.05,
        });
      });
    }
  };

  return (
    <div ref={menuRef} className="fixed bottom-8 right-8 z-40">
      {/* Action Buttons */}
      {actions.map((action, index) => (
        <div
          key={index}
          className="action-btn absolute bottom-0 right-0 mb-4 opacity-0 scale-0"
        >
          <button
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${action.color} flex items-center justify-center text-white shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300`}
          >
            <span className="text-xl">{action.icon}</span>
          </button>
          <span className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-black/80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            {action.label}
          </span>
        </div>
      ))}

      {/* Main Toggle Button */}
      <button
        onClick={toggleMenu}
        className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-2xl hover:shadow-cyan-500/50 transform hover:scale-110 transition-all duration-300"
      >
        <span
          className={`text-2xl transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
        >
          {isOpen ? "✕" : "✨"}
        </span>
      </button>
    </div>
  );
};

// Breadcrumb Navigation with Animation
export const AnimatedBreadcrumb: React.FC<{
  items: { label: string; href?: string }[];
}> = ({ items }) => {
  const breadcrumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const breadcrumb = breadcrumbRef.current;
    if (!breadcrumb) return;

    const breadcrumbItems = breadcrumb.querySelectorAll(".breadcrumb-item");
    gsap.fromTo(
      breadcrumbItems,
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.3,
      },
    );
  }, [items]);

  return (
    <div
      ref={breadcrumbRef}
      className="flex items-center space-x-2 text-sm text-white/70"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="breadcrumb-item flex items-center space-x-2"
        >
          {index > 0 && (
            <span className="text-white/40">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          )}
          {item.href ? (
            <a
              href={item.href}
              className="hover:text-cyan-400 transition-colors duration-200"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-white">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default {
  AnimatedNavigation,
  FloatingActionMenu,
  AnimatedBreadcrumb,
};
