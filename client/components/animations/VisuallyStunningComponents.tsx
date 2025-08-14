import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useAnimation } from "./UltimateAnimationEngine";

// Animated Button with Liquid Morphing
export const LiquidMorphButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "medical" | "holographic";
  size?: "sm" | "md" | "lg" | "xl";
}> = ({ children, onClick, variant = "primary", size = "md" }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const { onParticleExplosion } = useAnimation();

  const variants = {
    primary: "from-blue-500 to-purple-600",
    secondary: "from-green-500 to-teal-600",
    medical: "from-red-500 to-pink-600",
    holographic: "from-cyan-400 via-purple-500 to-pink-500",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-12 py-6 text-xl",
  };

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    // Create liquid morphing effect
    const handleMouseEnter = () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      });

      // Liquid morph animation
      gsap.to(liquidRef.current, {
        scaleX: 1.1,
        scaleY: 0.9,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });

      gsap.to(liquidRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Particle explosion at click point
      onParticleExplosion(e.clientX, e.clientY, 1.5);

      // Ripple effect
      const ripple = document.createElement("div");
      ripple.className = "absolute rounded-full bg-white/30 animate-ping";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.width = "10px";
      ripple.style.height = "10px";
      ripple.style.transform = "translate(-50%, -50%)";

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      onClick?.();
    };

    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    button.addEventListener("click", handleClick);

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
      button.removeEventListener("click", handleClick);
    };
  }, [onClick, onParticleExplosion]);

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-2xl font-semibold text-white
        bg-gradient-to-r ${variants[variant]} ${sizes[size]}
        transition-all duration-300 transform-gpu
        shadow-lg hover:shadow-2xl
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
      `}
    >
      {/* Liquid morphing background */}
      <div
        ref={liquidRef}
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl transform-gpu"
      />

      {/* Holographic overlay for holographic variant */}
      {variant === "holographic" && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-purple-500/20 to-pink-500/20 animate-pulse" />
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
};

// Morphing Card with 3D Effects
export const MorphingCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: "glass" | "neon" | "medical" | "holographic";
}> = ({ children, className = "", variant = "glass" }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    glass: "bg-white/10 backdrop-blur-lg border border-white/20",
    neon: "bg-black/20 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.3)]",
    medical:
      "bg-gradient-to-br from-red-500/10 to-blue-500/10 border border-red-300/30",
    holographic:
      "bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-cyan-500/10",
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 1000,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)",
      });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    card.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
      card.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-2xl p-6 transition-all duration-300 transform-gpu
        ${variants[variant]} ${className}
        ${isHovered ? "shadow-2xl" : "shadow-lg"}
      `}
    >
      {/* Animated border for neon variant */}
      {variant === "neon" && (
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-50 blur-sm animate-pulse" />
        </div>
      )}

      {/* Holographic scanning effect */}
      {variant === "holographic" && isHovered && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[scan_2s_infinite] transform translate-x-[-100%]" />
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Floating Healthcare Module with Advanced Physics
export const FloatingHealthcareModule: React.FC<{
  icon: string;
  title: string;
  description: string;
  color: string;
  index: number;
}> = ({ icon, title, description, color, index }) => {
  const moduleRef = useRef<HTMLDivElement>(null);
  const { onLiquidRipple } = useAnimation();

  useEffect(() => {
    const module = moduleRef.current;
    if (!module) return;

    // Floating animation with physics
    gsap.set(module, {
      y: Math.random() * 100,
      rotation: Math.random() * 10 - 5,
    });

    const floatingTl = gsap.timeline({ repeat: -1, yoyo: true });
    floatingTl.to(module, {
      y: `+=${20 + Math.random() * 20}`,
      rotation: `+=${5 + Math.random() * 5}`,
      duration: 3 + Math.random() * 2,
      ease: "sine.inOut",
    });

    const handleClick = (e: MouseEvent) => {
      onLiquidRipple(e.clientX, e.clientY, 2);

      // Pulse animation
      gsap.fromTo(
        module,
        { scale: 1 },
        {
          scale: 1.2,
          duration: 0.2,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        },
      );
    };

    module.addEventListener("click", handleClick);

    return () => {
      floatingTl.kill();
      module.removeEventListener("click", handleClick);
    };
  }, [index, onLiquidRipple]);

  return (
    <div
      ref={moduleRef}
      className={`
        absolute cursor-pointer transform-gpu
        ${index % 2 === 0 ? "left-[10%]" : "right-[10%]"}
      `}
      style={{
        top: `${20 + ((index * 15) % 60)}%`,
        animationDelay: `${index * 0.2}s`,
      }}
    >
      <MorphingCard
        variant="holographic"
        className="w-64 hover:scale-105 transition-transform duration-300"
      >
        <div className="flex items-center space-x-4">
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl shadow-lg transform hover:rotate-12 transition-transform duration-300`}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80 text-sm">{description}</p>
          </div>
        </div>
      </MorphingCard>
    </div>
  );
};

// Animated Healthcare Stats with Morphing Numbers
export const AnimatedHealthcareStats: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    patients: 0,
    uptime: 0,
    satisfaction: 0,
    efficiency: 0,
  });

  const targetStats = {
    patients: 12500,
    uptime: 99.9,
    satisfaction: 98.2,
    efficiency: 45,
  };

  useEffect(() => {
    const animateNumbers = () => {
      gsap.to(stats, {
        patients: targetStats.patients,
        uptime: targetStats.uptime,
        satisfaction: targetStats.satisfaction,
        efficiency: targetStats.efficiency,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          setStats({ ...stats });
        },
      });
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateNumbers();
      }
    });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[
        {
          label: "Active Patients",
          value: Math.floor(stats.patients).toLocaleString(),
          suffix: "+",
          color: "from-blue-500 to-cyan-500",
        },
        {
          label: "System Uptime",
          value: stats.uptime.toFixed(1),
          suffix: "%",
          color: "from-green-500 to-emerald-500",
        },
        {
          label: "Satisfaction",
          value: stats.satisfaction.toFixed(1),
          suffix: "%",
          color: "from-purple-500 to-pink-500",
        },
        {
          label: "Efficiency Gain",
          value: Math.floor(stats.efficiency),
          suffix: "%",
          color: "from-orange-500 to-red-500",
        },
      ].map((stat, index) => (
        <MorphingCard
          key={index}
          variant="glass"
          className="text-center hover:scale-105 transition-transform duration-300"
        >
          <div
            className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
          >
            {stat.value}
            {stat.suffix}
          </div>
          <div className="text-white/80 text-sm">{stat.label}</div>
        </MorphingCard>
      ))}
    </div>
  );
};

// Particle DNA Helix
export const ParticleDNAHelix: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = 300;
    canvas.height = 400;

    let frame = 0;
    const particles: any[] = [];

    // Initialize DNA particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        angle: (i / 100) * Math.PI * 8,
        radius: 50,
        y: (i / 100) * canvas.height,
        strand: i % 2,
        hue: i % 2 === 0 ? 200 : 280,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame += 0.02;

      particles.forEach((particle, i) => {
        const x =
          canvas.width / 2 +
          Math.cos(particle.angle + frame) *
            particle.radius *
            (particle.strand === 0 ? 1 : -1);
        const y = particle.y + Math.sin(frame * 2) * 10;

        // Draw particle
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, `hsla(${particle.hue}, 80%, 60%, 0.8)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 80%, 60%, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw connections
        if (i > 0 && particles[i - 1].strand === particle.strand) {
          const prevX =
            canvas.width / 2 +
            Math.cos(particles[i - 1].angle + frame) *
              particles[i - 1].radius *
              (particles[i - 1].strand === 0 ? 1 : -1);
          const prevY = particles[i - 1].y + Math.sin(frame * 2) * 10;

          ctx.strokeStyle = `hsla(${particle.hue}, 60%, 50%, 0.3)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />
    </div>
  );
};

// Add CSS animations
const styles = `
  @keyframes scan {
    0% { transform: translateX(-100%) skewX(-15deg); }
    100% { transform: translateX(100%) skewX(-15deg); }
  }
`;

// Inject styles
if (
  typeof document !== "undefined" &&
  !document.querySelector("#stunning-animations-styles")
) {
  const style = document.createElement("style");
  style.id = "stunning-animations-styles";
  style.textContent = styles;
  document.head.appendChild(style);
}

export default {
  LiquidMorphButton,
  MorphingCard,
  FloatingHealthcareModule,
  AnimatedHealthcareStats,
  ParticleDNAHelix,
};
