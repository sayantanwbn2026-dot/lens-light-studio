import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const ApertureRing = () => {
  const ringRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!ringRef.current) return;
    // Slow rotation
    const anim = gsap.to(ringRef.current, {
      rotation: 360,
      duration: hovered ? 75 : 150, // 0.4 RPM normal, 0.8 on hover
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });
    return () => { anim.kill(); };
  }, [hovered]);

  // Blade breathing via CSS
  useEffect(() => {
    const blades = ringRef.current?.querySelectorAll(".blade");
    if (!blades) return;
    const anim = gsap.to(blades, {
      scaleX: 0.85,
      scaleY: 0.85,
      duration: 3,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "50% 100%",
    });
    return () => { anim.kill(); };
  }, []);

  const bladeCount = 8;
  const blades = Array.from({ length: bladeCount }, (_, i) => {
    const angle = (360 / bladeCount) * i;
    return (
      <line
        key={i}
        className="blade"
        x1="160" y1="60" x2="160" y2="110"
        stroke="white"
        strokeWidth="0.5"
        opacity={hovered ? 0.3 : 0.12}
        transform={`rotate(${angle} 160 160)`}
        style={{ transition: "opacity 0.5s" }}
      />
    );
  });

  return (
    <svg
      ref={ringRef}
      width="320"
      height="320"
      viewBox="0 0 320 320"
      fill="none"
      className="pointer-events-auto"
      style={{ opacity: hovered ? 0.3 : 0.12, transition: "opacity 0.5s" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <circle cx="160" cy="160" r="140" stroke="white" strokeWidth="0.5" fill="none" />
      <circle cx="160" cy="160" r="100" stroke="white" strokeWidth="0.3" fill="none" opacity="0.5" />
      {blades}
    </svg>
  );
};

export default ApertureRing;
