import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const CameraHUD = () => {
  const [iso, setIso] = useState(100);
  const [aperture, setAperture] = useState("f/1.8");
  const [shutter, setShutter] = useState("1/250s");
  const [ev, setEv] = useState("+0.3");
  const [barLevel, setBarLevel] = useState(4);
  const isoRef = useRef<HTMLSpanElement>(null);
  const shutterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const isos = [100, 200, 400, 100, 100, 200];
    const apertures = ["f/1.8", "f/2.0", "f/1.4", "f/1.8", "f/2.8"];
    const shutters = ["1/250s", "1/125s", "1/500s", "1/60s", "1/250s"];
    const evs = ["+0.3", "+0.7", "0.0", "-0.3", "+0.3"];

    const flick = () => {
      const idx = Math.floor(Math.random() * isos.length);
      // Quick flicker
      if (isoRef.current) {
        gsap.to(isoRef.current, { opacity: 0, duration: 0.04, onComplete: () => {
          setIso(isos[idx]);
          gsap.to(isoRef.current, { opacity: 1, duration: 0.08 });
        }});
      }
      if (shutterRef.current) {
        gsap.to(shutterRef.current, { opacity: 0, duration: 0.04, onComplete: () => {
          setShutter(shutters[idx]);
          gsap.to(shutterRef.current, { opacity: 1, duration: 0.08 });
        }});
      }
      setAperture(apertures[idx]);
      setEv(evs[idx]);
      setBarLevel(3 + Math.floor(Math.random() * 4));
    };

    const interval = setInterval(flick, 2000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const bar = "█".repeat(barLevel) + "░".repeat(8 - barLevel);

  return (
    <div className="font-body text-[11px] tracking-wider flex items-center gap-4" style={{ fontWeight: 300, color: "#5A5A5A", fontFamily: '"Inter", monospace' }}>
      <span>ISO</span>
      <span ref={isoRef} className="w-8 inline-block">{iso}</span>
      <span>{aperture}</span>
      <span ref={shutterRef}>{shutter}</span>
      <span className="text-[9px] tracking-normal">{bar}</span>
      <span>EV{ev}</span>
    </div>
  );
};

export default CameraHUD;
