import { useEffect, useRef } from "react";

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const raf = () => {
      curX += (mouseX - curX) * 0.15;
      curY += (mouseY - curY) * 0.15;
      cursor.style.left = `${curX}px`;
      cursor.style.top = `${curY}px`;
      requestAnimationFrame(raf);
    };

    const addHover = () => cursor.classList.add("hovering");
    const removeHover = () => cursor.classList.remove("hovering");
    const addClick = () => cursor.classList.add("clicking");
    const removeClick = () => cursor.classList.remove("clicking");
    const addCrosshair = () => { cursor.classList.add("crosshair"); cursor.classList.remove("hovering"); };
    const removeCrosshair = () => cursor.classList.remove("crosshair");

    document.addEventListener("mousemove", move);
    document.addEventListener("mousedown", addClick);
    document.addEventListener("mouseup", removeClick);

    const interactiveEls = document.querySelectorAll("a, button, [role='button'], input, textarea, select");
    interactiveEls.forEach(el => {
      el.addEventListener("mouseenter", addHover);
      el.addEventListener("mouseleave", removeHover);
    });

    const imgEls = document.querySelectorAll("img");
    imgEls.forEach(el => {
      el.addEventListener("mouseenter", addCrosshair);
      el.addEventListener("mouseleave", removeCrosshair);
    });

    requestAnimationFrame(raf);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", addClick);
      document.removeEventListener("mouseup", removeClick);
      interactiveEls.forEach(el => {
        el.removeEventListener("mouseenter", addHover);
        el.removeEventListener("mouseleave", removeHover);
      });
      imgEls.forEach(el => {
        el.removeEventListener("mouseenter", addCrosshair);
        el.removeEventListener("mouseleave", removeCrosshair);
      });
    };
  }, []);

  // Re-bind on route changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const cursor = cursorRef.current;
      if (!cursor) return;
      const addHover = () => cursor.classList.add("hovering");
      const removeHover = () => cursor.classList.remove("hovering");
      const addCrosshair = () => { cursor.classList.add("crosshair"); cursor.classList.remove("hovering"); };
      const removeCrosshair = () => cursor.classList.remove("crosshair");

      document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach(el => {
        el.addEventListener("mouseenter", addHover);
        el.addEventListener("mouseleave", removeHover);
      });
      document.querySelectorAll("img").forEach(el => {
        el.addEventListener("mouseenter", addCrosshair);
        el.addEventListener("mouseleave", removeCrosshair);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return <div ref={cursorRef} className="custom-cursor hidden md:block" />;
};

export default CustomCursor;
