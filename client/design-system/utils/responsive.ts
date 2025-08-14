import { useEffect, useState, useMemo } from 'react';

// Breakpoint definitions (mobile-first approach)
export const breakpoints = {
  xs: 320,   // Small phones
  sm: 640,   // Large phones
  md: 768,   // Tablets
  lg: 1024,  // Laptops
  xl: 1280,  // Desktops
  '2xl': 1536, // Large desktops
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Mobile-first media queries
export const mediaQueries = {
  xs: `(min-width: ${breakpoints.xs}px)`,
  sm: `(min-width: ${breakpoints.sm}px)`,
  md: `(min-width: ${breakpoints.md}px)`,
  lg: `(min-width: ${breakpoints.lg}px)`,
  xl: `(min-width: ${breakpoints.xl}px)`,
  '2xl': `(min-width: ${breakpoints['2xl']}px)`,
} as const;

// Device type detection
export const deviceTypes = {
  mobile: `(max-width: ${breakpoints.md - 1}px)`,
  tablet: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
  touch: '(pointer: coarse)',
  mouse: '(pointer: fine)',
} as const;

// Responsive hook for breakpoint detection
export const useBreakpoint = () => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });

      // Determine current breakpoint
      if (width >= breakpoints['2xl']) {
        setCurrentBreakpoint('2xl');
      } else if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else if (width >= breakpoints.sm) {
        setCurrentBreakpoint('sm');
      } else {
        setCurrentBreakpoint('xs');
      }
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isBreakpoint = useMemo(() => ({
    xs: currentBreakpoint === 'xs',
    sm: currentBreakpoint === 'sm',
    md: currentBreakpoint === 'md',
    lg: currentBreakpoint === 'lg',
    xl: currentBreakpoint === 'xl',
    '2xl': currentBreakpoint === '2xl',
    mobile: ['xs', 'sm'].includes(currentBreakpoint),
    tablet: currentBreakpoint === 'md',
    desktop: ['lg', 'xl', '2xl'].includes(currentBreakpoint),
  }), [currentBreakpoint]);

  const isMinWidth = useMemo(() => ({
    xs: windowSize.width >= breakpoints.xs,
    sm: windowSize.width >= breakpoints.sm,
    md: windowSize.width >= breakpoints.md,
    lg: windowSize.width >= breakpoints.lg,
    xl: windowSize.width >= breakpoints.xl,
    '2xl': windowSize.width >= breakpoints['2xl'],
  }), [windowSize.width]);

  return {
    currentBreakpoint,
    windowSize,
    isBreakpoint,
    isMinWidth,
    isMobile: isBreakpoint.mobile,
    isTablet: isBreakpoint.tablet,
    isDesktop: isBreakpoint.desktop,
  };
};

// Device capability detection hook
export const useDeviceCapabilities = () => {
  const [capabilities, setCapabilities] = useState({
    hasTouch: false,
    hasMouse: false,
    supportsHover: false,
    prefersReducedMotion: false,
    supportsFocus: false,
    isHighDPI: false,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      setCapabilities({
        hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        hasMouse: window.matchMedia('(pointer: fine)').matches,
        supportsHover: window.matchMedia('(hover: hover)').matches,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        supportsFocus: 'focus' in HTMLElement.prototype,
        isHighDPI: window.devicePixelRatio > 1,
      });
    };

    checkCapabilities();

    // Listen for changes in media queries
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerQuery = window.matchMedia('(pointer: fine)');
    const hoverQuery = window.matchMedia('(hover: hover)');

    const handleChange = () => checkCapabilities();

    motionQuery.addEventListener('change', handleChange);
    pointerQuery.addEventListener('change', handleChange);
    hoverQuery.addEventListener('change', handleChange);

    return () => {
      motionQuery.removeEventListener('change', handleChange);
      pointerQuery.removeEventListener('change', handleChange);
      hoverQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return capabilities;
};

// Responsive value hook - returns different values based on breakpoint
export const useResponsiveValue = <T>(values: Partial<Record<Breakpoint, T>>) => {
  const { currentBreakpoint } = useBreakpoint();

  return useMemo(() => {
    // Start from current breakpoint and work down to find a value
    const breakpointOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);

    for (let i = currentIndex; i < breakpointOrder.length; i++) {
      const bp = breakpointOrder[i];
      if (values[bp] !== undefined) {
        return values[bp];
      }
    }

    // Fallback to smallest available value
    return values.xs || values.sm || values.md || values.lg || values.xl || values['2xl'];
  }, [values, currentBreakpoint]);
};

// Responsive grid hook
export const useResponsiveGrid = () => {
  const { currentBreakpoint } = useBreakpoint();

  const getGridCols = useMemo(() => (
    mobile: number,
    tablet: number = mobile,
    desktop: number = tablet
  ) => {
    switch (currentBreakpoint) {
      case 'xs':
      case 'sm':
        return mobile;
      case 'md':
        return tablet;
      case 'lg':
      case 'xl':
      case '2xl':
        return desktop;
      default:
        return mobile;
    }
  }, [currentBreakpoint]);

  const getGridClasses = useMemo(() => (
    mobile: string,
    tablet?: string,
    desktop?: string
  ) => {
    const classes = [mobile];
    if (tablet) classes.push(`md:${tablet}`);
    if (desktop) classes.push(`lg:${desktop}`);
    return classes.join(' ');
  }, []);

  return { getGridCols, getGridClasses };
};

// Container sizing utility
export const useResponsiveContainer = () => {
  const { currentBreakpoint } = useBreakpoint();

  const getContainerClasses = useMemo(() => {
    const baseClasses = 'mx-auto px-4';
    
    switch (currentBreakpoint) {
      case 'xs':
        return `${baseClasses} max-w-none`;
      case 'sm':
        return `${baseClasses} max-w-sm sm:px-6`;
      case 'md':
        return `${baseClasses} max-w-2xl md:px-8`;
      case 'lg':
        return `${baseClasses} max-w-4xl lg:px-10`;
      case 'xl':
        return `${baseClasses} max-w-6xl xl:px-12`;
      case '2xl':
        return `${baseClasses} max-w-7xl 2xl:px-16`;
      default:
        return baseClasses;
    }
  }, [currentBreakpoint]);

  return { getContainerClasses };
};

// Typography scaling utility
export const useResponsiveTypography = () => {
  const { currentBreakpoint } = useBreakpoint();

  const getTextSize = useMemo(() => (
    mobile: string,
    tablet?: string,
    desktop?: string
  ) => {
    const base = mobile;
    const md = tablet || mobile;
    const lg = desktop || tablet || mobile;

    switch (currentBreakpoint) {
      case 'xs':
      case 'sm':
        return base;
      case 'md':
        return md;
      case 'lg':
      case 'xl':
      case '2xl':
        return lg;
      default:
        return base;
    }
  }, [currentBreakpoint]);

  const getResponsiveTextClasses = useMemo(() => (
    mobile: string,
    tablet?: string,
    desktop?: string
  ) => {
    const classes = [mobile];
    if (tablet) classes.push(`md:${tablet}`);
    if (desktop) classes.push(`lg:${desktop}`);
    return classes.join(' ');
  }, []);

  return { getTextSize, getResponsiveTextClasses };
};

// Spacing utility for responsive design
export const useResponsiveSpacing = () => {
  const { currentBreakpoint } = useBreakpoint();

  const getSpacing = useMemo(() => (
    mobile: number,
    tablet?: number,
    desktop?: number
  ) => {
    switch (currentBreakpoint) {
      case 'xs':
      case 'sm':
        return mobile;
      case 'md':
        return tablet || mobile;
      case 'lg':
      case 'xl':
      case '2xl':
        return desktop || tablet || mobile;
      default:
        return mobile;
    }
  }, [currentBreakpoint]);

  const getSpacingClasses = useMemo(() => (
    property: 'p' | 'm' | 'px' | 'py' | 'pt' | 'pb' | 'pl' | 'pr' | 'mx' | 'my' | 'mt' | 'mb' | 'ml' | 'mr',
    mobile: number,
    tablet?: number,
    desktop?: number
  ) => {
    const classes = [`${property}-${mobile}`];
    if (tablet) classes.push(`md:${property}-${tablet}`);
    if (desktop) classes.push(`lg:${property}-${desktop}`);
    return classes.join(' ');
  }, []);

  return { getSpacing, getSpacingClasses };
};

// Performance-optimized image sizing
export const useResponsiveImages = () => {
  const { windowSize, currentBreakpoint } = useBreakpoint();

  const getImageSizes = useMemo(() => (
    config: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    }
  ) => {
    const mobile = config.mobile || 100;
    const tablet = config.tablet || mobile;
    const desktop = config.desktop || tablet;

    return `(max-width: ${breakpoints.md}px) ${mobile}vw, (max-width: ${breakpoints.lg}px) ${tablet}vw, ${desktop}vw`;
  }, []);

  const getOptimalImageWidth = useMemo(() => (
    config: {
      mobile?: number;
      tablet?: number;
      desktop?: number;
    }
  ) => {
    const mobile = config.mobile || windowSize.width;
    const tablet = config.tablet || mobile;
    const desktop = config.desktop || tablet;

    switch (currentBreakpoint) {
      case 'xs':
      case 'sm':
        return mobile;
      case 'md':
        return tablet;
      default:
        return desktop;
    }
  }, [windowSize.width, currentBreakpoint]);

  return { getImageSizes, getOptimalImageWidth };
};

// CSS custom properties for responsive design
export const generateResponsiveCSS = () => {
  const cssVars: Record<string, string> = {};

  // Breakpoint variables
  Object.entries(breakpoints).forEach(([key, value]) => {
    cssVars[`--breakpoint-${key}`] = `${value}px`;
  });

  // Container max-widths
  cssVars['--container-xs'] = '100%';
  cssVars['--container-sm'] = '640px';
  cssVars['--container-md'] = '768px';
  cssVars['--container-lg'] = '1024px';
  cssVars['--container-xl'] = '1280px';
  cssVars['--container-2xl'] = '1536px';

  return cssVars;
};

export default {
  breakpoints,
  mediaQueries,
  deviceTypes,
  useBreakpoint,
  useDeviceCapabilities,
  useResponsiveValue,
  useResponsiveGrid,
  useResponsiveContainer,
  useResponsiveTypography,
  useResponsiveSpacing,
  useResponsiveImages,
  generateResponsiveCSS,
};
