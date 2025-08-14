import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface MedicineParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  type: "pill" | "capsule" | "tablet";
  color: string;
  opacity: number;
  element?: HTMLDivElement;
}

export const HeroMedicineInteraction = ({
  isActive = true,
}: {
  isActive?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<MedicineParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();
  const [isMouseActive, setIsMouseActive] = useState(false);

  const medicineColors = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#feca57",
    "#ff9ff3",
    "#54a0ff",
    "#5f27cd",
    "#00d2d3",
    "#ff9f43",
  ];

  const createMedicineParticle = (
    index: number,
    mouseX: number,
    mouseY: number,
  ): MedicineParticle => {
    const types: ("pill" | "capsule" | "tablet")[] = [
      "pill",
      "capsule",
      "tablet",
    ];
    const type = types[Math.floor(Math.random() * types.length)];
    const color =
      medicineColors[Math.floor(Math.random() * medicineColors.length)];

    // Create particles around mouse position
    const angle = (index / 8) * Math.PI * 2;
    const distance = 50 + Math.random() * 100;
    const x = mouseX + Math.cos(angle) * distance;
    const y = mouseY + Math.sin(angle) * distance;

    return {
      id: index,
      x,
      y,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
      size: 6 + Math.random() * 8,
      type,
      color,
      opacity: 0.8,
    };
  };

  const createParticleElement = (
    particle: MedicineParticle,
  ): HTMLDivElement => {
    const element = document.createElement("div");
    element.className =
      "absolute pointer-events-none transition-transform duration-200";
    element.style.width = `${particle.size}px`;
    element.style.height = `${particle.size * 0.6}px`;
    element.style.zIndex = "25";

    switch (particle.type) {
      case "pill":
        element.style.backgroundColor = particle.color;
        element.style.borderRadius = "50%";
        element.style.boxShadow =
          "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.4)";
        break;
      case "capsule":
        element.style.background = `linear-gradient(90deg, ${particle.color} 0%, ${particle.color} 50%, #ffffff 50%, #ffffff 100%)`;
        element.style.borderRadius = `${particle.size * 0.3}px`;
        element.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        break;
      case "tablet":
        element.style.backgroundColor = particle.color;
        element.style.borderRadius = "25%";
        element.style.border = "1px solid rgba(0,0,0,0.15)";
        element.style.boxShadow =
          "0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)";
        break;
    }

    return element;
  };

  const spawnMedicineParticles = (mouseX: number, mouseY: number) => {
    if (!containerRef.current) return;

    // Create 8 particles around mouse
    for (let i = 0; i < 8; i++) {
      const particle = createMedicineParticle(Date.now() + i, mouseX, mouseY);
      particle.element = createParticleElement(particle);
      containerRef.current.appendChild(particle.element);
      particlesRef.current.push(particle);

      // Animate particle appearance
      gsap.fromTo(
        particle.element,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: particle.opacity,
          duration: 0.3,
          ease: "back.out(1.7)",
        },
      );
    }

    // Limit total particles
    while (particlesRef.current.length > 50) {
      const oldParticle = particlesRef.current.shift();
      if (oldParticle?.element && oldParticle.element.parentNode) {
        gsap.to(oldParticle.element, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            if (oldParticle.element && oldParticle.element.parentNode) {
              oldParticle.element.parentNode.removeChild(oldParticle.element);
            }
          },
        });
      }
    }
  };

  const updateParticles = () => {
    if (!isActive) return;

    particlesRef.current.forEach((particle, index) => {
      if (!particle.element) return;

      // Apply physics
      particle.vy += 0.1; // gravity
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.rotation += particle.rotationSpeed;

      // Fade out over time
      particle.opacity -= 0.005;

      // Mouse interaction - repulsion effect
      if (isMouseActive) {
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx -= (dx / distance) * force * 0.3;
          particle.vy -= (dy / distance) * force * 0.3;
        }
      }

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.995;

      // Remove particles that are too old or off-screen
      if (particle.opacity <= 0 || particle.y > window.innerHeight + 100) {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
        particlesRef.current.splice(index, 1);
        return;
      }

      // Update DOM element
      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg)`;
      particle.element.style.opacity = particle.opacity.toString();
    });

    animationRef.current = requestAnimationFrame(updateParticles);
  };

  useEffect(() => {
    let lastSpawnTime = 0;
    const spawnDelay = 150; // Minimum time between spawns

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setIsMouseActive(true);

      // Spawn particles on mouse move with delay
      const now = Date.now();
      if (now - lastSpawnTime > spawnDelay) {
        spawnMedicineParticles(e.clientX, e.clientY);
        lastSpawnTime = now;
      }
    };

    const handleMouseLeave = () => {
      setIsMouseActive(false);
    };

    const handleClick = (e: MouseEvent) => {
      // Create burst effect on click
      for (let i = 0; i < 15; i++) {
        setTimeout(() => {
          spawnMedicineParticles(e.clientX, e.clientY);
        }, i * 50);
      }
    };

    if (isActive) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
      document.addEventListener("click", handleClick);
      updateParticles();
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClick);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Cleanup particles
      particlesRef.current.forEach((particle) => {
        if (particle.element && particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      particlesRef.current = [];
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 25 }}
    />
  );
};

// Medicine trail effect for mouse movement
export const MedicineTrailEffect = () => {
  const trailRef = useRef<HTMLDivElement[]>([]);
  const mouseHistory = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseHistory.current.unshift({ x: e.clientX, y: e.clientY });

      // Keep only last 10 positions
      if (mouseHistory.current.length > 10) {
        mouseHistory.current.pop();
      }

      // Update trail elements
      trailRef.current.forEach((element, index) => {
        if (element && mouseHistory.current[index]) {
          const position = mouseHistory.current[index];
          const opacity = ((10 - index) / 10) * 0.6;
          const scale = ((10 - index) / 10) * 0.8;

          gsap.set(element, {
            x: position.x,
            y: position.y,
            opacity: opacity,
            scale: scale,
          });
        }
      });
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 24 }}>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (el) trailRef.current[index] = el;
          }}
          className="absolute w-3 h-2 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-0"
          style={{
            transform: "translate(-50%, -50%)",
            filter: `blur(${index * 0.3}px)`,
          }}
        />
      ))}
    </div>
  );
};
