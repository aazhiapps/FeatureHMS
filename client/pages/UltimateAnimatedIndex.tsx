import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UltimateAnimationEngine } from '../components/animations/UltimateAnimationEngine';
import {
  LiquidMorphButton,
  MorphingCard,
  FloatingHealthcareModule,
  AnimatedHealthcareStats,
  ParticleDNAHelix
} from '../components/animations/VisuallyStunningComponents';
import { AnimatedNavigation, FloatingActionMenu } from '../components/animations/AnimatedNavigation';
import { PerformanceMonitor, useGPUPerformance, useReducedMotion } from '../components/animations/PerformanceMonitor';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Healthcare modules data
const healthcareModules = [
  {
    icon: '🏥',
    title: 'Patient Management',
    description: 'AI-powered patient care coordination',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: '🧬',
    title: 'DNA Analytics',
    description: 'Genomic data analysis and insights',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: '🔬',
    title: 'Lab Integration',
    description: 'Real-time laboratory management',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: '💊',
    title: 'Pharmacy System',
    description: 'Automated medication management',
    color: 'from-orange-500 to-red-500'
  },
  {
    icon: '📊',
    title: 'Analytics Dashboard',
    description: 'Predictive healthcare analytics',
    color: 'from-teal-500 to-blue-500'
  },
  {
    icon: '🚑',
    title: 'Emergency Response',
    description: 'Critical care coordination',
    color: 'from-red-500 to-pink-500'
  }
];

// Animated Background with Floating Particles
const AnimatedBackground: React.FC = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;

    // Create floating medical particles
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'absolute rounded-full opacity-20';
      particle.style.width = `${Math.random() * 6 + 2}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.background = `hsl(${200 + Math.random() * 60}, 70%, 60%)`;
      
      bg.appendChild(particle);

      // Animate particle
      gsap.to(particle, {
        y: -window.innerHeight - 100,
        duration: 10 + Math.random() * 10,
        ease: 'none',
        repeat: -1,
        delay: Math.random() * 10
      });
    }

    return () => {
      bg.innerHTML = '';
    };
  }, []);

  return (
    <div 
      ref={bgRef}
      className="fixed inset-0 z-0 overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    />
  );
};

// Hero Section with Liquid Text Animation
const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    // Split text into spans for character animation
    const text = title.textContent || '';
    title.innerHTML = text.split('').map((char, i) => 
      `<span class="inline-block" style="animation-delay: ${i * 0.05}s">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    // Animate each character
    const chars = title.querySelectorAll('span');
    gsap.fromTo(chars, 
      { 
        y: 100, 
        opacity: 0,
        rotationX: -90,
        transformOrigin: '50% 50% -50px'
      },
      { 
        y: 0, 
        opacity: 1,
        rotationX: 0,
        duration: 1,
        ease: 'back.out(1.7)',
        stagger: 0.05
      }
    );

    // Floating animation for title
    gsap.to(title, {
      y: -10,
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle DNA Helix Background */}
      <div className="absolute inset-0">
        <ParticleDNAHelix />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-8xl lg:text-9xl font-light mb-8 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
        >
          ClinicStreams
        </h1>
        
        <div className="mb-8">
          <MorphingCard variant="holographic" className="inline-block">
            <p className="text-2xl md:text-3xl text-white/90 font-light">
              The Future of Healthcare Technology
            </p>
          </MorphingCard>
        </div>

        <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
          Experience next-generation healthcare management with AI-powered analytics, 
          quantum-encrypted patient data, and holographic visualization systems.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <LiquidMorphButton variant="holographic" size="xl">
            🚀 Launch Experience
          </LiquidMorphButton>
          
          <LiquidMorphButton variant="medical" size="xl">
            🧬 Explore DNA Analytics
          </LiquidMorphButton>
          
          <LiquidMorphButton variant="primary" size="xl">
            📊 View Dashboard
          </LiquidMorphButton>
        </div>

        {/* Animated Stats */}
        <div className="mt-16">
          <AnimatedHealthcareStats />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
        </div>
        <p className="text-white/50 text-sm mt-2 text-center">Scroll to explore</p>
      </div>
    </section>
  );
};

// Features Section with Morphing Cards
const FeaturesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate section entrance
    gsap.fromTo(section,
      { opacity: 0, y: 100 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 1, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Revolutionary Healthcare Modules
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Experience the next evolution of medical technology with our quantum-powered healthcare ecosystem
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {healthcareModules.map((module, index) => (
            <MorphingCard 
              key={index} 
              variant={index % 2 === 0 ? 'neon' : 'holographic'}
              className="group cursor-pointer hover:scale-105 transition-all duration-500"
            >
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center text-3xl shadow-2xl transform group-hover:rotate-12 transition-transform duration-500`}>
                  {module.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                  {module.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {module.description}
                </p>
              </div>
            </MorphingCard>
          ))}
        </div>
      </div>
    </section>
  );
};

// Interactive Dashboard Preview
const DashboardPreview: React.FC = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [activeMetric, setActiveMetric] = useState(0);

  const metrics = [
    { label: 'Patient Flow', value: '98.2%', color: 'from-green-400 to-emerald-600' },
    { label: 'System Efficiency', value: '99.9%', color: 'from-blue-400 to-cyan-600' },
    { label: 'AI Accuracy', value: '99.7%', color: 'from-purple-400 to-pink-600' },
    { label: 'Response Time', value: '0.3s', color: 'from-orange-400 to-red-600' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [metrics.length]);

  return (
    <section ref={dashboardRef} className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Holographic Dashboard
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Real-time healthcare analytics with quantum-powered insights and predictive AI
          </p>
        </div>

        {/* Dashboard Mockup */}
        <MorphingCard variant="holographic" className="relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Metrics Display */}
            <div className="space-y-6">
              {metrics.map((metric, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-xl transition-all duration-500 ${
                    activeMetric === index ? 'bg-white/20 scale-105' : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white/80">{metric.label}</span>
                    <span className={`text-2xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent`}>
                      {metric.value}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-1000 ${
                        activeMetric === index ? 'w-full' : 'w-0'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 3D Visualization */}
            <div className="relative h-96">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm">
                <div className="absolute inset-4 border border-cyan-400/50 rounded-xl">
                  {/* Animated Grid */}
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
                        style={{ top: `${i * 10}%` }}
                      />
                    ))}
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div 
                        key={i}
                        className="absolute h-full w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent"
                        style={{ left: `${i * 10}%` }}
                      />
                    ))}
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-pulse">🧬</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MorphingCard>
      </div>
    </section>
  );
};

// Floating Healthcare Modules
const FloatingModules: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {healthcareModules.map((module, index) => (
        <FloatingHealthcareModule
          key={index}
          {...module}
          index={index}
        />
      ))}
    </div>
  );
};

// Main Ultimate Animated Index
export const UltimateAnimatedIndex: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const isGPUAccelerated = useGPUPerformance();
  const prefersReducedMotion = useReducedMotion();

  // Adaptive animation settings based on performance
  const animationConfig = {
    particleCount: isGPUAccelerated ? (prefersReducedMotion ? 10 : 50) : 20,
    enableComplexAnimations: isGPUAccelerated && !prefersReducedMotion,
    animationDuration: prefersReducedMotion ? 0.2 : 1.2
  };

  useEffect(() => {
    // Set CSS custom properties for performance
    document.documentElement.style.setProperty(
      '--animation-duration',
      `${animationConfig.animationDuration}s`
    );

    if (!animationConfig.enableComplexAnimations) {
      document.documentElement.classList.add('reduced-animations');
    }

    // Smooth scrolling with performance consideration
    if (animationConfig.enableComplexAnimations) {
      const lenis = new (window as any).Lenis({
        duration: animationConfig.animationDuration,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }
  }, [animationConfig]);

  return (
    <UltimateAnimationEngine>
      <div ref={mainRef} className="relative min-h-screen overflow-x-hidden">
        {/* Performance Monitor */}
        <PerformanceMonitor />

        {/* Animated Navigation */}
        <AnimatedNavigation />

        {/* Animated Background */}
        <AnimatedBackground />

        {/* Floating Modules - only if GPU accelerated */}
        {animationConfig.enableComplexAnimations && <FloatingModules />}

        {/* Floating Action Menu */}
        <FloatingActionMenu />

        {/* Main Content */}
        <main className="relative z-10">
          <HeroSection />
          <FeaturesSection />
          <DashboardPreview />

          {/* Call to Action */}
          <section className="relative py-32 px-6 text-center">
            <MorphingCard variant="neon" className="max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-light mb-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
                Join the quantum revolution in medical technology and experience the future of patient care.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <LiquidMorphButton variant="holographic" size="xl">
                  🚀 Start Your Journey
                </LiquidMorphButton>
                <LiquidMorphButton variant="medical" size="xl">
                  📞 Schedule Demo
                </LiquidMorphButton>
              </div>
            </MorphingCard>
          </section>

          {/* Footer with Additional Links */}
          <footer className="relative py-16 px-6 border-t border-white/10">
            <div className="max-w-7xl mx-auto text-center">
              <div className="mb-8">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  Experience Different Versions
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                  <LiquidMorphButton
                    variant="primary"
                    size="sm"
                    onClick={() => window.location.href = '/?version=ultimate'}
                  >
                    🌟 Ultimate (Current)
                  </LiquidMorphButton>
                  <LiquidMorphButton
                    variant="secondary"
                    size="sm"
                    onClick={() => window.location.href = '/?version=enhanced'}
                  >
                    ⚡ Enhanced
                  </LiquidMorphButton>
                  <LiquidMorphButton
                    variant="medical"
                    size="sm"
                    onClick={() => window.location.href = '/?version=original'}
                  >
                    🔧 Original
                  </LiquidMorphButton>
                </div>
              </div>

              <p className="text-white/60 text-sm">
                © 2024 ClinicStreams - Quantum Healthcare Technology Platform
              </p>
              <p className="text-white/40 text-xs mt-2">
                Powered by Ultimate Animation Engine™ | GPU-Accelerated | 60fps Optimized
              </p>
            </div>
          </footer>
        </main>
      </div>
    </UltimateAnimationEngine>
  );
};

export default UltimateAnimatedIndex;
