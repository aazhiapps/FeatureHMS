import "./global.css";
import "./styles/ultimate-animations.css";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "./design-system/components/ErrorBoundary";
import { LoadingOverlay } from "./design-system/components/LoadingSystem";
import { SmoothScroll } from "./components/SmoothScroll";

// Register GSAP plugins globally
gsap.registerPlugin(ScrollTrigger);

// Lazy load pages for better performance
const UltimateAnimatedIndex = lazy(
  () => import("./pages/UltimateAnimatedIndex"),
);
const EnhancedIndex = lazy(() => import("./pages/EnhancedIndex"));
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

// Performance-optimized App component
const App = () => {
  // Use original design as default home page with all versions accessible
  const getDefaultComponent = () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("version") === "enhanced") return <EnhancedIndex />;
    if (params.get("version") === "ultimate") return <UltimateAnimatedIndex />;

    // Default to original design for the comprehensive healthcare experience
    return <Index />;
  };

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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Initializing Quantum Systems
                    </h3>
                    <p className="text-white/70">
                      Loading ClinicStreams Healthcare Platform...
                    </p>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={getDefaultComponent()} />
                <Route path="/ultimate" element={<UltimateAnimatedIndex />} />
                <Route path="/enhanced" element={<EnhancedIndex />} />
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
  // Add performance monitoring
  if (
    "performance" in window &&
    "observe" in window.PerformanceObserver.prototype
  ) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          console.log("Navigation timing:", entry);
        }
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);
        }
        if (entry.entryType === "first-input") {
          console.log("FID:", entry.processingStart - entry.startTime);
        }
      }
    });

    observer.observe({
      entryTypes: ["navigation", "largest-contentful-paint", "first-input"],
    });
  }

  // Global error handling
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);
    // Send to error reporting service
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    // Send to error reporting service
  });
}

// Accessibility setup
document.documentElement.lang = "en";
document.title = "ClinicStreams - Healthcare Management Platform";

// Add meta description for SEO
const metaDescription = document.createElement("meta");
metaDescription.name = "description";
metaDescription.content =
  "ClinicStreams is a comprehensive healthcare management platform designed to streamline medical operations, improve patient care, and enhance healthcare efficiency.";
document.head.appendChild(metaDescription);

// Create and render the React root
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
root.render(<App />);
