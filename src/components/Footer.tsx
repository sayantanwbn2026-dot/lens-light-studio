import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import WorkingOnTicker from "./WorkingOnTicker";
import CtaBanner from "./CtaBanner";
import { useContent } from "@/hooks/useContent";
import { Instagram, Linkedin, Youtube } from "lucide-react";
import { SiteSettings } from "@/types/database";

interface MarqueeLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  children: React.ReactNode;
}

/* R5: Footer marquee link sub-component */
const MarqueeLink = ({ to, href, children, style, ...rest }: MarqueeLinkProps) => {
  const Tag = to ? Link : 'a';
  const props = to ? { to, ...rest } : { href, ...rest };
  return (
    <Tag
      className="footer-marquee-link no-underline"
      style={{
        ...style,
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--weight-light)',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.55)',
        lineHeight: 2,
        textDecoration: 'none',
        display: 'block',
        overflow: 'hidden',
        position: 'relative' as const,
        height: '26px',
      }}
      {...props}
    >
      <span className="footer-marquee-link__inner">
        <span className="footer-marquee-link__text">{children}</span>
        <span className="footer-marquee-link__text" style={{ display: 'block' }} aria-hidden="true">{children}</span>
      </span>
    </Tag>
  );
};

/* S4: Exploding email sub-component */
const ExplodingEmail = ({ email, href }: { email: string; href: string }) => {
  const containerRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.email-char');
    gsap.to(chars, {
      y: -4,
      rotation: () => (Math.random() - 0.5) * 16,
      color: 'var(--color-accent)',
      duration: 0.4,
      stagger: 0.02,
      ease: 'power2.out',
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.email-char');
    gsap.to(chars, {
      y: 0,
      rotation: 0,
      color: 'rgba(255, 255, 255, 0.7)',
      duration: 0.4,
      stagger: 0.02,
      ease: 'power2.out',
    });
  }, []);

  return (
    <a
      ref={containerRef}
      href={href}
      className="no-underline"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 'var(--weight-regular)',
        fontSize: '13px',
        color: 'rgba(255, 255, 255, 0.7)',
        textDecoration: 'none',
        display: 'inline-flex',
        whiteSpace: 'nowrap',
      }}
    >
      {email.split('').map((char, i) => (
        <span
          key={i}
          className="email-char"
          style={{
            display: 'inline-block',
            transition: 'color 0.15s',
            willChange: 'transform',
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </a>
  );
};

const Footer = () => {
  const { data: settings } = useContent<SiteSettings>('site_settings');

  return (
    <>
      <CtaBanner />
      <WorkingOnTicker />
      <footer className="site-footer">
        <div className="global-container">
          
          {/* Top Section: Responsive Grid */}
          <div className="reveal-stagger footer-grid">
            
            {/* Column 1: Brand */}
            <div className="footer-col footer-brand stagger-item">
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '14px', color: 'var(--color-white)', letterSpacing: '0.1em', marginBottom: '16px' }}>
                THE TWENTY-ONE
              </div>
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '12px', color: 'rgba(255, 255, 255, 0.4)', lineHeight: 1.65, marginBottom: '24px' }}>
                {settings?.studio_address || "Creative Studio"}
              </div>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="Instagram">
                    <Instagram size={18} strokeWidth={1.5} />
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="LinkedIn">
                    <Linkedin size={18} strokeWidth={1.5} />
                  </a>
                )}
                {settings?.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noreferrer" className="footer-social-icon" aria-label="YouTube">
                    <Youtube size={18} strokeWidth={1.5} />
                  </a>
                )}
              </div>
            </div>

            {/* Column 2: Navigation — hidden on mobile, merged into links */}
            <div className="footer-col footer-nav stagger-item">
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', lineHeight: 1 }}>
                NAVIGATE
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {["Work", "Services", "About", "Contact"].map(l => (
                  <MarqueeLink key={l} to={`/${l.toLowerCase()}`}>{l}</MarqueeLink>
                ))}
              </div>
            </div>


            {/* Mobile-only merged LINKS section */}
            <div className="footer-col footer-links-mobile stagger-item">
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', lineHeight: 1 }}>
                LINKS
              </div>
              <div className="footer-links-mobile-grid">
                {["Work", "Services", "About", "Contact"].map((item) => (
                  <MarqueeLink key={item} to={`/${item.toLowerCase()}`}>{item}</MarqueeLink>
                ))}
              </div>
            </div>

            {/* Column 4: Contact */}
            <div className="footer-col footer-contact stagger-item">
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '9px', color: 'rgba(255, 255, 255, 0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', lineHeight: 1 }}>
                GET IN TOUCH
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px', marginBottom: '24px' }}>
                <ExplodingEmail
                  email={settings?.studio_email || 'hello@thetwentyone.in'}
                  href={`mailto:${settings?.studio_email || 'hello@thetwentyone.in'}`}
                />
                <a href={`tel:${settings?.studio_phone || '+919876543210'}`} style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: '13px', color: 'rgba(255, 255, 255, 0.7)', textDecoration: 'none', transition: 'color 0.15s var(--ease-out)' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-white)'} onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}>
                  {settings?.studio_phone || '+91 98765 43210'}
                </a>
              </div>
              <Link to="/contact" className="footer-book-btn" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '34px',
                padding: '0 24px',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-accent)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 'var(--weight-medium)',
                fontSize: '11px',
                borderRadius: 'var(--radius-pill)',
                textDecoration: 'none',
                transition: 'background-color 0.25s var(--ease-out), color 0.25s var(--ease-out)'
              }}>
                Book a Session &rarr;
              </Link>
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '44px 0 20px 0' }} />

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)' }}>
              {settings?.footer_copyright || `© ${new Date().getFullYear()} The Twenty-One. All rights reserved.`}
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '11px', color: 'rgba(255, 255, 255, 0.3)' }}>
              {settings?.footer_tagline?.replace('in Kolkata', '').trim() || "Crafted with obsession."}
            </div>
          </div>

        </div>
      </footer>

      <style>{`
        .footer-social-icon {
          color: rgba(255, 255, 255, 0.4);
          transition: all 0.3s var(--ease-out);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-social-icon:hover {
          color: var(--color-white);
          transform: translateY(-2px);
        }
        .footer-book-btn:hover {
          background-color: var(--color-primary) !important;
          color: var(--color-white) !important;
          border: 1px solid var(--color-white);
        }

        /* R5: Marquee link hover effect */
        .footer-marquee-link__inner {
          display: flex;
          flex-direction: column;
          transition: transform 0.3s var(--ease-out);
        }
        .footer-marquee-link__text {
          display: block;
          height: 26px;
          line-height: 26px;
          white-space: nowrap;
        }
        .footer-marquee-link:hover .footer-marquee-link__inner {
          transform: translateY(-26px);
        }
        @media (max-width: 767px) {
          .footer-marquee-link__inner {
            transform: none !important;
          }
          .footer-marquee-link__text:nth-child(2) {
            display: none !important;
          }
        }
        .footer-marquee-link:hover {
          color: var(--color-white);
        }

        /* Footer layout */
        .site-footer {
          background-color: #000000;
          padding-top: 64px;
          padding-bottom: 36px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }
        .footer-links-mobile { display: none; }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        /* Tablet: 2×2 */
        @media (max-width: 1023px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 40px 32px;
          }
          .footer-links-mobile { display: none; }
        }
        /* Mobile: single col */
        @media (max-width: 767px) {
          .site-footer {
            padding-top: 48px;
            padding-bottom: 28px;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          /* Hide separate nav and services cols, show merged links */
          .footer-nav { display: none; }
          .footer-services { display: none; }
          .footer-links-mobile { display: block; }
          .footer-links-mobile-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4px 16px;
          }
          /* Contact comes last */
          .footer-contact { order: 10; }
          .footer-bottom {
            flex-direction: column;
            text-align: center;
            align-items: center;
            gap: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Footer;