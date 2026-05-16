import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const PageTransition = () => {
  const location = useLocation();
  const lineRef = useRef<HTMLDivElement>(null);
  const prevPath = useRef(location.pathname);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevPath.current = location.pathname;
      return;
    }

    if (location.pathname === prevPath.current) return;
    prevPath.current = location.pathname;

    const mainEl = document.querySelector('main');
    
    const tl = gsap.timeline();
    // Ensure the line is visible and scaled to 0 from left
    tl.set(lineRef.current, { scaleX: 0, transformOrigin: "left", opacity: 1 });
    
    // Draw line left to right
    tl.to(lineRef.current, { scaleX: 1, duration: 0.4, ease: "power2.inOut" });
    
    // Fade page content up
    if (mainEl) {
      tl.fromTo(mainEl, 
        { y: 12, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
    
    // Fade line out or retract
    tl.to(lineRef.current, { opacity: 0, duration: 0.2 }, "-=0.2");

  }, [location.pathname]);

  return (
    <div
      ref={lineRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        backgroundColor: 'var(--color-accent)',
        zIndex: 9999,
        transform: 'scaleX(0)',
        transformOrigin: 'left',
        pointerEvents: 'none'
      }}
    />
  );
};

export default PageTransition;