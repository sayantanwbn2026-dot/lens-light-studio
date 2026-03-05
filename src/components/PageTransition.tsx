import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

const pageLetters: Record<string, string> = {
  "/": "T",
  "/work": "W",
  "/services": "S",
  "/about": "A",
  "/contact": "C",
};

const PageTransition = () => {
  const location = useLocation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLSpanElement>(null);
  const [letter, setLetter] = useState("");
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

    const newLetter = pageLetters[location.pathname] || "•";
    setLetter(newLetter);

    const tl = gsap.timeline();
    tl.set(overlayRef.current, { display: "flex" });
    tl.fromTo(
      overlayRef.current,
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0 0 0% 0)", duration: 0.4, ease: "power3.inOut" }
    );
    tl.fromTo(
      letterRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 0.12, scale: 1, duration: 0.3, ease: "power2.out" },
      0.2
    );
    tl.to(letterRef.current, { opacity: 0, duration: 0.2 }, 0.55);
    tl.to(
      overlayRef.current,
      { clipPath: "inset(100% 0 0 0)", duration: 0.4, ease: "power3.inOut" },
      0.6
    );
    tl.set(overlayRef.current, { display: "none" });
  }, [location.pathname]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] bg-background items-center justify-center pointer-events-none"
      style={{ display: "none" }}
    >
      <span
        ref={letterRef}
        className="font-display italic text-[50vw] leading-none text-foreground select-none"
        style={{ opacity: 0 }}
      >
        {letter}
      </span>
    </div>
  );
};

export default PageTransition;