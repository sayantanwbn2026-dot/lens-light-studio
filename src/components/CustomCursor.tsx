import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const raf = () => {
      if (!cursor) return;
      curX += (mouseX - curX) * 0.18;
      curY += (mouseY - curY) * 0.18;
      cursor.style.left = `${curX}px`;
      cursor.style.top = `${curY}px`;
      requestAnimationFrame(raf);
    };

    const addHover = () => cursor?.classList.add("hovering");
    const removeHover = () => cursor?.classList.remove("hovering");
    const addClick = () => cursor?.classList.add("clicking");
    const removeClick = () => cursor?.classList.remove("clicking");
    const addCrosshair = () => { cursor.classList.add("crosshair"); cursor.classList.remove("hovering"); };
    const removeCrosshair = () => cursor.classList.remove("crosshair");

    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", addClick);
    document.addEventListener("mouseup", removeClick);

    const bindInteractive = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach(el => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
      document.querySelectorAll("img").forEach(el => {
        el.addEventListener("mouseenter", addCrosshair);
        el.addEventListener("mouseleave", removeCrosshair);
      });
    };

    bindInteractive();
    requestAnimationFrame(raf);

    const observer = new MutationObserver(bindInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", addClick);
      document.removeEventListener("mouseup", removeClick);
      observer.disconnect();
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor hidden md:block" />;
};

export default CustomCursor;