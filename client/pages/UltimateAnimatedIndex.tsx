import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ViewModeSwitcher } from "../components/ViewModeSwitcher";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Analytics", href: "#analytics" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const features = [
  {
    icon: "🏥",
    title: "Patient Management",
    description:
      "Centralized records, visit history, and treatment plans for every patient — accessible in seconds.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: "📅",
    title: "Appointment Scheduling",
    description:
      "Intelligent scheduling with automated reminders that cut no-shows and reduce wait times.",
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
  },
  {
    icon: "📋",
    title: "Electronic Medical Records",
    description:
      "HIPAA-compliant EMR that makes documentation fast, accurate, and always available.",
    color: "bg-violet-50 text-violet-600",
    border: "border-violet-100",
  },
  {
    icon: "💰",
    title: "Billing & Insurance",
    description:
      "Streamlined billing workflows, insurance verification, and claims processing in one place.",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
  },
  {
    icon: "🧪",
    title: "Lab Management",
    description:
      "Order tests, track samples, and receive results — fully integrated with your clinical workflow.",
    color: "bg-indigo-50 text-indigo-600",
    border: "border-indigo-100",
  },
  {
    icon: "💊",
    title: "Pharmacy",
    description:
      "Automated dispensing, inventory control, and drug-interaction checks keep patients safe.",
    color: "bg-rose-50 text-rose-600",
    border: "border-rose-100",
  },
  {
    icon: "🚑",
    title: "Ambulance Management",
    description:
      "Real-time fleet tracking and smart dispatch that shaves minutes off emergency response.",
    color: "bg-red-50 text-red-600",
    border: "border-red-100",
  },
  {
    icon: "👩‍⚕️",
    title: "Nursing Station",
    description:
      "Medication administration, vital sign monitoring, and shift handover — all in one screen.",
    color: "bg-teal-50 text-teal-600",
    border: "border-teal-100",
  },
  {
    icon: "🏢",
    title: "Front Office",
    description:
      "Reception, check-in/out, and queue management that gives patients a smooth arrival experience.",
    color: "bg-sky-50 text-sky-600",
    border: "border-sky-100",
  },
];

const stats = [
  { value: "500+", label: "Hospitals Served" },
  { value: "2M+", label: "Patients Managed" },
  { value: "99.9%", label: "System Uptime" },
  { value: "40%", label: "Admin Time Saved" },
];

const metrics = [
  { label: "Patient Satisfaction", value: "96%", pct: 96, color: "bg-blue-500" },
  { label: "Billing Collection Rate", value: "95%", pct: 95, color: "bg-emerald-500" },
  { label: "Lab Result Accuracy", value: "99.8%", pct: 99.8, color: "bg-violet-500" },
  { label: "Emergency Response", value: "8 min avg", pct: 85, color: "bg-rose-500" },
];

// ─── Components ───────────────────────────────────────────────────────────────

// Sticky navigation
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-slate-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img src="/logo.png" alt="ClinicStreams" className="w-full h-full object-contain" />
          </div>
          <span
            className={`text-lg font-semibold transition-colors duration-300 ${
              scrolled ? "text-slate-800" : "text-white"
            }`}
          >
            ClinicStreams
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors duration-200 hover:text-blue-600 ${
                scrolled ? "text-slate-600" : "text-white/80 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#contact"
            className={`text-sm font-medium transition-colors duration-200 ${
              scrolled ? "text-slate-600 hover:text-blue-600" : "text-white/80 hover:text-white"
            }`}
          >
            Sign in
          </a>
          <a
            href="#contact"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
          >
            Get a Demo
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span
              className={`block h-0.5 transition-all duration-200 ${scrolled ? "bg-slate-700" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 transition-all duration-200 ${scrolled ? "bg-slate-700" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 transition-all duration-200 ${scrolled ? "bg-slate-700" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="block mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg text-center transition-colors duration-200"
          >
            Get a Demo
          </a>
        </div>
      )}
    </header>
  );
};

// Hero section
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-content > *",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
        },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 overflow-hidden"
    >
      {/* Subtle geometric accent */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/3 -right-1/4 w-[700px] h-[700px] rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl" />
      </div>

      <div className="hero-content relative z-10 text-center max-w-4xl mx-auto px-6 py-24">
        {/* Badge */}
        <span className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
          Complete Hospital Management System
        </span>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Smarter Healthcare,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
            Simplified
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          ClinicStreams brings every department — from admissions to billing to
          the nursing station — into one clean, HIPAA-compliant platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200 shadow-lg shadow-blue-900/30"
          >
            Get a Free Demo
          </a>
          <a
            href="#features"
            className="px-8 py-3.5 bg-blue-600/30 hover:bg-blue-600/50 text-white font-semibold rounded-xl border border-blue-400/40 transition-colors duration-200"
          >
            Explore Features
          </a>
        </div>

        {/* Scroll cue */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-50">
          <div className="w-5 h-8 rounded-full border-2 border-white/50 flex justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-white rounded-full animate-bounce" />
          </div>
          <span className="text-xs text-white/60 uppercase tracking-widest">Scroll</span>
        </div>
      </div>
    </section>
  );
};

// Stats bar
const StatsBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".stat-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="bg-white border-y border-slate-100 py-12">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="stat-item text-center">
            <p className="text-3xl md:text-4xl font-bold text-blue-700">{s.value}</p>
            <p className="mt-1 text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

// Features grid
const Features: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={ref} className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Every module your hospital needs
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-base">
            From front desk to discharge, ClinicStreams covers the complete
            hospital workflow in a single, integrated platform.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className={`feature-card bg-white rounded-2xl p-6 border ${f.border} hover:shadow-md transition-shadow duration-200`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center text-xl mb-4`}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Analytics / metrics section
const Analytics: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((a) => (a + 1) % metrics.length), 2800);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".analytics-content > *",
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ref.current, start: "top 80%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="analytics" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div className="analytics-content">
            <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold tracking-widest uppercase rounded-full bg-blue-50 text-blue-600">
              Real-Time Insights
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-5 leading-snug">
              Data-driven decisions for better patient outcomes
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Live dashboards surface the metrics that matter most — patient
              flow, billing performance, lab turnaround, and more — so
              leadership always has a clear picture.
            </p>
            <a
              href="#contact"
              className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              See the Dashboard
            </a>
          </div>

          {/* Right — metric bars */}
          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 space-y-5">
            {metrics.map((m, i) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">{m.label}</span>
                  <span
                    className={`text-sm font-bold transition-colors duration-300 ${
                      active === i ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {m.value}
                  </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${m.color} rounded-full transition-all duration-700`}
                    style={{ width: active === i ? `${m.pct}%` : "20%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA section
const CallToAction: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 bg-gradient-to-br from-blue-700 to-indigo-800"
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
          Ready to modernize your hospital?
        </h2>
        <p className="text-blue-100/80 mb-10 text-base leading-relaxed">
          Talk to our team and get a personalised walkthrough of ClinicStreams
          tailored to your facility.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://calendly.com/clinicstreams-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200 shadow-lg"
          >
            Schedule a Demo
          </a>
          <a
            href="mailto:hello@clinicstreams.com"
            className="px-8 py-3.5 bg-blue-600/30 hover:bg-blue-600/50 text-white font-semibold rounded-xl border border-blue-300/30 transition-colors duration-200"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer: React.FC = () => (
  <footer className="bg-slate-900 py-12 px-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md overflow-hidden">
            <img src="/logo.png" alt="ClinicStreams" className="w-full h-full object-contain" />
          </div>
          <span className="text-slate-300 font-semibold">ClinicStreams</span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6">
          {["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Support"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200"
            >
              {l}
            </a>
          ))}
        </nav>

        {/* Copy */}
        <p className="text-sm text-slate-600">© 2025 ClinicStreams. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// ─── Main export ─────────────────────────────────────────────────────────────

export const UltimateAnimatedIndex: React.FC = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <main>
      <Hero />
      <StatsBar />
      <Features />
      <Analytics />
      <CallToAction />
    </main>
    <Footer />
    <ViewModeSwitcher />
  </div>
);

export default UltimateAnimatedIndex;
