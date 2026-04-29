import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data: services, loading } = useContent('services', { column: 'order_index', ascending: true });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".svc-char", { y: -80, opacity: 0, duration: 0.8, stagger: 0.03, ease: "power3.out", delay: 0.2 });

      gsap.utils.toArray<HTMLElement>(".svc-block").forEach(el => {
        gsap.from(el.querySelectorAll(".svc-reveal"), {
          scrollTrigger: { trigger: el, start: "top 75%" },
          y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        });
        const img = el.querySelector(".svc-img");
        if (img) {
          gsap.from(img, {
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 20%", scrub: 1 },
            y: 50,
          });
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen pt-28 md:pt-36 pb-24 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Services</p>
        <h1 className="overflow-hidden mb-24">
          {"SERVICES".split("").map((c, i) => (
            <span key={i} className="svc-char inline-block font-body text-foreground leading-none" style={{ fontWeight: 500, fontSize: "clamp(3rem, 8vw, 10rem)" }}>{c}</span>
          ))}
        </h1>

        {loading ? (
          <div className="flex flex-col gap-24">
            {[1, 2, 3].map(i => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
                <Skeleton className="aspect-[4/5] w-full rounded-none" />
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-4 w-12 mb-4" />
                  <Skeleton className="h-10 md:h-12 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6 mb-6" />
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Skeleton className="h-8 w-24 rounded-full" />
                    <Skeleton className="h-8 w-32 rounded-full" />
                    <Skeleton className="h-8 w-28 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          (services || []).map((s: any, i: number) => {
            const align = i % 2 === 1 ? 'right' : 'left';
            return (
              <div key={s.id}>
                <div className={`svc-block grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center py-16 md:py-24`}>
                  <div className={`${align === "right" ? "md:order-2" : ""}`}>
                    <div className="svc-img aspect-[4/5] overflow-hidden bg-charcoal">
                      <img src={s.image_url} alt={s.title} className="w-full h-full object-cover grayscale" loading="lazy" />
                    </div>
                  </div>
                  <div className={`${align === "right" ? "md:order-1 md:text-right" : ""}`}>
                    <p className="svc-reveal font-body font-light text-sm text-muted tracking-[0.15em] mb-4">— {s.number_label}</p>
                    <h2 className="svc-reveal font-body text-3xl md:text-[3.5vw] text-foreground leading-tight mb-6" style={{ fontWeight: 500 }}>{s.title}</h2>
                    <p className="svc-reveal font-body font-light text-base text-muted-foreground leading-relaxed mb-8">{s.description}</p>
                    <div className={`svc-reveal flex flex-wrap gap-2 mb-8 ${align === "right" ? "md:justify-end" : ""}`}>
                      {(s.deliverables || []).map((d: string) => (
                        <span key={d} className="border border-border/40 rounded-full px-4 py-1 font-body font-light text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                          {d}
                        </span>
                      ))}
                    </div>
                    <Link to="/contact" className="svc-reveal underline-draw font-body font-normal text-[13px] text-foreground uppercase tracking-[0.1em] inline-flex items-center gap-2">
                      {s.enquire_label || 'Enquire About This'} <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
                {i < (services?.length || 0) - 1 && (
                  <div className="h-px bg-border/20 w-full" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Services;
