import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Critical System Failure:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-luxury-obsidian flex items-center justify-center p-6">
          <div className="max-w-md w-full luxury-card p-10 text-center space-y-6">
            <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-luxury-cream">System Interruption</h1>
            <p className="text-sm text-white/60">
              An unexpected error occurred. This incident has been logged for administrative review.
            </p>
            <Button 
              className="w-full bg-luxury-gold text-luxury-obsidian hover:bg-amber-500"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="h-4 w-4 mr-2" /> Restore System
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}