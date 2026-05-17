import { useState, useMemo, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { useContent } from "../hooks/useContent";
import { initScrollReveal } from "../lib/scrollReveal";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { Project } from "../types/database";
import "./WorkGrid.css";

interface WorkGridProps {
  limit?: number; // for homepage
  isPageHeader?: boolean;
  featuredOnly?: boolean;
}

// 4:5 aspect ratio for standard cards
const STANDARD_ASPECT_RATIO = "125%";

const WorkGrid = ({ limit, isPageHeader, featuredOnly }: WorkGridProps) => {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const { data: allProjects, loading } = useContent('work_projects', { column: 'order_index', ascending: true });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && allProjects) {
      const timer = setTimeout(() => {
        initScrollReveal();
        ScrollTrigger.refresh();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loading, allProjects]);

  const dynamicFilters = useMemo(() => {
    if (!allProjects) return ["ALL"];
    const cats = new Set(allProjects.map((p: Project) => p.category?.toUpperCase()).filter(Boolean));
    return ["ALL", ...Array.from(cats)];
  }, [allProjects]);

  // R8: per-category counts
  const categoryCounts = useMemo(() => {
    if (!allProjects) return {} as Record<string, number>;
    const counts: Record<string, number> = { ALL: allProjects.length };
    allProjects.forEach((p: Project) => {
      const cat = p.category?.toUpperCase();
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allProjects]);

  const filtered = activeFilter === "ALL" 
    ? (allProjects || []) 
    : (allProjects || []).filter((p: Project) => p.category?.toUpperCase() === activeFilter);
    
  // Apply featured filter if requested
  const prioritized = featuredOnly 
    ? filtered.filter((p: Project) => p.featured === true)
    : filtered;
    
  const displayProjects = limit ? prioritized.slice(0, limit) : prioritized;

  useLayoutEffect(() => {
    // Filter animation
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.work-card');
    if (cards.length > 0) {
      gsap.fromTo(cards, 
        { scale: 0.97, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
      );
    }
  }, [activeFilter, displayProjects.length]);

  const handleFilterClick = (f: string) => {
    if (f === activeFilter) return;
    
    // Animate out
    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.work-card');
      if (cards.length === 0) {
        setActiveFilter(f);
        return;
      }
      gsap.to(cards, {
        scale: 0.97,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          setActiveFilter(f);
        }
      });
    } else {
      setActiveFilter(f);
    }
  };

  // R3: Work card 3D tilt
  const isDesktop = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;

  const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const rotY = (dx / rect.width) * 6;
    const rotX = -(dy / rect.height) * 6;

    gsap.to(card, { rotateX: rotX, rotateY: rotY, duration: 0.4, ease: "power3" });

    // Specular highlight
    const spec = card.querySelector('.work-card-specular') as HTMLElement;
    if (spec) {
      spec.style.left = `${e.clientX - rect.left}px`;
      spec.style.top = `${e.clientY - rect.top}px`;
      spec.style.opacity = "1";
    }
  }, [isDesktop]);

  const handleCardMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDesktop) return;
    const card = e.currentTarget;
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    const spec = card.querySelector('.work-card-specular') as HTMLElement;
    if (spec) spec.style.opacity = "0";
  }, [isDesktop]);

  if (loading) {
    return (
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-4">
              <Skeleton className="aspect-[4/5] w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-48" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="work-section-container">
      <div className="container">
        <div className="work-header" style={{ marginBottom: isPageHeader ? 'clamp(40px, 8vh, 80px)' : '' }}>
          <div className="work-header-flex">
            {isPageHeader ? (
              <div className="work-header-text">
                <div className="reveal-label" style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '10px', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', lineHeight: 1 }}>
                  — OUR WORK
                </div>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: 'var(--text-display)', color: 'var(--color-primary)', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.05 }}>
                  <span className="block">Portfolio</span>
                </h1>
              </div>
            ) : (
              <div className="work-header-text">
                <div className="work-label reveal-label">
                  <span className="label-dot w-[6px] h-[6px] bg-[#E8500A] rounded-full inline-block mr-2 relative -top-[1px]"></span>
                  <span className="label-text">SELECTED WORK</span>
                </div>
                <h2 className="work-heading"><span className="block">Our Portfolio</span></h2>
              </div>
            )}
            <div className="work-filters" style={{ marginBottom: isPageHeader ? '8px' : '0' }}>
              {dynamicFilters.map((f: string) => {
                const isActive = activeFilter === f;
                const count = categoryCounts[f] || 0;
                return (
                  <button
                    key={f}
                    className={`work-filter-pill ${isActive ? 'active' : ''}`}
                    onClick={() => handleFilterClick(f)}
                  >
                    {f}{!isActive && count > 0 ? ` (${count})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="work-grid-wrapper">
          <div className="work-grid" ref={gridRef}>
            {displayProjects.map((p: Project) => {
              const paddingBottom = STANDARD_ASPECT_RATIO;
              return (
                <Link
                  to={`/work/${p.id}`}
                  key={`${p.id}-${activeFilter}`}
                  className="work-card stagger-item"
                  data-cursor="view"
                >
                  <div 
                    className="work-card-image-wrapper"
                    style={{ paddingBottom }}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                  >
                    <div className="work-card-inner">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} className="work-card-img" loading="lazy" />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0C0B', color: '#5A5A5A', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          No Image
                        </div>
                      )}
                      {p.video_type && p.video_type !== 'none' && p.video_url && (
                        <div style={{ position: 'absolute', top: '16px', right: '16px', width: '32px', height: '32px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', border: '1px solid rgba(255,255,255,0.2)', zIndex: 10 }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </div>
                      )}
                      <div className="work-card-specular" />
                    </div>
                  </div>
                  
                  <div className="work-card-info">
                    <div className="work-category-tag">{p.category || 'WORK'}</div>
                    <h3 className="work-title">{p.title}</h3>
                    <p className="work-meta">
                      {p.client_name ? `${p.client_name} · ` : ''}{p.project_year || p.year || new Date().getFullYear()}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkGrid;
