import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";

/**
 * Magnetic hover effect for buttons.
 * Tracks mouse within a radius and displaces the button + inner text independently.
 * Desktop only (pointer: fine).
 */
export function useMagnetic<T extends HTMLElement = HTMLElement, U extends HTMLElement = HTMLElement>(
  radius = 70,
  maxX = 18,
  maxY = 12,
  innerMaxX = 8,
  innerMaxY = 6
) {
  const buttonRef = useRef<T>(null);
  const textRef = useRef<U>(null);

  const isDesktop = useCallback(() => {
    return typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  }, []);

  useEffect(() => {
    if (!isDesktop()) return;
    const btn = buttonRef.current;
    if (!btn) return;

    const txt = textRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const factor = 1 - dist / radius; // 1 at center, 0 at edge
        const bx = Math.max(-maxX, Math.min(maxX, dx * 0.35 * factor));
        const by = Math.max(-maxY, Math.min(maxY, dy * 0.35 * factor));
        gsap.to(btn, { x: bx, y: by, duration: 0.4, ease: "power3" });

        if (txt) {
          const tx = Math.max(-innerMaxX, Math.min(innerMaxX, dx * 0.15 * factor));
          const ty = Math.max(-innerMaxY, Math.min(innerMaxY, dy * 0.15 * factor));
          gsap.to(txt, { x: tx, y: ty, duration: 0.4, ease: "power3" });
        }
      } else {
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
        if (txt) gsap.to(txt, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      }
    };

    const onMouseLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
      if (txt) gsap.to(txt, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    };

    window.addEventListener("mousemove", onMouseMove);
    btn.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      btn.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [radius, maxX, maxY, innerMaxX, innerMaxY, isDesktop]);

  return { buttonRef, textRef };
}
