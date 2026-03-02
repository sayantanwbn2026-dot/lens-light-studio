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
      // Manifesto lines
      gsap.from(".manifesto-line", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1,
        stagger: 0.4,
        ease: "power3.out",
        scrollTrigger: { trigger: ".manifesto-section", start: "top 60%" },
      });

      // General reveals
      gsap.utils.toArray<HTMLElement>(".about-reveal").forEach(el => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 85%" },
          y: 50, opacity: 0, duration: 0.8, ease: "power3.out",
        });
      });

      // Staggered
      gsap.utils.toArray<HTMLElement>(".about-stagger").forEach(container => {
        gsap.from(container.querySelectorAll(".about-child"), {
          scrollTrigger: { trigger: container, start: "top 80%" },
          y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
        });
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen">
      {/* Manifesto */}
      <section className="manifesto-section h-screen flex items-center justify-center px-6 md:px-10">
        <div className="text-center max-w-[900px]">
          <h1 className="manifesto-line font-display italic text-[6vw] md:text-[5vw] text-foreground leading-tight">
            We Believe Every Frame
          </h1>
          <h1 className="manifesto-line font-display italic text-[6vw] md:text-[5vw] text-foreground leading-tight">
            Is a Decision.
          </h1>
          <h1 className="manifesto-line font-display italic text-[6vw] md:text-[5vw] text-foreground leading-tight">
            Every Decision, A Story.
          </h1>
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
          <div className="relative">
            {/* Pull quote */}
            <p className="absolute -top-8 left-0 right-0 font-display italic text-[3vw] text-muted/10 leading-tight select-none pointer-events-none hidden md:block">
              "Photography is not about the camera. It's about what you choose to see."
            </p>
            <div className="about-stagger relative z-10">
              <p className="about-child font-body font-light text-xs text-muted uppercase tracking-[0.2em] mb-4">The Founder</p>
              <h2 className="about-child font-display text-3xl md:text-4xl text-foreground leading-tight mb-6">Kingshuk</h2>
              <p className="about-child font-body font-light text-base text-muted-foreground leading-relaxed mb-4">
                What began as a personal obsession with light and composition became The Twenty-One — a creative media agency rooted in the cultural richness of Kolkata and driven by an uncompromising standard of visual excellence.
              </p>
              <p className="about-child font-body font-light text-base text-muted-foreground leading-relaxed mb-4">
                Kingshuk founded the studio with a clear vision: to create imagery that doesn't just document moments, but transforms them into lasting narratives. With a background in fine arts and a deep appreciation for cinematic storytelling, he leads every project with the belief that great photography is an act of deliberate composition.
              </p>
              <p className="about-child font-body font-light text-base text-muted-foreground leading-relaxed">
                Today, The Twenty-One serves brands, corporations, and families across India — always with the same founding ethos: obsess over every detail, honor the story, deliver the extraordinary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="about-reveal font-display italic text-3xl md:text-4xl text-foreground mb-16">Our Philosophy</h2>
          <div className="about-stagger grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophy.map(p => (
              <div key={p.title} className="about-child group border border-border/20 p-8 md:p-10 hover:border-foreground/40 hover:-translate-y-2 transition-all duration-500">
                <p.icon className="w-8 h-8 text-muted mb-6 group-hover:text-foreground transition-colors" strokeWidth={1} />
                <h3 className="font-display text-xl text-foreground mb-4">{p.title}</h3>
                <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="about-reveal font-display italic text-3xl md:text-4xl text-foreground mb-16">The Team</h2>
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
                <h4 className="font-display text-base text-foreground group-hover:underline transition-all">{t.name}</h4>
                <p className="font-body font-light text-xs text-muted">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
