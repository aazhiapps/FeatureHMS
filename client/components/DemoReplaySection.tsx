import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { InteractiveButton, InteractiveCard } from "./InteractiveButton";
import { MedicineBurstEffect } from "./MedicineWaveEffect";

interface DemoReplaySectionProps {
  onReplay?: () => void;
  onDemo?: () => void;
  features: Array<{
    id: string;
    title: string;
    icon: string;
    color: string;
    category: string;
  }>;
}

export const DemoReplaySection = ({ onReplay, onDemo, features }: DemoReplaySectionProps) => {
  const [animationPlaying, setAnimationPlaying] = useState(false);
  const [burstTrigger, setBurstTrigger] = useState(false);
  const [burstPosition, setBurstPosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Initial animation setup
    gsap.set([statsRef.current, buttonsRef.current], {
      opacity: 0,
      y: 50,
      scale: 0.9
    });

    // Animate in when section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(statsRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "back.out(1.7)"
            });

            gsap.to(buttonsRef.current, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              delay: 0.3,
              ease: "back.out(1.7)"
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, []);

  const handleReplay = () => {
    setAnimationPlaying(true);
    
    // Trigger medicine burst effect
    setBurstPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setBurstTrigger(prev => !prev);

    // Scroll to top with smooth animation
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        setAnimationPlaying(false);
        onReplay?.();
      }
    });

    // Add visual feedback
    if (buttonsRef.current) {
      gsap.fromTo(buttonsRef.current, 
        { scale: 1 },
        { 
          scale: 1.05,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: "power2.out"
        }
      );
    }
  };

  const handleDemo = () => {
    // Trigger medicine burst at button position
    const demoButton = document.getElementById('demo-button');
    if (demoButton) {
      const rect = demoButton.getBoundingClientRect();
      setBurstPosition({ 
        x: rect.left + rect.width / 2, 
        y: rect.top + rect.height / 2 
      });
      setBurstTrigger(prev => !prev);
    }

    onDemo?.();
  };

  const journeyStats = [
    { label: "Features Explored", value: features.length, color: "text-green-400", icon: "🎯" },
    { label: "Journey Complete", value: "100%", color: "text-blue-400", icon: "✅" },
    { label: "Time Invested", value: "Well Spent", color: "text-purple-400", icon: "⏰" },
    { label: "Healthcare Innovation", value: "Discovered", color: "text-cyan-400", icon: "🚀" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 md:py-32 px-4 md:px-6 relative z-10 min-h-screen flex items-center bg-gradient-to-b from-transparent via-blue-900/30 to-blue-900/50"
    >
      <div className="max-w-6xl mx-auto w-full text-center">
        {/* Main Header */}
        <div className="mb-12 md:mb-16">
          <div className="text-6xl md:text-8xl mb-6 animate-bounce">
            🎊
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 bg-gradient-to-r from-white via-green-200 to-blue-200 bg-clip-text text-transparent px-4 leading-tight">
            Journey Complete!
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-4 max-w-3xl mx-auto">
            Congratulations! You've explored the complete ClinicStreams healthcare ecosystem.
          </p>
          <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto">
            Ready to see it in action or experience the journey again?
          </p>
        </div>

        {/* Journey Statistics */}
        <div ref={statsRef} className="mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center justify-center">
            <span className="mr-3">📊</span>
            Your Exploration Summary
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {journeyStats.map((stat, index) => (
              <InteractiveCard 
                key={index} 
                className="p-4 md:p-6 bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-xl border border-white/30"
                glowEffect={true}
              >
                <div className="text-3xl md:text-4xl mb-2">{stat.icon}</div>
                <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-white/80">
                  {stat.label}
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>

        {/* Feature Summary Grid */}
        <div className="mb-12 md:mb-16">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center justify-center">
            <span className="mr-3">🏥</span>
            Features You Discovered
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className="bg-gradient-to-br from-white/15 via-white/8 to-white/5 backdrop-blur-md rounded-xl p-3 md:p-4 border border-white/20 hover:border-white/40 transition-all duration-300 group"
              >
                <div className="text-2xl md:text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <div className="text-xs md:text-sm font-medium text-white/90 leading-tight">
                  {feature.title}
                </div>
                <div className="text-xs text-blue-300 mt-1 uppercase tracking-wide">
                  {feature.category}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div ref={buttonsRef} className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
            <InteractiveButton
              id="demo-button"
              variant="primary"
              size="xl"
              className="w-full sm:w-auto min-w-[200px] bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              magnetic={true}
              tilt={true}
              ripple={true}
              onClick={handleDemo}
            >
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-3">🚀</span>
                Schedule Live Demo
              </span>
            </InteractiveButton>

            <InteractiveButton
              variant="secondary"
              size="xl"
              className="w-full sm:w-auto min-w-[200px] border-2 border-white/30 hover:border-white/50"
              magnetic={true}
              tilt={true}
              ripple={true}
              onClick={handleReplay}
              disabled={animationPlaying}
            >
              <span className="flex items-center justify-center">
                <span className="text-2xl mr-3">
                  {animationPlaying ? "🔄" : "🔁"}
                </span>
                {animationPlaying ? "Replaying..." : "Replay Journey"}
              </span>
            </InteractiveButton>
          </div>

          {/* Additional Options */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <InteractiveButton
              variant="ghost"
              size="md"
              className="text-white/80 hover:text-white border border-white/20 hover:border-white/40"
              magnetic={true}
            >
              <span className="flex items-center">
                <span className="mr-2">📧</span>
                Contact Sales
              </span>
            </InteractiveButton>

            <InteractiveButton
              variant="ghost"
              size="md"
              className="text-white/80 hover:text-white border border-white/20 hover:border-white/40"
              magnetic={true}
            >
              <span className="flex items-center">
                <span className="mr-2">📚</span>
                Documentation
              </span>
            </InteractiveButton>

            <InteractiveButton
              variant="ghost"
              size="md"
              className="text-white/80 hover:text-white border border-white/20 hover:border-white/40"
              magnetic={true}
            >
              <span className="flex items-center">
                <span className="mr-2">💬</span>
                Support Chat
              </span>
            </InteractiveButton>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 backdrop-blur-lg rounded-2xl border border-white/30 max-w-4xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
            Ready to Transform Your Healthcare Organization?
          </h3>
          <p className="text-base md:text-lg text-white/90 mb-6">
            Join thousands of healthcare providers who are already revolutionizing patient care with ClinicStreams.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-sm font-medium text-white">Quick Setup</div>
              <div className="text-xs text-white/70">Deploy in 24 hours</div>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">🛡️</div>
              <div className="text-sm font-medium text-white">HIPAA Compliant</div>
              <div className="text-xs text-white/70">Enterprise security</div>
            </div>
            <div className="p-4">
              <div className="text-3xl mb-2">📞</div>
              <div className="text-sm font-medium text-white">24/7 Support</div>
              <div className="text-xs text-white/70">Always available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Medicine Burst Effect */}
      <MedicineBurstEffect
        trigger={burstTrigger}
        position={burstPosition}
      />
    </section>
  );
};
