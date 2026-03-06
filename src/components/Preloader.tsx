import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    // Fade in wordmark
    tl.fromTo(textRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out" });
    // Hold
    tl.to({}, { duration: 0.6 });
    // Fade out text
    tl.to(textRef.current, { opacity: 0, duration: 0.3 });
    // Split panels
    tl.to(topRef.current, { yPercent: -100, duration: 0.6, ease: "power3.inOut" }, "-=0.1");
    tl.to(bottomRef.current, { yPercent: 100, duration: 0.6, ease: "power3.inOut" }, "<");
    // Hide container
    tl.set(containerRef.current, { display: "none" });
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[10000] pointer-events-none">
      <div ref={topRef} className="absolute top-0 left-0 right-0 h-1/2 bg-background" />
      <div ref={bottomRef} className="absolute bottom-0 left-0 right-0 h-1/2 bg-background" />
      <div ref={textRef} className="absolute inset-0 flex items-center justify-center" style={{ opacity: 0 }}>
        <span className="font-body text-[13px] tracking-[0.35em] uppercase text-foreground" style={{ fontWeight: 300 }}>
          The Twenty-One
        </span>
      </div>
    </div>
  );
};

export default Preloader;
