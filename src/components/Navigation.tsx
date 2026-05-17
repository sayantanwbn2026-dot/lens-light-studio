import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "../hooks/useContent";
import { useMagnetic } from "../hooks/useMagnetic";
import { Project, SiteSettings } from "@/types/database";
import "./Navigation.css";

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
  { label: "Work", path: "/work" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navigation = () => {
  const { buttonRef: ctaMagRef, textRef: ctaTextRef } = useMagnetic<HTMLAnchorElement, HTMLSpanElement>();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [scrollingUp, setScrollingUp] = useState<boolean>(false);
  const [heroDark, setHeroDark] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const lastScrollY = useRef<number>(0);
  const sectionDotRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Fetch published work count
  const { data: workProjects } = useContent<Project[]>('work_projects');
  const { data: siteSettings } = useContent<SiteSettings>('site_settings');
  const publishedCount = Array.isArray(workProjects)
    ? workProjects.filter((p: Project) => p.tags?.includes('published') || true).length
    : 0;

  // Scroll state machine
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const wasScrolled = y > 40;
      const goingUp = y < lastScrollY.current && y > 80;

      setScrolled(wasScrolled);
      setScrollingUp(goingUp);
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Detect dark hero via IntersectionObserver
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    
    const timer = setTimeout(() => {
      const darkHero = document.querySelector('[data-theme="dark"]');
      if (!darkHero) {
        setHeroDark(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => setHeroDark(entry.isIntersecting),
        { threshold: 0.1 }
      );

      observer.observe(darkHero);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (observer) observer.disconnect();
    };
  }, [location.pathname]);

  // Body scroll lock on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // S2: Active section indicator — track homepage sections
  useEffect(() => {
    if (location.pathname !== '/') return;
    const sectionMap: Record<string, string> = {
      '.work-section-container': '/work',
      '.services-list-container': '/services',
      '.about-teaser': '/about',
    };

    const observers: IntersectionObserver[] = [];
    Object.entries(sectionMap).forEach(([selector, path]) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(path);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach(o => o.disconnect());
  }, [location.pathname]);

  // S2: Slide dot to active link position
  useEffect(() => {
    if (!sectionDotRef.current || !navLinksRef.current || !activeSection) return;
    const activeLink = navLinksRef.current.querySelector(`a[href="${activeSection}"]`) as HTMLElement;
    if (!activeLink) {
      gsap.to(sectionDotRef.current, { opacity: 0, duration: 0.2 });
      return;
    }
    const containerRect = navLinksRef.current.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const left = linkRect.left - containerRect.left + linkRect.width / 2 - 1.5;
    gsap.to(sectionDotRef.current, { left, opacity: 1, duration: 0.4, ease: 'power3' });
  }, [activeSection]);

  // Build nav class string
  const navClasses = [
    "main-nav",
    scrolled ? "scrolled" : "",
    scrollingUp ? "scrolling-up" : "",
    heroDark ? "nav-hero-dark" : "",
  ].filter(Boolean).join(" ");

  return (
    <>
      <nav className={navClasses}>
        <div className="container nav-container">
          {/* LEFT ZONE */}
          <div className="flex-initial flex justify-start">
            <Link 
              to="/" 
              className={`nav-wordmark ${
                ['/work', '/services', '/contact'].includes(location.pathname) || siteSettings?.wordmark_color === 'black' 
                  ? 'wordmark-black' 
                  : 'wordmark-white'
              }`}
            >
              THE TWENTY-ONE
            </Link>
          </div>

          {/* CENTER ZONE */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="nav-links-desktop" ref={navLinksRef} style={{ position: 'relative' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                >
                  {link.label.toUpperCase()}
                  {link.label === "Work" && publishedCount > 0 && (
                    <span className="work-count-badge">({publishedCount})</span>
                  )}
                </Link>
              ))}
              <div
                ref={sectionDotRef}
                className="nav-section-dot"
              />
            </div>
          </div>

          {/* RIGHT ZONE */}
          <div className="flex-initial flex justify-end items-center gap-6">
            <Link to="/contact" className="nav-cta hidden md:flex" ref={ctaMagRef as React.RefObject<HTMLAnchorElement>}>
              <span className="nav-cta-inner" ref={ctaTextRef as React.RefObject<HTMLSpanElement>}>
                <span className="cta-pulse-dot" />
                <span className="cta-arrow-swap">→</span>
                Book a Session
              </span>
            </Link>
            
            <button 
              className="lg:hidden nav-mobile-trigger"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              Menu
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div className={`mobile-overlay ${mobileOpen ? "open" : ""}`}>
        {/* Top row inside overlay */}
        <div className="mobile-overlay-top">
          <span className="mobile-overlay-wordmark">THE TWENTY-ONE</span>
          <button
            className="mobile-close-btn"
            onClick={() => setMobileOpen(false)}
          >
            Close
          </button>
        </div>

        <div className="mobile-links">
          {navLinks.map((link, i) => (
            <div 
              key={link.path} 
              className="mobile-link-container"
              style={{ transitionDelay: mobileOpen ? `${0.1 + i * 0.07}s` : "0s" }}
            >
              <Link
                to={link.path}
                className={`mobile-link ${location.pathname === link.path ? "active" : ""}`}
              >
                <span className="mobile-link-dot" />
                {link.label.toUpperCase()}
              </Link>
            </div>
          ))}

          <Link to="/contact" className="mobile-cta-btn">
            Book a Session
          </Link>
        </div>

        <div className="mobile-overlay-footer">
          <div style={{ marginBottom: '4px' }}>{siteSettings?.studio_email || 'hello@thetwentyone.in'}</div>
          <div>{siteSettings?.footer_tagline?.replace('in Kolkata', '').trim() || 'Studio Media Agency'}</div>
        </div>
      </div>
    </>
  );
};

export default Navigation;