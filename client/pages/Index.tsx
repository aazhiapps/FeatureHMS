import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EnhancedLoadingScreen } from '../components/EnhancedLoadingScreen';
import { ClinicStreamsJourney } from '../components/ClinicStreamsJourney';
import { ClinicStreamsProgress } from '../components/ClinicStreamsProgress';
import { ClinicStreamsContent } from '../components/ClinicStreamsContent';
import { SmoothScrollController } from '../components/SmoothScrollController';

gsap.registerPlugin(ScrollTrigger);

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // ClinicStreams 3D features data for medical journey
  const clinicFeatures = [
    {
      title: "Real-Time Patient Monitoring",
      description: "Advanced IoT sensors and AI-powered analytics for continuous health monitoring",
      category: "monitoring",
      position: [8, 5, -10] as [number, number, number]
    },
    {
      title: "Healthcare Analytics",
      description: "Machine learning algorithms for predictive health insights and treatment optimization",
      category: "analytics",
      position: [-5, 8, -20] as [number, number, number]
    },
    {
      title: "Telemedicine Platform",
      description: "Secure video consultations and remote diagnosis capabilities",
      category: "telemedicine",
      position: [12, -3, -30] as [number, number, number]
    },
    {
      title: "Medical Device Integration",
      description: "Seamless integration with EHR systems and hospital infrastructure",
      category: "integration",
      position: [-8, 6, -40] as [number, number, number]
    }
  ];

  // UI features data for cards
  const features = [
    {
      id: 'monitoring',
      title: 'Real-Time Patient Monitoring',
      description: 'Advanced IoT sensors and AI-powered analytics provide continuous health monitoring, alerting healthcare providers instantly to any changes in patient condition.',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
      delay: 0.1
    },
    {
      id: 'telemedicine',
      title: 'Seamless Telemedicine',
      description: 'Connect patients with healthcare providers through high-quality video consultations, secure messaging, and remote diagnosis capabilities.',
      icon: '💻',
      color: 'from-green-500 to-emerald-500',
      delay: 0.2
    },
    {
      id: 'analytics',
      title: 'Healthcare Analytics',
      description: 'Powerful data analytics and machine learning algorithms help predict health trends, optimize treatment plans, and improve patient outcomes.',
      icon: '🧠',
      color: 'from-purple-500 to-violet-500',
      delay: 0.3
    },
    {
      id: 'integration',
      title: 'Medical Device Integration',
      description: 'Seamlessly integrate with existing medical devices, EHR systems, and hospital infrastructure for comprehensive care coordination.',
      icon: '🔗',
      color: 'from-orange-500 to-red-500',
      delay: 0.4
    }
  ];

  useEffect(() => {
    if (!featuresRef.current) return;

    // Animate features on scroll
    features.forEach((feature, index) => {
      const element = document.getElementById(`feature-${feature.id}`);
      if (element) {
        gsap.fromTo(element, 
          { 
            opacity: 0, 
            y: 100,
            scale: 0.8
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            delay: feature.delay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: element,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  if (isLoading) {
    return <EnhancedLoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <SmoothScrollController>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-800 relative">
        {/* 3D Medical Journey Background */}
        <ClinicStreamsJourney features={clinicFeatures} />

        {/* Progress Indicator */}
        <ClinicStreamsProgress features={clinicFeatures} />

        {/* Scroll-Triggered Content */}
        <ClinicStreamsContent />
      {/* Clean Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 relative">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            ClinicStreams
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300">
            Get Demo
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-32 px-6 text-center min-h-screen flex items-center relative z-10">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
            ClinicStreams
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8">
            The Future of Healthcare Technology
          </p>
          <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12">
            Revolutionizing patient care through AI-powered monitoring, seamless telemedicine, and intelligent healthcare analytics
          </p>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white/50 rounded-full mx-auto relative">
              <div className="w-1 h-3 bg-white/70 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
            </div>
            <p className="text-white/50 text-sm mt-2">Scroll to explore</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 px-6 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
              Explore Our Features
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Follow the medical drone journey to discover how ClinicStreams is transforming healthcare delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                id={`feature-${feature.id}`}
                className="group relative opacity-0"
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:shadow-2xl border border-white/20 overflow-hidden">
                  {/* 3D Discovery Indicator */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded transform rotate-45"></div>
                    </div>
                    <div className="text-xs text-white/60 mt-1 text-center">3D View</div>
                  </div>

                  {/* Feature Icon */}
                  <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {feature.icon}
                  </div>

                  {/* Feature Content */}
                  <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4 group-hover:text-blue-200 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-white/70 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Discovery Status */}
                  <div className="mt-4 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Discovered by Medical Drone</span>
                  </div>

                  {/* Hover Effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-8">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of healthcare providers revolutionizing patient care with ClinicStreams
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-full border border-white/30 hover:bg-white/20 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/20 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
            ClinicStreams
          </div>
          <p className="text-white/60">
            © 2024 ClinicStreams. Revolutionizing Healthcare Technology.
          </p>
        </div>
      </footer>
      </div>
    </SmoothScrollController>
  );
}
