import React, { useEffect, useState, useRef } from "react";

interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  animationCount: number;
  renderTime: number;
}

export const PerformanceMonitor: React.FC<{ enabled?: boolean }> = ({
  enabled = process.env.NODE_ENV === "development",
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    animationCount: 0,
    renderTime: 0,
  });
  const frameRef = useRef(0);
  const lastTimeRef = useRef(0);
  const framesRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    let animationId: number;

    const measurePerformance = (currentTime: number) => {
      framesRef.current++;

      if (currentTime - lastTimeRef.current >= 1000) {
        const fps = Math.round(
          (framesRef.current * 1000) / (currentTime - lastTimeRef.current),
        );

        setMetrics((prev) => ({
          ...prev,
          fps,
          memoryUsage: (performance as any).memory
            ? Math.round(
                (performance as any).memory.usedJSHeapSize / 1024 / 1024,
              )
            : 0,
          renderTime: performance.now() - currentTime,
        }));

        framesRef.current = 0;
        lastTimeRef.current = currentTime;
      }

      animationId = requestAnimationFrame(measurePerformance);
    };

    animationId = requestAnimationFrame(measurePerformance);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-lg text-white p-4 rounded-lg text-xs font-mono border border-white/20">
      <h3 className="text-cyan-400 font-bold mb-2">Performance Monitor</h3>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span
            className={
              metrics.fps > 50
                ? "text-green-400"
                : metrics.fps > 30
                  ? "text-yellow-400"
                  : "text-red-400"
            }
          >
            {metrics.fps}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Memory:</span>
          <span className="text-blue-400">{metrics.memoryUsage}MB</span>
        </div>
        <div className="flex justify-between">
          <span>Render:</span>
          <span className="text-purple-400">
            {metrics.renderTime.toFixed(2)}ms
          </span>
        </div>
      </div>
    </div>
  );
};

// Animation Performance Optimizer
export class AnimationOptimizer {
  private static instance: AnimationOptimizer;
  private activeAnimations = new Set<string>();
  private maxAnimations = 50;
  private performanceThreshold = 30; // FPS

  static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer();
    }
    return AnimationOptimizer.instance;
  }

  registerAnimation(id: string): boolean {
    if (this.activeAnimations.size >= this.maxAnimations) {
      console.warn("Animation limit reached. Skipping animation:", id);
      return false;
    }

    this.activeAnimations.add(id);
    return true;
  }

  unregisterAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  shouldReduceAnimations(): boolean {
    return this.activeAnimations.size > this.maxAnimations * 0.8;
  }

  getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }
}

// GPU Performance Checker
export const useGPUPerformance = () => {
  const [isGPUAccelerated, setIsGPUAccelerated] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (gl) {
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);

      // Check for software rendering
      const isSoftwareRendering =
        renderer.includes("Software") ||
        renderer.includes("Microsoft") ||
        vendor.includes("Microsoft");

      setIsGPUAccelerated(!isSoftwareRendering);
    } else {
      setIsGPUAccelerated(false);
    }

    canvas.remove();
  }, []);

  return isGPUAccelerated;
};

// Reduced Motion Hook
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
};

export default PerformanceMonitor;
