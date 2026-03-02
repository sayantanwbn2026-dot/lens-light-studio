const items = [
  "Brand Campaign for Luminous",
  "Wedding Film for Ananya & Rohit",
  "Corporate Lookbook for Tata Steel",
  "Heritage Series — Durga Puja 2025",
  "Identity Refresh for Birla Group",
];

const WorkingOnTicker = () => {
  const repeated = [...items, ...items];

  return (
    <div className="w-full bg-deep-black border-t border-b border-border/20 py-3 overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap" style={{ animationDuration: "45s" }}>
        {repeated.map((item, i) => (
          <span key={i} className="font-body font-light text-xs text-muted uppercase tracking-[0.1em] mx-6">
            Currently crafting — {item} ✦
          </span>
        ))}
      </div>
    </div>
  );
};

export default WorkingOnTicker;
