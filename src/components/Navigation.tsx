import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";

const navLinks = [
  { label: "Work", path: "/work" },
  { label: "Services", path: "/services" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between h-14 md:h-16">
          {/* Wordmark */}
          <Link to="/" className="font-body font-normal text-[13px] tracking-[0.25em] uppercase text-foreground hover:opacity-70 transition-opacity">
            The Twenty-One
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`underline-draw font-body font-light text-[12px] uppercase tracking-[0.18em] text-muted hover:text-foreground transition-colors ${
                  location.pathname === link.path ? "active text-foreground" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className="ml-2 border border-foreground/40 rounded-full px-5 py-1.5 font-body font-normal text-[12px] uppercase tracking-[0.1em] text-foreground hover:bg-foreground hover:text-background transition-all duration-300"
            >
              Book a Session
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5 relative z-[110]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-foreground transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
            <span className={`w-5 h-px bg-foreground transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[105] bg-background flex flex-col items-center justify-center transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          className="absolute top-4 right-6 z-[110]"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className="font-display italic text-4xl text-foreground hover:opacity-60 transition-opacity"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;