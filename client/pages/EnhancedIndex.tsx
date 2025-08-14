import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EnhancedLoadingScreen } from "../components/EnhancedLoadingScreen";
import { AutoScrollFeatures } from "../components/AutoScrollFeatures";
import { AnimatedHeader } from "../components/AnimatedHeader";
import { EnhancedHeroSection } from "../components/EnhancedHeroSection";
import { ModernFeaturesSection } from "../components/ModernFeaturesSection";

gsap.registerPlugin(ScrollTrigger);

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function EnhancedIndex() {
  const [isLoading, setIsLoading] = useState(true);
  const [showAutoScroll, setShowAutoScroll] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  // Features data for loading screen and auto-scroll
  const features: Feature[] = [
    {
      id: 'management',
      title: 'Patient Management',
      description: 'Centralized patient records with comprehensive history, treatments, and visit tracking for personalized care.',
      icon: '👥',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'scheduling',
      title: 'Appointment Scheduling',
      description: 'Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows.',
      icon: '📅',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'records',
      title: 'Electronic Medical Records',
      description: 'Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility.',
      icon: '📋',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'billing',
      title: 'Billing & Insurance',
      description: 'Streamlined billing workflows with insurance verification and claims management for faster reimbursements.',
      icon: '💳',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'analytics',
      title: 'Real-time Analytics',
      description: 'Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions.',
      icon: '📊',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'resources',
      title: 'Resource Management',
      description: 'Optimize staff schedules, inventory, and facility resources to maximize operational efficiency.',
      icon: '⏰',
      color: 'from-teal-500 to-blue-500'
    },
    {
      id: 'security',
      title: 'Security Compliance',
      description: 'HIPAA-compliant security infrastructure with role-based access control and audit trails.',
      icon: '🛡️',
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'engagement',
      title: 'Patient Engagement',
      description: 'Patient portal for appointments, test results, and secure communication with healthcare providers.',
      icon: '💬',
      color: 'from-cyan-500 to-teal-500'
    }
  ];

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
    // Show auto-scroll after a brief delay
    setTimeout(() => {
      setShowAutoScroll(true);
    }, 1000);
  }, []);

  const handleAutoScrollComplete = useCallback(() => {
    setShowAutoScroll(false);
  }, []);

  useEffect(() => {
    if (!mainRef.current || isLoading || showAutoScroll) return;

    // Initialize scroll-triggered animations for the main content
    const initializeScrollAnimations = () => {
      // Smooth scroll reveal for sections
      const sections = mainRef.current?.querySelectorAll('section');
      sections?.forEach((section, index) => {
        gsap.fromTo(section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse"
            },
            delay: index * 0.1
          }
        );
      });

      // Parallax effects for background elements
      const parallaxElements = mainRef.current?.querySelectorAll('.parallax');
      parallaxElements?.forEach((element) => {
        gsap.to(element, {
          y: -100,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    };

    const timeout = setTimeout(initializeScrollAnimations, 500);
    
    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [isLoading, showAutoScroll]);

  // Loading screen
  if (isLoading) {
    return (
      <EnhancedLoadingScreen 
        onComplete={handleLoadingComplete} 
        features={features.map(f => ({
          id: f.id,
          title: f.title,
          icon: f.icon,
          color: f.color
        }))}
      />
    );
  }

  // Auto-scroll features presentation
  if (showAutoScroll) {
    return (
      <AutoScrollFeatures 
        features={features} 
        isActive={showAutoScroll} 
        onComplete={handleAutoScrollComplete}
      />
    );
  }

  // Main website content
  return (
    <div ref={mainRef} className="min-h-screen bg-white relative overflow-x-hidden">
      {/* Animated Header */}
      <AnimatedHeader />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      {/* Modern Features Section */}
      <ModernFeaturesSection />

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-teal-100/80 backdrop-blur-sm text-teal-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span>Trusted by Healthcare Leaders</span>
            </div>
            
            <h2 className="text-heading-1 text-gray-900 mb-6">
              What our customers say
            </h2>
            
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              Join thousands of healthcare providers who have transformed their practice with ClinicStreams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer",
                organization: "Metropolitan Health System",
                content: "ClinicStreams has revolutionized how we manage patient care. The efficiency gains are remarkable.",
                rating: 5,
                image: "👩‍⚕️"
              },
              {
                name: "Michael Chen",
                role: "IT Director",
                organization: "Regional Medical Center",
                content: "Implementation was seamless, and the support team is exceptional. Highly recommended.",
                rating: 5,
                image: "👨‍💼"
              },
              {
                name: "Dr. Maria Rodriguez",
                role: "Practice Manager",
                organization: "Family Care Clinic",
                content: "The analytics features have given us insights we never had before. Patient satisfaction is up 40%.",
                rating: 5,
                image: "👩‍⚕️"
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className="card hover-lift bg-white p-8 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-6">
                  {testimonial.image}
                </div>
                
                <div className="flex justify-center mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                
                <p className="text-body text-gray-600 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                  <p className="text-sm text-blue-600">{testimonial.organization}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100/80 backdrop-blur-sm text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Flexible Pricing Plans</span>
            </div>
            
            <h2 className="text-heading-1 text-gray-900 mb-6">
              Choose the right plan for your practice
            </h2>
            
            <p className="text-body-lg text-gray-600 max-w-3xl mx-auto">
              Scalable solutions designed to grow with your healthcare organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Starter",
                price: "$99",
                period: "per month",
                description: "Perfect for small practices",
                features: [
                  "Up to 500 patients",
                  "Basic scheduling",
                  "EMR access",
                  "Email support"
                ],
                color: "from-blue-500 to-blue-600",
                popular: false
              },
              {
                name: "Professional",
                price: "$299",
                period: "per month",
                description: "Ideal for growing practices",
                features: [
                  "Up to 2,500 patients",
                  "Advanced analytics",
                  "API integrations",
                  "Priority support",
                  "Custom workflows"
                ],
                color: "from-teal-500 to-teal-600",
                popular: true
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "contact us",
                description: "For large healthcare systems",
                features: [
                  "Unlimited patients",
                  "White-label solution",
                  "24/7 phone support",
                  "Custom integrations",
                  "Dedicated account manager"
                ],
                color: "from-purple-500 to-purple-600",
                popular: false
              }
            ].map((plan, index) => (
              <div
                key={index}
                className={`card hover-lift relative ${
                  plan.popular 
                    ? 'border-2 border-teal-500 shadow-2xl scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-xl flex items-center justify-center text-white text-xl mb-6`}>
                  {index === 0 ? '🏥' : index === 1 ? '⚡' : '🏢'}
                </div>
                
                <h3 className="text-heading-3 text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-body-sm text-gray-500 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-1">/{plan.period}</span>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg hover:shadow-xl'
                    : 'border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                }`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold">
                  🏥
                </div>
                <div>
                  <h3 className="text-xl font-bold">ClinicStreams</h3>
                  <p className="text-sm text-gray-400">Healthcare Technology</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Transforming healthcare through intelligent technology and innovative solutions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 ClinicStreams. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
