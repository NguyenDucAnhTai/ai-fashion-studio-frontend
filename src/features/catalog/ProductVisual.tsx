interface ProductVisualProps {
  imageUrl?: string | null;
  name: string;
  tone?: "light" | "dark" | "accent";
  className?: string;
}

const toneClasses = {
  light: "from-beige-100 via-beige-200 to-beige-300 text-primary-800",
  dark: "from-primary-800 via-primary-900 to-black text-white",
  accent: "from-accent-100 via-accent-200 to-accent-300 text-primary-900",
};

export default function ProductVisual({ imageUrl, name, tone = "light", className = "" }: ProductVisualProps) {
  if (imageUrl) {
    return <img src={imageUrl} alt={name} className={["h-full w-full object-cover", className].join(" ")} />;
  }

  return (
    <div className={["relative h-full w-full overflow-hidden bg-gradient-to-br", toneClasses[tone], className].join(" ")}>
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <svg viewBox="0 0 220 220" className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 drop-shadow-2xl" aria-hidden="true">
        <path d="M72 48 96 34h28l24 14 34 14-16 43-22-8v74H76V97l-22 8-16-43 34-14Z" fill="currentColor" fillOpacity="0.92" />
        <path d="M92 39c6 10 30 10 36 0" fill="none" stroke="white" strokeOpacity="0.45" strokeWidth="5" strokeLinecap="round" />
        <rect x="86" y="92" width="48" height="42" rx="10" fill="white" fillOpacity="0.18" />
      </svg>
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest opacity-55">
        <span>AI Studio</span>
        <span>Print Ready</span>
      </div>
    </div>
  );
}
