import React, { useEffect, useRef, useCallback, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
}

// Ultimate Animation Engine Interface
interface AnimationConfig {
  entrance?: {
    type: 'fadeInUp' | 'slideInLeft' | 'scaleIn' | 'rotateIn' | 'morphIn' | 'particleIn' | 'liquidMorph';
    duration?: number;
    delay?: number;
    ease?: string;
    stagger?: number;
  };
  hover?: {
    type: 'lift' | 'glow' | 'morph' | 'particle' | 'liquid' | 'magneticPull' | 'holographic';
    intensity?: number;
    duration?: number;
  };
  scroll?: {
    type: 'parallax' | 'reveal' | 'morphPath' | 'particleTrail' | 'liquidFlow';
    speed?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
  };
  interaction?: {
    type: 'magnetic' | 'repulsive' | 'morphing' | 'particleExplosion' | 'liquidRipple';
    radius?: number;
    strength?: number;
  };
}

// Advanced Particle System
class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', this.resize.bind(this));
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addParticle(config: ParticleConfig) {
    this.particles.push(new Particle(config));
  }

  start() {
    if (this.animationId) return;
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach((particle, index) => {
      particle.update();
      particle.draw(this.ctx);
      
      if (particle.isDead()) {
        this.particles.splice(index, 1);
      }
    });

    this.animationId = requestAnimationFrame(this.animate);
  };

  explode(x: number, y: number, count: number = 50, config?: Partial<ParticleConfig>) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const velocity = 2 + Math.random() * 3;
      
      this.addParticle({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        life: 60,
        size: 2 + Math.random() * 3,
        color: `hsl(${200 + Math.random() * 60}, 80%, 60%)`,
        ...config
      });
    }
  }

  liquidRipple(x: number, y: number, intensity: number = 1) {
    const rippleCount = Math.floor(20 * intensity);
    for (let i = 0; i < rippleCount; i++) {
      const angle = (Math.PI * 2 * i) / rippleCount;
      const delay = i * 2;
      
      setTimeout(() => {
        this.addParticle({
          x,
          y,
          vx: Math.cos(angle) * 0.5,
          vy: Math.sin(angle) * 0.5,
          life: 120,
          size: 1 + Math.random() * 2,
          color: `rgba(59, 130, 246, ${0.8 - i * 0.03})`,
          type: 'liquid'
        });
      }, delay);
    }
  }
}

interface ParticleConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  type?: 'normal' | 'medical' | 'liquid' | 'holographic';
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: string;

  constructor(config: ParticleConfig) {
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.life = config.life;
    this.maxLife = config.life;
    this.size = config.size;
    this.color = config.color;
    this.type = config.type || 'normal';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    
    // Add gravity and friction
    this.vy += 0.05;
    this.vx *= 0.98;
    this.vy *= 0.98;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const alpha = this.life / this.maxLife;
    
    ctx.save();
    ctx.globalAlpha = alpha;
    
    switch (this.type) {
      case 'medical':
        this.drawMedical(ctx);
        break;
      case 'liquid':
        this.drawLiquid(ctx);
        break;
      case 'holographic':
        this.drawHolographic(ctx);
        break;
      default:
        this.drawNormal(ctx);
    }
    
    ctx.restore();
  }

  private drawNormal(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawMedical(ctx: CanvasRenderingContext2D) {
    // Draw medical cross
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size/4, this.y - this.size, this.size/2, this.size * 2);
    ctx.fillRect(this.x - this.size, this.y - this.size/4, this.size * 2, this.size/2);
  }

  private drawLiquid(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawHolographic(ctx: CanvasRenderingContext2D) {
    // Create holographic effect with multiple layers
    for (let i = 0; i < 3; i++) {
      const offset = i * 0.5;
      const hue = (Date.now() * 0.1 + i * 120) % 360;
      ctx.fillStyle = `hsla(${hue}, 80%, 60%, 0.3)`;
      ctx.beginPath();
      ctx.arc(this.x + offset, this.y + offset, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  isDead() {
    return this.life <= 0;
  }
}

// Liquid Morphing Effects
class LiquidMorph {
  static createMorphPath(from: string, to: string): gsap.core.Timeline {
    const tl = gsap.timeline();
    
    // Create intermediate morphing shapes
    const morphSteps = [
      from,
      `M50,50 C20,20 80,20 50,50 C80,80 20,80 50,50 Z`, // Intermediate blob
      to
    ];

    morphSteps.forEach((path, index) => {
      if (index > 0) {
        tl.to('.morph-target', {
          attr: { d: path },
          duration: 0.3,
          ease: 'power2.inOut'
        });
      }
    });

    return tl;
  }

  static liquidButton(element: HTMLElement) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    
    path.setAttribute('d', 'M0,0 L100,0 L100,100 L0,100 Z');
    path.setAttribute('fill', 'rgba(59, 130, 246, 0.2)');
    path.classList.add('liquid-morph');
    
    svg.appendChild(path);
    element.appendChild(svg);

    return {
      morph: (intensity: number) => {
        const morphedPath = `M0,${intensity*5} C${20+intensity*10},${-intensity*3} ${80-intensity*10},${-intensity*3} 100,${intensity*5} L100,${100-intensity*5} C${80-intensity*10},${100+intensity*3} ${20+intensity*10},${100+intensity*3} 0,${100-intensity*5} Z`;
        gsap.to(path, {
          attr: { d: morphedPath },
          duration: 0.3,
          ease: 'power2.out'
        });
      },
      reset: () => {
        gsap.to(path, {
          attr: { d: 'M0,0 L100,0 L100,100 L0,100 Z' },
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    };
  }
}

// Holographic Effects
class HolographicEffects {
  static addHologram(element: HTMLElement) {
    const hologram = document.createElement('div');
    hologram.className = 'holographic-overlay';
    hologram.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, 
        transparent 30%, 
        rgba(255, 255, 255, 0.1) 50%, 
        transparent 70%);
      background-size: 20px 20px;
      animation: holographicScan 3s infinite;
      pointer-events: none;
      mix-blend-mode: overlay;
    `;

    element.appendChild(hologram);

    // Add CSS animation
    if (!document.querySelector('#holographic-styles')) {
      const style = document.createElement('style');
      style.id = 'holographic-styles';
      style.textContent = `
        @keyframes holographicScan {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        .holographic-glow {
          box-shadow: 
            0 0 20px rgba(0, 255, 255, 0.5),
            0 0 40px rgba(255, 0, 255, 0.3),
            0 0 60px rgba(255, 255, 0, 0.2);
          animation: holographicPulse 2s infinite alternate;
        }
        
        @keyframes holographicPulse {
          0% { filter: hue-rotate(0deg) brightness(1); }
          100% { filter: hue-rotate(180deg) brightness(1.2); }
        }
      `;
      document.head.appendChild(style);
    }

    return {
      activate: () => element.classList.add('holographic-glow'),
      deactivate: () => element.classList.remove('holographic-glow')
    };
  }
}

// Magnetic Field Effect
class MagneticField {
  private elements: Map<HTMLElement, MagneticConfig> = new Map();
  private mouse = { x: 0, y: 0 };

  constructor() {
    this.bindEvents();
  }

  private bindEvents() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.updateMagneticElements();
    });
  }

  addElement(element: HTMLElement, config: MagneticConfig) {
    this.elements.set(element, config);
  }

  removeElement(element: HTMLElement) {
    this.elements.delete(element);
  }

  private updateMagneticElements() {
    this.elements.forEach((config, element) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(this.mouse.x - centerX, 2) + 
        Math.pow(this.mouse.y - centerY, 2)
      );

      if (distance < config.radius) {
        const force = (config.radius - distance) / config.radius;
        const angle = Math.atan2(this.mouse.y - centerY, this.mouse.x - centerX);
        
        const moveX = Math.cos(angle) * force * config.strength;
        const moveY = Math.sin(angle) * force * config.strength;

        gsap.to(element, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    });
  }
}

interface MagneticConfig {
  radius: number;
  strength: number;
}

// Ultimate Animation Engine Component
export const UltimateAnimationEngine: React.FC<{
  children: React.ReactNode;
  config?: AnimationConfig;
}> = ({ children, config = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleSystem = useRef<ParticleSystem | null>(null);
  const magneticField = useRef<MagneticField | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize systems
    particleSystem.current = new ParticleSystem(canvasRef.current);
    magneticField.current = new MagneticField();
    
    particleSystem.current.start();

    return () => {
      particleSystem.current?.stop();
    };
  }, []);

  const addMagneticEffect = useCallback((element: HTMLElement, config: MagneticConfig) => {
    magneticField.current?.addElement(element, config);
  }, []);

  const createParticleExplosion = useCallback((x: number, y: number, intensity: number = 1) => {
    particleSystem.current?.explode(x, y, Math.floor(50 * intensity));
  }, []);

  const createLiquidRipple = useCallback((x: number, y: number, intensity: number = 1) => {
    particleSystem.current?.liquidRipple(x, y, intensity);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden">
      {/* Advanced Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-40"
        style={{ mixBlendMode: 'screen' }}
      />
      
      {/* Enhanced Children with Animation Context */}
      <AnimationProvider
        config={config}
        particleSystem={particleSystem.current}
        magneticField={magneticField.current}
        onParticleExplosion={createParticleExplosion}
        onLiquidRipple={createLiquidRipple}
      >
        {children}
      </AnimationProvider>
    </div>
  );
};

// Animation Context Provider
const AnimationContext = React.createContext<{
  config: AnimationConfig;
  particleSystem: ParticleSystem | null;
  magneticField: MagneticField | null;
  onParticleExplosion: (x: number, y: number, intensity?: number) => void;
  onLiquidRipple: (x: number, y: number, intensity?: number) => void;
} | null>(null);

const AnimationProvider: React.FC<{
  children: React.ReactNode;
  config: AnimationConfig;
  particleSystem: ParticleSystem | null;
  magneticField: MagneticField | null;
  onParticleExplosion: (x: number, y: number, intensity?: number) => void;
  onLiquidRipple: (x: number, y: number, intensity?: number) => void;
}> = ({ children, config, particleSystem, magneticField, onParticleExplosion, onLiquidRipple }) => {
  return (
    <AnimationContext.Provider value={{
      config,
      particleSystem,
      magneticField,
      onParticleExplosion,
      onLiquidRipple
    }}>
      {children}
    </AnimationContext.Provider>
  );
};

// Custom Hook for Animation Context
export const useAnimation = () => {
  const context = React.useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimation must be used within AnimationProvider');
  }
  return context;
};

// Export utilities
export { ParticleSystem, LiquidMorph, HolographicEffects, MagneticField };
export default UltimateAnimationEngine;
