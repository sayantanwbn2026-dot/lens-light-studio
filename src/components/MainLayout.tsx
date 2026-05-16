import React, { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import PageTransition from './PageTransition';
import { useGlobalAnimations } from '../hooks/useGlobalAnimations';

// S5: Ambient background states
const AMBIENT_STATES = [
  { gradient: 'radial-gradient(ellipse at 85% 15%, rgba(232,80,10,0.02) 0%, transparent 60%)', label: 'services' },
  { gradient: 'radial-gradient(ellipse at 15% 85%, rgba(200,199,196,0.015) 0%, transparent 60%)', label: 'about' },
];

export const MainLayout = () => {
    useGlobalAnimations();
    const ambientRef = useRef<HTMLDivElement>(null);
    const [ambientIndex, setAmbientIndex] = useState(-1);
    const location = useLocation();

    // S5: Track sections on homepage only
    useEffect(() => {
      if (location.pathname !== '/') {
        setAmbientIndex(-1);
        return;
      }

      const sectionSelectors = [
        '.services-list-container',
        '.about-teaser',
      ];

      const observers: IntersectionObserver[] = [];
      sectionSelectors.forEach((sel, idx) => {
        const el = document.querySelector(sel);
        if (!el) return;
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setAmbientIndex(idx);
          },
          { threshold: 0.2 }
        );
        obs.observe(el);
        observers.push(obs);
      });

      return () => observers.forEach(o => o.disconnect());
    }, [location.pathname]);

    return (
        <>
            <PageTransition />
            <Navigation />
            {/* S5: Ambient section background */}
            <div
              ref={ambientRef}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
                background: ambientIndex >= 0 ? AMBIENT_STATES[ambientIndex].gradient : 'none',
                transition: 'background 1.5s ease',
                opacity: ambientIndex >= 0 ? 1 : 0,
              }}
            />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default MainLayout;
