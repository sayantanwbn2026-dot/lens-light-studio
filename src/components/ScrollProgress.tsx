import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        setProgress(window.scrollY / scrollHeight);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-3 top-0 bottom-0 z-[90] flex flex-col items-center pointer-events-none">
      {/* TOP label */}
      <span className="font-body font-light text-[8px] text-muted uppercase tracking-[0.15em] mt-20 mb-2">
        Top
      </span>

      {/* Track */}
      <div className="relative flex-1 w-px bg-muted/20">
        {/* Dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground transition-[top] duration-100 ease-out"
          style={{ top: `${progress * 100}%` }}
        />
      </div>

      {/* END label */}
      <span className="font-body font-light text-[8px] text-muted uppercase tracking-[0.15em] mt-2 mb-20">
        End
      </span>
    </div>
  );
};

export default ScrollProgress;
