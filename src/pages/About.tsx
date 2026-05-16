import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "@/hooks/useContent";
import { initScrollReveal } from "@/lib/scrollReveal";
import CtaBanner from "@/components/CtaBanner";
import { AboutContent, TeamMember, StatItem } from "@/types/database";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

/* ── Hardcoded process steps (no CMS needed) ── */
const PROCESS_STEPS = [
  {
    num: "01",
    title: "Discovery & Brief",
    desc: "We deep-dive into your brand, audience, and objectives to build a precise creative brief that guides every decision.",
    tag: "Week 1",
  },
  {
    num: "02",
    title: "Creative Direction",
    desc: "Moodboards, shot lists, and location scouting. We plan obsessively so the shoot day is pure execution.",
    tag: "Week 2–3",
  },
  {
    num: "03",
    title: "Production",
    desc: "The shoot itself. Every frame is intentional. We work fast, stay calm, and get what we came for.",
    tag: "Shoot Day",
  },
  {
    num: "04",
    title: "Delivery & Refinement",
    desc: "Edited, graded, and delivered to your exact specification. One round of revisions included as standard.",
    tag: "Week 4–5",
  },
];

const About = () => {
  const pageRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLParagraphElement>(null);

  /* ── Data hooks ── */
  const { data: aboutData, loading: aboutLoading } = useContent<AboutContent>("about_content");
  const { data: teamMembers, loading: teamLoading } = useContent<TeamMember[]>("team_members", { column: "order_index" });
  const { data: stats, loading: statsLoading } = useContent<StatItem[]>("stats", { column: "order_index", ascending: true });

  const about = aboutData || {} as AboutContent;
  
  /* ── Fallback Team Members ── */
  const DEFAULT_TEAM: TeamMember[] = [
    {
      id: "fallback-1",
      name: "Arjun Mehta",
      role: "Lead Cinematographer",
      photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      is_active: true,
      order_index: 0
    },
    {
      id: "fallback-2",
      name: "Sara Khan",
      role: "Post-Production Lead",
      photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
      is_active: true,
      order_index: 1
    },
    {
      id: "fallback-3",
      name: "Vikram Singh",
      role: "Technical Director",
      photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
      is_active: true,
      order_index: 2
    }
  ];

  const activeTeam = (Array.isArray(teamMembers) && teamMembers.length > 0) 
    ? teamMembers.filter((m) => m.is_active !== false) 
    : DEFAULT_TEAM;
    
  const statItems = Array.isArray(stats) ? stats.slice(0, 4) : [];

  /* ── Founder data mapping (with sanitization) ── */
  const sanitizeName = (name: string | undefined | null, fallback: string) => {
    if (!name || name === "Second Founder") return fallback;
    return name.replace(/[!]$/, ""); // Strip trailing !
  };

  const founder1 = {
    name: sanitizeName(about.founder_name, "Kingshuk"),
    title: about.founder_title || "Founder & Creative Director",
    image: about.founder_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    instagram_url: about.founder_instagram_url || null,
  };

  const hasFounder2 = !!about.founder2_name;
  const founder2 = (hasFounder2 && about.founder2_name !== "Second Founder")
    ? {
        name: sanitizeName(about.founder2_name, "Priya Sharma"),
        title: about.founder2_title || "Co-Founder",
        image: (about.founder2_image_url && !about.founder2_image_url.includes('placeholder')) 
          ? about.founder2_image_url 
          : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
        instagram_url: about.founder2_instagram_url || null,
      }
    : {
        name: "Priya Sharma",
        title: "Creative Producer",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
        instagram_url: null,
      };
      
  // Additional sanitization for founder 1
  if (founder1.name === "Kingshuk") founder1.name = "Kingshuk Bhowmick";

  /* ── Manifesto text (for word-by-word animation) ── */
  const manifestoText =
    about.studio_description ||
    "We believe that every photograph is a collaboration between light, intent, and the raw honesty of the moment. Our studio was founded on a single idea — that restraint in craft creates room for emotion. We don't chase trends. We chase truth. And in that pursuit, we've found that the most powerful images are the ones that feel inevitable, as if they were always waiting to be made.";

  const manifestoSubText =
    about.studio_description_sub ||
    "Our studio brings together a small team of obsessive creatives who believe that every frame is a decision, and every decision shapes the story.";

  const studioTagline =
    about.studio_tagline || "A creative media agency obsessed with light, story, and detail.";

  const studioImageUrl = about.studio_image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80";

  /* ═══════════════════════════════════════
     GSAP ANIMATIONS
     ═══════════════════════════════════════ */
  useEffect(() => {
    if (!manifestoRef.current) return;

    const words = manifestoRef.current.querySelectorAll('.word-span');
    
    gsap.fromTo(words, 
      { color: 'var(--color-border)' },
      { 
        color: 'var(--color-primary)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: manifestoRef.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: true,
        }
      }
    );
  }, [aboutLoading]);
  
  useEffect(() => {
    if (!aboutLoading && !teamLoading && !statsLoading) {
      const timer = setTimeout(() => {
        initScrollReveal();
        ScrollTrigger.refresh();
      }, 300); // Increased delay for safety
      return () => clearTimeout(timer);
    }
  }, [aboutLoading, teamLoading, statsLoading]);

  /* ── Loading state ── */
  if (aboutLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-sans)",
          color: "var(--color-muted)",
        }}
      >
        Loading...
      </div>
    );
  }

  /* ═══════════════════════════════════════
     RENDER
     ═══════════════════════════════════════ */
  return (
    <div ref={pageRef}>
      {/* ───────── SECTION 1: PAGE HERO ───────── */}
      <section className="about-hero" data-theme="dark">
        <div className="container">
          <div className="about-hero__meta-row">
            <span className="about-hero__label">ABOUT THE STUDIO</span>
            <span className="about-hero__label"></span>
          </div>

          <div className="about-hero__manifesto">
            <h1 className="about-hero__line about-hero__line--1">
              <span className="block">
                {(about.manifesto_line1 && about.manifesto_line1.trim() !== "" && !about.manifesto_line1.includes('Fram')) 
                  ? about.manifesto_line1.replace(/Framee$/, "Frame") 
                  : "We Believe Every Frame"}
              </span>
            </h1>
            <h1 className="about-hero__line about-hero__line--2">
              <span className="block">{(about.manifesto_line2 && about.manifesto_line2.trim() !== "") ? about.manifesto_line2 : "Is a Decision."}</span>
            </h1>
            <h1 className="about-hero__line about-hero__line--3">
              <span className="block">{(about.manifesto_line3 && about.manifesto_line3.trim() !== "") ? about.manifesto_line3 : "Every Decision, A Story."}</span>
            </h1>
          </div>

          <p className="about-hero__tagline reveal-fade">{studioTagline}</p>
        </div>

        <div className="about-hero__bottom">
          <div className="about-hero__bottom-line" />
          <div className="about-hero__bottom-row">
            <div className="about-hero__scroll-indicator">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle
                  cx="10"
                  cy="10"
                  r="9.5"
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                />
                <circle
                  className="about-scroll-dot"
                  cx="10"
                  cy="7"
                  r="2"
                  fill="rgba(255,255,255,0.4)"
                />
              </svg>
            </div>
            <span className="about-hero__next-label">
              Next: Our Founders ↓
            </span>
          </div>
        </div>
      </section>

      {/* ───────── SECTION 2: STUDIO NUMBERS STRIP ───────── */}
      {!statsLoading && statItems.length > 0 && (
        <section className="about-numbers-strip">
          <div className="container">
            <div className="about-numbers-strip__row">
              {statItems.map((s: StatItem, i: number) => {
                const valStr = s.number_value ? String(s.number_value) : "0";
                const numMatch = valStr.match(/^[\d.]+/);
                const numVal = numMatch ? numMatch[0] : "0";
                const suffix = valStr.replace(/^[\d.]+/, "");

                return (
                  <div key={s.id || i} style={{ display: "contents" }}>
                    <div className="about-numbers-strip__item">
                      <div className="about-numbers-strip__value">
                        <span className="about-numbers-strip__number">
                          {numVal}
                        </span>
                        {suffix && (
                          <span className="about-numbers-strip__suffix">
                            {suffix}
                          </span>
                        )}
                      </div>
                      <span className="about-numbers-strip__label">
                        {s.label}
                      </span>
                    </div>
                    {i < statItems.length - 1 && (
                      <div className="about-numbers-strip__divider" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ───────── SECTION 3: MANIFESTO ───────── */}
      <section className="about-manifesto">
        <div className="container">
          <div className="about-manifesto__inner">
            <div className="label-accent">OUR BELIEF</div>

            <p className="about-manifesto__large-text" ref={manifestoRef}>
              {manifestoText.split(" ").map((word: string, i: number) => (
                <span key={i}>
                  <span className="word-span">{word}</span>{" "}
                </span>
              ))}
            </p>

            <p className="about-manifesto__sub-text">
              {manifestoSubText}
            </p>
          </div>
        </div>
      </section>

      {/* ───────── SECTION 4: DUAL FOUNDER SECTION ───────── */}
      <section className="about-founders">
        <div className="container">
          <div className="about-founders__header">
            <div className="label-accent">THE FOUNDERS</div>
            <h2 className="about-founders__heading"><span className="block">Behind the lens.</span></h2>

          </div>

          <div
            className={`about-founders__grid ${
              !hasFounder2 ? "about-founders__grid--single" : ""
            }`}
          >
            {/* ── Founder 1 ── */}
            <FounderCard founder={founder1} />

            {/* ── Founder 2 (conditional) ── */}
            {founder2 && <FounderCard founder={founder2} />}
          </div>
        </div>
      </section>

      {/* ───────── SECTION 5: PHILOSOPHY PILLARS ───────── */}
      <section className="about-philosophy">
        <div className="container">
          <div className="label-accent">HOW WE WORK</div>

          <div className="about-philosophy__grid">
            {[1, 2, 3].map((num) => {
              const title = about[`philosophy_${num}_title`];
              let body = about[`philosophy_${num}_body`];
              
              if (!title) return null;
              
              // Fallback bodies
              if (!body) {
                if (num === 1) body = "We look past the obvious, finding beauty in the shadows and character in the quiet moments that others might miss.";
                if (num === 2) body = "Every element in our frame has a purpose. We don't just capture; we craft images with intention and technical precision.";
                if (num === 3) body = "Our commitment ends only when the final deliverable exceeds expectations, maintaining consistency and quality at every step.";
              }

              return (
                <div key={num} className="about-philosophy__pillar stagger-item">
                  <div className="about-philosophy__num pillar-anim">
                    0{num}
                  </div>
                  <h3 className="about-philosophy__pillar-title pillar-anim">
                    {title}
                  </h3>
                  <p className="about-philosophy__pillar-body pillar-anim">
                    {body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────── SECTION 6: STUDIO PROCESS (NEW) ───────── */}
      <section className="about-process">
        <div className="container">
          <span className="about-process__label">THE PROCESS</span>
          <h2 className="about-process__heading">
            <span className="block">How we bring your vision to life.</span>
          </h2>

          <div className="about-process__list">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="about-process__step stagger-item">
                <div className="about-process__step-num">{step.num}</div>
                <div>
                  <h3 className="about-process__step-title">{step.title}</h3>
                  <p className="about-process__step-desc">
                    {step.desc}
                  </p>
                </div>
                <div className="about-process__step-tag-col">
                  <span className="about-process__step-tag">{step.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── SECTION 7: TEAM GRID ───────── */}
      {!teamLoading && activeTeam.length > 0 && (
        <section className="about-team">
          <div className="container">
            <div className="label-accent">THE TEAM</div>
            <h2 className="about-team__heading">
              <span className="block">The people behind the work.</span>
            </h2>

            <div className="about-team__grid">
              {activeTeam.map((member: TeamMember) => (
                <div key={member.id} className="about-team__card stagger-item">
                  <div className="about-team__photo-wrapper">
                    {member.photo_url && (
                      <img
                        className="about-team__photo"
                        src={member.photo_url}
                        alt={member.name}
                        loading="lazy"
                        style={{
                          filter: 'grayscale(1)',
                          transition: 'var(--img-transition)',
                        }}
                      />
                    )}
                    {member.instagram_url && (
                      <a
                        className="about-team__ig-link no-underline"
                        href={member.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  <div className="about-team__info">
                    <h4 className="about-team__name">{member.name}</h4>
                    <p className="about-team__role">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ───────── SECTION 8: STUDIO IMAGE (NEW) ───────── */}
      {studioImageUrl && (
        <section className="about-studio-image">
          <img
            className="about-studio-image__img"
            src={studioImageUrl}
            alt="The studio"
            loading="lazy"
            style={{
              filter: 'grayscale(0.2)',
              transition: 'var(--img-transition)',
            }}
          />
          <div className="about-studio-image__overlay" />
          <div className="about-studio-image__text">
            <h2 className="about-studio-image__title">The studio.</h2>
          </div>
        </section>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════
   FOUNDER CARD — Sub-component
   ═══════════════════════════════════════ */
interface FounderData {
  name: string;
  title: string;
  image: string;
  instagram_url: string | null;
}

const FounderCard = ({ founder }: { founder: FounderData }) => (
  <div className="about-founders__card">
    <div className="about-founders__img-wrapper">
      <img
        className="about-founders__img"
        src={founder.image}
        alt={founder.name}
        loading="lazy"
        style={{
          filter: 'grayscale(1)',
          transition: 'var(--img-transition)',
        }}
      />
    </div>

    <div className="about-founders__info-row">
      <div>
        <h3 className="about-founders__name">
          {founder.name}
        </h3>
        <p className="about-founders__title">{founder.title}</p>
      </div>
      <div className="about-founders__social-col">
        {founder.instagram_url && (
          <a
            className="about-founders__ig-pill no-underline"
            href={founder.instagram_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            ↗ Instagram
          </a>
        )}
      </div>
    </div>

  </div>
);

export default About;
