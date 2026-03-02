import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "@/components/Marquee";
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
  const [scrollVisible, setScrollVisible] = useState(true);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero text reveal
      gsap.from(".hero-line", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.3,
      });

      // Film counter
      gsap.from(".film-counter", { opacity: 0, duration: 1, delay: 1.2 });

      // Scroll indicator
      gsap.from(".scroll-indicator", { opacity: 0, y: 20, duration: 0.8, delay: 1.5 });

      // Section reveals
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
          y: 60, opacity: 0, duration: 1, ease: "power3.out",
        });
      });

      // Staggered reveals
      gsap.utils.toArray<HTMLElement>(".reveal-stagger").forEach(container => {
        const children = container.querySelectorAll(".reveal-child");
        gsap.from(children, {
          scrollTrigger: { trigger: container, start: "top 80%" },
          y: 60, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power3.out",
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

      // Horizontal rule draw
      gsap.from(".rule-draw", {
        scrollTrigger: { trigger: ".rule-draw", start: "top 80%" },
        scaleX: 0, duration: 1.2, ease: "power3.inOut",
      });

      // About image clip
      gsap.from(".about-image", {
        scrollTrigger: { trigger: ".about-image", start: "top 75%" },
        clipPath: "circle(0% at 50% 50%)",
        duration: 1.5,
        ease: "power3.out",
      });
    }, containerRef);

    const onScroll = () => { if (window.scrollY > 100) setScrollVisible(false); };
    window.addEventListener("scroll", onScroll);

    return () => { ctx.revert(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return (
    <div ref={containerRef}>
      {/* HERO */}
      <section className="relative h-screen flex flex-col justify-center items-center bg-background overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-foreground/[0.04] rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/5 w-64 h-64 bg-foreground/[0.06] rounded-full blur-3xl" />
          <div className="absolute top-2/3 left-2/3 w-80 h-80 bg-foreground/[0.03] rounded-full blur-3xl" />
        </div>

        {/* Film counter */}
        <div className="film-counter absolute top-24 left-6 md:left-10 font-body font-light text-[10px] text-muted tracking-[0.2em] uppercase">
          001 / Kolkata / Est. 2024
        </div>

        {/* Film frame corners */}
        <div className="absolute top-20 left-6 w-8 h-8 border-t border-l border-foreground/20" />
        <div className="absolute top-20 right-6 w-8 h-8 border-t border-r border-foreground/20" />
        <div className="absolute bottom-20 left-6 w-8 h-8 border-b border-l border-foreground/20" />
        <div className="absolute bottom-20 right-6 w-8 h-8 border-b border-r border-foreground/20" />

        {/* Hero Text */}
        <div className="relative z-10 text-center px-4">
          <h1 className="hero-line font-display italic text-[10vw] md:text-[9vw] leading-[0.95] text-foreground">
            Your Vision
          </h1>
          <h1 className="hero-line font-display font-bold text-[14vw] md:text-[13vw] leading-[0.9] text-foreground mt-2">
            Our Lens
          </h1>
          <p className="hero-line font-body font-light text-[3vw] md:text-[2vw] text-muted uppercase tracking-[0.4em] mt-6">
            Perfect Results
          </p>
        </div>

        {/* Scroll Indicator */}
        {scrollVisible && (
          <div className="scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <span className="font-body font-light text-[10px] text-muted uppercase tracking-[0.3em] writing-mode-vertical" style={{ writingMode: "vertical-rl" }}>
              Scroll
            </span>
            <div className="w-px h-8 bg-muted/50 animate-pulse" />
          </div>
        )}

        {/* CTAs */}
        <div className="absolute bottom-10 right-6 md:right-10 flex items-center gap-6 z-10">
          <Link to="/work" className="underline-draw font-body font-light text-xs text-foreground/80 uppercase tracking-[0.1em] flex items-center gap-2">
            View Our Work <ArrowRight className="w-3 h-3" />
          </Link>
          <Link to="/contact" className="border border-foreground/40 rounded-full px-5 py-2.5 font-body text-xs uppercase tracking-[0.1em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300">
            Book a Session
          </Link>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee />

      {/* SIGNATURE REEL */}
      <section className="py-24 md:py-32 px-6 md:px-10 overflow-hidden">
        <div className="reveal-up text-center mb-16">
          <p className="font-display italic text-2xl md:text-4xl text-foreground leading-relaxed">
            "We Don't Just Capture. We Compose."
          </p>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
          {projects.map((p, i) => (
            <div key={i} className="snap-start shrink-0 w-[280px] md:w-[350px] group relative">
              <div className="aspect-[3/4] overflow-hidden bg-charcoal">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:sepia-[0.2] group-hover:scale-105 transition-all duration-700"
                  loading="lazy"
                />
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full border border-foreground/30 flex items-center justify-center font-display text-xs text-foreground/60">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="font-body font-semibold text-sm text-foreground">{p.name}</p>
                <p className="font-display italic text-xs text-muted">{p.category}</p>
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
            <p className="reveal-child font-body font-light text-xs text-muted uppercase tracking-[0.2em] mb-4">Founded in Kolkata</p>
            <h2 className="reveal-child font-display text-3xl md:text-4xl text-foreground leading-tight mb-6">
              A Studio Built on Obsession with Light, Story & Detail.
            </h2>
            <p className="reveal-child font-body font-light text-base text-muted-foreground leading-relaxed mb-4">
              The Twenty-One was born from a singular belief: that every frame holds the power to tell a story that transcends the ordinary. Founded by Kingshuk in the heart of Kolkata, we bring an obsessive attention to light, composition, and narrative.
            </p>
            <p className="reveal-child font-body font-light text-base text-muted-foreground leading-relaxed mb-8">
              From intimate weddings to bold brand campaigns, we approach every project as a canvas waiting for its defining moment.
            </p>
            <Link to="/about" className="reveal-child underline-draw font-body font-light text-sm text-foreground uppercase tracking-[0.1em] inline-flex items-center gap-2">
              Meet the Studio <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="reveal-up font-display italic text-[8vw] md:text-[6vw] text-foreground">What We Do</h2>
            <div className="rule-draw w-32 h-px bg-muted/40 mx-auto mt-6 origin-center" />
          </div>
          <div className="reveal-stagger grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map(s => (
              <div key={s.num} className="reveal-child service-card group p-8 md:p-10 bg-background hover:bg-charcoal transition-colors duration-500 border border-border/20">
                <span className="font-display text-[4vw] md:text-[3vw] text-muted/30 block mb-4">{s.num}</span>
                <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mb-3">{s.name}</h3>
                <p className="font-body font-light text-sm text-muted-foreground mb-6">{s.desc}</p>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity font-body text-sm text-foreground">↗</span>
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
                  <span className="stat-number font-display font-bold text-[10vw] md:text-[5vw] text-foreground" data-target={s.num}>
                    0
                  </span>
                  <span className="font-display font-bold text-[6vw] md:text-[3vw] text-foreground">{s.suffix}</span>
                </div>
                <p className="font-body font-light text-xs text-muted uppercase tracking-[0.15em] mt-2">{s.label}</p>
              </div>
              {i < stats.length - 1 && <div className="stat-divider hidden md:block h-20" />}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="reveal-up font-display italic text-2xl md:text-3xl text-foreground mb-16">Voices of Trust</h2>
          <div className="relative">
            {/* Decorative quote */}
            <span className="absolute -top-8 -left-4 font-display text-[15vw] text-muted/10 leading-none select-none pointer-events-none">"</span>
            <blockquote className="font-display italic text-xl md:text-3xl text-foreground leading-relaxed mb-8 relative z-10">
              {testimonials[testimonialIdx].quote}
            </blockquote>
            <div className="mb-8">
              <p className="font-body font-semibold text-sm text-foreground">{testimonials[testimonialIdx].name}</p>
              <p className="font-body font-light text-xs text-muted">{testimonials[testimonialIdx].role}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTestimonialIdx(i => (i === 0 ? testimonials.length - 1 : i - 1))}
                className="w-10 h-10 border border-border/40 rounded-full flex items-center justify-center hover:border-foreground transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => setTestimonialIdx(i => (i === testimonials.length - 1 ? 0 : i + 1))}
                className="w-10 h-10 border border-border/40 rounded-full flex items-center justify-center hover:border-foreground transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 text-foreground" />
              </button>
              <div className="flex gap-2 ml-4">
                {testimonials.map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === testimonialIdx ? "bg-foreground" : "bg-muted/40"}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-24 md:py-32 px-6 md:px-10 text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="reveal-up font-display italic text-[6vw] md:text-[5vw] text-foreground mb-4">
            Ready to tell your story?
          </h2>
          <p className="reveal-up font-body font-light text-base text-muted mb-10">
            Let's build something unforgettable.
          </p>
          <Link
            to="/contact"
            className="reveal-up inline-block border border-foreground/40 rounded-full px-10 py-4 font-body text-sm uppercase tracking-[0.15em] text-foreground hover:bg-foreground hover:text-background transition-all duration-400"
          >
            Begin Your Project <ArrowRight className="w-4 h-4 inline ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
