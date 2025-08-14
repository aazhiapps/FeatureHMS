import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { InteractiveButton, InteractiveCard } from "./InteractiveButton";
import { MedicineBurstEffect } from "./MedicineWaveEffect";

interface CompetitorData {
  name: string;
  tagline?: string;
  logo: string;
  deployment: string;
  idealSize: string;
  abdmReadiness: string;
  coreModules: string[];
  entryPlan: {
    price: string;
    features: string;
  };
  midPlan?: {
    price: string;
    features: string;
  };
  enterprisePlan: {
    price: string;
    features: string;
  };
  implementationFee: string;
  staffAccounts: string;
  features: {
    emr: string;
    patientManagement: boolean;
    appointmentScheduling: boolean;
    billing: boolean;
    inventory: boolean;
    pharmacy: boolean;
    laboratory: boolean;
    wardManagement: string;
    reports: string;
    patientPortal: string;
    localLanguage: string;
  };
  advanced: {
    aiAnalytics: boolean;
    multiFacility: boolean;
    customIntegrations: string;
    telehealth: boolean;
    insurance: string;
    prioritySupport: string;
  };
  pros: string[];
  cons: string[];
  rating: number;
  isTopPick?: boolean;
}

const competitorsData: CompetitorData[] = [
  {
    name: "ClinicStreams",
    tagline: "Top Pick",
    logo: "🏥",
    deployment: "Cloud (SaaS)/On-Prem/Private cloud – Optimized for speed, uptime, and ease of use",
    idealSize: "Clinics → large hospitals (scales effortlessly)",
    abdmReadiness: "Ready & adaptable on request",
    coreModules: ["OPD", "IPD", "EMR/EHR", "Pharmacy", "Lab (LIS)", "Billing", "Inventory", "CRM", "Reports"],
    entryPlan: {
      price: "₹49,990 / year",
      features: "unmatched value (pay 10 months, get 2 free)"
    },
    midPlan: {
      price: "₹99,990 / year",
      features: "ideal for growing hospitals"
    },
    enterprisePlan: {
      price: "Custom",
      features: "best-in-class ROI"
    },
    implementationFee: "Included (data migration + training)",
    staffAccounts: "Generous limits, unlimited in higher plans",
    features: {
      emr: "Advanced with specialty templates",
      patientManagement: true,
      appointmentScheduling: true,
      billing: true,
      inventory: true,
      pharmacy: true,
      laboratory: true,
      wardManagement: "✓ – drag-and-drop mapping",
      reports: "Advanced & customizable",
      patientPortal: "Included",
      localLanguage: "Available"
    },
    advanced: {
      aiAnalytics: true,
      multiFacility: true,
      customIntegrations: "Yes – proven track record",
      telehealth: true,
      insurance: "Yes – roadmap ready",
      prioritySupport: "Enterprise-level"
    },
    pros: [
      "Best pricing structure – annual plans give 2 months free",
      "Comprehensive features in all tiers",
      "Scalable – equally efficient for single clinic or multi-hospital chain",
      "Advanced analytics & AI",
      "Smooth implementation included"
    ],
    cons: [
      "Newer in market compared to some established players"
    ],
    rating: 4.8,
    isTopPick: true
  },
  {
    name: "Insta HMS",
    tagline: "by Practo",
    logo: "📱",
    deployment: "Cloud (SaaS)",
    idealSize: "Clinics & small/mid hospitals",
    abdmReadiness: "Partial – confirm scope",
    coreModules: ["OPD", "IPD", "Pharmacy", "Lab (LIS)", "Billing", "Inventory", "Reports"],
    entryPlan: {
      price: "₹1,000 / user / month",
      features: "(OP; min 5 users)"
    },
    midPlan: {
      price: "₹1,200 / user / month",
      features: "(IP; min 10-20 users)"
    },
    enterprisePlan: {
      price: "Enterprise tiers",
      features: "custom pricing"
    },
    implementationFee: "Usually included",
    staffAccounts: "Per-user licensing",
    features: {
      emr: "Advanced",
      patientManagement: true,
      appointmentScheduling: true,
      billing: true,
      inventory: true,
      pharmacy: true,
      laboratory: true,
      wardManagement: "IP plans",
      reports: "Standard/MIS",
      patientPortal: "Add-on",
      localLanguage: "Available"
    },
    advanced: {
      aiAnalytics: false,
      multiFacility: true,
      customIntegrations: "On request",
      telehealth: true,
      insurance: "On request",
      prioritySupport: "Enterprise tiers"
    },
    pros: [
      "Established brand with Practo backing",
      "Good integration ecosystem",
      "Reliable cloud infrastructure"
    ],
    cons: [
      "Per-user pricing can get expensive",
      "Limited customization options",
      "Basic AI/analytics features"
    ],
    rating: 4.2
  },
  {
    name: "DocEngage HMS",
    tagline: "",
    logo: "👨‍⚕️",
    deployment: "Cloud (SaaS)",
    idealSize: "Clinics, small hospitals, chains",
    abdmReadiness: "Partial – confirm scope",
    coreModules: ["OPD", "IPD", "Lab", "Pharmacy", "EMR/EHR", "CRM"],
    entryPlan: {
      price: "₹1,499 / user / month",
      features: "basic features"
    },
    midPlan: {
      price: "₹2,499 / user / month",
      features: "extended features"
    },
    enterprisePlan: {
      price: "₹4,499 / user / month",
      features: "Premium features"
    },
    implementationFee: "Varies",
    staffAccounts: "Per-user licensing",
    features: {
      emr: "Advanced",
      patientManagement: true,
      appointmentScheduling: true,
      billing: true,
      inventory: true,
      pharmacy: true,
      laboratory: true,
      wardManagement: "Advanced+",
      reports: "Standard → CRM-linked",
      patientPortal: "Available",
      localLanguage: "Partial"
    },
    advanced: {
      aiAnalytics: false,
      multiFacility: true,
      customIntegrations: "On request",
      telehealth: true,
      insurance: "On request",
      prioritySupport: "Enterprise tiers"
    },
    pros: [
      "Strong CRM integration",
      "Good for patient engagement",
      "Flexible deployment options"
    ],
    cons: [
      "Higher per-user costs",
      "Limited AI capabilities",
      "Complex pricing structure"
    ],
    rating: 3.9
  },
  {
    name: "MocDoc HMS",
    tagline: "",
    logo: "🏥",
    deployment: "Cloud (SaaS)",
    idealSize: "Clinics & mid hospitals",
    abdmReadiness: "Claims ABDM integration",
    coreModules: ["OPD", "IPD", "Pharmacy", "Lab (LIS)", "Billing", "Inventory", "Specialty modules"],
    entryPlan: {
      price: "Starts at ₹20,000",
      features: "indicative pricing"
    },
    enterprisePlan: {
      price: "Quote-based",
      features: "enterprise features"
    },
    implementationFee: "Varies",
    staffAccounts: "Per-user licensing",
    features: {
      emr: "Advanced",
      patientManagement: true,
      appointmentScheduling: true,
      billing: true,
      inventory: true,
      pharmacy: true,
      laboratory: true,
      wardManagement: "Advanced+",
      reports: "Advanced",
      patientPortal: "Available",
      localLanguage: "Available"
    },
    advanced: {
      aiAnalytics: false,
      multiFacility: true,
      customIntegrations: "On request",
      telehealth: true,
      insurance: "On request",
      prioritySupport: "Enterprise tiers"
    },
    pros: [
      "Good specialty module support",
      "Established in Indian market",
      "Decent feature coverage"
    ],
    cons: [
      "Quote-based pricing lacks transparency",
      "No AI/predictive analytics",
      "Limited innovation"
    ],
    rating: 3.7
  },
  {
    name: "Suvarna HIS",
    tagline: "",
    logo: "🌟",
    deployment: "On-prem / Private cloud",
    idealSize: "Mid–enterprise hospitals",
    abdmReadiness: "Not publicly stated",
    coreModules: ["HIS", "EMR", "Pharmacy", "LIMS", "RIS", "PACS", "CSSD", "Blood bank", "Insurance"],
    entryPlan: {
      price: "₹15,00,000",
      features: "Class C (<50 beds): one-time"
    },
    midPlan: {
      price: "₹25,00,000",
      features: "Class B (50–100 beds): one-time"
    },
    enterprisePlan: {
      price: "₹50,00,000",
      features: "Class A (100–300 beds): one-time"
    },
    implementationFee: "Additional AMC + infra costs",
    staffAccounts: "Unlimited (license tier based)",
    features: {
      emr: "Advanced",
      patientManagement: true,
      appointmentScheduling: true,
      billing: true,
      inventory: true,
      pharmacy: true,
      laboratory: true,
      wardManagement: "✓",
      reports: "Advanced/MIS",
      patientPortal: "Available",
      localLanguage: "Available"
    },
    advanced: {
      aiAnalytics: false,
      multiFacility: true,
      customIntegrations: "Available",
      telehealth: true,
      insurance: "Available",
      prioritySupport: "Enterprise tiers"
    },
    pros: [
      "Comprehensive hospital suite",
      "Strong on-premise capabilities",
      "Unlimited user accounts"
    ],
    cons: [
      "Very high upfront costs",
      "Complex implementation",
      "Requires significant IT infrastructure",
      "No cloud-first approach"
    ],
    rating: 3.5
  }
];

interface FeatureComparisonPageProps {
  onClose?: () => void;
}

export const FeatureComparisonPage = ({ onClose }: FeatureComparisonPageProps) => {
  const [selectedCompetitor, setSelectedCompetitor] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'pricing' | 'features' | 'advanced'>('overview');
  const [burstTrigger, setBurstTrigger] = useState(false);
  const [burstPosition, setBurstPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial animations
    gsap.set([headingRef.current, cardsRef.current], {
      opacity: 0,
      y: 50
    });

    const tl = gsap.timeline();
    tl.to(headingRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)"
    })
    .to(cardsRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "back.out(1.7)"
    }, "-=0.5");

    // Animate cards on scroll
    competitorsData.forEach((_, index) => {
      const card = document.getElementById(`competitor-${index}`);
      if (card) {
        gsap.fromTo(card, 
          { opacity: 0, y: 50, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
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

  const handleCompetitorSelect = (index: number) => {
    setSelectedCompetitor(selectedCompetitor === index ? null : index);
    
    // Trigger burst effect
    setBurstPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setBurstTrigger(prev => !prev);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-lg ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-400'}`}>
        ⭐
      </span>
    ));
  };

  const getTabContent = (competitor: CompetitorData) => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Deployment</h4>
              <p className="text-sm text-white/80">{competitor.deployment}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Ideal Size</h4>
              <p className="text-sm text-white/80">{competitor.idealSize}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-2">ABDM Readiness</h4>
              <p className="text-sm text-white/80">{competitor.abdmReadiness}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-300 mb-2">Core Modules</h4>
              <div className="flex flex-wrap gap-1">
                {competitor.coreModules.map((module, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-200">
                    {module}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4">
            <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <h4 className="text-sm font-semibold text-green-300 mb-1">Entry Plan</h4>
              <p className="text-lg font-bold text-green-400">{competitor.entryPlan.price}</p>
              <p className="text-xs text-white/70">{competitor.entryPlan.features}</p>
            </div>
            {competitor.midPlan && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="text-sm font-semibold text-blue-300 mb-1">Mid Plan</h4>
                <p className="text-lg font-bold text-blue-400">{competitor.midPlan.price}</p>
                <p className="text-xs text-white/70">{competitor.midPlan.features}</p>
              </div>
            )}
            <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <h4 className="text-sm font-semibold text-purple-300 mb-1">Enterprise Plan</h4>
              <p className="text-lg font-bold text-purple-400">{competitor.enterprisePlan.price}</p>
              <p className="text-xs text-white/70">{competitor.enterprisePlan.features}</p>
            </div>
            <div className="border-t border-white/20 pt-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">Implementation Fee</span>
                <span className="text-white/90">{competitor.implementationFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Staff Accounts</span>
                <span className="text-white/90">{competitor.staffAccounts}</span>
              </div>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-3">
            {Object.entries(competitor.features).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-white/70 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm text-white/90">
                  {typeof value === 'boolean' ? (value ? '✅' : '❌') : value}
                </span>
              </div>
            ))}
          </div>
        );

      case 'advanced':
        return (
          <div className="space-y-3">
            {Object.entries(competitor.advanced).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="text-sm text-white/70 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-sm text-white/90">
                  {typeof value === 'boolean' ? (value ? '✅' : '❌') : value}
                </span>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-indigo-600/10" />
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div ref={headingRef} className="relative z-10 pt-20 pb-16 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="text-6xl mr-4">🆚</div>
            <h1 className="text-4xl md:text-6xl font-light text-white bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              HMS Comparison
            </h1>
          </div>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Comprehensive analysis of top Hospital Management Systems in India
          </p>
          <div className="flex justify-center">
            <InteractiveButton onClick={onClose} variant="outline" size="md">
              ← Back to Journey
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* Feature Matrix Section */}
      <div className="relative z-10 px-6 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Complete Feature Matrix
            </h2>
            <p className="text-lg text-white/70">
              Side-by-side comparison of all features across HMS solutions
            </p>
          </div>

          {/* Comprehensive Comparison Table */}
          <div className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600/30 to-purple-600/30">
                    <th className="text-left p-4 text-white font-semibold border-r border-white/20">Feature</th>
                    {competitorsData.map((competitor, index) => (
                      <th key={index} className={`text-center p-4 text-white font-semibold border-r border-white/20 ${competitor.isTopPick ? 'bg-green-500/20' : ''}`}>
                        <div className="flex flex-col items-center">
                          <div className="text-2xl mb-1">{competitor.logo}</div>
                          <div className="text-sm">{competitor.name}</div>
                          {competitor.isTopPick && <div className="text-xs text-green-300">Top Pick</div>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Deployment & Infrastructure */}
                  <tr className="border-b border-white/10">
                    <td colSpan={6} className="p-3 bg-blue-500/10 text-blue-300 font-semibold">
                      🏗️ Deployment & Infrastructure
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Deployment Type</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        {competitor.deployment.split('–')[0].trim()}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Ideal Organization Size</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        {competitor.idealSize}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">ABDM Readiness</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className={`px-2 py-1 rounded text-xs ${
                          competitor.abdmReadiness.includes('Ready') ? 'bg-green-500/20 text-green-300' :
                          competitor.abdmReadiness.includes('Partial') ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {competitor.abdmReadiness}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Pricing */}
                  <tr className="border-b border-white/10">
                    <td colSpan={6} className="p-3 bg-green-500/10 text-green-300 font-semibold">
                      💰 Pricing Structure
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Entry Plan</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <div className="text-green-400 font-semibold">{competitor.entryPlan.price}</div>
                        <div className="text-white/60 text-xs">{competitor.entryPlan.features}</div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Implementation Fee</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className={`px-2 py-1 rounded text-xs ${
                          competitor.implementationFee.includes('Included') ? 'bg-green-500/20 text-green-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {competitor.implementationFee}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Staff Accounts</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        {competitor.staffAccounts}
                      </td>
                    ))}
                  </tr>

                  {/* Core Features */}
                  <tr className="border-b border-white/10">
                    <td colSpan={6} className="p-3 bg-purple-500/10 text-purple-300 font-semibold">
                      🏥 Core Clinical Features
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">EMR / EHR</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        {competitor.features.emr}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Patient Management</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.features.patientManagement ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Appointment Scheduling</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.features.appointmentScheduling ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Billing & Invoicing</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.features.billing ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Inventory Management</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.features.inventory ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Pharmacy Management</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.features.pharmacy ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Laboratory (LIS)</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.features.laboratory ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Ward/Bed Management</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        {competitor.features.wardManagement}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Reports & Analytics</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        {competitor.features.reports}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Patient Portal</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className={`px-2 py-1 rounded text-xs ${
                          competitor.features.patientPortal === 'Included' ? 'bg-green-500/20 text-green-300' :
                          competitor.features.patientPortal === 'Available' ? 'bg-blue-500/20 text-blue-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {competitor.features.patientPortal}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Local Language Support</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className={`px-2 py-1 rounded text-xs ${
                          competitor.features.localLanguage === 'Available' ? 'bg-green-500/20 text-green-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {competitor.features.localLanguage}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Advanced Features */}
                  <tr className="border-b border-white/10">
                    <td colSpan={6} className="p-3 bg-cyan-500/10 text-cyan-300 font-semibold">
                      🚀 Advanced & Enterprise Features
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">AI / Predictive Analytics</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.advanced.aiAnalytics ? '✅' : '❌'}</span>
                        {competitor.advanced.aiAnalytics && (
                          <div className="text-xs text-green-300 mt-1">Integrated insights</div>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Multi-facility Management</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.advanced.multiFacility ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Custom Integrations</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className={`px-2 py-1 rounded text-xs ${
                          competitor.advanced.customIntegrations.includes('Yes') ? 'bg-green-500/20 text-green-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {competitor.advanced.customIntegrations}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">TeleHealth / E-Consult</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className="text-2xl">{competitor.advanced.telehealth ? '✅' : '❌'}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Insurance / TPA Integration</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <span className={`px-2 py-1 rounded text-xs ${
                          competitor.advanced.insurance.includes('Yes') ? 'bg-green-500/20 text-green-300' :
                          'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {competitor.advanced.insurance}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Priority Support / SLA</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        {competitor.advanced.prioritySupport}
                      </td>
                    ))}
                  </tr>

                  {/* Overall Rating */}
                  <tr className="border-b border-white/10">
                    <td colSpan={6} className="p-3 bg-yellow-500/10 text-yellow-300 font-semibold">
                      ⭐ Overall Rating & Value
                    </td>
                  </tr>
                  <tr className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Overall Rating</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center border-r border-white/10 ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <div className="flex justify-center items-center">
                          {renderStars(competitor.rating)}
                        </div>
                        <div className="text-sm text-white/70 mt-1">({competitor.rating}/5)</div>
                      </td>
                    ))}
                  </tr>
                  <tr className="hover:bg-white/5">
                    <td className="p-3 text-white/80 border-r border-white/10">Value Proposition</td>
                    {competitorsData.map((competitor, index) => (
                      <td key={index} className={`p-3 text-center text-white/90 border-r border-white/10 text-sm ${competitor.isTopPick ? 'bg-green-500/5' : ''}`}>
                        <div className="space-y-1">
                          <div className="text-green-400 font-semibold">
                            {competitor.pros[0]?.substring(0, 40)}...
                          </div>
                          {competitor.isTopPick && (
                            <div className="text-yellow-300 text-xs font-semibold">
                              🏆 BEST VALUE
                            </div>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Competitors Grid */}
      <div ref={cardsRef} className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
              Detailed Competitor Analysis
            </h2>
            <p className="text-lg text-white/70">
              Click on any card below for in-depth feature breakdown
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {competitorsData.map((competitor, index) => (
              <InteractiveCard
                key={index}
                id={`competitor-${index}`}
                className={`p-6 cursor-pointer transition-all duration-500 ${
                  selectedCompetitor === index ? 'ring-2 ring-blue-400' : ''
                } ${competitor.isTopPick ? 'ring-2 ring-green-400' : ''}`}
                onClick={() => handleCompetitorSelect(index)}
                glowEffect={true}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-3xl mr-3">{competitor.logo}</div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{competitor.name}</h3>
                      {competitor.tagline && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          competitor.isTopPick ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {competitor.tagline}
                        </span>
                      )}
                    </div>
                  </div>
                  {competitor.isTopPick && (
                    <div className="text-2xl animate-bounce">🏆</div>
                  )}
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(competitor.rating)}
                  <span className="ml-2 text-sm text-white/70">({competitor.rating}/5)</span>
                </div>

                {/* Quick Info */}
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-blue-300">Starting:</span>
                    <span className="text-green-400 font-semibold ml-2">{competitor.entryPlan.price}</span>
                  </div>
                  <div className="text-sm text-white/70">
                    {competitor.idealSize}
                  </div>
                </div>

                {/* Expandable Content */}
                {selectedCompetitor === index && (
                  <div className="mt-6 pt-4 border-t border-white/20">
                    {/* Tabs */}
                    <div className="flex mb-4 bg-white/10 rounded-lg p-1">
                      {['overview', 'pricing', 'features', 'advanced'].map((tab) => (
                        <button
                          key={tab}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTab(tab as any);
                          }}
                          className={`flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all duration-300 ${
                            activeTab === tab
                              ? 'bg-blue-500 text-white'
                              : 'text-white/70 hover:text-white'
                          }`}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      ))}
                    </div>

                    {/* Tab Content */}
                    <div className="max-h-80 overflow-y-auto">
                      {getTabContent(competitor)}
                    </div>

                    {/* Pros & Cons */}
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold text-green-300 mb-2">✅ Pros</h4>
                          <ul className="space-y-1">
                            {competitor.pros.slice(0, 3).map((pro, idx) => (
                              <li key={idx} className="text-xs text-white/80">• {pro}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-red-300 mb-2">❌ Cons</h4>
                          <ul className="space-y-1">
                            {competitor.cons.slice(0, 3).map((con, idx) => (
                              <li key={idx} className="text-xs text-white/80">• {con}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Expand Indicator */}
                <div className="text-center mt-4">
                  <div className={`text-white/50 text-sm transition-transform duration-300 ${
                    selectedCompetitor === index ? 'rotate-180' : ''
                  }`}>
                    ▼
                  </div>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </div>

      {/* Why ClinicStreams Section */}
      {selectedCompetitor === 0 && (
        <div className="relative z-10 px-6 pb-20">
          <div className="max-w-4xl mx-auto">
            <InteractiveCard className="p-8 bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-400/30">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-4">🏆 Why ClinicStreams Stands Out</h2>
                <p className="text-lg text-white/80">
                  Delivering the best all-round value, features, and scalability in the Indian HMS market
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">💰</div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-300">Best Pricing Structure</h3>
                      <p className="text-sm text-white/80">Annual plans give 2 months free, beating per-user SaaS models</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📋</div>
                    <div>
                      <h3 className="text-lg font-semibold text-blue-300">Comprehensive Features</h3>
                      <p className="text-sm text-white/80">Even entry plan covers EMR, LIS, pharmacy, billing, and CRM</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">📈</div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-300">Scalable Architecture</h3>
                      <p className="text-sm text-white/80">Equally efficient for single clinic or multi-hospital chain</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="text-2xl mr-3">🤖</div>
                    <div>
                      <h3 className="text-lg font-semibold text-cyan-300">AI & Analytics</h3>
                      <p className="text-sm text-white/80">Advanced analytics & AI for data-driven decision-making</p>
                    </div>
                  </div>
                </div>
              </div>
            </InteractiveCard>
          </div>
        </div>
      )}

      {/* Medicine Burst Effect */}
      <MedicineBurstEffect
        trigger={burstTrigger}
        position={burstPosition}
      />
    </div>
  );
};
