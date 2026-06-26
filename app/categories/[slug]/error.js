"use client";

import ErrorBoundaryUI from "@/components/ui/ErrorBoundaryUI";

export default function Error({ error, reset }) {
  return <ErrorBoundaryUI error={error} reset={reset} />;
}
