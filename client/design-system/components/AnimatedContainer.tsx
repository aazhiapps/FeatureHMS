import React, { 
  forwardRef, 
  useEffect, 
  useRef, 
  useCallback,
  useMemo,
  useState,
  useLayoutEffect 
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '../../lib/utils';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animation presets
export const animationPresets = {
  // Entrance animations
  entrance: {
    fadeInUp: {
      from: { opacity: 0, y: 30 },
      to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    },
    fadeInDown: {
      from: { opacity: 0, y: -30 },
      to: { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    },
    fadeInLeft: {
      from: { opacity: 0, x: -30 },
      to: { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    },
    fadeInRight: {
      from: { opacity: 0, x: 30 },
      to: { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    },
    scaleIn: {
      from: { opacity: 0, scale: 0.8 },
      to: { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
    },
    slideUp: {
      from: { opacity: 0, y: 100 },
      to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    },
    bounceIn: {
      from: { opacity: 0, scale: 0 },
      to: { opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.3)' }
    },
  },

  // Hover animations
  hover: {
    lift: { y: -8, duration: 0.3, ease: 'power2.out' },
    scale: { scale: 1.05, duration: 0.3, ease: 'power2.out' },
    glow: { boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)', duration: 0.3, ease: 'power2.out' },
    rotate: { rotation: 5, duration: 0.3, ease: 'power2.out' },
    pulse: { scale: 1.02, duration: 0.3, ease: 'power2.out', repeat: -1, yoyo: true },
  },

  // Loading animations
  loading: {
    pulse: { scale: 1.05, duration: 1, ease: 'power2.inOut', repeat: -1, yoyo: true },
    fade: { opacity: 0.5, duration: 1, ease: 'power2.inOut', repeat: -1, yoyo: true },
    rotate: { rotation: 360, duration: 2, ease: 'none', repeat: -1 },
  },

  // Medical specific animations
  medical: {
    heartbeat: { 
      scale: 1.1, 
      duration: 0.6, 
      ease: 'power2.inOut', 
      repeat: -1, 
      yoyo: true,
      transformOrigin: 'center center'
    },
    pulse: {
      boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)',
      duration: 2,
      ease: 'power2.out',
      repeat: -1,
      keyframes: {
        '0%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0.7)' },
        '70%': { boxShadow: '0 0 0 10px rgba(16, 185, 129, 0)' },
        '100%': { boxShadow: '0 0 0 0 rgba(16, 185, 129, 0)' }
      }
    },
    dnaRotate: {
      rotation: 360,
      duration: 20,
      ease: 'none',
      repeat: -1,
      transformOrigin: 'center center'
    }
  }
};

// Performance optimization: Use RAF for smooth animations
const useRAF = (callback: () => void, deps: any[]) => {
  const rafRef = useRef<number>();
  
  useEffect(() => {
    const tick = () => {
      callback();
      rafRef.current = requestAnimationFrame(tick);
    };
    
    rafRef.current = requestAnimationFrame(tick);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, deps);
};

// Intersection Observer hook for performance
const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
};

// Main animated container props
interface AnimatedContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  // Animation settings
  animation?: keyof typeof animationPresets.entrance | 'none';
  animationDelay?: number;
  animationDuration?: number;
  
  // Hover effects
  hoverAnimation?: keyof typeof animationPresets.hover | 'none';
  
  // Scroll trigger
  scrollTrigger?: boolean;
  scrollTriggerOptions?: ScrollTrigger.Vars;
  
  // Performance options
  willChange?: string;
  useGPU?: boolean;
  reducedMotion?: boolean;
  
  // Loading state
  loading?: boolean;
  loadingAnimation?: keyof typeof animationPresets.loading;
  
  // Medical animations
  medicalAnimation?: keyof typeof animationPresets.medical | 'none';
  
  // Stagger for multiple children
  stagger?: number;
  
  // Custom GSAP timeline
  customAnimation?: (element: HTMLElement) => gsap.core.Timeline;
}

// Main AnimatedContainer component
export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({
    children,
    className,
    animation = 'fadeInUp',
    animationDelay = 0,
    animationDuration,
    hoverAnimation = 'none',
    scrollTrigger = true,
    scrollTriggerOptions,
    loading = false,
    loadingAnimation = 'pulse',
    medicalAnimation = 'none',
    stagger = 0,
    customAnimation,
    reducedMotion = false,
    useGPU = true,
    ...props
  }, ref) => {
    
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline>();
    const hoverTimelineRef = useRef<gsap.core.Timeline>();
    const isIntersecting = useIntersectionObserver(containerRef);
    
    // Check for reduced motion preference
    const prefersReducedMotion = useMemo(() => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }, []);

    const shouldAnimate = !reducedMotion && !prefersReducedMotion;

    // Setup entrance animation
    useLayoutEffect(() => {
      const element = containerRef.current;
      if (!element || !shouldAnimate || animation === 'none') return;

      // Kill existing animations
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const preset = animationPresets.entrance[animation];
      if (!preset) return;

      // Set initial state
      gsap.set(element, {
        ...preset.from,
        ...(useGPU && { force3D: true })
      });

      // Create timeline
      timelineRef.current = gsap.timeline({ paused: true });

      if (customAnimation) {
        timelineRef.current.add(customAnimation(element));
      } else {
        const animationProps = {
          ...preset.to,
          ...(animationDuration && { duration: animationDuration }),
          delay: animationDelay
        };

        timelineRef.current.to(element, animationProps);

        // Handle stagger for children
        if (stagger > 0) {
          const children = element.children;
          if (children.length > 0) {
            gsap.set(children, preset.from);
            timelineRef.current.to(children, {
              ...animationProps,
              stagger,
              delay: animationDelay
            }, 0);
          }
        }
      }

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
      };
    }, [animation, animationDelay, animationDuration, stagger, shouldAnimate, customAnimation, useGPU]);

    // Handle scroll trigger
    useEffect(() => {
      const element = containerRef.current;
      if (!element || !shouldAnimate || !timelineRef.current) return;

      if (scrollTrigger && isIntersecting) {
        timelineRef.current.play();
      } else if (!scrollTrigger) {
        timelineRef.current.play();
      }
    }, [isIntersecting, scrollTrigger, shouldAnimate]);

    // Setup hover animations
    useLayoutEffect(() => {
      const element = containerRef.current;
      if (!element || !shouldAnimate || hoverAnimation === 'none') return;

      const handleMouseEnter = () => {
        const preset = animationPresets.hover[hoverAnimation];
        if (preset) {
          gsap.to(element, {
            ...preset,
            ...(useGPU && { force3D: true })
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to(element, {
          y: 0,
          x: 0,
          scale: 1,
          rotation: 0,
          boxShadow: 'none',
          duration: 0.3,
          ease: 'power2.out',
          ...(useGPU && { force3D: true })
        });
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [hoverAnimation, shouldAnimate, useGPU]);

    // Setup loading animation
    useEffect(() => {
      const element = containerRef.current;
      if (!element || !shouldAnimate) return;

      if (loading && loadingAnimation) {
        const preset = animationPresets.loading[loadingAnimation];
        if (preset) {
          gsap.to(element, {
            ...preset,
            ...(useGPU && { force3D: true })
          });
        }
      } else {
        gsap.killTweensOf(element);
      }
    }, [loading, loadingAnimation, shouldAnimate, useGPU]);

    // Setup medical animations
    useEffect(() => {
      const element = containerRef.current;
      if (!element || !shouldAnimate || medicalAnimation === 'none') return;

      const preset = animationPresets.medical[medicalAnimation];
      if (preset) {
        gsap.to(element, {
          ...preset,
          ...(useGPU && { force3D: true })
        });
      }

      return () => {
        gsap.killTweensOf(element);
      };
    }, [medicalAnimation, shouldAnimate, useGPU]);

    // Combine refs
    const combinedRef = useCallback((node: HTMLDivElement) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    return (
      <div
        ref={combinedRef}
        className={cn(
          useGPU && 'transform-gpu',
          'will-change-transform',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';

// Specialized healthcare animated components
export const HeartbeatContainer = forwardRef<HTMLDivElement, Omit<AnimatedContainerProps, 'medicalAnimation'>>(
  (props, ref) => (
    <AnimatedContainer
      ref={ref}
      medicalAnimation="heartbeat"
      {...props}
    />
  )
);

export const PulseContainer = forwardRef<HTMLDivElement, Omit<AnimatedContainerProps, 'medicalAnimation'>>(
  (props, ref) => (
    <AnimatedContainer
      ref={ref}
      medicalAnimation="pulse"
      {...props}
    />
  )
);

export const DNAContainer = forwardRef<HTMLDivElement, Omit<AnimatedContainerProps, 'medicalAnimation'>>(
  (props, ref) => (
    <AnimatedContainer
      ref={ref}
      medicalAnimation="dnaRotate"
      {...props}
    />
  )
);

// Performance-optimized stagger container
export const StaggerContainer = forwardRef<HTMLDivElement, AnimatedContainerProps & {
  staggerDelay?: number;
}>(
  ({ children, staggerDelay = 0.1, ...props }, ref) => {
    return (
      <AnimatedContainer
        ref={ref}
        stagger={staggerDelay}
        {...props}
      >
        {children}
      </AnimatedContainer>
    );
  }
);

export default AnimatedContainer;
