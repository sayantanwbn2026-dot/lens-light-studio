import { useEffect, useRef } from "react";
import gsap from "gsap";

const DarkroomHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Safelight pulse
      gsap.to(".safelight", {
        opacity: 0.12,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Photo developing: white → grayscale over 3s
      const tl = gsap.timeline({ delay: 0.8 });

      tl.fromTo(
        ".darkroom-photo",
        { filter: "brightness(10) contrast(0)", opacity: 0 },
        { filter: "brightness(1) contrast(1)", opacity: 1, duration: 3, ease: "power2.inOut" }
      );

      // SVG ripple turbulence animation during development
      tl.fromTo(
        ".turbulence",
        { attr: { baseFrequency: "0.04" } },
        { attr: { baseFrequency: "0" }, duration: 3, ease: "power2.out" },
        0
      );

      // Text burn-in letter by letter after image develops
      tl.from(
        ".burn-letter",
        {
          opacity: 0,
          filter: "blur(8px) brightness(3)",
          duration: 0.6,
          stagger: { each: 0.08, from: "random" },
          ease: "power3.out",
        },
        2.5
      );

      // Subtitle fade in
      tl.from(".darkroom-subtitle", {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out",
      }, 3.5);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = "THE TWENTY-ONE";

  return (
    <section ref={containerRef} data-theme="dark" className="relative h-screen w-full overflow-hidden bg-background">
      {/* SVG filter for chemical ripple */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="chemical-ripple">
            <feTurbulence
              className="turbulence"
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Red safelight glow */}
      <div
        className="safelight absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.06] pointer-events-none"
        style={{
          background: "radial-gradient(circle at 80% 15%, hsl(0 80% 40% / 0.6), transparent 60%)",
        }}
      />

      {/* Developing photo */}
      <div
        ref={imageRef}
        className="darkroom-photo absolute inset-0"
        style={{ filter: "brightness(10) contrast(0)", opacity: 0 }}
      >
        <img
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1400&q=80"
          alt="Studio photograph"
          className="w-full h-full object-cover grayscale"
          style={{ filter: "url(#chemical-ripple) grayscale(1)" }}
        />
        {/* Dark overlay to keep text readable */}
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Film frame corner brackets */}
      <div className="absolute top-20 left-6 w-8 h-8 border-t border-l border-foreground/20" />
      <div className="absolute top-20 right-6 w-8 h-8 border-t border-r border-foreground/20" />
      <div className="absolute bottom-20 left-6 w-8 h-8 border-b border-l border-foreground/20" />
      <div className="absolute bottom-20 right-6 w-8 h-8 border-b border-r border-foreground/20" />

      {/* Film counter */}
      <div className="absolute top-24 left-6 md:left-10 uppercase opacity-60" style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: 'var(--tracking-caps)' }}>
        001 / Creative Studio
      </div>

      {/* Title — letter by letter burn-in */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h1
          ref={textRef}
          className="text-center"
          style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-display)', fontSize: '12vw', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-display)', lineHeight: 1 }}
        >
          {title.split("").map((char, i) => (
            <span key={i} className="burn-letter inline-block" style={{ minWidth: char === " " ? "0.3em" : undefined }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h1>
        <p className="darkroom-subtitle uppercase mt-6" style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '12px', color: 'var(--color-muted)', letterSpacing: 'var(--tracking-caps)' }}>
          Your Vision · Our Lens · Perfect Results
        </p>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, hsl(var(--background)) 100%)",
        }}
      />
    </section>
  );
};

export default DarkroomHero;
