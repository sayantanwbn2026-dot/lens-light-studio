import { useContent } from "../hooks/useContent";

const WorkingOnTicker = () => {
  const { data: settings } = useContent('site_settings');
  
  // Default fallback if currently_working_on isn't provided
  const baseText = settings?.currently_working_on;
  
  if (!baseText) return null; // Don't show if empty
  
  // Create an array to repeat the text a few times to ensure smooth scrolling
  const repeated = Array(8).fill(baseText);

  return (
    <div style={{
      height: '38px',
      backgroundColor: 'var(--color-black)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      position: 'relative'
    }}>
      {/* Edge fade masks */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        background: 'linear-gradient(to right, var(--color-black) 0%, transparent 5%, transparent 95%, var(--color-black) 100%)'
      }} />

      <div className="marquee-track" style={{ 
        display: 'flex', 
        whiteSpace: 'nowrap',
        animation: 'marquee 45s linear infinite'
      }}>
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 'var(--weight-light)',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.35)',
            letterSpacing: 'var(--tracking-caps)',
            textTransform: 'uppercase',
            paddingRight: '16px' // Spacing between repeated items
          }}>
            CURRENTLY — {item} —&nbsp;
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default WorkingOnTicker;
