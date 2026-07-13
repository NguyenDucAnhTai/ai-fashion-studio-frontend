import { ImageIcon } from "lucide-react";

interface ProductVisualProps {
  imageUrl?: string | null;
  name: string;
  tone?: "light" | "dark" | "accent";
  fit?: "cover" | "contain";
  className?: string;
}

const toneClasses = {
  light: "from-beige-50 via-beige-100 to-primary-100",
  dark: "from-primary-100 via-primary-50 to-beige-200",
  accent: "from-beige-100 via-accent-50 to-primary-100",
};

export default function ProductVisual({
  imageUrl,
  name,
  tone = "light",
  fit = "cover",
  className = "",
}: ProductVisualProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={[
          "h-full w-full",
          fit === "contain" ? "object-contain" : "object-cover",
          className,
        ].join(" ")}
      />
    );
  }

  return (
    <div
      className={[
        "relative flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        toneClasses[tone],
        className,
      ].join(" ")}
    >
      <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-white/50 blur-2xl" />
      <div className="absolute -bottom-12 right-8 h-32 w-32 rounded-full bg-primary-200/40 blur-2xl" />
      <div className="relative flex flex-col items-center gap-3 text-primary-500">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/70 bg-white/75 shadow-soft">
          <ImageIcon size={22} strokeWidth={1.8} />
        </span>
        <span className="rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-500">
          No image
        </span>
      </div>
    </div>
  );
}
