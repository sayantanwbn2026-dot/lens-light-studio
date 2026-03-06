import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Aperture, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const team = [
  { name: "Kingshuk", role: "Founder & Lead Photographer", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },
  { name: "Rina Sen", role: "Creative Director", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80" },
  { name: "Arjun Das", role: "Cinematographer", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80" },
  { name: "Priya Ghosh", role: "Editor & Post-Production", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80" },
];

const philosophy = [
  { icon: Eye, title: "See Differently", desc: "We find beauty in the overlooked, narrative in the mundane, and drama in the quiet moments." },
  { icon: Aperture, title: "Compose Deliberately", desc: "Every element within the frame is intentional — light, shadow, texture, and emotion working in concert." },
  { icon: Award, title: "Deliver Exceptionally", desc: "Our standard is excellence. We don't finish until every frame exceeds expectation." },
];

const About = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".manifesto-line", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1,
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: { trigger: ".manifesto-section", start: "top 60%" },
      });

      gsap.utils.toArray<HTMLElement>(".about-reveal").forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
        });
      });

      gsap.utils.toArray<HTMLElement>(".about-stagger").forEach(container => {
        gsap.from(container.querySelectorAll(".about-child"), {
          scrollTrigger: { trigger: container, start: "top 80%" },
          y: 30, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power3.out",
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen">
      {/* Manifesto */}
      <section className="manifesto-section h-screen flex items-center justify-center px-6 md:px-10 pt-20">
        <div className="text-center max-w-[900px]">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-6" style={{ fontWeight: 300, color: "#7A7A7A" }}>— About</p>
          <h1 className="manifesto-line font-body text-[clamp(1.8rem,5vw,4rem)] text-foreground leading-tight" style={{ fontWeight: 500 }}>
            We Believe Every Frame
          </h1>
          <h1 className="manifesto-line font-body text-[clamp(1.8rem,5vw,4rem)] text-foreground leading-tight" style={{ fontWeight: 500 }}>
            Is a Decision.
          </h1>
          <h1 className="manifesto-line font-display italic text-[clamp(1.8rem,5vw,4rem)] text-foreground leading-tight">
            Every Decision, A Story.
          </h1>
        </div>
      </section>

      {/* Founder Quote — full-width typographic moment */}
      <section className="py-28 md:py-32 px-6 md:px-10">
        <div className="max-w-[1000px] mx-auto text-center">
          <blockquote className="about-reveal font-display italic text-[clamp(1.5rem,3.5vw,3.5rem)] text-foreground leading-relaxed">
            "Photography is not about the camera. It's about what you choose to see."
          </blockquote>
          <p className="about-reveal font-body font-light text-[12px] text-muted uppercase tracking-[0.2em] mt-8">— Kingshuk, Founder</p>
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="about-reveal">
            <div className="aspect-[3/4] overflow-hidden bg-charcoal">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                alt="Kingshuk - Founder"
                className="w-full h-full object-cover grayscale"
                loading="lazy"
              />
            </div>
          </div>
          <div className="about-stagger">
            <p className="about-child font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— The Founder</p>
            <h2 className="about-child font-body text-3xl text-foreground leading-tight mb-6" style={{ fontWeight: 500 }}>Kingshuk</h2>
            <p className="about-child font-body font-light text-base text-muted-foreground leading-relaxed mb-4">
              What began as a personal obsession with light and composition became The Twenty-One — a creative media agency rooted in the cultural richness of Kolkata and driven by an uncompromising standard of visual excellence.
            </p>
            <p className="about-child font-body font-light text-base text-muted-foreground leading-relaxed mb-4">
              Kingshuk founded the studio with a clear vision: to create imagery that doesn't just document moments, but transforms them into lasting narratives.
            </p>
            <p className="about-child font-body font-light text-base text-muted-foreground leading-relaxed">
              Today, The Twenty-One serves brands, corporations, and families across India — always with the same founding ethos: obsess over every detail, honor the story, deliver the extraordinary.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Philosophy</p>
          <h2 className="about-reveal font-body text-[clamp(2.2rem,3.5vw,4.5rem)] text-foreground mb-12" style={{ fontWeight: 500 }}>Our Philosophy</h2>
          <div className="about-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
            {philosophy.map(p => (
              <div key={p.title} className="about-child group border border-border/20 p-8 md:p-10 hover:border-foreground/30 hover:-translate-y-2 transition-all duration-500">
                <p.icon className="w-6 h-6 text-muted mb-6 group-hover:text-foreground transition-colors" strokeWidth={1} />
                <h3 className="font-body font-medium text-base text-foreground mb-3">{p.title}</h3>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Team</p>
          <h2 className="about-reveal font-body text-[clamp(2.2rem,3.5vw,4.5rem)] text-foreground mb-12" style={{ fontWeight: 500 }}>The Team</h2>
          <div className="about-stagger grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {team.map(t => (
              <div key={t.name} className="about-child group">
                <div className="aspect-[3/4] overflow-hidden bg-charcoal mb-4">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-full h-full object-cover grayscale group-hover:contrast-110 transition-all duration-500"
                    loading="lazy"
                  />
                </div>
                <h4 className="font-body font-medium text-sm text-foreground">{t.name}</h4>
                <p className="font-body font-light text-[11px] text-muted">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
