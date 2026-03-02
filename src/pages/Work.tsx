import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const allProjects = [
  { name: "Luminous Brand Story", category: "Brand", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80", aspect: "portrait" },
  { name: "Tata Steel Annual Report", category: "Corporate", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80", aspect: "landscape" },
  { name: "Ananya & Rohit Wedding", category: "Weddings", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", aspect: "portrait" },
  { name: "Heritage Kolkata Series", category: "Traditional", img: "https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=600&q=80", aspect: "landscape" },
  { name: "Birla Corporate Identity", category: "Brand", img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80", aspect: "portrait" },
  { name: "Durga Puja 2024", category: "Traditional", img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80", aspect: "landscape" },
  { name: "Meera & Arjun", category: "Weddings", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", aspect: "portrait" },
  { name: "ITC Grand Portraits", category: "Corporate", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80", aspect: "landscape" },
  { name: "Park Street Campaign", category: "Brand", img: "https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=600&q=80", aspect: "portrait" },
];

const filters = ["All", "Brand", "Corporate", "Weddings", "Traditional"];

const Work = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? allProjects : allProjects.filter(p => p.category === activeFilter);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-char", { y: -80, opacity: 0, duration: 0.8, stagger: 0.03, ease: "power3.out", delay: 0.2 });
      gsap.from(".work-overline", { opacity: 0, y: 20, duration: 0.6, delay: 0.6 });
      gsap.from(".filter-pill", { opacity: 0, y: 20, duration: 0.5, stagger: 0.08, delay: 0.8 });
    }, ref);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".work-card", { y: 60, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" });
    }, ref);
    return () => ctx.revert();
  }, [activeFilter]);

  return (
    <div ref={ref} className="min-h-screen pt-28 md:pt-36 pb-24 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Hero */}
        <div className="mb-16">
          <p className="work-overline font-body font-light text-sm text-muted uppercase tracking-[0.2em] mb-2">Our</p>
          <h1 className="overflow-hidden">
            {"WORK".split("").map((c, i) => (
              <span key={i} className="work-char inline-block font-display text-[16vw] md:text-[12vw] text-foreground leading-none">{c}</span>
            ))}
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-16">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`filter-pill font-body text-xs uppercase tracking-[0.1em] px-5 py-2.5 rounded-full border transition-all duration-300 ${
                activeFilter === f
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-muted border-border/40 hover:border-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filtered.map((p, i) => (
            <div key={p.name + activeFilter} className="work-card break-inside-avoid group relative overflow-hidden bg-charcoal">
              <div className={p.aspect === "portrait" ? "aspect-[3/4]" : "aspect-[4/3]"}>
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <p className="font-display italic text-lg text-foreground">{p.name}</p>
                <p className="font-body font-light text-xs text-muted uppercase tracking-[0.1em]">{p.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
