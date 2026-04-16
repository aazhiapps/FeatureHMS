import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "./design-system/components/ErrorBoundary";
import { SmoothScroll } from "./components/SmoothScroll";

// Lazy load pages for better performance
const UltimateAnimatedIndex = lazy(
  () => import("./pages/UltimateAnimatedIndex"),
);
const EnhancedIndex = lazy(() => import("./pages/EnhancedIndex"));
const ThreeDFlowIndex = lazy(() => import("./pages/ThreeDFlowIndex"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Performance-optimized App component
const App = () => {
  return (
    <ErrorBoundary
      level="page"
      showDetails={process.env.NODE_ENV === "development"}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SmoothScroll />
            <Suspense
              fallback={
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Loading ClinicStreams HMS...
                    </h3>
                    <p className="text-white/70">
                      Preparing your healthcare platform...
                    </p>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/standard" element={<UltimateAnimatedIndex />} />
                <Route path="/ultimate" element={<UltimateAnimatedIndex />} />
                <Route path="/enhanced" element={<EnhancedIndex />} />
                <Route path="/3d" element={<ThreeDFlowIndex />} />
                <Route path="/original" element={<Index />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

// Performance monitoring and error reporting setup
if (process.env.NODE_ENV === "production") {
  // Global error handling
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
  });
}

// Accessibility setup
document.documentElement.lang = "en";

// Create and render the React root
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<App />);
