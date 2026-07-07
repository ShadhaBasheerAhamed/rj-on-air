export function Equalizer({ bars = 5, className = "" }: { bars?: number; className?: string }) {
  return (
    <div className={`flex items-end gap-[3px] h-6 ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-primary origin-bottom"
          style={{
            height: "100%",
            animation: `eq-bar ${0.6 + (i % 3) * 0.25}s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function WaveLine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 60" className={className} aria-hidden>
      <defs>
        <linearGradient id="wg" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.63 0.25 25)" stopOpacity="0" />
          <stop offset="50%" stopColor="oklch(0.63 0.25 25)" />
          <stop offset="100%" stopColor="oklch(0.63 0.25 25)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {Array.from({ length: 60 }).map((_, i) => {
        const h = Number((6 + Math.abs(Math.sin(i * 0.5)) * 40).toFixed(2));
        const y = Number((30 - h / 2).toFixed(2));
        return (
          <rect
            key={i}
            x={i * 7}
            y={y}
            width="3"
            height={h}
            fill="url(#wg)"
            rx="1.5"
            style={{ animation: `eq-bar ${0.8 + (i % 5) * 0.15}s ease-in-out ${i * 0.02}s infinite` }}
          />
        );
      })}
    </svg>
  );
}
