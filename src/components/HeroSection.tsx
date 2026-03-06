import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CameraHUD from "./CameraHUD";
import ApertureRing from "./ApertureRing";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const bracketsRef = useRef<(SVGSVGElement | null)[]>([]);
  const magnetBtnRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Overline
      tl.from(".hero-overline", { opacity: 0, duration: 0.6, ease: "power3.out" }, 0.3);

      // Headline lines with clipPath
      tl.from(".hero-line-1", { clipPath: "inset(100% 0 0 0)", duration: 0.8, ease: "power3.out" }, 0.5);
      tl.from(".hero-line-2", { clipPath: "inset(100% 0 0 0)", duration: 0.8, ease: "power3.out" }, 0.7);
      tl.from(".hero-line-3", { clipPath: "inset(100% 0 0 0)", duration: 0.8, ease: "power3.out" }, 0.9);

      // Breathing letter-spacing on "TWENTY"
      gsap.to(".hero-line-2", {
        letterSpacing: "0.09em",
        duration: 2,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.8,
      });

      // Right column tagline
      tl.from(".hero-tagline-col", { opacity: 0, x: 20, duration: 0.7, ease: "power3.out" }, 1.1);

      // Focus brackets lock animation
      tl.from(".focus-bracket", {
        scale: 1.6,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.05,
      }, 0.6);

      // Focus dot blink
      tl.fromTo(".focus-dot", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }, 1.8);
      tl.to(".focus-dot", { opacity: 0.6, duration: 0.3, yoyo: true, repeat: 2 }, 1.9);

      // CTAs
      tl.from(".hero-cta-group", { opacity: 0, y: 15, duration: 0.5, ease: "power3.out" }, 1.3);

      // Scroll indicator
      tl.from(".scroll-indicator", { opacity: 0, duration: 0.6 }, 1.5);

      // Scroll indicator dot loop
      gsap.to(".scroll-dot", {
        y: 68,
        duration: 1.5,
        ease: "power1.inOut",
        repeat: -1,
        delay: 2,
      });

      // Corner brackets contract on scroll
      gsap.to(".corner-bracket", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "300px top",
          scrub: true,
        },
        x: (i: number) => (i % 2 === 0 ? 20 : -20),
        y: (i: number) => (i < 2 ? 20 : -20),
      });

      // Focus brackets track cursor
      const heroEl = ref.current;
      if (heroEl) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = heroEl.getBoundingClientRect();
          const cx = (e.clientX - rect.left) / rect.width - 0.5;
          const cy = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(".focus-bracket", {
            x: cx * 15,
            y: cy * 15,
            duration: 0.6,
            ease: "power2.out",
          });
        };
        heroEl.addEventListener("mousemove", handleMouseMove);
        return () => heroEl.removeEventListener("mousemove", handleMouseMove);
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  // Magnetic button effect
  useEffect(() => {
    const btn = magnetBtnRef.current;
    if (!btn) return;

    const handleMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) {
        gsap.to(btn, { x: dx * 0.3, y: dy * 0.3, duration: 0.3, ease: "power2.out" });
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1400&q=80"
          alt="Photographer with camera"
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.72) contrast(1.08) grayscale(1)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 60% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        />
      </div>

      {/* Film frame corner brackets */}
      <div className="corner-bracket absolute top-16 left-6 w-6 h-6 border-t border-l border-foreground/20" />
      <div className="corner-bracket absolute top-16 right-6 w-6 h-6 border-t border-r border-foreground/20" />
      <div className="corner-bracket absolute bottom-16 left-6 w-6 h-6 border-b border-l border-foreground/20" />
      <div className="corner-bracket absolute bottom-16 right-6 w-6 h-6 border-b border-r border-foreground/20" />

      {/* Main content — asymmetric two-column */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left column — headline */}
          <div className="md:col-span-7 lg:col-span-7" style={{ paddingLeft: "2%" }}>
            {/* Overline */}
            <p className="hero-overline font-body text-[10px] tracking-[0.35em] uppercase mb-8" style={{ fontWeight: 300, color: "#7A7A7A" }}>
              Kolkata · Est. 2024
            </p>

            {/* Headline staircase */}
            <div className="relative">
              {/* Focus brackets around TWENTY */}
              <div className="hidden md:block absolute pointer-events-none" style={{ top: "calc(0% + 2.5rem)", left: "-12px", right: "auto", bottom: "auto" }}>
                {/* Top-left bracket */}
                <svg className="focus-bracket absolute" style={{ top: "-8px", left: "-8px" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M0 12V0h12" stroke="white" strokeWidth="1" opacity="0.5" />
                </svg>
                {/* Top-right bracket */}
                <svg className="focus-bracket absolute" style={{ top: "-8px", left: "calc(100% + 120px)" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M20 12V0H8" stroke="white" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>

              <h1 className="hero-line-1 font-body uppercase text-foreground leading-none mb-1" style={{ fontWeight: 200, fontSize: "clamp(3.5rem, 6vw, 7.5rem)", letterSpacing: "0.12em", clipPath: "inset(0)" }}>
                THE
              </h1>
              <h1 className="hero-line-2 font-body uppercase text-foreground leading-none mb-1 relative" style={{ fontWeight: 500, fontSize: "clamp(4.5rem, 8vw, 10rem)", letterSpacing: "0.06em", clipPath: "inset(0)" }}>
                TWENTY
                {/* Focus dot */}
                <span className="focus-dot absolute hidden md:block" style={{ right: "-24px", top: "50%", transform: "translateY(-50%)", width: "6px", height: "6px", borderRadius: "50%", background: "white", opacity: 0 }} />
              </h1>
              <h1 className="hero-line-3 font-body uppercase leading-none" style={{ fontWeight: 200, fontSize: "clamp(3.5rem, 6vw, 7.5rem)", letterSpacing: "0.2em", WebkitTextStroke: "1px white", WebkitTextFillColor: "transparent", clipPath: "inset(0)" }}>
                ONE
              </h1>

              {/* Bottom brackets for TWENTY */}
              <div className="hidden md:block absolute pointer-events-none" style={{ bottom: "calc(0% + 2.5rem)", left: "-12px" }}>
                <svg className="focus-bracket absolute" style={{ bottom: "-8px", left: "-8px" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M0 8V20h12" stroke="white" strokeWidth="1" opacity="0.5" />
                </svg>
                <svg className="focus-bracket absolute" style={{ bottom: "-8px", left: "calc(100% + 120px)" }} width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M20 8V20H8" stroke="white" strokeWidth="1" opacity="0.5" />
                </svg>
              </div>
            </div>

            {/* CTAs */}
            <div className="hero-cta-group flex items-center gap-6 mt-14">
              <Link
                to="/work"
                className="group font-body font-normal text-[11px] uppercase tracking-[0.2em] text-foreground inline-flex items-center gap-2"
              >
                <span className="underline-draw">View Our Work</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
              <div className="w-px h-5 bg-muted/40" />
              <Link
                ref={magnetBtnRef}
                to="/contact"
                className="font-body font-normal text-[11px] uppercase tracking-[0.2em] text-foreground border border-foreground/50 rounded-full px-6 py-2 hover:bg-foreground hover:text-background transition-all duration-300"
              >
                Book a Session
              </Link>
            </div>
          </div>

          {/* Right column — tagline + aperture */}
          <div className="hero-tagline-col hidden md:flex md:col-span-5 lg:col-span-5 flex-col items-start justify-center relative" style={{ paddingLeft: "8%" }}>
            {/* Aperture ring behind text */}
            <div className="absolute" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
              <ApertureRing />
            </div>

            {/* Thin rule */}
            <div className="w-10 h-px mb-6" style={{ background: "rgba(255,255,255,0.2)" }} />

            {/* Tagline phrases */}
            <p className="font-display italic leading-[2] relative z-10" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.5rem)", color: "#A0A0A0", letterSpacing: "0.02em" }}>
              Your Vision.
            </p>
            <p className="font-display italic leading-[2] relative z-10" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.5rem)", color: "#A0A0A0", letterSpacing: "0.02em" }}>
              Our Lens.
            </p>
            <p className="font-display italic leading-[2] relative z-10" style={{ fontSize: "clamp(0.9rem, 1.3vw, 1.5rem)", color: "#A0A0A0", letterSpacing: "0.02em" }}>
              Perfect Results.
            </p>
          </div>
        </div>
      </div>

      {/* Camera HUD — bottom-left */}
      <div className="absolute bottom-16 left-6 md:left-10 z-10">
        <CameraHUD />
      </div>

      {/* Scroll indicator — right edge */}
      <div className="scroll-indicator absolute right-6 z-10 flex flex-col items-center" style={{ top: "50%", transform: "translateY(-50%)" }}>
        <div className="relative w-px h-20" style={{ background: "rgba(255,255,255,0.3)" }}>
          <div className="scroll-dot absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-foreground" />
        </div>
        <span className="font-body text-[9px] tracking-[0.3em] uppercase mt-3" style={{ fontWeight: 300, color: "#7A7A7A", writingMode: "vertical-lr" }}>
          Scroll
        </span>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-foreground/10 py-3 overflow-hidden marquee-fade">
        <div className="marquee-track-slow whitespace-nowrap flex">
          {[0, 1].map(i => (
            <span key={i} className="font-body font-light text-[10px] uppercase tracking-[0.2em] shrink-0" style={{ color: "#4A4A4A" }}>
              {"BRAND CAMPAIGNS · CORPORATE SHOOTS · WEDDING COVERAGE · TRADITIONAL COVERAGES · VISUAL STORYTELLING · ".repeat(4)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
