import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackLabel?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.fallbackLabel ? ` — ${this.props.fallbackLabel}` : ''}]`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-3 p-6 text-center h-full min-h-[120px]">
          <AlertTriangle size={24} className="text-brand-orange" />
          <div>
            <div className="text-sm font-semibold text-text-primary mb-1">
              {this.props.fallbackLabel || 'Something went wrong'}
            </div>
            <div className="text-xs text-text-muted max-w-[300px]">
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
          </div>
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-border-light bg-white/[0.04] text-text-muted hover:text-text-primary hover:bg-white/[0.08] cursor-pointer transition-all"
          >
            <RefreshCw size={12} />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
