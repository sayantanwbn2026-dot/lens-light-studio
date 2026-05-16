import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "../hooks/useContent";
import { initScrollReveal } from "../lib/scrollReveal";
import { AboutContent } from "../types/database";

gsap.registerPlugin(ScrollTrigger);

const AboutTeaser = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: aboutData, loading } = useContent<AboutContent>('about_content');

  useEffect(() => {
    if (!loading && aboutData) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initScrollReveal();
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, aboutData]);

  if (loading) return null;

  return (
    <section ref={containerRef} className="about-teaser" style={{ backgroundColor: 'var(--color-white)', padding: 'var(--section-padding) 0' }}>
      <div className="container">
        <div className="about-teaser-grid">
          
          {/* Left Column — Text */}
          <div className="about-teaser-text">
            <div className="reveal-label" style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '10px', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', lineHeight: 1, display: 'flex', alignItems: 'center' }}>
              <span className="label-dot" style={{ width: '6px', height: '6px', backgroundColor: '#E8500A', borderRadius: '50%', marginRight: '8px' }}></span>
              <span className="label-text">ABOUT THE STUDIO</span>
            </div>
            
            <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--color-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: '0 0 12px 0' }}>
              <span className="block">{(aboutData?.studio_tagline && aboutData.studio_tagline.trim() !== "") ? aboutData.studio_tagline : "A studio built on obsession with light, story, and detail."}</span>
            </h2>
            
            <p style={{ fontFamily: 'var(--font-sans)', fontWeight: '300', fontSize: '14px', color: 'var(--color-secondary)', lineHeight: '1.6', letterSpacing: '-0.01em', maxWidth: '440px', margin: '0 0 24px 0' }}>
              {(aboutData?.studio_description && aboutData.studio_description.trim() !== "") ? aboutData.studio_description : "The Twenty-One was born from a singular belief: that every frame holds the power to tell a story that transcends the ordinary. We approach every project as a canvas waiting for its defining moment."}
            </p>
            
            <div>
              <Link 
                to="/about" 
                style={{ 
                  fontFamily: 'var(--font-sans)', 
                  fontWeight: 'var(--weight-regular)', 
                  fontSize: '13px', 
                  color: 'var(--color-primary)', 
                  textDecoration: 'none', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  position: 'relative',
                  paddingBottom: '2px',
                  transition: 'color 0.3s var(--ease-out)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = 'var(--color-accent)';
                  const after = e.currentTarget.querySelector('.cta-underline') as HTMLElement;
                  if (after) after.style.transform = 'scaleX(1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = 'var(--color-primary)';
                  const after = e.currentTarget.querySelector('.cta-underline') as HTMLElement;
                  if (after) after.style.transform = 'scaleX(0)';
                }}
              >
                Meet the Studio →
                <span className="cta-underline" style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '1px',
                  backgroundColor: 'var(--color-accent)',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s var(--ease-out)'
                }} />
              </Link>
            </div>
          </div>

          {/* Right Column — Image (comes first on mobile via order) */}
          <div className="about-teaser-image">
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '4 / 5',
              minHeight: '300px', 
              maxHeight: '600px',
              backgroundColor: 'var(--color-surface)',
              overflow: 'hidden'
            }}>
              <img 
                src={aboutData?.founder_image_url || "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80&ar=4:5&fit=crop"} 
                alt="Founder" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  filter: 'grayscale(0.2)', 
                  transition: 'var(--img-transition)' 
                }}
                onMouseOver={(e) => { e.currentTarget.style.filter = 'grayscale(0) brightness(1.03)'; }}
                onMouseOut={(e) => { e.currentTarget.style.filter = 'grayscale(0.2)'; }}
              />
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: '-3px',
                width: '3px',
                height: '48px',
                backgroundColor: 'var(--color-accent)',
                zIndex: 10
              }} />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .about-teaser-grid {
          display: grid;
          grid-template-columns: 55% 45%;
          gap: 80px;
          align-items: center;
        }
        @media (max-width: 1023px) {
          .about-teaser-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }
        }
        @media (max-width: 767px) {
          .about-teaser-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .about-teaser-image {
            order: -1;
            width: calc(100% + 40px);
            margin-left: -20px;
            margin-right: -20px;
            aspect-ratio: 4 / 3;
            min-height: unset !important;
            margin-bottom: 40px;
          }
          .about-teaser-image > div {
            min-height: unset !important;
            aspect-ratio: 4 / 3;
          }
          .about-teaser-text { 
            width: 100%; 
            padding: 0 4px;
          }
          .about-teaser-text h2 {
            font-size: 28px !important;
            margin-bottom: 20px !important;
          }
          .about-teaser-text p {
            font-size: 15px !important;
            margin-bottom: 32px !important;
            max-width: 100% !important;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutTeaser;
