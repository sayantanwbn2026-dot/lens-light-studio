"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface VideoScrollHeroProps {
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
}

export function VideoScrollHero({
  videoSrc = "",
  posterSrc = "",
  className = "",
}: VideoScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Responsive variables state
  const [startScale, setStartScale] = useState(0.72);
  const [containerWidth, setContainerWidth] = useState('calc(100% - 48px)');
  const [containerHeight, setContainerHeight] = useState('220vh');
  const [aspectRatio, setAspectRatio] = useState('16/9');
  const [brStart, setBrStart] = useState(16);
  const [brEnd, setBrEnd] = useState(4);
  
  const [scrollScale, setScrollScale] = useState(0.72);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const rafRef = useRef<number>(0);

  // Handle Resize for Responsive Values
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1024) {
        setStartScale(0.72);
        setContainerWidth('calc(100% - 48px)');
        setContainerHeight('220vh');
        setAspectRatio('16/9');
        setBrStart(16);
        setBrEnd(4);
      } else if (width >= 768 && width <= 1024) {
        setStartScale(0.78);
        setContainerWidth('calc(100% - 32px)');
        setContainerHeight('220vh');
        setAspectRatio('16/9');
        setBrStart(12);
        setBrEnd(4);
      } else {
        setStartScale(0.88);
        setContainerWidth('calc(100% - 20px)');
        setContainerHeight('180vh');
        setAspectRatio(width < 480 ? '9/16' : '16/9');
        setBrStart(8);
        setBrEnd(2);
      }
    };
    
    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update scrollScale when startScale changes on resize
  useEffect(() => {
    setScrollScale(startScale);
  }, [startScale]);

  // Performance: Lazy load video element
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVideoReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleScroll = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const contHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = Math.max(1, contHeight - windowHeight);
      const progress = Math.min(scrolled / maxScroll, 1);
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      const newScale = startScale + (eased * (1 - startScale));
      setScrollScale(newScale);
    });
  }, [startScale]);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      setScrollScale(1);
      return;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  // Radius interpolation
  const borderRadius = `${Math.max(brEnd, brStart - (scrollScale - startScale) / 
    (1 - startScale) * (brStart - brEnd))}px`;

  if (!videoSrc) return null;

  return (
    <section
      ref={sectionRef}
      className={`relative w-full ${className}`}
      style={{ 
        background: '#F7F6F4',
        paddingTop: '0',
      }}
    >
      {/* Sticky scroll container */}
      <div
        ref={containerRef}
        style={{ height: containerHeight, position: 'relative' }}
      >
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Scale wrapper */}
          <div
            style={{
              transform: `scale(${scrollScale})`,
              transformOrigin: 'center center',
              willChange: 'transform',
              transition: 'border-radius 0.1s ease',
              width: '100%',
              maxWidth: '100vw',
            }}
          >
            {/* Video container — inset from viewport edges */}
            <div
              style={{
                margin: '0 auto',
                width: containerWidth,
                maxWidth: '1320px',
                position: 'relative',
                borderRadius: borderRadius,
                overflow: 'hidden',
                aspectRatio: aspectRatio,
                background: '#0D0C0B',
              }}
            >
              {!videoReady || !isLoaded ? (
                  <img 
                    src={posterSrc} 
                    alt="Video Poster" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      zIndex: 1,
                    }}
                  />
              ) : null}

              {videoReady && (
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={posterSrc}
                  onLoadedData={() => setIsLoaded(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <source src={videoSrc} type="video/mp4" />
                  <source src={videoSrc} type="video/webm" />
                </video>
              )}

              {/* Loading state */}
              {(!videoReady || !isLoaded) && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(13, 12, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 3,
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderTopColor: '#E8500A',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                </div>
              )}

              {/* Subtle bottom gradient for depth */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '30%',
                  background: 'linear-gradient(to top, rgba(13,12,11,0.35), transparent)',
                  pointerEvents: 'none',
                  zIndex: 4,
                }}
              />

              {/* Progress indicator — scroll fill line at very bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'rgba(255,255,255,0.1)',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${((scrollScale - startScale) / (1 - startScale)) * 100}%`,
                    background: '#E8500A',
                    transition: 'width 0.05s ease',
                    borderRadius: '0 1px 1px 0',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for spinner */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
