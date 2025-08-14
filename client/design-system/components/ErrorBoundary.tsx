import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
  showDetails?: boolean;
}

// Generate unique error ID for debugging
const generateErrorId = () => {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Log error to external service (implement your own logging service)
const logErrorToService = (error: Error, errorInfo: ErrorInfo, errorId: string) => {
  // Example: Send to logging service
  console.group(`🚨 Error Boundary Caught Error [${errorId}]`);
  console.error('Error:', error);
  console.error('Error Info:', errorInfo);
  console.error('Component Stack:', errorInfo.componentStack);
  console.groupEnd();
  
  // In production, send to your error reporting service:
  // Sentry.captureException(error, { extra: errorInfo, tags: { errorId } });
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;

    this.setState({ errorInfo });

    // Log error
    logErrorToService(error, errorInfo, errorId);

    // Call custom error handler
    onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    });
  };

  handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    if (error && errorInfo) {
      // Create error report
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href,
      };

      // Copy to clipboard or send to support
      navigator.clipboard?.writeText(JSON.stringify(errorReport, null, 2));
      alert('Error report copied to clipboard. Please share this with our support team.');
    }
  };

  render() {
    const { hasError, error, errorInfo, errorId } = this.state;
    const { children, fallback, level = 'component', showDetails = false } = this.props;

    if (hasError) {
      // Custom fallback UI
      if (fallback) {
        return fallback;
      }

      // Default error UI based on level
      return (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          errorId={errorId}
          level={level}
          showDetails={showDetails}
          onRetry={this.handleRetry}
          onReport={this.handleReportError}
        />
      );
    }

    return children;
  }
}

// Error fallback component
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  level: 'page' | 'section' | 'component';
  showDetails: boolean;
  onRetry: () => void;
  onReport: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorInfo,
  errorId,
  level,
  showDetails,
  onRetry,
  onReport,
}) => {
  const getErrorContent = () => {
    switch (level) {
      case 'page':
        return {
          title: 'Oops! Something went wrong',
          description: 'We encountered an unexpected error while loading this page. Our team has been notified.',
          icon: '🚨',
          size: 'large' as const,
        };
      case 'section':
        return {
          title: 'Section Error',
          description: 'This section failed to load properly.',
          icon: '⚠️',
          size: 'medium' as const,
        };
      case 'component':
        return {
          title: 'Component Error',
          description: 'A component failed to render.',
          icon: '🔧',
          size: 'small' as const,
        };
    }
  };

  const { title, description, icon, size } = getErrorContent();

  const sizeClasses = {
    large: 'p-8 max-w-2xl mx-auto',
    medium: 'p-6 max-w-lg',
    small: 'p-4 max-w-md',
  };

  const iconSizes = {
    large: 'text-6xl',
    medium: 'text-4xl', 
    small: 'text-2xl',
  };

  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <Card variant="outlined" className={sizeClasses[size]}>
        <CardHeader className="text-center">
          <div className={`${iconSizes[size]} mb-4`} role="img" aria-label="Error">
            {icon}
          </div>
          <CardTitle className="text-red-600">{title}</CardTitle>
          <p className="text-gray-600 mt-2">{description}</p>
          
          {showDetails && error && (
            <details className="mt-4 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Technical Details
              </summary>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border">
                <div className="mb-2">
                  <strong className="text-xs text-gray-600">Error ID:</strong>
                  <code className="ml-2 text-xs bg-gray-200 px-1 rounded">{errorId}</code>
                </div>
                <div className="mb-2">
                  <strong className="text-xs text-gray-600">Message:</strong>
                  <p className="text-sm text-red-600 mt-1">{error.message}</p>
                </div>
                {error.stack && (
                  <div>
                    <strong className="text-xs text-gray-600">Stack Trace:</strong>
                    <pre className="text-xs text-gray-700 mt-1 overflow-auto max-h-32 bg-white p-2 rounded border">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={onRetry}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Try Again
            </Button>

            <Button
              variant="outline"
              onClick={onReport}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Report Error
            </Button>

            {level === 'page' && (
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                leftIcon={
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                }
              >
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Partial<ErrorBoundaryProps>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  componentDidMount() {
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const error = new Error(event.reason?.message || 'Unhandled promise rejection');
    const errorInfo: ErrorInfo = {
      componentStack: 'Promise rejection outside of React component tree',
    };

    this.setState({
      hasError: true,
      error,
      errorInfo,
      errorId: generateErrorId(),
    });

    // Prevent the default browser error reporting
    event.preventDefault();
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError } = this.props;
    const { errorId } = this.state;

    this.setState({ errorInfo });
    logErrorToService(error, errorInfo, errorId);
    onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          level={this.props.level || 'component'}
          showDetails={this.props.showDetails || false}
          onRetry={() => this.setState({ hasError: false, error: null, errorInfo: null, errorId: '' })}
          onReport={() => {}}
        />
      );
    }

    return this.props.children;
  }
}

// Healthcare-specific error boundary
export const HealthcareErrorBoundary: React.FC<{
  children: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}> = ({ children, onError }) => (
  <ErrorBoundary
    level="section"
    showDetails={process.env.NODE_ENV === 'development'}
    onError={(error, errorInfo) => {
      // Healthcare-specific error handling
      console.error('Healthcare System Error:', {
        error,
        errorInfo,
        timestamp: new Date().toISOString(),
        userSession: 'healthcare_session', // Add actual session info
      });
      onError?.(error, errorInfo);
    }}
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
