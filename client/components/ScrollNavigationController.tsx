import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export class ScrollNavigationController {
  private static instance: ScrollNavigationController;
  private isNavigating = false;
  
  static getInstance(): ScrollNavigationController {
    if (!ScrollNavigationController.instance) {
      ScrollNavigationController.instance = new ScrollNavigationController();
    }
    return ScrollNavigationController.instance;
  }

  /**
   * Jump to a specific progress point in the scroll journey
   * @param targetProgress - A value between 0 and 1 representing the target scroll position
   * @param duration - Animation duration in seconds
   * @param onComplete - Callback when navigation is complete
   */
  jumpToProgress(
    targetProgress: number, 
    duration: number = 2, 
    onComplete?: () => void
  ): Promise<void> {
    return new Promise((resolve) => {
      if (this.isNavigating) {
        resolve();
        return;
      }

      this.isNavigating = true;
      
      // Calculate target scroll position
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const targetScrollY = documentHeight * targetProgress;
      
      // Disable scroll triggers during navigation to prevent conflicts
      ScrollTrigger.getAll().forEach(trigger => {
        trigger.disable();
      });

      // Smooth scroll animation
      gsap.to(window, {
        scrollTo: { y: targetScrollY },
        duration: duration,
        ease: "power2.inOut",
        onComplete: () => {
          // Re-enable scroll triggers
          ScrollTrigger.getAll().forEach(trigger => {
            trigger.enable();
          });
          
          // Refresh scroll triggers to update positions
          ScrollTrigger.refresh();
          
          this.isNavigating = false;
          onComplete?.();
          resolve();
        }
      });
    });
  }

  /**
   * Jump to a specific feature by index
   * @param featureIndex - Index of the feature to jump to
   * @param totalFeatures - Total number of features
   * @param duration - Animation duration in seconds
   */
  jumpToFeature(
    featureIndex: number, 
    totalFeatures: number, 
    duration: number = 1.5
  ): Promise<void> {
    const progress = featureIndex / (totalFeatures - 1);
    return this.jumpToProgress(progress, duration);
  }

  /**
   * Restart the journey by scrolling to the top
   * @param duration - Animation duration in seconds
   */
  restartJourney(duration: number = 2): Promise<void> {
    return this.jumpToProgress(0, duration);
  }

  /**
   * Complete the journey by scrolling to the end
   * @param duration - Animation duration in seconds
   */
  completeJourney(duration: number = 2): Promise<void> {
    return this.jumpToProgress(1, duration);
  }

  /**
   * Get current scroll progress as a value between 0 and 1
   */
  getCurrentProgress(): number {
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScrollY = window.scrollY;
    return Math.min(Math.max(currentScrollY / documentHeight, 0), 1);
  }

  /**
   * Check if currently navigating
   */
  isCurrentlyNavigating(): boolean {
    return this.isNavigating;
  }

  /**
   * Add visual feedback for navigation
   * @param element - Element to animate
   * @param type - Type of feedback animation
   */
  addNavigationFeedback(element: HTMLElement | null, type: 'click' | 'hover' | 'active' = 'click'): void {
    if (!element) return;

    switch (type) {
      case 'click':
        gsap.fromTo(element, 
          { scale: 1 },
          { 
            scale: 1.1,
            duration: 0.15,
            yoyo: true,
            repeat: 1,
            ease: "power2.out"
          }
        );
        break;
      
      case 'hover':
        gsap.to(element, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
        break;
      
      case 'active':
        gsap.to(element, {
          scale: 1.1,
          boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
          duration: 0.5,
          ease: "power2.out"
        });
        break;
    }
  }

  /**
   * Create a scroll-synchronized progress indicator
   * @param callback - Function called with current progress (0-1)
   */
  onProgressUpdate(callback: (progress: number) => void): () => void {
    const updateProgress = () => {
      if (!this.isNavigating) {
        callback(this.getCurrentProgress());
      }
    };

    // Throttled scroll listener
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Return cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }
}

// React hook for using the scroll navigation controller
export const useScrollNavigation = () => {
  const controller = ScrollNavigationController.getInstance();
  
  return {
    jumpToProgress: controller.jumpToProgress.bind(controller),
    jumpToFeature: controller.jumpToFeature.bind(controller),
    restartJourney: controller.restartJourney.bind(controller),
    completeJourney: controller.completeJourney.bind(controller),
    getCurrentProgress: controller.getCurrentProgress.bind(controller),
    isNavigating: controller.isCurrentlyNavigating.bind(controller),
    addFeedback: controller.addNavigationFeedback.bind(controller),
    onProgressUpdate: controller.onProgressUpdate.bind(controller)
  };
};
