import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "../hooks/useContent";
import { Skeleton } from "./ui/skeleton";
import { initScrollReveal } from "../lib/scrollReveal";
import { Service } from "@/types/database";
import "./ServicesList.css";

gsap.registerPlugin(ScrollTrigger);

interface ServicesListProps {
  showFullDescription?: boolean;
}

const ServicesList = ({ showFullDescription = false }: ServicesListProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: services, loading } = useContent<Service[]>('services', { column: 'order_index', ascending: true });

  useEffect(() => {
    if (!loading && services) {
      const timer = setTimeout(() => {
        initScrollReveal();
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, services]);

  if (loading) {
    return (
      <div className="services-list-container">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-12 border-b border-[var(--color-border)] flex flex-col gap-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="services-list-container" ref={containerRef}>
      {(services || []).map((service: Service, index: number) => {
        const numLabel = service.number_label || String(index + 1).padStart(2, '0');
        
        return (
          <Link to="/contact" key={service.id} className="service-row stagger-item" data-cursor-label={(service.title || '').split(' ')[0].toUpperCase().slice(0, 6)}>
            <div className="service-row-bg" />
            <div className="service-row-border" />
            
            {/* Index */}
            <div className="service-index">{numLabel}</div>
            
            {/* Title & Desc */}
            <div className="service-info">
              <h3 className="service-title">{service.title}</h3>
              <p className={`service-desc ${showFullDescription ? 'expanded' : ''}`}>
                {showFullDescription ? (service.full_description || service.description) : service.description}
              </p>
            </div>
            
            {/* Deliverables */}
            <div className="service-deliverables">
              {(service.deliverables || []).map((d: string) => (
                <span key={d} className="deliverable-pill">{d}</span>
              ))}
            </div>
            
            {/* CTA */}
            <div className="service-cta-col">
              <span className="service-cta">
                ENQUIRE <span className="service-cta-arrow">→</span>
              </span>
            </div>

            {/* Hover Media */}
            {(service.media_type === 'video' && service.video_url) ? (
              <div className="service-hover-img-container">
                <video 
                  src={service.video_url} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="service-hover-img"
                />
              </div>
            ) : service.image_url ? (
              <div className="service-hover-img-container">
                <img src={service.image_url} alt={service.title} loading="lazy" className="service-hover-img" />
              </div>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
};

export default ServicesList;
