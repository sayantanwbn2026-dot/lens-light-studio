import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState, lazy, Suspense } from "react";

import CustomCursor from "./components/CustomCursor";
import FilmGrain from "./components/FilmGrain";
import ScrollProgress from "./components/ScrollProgress";
import Preloader from "./components/Preloader";
import MainLayout from "./components/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { DeviceProvider } from "./contexts/DeviceContext";
import { initLenis, destroyLenis } from "./lib/lenis";
import { initScrollReveal } from "./lib/scrollReveal";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HelmetProvider } from "react-helmet-async";

// Lazy-loaded public pages
const Index = lazy(() => import("./pages/Index"));
const Work = lazy(() => import("./pages/Work"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Lazy-loaded admin components (named exports require .then)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute").then(m => ({ default: m.ProtectedRoute })));
const Login = lazy(() => import("./pages/admin/Login").then(m => ({ default: m.Login })));
const DashboardOverview = lazy(() => import("./pages/admin/DashboardOverview").then(m => ({ default: m.DashboardOverview })));
const HeroEditor = lazy(() => import("./pages/admin/HeroEditor").then(m => ({ default: m.HeroEditor })));
const ServicesEditor = lazy(() => import("./pages/admin/ServicesEditor").then(m => ({ default: m.ServicesEditor })));
const WorkEditor = lazy(() => import("./pages/admin/WorkEditor").then(m => ({ default: m.WorkEditor })));
const AboutEditor = lazy(() => import("./pages/admin/AboutEditor").then(m => ({ default: m.AboutEditor })));
const StatsEditor = lazy(() => import("./pages/admin/StatsEditor").then(m => ({ default: m.StatsEditor })));
const FooterSettings = lazy(() => import("./pages/admin/FooterSettings").then(m => ({ default: m.FooterSettings })));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary").then(m => ({ default: m.MediaLibrary })));
const Messages = lazy(() => import("./pages/admin/Messages").then(m => ({ default: m.Messages })));
const Settings = lazy(() => import("./pages/admin/Settings").then(m => ({ default: m.Settings })));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppContent = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin');
    
    let timer: ReturnType<typeof setTimeout>;
    if (!isAdmin) {
      try {
        initLenis();
        // Small delay to ensure DOM is painted before ScrollTrigger measures
        timer = setTimeout(() => {
          initScrollReveal();
          ScrollTrigger.refresh();
        }, 250);
      } catch (e) {
        console.error("Initialization error:", e);
      }
    } else {
      destroyLenis();
    }
    
    return () => {
      if (timer) clearTimeout(timer);
      destroyLenis();
      ScrollTrigger.killAll();
    };
  }, [pathname]);

  return (
    <div style={{ backgroundColor: '#000000' }}>
      <Preloader />
      <FilmGrain />
      <ScrollProgress />
      <CustomCursor />
      <ScrollToTop />
      <Suspense fallback={<div className="h-screen w-screen bg-black" />}>
        <Routes>
          {/* Public Routes with shared MainLayout (Navigation and Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:id" element={<ProjectDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<DashboardOverview />} />
              <Route path="/admin/hero" element={<HeroEditor />} />
              <Route path="/admin/services" element={<ServicesEditor />} />
              <Route path="/admin/work" element={<WorkEditor />} />
              <Route path="/admin/about" element={<AboutEditor />} />
              <Route path="/admin/stats" element={<StatsEditor />} />
              <Route path="/admin/footer" element={<FooterSettings />} />
              <Route path="/admin/media" element={<MediaLibrary />} />
              <Route path="/admin/messages" element={<Messages />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
};

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {

  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen bg-red-600 text-white flex flex-col items-center justify-center p-8 text-center font-sans z-[99999] fixed inset-0">
          <h1 className="text-3xl font-bold mb-4 uppercase">CRITICAL SYSTEM ERROR</h1>
          <p className="text-lg max-w-md font-medium mb-8">
            The studio application has crashed.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white text-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            style={{ color: '#FFFFFF' }}
          >
            Reload Website
          </button>
          {this.state.error && (
            <pre className="mt-12 text-[10px] text-zinc-800 text-left overflow-auto max-w-full">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <HelmetProvider>
      <DeviceProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </BrowserRouter>
      </DeviceProvider>
    </HelmetProvider>
  );
};

export default App;
