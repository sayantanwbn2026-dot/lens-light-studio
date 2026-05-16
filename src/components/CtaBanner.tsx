import { Link } from "react-router-dom";
import { useMagnetic } from "../hooks/useMagnetic";

const CtaBanner = () => {
  const { buttonRef, textRef } = useMagnetic();

  return (
    <section className="cta-banner-section">
      <div className="global-container cta-banner-inner">
        
        {/* Left */}
        <div>
          <div className="cta-banner-overline">
            START A PROJECT
          </div>
          <h2 className="cta-banner-heading">
            <span className="block">Let's make something remarkable.</span>
          </h2>
        </div>

        {/* Right */}
        <div className="cta-banner-btn-wrap">
          <Link
            to="/contact"
            ref={buttonRef as React.RefObject<HTMLAnchorElement>}
            className="cta-pill-btn"
          >
            <span ref={textRef as React.RefObject<HTMLSpanElement>}>Begin Your Project &rarr;</span>
          </Link>
        </div>

      </div>

      <style>{`
        .cta-banner-section {
          background-color: var(--color-accent);
          padding: 80px 0;
          width: 100%;
        }
        .cta-banner-inner {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 40px;
        }
        .cta-banner-overline {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 10px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 10px;
          line-height: 1;
        }
        .cta-banner-heading {
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: clamp(1.8rem, 3.5vw, 3.2rem);
          color: var(--color-white);
          letter-spacing: -0.02em;
          line-height: 1.05;
          margin: 0;
        }
        .cta-banner-btn-wrap {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-left: auto;
        }
        .cta-pill-btn {
          height: 46px;
          padding: 0 28px;
          background-color: var(--color-white);
          color: var(--color-accent);
          font-family: var(--font-sans);
          font-weight: 500;
          font-size: 13px;
          border-radius: var(--radius-pill);
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          transition: background-color 0.25s var(--ease-out), color 0.25s var(--ease-out);
          white-space: nowrap;
        }
        .cta-pill-btn:hover {
          background-color: var(--color-primary);
          color: var(--color-white);
        }
        @media (max-width: 767px) {
          .cta-banner-section { padding: 64px 0; }
          .cta-banner-inner {
            flex-direction: column;
            align-items: flex-start;
          }
          .cta-banner-heading {
            font-size: clamp(1.5rem, 6vw, 2.4rem);
          }
          .cta-banner-btn-wrap {
            margin-left: 0;
            width: 100%;
            margin-top: 28px;
          }
          .cta-pill-btn {
            width: 100%;
            height: 46px;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default CtaBanner;

