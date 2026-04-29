import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Aperture, Award } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data: aboutDataObj, loading: aboutLoading } = useContent('about_content');
  const { data: teamMembers, loading: teamLoading } = useContent('team_members', { column: 'order_index', ascending: true });

  const aboutData = aboutDataObj || {};

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
        <div className="text-center max-w-[900px] w-full">
          {aboutLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="h-4 w-24 mb-6" />
              <Skeleton className="h-12 md:h-16 w-full" />
              <Skeleton className="h-12 md:h-16 w-3/4" />
              <Skeleton className="h-12 md:h-16 w-5/6 hidden" />
            </div>
          ) : (
            <>
              <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-6" style={{ fontWeight: 300, color: "#7A7A7A" }}>— About</p>
              <h1 className="manifesto-line font-body text-[clamp(1.8rem,5vw,4rem)] text-foreground leading-tight" style={{ fontWeight: 500 }}>
                {aboutData.manifesto_line1 || "We Believe Every Frame"}
              </h1>
              <h1 className="manifesto-line font-body text-[clamp(1.8rem,5vw,4rem)] text-foreground leading-tight" style={{ fontWeight: 500 }}>
                {aboutData.manifesto_line2 || "Is a Decision."}
              </h1>
              <h1 className="manifesto-line font-display italic text-[clamp(1.8rem,5vw,4rem)] text-foreground leading-tight mt-2">
                {aboutData.manifesto_line3 || "Every Decision, A Story."}
              </h1>
            </>
          )}
        </div>
      </section>

      {/* Founder Quote — full-width typographic moment */}
      <section className="py-28 md:py-32 px-6 md:px-10">
        <div className="max-w-[1000px] mx-auto text-center">
          {aboutLoading ? (
            <div className="flex flex-col items-center">
              <Skeleton className="h-12 md:h-16 w-full mb-4" />
              <Skeleton className="h-12 md:h-16 w-2/3 mb-8" />
              <Skeleton className="h-4 w-40" />
            </div>
          ) : (
            <>
              <blockquote className="about-reveal font-display italic text-[clamp(1.5rem,3.5vw,3.5rem)] text-foreground leading-relaxed whitespace-pre-wrap">
                {aboutData.founder_quote || '"Photography is not about the camera. It\'s about what you choose to see."'}
              </blockquote>
              <p className="about-reveal font-body font-light text-[12px] text-muted uppercase tracking-[0.2em] mt-8">— {aboutData.founder_name || 'Kingshuk'}, Founder</p>
            </>
          )}
        </div>
      </section>

      {/* Founder Story */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {aboutLoading ? (
            <>
              <Skeleton className="aspect-[3/4] w-full rounded-none" />
              <div className="flex flex-col gap-4">
                <Skeleton className="h-4 w-24 mb-4" />
                <Skeleton className="h-10 w-48 mb-6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </>
          ) : (
            <>
              <div className="about-reveal">
                <div className="aspect-[3/4] overflow-hidden bg-charcoal">
                  <img
                    src={aboutData.founder_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"}
                    alt={`${aboutData.founder_name || 'Kingshuk'} - Founder`}
                    className="w-full h-full object-cover grayscale"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="about-stagger">
                <p className="about-child font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— The Founder</p>
                <h2 className="about-child font-body text-3xl text-foreground leading-tight mb-6" style={{ fontWeight: 500 }}>{aboutData.founder_name || 'Kingshuk'}</h2>
                <div className="about-child font-body font-light text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {aboutData.founder_story || "What began as a personal obsession..."}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Philosophy</p>
          <h2 className="about-reveal font-body text-[clamp(2.2rem,3.5vw,4.5rem)] text-foreground mb-12" style={{ fontWeight: 500 }}>Our Philosophy</h2>
          <div className="about-stagger grid grid-cols-1 md:grid-cols-3 gap-6">
            {aboutLoading ? (
              [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-none w-full" />)
            ) : (
              [1, 2, 3].map(num => {
                const title = aboutData[`philosophy_${num}_title`];
                const body = aboutData[`philosophy_${num}_body`];
                if (!title) return null;
                const IconComp = num === 1 ? Eye : num === 2 ? Aperture : Award;

                return (
                  <div key={title} className="about-child group border border-border/20 p-8 md:p-10 hover:border-foreground/30 hover:-translate-y-2 transition-all duration-500">
                    <IconComp className="w-6 h-6 text-muted mb-6 group-hover:text-foreground transition-colors" strokeWidth={1} />
                    <h3 className="font-body font-medium text-base text-foreground mb-3">{title}</h3>
                    <p className="font-body font-light text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">
          <p className="font-body text-[10px] uppercase tracking-[0.25em] mb-3" style={{ fontWeight: 300, color: "#7A7A7A" }}>— Team</p>
          <h2 className="about-reveal font-body text-[clamp(2.2rem,3.5vw,4.5rem)] text-foreground mb-12" style={{ fontWeight: 500 }}>The Team</h2>
          <div className="about-stagger grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {teamLoading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="w-full">
                  <Skeleton className="aspect-[3/4] w-full rounded-none mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : (
              (teamMembers || []).map((t: any) => (
                <div key={t.id} className="about-child group">
                  <div className="aspect-[3/4] overflow-hidden bg-black mb-4 flex items-center justify-center">
                    {t.photo_url ? (
                      <img
                        src={t.photo_url}
                        alt={t.name}
                        className="w-full h-full object-cover grayscale group-hover:contrast-110 transition-all duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[10px] text-[#5A5A5A] uppercase tracking-widest">No Photo</span>
                    )}
                  </div>
                  <h4 className="font-body font-medium text-sm text-foreground">{t.name}</h4>
                  <p className="font-body font-light text-[11px] text-muted">{t.role}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
