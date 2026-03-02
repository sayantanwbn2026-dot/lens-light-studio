import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const serviceData = [
  {
    num: "01",
    name: "Brand Campaigns",
    desc: "We craft visual identities that resonate. From concept to execution, our brand campaigns distill your essence into imagery that captivates audiences and defines market presence. Every frame is designed to communicate your story with clarity and conviction.",
    deliverables: ["Visual Identity Systems", "Campaign Photography", "Art Direction", "Brand Films"],
    img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    align: "left",
  },
  {
    num: "02",
    name: "Corporate Shoots",
    desc: "Professional imagery that elevates your corporate narrative. We deliver polished, purposeful photography for annual reports, executive portraits, office environments, and corporate events — imagery that builds trust and communicates professionalism.",
    deliverables: ["Executive Portraits", "Annual Reports", "Event Coverage", "Office Documentation"],
    img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
    align: "right",
  },
  {
    num: "03",
    name: "Wedding Coverage",
    desc: "Your love story, told through a cinematic lens. We approach every wedding as a unique narrative — capturing not just moments, but the emotions, details, and atmosphere that make your celebration extraordinary. Timeless imagery for timeless bonds.",
    deliverables: ["Cinematic Coverage", "Pre-Wedding Shoots", "Photo Albums", "Highlight Reels"],
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    align: "left",
  },
  {
    num: "04",
    name: "Traditional Coverages",
    desc: "Celebrating culture with reverence and artistry. From Durga Puja pandals to Saraswati Puja celebrations, we document the vibrant traditions of Bengal with an eye for authenticity, preserving heritage through powerful visual storytelling.",
    deliverables: ["Festival Documentation", "Cultural Events", "Heritage Projects", "Ceremonial Coverage"],
    img: "https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=800&q=80",
    align: "right",
  },
];

const Services = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".svc-char", { y: -80, opacity: 0, duration: 0.8, stagger: 0.03, ease: "power3.out", delay: 0.2 });

      gsap.utils.toArray<HTMLElement>(".svc-block").forEach(el => {
        gsap.from(el.querySelectorAll(".svc-reveal"), {
          scrollTrigger: { trigger: el, start: "top 75%" },
          y: 50, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        });
        const img = el.querySelector(".svc-img");
        if (img) {
          gsap.from(img, {
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 20%", scrub: 1 },
            y: 60,
          });
        }
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen pt-28 md:pt-36 pb-24 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="overflow-hidden mb-24">
          {"SERVICES".split("").map((c, i) => (
            <span key={i} className="svc-char inline-block font-display text-[14vw] md:text-[10vw] text-foreground leading-none">{c}</span>
          ))}
        </h1>

        {serviceData.map((s, i) => (
          <div key={s.num}>
            <div className={`svc-block grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center py-20 md:py-28 ${s.align === "right" ? "md:direction-rtl" : ""}`}>
              <div className={`${s.align === "right" ? "md:order-2" : ""}`}>
                <div className="svc-img aspect-[4/5] overflow-hidden bg-charcoal">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover grayscale" loading="lazy" />
                </div>
              </div>
              <div className={`${s.align === "right" ? "md:order-1 md:text-right" : ""}`} style={{ direction: "ltr" }}>
                <p className="svc-reveal font-body font-light text-sm text-muted tracking-[0.15em] mb-4">— {s.num}</p>
                <h2 className="svc-reveal font-display text-3xl md:text-[4vw] text-foreground leading-tight mb-6">{s.name}</h2>
                <p className="svc-reveal font-body font-light text-base text-muted-foreground leading-relaxed mb-8">{s.desc}</p>
                <div className={`svc-reveal flex flex-wrap gap-2 mb-8 ${s.align === "right" ? "md:justify-end" : ""}`}>
                  {s.deliverables.map(d => (
                    <span key={d} className="border border-border/40 rounded-full px-4 py-1.5 font-body font-light text-xs text-muted-foreground uppercase tracking-[0.08em]">
                      {d}
                    </span>
                  ))}
                </div>
                <Link to="/contact" className="svc-reveal underline-draw font-body font-light text-sm text-foreground uppercase tracking-[0.1em] inline-flex items-center gap-2">
                  Enquire About This <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
            {i < serviceData.length - 1 && (
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-border/30" />
                <span className="text-muted/40 text-sm">✦</span>
                <div className="flex-1 h-px bg-border/30" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
