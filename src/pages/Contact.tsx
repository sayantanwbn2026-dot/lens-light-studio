import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useContent } from "@/hooks/useContent";
import { initScrollReveal } from "@/lib/scrollReveal";
import { supabase } from "@/lib/supabase";
import { SiteSettings } from "@/types/database";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { data: rawSettings } = useContent<SiteSettings>('site_settings');
  const settings = rawSettings || {};

  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectOpen, setSelectOpen] = useState(false);

  const services = ["Brand Campaigns", "Corporate Shoots", "Wedding Coverage", "Traditional Coverages"];

  useEffect(() => {
    // Animations handled by global ScrollReveal
  }, []);
  
  useEffect(() => {
    // Small delay to ensure any dynamic content from SiteSettings is in DOM
    const timer = setTimeout(() => {
      initScrollReveal();
      ScrollTrigger.refresh();
    }, 200);
    return () => clearTimeout(timer);
  }, [rawSettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    
    setSubmitting(true);
    setError(null);

    const { error: submitError } = await supabase
      .from('contact_messages')
      .insert([
        { 
          name: form.name,
          email: form.email,
          service: form.service,
          message: form.message,
          status: 'unread'
        }
      ]);

    setSubmitting(false);

    if (submitError) {
      console.error(submitError);
      setError("Failed to send message. Please try again or email us directly.");
      return;
    }

    setSubmitted(true);
    
    // Animate checkmark
    setTimeout(() => {
      gsap.fromTo(".success-check", 
        { strokeDasharray: 50, strokeDashoffset: 50 },
        { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }
      );
    }, 50);
  };

  return (
    <div ref={ref} className="contact-page">
      
      {/* Compact Header Row */}
      <section className="contact-header container">
        <div className="contact-header__left">
          <div className="reveal-label" style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: '10px', color: 'var(--color-accent)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', lineHeight: 1 }}>
            — CONTACT
          </div>
          <h1 style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', fontSize: 'clamp(2rem, 4vw, 3.2rem)', color: 'var(--color-primary)', letterSpacing: '-0.02em', lineHeight: 1.05, margin: 0 }}>
            <span className="block">Let's Talk.</span>
          </h1>
        </div>
      </section>

      {/* Main Grid — Form left, Details right */}
      <section className="contact-body">
        <div className="container">
          <div className="contact-main-grid">
            
            {/* LEFT — Form (primary) */}
            <div className="contact-form-col">
              <div className="contact-form-inner">
                <h3 style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-headline)', fontSize: 'clamp(1rem, 1.6vw, 1.3rem)', color: 'var(--color-primary)', letterSpacing: 'var(--tracking-headline)', marginBottom: '24px', marginTop: 0, lineHeight: 1.1 }}>
                  Start a conversation.
                </h3>
                
                <form onSubmit={handleSubmit}>
                  {/* Two-column row: Name + Email */}
                  <div className="contact-field-row">
                    <div className="contact-field">
                      <label className="contact-field-label">Your Name</label>
                      <input 
                        type="text" 
                        className="custom-input"
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="contact-field">
                      <label className="contact-field-label">Email Address</label>
                      <input 
                        type="email" 
                        className="custom-input"
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Service Custom Select */}
                  <div className="contact-field" style={{ position: 'relative' }}>
                    <label className="contact-field-label">Service</label>
                    <div 
                      className={`custom-input ${selectOpen ? 'focused' : ''}`}
                      style={{ cursor: 'pointer', paddingBottom: '8px', minHeight: '28px' }}
                      onClick={() => setSelectOpen(!selectOpen)}
                    >
                      {form.service || <span style={{ color: 'var(--color-muted)' }}>Select a service...</span>}
                    </div>
                    
                    {selectOpen && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        backgroundColor: 'var(--color-white)',
                        border: '1px solid var(--color-border)',
                        zIndex: 50,
                      }}>
                        {services.map(s => (
                          <div 
                            key={s}
                            className="custom-select-option"
                            onClick={() => { setForm({...form, service: s}); setSelectOpen(false); }}
                            style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '13px', color: 'var(--color-primary)', padding: '10px 16px', cursor: 'pointer', transition: 'background-color 0.2s' }}
                          >
                            {s}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div className="contact-field">
                    <label className="contact-field-label">Tell us about your project</label>
                    <textarea 
                      className="custom-input"
                      rows={3}
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                      required
                      style={{ resize: 'none' }}
                    />
                  </div>

                  {/* Submit */}
                  {!submitted ? (
                    <div className="flex flex-col gap-4">
                      <button 
                        type="submit" 
                        className="form-submit-btn" 
                        disabled={submitting}
                        style={{
                          width: '100%',
                          height: '44px',
                          backgroundColor: submitting ? 'var(--color-muted)' : 'var(--color-primary)',
                          color: 'var(--color-white)',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: 'var(--weight-regular)',
                          fontSize: '12px',
                          letterSpacing: 'var(--tracking-caps)',
                          borderRadius: 'var(--radius-sm)',
                          border: 'none',
                          cursor: submitting ? 'default' : 'pointer',
                          transition: 'background-color 0.25s var(--ease-out)',
                          opacity: submitting ? 0.7 : 1
                        }}
                      >
                        {submitting ? "Sending..." : "Send Message →"}
                      </button>
                      {error && (
                        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#ff4444', margin: 0, textAlign: 'center' }}>
                          {error}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '44px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ marginBottom: '6px' }}>
                        <path className="success-check" d="M20 6L9 17L4 12" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-light)', fontSize: '12px', color: 'var(--color-muted)' }}>
                        Message sent. We'll be in touch.
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* RIGHT — Contact Details (secondary) */}
            <div className="contact-details-col">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {[
                  { label: "PHONE", value: settings.studio_phone || "+91 98765 43210", href: `tel:${settings.studio_phone || '+919876543210'}` },
                  { label: "EMAIL", value: settings.studio_email || "hello@thetwentyone.in", href: `mailto:${settings.studio_email || 'hello@thetwentyone.in'}` },
                  { label: "ADDRESS", value: settings.studio_address || "Studio Address, India" },
                  { label: "INSTAGRAM", value: "@the.twentyone", href: settings.instagram_url || "#" }
                ].map((item, idx) => (
                  <div key={idx} className="contact-detail-row" style={{ 
                    padding: '16px 0', 
                    borderBottom: '1px solid var(--color-border)',
                    position: 'relative',
                    transition: 'background-color 0.2s var(--ease-out)'
                  }}>
                    <div className="contact-accent-bar" style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '2px',
                      backgroundColor: 'var(--color-accent)',
                      opacity: 0,
                      transform: 'scaleY(0)',
                      transition: 'all 0.2s var(--ease-out)'
                    }} />
                    
                    <div style={{ paddingLeft: '16px' }}>
                      <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-medium)', fontSize: '9px', color: 'var(--color-muted)', letterSpacing: 'var(--tracking-caps)', textTransform: 'uppercase', marginBottom: '4px', lineHeight: 1 }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: '14px', color: 'var(--color-primary)', textDecoration: 'none' }}>
                          {item.value}
                        </a>
                      ) : (
                        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 'var(--weight-regular)', fontSize: '14px', color: 'var(--color-primary)' }}>
                          {item.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`
        .contact-page {
          background-color: var(--color-white);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .contact-header {
          padding-top: 100px;
          padding-bottom: 28px;
        }
        .contact-body {
          flex: 1;
        }
        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 60px;
          align-items: start;
        }
        .contact-form-inner {
          background-color: var(--color-surface);
          padding: 32px 36px;
        }
        .contact-field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .contact-detail-row:hover {
          background-color: var(--color-surface);
        }
        .contact-detail-row:hover .contact-accent-bar {
          opacity: 1 !important;
          transform: scaleY(1) !important;
        }
        /* Contact field */
        .contact-field {
          position: relative;
          margin-bottom: 20px;
        }
        .contact-field::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 18px;
          bottom: 0;
          width: 1px;
          background: var(--color-border);
          transition: width 0.3s var(--ease-out), background 0.3s var(--ease-out);
        }
        .contact-field:focus-within::before {
          width: 2px;
          background: var(--color-accent);
        }
        .contact-field-label {
          font-family: var(--font-sans);
          font-weight: var(--weight-medium);
          font-size: 9px;
          color: var(--color-muted);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 6px;
          line-height: 1;
          display: block;
          transition: letter-spacing 0.3s var(--ease-out), transform 0.3s var(--ease-out);
        }
        .contact-field:focus-within .contact-field-label {
          letter-spacing: 0.16em;
          transform: translateY(-2px);
        }
        .custom-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--color-border-strong);
          color: var(--color-primary);
          font-family: var(--font-sans);
          font-weight: var(--weight-light);
          font-size: 14px;
          padding: 6px 0;
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .custom-input:focus, .custom-input.focused {
          border-bottom-color: var(--color-accent);
        }
        .custom-select-option:hover { background-color: var(--color-surface); }
        .form-submit-btn:hover { background-color: var(--color-accent) !important; }

        /* Laptop */
        @media (max-width: 1279px) {
          .contact-main-grid {
            grid-template-columns: 1fr 300px;
            gap: 40px;
          }
        }
        /* Tablet */
        @media (max-width: 1023px) {
          .contact-header { padding-top: 88px; padding-bottom: 20px; }
          .contact-main-grid {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .contact-details-col { order: 1; }
          .contact-form-col { order: 0; }
        }
        /* Mobile */
        @media (max-width: 767px) {
          .contact-header { padding-top: 100px; padding-bottom: 24px; }
          .contact-main-grid {
            grid-template-columns: 1fr;
            gap: 48px;
          }
          .contact-field-row {
            grid-template-columns: 1fr;
            gap: 0;
          }
          .contact-form-inner {
            padding: 32px 20px;
            margin: 0 -20px; /* Full-bleed look on mobile */
          }
          .contact-field { margin-bottom: 24px; }
          .contact-field::before { left: 0; display: none; } /* Remove the side line on mobile for cleaner look */
          .custom-input { font-size: 16px; } /* Prevent iOS zoom */
        }
      `}</style>
    </div>
  );
};

export default Contact;
