import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useMagneticEffect, useMouseTilt } from './MouseAnimationSystem';

interface InteractiveButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  magnetic?: boolean;
  tilt?: boolean;
  ripple?: boolean;
  disabled?: boolean;
  id?: string;
}

export const InteractiveButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  magnetic = true,
  tilt = true,
  ripple = true,
  disabled = false,
  id,
}: InteractiveButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);

  // Apply magnetic effect
  if (magnetic) {
    useMagneticEffect(buttonRef, 0.2);
  }

  // Apply tilt effect
  if (tilt) {
    useMouseTilt(buttonRef, 0.2);
  }

  // Ripple effect
  useEffect(() => {
    if (!ripple || !buttonRef.current) return;

    const button = buttonRef.current;

    const handleClick = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple element
      const rippleElement = document.createElement('div');
      rippleElement.className = 'absolute rounded-full bg-white/30 pointer-events-none animate-ping';
      rippleElement.style.left = `${x}px`;
      rippleElement.style.top = `${y}px`;
      rippleElement.style.width = '10px';
      rippleElement.style.height = '10px';
      rippleElement.style.transform = 'translate(-50%, -50%)';

      button.appendChild(rippleElement);

      // Animate ripple
      gsap.fromTo(rippleElement, 
        { scale: 0, opacity: 1 },
        { 
          scale: 8, 
          opacity: 0, 
          duration: 0.6, 
          ease: "power2.out",
          onComplete: () => {
            rippleElement.remove();
          }
        }
      );
    };

    button.addEventListener('click', handleClick);
    return () => button.removeEventListener('click', handleClick);
  }, [ripple]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-teal-600';
      case 'secondary':
        return 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20';
      case 'ghost':
        return 'bg-transparent text-white/80 border border-transparent hover:text-white hover:bg-white/10';
      case 'outline':
        return 'bg-transparent text-white border border-white/50 hover:bg-white/10 hover:border-white/70';
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm';
      case 'md':
        return 'px-6 py-3 text-base';
      case 'lg':
        return 'px-8 py-4 text-lg';
      case 'xl':
        return 'px-10 py-5 text-xl';
      default:
        return '';
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl font-semibold
        transition-all duration-300 transform
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        interactive
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      data-mouse-parallax="0.05"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-teal-400/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-400 to-teal-400 opacity-0 hover:opacity-100 transition-opacity duration-300" 
           style={{ 
             WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', 
             WebkitMaskComposite: 'subtract' 
           }} />
    </button>
  );
};

// Floating Action Button with advanced mouse effects
export const FloatingActionButton = ({ 
  children, 
  onClick, 
  className = '' 
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => {
  const fabRef = useRef<HTMLButtonElement>(null);

  useMagneticEffect(fabRef, 0.4);
  useMouseTilt(fabRef, 0.3);

  useEffect(() => {
    if (!fabRef.current) return;

    const fab = fabRef.current;

    // Floating animation
    gsap.to(fab, {
      y: "+=10",
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut"
    });

    // Mouse proximity effect
    const handleMouseMove = (e: MouseEvent) => {
      const rect = fab.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
      );

      if (distance < 150) {
        const intensity = 1 - (distance / 150);
        gsap.to(fab, {
          scale: 1 + intensity * 0.1,
          boxShadow: `0 ${10 + intensity * 20}px ${30 + intensity * 20}px rgba(59, 130, 246, ${0.3 + intensity * 0.2})`,
          duration: 0.3,
          ease: "power2.out"
        });
      } else {
        gsap.to(fab, {
          scale: 1,
          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.3)",
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <button
      ref={fabRef}
      onClick={onClick}
      className={`
        fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500
        rounded-full shadow-lg hover:shadow-xl text-white
        flex items-center justify-center transition-all duration-300
        z-50 interactive group
        ${className}
      `}
      data-mouse-parallax="0.1"
    >
      <div className="group-hover:scale-110 transition-transform duration-300">
        {children}
      </div>
      
      {/* Pulse ring */}
      <div className="absolute inset-0 rounded-full border-2 border-blue-400 opacity-0 group-hover:opacity-100 animate-ping" />
    </button>
  );
};

// Interactive Card with mouse effects
export const InteractiveCard = ({ 
  children, 
  className = '',
  glowEffect = true 
}: {
  children: React.ReactNode;
  className?: string;
  glowEffect?: boolean;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useMouseTilt(cardRef, 0.1);

  useEffect(() => {
    if (!cardRef.current || !glowEffect) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, [glowEffect]);

  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md
        border border-white/20 transition-all duration-300
        hover:shadow-2xl hover:border-white/40 interactive
        ${className}
      `}
      data-mouse-parallax="0.02"
      style={{
        background: glowEffect 
          ? `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
          : undefined
      }}
    >
      {children}
      
      {/* Animated border */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/50 via-purple-400/50 to-teal-400/50 blur-sm" />
      </div>
    </div>
  );
};
