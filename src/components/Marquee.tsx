const items = "THE TWENTY-ONE ✦ BRAND CAMPAIGNS ✦ CORPORATE SHOOTS ✦ WEDDING COVERAGE ✦ VISUAL STORYTELLING ✦ KOLKATA ✦ ";

const Marquee = () => (
  <div className="w-full overflow-hidden border-t border-b border-border/30 py-4">
    <div className="marquee-track whitespace-nowrap flex">
      {[0, 1].map(i => (
        <span key={i} className="font-body font-light text-xs uppercase tracking-[0.15em] text-muted shrink-0">
          {items.repeat(6)}
        </span>
      ))}
    </div>
  </div>
);

export default Marquee;
