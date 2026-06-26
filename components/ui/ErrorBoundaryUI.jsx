"use client";

import Button from "./Button";
import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export default function ErrorBoundaryUI({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error("ErrorBoundary caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-in fade-in duration-500">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
      </div>
      
      <h2 className="text-2xl font-bold font-display text-[var(--color-inverted-bg)] mb-3">
        Something went wrong
      </h2>
      
      <p className="text-[var(--color-inverted-bg)]/60 text-sm max-w-md mb-8 leading-relaxed">
        We encountered an unexpected error while loading this section. You can try again or return to the homepage.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
        <Button onClick={() => reset()} type="primary" size="sm" className="w-full sm:w-auto">
          Try Again
        </Button>
        <Button href="/" type="secondary" size="sm" className="w-full sm:w-auto">
          Go Home
        </Button>
      </div>
    </div>
  );
}
