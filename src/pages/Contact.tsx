import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Instagram, Linkedin, Globe, ArrowRight, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-line", {
        clipPath: "inset(100% 0 0 0)",
        duration: 1,
        stagger: 0.3,
        ease: "power3.out",
        delay: 0.3,
      });
      gsap.from(".contact-reveal", {
        scrollTrigger: { trigger: ".contact-form-area", start: "top 80%" },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.message.trim()) e.message = "Tell us about your project";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    gsap.fromTo(".submit-btn", { scale: 1 }, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  };

  return (
    <div ref={ref} className="min-h-screen">
      {/* Hero */}
      <section className="h-[70vh] md:h-screen flex items-center px-6 md:px-10 pt-20">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="contact-line font-display text-[8vw] md:text-[6vw] text-foreground leading-tight">Let's Make</h1>
          <h1 className="contact-line font-display italic text-[10vw] md:text-[8vw] text-foreground leading-tight">Something</h1>
          <h1 className="contact-line font-display font-bold text-[12vw] md:text-[10vw] text-foreground leading-tight">Remarkable.</h1>
        </div>
      </section>

      {/* Form Section */}
      <section className="contact-form-area py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left - Info */}
          <div className="contact-reveal">
            <div className="mb-12">
              <p className="font-body font-light text-xs text-muted uppercase tracking-[0.2em] mb-4">Studio</p>
              <p className="font-body font-light text-base text-muted-foreground leading-relaxed">
                The Twenty-One<br />
                Kolkata, West Bengal<br />
                India
              </p>
            </div>
            <div className="mb-12">
              <p className="font-body font-light text-xs text-muted uppercase tracking-[0.2em] mb-4">Contact</p>
              <a href="mailto:hello@thetwentyone.in" className="font-body font-light text-base text-foreground hover:opacity-70 transition-opacity block mb-1">hello@thetwentyone.in</a>
              <span className="font-body font-light text-base text-muted-foreground">+91 98765 43210</span>
            </div>
            <div>
              <p className="font-body font-light text-xs text-muted uppercase tracking-[0.2em] mb-4">Follow</p>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Instagram", icon: Instagram },
                  { label: "LinkedIn", icon: Linkedin },
                  { label: "Behance", icon: Globe },
                ].map(s => (
                  <a key={s.label} href="#" className="underline-draw font-body font-light text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2 w-fit">
                    <s.icon className="w-3.5 h-3.5" /> {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="contact-reveal">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full border border-foreground flex items-center justify-center mb-6">
                  <Check className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="font-display italic text-2xl text-foreground mb-2">Vision Received</h3>
                <p className="font-body font-light text-sm text-muted">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="floating-field">
                  <input
                    type="text"
                    placeholder=" "
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  <label>Your Name</label>
                  {errors.name && <p className="font-body font-light text-xs text-destructive mt-1">{errors.name}</p>}
                </div>
                <div className="floating-field">
                  <input
                    type="email"
                    placeholder=" "
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  <label>Your Email</label>
                  {errors.email && <p className="font-body font-light text-xs text-destructive mt-1">{errors.email}</p>}
                </div>
                <div className="floating-field">
                  <select
                    value={form.service}
                    onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    className={form.service ? "has-value" : ""}
                  >
                    <option value="">—</option>
                    <option value="brand">Brand Campaigns</option>
                    <option value="corporate">Corporate Shoots</option>
                    <option value="wedding">Wedding Coverage</option>
                    <option value="traditional">Traditional Coverages</option>
                  </select>
                  <label>Service Interested In</label>
                </div>
                <div className="floating-field">
                  <textarea
                    rows={4}
                    placeholder=" "
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  />
                  <label>Tell Us About Your Project</label>
                  {errors.message && <p className="font-body font-light text-xs text-destructive mt-1">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="submit-btn w-full bg-foreground text-background font-body text-sm uppercase tracking-[0.15em] py-4 hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
                >
                  Send Your Vision <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center font-body font-light text-xs text-muted">
                  Or simply write to us at{" "}
                  <a href="mailto:hello@thetwentyone.in" className="underline-draw text-foreground">hello@thetwentyone.in</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
