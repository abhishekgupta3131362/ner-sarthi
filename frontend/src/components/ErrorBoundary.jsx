import React from "react";
import { AlertTriangle } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-red-50 p-8">
          <div className="bg-white p-6 rounded-xl border border-red-200 shadow-xl max-w-2xl w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Something went wrong.</h1>
                <p className="text-sm text-slate-500">The application encountered an unexpected error.</p>
              </div>
            </div>
            
            <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-[400px]">
              <pre className="text-red-400 text-xs font-mono mb-4 whitespace-pre-wrap">
                {this.state.error && this.state.error.toString()}
              </pre>
              <pre className="text-slate-400 text-[10px] font-mono whitespace-pre-wrap">
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children; 
  }
}
