import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import Index from "./pages/Index";
import Work from "./pages/Work";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import FilmGrain from "./components/FilmGrain";
import SmoothScroll from "./components/SmoothScroll";
import ScrollProgress from "./components/ScrollProgress";
import Preloader from "./components/Preloader";
import MainLayout from "./components/MainLayout";

import { AuthProvider } from "./contexts/AuthContext";
import { AdminLayout } from "./components/admin/AdminLayout";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { Login } from "./pages/admin/Login";
import { DashboardOverview } from "./pages/admin/DashboardOverview";
import { HeroEditor } from "./pages/admin/HeroEditor";
import { ServicesEditor } from "./pages/admin/ServicesEditor";
import { WorkEditor } from "./pages/admin/WorkEditor";
import { AboutEditor } from "./pages/admin/AboutEditor";
import { TestimonialsEditor } from "./pages/admin/TestimonialsEditor";
import { StatsEditor } from "./pages/admin/StatsEditor";
import { FooterSettings } from "./pages/admin/FooterSettings";
import { MediaLibrary } from "./pages/admin/MediaLibrary";
import { Settings } from "./pages/admin/Settings";



const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppContent = () => {
  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <Routes>
        {/* Public Routes with shared MainLayout (Navigation and Footer) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/work" element={<Work />} />
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
            <Route path="/admin/testimonials" element={<TestimonialsEditor />} />
            <Route path="/admin/stats" element={<StatsEditor />} />
            <Route path="/admin/footer" element={<FooterSettings />} />
            <Route path="/admin/media" element={<MediaLibrary />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
