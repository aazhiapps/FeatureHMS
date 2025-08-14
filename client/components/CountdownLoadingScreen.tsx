import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

interface CountdownLoadingScreenProps {
  onComplete: () => void;
  duration?: number; // in seconds
  title?: string;
  subtitle?: string;
}

export const CountdownLoadingScreen = ({
  onComplete,
  duration = 5,
  title = "Digital Medical Systems",
  subtitle = "Preparing to Launch...",
}: CountdownLoadingScreenProps) => {
  const [countdown, setCountdown] = useState(duration);
  const [progress, setProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const loadingStages = [
    "Initializing Healthcare Modules...",
    "Loading Patient Management System...",
    "Connecting to EMR Database...",
    "Preparing Clinical Workflows...",
    "Finalizing System Integration...",
    "All Systems Ready!",
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Initial animations
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, y: -50, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: "back.out(1.7)" },
    );

    gsap.fromTo(
      circleRef.current,
      { opacity: 0, scale: 0, rotation: -180 },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.5,
        delay: 0.3,
        ease: "back.out(1.7)",
      },
    );

    gsap.fromTo(
      counterRef.current,
      { opacity: 0, scale: 2 },
      { opacity: 1, scale: 1, duration: 0.8, delay: 0.8, ease: "power2.out" },
    );

    // Progress animation
    gsap.fromTo(
      progressRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, delay: 1, ease: "power2.out" },
    );

    const interval = setInterval(() => {
      setCountdown((prev) => {
        const newCount = prev - 0.1;
        const newProgress = ((duration - newCount) / duration) * 100;
        setProgress(newProgress);

        // Update loading stage
        const stageIndex = Math.floor(
          newProgress / (100 / loadingStages.length),
        );
        setLoadingStage(Math.min(stageIndex, loadingStages.length - 1));

        if (newCount <= 0) {
          clearInterval(interval);

          // Exit animation
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "power2.in",
            onComplete: onComplete,
          });

          return 0;
        }

        return newCount;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  // Animate counter changes
  useEffect(() => {
    if (counterRef.current) {
      gsap.fromTo(
        counterRef.current,
        { scale: 1.2, color: "#3b82f6" },
        { scale: 1, color: "#ffffff", duration: 0.3, ease: "power2.out" },
      );
    }
  }, [Math.floor(countdown)]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center z-50 overflow-hidden"
    >
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Floating healthcare icons */}
      <div className="absolute inset-0 opacity-20">
        {["🏥", "⚕️", "💊", "🩺", "💉", "🧬", "📊", "💗"].map((icon, i) => (
          <div
            key={i}
            className="absolute text-6xl animate-pulse"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + Math.sin(i) * 30}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl px-6">
        {/* Title */}
        <div ref={titleRef} className="mb-12">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-white/80">{subtitle}</p>
        </div>

        {/* Countdown Circle */}
        <div className="relative mb-12">
          <div ref={circleRef} className="relative w-48 h-48 mx-auto">
            {/* Outer ring with progress */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="4"
                fill="none"
              />

              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-100 ease-out drop-shadow-lg"
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div
                ref={counterRef}
                className="text-5xl font-bold text-white mb-2"
              >
                {Math.ceil(countdown)}
              </div>
              <div className="text-sm text-white/70 uppercase tracking-wide">
                seconds
              </div>

              {/* Pulsing center dot */}
              <div className="absolute w-4 h-4 bg-gradient-to-r from-blue-400 to-green-400 rounded-full animate-ping" />
            </div>

            {/* Rotating outer ring */}
            <div
              className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin"
              style={{ animationDuration: "10s" }}
            />
            <div
              className="absolute inset-2 border border-blue-400/30 rounded-full animate-spin"
              style={{ animationDuration: "8s", animationDirection: "reverse" }}
            />
          </div>
        </div>

        {/* Progress bar and status */}
        <div ref={progressRef} className="space-y-6">
          {/* Progress bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 rounded-full transition-all duration-100 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Animated shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Loading stage indicator */}
          <div className="bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-center space-x-3">
              <div className="relative">
                <div className="w-6 h-6 border-2 border-white/30 border-t-blue-400 rounded-full animate-spin" />
                <div
                  className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-green-400 rounded-full animate-spin"
                  style={{ animationDelay: "0.5s", animationDuration: "1.5s" }}
                />
              </div>
              <div className="text-white/90 text-sm font-medium">
                {loadingStages[loadingStage]}
              </div>
            </div>
          </div>

          {/* System status indicators */}
          <div className="grid grid-cols-3 gap-4">
            {["Database", "Services", "Security"].map((system, i) => (
              <div
                key={system}
                className="bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      progress > (i + 1) * 25
                        ? "bg-green-400 animate-pulse"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="text-xs text-white/70">{system}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-12 h-12 border-l-2 border-t-2 border-white/20" />
      <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-white/20" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-white/20" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-r-2 border-b-2 border-white/20" />
    </div>
  );
};
