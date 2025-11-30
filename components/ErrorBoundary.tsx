import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MinimalButton from './MinimalButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // Example: logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, errorInfo, onReset }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-[#1e293b] border border-[#E6E9EF] dark:border-[#334155] rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-6 mx-auto">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-[#1F4AA8] dark:text-[#4C86FF] text-center mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-[#737373] dark:text-[#94a3b8] text-center mb-6">
          We're sorry, but something unexpected happened. Please try refreshing the page or return to the homepage.
        </p>

        {error && (
          <div className="bg-[#F8F9FB] dark:bg-[#0f172a] border border-[#E6E9EF] dark:border-[#334155] rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-[#2E2E2E] dark:text-[#e2e8f0] mb-2">
              Error Details:
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
              {error.message || 'Unknown error occurred'}
            </p>
            {process.env.NODE_ENV === 'development' && errorInfo && (
              <details className="mt-4">
                <summary className="text-xs text-[#737373] dark:text-[#94a3b8] cursor-pointer hover:text-[#1F4AA8] dark:hover:text-[#4C86FF]">
                  Stack Trace
                </summary>
                <pre className="mt-2 text-xs text-[#737373] dark:text-[#94a3b8] overflow-auto max-h-40">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <MinimalButton
            onClick={onReset}
            variant="primary"
            size="lg"
            icon={RefreshCw}
          >
            Try Again
          </MinimalButton>
          <MinimalButton
            onClick={() => navigate('/home')}
            variant="secondary"
            size="lg"
            icon={Home}
          >
            Go Home
          </MinimalButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;

