import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Preloader = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('t21_preloader_shown')) {
      setIsVisible(false);
      return;
    }

    // Safety fallback to ensure preloader always hides
    const safetyTimeout = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('t21_preloader_shown', 'true');
    }, 3000);
    sessionStorage.setItem('t21_preloader_shown', 'true');

    const tl = gsap.timeline();

    tl.fromTo(progressRef.current, 
      { scaleX: 0, transformOrigin: "left" }, 
      { scaleX: 1, duration: 1.4, ease: "expo.inOut" },
      0.2 // small initial delay
    );
    tl.to(containerRef.current, { 
      opacity: 0, 
      duration: 0.8, 
      ease: "power2.inOut",
      onComplete: () => setIsVisible(false) 
    }, "+=0.3");
    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div ref={containerRef} style={{
      position: 'fixed',
      inset: 0,
      zIndex: 10000,
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none'
    }}>
      <div style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--weight-light)',
        fontSize: '13px',
        color: '#FFFFFF',
        letterSpacing: 'var(--tracking-caps)'
      }}>
        THE TWENTY-ONE
      </div>
      <div style={{
        marginTop: '16px',
        width: '80px',
        height: '1px',
        backgroundColor: 'var(--color-border)',
        position: 'relative'
      }}>
        <div ref={progressRef} style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'var(--color-accent)',
          transformOrigin: 'left',
          transform: 'scaleX(0)'
        }} />
      </div>
    </div>
  );
};

export default Preloader;
