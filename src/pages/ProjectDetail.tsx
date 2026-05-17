import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { supabase } from "@/lib/supabase";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Project } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

import { Helmet } from "react-helmet-async";

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data } = await supabase.from('work_projects').select('*').eq('id', id).single();
      setProject(data);
      setLoading(false);
    };
    if (id) fetchProject();
  }, [id]);

  useEffect(() => {
    if (!loading && project) {
      const ctx = gsap.context(() => {
        gsap.from(".proj-anim", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1
        });
      }, ref);
      return () => ctx.revert();
    }
  }, [loading, project]);

  // S3: Gallery scroll tracking
  useEffect(() => {
    if (!galleryRef.current || !project?.gallery_images?.length) return;
    const gallery = galleryRef.current;
    const onScroll = () => {
      const scrollLeft = gallery.scrollLeft;
      const itemWidth = gallery.scrollWidth / project.gallery_images.length;
      const idx = Math.round(scrollLeft / itemWidth);
      setGalleryIndex(Math.min(idx, project.gallery_images.length - 1));
    };
    gallery.addEventListener('scroll', onScroll, { passive: true });
    return () => gallery.removeEventListener('scroll', onScroll);
  }, [project]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-muted" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-muted)' }}>Loading...</div>;
  if (!project) return <div className="min-h-screen flex items-center justify-center text-muted" style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-muted)' }}>Project not found</div>;

  const galleryImages: string[] = Array.isArray(project.gallery_images) ? project.gallery_images : [];

  return (
    <div ref={ref} style={{ backgroundColor: 'var(--color-white)', minHeight: '100vh', paddingBottom: '120px' }}>
      <Helmet>
        <title>{`${project.title} — The Twenty-One`}</title>
        <meta name="description" content={project.description || `Project ${project.title} by The Twenty-One`} />
        <meta property="og:title" content={`${project.title} — The Twenty-One`} />
        <meta property="og:image" content={project.cover_image_url || ''} />
      </Helmet>
      {/* Full-bleed Hero (16:9) */}
      <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', backgroundColor: 'var(--color-surface)', position: 'relative' }}>
        {project.video_type && project.video_type !== 'none' && project.video_url ? (
            <VideoPlayer 
                videoUrl={project.video_url} 
                videoType={project.video_type} 
                coverImage={project.cover_image_url} 
                title={project.title} 
            />
        ) : project.cover_image_url ? (
          <img src={project.cover_image_url} alt={project.title} loading="eager" fetchPriority="high" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-muted)', fontFamily: 'var(--font-sans)' }}>No Image</div>
        )}
      </div>

      <div className="container" style={{ marginTop: '68px' }}>
        <Link to="/work" style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: '12px', color: 'var(--color-secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', marginBottom: '54px' }} className="proj-anim hover:text-primary transition-colors">
          ← Back to Portfolio
        </Link>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-[54px]">
          
          {/* Left 60% (7/12) */}
          <div className="lg:col-span-7 col-span-12">
            <h1 className="proj-anim" style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-headline)', fontSize: 'var(--text-4xl)', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-headline)', lineHeight: 1.1, marginBottom: '34px' }}>
              {project.title}
            </h1>
            <div className="proj-anim" style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '15px', color: 'var(--color-secondary)', lineHeight: 1.65, whiteSpace: 'pre-line', letterSpacing: 'var(--tracking-body)' }}>
              {project.full_description || project.description || "No description provided for this project."}
            </div>
          </div>

          {/* Right 40% (5/12) */}
          <div className="lg:col-span-5 col-span-12">
            <div className="proj-anim" style={{ padding: '34px', backgroundColor: 'var(--color-surface)' }}>
              <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-medium)', fontSize: '13px', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid var(--color-border)', lineHeight: 1.2 }}>
                Project Details
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '17px' }}>
                {project.client_name && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-medium)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', marginBottom: '4px', lineHeight: 1 }}>Client</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '14px', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-body)' }}>{project.client_name}</div>
                  </div>
                )}
                
                {project.category && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-medium)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', marginBottom: '4px', lineHeight: 1 }}>Category</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '14px', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-body)' }}>{project.category}</div>
                  </div>
                )}

                {(project.project_year || project.year) && (
                  <div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-medium)', fontSize: '10px', color: 'var(--color-muted)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', marginBottom: '4px', lineHeight: 1 }}>Year</div>
                    <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '14px', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-body)' }}>{project.project_year || project.year}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* S3: Horizontal Scroll Gallery */}
      {galleryImages.length > 0 && (
        <div style={{ marginTop: '68px' }}>
          <div
            ref={galleryRef}
            style={{
              display: 'flex',
              gap: '2px',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            {galleryImages.map((url: string, i: number) => (
              <div
                key={i}
                style={{
                  flex: '0 0 85vw',
                  height: '70vh',
                  scrollSnapAlign: 'center',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(0.15)',
                    transition: 'var(--img-transition)',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Gallery counter + thumbnail dots */}
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <div style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 'var(--weight-medium)',
              fontSize: '11px',
              color: 'var(--color-muted)',
              letterSpacing: 'var(--tracking-caps)',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {String(galleryIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {galleryImages.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: i === galleryIndex ? '32px' : '24px',
                    backgroundColor: i === galleryIndex ? 'var(--color-accent)' : 'var(--color-border)',
                    borderRadius: '2px',
                    transition: 'all 0.3s var(--ease-out)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    if (!galleryRef.current) return;
                    const itemWidth = galleryRef.current.scrollWidth / galleryImages.length;
                    galleryRef.current.scrollTo({ left: itemWidth * i, behavior: 'smooth' });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
