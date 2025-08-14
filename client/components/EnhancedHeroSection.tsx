import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface HeroFeature {
  icon: string;
  title: string;
  description: string;
}

const heroFeatures: HeroFeature[] = [
  {
    icon: '👥',
    title: 'Patient Management',
    description: 'Comprehensive patient records and care coordination'
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    description: 'Data-driven insights for better healthcare decisions'
  },
  {
    icon: '🛡️',
    title: 'HIPAA Compliant',
    description: 'Enterprise-grade security and compliance'
  },
  {
    icon: '⚡',
    title: 'Fast Performance',
    description: 'Lightning-fast response times and reliability'
  }
];

export const EnhancedHeroSection = () => {
  const heroRef = useRef<HTMLSectionElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline();

    // Background animation
    if (backgroundRef.current) {
      timeline.fromTo(backgroundRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: "power2.out" }
      );
    }

    // Title animation with typewriter effect
    if (titleRef.current) {
      const titleText = titleRef.current.textContent || '';
      titleRef.current.textContent = '';
      
      timeline.to({}, { duration: 0.5 }) // Wait for background
        .call(() => {
          gsap.to(titleRef.current, {
            duration: 2,
            text: titleText,
            ease: "none",
            onComplete: () => setIsVisible(true)
          });
        });

      // Title entrance animation
      timeline.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=2"
      );
    }

    // Subtitle animation
    if (subtitleRef.current) {
      timeline.fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=1.5"
      );
    }

    // CTA buttons animation
    if (ctaRef.current) {
      const buttons = ctaRef.current.querySelectorAll('button');
      timeline.fromTo(buttons,
        { y: 20, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          ease: "back.out(1.7)", 
          stagger: 0.2 
        },
        "-=1"
      );
    }

    // Features animation
    if (featuresRef.current) {
      const featureCards = featuresRef.current.querySelectorAll('.feature-card');
      timeline.fromTo(featureCards,
        { y: 40, opacity: 0, rotationY: -15 },
        { 
          y: 0, 
          opacity: 1, 
          rotationY: 0, 
          duration: 0.8, 
          ease: "power2.out", 
          stagger: 0.1 
        },
        "-=0.5"
      );
    }
  }, []);

  const handleGetDemo = () => {
    // Add pulse animation to button
    if (ctaRef.current) {
      const primaryButton = ctaRef.current.querySelector('.btn-primary');
      gsap.to(primaryButton, {
        scale: 1.05,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  const handleWatchDemo = () => {
    // Add ripple effect
    if (ctaRef.current) {
      const secondaryButton = ctaRef.current.querySelector('.btn-secondary');
      gsap.to(secondaryButton, {
        scale: 1.02,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-teal-50"
    >
      {/* Animated Background */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-teal-600/10"
      >
        {/* Floating Medical Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Medical Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full bg-grid-pattern bg-repeat" 
               style={{ backgroundSize: '40px 40px' }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        {/* Main Content */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Subtitle Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-100/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-blue-200">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>The Future of Healthcare Technology</span>
          </div>

          {/* Main Title */}
          <h1
            ref={titleRef}
            className="text-hero text-gray-900 mb-6 leading-tight"
          >
            Transform Healthcare with Intelligent Technology
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-body-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Streamline patient care, optimize operations, and enhance outcomes with our comprehensive healthcare management platform designed for modern medical practices.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={handleGetDemo}
              className="btn-primary bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="flex items-center space-x-2">
                <span>Get Free Demo</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
            </button>
            
            <button
              onClick={handleWatchDemo}
              className="btn-secondary border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="flex items-center space-x-2">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                  ▶
                </span>
                <span>Watch Demo</span>
              </span>
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              <span>ISO 27001 Certified</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
              <span>99.9% Uptime SLA</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {heroFeatures.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-heading-4 text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-body-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-blue-400 rounded-full mt-2 animate-pulse" />
          </div>
          <p className="text-xs text-gray-500 mt-2">Scroll to explore</p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-teal-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute top-1/2 right-20 w-16 h-16 bg-purple-200/30 rounded-full blur-xl animate-pulse" />
    </section>
  );
};

/* Add custom CSS for grid pattern */
const gridPatternCSS = `
.bg-grid-pattern {
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
}
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = gridPatternCSS;
  document.head.appendChild(style);
}
