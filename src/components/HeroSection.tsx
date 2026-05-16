import { useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";
import { useContent } from "../hooks/useContent";
import { useMagnetic } from "../hooks/useMagnetic";
import { useDevice } from "../contexts/DeviceContext";
import { HeroContent, SiteSettings } from "@/types/database";
import "./HeroSection.css";

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { data: heroData, loading: heroLoading } = useContent<HeroContent>('hero_content');
  const { data: siteSettings, loading: settingsLoading } = useContent<SiteSettings>('site_settings');
  const { buttonRef: workMagRef, textRef: workTextRef } = useMagnetic();
  const { isTouchDevice, isReducedMotion } = useDevice();
  const [useImageFallback, setUseImageFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDataLoading = heroLoading || settingsLoading;

  useLayoutEffect(() => {
    if (isDataLoading) return; // Wait for data before starting animations

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Inset frame opacity
      tl.fromTo(".hero-inset-frame", 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.2, ease: "power2.out" }, 
        0
      );

      // Background image scale and opacity
      tl.fromTo(".hero-bg-img", 
        { scale: 1.05, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.8, ease: "power2.out" }, 
        0
      );

      // HUD elements
      tl.fromTo(".hud-el", 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 
        0.8
      );

      // Headline and Tagline
      tl.fromTo(".hero-headline", 
        { clipPath: "inset(0 0 100% 0)", opacity: 0 }, 
        { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.0, ease: "expo.out" }, 
        0.6
      );
      
      tl.fromTo(".hero-headline .reveal-inner",
        { y: "100%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.0, ease: "power2.out" },
        0.7
      );
      
      tl.fromTo(".hero-tagline", 
        { clipPath: "inset(0 0 100% 0)", opacity: 0 }, 
        { clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 1.0, ease: "expo.out" }, 
        0.8
      );


      // Bottom strip & scroll indicator
      tl.fromTo([".hero-bottom-strip", ".scroll-indicator-wrapper"], 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5, ease: "power2.out" }, 
        1.2
      );

      // Scroll dot bounce
      gsap.to(".scroll-dot", {
        y: 6,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });

      // Parallax & Fade-out on scroll (skip on touch / reduced motion)
      if (!isTouchDevice && !isReducedMotion) {
        gsap.to(".hero-bg-img", {
          y: 80,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });

        // S1: Kinetic typography — font weight interpolation on scroll
        const heroHL = document.querySelector('.hero-headline') as HTMLElement;
        if (heroHL) {
          gsap.fromTo(heroHL,
            { fontVariationSettings: "'wght' 500" },
            {
              fontVariationSettings: "'wght' 300",
              ease: "none",
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
              }
            }
          );
        }
      }

    }, heroRef);

    return () => ctx.revert();
  }, [heroData, isDataLoading, isReducedMotion, isTouchDevice]); // Re-run if data changes or motion settings change

  // Preload video
  useEffect(() => {
    if (heroData?.hero_video_url && heroData?.hero_video_enabled) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = heroData.hero_video_url;
      document.head.appendChild(link);
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [heroData?.hero_video_url, heroData?.hero_video_enabled]);

  // Headline string
  const rawHeadline = heroData 
    ? `${heroData.headline_line1 || ""} ${heroData.headline_line2 || ""} ${heroData.headline_line3 || ""}`.trim() 
    : (heroLoading ? "" : "The Twenty-One");
  
  // Fix for 'ONEE' typo in database (prevents "THE THE TWENTY-ONE" duplication)
  const headline = rawHeadline.replace(/(\bTHE\s+)?TWENTY\s+ONEE/gi, 'THE TWENTY-ONE');

  return (
    <>
      <section ref={heroRef} data-theme="dark" className="relative h-[100svh] w-full overflow-hidden bg-[var(--color-black)]">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0 bg-[#0D0C0B]">
          {isDataLoading ? (
             <div className="w-full h-full bg-[#0D0C0B]" />
          ) : heroData?.hero_video_url && heroData?.hero_video_enabled && !useImageFallback ? (
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
                opacity: 0,
                transition: 'opacity 0.8s ease-in-out',
                willChange: 'opacity',
              }}
              onCanPlay={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.play().catch(() => {
                  setUseImageFallback(true);
                });
              }}
              onError={() => setUseImageFallback(true)}
            >
              <source src={heroData.hero_video_url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={heroData?.background_image_url || ""}
              alt="Hero Background"
              className="hero-bg-img w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          )}
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Inset Frame */}
        <div className="hero-inset-frame">


          {/* HUD Top Left */}
          
          {/* HUD Top Right */}
          <div className="hud-el hud-top-right hidden sm:flex items-center">
            {heroData?.overline_text}
          </div>

        </div>

        {/* Hero Text Block */}
        <div className="hero-text-block">
          <h1 className="hero-headline">
            <span className="reveal-inner block">{headline}</span>
          </h1>
          <p className="hero-tagline">
            {heroData?.tagline || "Your Vision. Our Lens. Perfect Results."}
          </p>
          
        </div>

        {/* Bottom Strip */}
        <div className="hero-bottom-strip">
          <div className="scroll-indicator-wrapper flex flex-col items-center gap-1">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
              <circle className="scroll-dot" cx="10" cy="10" r="1.5" fill="white" opacity="0.8" />
            </svg>
            <span className="text-[9px] tracking-[0.16em] text-white/35 uppercase font-normal font-sans">SCROLL</span>
          </div>
          <span className="strip-label ml-auto flex items-center">
            <span className="font-medium text-[9px] tracking-[0.12em] text-white/35 uppercase mr-2">NOW &rarr;</span>
            <span className="font-normal text-[9px] tracking-[0.06em] text-white/35">
              {siteSettings?.currently_working_on || heroData?.overline_text}
            </span>
          </span>
        </div>
      </section>

      {/* Marquee (First element after hero) */}
      <div className="marquee-container">
        <div className="marquee-track">
          {[1, 2].map((i) => (
            <span key={i} className="marquee-text">
              {heroData?.marquee_text || "THE TWENTY-ONE · BRAND CAMPAIGNS · VISUAL STORYTELLING · WEDDING COVERAGE · CORPORATE SHOOTS · "}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default HeroSection;
