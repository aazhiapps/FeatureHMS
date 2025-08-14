import { useEffect, useCallback, useRef, useState } from 'react';

// Focus management hook
export const useFocusManagement = () => {
  const focusableElementsSelector = 
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]';

  const trapFocus = useCallback((element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(focusableElementsSelector);
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, []);

  const restoreFocus = useCallback((previousActiveElement: Element | null) => {
    if (previousActiveElement && 'focus' in previousActiveElement) {
      (previousActiveElement as HTMLElement).focus();
    }
  }, []);

  return { trapFocus, restoreFocus };
};

// Keyboard navigation hook
export const useKeyboardNavigation = () => {
  const handleKeyDown = useCallback((event: KeyboardEvent, actions: Record<string, () => void>) => {
    const key = event.key.toLowerCase();
    if (actions[key]) {
      event.preventDefault();
      actions[key]();
    }
  }, []);

  const addKeyboardShortcuts = useCallback((shortcuts: Record<string, () => void>) => {
    const handler = (event: KeyboardEvent) => handleKeyDown(event, shortcuts);
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleKeyDown]);

  return { addKeyboardShortcuts };
};

// Screen reader announcements hook
export const useScreenReader = () => {
  const announceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Create invisible announcement element for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-10000px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    
    document.body.appendChild(announcer);
    announceRef.current = announcer;

    return () => {
      if (announcer.parentNode) {
        announcer.parentNode.removeChild(announcer);
      }
    };
  }, []);

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      
      // Clear after announcement to allow repeat announcements
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return { announce };
};

// Reduced motion preference hook
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// High contrast preference hook
export const useHighContrast = () => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// ARIA helper hooks
export const useARIA = () => {
  const generateId = useCallback((prefix = 'element') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const createARIAProps = useCallback((
    options: {
      label?: string;
      labelledBy?: string;
      describedBy?: string;
      expanded?: boolean;
      selected?: boolean;
      checked?: boolean;
      disabled?: boolean;
      required?: boolean;
      invalid?: boolean;
      live?: 'polite' | 'assertive' | 'off';
      atomic?: boolean;
      controls?: string;
      owns?: string;
      role?: string;
    }
  ) => {
    const ariaProps: Record<string, any> = {};

    if (options.label) ariaProps['aria-label'] = options.label;
    if (options.labelledBy) ariaProps['aria-labelledby'] = options.labelledBy;
    if (options.describedBy) ariaProps['aria-describedby'] = options.describedBy;
    if (options.expanded !== undefined) ariaProps['aria-expanded'] = options.expanded;
    if (options.selected !== undefined) ariaProps['aria-selected'] = options.selected;
    if (options.checked !== undefined) ariaProps['aria-checked'] = options.checked;
    if (options.disabled !== undefined) ariaProps['aria-disabled'] = options.disabled;
    if (options.required !== undefined) ariaProps['aria-required'] = options.required;
    if (options.invalid !== undefined) ariaProps['aria-invalid'] = options.invalid;
    if (options.live) ariaProps['aria-live'] = options.live;
    if (options.atomic !== undefined) ariaProps['aria-atomic'] = options.atomic;
    if (options.controls) ariaProps['aria-controls'] = options.controls;
    if (options.owns) ariaProps['aria-owns'] = options.owns;
    if (options.role) ariaProps['role'] = options.role;

    return ariaProps;
  }, []);

  return { generateId, createARIAProps };
};

// Skip navigation hook
export const useSkipNavigation = () => {
  const skipLinksRef = useRef<HTMLDivElement | null>(null);

  const createSkipLink = useCallback((
    targetId: string, 
    text: string,
    className = 'absolute left-0 top-0 z-50 p-2 bg-blue-600 text-white transform -translate-y-full focus:translate-y-0 transition-transform'
  ) => {
    const link = document.createElement('a');
    link.href = `#${targetId}`;
    link.textContent = text;
    link.className = className;
    link.setAttribute('aria-label', `Skip to ${text.toLowerCase()}`);
    
    return link;
  }, []);

  const addSkipLinks = useCallback((
    links: Array<{ targetId: string; text: string; className?: string }>
  ) => {
    if (!skipLinksRef.current) {
      const container = document.createElement('div');
      container.setAttribute('aria-label', 'Skip navigation links');
      container.style.position = 'relative';
      container.style.zIndex = '9999';
      
      document.body.insertBefore(container, document.body.firstChild);
      skipLinksRef.current = container;
    }

    links.forEach(({ targetId, text, className }) => {
      const link = createSkipLink(targetId, text, className);
      skipLinksRef.current?.appendChild(link);
    });

    return () => {
      if (skipLinksRef.current?.parentNode) {
        skipLinksRef.current.parentNode.removeChild(skipLinksRef.current);
        skipLinksRef.current = null;
      }
    };
  }, [createSkipLink]);

  return { addSkipLinks };
};

// Custom hook for managing loading states accessibility
export const useLoadingAnnouncement = () => {
  const { announce } = useScreenReader();
  
  const announceLoading = useCallback((message = 'Loading content') => {
    announce(message, 'polite');
  }, [announce]);

  const announceLoadingComplete = useCallback((message = 'Content loaded') => {
    announce(message, 'polite');
  }, [announce]);

  const announceError = useCallback((message = 'An error occurred') => {
    announce(message, 'assertive');
  }, [announce]);

  return {
    announceLoading,
    announceLoadingComplete,
    announceError,
  };
};

// Healthcare-specific accessibility utilities
export const useHealthcareAccessibility = () => {
  const { announce } = useScreenReader();
  
  const announcePatientUpdate = useCallback((patientName: string, action: string) => {
    announce(`Patient ${patientName}: ${action}`, 'polite');
  }, [announce]);

  const announceSystemStatus = useCallback((system: string, status: 'online' | 'offline' | 'maintenance') => {
    const urgency = status === 'offline' ? 'assertive' : 'polite';
    announce(`${system} is ${status}`, urgency);
  }, [announce]);

  const announceAppointment = useCallback((action: 'scheduled' | 'cancelled' | 'updated', time?: string) => {
    const message = time 
      ? `Appointment ${action} for ${time}`
      : `Appointment ${action}`;
    announce(message, 'polite');
  }, [announce]);

  const announceEmergency = useCallback((message: string) => {
    announce(`Emergency: ${message}`, 'assertive');
  }, [announce]);

  return {
    announcePatientUpdate,
    announceSystemStatus,
    announceAppointment,
    announceEmergency,
  };
};

// Form accessibility hook
export const useFormAccessibility = () => {
  const { createARIAProps } = useARIA();

  const createFormFieldProps = useCallback((
    fieldName: string,
    options: {
      required?: boolean;
      invalid?: boolean;
      errorMessage?: string;
      helpText?: string;
    } = {}
  ) => {
    const describedByIds = [];
    
    if (options.helpText) {
      describedByIds.push(`${fieldName}-help`);
    }
    
    if (options.invalid && options.errorMessage) {
      describedByIds.push(`${fieldName}-error`);
    }

    return {
      ...createARIAProps({
        required: options.required,
        invalid: options.invalid,
        describedBy: describedByIds.length > 0 ? describedByIds.join(' ') : undefined,
      }),
      name: fieldName,
      id: fieldName,
    };
  }, [createARIAProps]);

  return { createFormFieldProps };
};

export default {
  useFocusManagement,
  useKeyboardNavigation,
  useScreenReader,
  useReducedMotion,
  useHighContrast,
  useARIA,
  useSkipNavigation,
  useLoadingAnnouncement,
  useHealthcareAccessibility,
  useFormAccessibility,
};
