import { Link } from "react-router-dom";
import { Instagram, Linkedin, Globe } from "lucide-react";
import WorkingOnTicker from "./WorkingOnTicker";

const Footer = () => (
  <>
    <WorkingOnTicker />
    <footer className="bg-background border-t border-border/30 pt-14 pb-8 px-6 md:px-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-14">
          <Link to="/" className="font-body font-normal text-[13px] tracking-[0.25em] uppercase text-foreground mb-6 md:mb-0">
            The Twenty-One
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-body font-light text-[13px] text-muted mr-4">Kolkata, India</span>
            <a href="#" className="text-muted hover:text-foreground transition-colors hover:scale-110 inline-block" aria-label="Instagram"><Instagram className="w-4 h-4" /></a>
            <a href="#" className="text-muted hover:text-foreground transition-colors hover:scale-110 inline-block" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a>
            <a href="#" className="text-muted hover:text-foreground transition-colors hover:scale-110 inline-block" aria-label="Behance"><Globe className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-14">
          <div>
            <h4 className="font-body font-light text-[11px] uppercase tracking-[0.15em] text-muted mb-4">Navigation</h4>
            <div className="flex flex-col gap-2">
              {["Work", "Services", "About", "Contact"].map(l => (
                <Link key={l} to={`/${l.toLowerCase()}`} className="font-body font-light text-[13px] text-muted-foreground hover:text-foreground transition-colors">{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-body font-light text-[11px] uppercase tracking-[0.15em] text-muted mb-4">Services</h4>
            <div className="flex flex-col gap-2">
              {["Brand Campaigns", "Corporate Shoots", "Wedding Coverage", "Traditional Coverages"].map(s => (
                <span key={s} className="font-body font-light text-[13px] text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-body font-light text-[11px] uppercase tracking-[0.15em] text-muted mb-4">Let's Talk</h4>
            <a href="mailto:hello@thetwentyone.in" className="font-body font-light text-[13px] text-muted-foreground hover:text-foreground transition-colors block mb-1">hello@thetwentyone.in</a>
            <span className="font-body font-light text-[13px] text-muted-foreground">+91 98765 43210</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="font-body font-light text-[11px] text-muted">© 2024 The Twenty-One. All rights reserved.</span>
          <span className="font-body font-light text-[11px] text-muted">Crafted with obsession in Kolkata.</span>
        </div>
      </div>
    </footer>
  </>
);

export default Footer;