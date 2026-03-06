import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/HeroSection";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: "Luminous Brand Story", category: "Brand Campaign", img: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=600&q=80" },
  { name: "Tata Steel Annual", category: "Corporate", img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80" },
  { name: "Ananya & Rohit", category: "Wedding", img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80" },
  { name: "Heritage Kolkata", category: "Traditional", img: "https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=600&q=80" },
  { name: "Birla Identity", category: "Brand Campaign", img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600&q=80" },
  { name: "Durga Puja 2024", category: "Traditional", img: "https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600&q=80" },
];

const services = [
  { num: "01", name: "Brand Campaigns", desc: "Visual narratives that define and elevate your brand identity." },
  { num: "02", name: "Corporate Shoots", desc: "Professional imagery for annual reports, profiles, and events." },
  { num: "03", name: "Wedding Coverage", desc: "Cinematic storytelling of your most cherished moments." },
  { num: "04", name: "Traditional Coverages", desc: "Capturing cultural celebrations with authenticity and artistry." },
];

const stats = [
  { num: 120, suffix: "+", label: "Projects Completed" },
  { num: 4, suffix: "+", label: "Years of Visual Craft" },
  { num: 30, suffix: "+", label: "Brands Elevated" },
  { num: 100, suffix: "%", label: "Client Satisfaction" },
];

const testimonials = [
  { quote: "The Twenty-One didn't just photograph our wedding — they composed a visual poem we'll treasure forever.", name: "Ananya Chatterjee", role: "Bride, 2024" },
  { quote: "Their understanding of light and narrative transformed our brand's visual language entirely.", name: "Rajesh Mehta", role: "CEO, Luminary Studios" },
  { quote: "Working with Kingshuk's team felt like collaborating with true artists who understand corporate vision.", name: "Priya Banerjee", role: "Marketing Director, Tata Steel" },
];

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [dragHintVisible, setDragHintVisible] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section reveals
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
        });
      });

      // Staggered reveals
      gsap.utils.toArray<HTMLElement>(".reveal-stagger").forEach(container => {
        const children = container.querySelectorAll(".reveal-child");
        gsap.from(children, {
          scrollTrigger: { trigger: container, start: "top 80%" },
          y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out",
        });
      });

      // Stats countup
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach(el => {
        const target = parseInt(el.getAttribute("data-target") || "0");
        gsap.fromTo(el, { innerText: "0" }, {
          innerText: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: 1 },
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Horizontal reel progress bar
      const reelScroll = reelRef.current?.querySelector(".reel-scroll");
      const progressBar = reelRef.current?.querySelector(".reel-progress-fill");
      if (reelScroll && progressBar) {
        reelScroll.addEventListener("scroll", () => {
          const el = reelScroll as HTMLElement;
          const pct = el.scrollLeft / (el.scrollWidth - el.clientWidth);
          gsap.set(progressBar, { scaleX: pct });
          if (pct > 0.05 && dragHintVisible) setDragHintVisible(false);
        });
      }

      // About image clip
      gsap.from(".about-image", {
        scrollTrigger: { trigger: ".about-image", start: "top 75%" },
        clipPath: "circle(0% at 50% 50%)",
        duration: 1.5,
        ease: "power3.out",
      });

      // Variable font weight on headlines
      gsap.utils.toArray<HTMLElement>(".weight-shift").forEach(el => {
        gsap.fromTo(el, { fontWeight: 100 }, {
          fontWeight: 500,
          scrollTrigger: { trigger: el, start: "top 90%", end: "top 30%", scrub: true },
        });
      });
    }, containerRef);

    return () => { ctx.revert(); };
  }, [dragHintVisible]);

  return (
    <div ref={containerRef}>
      <HeroSection />

      {/* SIGNATURE REEL */}
      <section ref={reelRef} className="py-24 md:py-32 px-6 md:px-10 overflow-hidden relative">
        {/* Progress bar */}
        <div className="w-full h-px bg-border/20 mb-4">
          <div className="reel-progress-fill h-full bg-foreground origin-left" style={{ transform: "scaleX(0)" }} />
        </div>

        <div className="flex items-center justify-between mb-8">
          <div className="reveal-up">
            <p className="font-display italic text-xl md:text-3xl text-foreground leading-relaxed">
              "We Don't Just Capture. We Compose."
            </p>
          </div>
          {dragHintVisible && (
            <span className="font-body font-light text-[11px] uppercase tracking-[0.15em] text-muted animate-pulse hidden md:block">
              Drag →
            </span>
          )}
        </div>

        <div className="reel-scroll flex gap-5 overflow-x-auto pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
          {projects.map((p, i) => (
            <div key={i} className="snap-start shrink-0 w-[260px] md:w-[320px] group relative">
              <div className="aspect-[3/4] overflow-hidden bg-charcoal">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-3 right-3 font-body font-light text-[11px] text-foreground/40 tracking-wider">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="font-body font-medium text-[13px] text-foreground">{p.name}</p>
                <p className="font-display italic text-sm text-muted">{p.category}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT TEASER */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="about-image" style={{ clipPath: "circle(100% at 50% 50%)" }}>
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=600&q=80"
                alt="The Twenty-One Studio"
                className="w-full h-full object-cover grayscale"
                loading="lazy"
              />
            </div>
          </div>
          <div className="reveal-stagger">
            <p className="reveal-child font-body text-[10px] uppercase tracking-[0.25em] mb-2" style={{ fontWeight: 300, color: "#7A7A7A" }}>— About</p>
            <p className="reveal-child font-body font-light text-[11px] text-muted uppercase tracking-[0.2em] mb-4">Founded in Kolkata</p>
            <h2 className="reveal-child weight-shift font-body text-2xl md:text-[2.4vw] text-foreground leading-[1.3] mb-6" style={{ fontWeight: 300 }}>
              A studio built on obsession with light, story, and detail.
            </h2>
            <p className="reveal-child font-body font-light text-base text-muted-foreground leading-relaxed mb-4">
              The Twenty-One was born from a singular belief: that every frame holds the power to tell a story that transcends the ordinary. Founded by Kingshuk in the heart of Kolkata, we bring an obsessive attention to light, composition, and narrative.
            </p>
            <p className="reveal-child font-body font-light text-base text-muted-foreground leading-relaxed mb-8">
              From intimate weddings to bold brand campaigns, we approach every project as a canvas waiting for its defining moment.
            </p>
            <Link to="/about" className="reveal-child underline-draw font-body font-normal text-[13px] text-foreground uppercase tracking-[0.1em] inline-flex items-center gap-2">
              Meet the Studio <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16 relative">
            <p className="reveal-up font-body text-[10px] uppercase tracking-[0.25em] mb-2" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Services</p>
            <h2 className="reveal-up weight-shift font-body text-[clamp(2.2rem,3.5vw,4.5rem)] text-foreground" style={{ fontWeight: 500 }}>What We Do</h2>
            <span className="font-display italic text-[5vw] text-foreground/[0.06] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none whitespace-nowrap">Services</span>
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map(s => (
              <div key={s.num} className="reveal-child service-card group p-10 bg-accent hover:bg-charcoal transition-colors duration-500 border border-border/30 relative overflow-hidden">
                <div className="service-card-bg absolute inset-0 opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2020h40M20%200v40%22%20stroke%3D%22white%22%20stroke-width%3D%220.5%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
                <span className="font-body font-light text-sm text-muted block mb-4 relative z-10">{s.num}</span>
                <h3 className="font-body font-medium text-lg text-foreground mb-3 relative z-10">{s.name}</h3>
                <p className="font-body font-light text-sm text-muted-foreground mb-6 relative z-10">{s.desc}</p>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-body font-light text-sm text-foreground relative z-10">↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 md:py-20 px-6 md:px-10 bg-deep-black">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between">
          {stats.map((s, i) => (
            <div key={i} className="flex items-center">
              <div className="text-center py-6 md:py-0 px-8">
                <div className="flex items-baseline justify-center">
                  <span className="stat-number font-body font-light text-[10vw] md:text-[4.5vw] text-foreground" data-target={s.num}>0</span>
                  <span className="font-body font-light text-[6vw] md:text-[2.5vw] text-foreground">{s.suffix}</span>
                </div>
                <p className="font-body font-light text-[11px] text-muted uppercase tracking-[0.2em] mt-2">{s.label}</p>
              </div>
              {i < stats.length - 1 && <div className="stat-divider hidden md:block h-16" />}
            </div>
          ))}
        </div>
      </section>

      {/* FOUNDER QUOTE */}
      <section className="py-28 md:py-32 px-6 md:px-10">
        <div className="max-w-[1000px] mx-auto text-center">
          <blockquote className="reveal-up font-display italic text-[clamp(1.5rem,3.5vw,3.5rem)] text-foreground leading-relaxed">
            "Photography is not about the camera. It's about what you choose to see."
          </blockquote>
          <p className="reveal-up font-body font-light text-[12px] text-muted uppercase tracking-[0.2em] mt-8">— Kingshuk, Founder</p>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-2" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Testimonials</p>
          <p className="reveal-up font-body font-medium text-[clamp(2.2rem,3.5vw,4.5rem)] text-foreground mb-12">Client Stories</p>
          <div className="relative">
            <span className="absolute -top-6 -left-4 font-display text-[12vw] text-muted/[0.06] leading-none select-none pointer-events-none">"</span>
            <blockquote className="font-display italic text-xl md:text-[2.5vw] text-foreground leading-relaxed mb-8 relative z-10">
              {testimonials[testimonialIdx].quote}
            </blockquote>
            <div className="mb-8">
              <p className="font-body font-medium text-[13px] text-foreground">{testimonials[testimonialIdx].name}</p>
              <p className="font-body font-light text-[12px] text-muted">{testimonials[testimonialIdx].role}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setTestimonialIdx(i => (i === 0 ? testimonials.length - 1 : i - 1))} className="w-9 h-9 border border-border/40 rounded-full flex items-center justify-center hover:border-foreground transition-colors" aria-label="Previous">
                <ChevronLeft className="w-3.5 h-3.5 text-foreground" />
              </button>
              <button onClick={() => setTestimonialIdx(i => (i === testimonials.length - 1 ? 0 : i + 1))} className="w-9 h-9 border border-border/40 rounded-full flex items-center justify-center hover:border-foreground transition-colors" aria-label="Next">
                <ChevronRight className="w-3.5 h-3.5 text-foreground" />
              </button>
              <div className="flex gap-1.5 ml-4">
                {testimonials.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === testimonialIdx ? "bg-foreground" : "bg-muted/30"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 md:py-32 px-6 md:px-10 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="reveal-up weight-shift font-body text-[clamp(1.8rem,4vw,3.5rem)] text-foreground mb-3" style={{ fontWeight: 300 }}>
            Ready to tell your story?
          </h2>
          <p className="reveal-up font-display italic text-[clamp(1rem,1.6vw,1.4rem)] text-muted mb-10">
            Let's create something that lasts.
          </p>
          <Link
            to="/contact"
            className="reveal-up inline-block border border-foreground/40 rounded-full px-10 py-3.5 font-body font-normal text-[12px] uppercase tracking-[0.15em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
          >
            Begin Your Project <ArrowRight className="w-3.5 h-3.5 inline ml-1.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
