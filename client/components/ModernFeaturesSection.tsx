import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  stats: { label: string; value: string }[];
  color: string;
}

const features: Feature[] = [
  {
    id: 'patient-management',
    icon: '👥',
    title: 'Smart Patient Management',
    description: 'Comprehensive patient records with AI-powered insights for personalized care and improved outcomes.',
    benefits: [
      'Centralized medical history',
      'Real-time health monitoring',
      'Automated care reminders',
      'Family access portal'
    ],
    stats: [
      { label: 'Patient Satisfaction', value: '98%' },
      { label: 'Data Accuracy', value: '99.9%' }
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'scheduling',
    icon: '📅',
    title: 'Intelligent Scheduling',
    description: 'AI-powered appointment scheduling that minimizes wait times and optimizes provider availability.',
    benefits: [
      'Automated scheduling',
      'Wait time optimization',
      'Multi-provider coordination',
      'Emergency slot management'
    ],
    stats: [
      { label: 'Booking Efficiency', value: '85%' },
      { label: 'No-show Reduction', value: '40%' }
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'analytics',
    icon: '📊',
    title: 'Advanced Analytics',
    description: 'Real-time dashboards and predictive analytics to drive data-informed healthcare decisions.',
    benefits: [
      'Predictive health modeling',
      'Population health insights',
      'Resource optimization',
      'Performance metrics'
    ],
    stats: [
      { label: 'Decision Speed', value: '3x faster' },
      { label: 'Cost Savings', value: '25%' }
    ],
    color: 'from-teal-500 to-teal-600'
  },
  {
    id: 'security',
    icon: '🛡️',
    title: 'Enterprise Security',
    description: 'HIPAA-compliant security infrastructure with advanced encryption and access controls.',
    benefits: [
      'End-to-end encryption',
      'Role-based access',
      'Audit trail logging',
      'Compliance monitoring'
    ],
    stats: [
      { label: 'Security Score', value: '99.8%' },
      { label: 'Compliance Rate', value: '100%' }
    ],
    color: 'from-red-500 to-red-600'
  },
  {
    id: 'integration',
    icon: '🔗',
    title: 'Seamless Integration',
    description: 'Connect with existing healthcare systems and third-party applications effortlessly.',
    benefits: [
      'API-first architecture',
      'Legacy system support',
      'Real-time sync',
      'Custom integrations'
    ],
    stats: [
      { label: 'Integration Time', value: '2 hours' },
      { label: 'System Compatibility', value: '95%' }
    ],
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'support',
    icon: '🎧',
    title: '24/7 Expert Support',
    description: 'Round-the-clock technical support from healthcare technology specialists.',
    benefits: [
      'Instant chat support',
      'Video troubleshooting',
      'Training resources',
      'Dedicated account manager'
    ],
    stats: [
      { label: 'Response Time', value: '<2 min' },
      { label: 'Resolution Rate', value: '99.5%' }
    ],
    color: 'from-orange-500 to-orange-600'
  }
];

export const ModernFeaturesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const featuresGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Title animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Feature cards animation
    if (featuresGridRef.current) {
      const cards = featuresGridRef.current.querySelectorAll('.feature-card');
      
      cards.forEach((card, index) => {
        gsap.fromTo(card,
          { 
            opacity: 0, 
            y: 60,
            scale: 0.9,
            rotationY: index % 2 === 0 ? -15 : 15
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );

        // Hover animations
        const cardElement = card as HTMLElement;
        cardElement.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -10,
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        cardElement.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-100/80 backdrop-blur-sm text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span>Comprehensive Healthcare Solutions</span>
          </div>
          
          <h2 className="text-heading-1 text-gray-900 mb-6">
            Everything you need to transform healthcare delivery
          </h2>
          
          <p className="text-body-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our integrated platform combines cutting-edge technology with healthcare expertise to streamline operations, improve patient outcomes, and enhance the overall care experience.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={featuresGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="feature-card bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group"
            >
              {/* Gradient Accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`} />
              
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-heading-3 text-gray-900 mb-4">
                {feature.title}
              </h3>
              
              <p className="text-body text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Benefits List */}
              <ul className="space-y-3 mb-6">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <li key={benefitIndex} className="flex items-center space-x-3 text-sm text-gray-600">
                    <div className={`w-5 h-5 bg-gradient-to-r ${feature.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                {feature.stats.map((stat, statIndex) => (
                  <div key={statIndex} className="text-center">
                    <div className={`text-2xl font-bold bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Hover Effect Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto">
            <h3 className="text-heading-2 text-gray-900 mb-4">
              Ready to transform your healthcare practice?
            </h3>
            <p className="text-body-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare providers who have already revolutionized their operations with ClinicStreams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Free Trial
              </button>
              <button className="btn-secondary border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
