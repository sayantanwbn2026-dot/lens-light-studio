import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Overline
      tl.from(".hero-overline", { opacity: 0, y: 10, duration: 0.6, ease: "power3.out" });

      // Headline clipPath
      tl.from(".hero-headline", {
        clipPath: "inset(100% 0 0 0)",
        duration: 0.8,
        ease: "power3.out",
      }, 0.5);

      // Tagline
      tl.from(".hero-tagline", {
        clipPath: "inset(100% 0 0 0)",
        duration: 0.8,
        ease: "power3.out",
      }, 0.8);

      // Rule
      tl.from(".hero-rule", {
        scaleX: 0,
        duration: 0.6,
        ease: "power3.inOut",
      }, 1.2);

      // CTAs
      tl.from(".hero-cta", {
        opacity: 0, y: 12, duration: 0.5, stagger: 0.1, ease: "power3.out",
      }, 1.4);

      // Film frame corners contract on scroll
      gsap.to(".corner-bracket", {
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "300px top",
          scrub: true,
        },
        x: (i) => (i % 2 === 0 ? 20 : -20),
        y: (i) => (i < 2 ? 20 : -20),
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden bg-background">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1400&q=80"
          alt="Photographer with camera"
          className="w-full h-full object-cover grayscale"
        />
        {/* Vignette overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      {/* Film frame corner brackets */}
      <div className="corner-bracket absolute top-16 left-6 w-6 h-6 border-t border-l border-foreground/20" />
      <div className="corner-bracket absolute top-16 right-6 w-6 h-6 border-t border-r border-foreground/20" />
      <div className="corner-bracket absolute bottom-16 left-6 w-6 h-6 border-b border-l border-foreground/20" />
      <div className="corner-bracket absolute bottom-16 right-6 w-6 h-6 border-b border-r border-foreground/20" />

      {/* Content - centered with slight upward offset */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none" style={{ paddingBottom: "10vh" }}>
        {/* Overline */}
        <p className="hero-overline font-body font-light text-[11px] tracking-[0.3em] uppercase text-muted mb-8">
          Kolkata · Est. 2024
        </p>

        {/* Headline */}
        <h1 className="hero-headline font-body font-light text-foreground tracking-[0.08em] text-center leading-[1.1]" style={{ fontSize: "clamp(2.8rem, 4.5vw, 5.5rem)" }}>
          The Twenty-One
        </h1>

        {/* Tagline - Cormorant Garamond italic accent */}
        <p className="hero-tagline font-display italic text-silver tracking-[0.04em] text-center mt-4" style={{ fontSize: "clamp(1.1rem, 1.8vw, 2rem)" }}>
          Your Vision. Our Lens. Perfect Results.
        </p>

        {/* Rule */}
        <div className="hero-rule w-20 h-px bg-foreground/30 mt-8 origin-center" />

        {/* CTAs */}
        <div className="flex items-center gap-6 mt-8 pointer-events-auto">
          <Link
            to="/work"
            className="hero-cta underline-draw font-body font-normal text-[12px] uppercase tracking-[0.15em] text-foreground"
          >
            View Our Work
          </Link>
          <div className="w-px h-4 bg-muted/40" />
          <Link
            to="/contact"
            className="hero-cta underline-draw font-body font-normal text-[12px] uppercase tracking-[0.15em] text-foreground"
          >
            Book a Session
          </Link>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-foreground/10 py-3 overflow-hidden marquee-fade">
        <div className="marquee-track whitespace-nowrap flex">
          {[0, 1].map(i => (
            <span key={i} className="font-body font-light text-[10px] uppercase tracking-[0.2em] text-muted/60 shrink-0">
              {"BRAND CAMPAIGNS · CORPORATE SHOOTS · WEDDING COVERAGE · TRADITIONAL COVERAGES · VISUAL STORYTELLING · ".repeat(4)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;