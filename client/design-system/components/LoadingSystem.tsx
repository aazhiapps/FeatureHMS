import React, { memo, useMemo, useCallback, forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { designTokens } from '../tokens';

// Loading spinner variants
const spinnerVariants = {
  default: 'border-gray-200 border-t-blue-600',
  primary: 'border-blue-200 border-t-blue-600',
  success: 'border-green-200 border-t-green-600',
  warning: 'border-amber-200 border-t-amber-600',
  error: 'border-red-200 border-t-red-600',
  medical: 'border-purple-200 border-t-purple-600',
  white: 'border-white/20 border-t-white',
};

// Loading sizes
const spinnerSizes = {
  xs: 'w-3 h-3 border',
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-2',
  xl: 'w-12 h-12 border-4',
};

// Basic Spinner Component
interface SpinnerProps {
  size?: keyof typeof spinnerSizes;
  variant?: keyof typeof spinnerVariants;
  className?: string;
}

export const Spinner = memo<SpinnerProps>(({ 
  size = 'md', 
  variant = 'primary',
  className 
}) => (
  <div
    className={cn(
      'animate-spin rounded-full',
      spinnerSizes[size],
      spinnerVariants[variant],
      className
    )}
    role="status"
    aria-label="Loading"
  />
));

Spinner.displayName = 'Spinner';

// Pulsing Dot Loader
interface PulsingDotsProps {
  variant?: keyof typeof spinnerVariants;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PulsingDots = memo<PulsingDotsProps>(({ 
  variant = 'primary',
  size = 'md',
  className 
}) => {
  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const baseColor = variant === 'primary' ? 'bg-blue-600' :
                   variant === 'success' ? 'bg-green-600' :
                   variant === 'warning' ? 'bg-amber-600' :
                   variant === 'error' ? 'bg-red-600' :
                   variant === 'medical' ? 'bg-purple-600' :
                   'bg-gray-600';

  return (
    <div className={cn('flex space-x-1', className)} role="status" aria-label="Loading">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            dotSizes[size],
            baseColor
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );
});

PulsingDots.displayName = 'PulsingDots';

// Medical Heartbeat Loader
export const HeartbeatLoader = memo<{ className?: string }>(({ className }) => (
  <div className={cn('flex items-center justify-center', className)} role="status" aria-label="Loading">
    <div className="relative">
      <div className="w-8 h-8 text-red-500">
        <svg viewBox="0 0 24 24" fill="currentColor" className="animate-pulse">
          <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
        </svg>
      </div>
      <div className="absolute inset-0 w-8 h-8 text-red-500 animate-ping opacity-75">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
        </svg>
      </div>
    </div>
  </div>
));

HeartbeatLoader.displayName = 'HeartbeatLoader';

// DNA Double Helix Loader
export const DNALoader = memo<{ className?: string }>(({ className }) => (
  <div className={cn('relative w-16 h-16', className)} role="status" aria-label="Loading">
    {/* DNA strands */}
    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
      <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500 rounded-full transform -translate-x-1/2 rotate-45" />
      <div className="absolute top-0 left-1/2 w-1 h-full bg-gradient-to-b from-green-500 to-blue-500 rounded-full transform -translate-x-1/2 -rotate-45" />
    </div>
    
    {/* DNA base pairs */}
    {[0, 1, 2, 3].map((i) => (
      <div
        key={i}
        className="absolute w-1 h-4 bg-purple-400 rounded-full"
        style={{
          top: `${20 + i * 15}%`,
          left: '50%',
          transform: 'translateX(-50%)',
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
));

DNALoader.displayName = 'DNALoader';

// Progress Circle
interface ProgressCircleProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  variant?: keyof typeof spinnerVariants;
  showPercentage?: boolean;
  className?: string;
}

export const ProgressCircle = memo<ProgressCircleProps>(({
  progress,
  size = 64,
  strokeWidth = 4,
  variant = 'primary',
  showPercentage = true,
  className
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const strokeColor = variant === 'primary' ? '#3b82f6' :
                     variant === 'success' ? '#10b981' :
                     variant === 'warning' ? '#f59e0b' :
                     variant === 'error' ? '#ef4444' :
                     variant === 'medical' ? '#8b5cf6' :
                     '#6b7280';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-out"
        />
      </svg>
      {showPercentage && (
        <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
});

ProgressCircle.displayName = 'ProgressCircle';

// Skeleton Loader
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = memo<SkeletonProps>(({
  className,
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
}) => {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };

  const style = useMemo(() => ({
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  }), [width, height]);

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      role="status"
      aria-label="Loading"
    />
  );
});

Skeleton.displayName = 'Skeleton';

// Full Screen Loading Overlay
interface LoadingOverlayProps {
  isVisible: boolean;
  variant?: 'default' | 'medical' | 'dna';
  message?: string;
  progress?: number;
  className?: string;
  onCancel?: () => void;
}

export const LoadingOverlay = memo<LoadingOverlayProps>(({
  isVisible,
  variant = 'default',
  message = 'Loading...',
  progress,
  className,
  onCancel
}) => {
  const renderLoader = useCallback(() => {
    switch (variant) {
      case 'medical':
        return <HeartbeatLoader />;
      case 'dna':
        return <DNALoader />;
      default:
        return progress !== undefined ? (
          <ProgressCircle progress={progress} size={80} />
        ) : (
          <Spinner size="xl" />
        );
    }
  }, [variant, progress]);

  if (!isVisible) return null;

  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center',
        'bg-white/80 backdrop-blur-sm',
        className
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center space-y-4 p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
        {renderLoader()}
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{message}</h3>
          {progress !== undefined && (
            <p className="text-sm text-gray-600">
              {Math.round(progress)}% complete
            </p>
          )}
        </div>

        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';

// Loading State Hook
export const useLoadingState = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);
  const [progress, setProgress] = React.useState(0);
  const [message, setMessage] = React.useState('Loading...');

  const startLoading = useCallback((loadingMessage?: string) => {
    setIsLoading(true);
    setProgress(0);
    if (loadingMessage) setMessage(loadingMessage);
  }, []);

  const updateProgress = useCallback((newProgress: number, newMessage?: string) => {
    setProgress(Math.max(0, Math.min(100, newProgress)));
    if (newMessage) setMessage(newMessage);
  }, []);

  const finishLoading = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  }, []);

  return {
    isLoading,
    progress,
    message,
    startLoading,
    updateProgress,
    finishLoading,
    setMessage,
  };
};

export default {
  Spinner,
  PulsingDots,
  HeartbeatLoader,
  DNALoader,
  ProgressCircle,
  Skeleton,
  LoadingOverlay,
  useLoadingState,
};
