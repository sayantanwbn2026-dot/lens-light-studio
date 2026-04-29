import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(ScrollTrigger);

// Mixed aspect ratios: portrait, landscape, square repeating
const aspectPatterns = ["aspect-[2/3]", "aspect-[16/9]", "aspect-[1/1]"];

const Work = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const { data: allProjects, loading } = useContent('work_projects', { column: 'order_index', ascending: true });

  const dynamicFilters = useMemo(() => {
    if (!allProjects) return ["All"];
    const cats = new Set(allProjects.map((p: any) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [allProjects]);

  const filtered = activeFilter === "All" ? (allProjects || []) : (allProjects || []).filter((p: any) => p.category === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-char", { y: -80, opacity: 0, duration: 0.8, stagger: 0.03, ease: "power3.out", delay: 0.2 });
      gsap.from(".filter-pill", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, delay: 0.8 });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-card", { y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <div ref={ref} className="min-h-screen pt-28 md:pt-36 pb-24 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Hero */}
        <div className="mb-16">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Work</p>
          <h1 className="overflow-hidden">
            {"WORK".split("").map((c, i) => (
              <span key={i} className="work-char inline-block font-body text-foreground leading-none" style={{ fontWeight: 500, fontSize: "clamp(4rem, 8vw, 10rem)" }}>{c}</span>
            ))}
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-16">
          {loading ? (
            [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-24 rounded-full" />)
          ) : (
            dynamicFilters.map((f: any) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`filter-pill font-body font-light text-[11px] uppercase tracking-[0.12em] px-5 py-2 rounded-full border transition-all duration-300 ${activeFilter === f
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted border-border/40 hover:border-foreground/60 hover:text-foreground"
                  }`}
              >
                {f}
              </button>
            ))
          )}
        </div>

        {/* Grid with mixed aspects */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="mb-5">
                <Skeleton className={`w-full ${aspectPatterns[i % 3]} rounded-none`} />
              </div>
            ))
          ) : (
            filtered.map((p: any, idx: number) => {
              const aspectClass = window.innerWidth < 768 ? "aspect-[4/5]" : aspectPatterns[idx % 3];
              return (
                <div key={p.id + activeFilter} className="work-card break-inside-avoid group relative overflow-hidden bg-charcoal">
                  <div className={aspectClass}>
                    {p.cover_image_url ? (
                      <img
                        src={p.cover_image_url}
                        alt={p.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black text-[#5A5A5A] text-[10px] uppercase tracking-widest">No Image</div>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                    <p className="font-body font-medium text-sm text-foreground">{p.title}</p>
                    <p className="font-body font-light text-[11px] text-muted uppercase tracking-[0.1em]">{p.category}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Work;
