import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Tablet {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  type: "pill" | "capsule" | "tablet" | "liquid";
  color: string;
  element?: HTMLDivElement;
}

interface MedicineWaveEffectProps {
  isActive?: boolean;
  intensity?: number;
  particleCount?: number;
}

export const MedicineWaveEffect = ({
  isActive = true,
  intensity = 1,
  particleCount = 25,
}: MedicineWaveEffectProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tabletsRef = useRef<Tablet[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Medicine types and colors
  const medicineTypes = [
    {
      type: "pill" as const,
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
    },
    {
      type: "capsule" as const,
      colors: ["#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43"],
    },
    {
      type: "tablet" as const,
      colors: ["#ffffff", "#f1c40f", "#e74c3c", "#3498db", "#2ecc71"],
    },
    {
      type: "liquid" as const,
      colors: [
        "rgba(52, 152, 219, 0.8)",
        "rgba(155, 89, 182, 0.8)",
        "rgba(46, 204, 113, 0.8)",
      ],
    },
  ];

  const createTablet = (index: number): Tablet => {
    const typeData =
      medicineTypes[Math.floor(Math.random() * medicineTypes.length)];
    const color =
      typeData.colors[Math.floor(Math.random() * typeData.colors.length)];

    return {
      id: index,
      x: Math.random() * window.innerWidth,
      y: -50 - Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      size: 8 + Math.random() * 12,
      type: typeData.type,
      color: color,
    };
  };

  const createTabletElement = (tablet: Tablet): HTMLDivElement => {
    const element = document.createElement("div");
    element.className =
      "absolute pointer-events-none transition-all duration-100";
    element.style.width = `${tablet.size}px`;
    element.style.height = `${tablet.size * 0.6}px`;
    element.style.zIndex = "15";

    // Style based on medicine type
    switch (tablet.type) {
      case "pill":
        element.style.backgroundColor = tablet.color;
        element.style.borderRadius = "50%";
        element.style.boxShadow =
          "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)";
        break;
      case "capsule":
        element.style.background = `linear-gradient(90deg, ${tablet.color} 0%, ${tablet.color} 50%, #ffffff 50%, #ffffff 100%)`;
        element.style.borderRadius = `${tablet.size * 0.3}px`;
        element.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
        break;
      case "tablet":
        element.style.backgroundColor = tablet.color;
        element.style.borderRadius = "20%";
        element.style.border = "1px solid rgba(0,0,0,0.1)";
        element.style.boxShadow =
          "0 2px 4px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.4)";
        // Add tablet line
        const line = document.createElement("div");
        line.style.position = "absolute";
        line.style.top = "50%";
        line.style.left = "20%";
        line.style.right = "20%";
        line.style.height = "1px";
        line.style.backgroundColor = "rgba(0,0,0,0.2)";
        line.style.transform = "translateY(-50%)";
        element.appendChild(line);
        break;
      case "liquid":
        element.style.backgroundColor = tablet.color;
        element.style.borderRadius = "30%";
        element.style.filter = "blur(0.5px)";
        element.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        break;
    }

    return element;
  };

  const initializeTablets = () => {
    if (!containerRef.current) return;

    // Clear existing tablets
    tabletsRef.current.forEach((tablet) => {
      if (tablet.element && tablet.element.parentNode) {
        tablet.element.parentNode.removeChild(tablet.element);
      }
    });

    // Create new tablets
    tabletsRef.current = Array.from({ length: particleCount }, (_, i) => {
      const tablet = createTablet(i);
      tablet.element = createTabletElement(tablet);
      containerRef.current?.appendChild(tablet.element);
      return tablet;
    });
  };

  const updateTablets = () => {
    if (!isActive || !containerRef.current) return;

    tabletsRef.current.forEach((tablet, index) => {
      if (!tablet.element) return;

      // Mouse influence (wave effect)
      const dx = mouseRef.current.x - tablet.x;
      const dy = mouseRef.current.y - tablet.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const maxDistance = 150 * intensity;

      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const angle = Math.atan2(dy, dx);

        // Wave repulsion effect
        tablet.vx -= Math.cos(angle) * force * 0.5;
        tablet.vy -= Math.sin(angle) * force * 0.3;

        // Add swirling motion
        const swirl = force * 0.1;
        tablet.vx += Math.cos(angle + Math.PI / 2) * swirl;
        tablet.vy += Math.sin(angle + Math.PI / 2) * swirl;
      }

      // Apply gravity and movement
      tablet.vy += 0.02; // gravity
      tablet.x += tablet.vx;
      tablet.y += tablet.vy;
      tablet.rotation += tablet.rotationSpeed;

      // Damping
      tablet.vx *= 0.995;
      tablet.vy *= 0.998;

      // Boundary collision and reset
      if (tablet.x < -tablet.size) {
        tablet.x = window.innerWidth + tablet.size;
        tablet.y = -50 - Math.random() * 200;
        tablet.vy = 0.5 + Math.random() * 1.5;
      } else if (tablet.x > window.innerWidth + tablet.size) {
        tablet.x = -tablet.size;
        tablet.y = -50 - Math.random() * 200;
        tablet.vy = 0.5 + Math.random() * 1.5;
      }

      if (tablet.y > window.innerHeight + tablet.size) {
        tablet.y = -50 - Math.random() * 200;
        tablet.x = Math.random() * window.innerWidth;
        tablet.vy = 0.5 + Math.random() * 1.5;
      }

      // Update DOM element
      tablet.element.style.transform = `translate(${tablet.x}px, ${tablet.y}px) rotate(${tablet.rotation}deg)`;

      // Update opacity based on mouse distance for depth effect
      const opacity =
        distance < maxDistance
          ? Math.max(0.3, 1 - (distance / maxDistance) * 0.7)
          : Math.max(0.2, 0.6 - (tablet.y / window.innerHeight) * 0.4);
      tablet.element.style.opacity = opacity.toString();
    });

    animationRef.current = requestAnimationFrame(updateTablets);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      initializeTablets();
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    if (isActive) {
      initializeTablets();
      updateTablets();
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Cleanup tablet elements
      tabletsRef.current.forEach((tablet) => {
        if (tablet.element && tablet.element.parentNode) {
          tablet.element.parentNode.removeChild(tablet.element);
        }
      });
    };
  }, [isActive, intensity, particleCount]);

  if (!isActive) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 15 }}
    />
  );
};

// Enhanced Medicine Wave with section-specific effects
export const SectionMedicineWave = ({
  sectionId,
  isVisible,
}: {
  sectionId: string;
  isVisible: boolean;
}) => {
  const [intensity, setIntensity] = useState(1);

  useEffect(() => {
    // Adjust intensity based on section
    const intensityMap: Record<string, number> = {
      welcome: 1.2,
      management: 0.8,
      scheduling: 1.0,
      records: 0.9,
      billing: 1.1,
      analytics: 1.3,
      resources: 0.7,
      security: 0.6,
      engagement: 1.0,
    };

    setIntensity(intensityMap[sectionId] || 1.0);
  }, [sectionId]);

  return (
    <MedicineWaveEffect
      isActive={isVisible}
      intensity={intensity}
      particleCount={20 + Math.floor(intensity * 10)}
    />
  );
};

// Medicine Burst Effect for special moments
export const MedicineBurstEffect = ({
  trigger,
  position,
}: {
  trigger: boolean;
  position: { x: number; y: number };
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !containerRef.current) return;

    const burstCount = 15;
    const elements: HTMLDivElement[] = [];

    for (let i = 0; i < burstCount; i++) {
      const element = document.createElement("div");
      const size = 6 + Math.random() * 8;
      const color = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"][
        Math.floor(Math.random() * 5)
      ];

      element.style.position = "absolute";
      element.style.width = `${size}px`;
      element.style.height = `${size * 0.6}px`;
      element.style.backgroundColor = color;
      element.style.borderRadius = "50%";
      element.style.left = `${position.x}px`;
      element.style.top = `${position.y}px`;
      element.style.transform = "translate(-50%, -50%)";
      element.style.pointerEvents = "none";
      element.style.zIndex = "20";
      element.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";

      containerRef.current.appendChild(element);
      elements.push(element);

      // Animate burst
      const angle = (i / burstCount) * Math.PI * 2;
      const distance = 50 + Math.random() * 100;
      const endX = position.x + Math.cos(angle) * distance;
      const endY = position.y + Math.sin(angle) * distance;

      gsap.to(element, {
        x: endX - position.x,
        y: endY - position.y,
        rotation: Math.random() * 720,
        scale: 0,
        duration: 1 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => {
          if (element.parentNode) {
            element.parentNode.removeChild(element);
          }
        },
      });
    }

    return () => {
      elements.forEach((element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [trigger, position.x, position.y]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 20 }}
    />
  );
};
