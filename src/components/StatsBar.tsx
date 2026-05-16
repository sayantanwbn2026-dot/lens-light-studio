import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "../hooks/useContent";
import { initScrollReveal } from "../lib/scrollReveal";
import { StatItem } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

const StatsBar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: stats, loading } = useContent<StatItem[]>('stats', { column: 'order_index', ascending: true });

  useEffect(() => {
    if (!loading && stats && stats.length > 0) {
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(".stat-num-val").forEach(el => {
          const target = parseFloat(el.getAttribute("data-target") || "0");
          if (isNaN(target)) return;
          
          const isInt = target % 1 === 0;
          
          gsap.fromTo(el, { innerText: "0" }, {
            innerText: target,
            duration: 1.8,
            ease: "quart.out",
            snap: { innerText: isInt ? 1 : 0.1 },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true
            }
          });
        });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, stats]);
  
  useEffect(() => {
    if (!loading && stats) {
      const timer = setTimeout(() => {
        initScrollReveal();
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, stats]);

  // R4: Hover re-count animation
  const handleStatHover = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const statEl = e.currentTarget;
    const numEl = statEl.querySelector('.stat-num-val') as HTMLElement;
    const suffEl = statEl.querySelector('.stat-suffix') as HTMLElement;
    
    if (numEl) {
      const target = parseFloat(numEl.getAttribute("data-target") || "0");
      if (isNaN(target)) return;
      const isInt = target % 1 === 0;
      
      gsap.fromTo(numEl, 
        { innerText: "0" }, 
        {
          innerText: target,
          duration: 0.8,
          ease: "power2.out",
          snap: { innerText: isInt ? 1 : 0.1 },
        }
      );
    }
    
    // Suffix coin flip
    if (suffEl) {
      gsap.fromTo(suffEl,
        { rotateY: 0 },
        { rotateY: 360, duration: 0.4, ease: "power2.inOut" }
      );
    }
  }, []);

  if (loading || !stats || stats.length === 0) {
    return <section style={{ backgroundColor: 'var(--color-primary)', padding: '64px 0' }}><div className="container" style={{ color: 'var(--color-muted)', textAlign: 'center', fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', letterSpacing: 'var(--tracking-body)' }}>Loading stats...</div></section>;
  }

  return (
    <section ref={containerRef} className="stats-bar-section">
      <div className="container">
        <div className="stats-grid">
          {stats.slice(0, 4).map((s: StatItem, i: number) => {
            const valStr = s.number_value ? String(s.number_value) : "0";
            const numMatch = valStr.match(/^[\d.]+/);
            const numVal = numMatch ? parseFloat(numMatch[0]) : 0;
            const suffix = valStr.replace(/^[\d.]+/, '');

            return (
              <div className="stat-cell stagger-item" key={s.id || i}>
                <div 
                  className="stat-inner"
                  onMouseEnter={handleStatHover}
                >
                  <div className="stat-num-row">
                    <span 
                      className="stat-num-val" 
                      data-target={numVal}
                    >
                      {numVal}
                    </span>
                    {suffix && (
                      <span className="stat-suffix">
                        {suffix}
                      </span>
                    )}
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
                {i < Math.min(stats.length, 4) - 1 && (
                  <div className="stat-divider-vert" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .stats-bar-section {
          background-color: var(--color-primary);
          padding: 52px 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .stat-cell {
          display: flex;
          align-items: center;
        }
        .stat-inner {
          flex: 1;
          text-align: center;
          cursor: default;
          padding: 8px 0;
        }
        .stat-num-row {
          display: flex;
          align-items: baseline;
          justify-content: center;
          line-height: 1;
        }
        .stat-num-val, .stat-suffix {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(2.8rem, 5vw, 5rem);
          color: var(--color-white);
          letter-spacing: -0.02em;
        }
        .stat-suffix {
          color: var(--color-accent);
          display: inline-block;
        }
        .stat-label {
          font-family: var(--font-sans);
          font-weight: var(--weight-medium);
          font-size: 11px;
          color: rgba(255,255,255,0.45);
          letter-spacing: var(--tracking-caps);
          text-transform: uppercase;
          margin-top: 8px;
        }
        .stat-divider-vert {
          width: 1px;
          height: 60px;
          background: rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        @media (max-width: 767px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .stat-cell {
            flex-direction: column;
            border: none;
          }
          .stat-cell:nth-child(-n+2) {
            border-bottom: 1px solid rgba(255,255,255,0.1);
          }
          .stat-cell:nth-child(odd) {
            border-right: 1px solid rgba(255,255,255,0.1);
          }
          .stat-inner {
            padding: 32px 20px;
            text-align: center;
            width: 100%;
          }
          .stat-divider-vert { display: none; }
          .stat-num-val, .stat-suffix {
            font-size: clamp(2rem, 8vw, 3rem);
          }
          .stat-label { font-size: 10px; }
        }
      `}</style>
    </section>
  );
};

export default StatsBar;
