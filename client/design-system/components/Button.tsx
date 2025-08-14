import React, { forwardRef, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { designTokens } from '../tokens';

// Button variants using CVA for type-safe variants
const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 transform-gpu',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-xl focus-visible:ring-blue-500',
        secondary: 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg hover:from-green-700 hover:to-green-800 hover:shadow-xl focus-visible:ring-green-500',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:from-green-600 hover:to-emerald-700 hover:shadow-xl focus-visible:ring-green-500',
        warning: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg hover:from-amber-600 hover:to-orange-700 hover:shadow-xl focus-visible:ring-amber-500',
        error: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl focus-visible:ring-red-500',
        outline: 'border-2 border-blue-200 bg-transparent text-blue-700 hover:bg-blue-50 hover:border-blue-300 focus-visible:ring-blue-500',
        ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus-visible:ring-gray-500',
        link: 'text-blue-600 underline-offset-4 hover:underline focus-visible:ring-blue-500',
        glass: 'bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20 shadow-xl focus-visible:ring-white/50',
        medical: 'bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg hover:from-purple-700 hover:to-indigo-800 hover:shadow-xl focus-visible:ring-purple-500',
        emergency: 'bg-gradient-to-r from-red-600 to-pink-700 text-white shadow-lg hover:from-red-700 hover:to-pink-800 hover:shadow-xl animate-pulse focus-visible:ring-red-500',
      },
      size: {
        xs: 'h-7 px-2 text-xs',
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
      loading: {
        true: 'cursor-not-allowed',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      loading: false,
    },
  }
);

// Enhanced button props
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

// Loading spinner component
const LoadingSpinner = ({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' | 'lg' }) => {
  const sizeMap = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <svg
      className={cn('animate-spin', sizeMap[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Main Button component
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant,
    size,
    fullWidth,
    loading,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    // Determine spinner size based on button size
    const spinnerSize = useMemo(() => {
      switch (size) {
        case 'xs': return 'xs';
        case 'sm': return 'sm';
        case 'md': return 'sm';
        case 'lg': return 'md';
        case 'xl': return 'lg';
        default: return 'sm';
      }
    }, [size]);

    const isDisabled = disabled || loading;

    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, loading, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Left Icon */}
        {leftIcon && !loading && (
          <span className="mr-2 flex-shrink-0">
            {leftIcon}
          </span>
        )}

        {/* Loading Spinner */}
        {loading && (
          <span className="mr-2 flex-shrink-0">
            <LoadingSpinner size={spinnerSize} />
          </span>
        )}

        {/* Button Content */}
        <span className="flex-1">
          {loading && loadingText ? loadingText : children}
        </span>

        {/* Right Icon */}
        {rightIcon && !loading && (
          <span className="ml-2 flex-shrink-0">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Specialized Healthcare Buttons
export const EmergencyButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => (
    <Button
      ref={ref}
      variant="emergency"
      leftIcon={
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      }
      {...props}
    />
  )
);

export const MedicalButton = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'variant'>>(
  (props, ref) => (
    <Button
      ref={ref}
      variant="medical"
      leftIcon={
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      }
      {...props}
    />
  )
);

export const CallToActionButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="primary"
      size="lg"
      className="group relative overflow-hidden"
      rightIcon={
        <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      }
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Button>
  )
);

export default Button;
