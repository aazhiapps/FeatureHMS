import React, {
  Suspense,
  lazy,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  ErrorBoundary,
  HealthcareErrorBoundary,
} from "../design-system/components/ErrorBoundary";
import {
  LoadingOverlay,
  useLoadingState,
} from "../design-system/components/LoadingSystem";
import { AnimatedContainer } from "../design-system/components/AnimatedContainer";
import { Button, CallToActionButton } from "../design-system/components/Button";
import {
  Card,
  HealthcareCard,
  StatsCard,
} from "../design-system/components/Card";

// Lazy load heavy components for better performance
const CountdownLoadingScreen = lazy(() =>
  import("../components/CountdownLoadingScreen").then((module) => ({
    default: module.CountdownLoadingScreen,
  })),
);

const AutoScrollFeatures = lazy(() =>
  import("../components/AutoScrollFeatures").then((module) => ({
    default: module.AutoScrollFeatures,
  })),
);

const AllSystemsActiveScreen = lazy(() =>
  import("../components/AllSystemsActiveScreen").then((module) => ({
    default: module.AllSystemsActiveScreen,
  })),
);

const FeatureComparisonPage = lazy(() =>
  import("../components/FeatureComparisonPage").then((module) => ({
    default: module.FeatureComparisonPage,
  })),
);

const NavigationFlowHeader = lazy(() =>
  import("../components/NavigationFlowHeader").then((module) => ({
    default: module.NavigationFlowHeader,
  })),
);

const FloatingCircularModules = lazy(() =>
  import("../components/FloatingCircularModules").then((module) => ({
    default: module.FloatingCircularModules,
  })),
);

// Memoized components for performance
const MouseAnimationSystem = lazy(() =>
  import("../components/MouseAnimationSystem").then((module) => ({
    default: module.MouseAnimationSystem,
  })),
);

// Application state type
type AppState =
  | "loading"
  | "autoscroll"
  | "systems-active"
  | "journey"
  | "comparison"
  | "demo";

// Healthcare modules configuration
const healthcareModules = [
  {
    id: "patient-management",
    title: "Patient Management",
    description:
      "Centralized patient records with comprehensive history, treatments, and visit tracking for personalized care",
    icon: "👥",
    color: "from-blue-500 to-cyan-500",
    category: "Core System",
    metrics: { patients: "12.5K+", satisfaction: "98.2%" },
    status: "active" as const,
  },
  {
    id: "appointment-scheduling",
    title: "Appointment Scheduling",
    description:
      "Intelligent scheduling system with automated reminders to minimize wait times and reduce no-shows",
    icon: "📅",
    color: "from-green-500 to-emerald-500",
    category: "Operations",
    metrics: { appointments: "2.8K/day", efficiency: "+45%" },
    status: "active" as const,
  },
  {
    id: "medical-records",
    title: "Electronic Medical Records",
    description:
      "Secure, compliant EMR system that makes documentation efficient while ensuring accuracy and accessibility",
    icon: "📋",
    color: "from-purple-500 to-indigo-500",
    category: "Documentation",
    metrics: { records: "50K+", compliance: "100%" },
    status: "active" as const,
  },
  {
    id: "billing-insurance",
    title: "Billing & Insurance",
    description:
      "Streamlined billing workflows with insurance verification and claims management for faster reimbursements",
    icon: "💰",
    color: "from-amber-500 to-orange-500",
    category: "Financial",
    metrics: { claims: "99.1%", processing: "-75%" },
    status: "active" as const,
  },
  {
    id: "analytics",
    title: "Real-time Analytics",
    description:
      "Powerful dashboards and reporting tools to monitor key performance metrics and make data-driven decisions",
    icon: "📊",
    color: "from-emerald-500 to-teal-500",
    category: "Intelligence",
    metrics: { insights: "24/7", accuracy: "99.8%" },
    status: "active" as const,
  },
  {
    id: "telemedicine",
    title: "Telemedicine Platform",
    description:
      "Integrated video consultation platform with secure communication and remote patient monitoring",
    icon: "💻",
    color: "from-violet-500 to-purple-500",
    category: "Remote Care",
    metrics: { consultations: "500+/day", uptime: "99.9%" },
    status: "active" as const,
  },
  {
    id: "pharmacy",
    title: "Pharmacy Management",
    description:
      "Complete pharmacy workflow with prescription management, inventory tracking, and drug interaction alerts",
    icon: "💊",
    color: "from-pink-500 to-rose-500",
    category: "Pharmacy",
    metrics: { prescriptions: "1.2K/day", safety: "100%" },
    status: "active" as const,
  },
  {
    id: "laboratory",
    title: "Laboratory Integration",
    description:
      "Seamless lab management with test ordering, result tracking, and quality control monitoring",
    icon: "🧪",
    color: "from-cyan-500 to-blue-500",
    category: "Diagnostics",
    metrics: { tests: "800+/day", turnaround: "-40%" },
    status: "active" as const,
  },
] as const;

// Main Enhanced Index Component
const EnhancedIndex: React.FC = memo(() => {
  // State management
  const [currentState, setCurrentState] = useState<AppState>("loading");
  const [isInitialized, setIsInitialized] = useState(false);

  // Loading state management
  const {
    isLoading: isTransitioning,
    progress: transitionProgress,
    message: transitionMessage,
    startLoading: startTransition,
    updateProgress: updateTransitionProgress,
    finishLoading: finishTransition,
  } = useLoadingState();

  // Memoized features for performance
  const features = useMemo(
    () =>
      healthcareModules.map((module) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        icon: module.icon,
        color: module.color,
        category: module.category,
        benefits: [
          `Streamlined ${module.category.toLowerCase()} operations`,
          "Real-time data synchronization",
          "Enhanced security and compliance",
          "Improved workflow efficiency",
        ],
        stats: [
          {
            label: "Daily Usage",
            value:
              (module.metrics as any).patients ||
              (module.metrics as any).appointments ||
              "1K+",
          },
          {
            label: "Efficiency",
            value:
              (module.metrics as any).efficiency ||
              (module.metrics as any).satisfaction ||
              "+25%",
          },
        ],
      })),
    [],
  );

  // Navigation handlers with performance optimization
  const handleStateTransition = useCallback(
    (newState: AppState) => {
      if (newState === currentState) return;

      startTransition(`Transitioning to ${newState}...`);

      // Simulate transition progress
      const steps = 10;
      const interval = 50;
      let step = 0;

      const progressInterval = setInterval(() => {
        step++;
        updateTransitionProgress((step / steps) * 100);

        if (step >= steps) {
          clearInterval(progressInterval);
          setCurrentState(newState);
          finishTransition();
        }
      }, interval);
    },
    [currentState, startTransition, updateTransitionProgress, finishTransition],
  );

  // Loading completion handler
  const handleLoadingComplete = useCallback(() => {
    handleStateTransition("autoscroll");
  }, [handleStateTransition]);

  // Auto-scroll completion handler
  const handleAutoScrollComplete = useCallback(() => {
    handleStateTransition("systems-active");
  }, [handleStateTransition]);

  // Systems active completion handler
  const handleSystemsActiveComplete = useCallback(() => {
    handleStateTransition("journey");
    setIsInitialized(true);
  }, [handleStateTransition]);

  // Navigation handler for header
  const handleNavigate = useCallback(
    (page: AppState) => {
      handleStateTransition(page);
    },
    [handleStateTransition],
  );

  // Loading states render
  if (currentState === "loading") {
    return (
      <ErrorBoundary level="page">
        <Suspense
          fallback={
            <LoadingOverlay
              isVisible={true}
              variant="medical"
              message="Initializing Healthcare Platform..."
            />
          }
        >
          <CountdownLoadingScreen
            onComplete={handleLoadingComplete}
            duration={6}
            title="ClinicStreams"
            subtitle="Digital Medical Systems"
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (currentState === "autoscroll") {
    return (
      <ErrorBoundary level="page">
        <Suspense
          fallback={
            <LoadingOverlay
              isVisible={true}
              variant="default"
              message="Loading Features..."
            />
          }
        >
          <AutoScrollFeatures
            features={features}
            isActive={true}
            onComplete={handleAutoScrollComplete}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (currentState === "systems-active") {
    return (
      <ErrorBoundary level="page">
        <Suspense
          fallback={
            <LoadingOverlay
              isVisible={true}
              variant="dna"
              message="Activating Systems..."
            />
          }
        >
          <AllSystemsActiveScreen
            isActive={true}
            onComplete={handleSystemsActiveComplete}
            duration={4}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (currentState === "comparison") {
    return (
      <ErrorBoundary level="page">
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <Suspense
            fallback={
              <LoadingOverlay
                isVisible={true}
                message="Loading Comparison..."
              />
            }
          >
            <NavigationFlowHeader
              currentPage="comparison"
              onNavigate={handleNavigate}
              autoHideOnScroll={true}
            />
            <FloatingCircularModules
              isVisible={true}
              centerText="Feature Analysis"
            />
            <div className="pt-20">
              <FeatureComparisonPage
                onClose={() => handleNavigate("journey")}
              />
            </div>
          </Suspense>
        </div>
      </ErrorBoundary>
    );
  }

  // Main journey/dashboard view
  return (
    <ErrorBoundary level="page">
      <Suspense
        fallback={
          <LoadingOverlay
            isVisible={true}
            variant="medical"
            message="Loading Dashboard..."
          />
        }
      >
        <MouseAnimationSystem>
          <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
            {/* Navigation Header */}
            <NavigationFlowHeader
              currentPage={currentState}
              onNavigate={handleNavigate}
              autoHideOnScroll={true}
            />

            {/* Floating Modules */}
            <FloatingCircularModules
              isVisible={currentState === "journey"}
              centerText="All Systems Online!"
            />

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-6 text-center relative z-10">
              <div className="max-w-6xl mx-auto">
                <AnimatedContainer animation="fadeInUp" animationDelay={0.2}>
                  <h1 className="text-5xl md:text-7xl font-light mb-6 bg-gradient-to-r from-white via-blue-200 to-green-200 bg-clip-text text-transparent">
                    ClinicStreams
                  </h1>
                  <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
                    Next-Generation Healthcare Management Platform
                  </p>
                  <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                    Revolutionizing patient care through AI-powered monitoring,
                    seamless telemedicine, and intelligent healthcare analytics
                    for the modern medical practice.
                  </p>
                </AnimatedContainer>

                <AnimatedContainer animation="fadeInUp" animationDelay={0.6}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                    <CallToActionButton
                      onClick={() =>
                        window.open(
                          "https://calendly.com/clinicstreams-demo",
                          "_blank",
                        )
                      }
                    >
                      Schedule Live Demo
                    </CallToActionButton>

                    <Button
                      variant="glass"
                      size="lg"
                      onClick={() => handleNavigate("comparison")}
                      leftIcon={
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      }
                    >
                      Compare Features
                    </Button>
                  </div>
                </AnimatedContainer>

                {/* Stats Cards */}
                <AnimatedContainer animation="fadeInUp" animationDelay={0.8}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                    <StatsCard
                      title="Active Patients"
                      value="12.5K+"
                      change="+18% this month"
                      changeType="positive"
                      icon={<span className="text-2xl">👥</span>}
                    />
                    <StatsCard
                      title="System Uptime"
                      value="99.9%"
                      change="Industry leading"
                      changeType="positive"
                      icon={<span className="text-2xl">⚡</span>}
                    />
                    <StatsCard
                      title="Cost Reduction"
                      value="40%"
                      change="Average savings"
                      changeType="positive"
                      icon={<span className="text-2xl">💰</span>}
                    />
                    <StatsCard
                      title="Satisfaction"
                      value="98.2%"
                      change="Patient rating"
                      changeType="positive"
                      icon={<span className="text-2xl">⭐</span>}
                    />
                  </div>
                </AnimatedContainer>
              </div>
            </section>

            {/* Healthcare Modules Grid */}
            <section className="py-16 px-6 relative z-10">
              <div className="max-w-7xl mx-auto">
                <AnimatedContainer
                  animation="fadeInUp"
                  className="text-center mb-12"
                >
                  <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
                    Comprehensive Healthcare Solutions
                  </h2>
                  <p className="text-xl text-white/80 max-w-3xl mx-auto">
                    Integrated modules designed to streamline every aspect of
                    healthcare operations
                  </p>
                </AnimatedContainer>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {healthcareModules.map((module, index) => (
                    <AnimatedContainer
                      key={module.id}
                      animation="fadeInUp"
                      animationDelay={index * 0.1}
                      hoverAnimation="lift"
                    >
                      <HealthcareErrorBoundary>
                        <HealthcareCard
                          icon={<span className="text-2xl">{module.icon}</span>}
                          status={module.status}
                          metric={Object.values(module.metrics)[0]}
                          metricLabel={Object.keys(module.metrics)[0]}
                          className="h-full"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {module.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {module.description}
                            </p>
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {module.category}
                            </span>
                          </div>
                        </HealthcareCard>
                      </HealthcareErrorBoundary>
                    </AnimatedContainer>
                  ))}
                </div>
              </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 px-6 text-center relative z-10">
              <AnimatedContainer animation="fadeInUp">
                <Card variant="glass" size="lg" className="max-w-4xl mx-auto">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-white mb-4">
                      Ready to Transform Your Healthcare Practice?
                    </h3>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
                      Join thousands of healthcare providers who trust
                      ClinicStreams to deliver exceptional patient care while
                      reducing operational costs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <CallToActionButton size="xl">
                        Start Free Trial
                      </CallToActionButton>
                      <Button
                        variant="outline"
                        size="xl"
                        onClick={() => handleNavigate("comparison")}
                      >
                        View Pricing
                      </Button>
                    </div>
                  </div>
                </Card>
              </AnimatedContainer>
            </section>
          </div>
        </MouseAnimationSystem>

        {/* Transition Loading Overlay */}
        <LoadingOverlay
          isVisible={isTransitioning}
          variant="medical"
          message={transitionMessage}
          progress={transitionProgress}
        />
      </Suspense>
    </ErrorBoundary>
  );
});

EnhancedIndex.displayName = "EnhancedIndex";

export default EnhancedIndex;
