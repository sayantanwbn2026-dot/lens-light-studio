import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroSection from "@/components/HeroSection";
import ServicesList from "@/components/ServicesList";
import WorkGrid from "@/components/WorkGrid";
import AboutTeaser from "@/components/AboutTeaser";
import StatsBar from "@/components/StatsBar";
import { VideoScrollHero } from "@/components/ui/video-scroll-hero";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { Skeleton } from "@/components/ui/skeleton";

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);

  const { data: projects, loading: projectsLoading } = useContent('work_projects', { column: 'order_index', ascending: true });
  const { data: services, loading: servicesLoading } = useContent('services', { column: 'order_index', ascending: true });
  const { data: heroData } = useContent('hero_content');

  useEffect(() => {
    // Local GSAP logic has been migrated to global initScrollReveal()
  }, []);

  return (
    <div ref={containerRef}>
      <HeroSection />

      {/* VIDEO SCROLL HERO — uses scroll_video_* fields, falls back to hero_video_* for backwards compat */}
      {(() => {
        const scrollEnabled = heroData?.scroll_video_enabled ?? heroData?.hero_video_enabled;
        const scrollUrl = heroData?.scroll_video_url ?? heroData?.hero_video_url;
        const scrollPoster = heroData?.scroll_video_thumbnail_url ?? heroData?.hero_video_thumbnail_url;
        return scrollEnabled && scrollUrl ? (
          <VideoScrollHero
            videoSrc={scrollUrl}
            posterSrc={scrollPoster || undefined}
          />
        ) : null;
      })()}

      {/* WORK PREVIEW SECTION */}
      <section className="section-padding bg-[var(--color-off-white)]">
        <WorkGrid limit={3} featuredOnly={true} />
      </section>

      {/* ABOUT TEASER */}
      <AboutTeaser />

      {/* SERVICES */}
      <section className="section-padding bg-[var(--color-white)]">
        <div className="global-container">
          <div className="flex justify-between items-end mb-12">
            <div>
              <div className="reveal-label font-medium text-[10px] text-[var(--color-accent)] tracking-[0.1em] uppercase mb-[10px] flex items-center">
                <span className="label-dot w-[6px] h-[6px] bg-[#E8500A] rounded-full mr-2"></span>
                <span className="label-text">WHAT WE DO</span>
              </div>
              <h2 className="font-medium text-3xl text-[var(--color-primary)] m-0 leading-[1.1]">
                <span className="block">Our Services</span>
              </h2>
            </div>
            <Link to="/services" className="font-normal text-[13px] text-[var(--color-secondary)] no-underline transition-colors duration-200 hover:text-[var(--color-accent)] mb-1">
              View all services &rarr;
            </Link>
          </div>
          
          <ServicesList />
        </div>
      </section>

      {/* STATS */}
      <StatsBar />

    </div>
  );
};

export default Index;
