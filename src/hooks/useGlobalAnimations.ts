import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useGlobalAnimations = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Wait a tick for DOM to render after route change
    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Individual reveals
        gsap.utils.toArray<HTMLElement>(".reveal:not(.reveal-child)").forEach(el => {
          gsap.fromTo(el,
            { clipPath: "inset(0 0 100% 0)" },
            { 
              clipPath: "inset(0 0 0% 0)", 
              duration: 0.9, 
              ease: "expo.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                once: true
              }
            }
          );
        });

        // Group reveals
        gsap.utils.toArray<HTMLElement>(".reveal-group").forEach(group => {
          gsap.fromTo(group.querySelectorAll(".reveal-child"),
            { clipPath: "inset(0 0 100% 0)" },
            { 
              clipPath: "inset(0 0 0% 0)", 
              duration: 0.9, 
              ease: "expo.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: group,
                start: "top 85%",
                once: true
              }
            }
          );
        });

        // Body text paragraphs
        gsap.utils.toArray<HTMLElement>("p:not(.no-reveal)").forEach(el => {
          // Skip paragraphs inside specialized sections that have their own animations
          if (el.closest('.anim-text') || el.closest('.about-stagger') || el.closest('.contact-reveal')) return;
          
          gsap.fromTo(el,
            { y: 12, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.7, 
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true
              }
            }
          );
        });

        // R9: Section label entrance animations (.label-accent)
        gsap.utils.toArray<HTMLElement>(".label-accent").forEach(el => {
          const dot = el.querySelector('::before') ? el : el; // pseudo
          gsap.fromTo(el,
            { clipPath: "inset(0 100% 0 0)" },
            {
              clipPath: "inset(0 0% 0 0)",
              duration: 0.5,
              ease: "power2.out",
              delay: 0.3,
              scrollTrigger: {
                trigger: el,
                start: "top 90%",
                once: true
              }
            }
          );
        });

        // Refresh ScrollTrigger
        ScrollTrigger.refresh();
      });

      return () => ctx.revert();
    }, 100); // Small delay to ensure components are mounted

    return () => clearTimeout(timeout);
  }, [pathname]);
};
