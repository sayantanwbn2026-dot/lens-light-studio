import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WorkGrid from "@/components/WorkGrid";
import { useMagnetic } from "@/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { buttonRef: loadMagRef, textRef: loadTextRef } = useMagnetic<HTMLButtonElement, HTMLSpanElement>();

  useEffect(() => {
    // Animations handled by global ScrollReveal
  }, []);

  return (
    <div ref={ref} style={{ backgroundColor: 'var(--color-off-white)', minHeight: '100vh', paddingTop: 'clamp(80px, 15vh, 160px)', paddingBottom: '120px' }}>
      <WorkGrid isPageHeader={true} />
      
      <div className="container reveal-fade" style={{ display: 'flex', justifyContent: 'center' }}>
        <button className="load-more-btn" ref={loadMagRef}>
          <span ref={loadTextRef}>LOAD MORE</span>
        </button>
      </div>
    </div>
  );
};

export default Work;
