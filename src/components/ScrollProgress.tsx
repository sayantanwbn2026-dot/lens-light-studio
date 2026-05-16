import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(window.scrollY / scrollHeight);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // R6: Horizontal progress bar driven by ScrollTrigger
  useEffect(() => {
    if (!barRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* R6: Horizontal accent progress bar */}
      <div
        ref={barRef}
        style={{
          position: 'fixed',
          top: '48px',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'var(--color-accent)',
          zIndex: 9999,
          transformOrigin: 'left',
          transform: 'scaleX(0)',
          opacity: progress > 0.05 ? 1 : 0,
          transition: 'opacity 0.3s',
          pointerEvents: 'none',
        }}
      />

      {/* Existing vertical scroll indicator */}
      <div className="fixed right-3 top-0 bottom-0 z-[90] flex flex-col items-center pointer-events-none">
        {/* TOP label */}
        <span className="font-body font-light text-[8px] text-muted uppercase tracking-[0.15em] mt-20 mb-2">
          Top
        </span>

        {/* Track */}
        <div className="relative flex-1 w-px bg-muted/20">
          {/* Dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground transition-[top] duration-100 ease-out"
            style={{ top: `${progress * 100}%` }}
          />
        </div>

        {/* END label */}
        <span className="font-body font-light text-[8px] text-muted uppercase tracking-[0.15em] mt-2 mb-20">
          End
        </span>
      </div>
    </>
  );
};

export default ScrollProgress;
