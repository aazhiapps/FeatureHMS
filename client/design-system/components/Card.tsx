import React, { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Card variants using CVA
const cardVariants = cva(
  // Base styles
  'relative rounded-lg border transition-all duration-300 transform-gpu',
  {
    variants: {
      variant: {
        default: 'bg-white border-gray-200 shadow-sm hover:shadow-md',
        elevated: 'bg-white border-gray-200 shadow-lg hover:shadow-xl',
        outlined: 'bg-transparent border-2 border-gray-200 hover:border-gray-300',
        ghost: 'bg-transparent border-none',
        glass: 'bg-white/10 backdrop-blur-lg border-white/20 shadow-xl',
        gradient: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-lg',
        medical: 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg',
        emergency: 'bg-gradient-to-br from-red-50 to-pink-100 border-red-200 shadow-lg',
        interactive: 'bg-white border-gray-200 shadow-sm hover:shadow-xl hover:scale-[1.02] cursor-pointer',
        floating: 'bg-white/95 backdrop-blur-sm border-white/50 shadow-2xl hover:shadow-3xl',
      },
      size: {
        sm: 'p-4',
        md: 'p-6', 
        lg: 'p-8',
        xl: 'p-10',
      },
      rounded: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
      },
      glow: {
        none: '',
        blue: 'shadow-blue-500/25 hover:shadow-blue-500/40',
        green: 'shadow-green-500/25 hover:shadow-green-500/40',
        purple: 'shadow-purple-500/25 hover:shadow-purple-500/40',
        red: 'shadow-red-500/25 hover:shadow-red-500/40',
        amber: 'shadow-amber-500/25 hover:shadow-amber-500/40',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      rounded: 'lg',
      glow: 'none',
    },
  }
);

// Card props interface
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  asChild?: boolean;
  hoverable?: boolean;
  loading?: boolean;
}

// Main Card component
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, rounded, glow, hoverable, loading, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size, rounded, glow }),
          hoverable && 'hover:scale-[1.02] cursor-pointer',
          loading && 'animate-pulse pointer-events-none',
          className
        )}
        {...props}
      >
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
          </div>
        ) : (
          children
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card subcomponents
export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 pb-4', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold leading-none tracking-tight text-gray-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-600 leading-relaxed', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center pt-4', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

// Specialized healthcare cards
export const HealthcareCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'> & {
  icon?: React.ReactNode;
  status?: 'active' | 'inactive' | 'warning' | 'error';
  metric?: string;
  metricLabel?: string;
}>(
  ({ icon, status = 'active', metric, metricLabel, children, className, ...props }, ref) => {
    const statusColors = {
      active: 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-100',
      inactive: 'border-gray-200 bg-gradient-to-br from-gray-50 to-slate-100',
      warning: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-100',
      error: 'border-red-200 bg-gradient-to-br from-red-50 to-pink-100',
    };

    const statusIndicators = {
      active: 'bg-green-500',
      inactive: 'bg-gray-400',
      warning: 'bg-amber-500',
      error: 'bg-red-500',
    };

    return (
      <Card
        ref={ref}
        className={cn(statusColors[status], className)}
        hoverable
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/50 flex items-center justify-center">
                {icon}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {children}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {metric && (
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{metric}</div>
                {metricLabel && (
                  <div className="text-xs text-gray-600">{metricLabel}</div>
                )}
              </div>
            )}
            <div className={cn('w-3 h-3 rounded-full', statusIndicators[status])} />
          </div>
        </div>
      </Card>
    );
  }
);

HealthcareCard.displayName = 'HealthcareCard';

export const StatsCard = forwardRef<HTMLDivElement, Omit<CardProps, 'variant'> & {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
}>(
  ({ title, value, change, changeType = 'neutral', icon, className, ...props }, ref) => {
    const changeColors = {
      positive: 'text-green-600 bg-green-100',
      negative: 'text-red-600 bg-red-100',
      neutral: 'text-gray-600 bg-gray-100',
    };

    return (
      <Card
        ref={ref}
        variant="elevated"
        className={cn('transition-all duration-300 hover:scale-105', className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{value}</p>
            {change && (
              <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-medium', changeColors[changeType])}>
                {changeType === 'positive' && '↗'}
                {changeType === 'negative' && '↘'}
                {changeType === 'neutral' && '→'}
                {change}
              </span>
            )}
          </div>
          {icon && (
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              {icon}
            </div>
          )}
        </div>
      </Card>
    );
  }
);

StatsCard.displayName = 'StatsCard';

export default Card;
