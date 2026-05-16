import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "@/hooks/useContent";
import { initScrollReveal } from "@/lib/scrollReveal";
import ServicesList from "@/components/ServicesList";
import { Service } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data: services, loading } = useContent<Service[]>('services', { column: 'order_index', ascending: true });

  useEffect(() => {
    // Animations handled by global ScrollReveal
  }, [loading, services]);
  
  useEffect(() => {
    if (!loading && services) {
      const timer = setTimeout(() => {
        initScrollReveal();
        ScrollTrigger.refresh();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loading, services]);

  return (
    <div ref={ref} className="services-page" style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', paddingBottom: '120px' }}>
      <div className="container" style={{ paddingTop: 'clamp(80px, 15vh, 160px)' }}>
        {/* HERO */}
        <div className="services-hero" style={{ marginBottom: 'clamp(40px, 8vh, 68px)' }}>
          <div className="reveal-label" style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '10px', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', lineHeight: 1 }}>
            — WHAT WE DO
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: 'var(--text-display)', color: 'var(--color-primary)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.05 }}>
            <span className="block">Services</span>
          </h1>
        </div>

        {/* LIST */}
        <div style={{ marginBottom: 'clamp(80px, 15vh, 160px)' }}>
          <ServicesList showFullDescription={true} />
        </div>
      </div>

      {/* ALTERNATING FULL-BLEED SECTIONS */}
      {!loading && (services || []).map((s: Service, i: number) => {
        const isRight = i % 2 !== 0;
        return (
          <div key={s.id} className="service-detail-section" style={{ width: '100%', backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-white)', padding: 'var(--section-padding) 0' }}>
            <div className="container">
               <div className="service-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 'clamp(32px, 8vw, 80px)', alignItems: 'center' }}>
                  {/* Image Side */}
                  <div className="service-detail-img-col" style={{ gridColumn: isRight ? '7 / -1' : '1 / 7', order: isRight ? 2 : 1 }}>
                    <div className="reveal-image" style={{ width: '100%', aspectRatio: '4/5', position: 'relative', overflow: 'hidden' }}>
                      <img src={s.image_url} alt={s.title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(0.15)', transition: 'var(--img-transition)' }} />
                    </div>
                  </div>
                  
                  {/* Content Side */}
                  <div className="service-detail-content-col" style={{ gridColumn: isRight ? '1 / 7' : '7 / -1', order: isRight ? 1 : 2 }}>
                    <div className="reveal-fade" style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '11px', color: 'var(--color-muted)', fontVariantNumeric: 'tabular-nums', marginBottom: '16px', letterSpacing: '0.1em' }}>
                      {s.number_label || String(i + 1).padStart(2, '0')}
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--color-primary)', letterSpacing: '-0.02em', marginBottom: '24px', lineHeight: 1.1 }}>
                      <span className="block">{s.title}</span>
                    </h2>
                    <p style={{ fontFamily: 'var(--font-sans)', fontWeight: '300', fontSize: '15px', color: 'var(--color-secondary)', lineHeight: 1.65, marginBottom: '40px', maxWidth: '480px', letterSpacing: '-0.01em' }}>
                      {s.full_description || s.description}
                    </p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '48px', maxWidth: '480px' }}>
                      {(s.deliverables || []).map((d: string) => (
                        <span key={d} style={{ height: '26px', padding: '0 12px', border: '1px solid var(--color-border)', fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '11px', color: 'var(--color-primary)', borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center' }}>
                          {d}
                        </span>
                      ))}
                    </div>

                    <Link to="/contact" className="reveal-fade" style={{ display: 'inline-flex', alignItems: 'center', height: '40px', padding: '0 24px', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '12px', borderRadius: 'var(--radius-pill)', textDecoration: 'none', transition: 'background-color 0.25s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-accent)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}>
                      {s.enquire_label || 'Enquire About This'} <span style={{ marginLeft: '8px' }}>→</span>
                    </Link>
                  </div>
               </div>
            </div>
          </div>
        );
      })}

      <style>{`
        @media (max-width: 1023px) {
          .service-detail-grid {
             grid-template-columns: 1fr !important;
             gap: 40px !important;
          }
          .service-detail-img-col, .service-detail-content-col {
             grid-column: 1 / -1 !important;
             order: unset !important;
          }
          .service-detail-img-col {
             order: -1 !important; /* Image on top */
          }
        }
      `}</style>
    </div>
  );
};

export default Services;
