import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDevice } from "../contexts/DeviceContext";

const CustomCursor = () => {
  const { pathname } = useLocation();
  const { isTouchDevice } = useDevice();
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (pathname.startsWith('/admin') || isTouchDevice) return;
    if (typeof window === 'undefined') return;
    const cursor = cursorRef.current;
    const label = labelRef.current;
    if (!cursor || !label) return;

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

    // Cursor label support
    const showLabel = (e: Event) => {
      const el = e.currentTarget as HTMLElement;
      const labelText = el.getAttribute("data-cursor-label");
      if (labelText && label) {
        label.textContent = labelText;
        cursor.classList.add("has-label");
        cursor.classList.remove("hovering");
      }
    };
    const hideLabel = () => {
      if (label) label.textContent = "";
      cursor.classList.remove("has-label");
    };

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
      // Bind cursor label elements
      document.querySelectorAll("[data-cursor-label]").forEach(el => {
        el.addEventListener("mouseenter", showLabel);
        el.addEventListener("mouseleave", hideLabel);
      });
    };

    bindInteractive();
    requestAnimationFrame(raf);

    const observer = new MutationObserver(bindInteractive);
    observer.observe(document.body, { childList: true, subtree: true });

    // Handle fullscreen toggle
    const handleFullscreen = () => {
      const isFs = !!document.fullscreenElement;
      if (cursor) cursor.style.display = isFs ? 'none' : '';
    };
    document.addEventListener('fullscreenchange', handleFullscreen);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mousedown", addClick);
      document.removeEventListener("mouseup", removeClick);
      document.removeEventListener('fullscreenchange', handleFullscreen);
      observer.disconnect();
    };
  }, [pathname]);

  if (pathname.startsWith('/admin') || isTouchDevice) return null;

  return (
    <div ref={cursorRef} className="custom-cursor hidden md:block">
      <span ref={labelRef} className="cursor-label" />
    </div>
  );
};

export default CustomCursor;