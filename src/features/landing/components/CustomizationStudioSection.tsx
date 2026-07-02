import { useState, type CSSProperties } from "react";
import {
  MousePointer2,
  Type,
  Upload,
  Layers,
  Palette,
  Maximize2,
  ZoomIn,
  Circle as CircleIcon,
  Star,
  Waves,
  Award,
  Check,
  type LucideIcon,
} from "lucide-react";
import Container from "../../../shared/components/Container";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type ToolId = "select" | "text" | "logo" | "fabric" | "color" | "fit";
type FabricId = "cotton" | "polyester" | "linen" | "fleece" | "dryfit";
type ColorId = "black" | "white" | "cream" | "lavender" | "sage" | "charcoal";
type TextStyleId = "minimal" | "bold" | "street" | "campus";
type GraphicId = "circle" | "star" | "wave" | "badge";
type FitId = "slim" | "regular" | "oversized";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const TOOLS: { id: ToolId; icon: LucideIcon; label: string }[] = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Add Text" },
  { id: "logo", icon: Upload, label: "Add Logo" },
  { id: "fabric", icon: Layers, label: "Fabric" },
  { id: "color", icon: Palette, label: "Color" },
  { id: "fit", icon: Maximize2, label: "Adjust Fit" },
];

const TOOL_LABELS: Record<ToolId, string> = {
  select: "Select",
  text: "Text",
  logo: "Logo & Graphic",
  fabric: "Fabric",
  color: "Color",
  fit: "Fit",
};

const FABRICS: { id: FabricId; name: string; description: string; swatch: CSSProperties }[] = [
  {
    id: "cotton",
    name: "Cotton",
    description: "Breathable 100% cotton, soft handfeel",
    swatch: {
      backgroundColor: "#e7e0d2",
      backgroundImage:
        "repeating-linear-gradient(45deg, rgba(0,0,0,0.07) 0px, rgba(0,0,0,0.07) 1px, transparent 1px, transparent 5px)",
    },
  },
  {
    id: "polyester",
    name: "Polyester",
    description: "Smooth, quick-dry performance weave",
    swatch: {
      backgroundColor: "#c9cfd6",
      backgroundImage:
        "linear-gradient(120deg, rgba(255,255,255,0.75) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.5) 100%)",
    },
  },
  {
    id: "linen",
    name: "Linen",
    description: "Lightweight woven texture, relaxed drape",
    swatch: {
      backgroundColor: "#ddd0b3",
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(0,0,0,0.09) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(0,0,0,0.09) 0 1px, transparent 1px 4px)",
    },
  },
  {
    id: "fleece",
    name: "Oversized Fleece",
    description: "Heavyweight brushed fleece, cozy fit",
    swatch: {
      backgroundColor: "#a29c94",
      backgroundImage: "radial-gradient(rgba(0,0,0,0.14) 1.4px, transparent 1.4px)",
      backgroundSize: "7px 7px",
    },
  },
  {
    id: "dryfit",
    name: "Dry Fit",
    description: "Micro-mesh moisture-wicking knit",
    swatch: {
      backgroundColor: "#8f97a3",
      backgroundImage:
        "repeating-linear-gradient(45deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px), repeating-linear-gradient(-45deg, rgba(0,0,0,0.16) 0 1px, transparent 1px 3px)",
    },
  },
];

const COLORS: { id: ColorId; name: string; hex: string }[] = [
  { id: "black", name: "Black", hex: "#0A0A0A" },
  { id: "white", name: "White", hex: "#FFFFFF" },
  { id: "cream", name: "Cream", hex: "#F5F0E6" },
  { id: "lavender", name: "Lavender", hex: "#C4B5FD" },
  { id: "sage", name: "Sage", hex: "#A9B4A0" },
  { id: "charcoal", name: "Charcoal", hex: "#3F3B38" },
];

const TEXT_STYLES: { id: TextStyleId; name: string; description: string; fontSize: number; style: CSSProperties }[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Thin weight, wide tracking",
    fontSize: 12,
    style: { fontWeight: 300, letterSpacing: "6px", textTransform: "none" },
  },
  {
    id: "bold",
    name: "Bold",
    description: "Heavy weight, tight tracking",
    fontSize: 17,
    style: { fontWeight: 800, letterSpacing: "0.5px", textTransform: "none" },
  },
  {
    id: "street",
    name: "Street",
    description: "Uppercase, graffiti-inspired stack",
    fontSize: 14,
    style: { fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase" },
  },
  {
    id: "campus",
    name: "Campus",
    description: "Collegiate block lettering",
    fontSize: 11,
    style: { fontWeight: 600, letterSpacing: "8px", textTransform: "uppercase" },
  },
];

const GRAPHICS: { id: GraphicId; name: string; description: string; icon: LucideIcon }[] = [
  { id: "circle", name: "Circle", description: "Clean circular target emblem", icon: CircleIcon },
  { id: "star", name: "Star", description: "Bold star badge", icon: Star },
  { id: "wave", name: "Wave", description: "Flowing wave line art", icon: Waves },
  { id: "badge", name: "Badge", description: "Crest-style badge mark", icon: Award },
];

const FITS: { id: FitId; name: string; description: string }[] = [
  { id: "slim", name: "Slim", description: "Fitted through body & sleeve" },
  { id: "regular", name: "Regular", description: "Classic straight fit" },
  { id: "oversized", name: "Oversized", description: "Relaxed, dropped shoulder" },
];

const SHIRT_PATH =
  "M62 55 Q37 65 16 85 L42 106 L88 106 L72 305 L228 305 L212 106 L258 106 L284 85 Q263 65 238 55 Q213 38 150 34 Q87 38 62 55 Z";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getInkColor(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#0a0a0a" : "rgba(255,255,255,0.9)";
}

/* ─── Garment graphic mark ───────────────────────────────────────────────── */

function GraphicMark({ type, ink, active }: { type: GraphicId; ink: string; active: boolean }) {
  const stroke = active ? "#C4B5FD" : ink;
  const strokeWidth = active ? 1.6 : 1.2;

  if (type === "star") {
    return (
      <path
        d="M150,151 L158.23,173.67 L182.34,174.49 L163.32,189.33 L169.98,212.51 L150,199 L130.02,212.51 L136.68,189.33 L117.66,174.49 L141.77,173.67 Z"
        fill={active ? "rgba(196,181,253,0.15)" : "transparent"}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    );
  }

  if (type === "wave") {
    return (
      <g fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round">
        <path d="M108,178 C122,158 138,158 150,178 C162,198 178,198 192,178" />
        <path d="M108,200 C122,184 138,184 150,200 C162,216 178,216 192,200" opacity={0.5} />
      </g>
    );
  }

  if (type === "badge") {
    return (
      <g fill="none" stroke={stroke} strokeWidth={strokeWidth}>
        <path d="M150,148 L177,161 V190 Q177,213 150,225 Q123,213 123,190 V161 Z" />
        <circle cx="150" cy="182" r="11" />
        <path d="M139,192 L136,206 L150,199 L164,206 L161,192" strokeLinejoin="round" />
      </g>
    );
  }

  return (
    <g fill="none" stroke={stroke} strokeWidth={strokeWidth}>
      <circle cx="150" cy="185" r="34" strokeDasharray={active ? "5 3" : undefined} />
      <circle cx="150" cy="185" r="15" />
      <line x1="116" y1="185" x2="184" y2="185" opacity={0.5} />
      <line x1="150" y1="151" x2="150" y2="219" opacity={0.5} />
    </g>
  );
}

/* ─── Canvas ─────────────────────────────────────────────────────────────── */

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-[10px] text-white/50">
      <span className="uppercase tracking-wide text-white/30">{label}</span>{" "}
      <span className="font-medium text-white/80">{value}</span>
    </span>
  );
}

function EditorCanvas({
  color,
  fabric,
  textStyle,
  graphic,
  activeTool,
}: {
  color: (typeof COLORS)[number];
  fabric: (typeof FABRICS)[number];
  textStyle: (typeof TEXT_STYLES)[number];
  graphic: (typeof GRAPHICS)[number];
  activeTool: ToolId;
}) {
  const ink = getInkColor(color.hex);
  const shirtStroke =
    color.hex.toLowerCase() === "#ffffff" ? "rgba(10,10,10,0.15)" : "rgba(255,255,255,0.18)";
  const textActive = activeTool === "text";
  const graphicActive = activeTool === "logo";
  const garmentActive = activeTool === "fabric" || activeTool === "color" || activeTool === "fit";

  return (
    <div className="relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-b from-[#161520] to-[#0a0a0d] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.65)]">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="relative flex min-h-[480px] flex-col sm:min-h-[560px]">
        {/* top bar */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-300 shadow-[0_0_6px_2px_rgba(196,181,253,0.5)]" />
              Live Preview
            </span>
            <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-white/30 sm:inline">
              Front View
            </span>
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <ZoomIn size={14} />
          </button>
        </div>

        {/* garment */}
        <div className="flex flex-1 items-center justify-center px-4 py-6">
          <svg
            viewBox="0 0 300 340"
            className="h-auto w-64 drop-shadow-[0_20px_35px_rgba(0,0,0,0.45)] sm:w-80"
            aria-hidden="true"
          >
            <defs>
              <pattern id="fabric-cotton" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
              </pattern>
              <pattern id="fabric-linen" width="7" height="7" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="7" y2="0" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2="7" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
              </pattern>
              <pattern id="fabric-fleece" width="9" height="9" patternUnits="userSpaceOnUse">
                <circle cx="4.5" cy="4.5" r="1.3" fill="rgba(255,255,255,0.18)" />
              </pattern>
              <pattern id="fabric-dryfit" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="5" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="5" y2="0" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
              </pattern>
              <linearGradient id="fabric-polyester" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="30%" stopColor="rgba(255,255,255,0)" />
                <stop offset="48%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="60%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* body base */}
            <path d={SHIRT_PATH} fill={color.hex} stroke={shirtStroke} strokeWidth="1.5" />
            {/* fabric texture overlay */}
            <path
              d={SHIRT_PATH}
              fill={`url(#fabric-${fabric.id})`}
              opacity={fabric.id === "polyester" ? 0.8 : 0.6}
            />
            {/* garment edit indicator */}
            {garmentActive && (
              <path
                d={SHIRT_PATH}
                fill="none"
                stroke="#C4B5FD"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                opacity={0.6}
              />
            )}

            {/* collar + seams */}
            <path d="M100 48 Q150 70 200 48" fill="none" stroke={ink} strokeOpacity={0.35} strokeWidth="1.5" />
            <line x1="88" y1="106" x2="42" y2="106" stroke={ink} strokeOpacity={0.2} strokeWidth="1" strokeDasharray="3 3" />
            <line x1="212" y1="106" x2="258" y2="106" stroke={ink} strokeOpacity={0.2} strokeWidth="1" strokeDasharray="3 3" />

            {/* graphic layer */}
            <GraphicMark type={graphic.id} ink={ink} active={graphicActive} />

            {/* text layer */}
            <text
              x="150"
              y="272"
              textAnchor="middle"
              fill={ink}
              fillOpacity={textActive ? 0.95 : 0.65}
              fontFamily="'Space Grotesk', Arial, sans-serif"
              fontSize={textStyle.fontSize}
              style={textStyle.style}
            >
              FITWEAR
            </text>
            {textActive && (
              <rect
                x="102"
                y="256"
                width="96"
                height="24"
                fill="none"
                stroke="#C4B5FD"
                strokeDasharray="4 2"
                strokeWidth="1"
                rx="2"
              />
            )}
          </svg>
        </div>

        {/* info bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-white/10 bg-black/20 px-4 py-3 text-center">
          <InfoChip label="Fabric" value={fabric.name} />
          <span className="text-white/15">/</span>
          <InfoChip label="Color" value={color.name} />
          <span className="text-white/15">/</span>
          <InfoChip label="Graphic" value={graphic.name} />
        </div>
      </div>
    </div>
  );
}

/* ─── Toolbar ────────────────────────────────────────────────────────────── */

function Toolbar({ activeTool, onTool }: { activeTool: ToolId; onTool: (id: ToolId) => void }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-white/10 bg-[#111] p-2">
      {TOOLS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onTool(id)}
          title={label}
          className={[
            "group relative flex flex-col items-center gap-1 rounded-xl px-2.5 py-2.5 transition-all duration-150",
            activeTool === id
              ? "bg-accent-400/20 text-accent-300"
              : "text-white/40 hover:bg-white/5 hover:text-white/70",
          ].join(" ")}
        >
          <Icon size={16} strokeWidth={1.5} />
          <span className="text-[8px] font-medium leading-none tracking-wide">{label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── Option cards ───────────────────────────────────────────────────────── */

function FabricCard({
  fabric,
  active,
  onClick,
}: {
  fabric: (typeof FABRICS)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors duration-150",
        active
          ? "border-accent-300 bg-accent-400/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <span className="h-11 w-11 flex-shrink-0 rounded-lg border border-white/15" style={fabric.swatch} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold text-white">{fabric.name}</span>
          {active && <Check size={12} className="text-accent-300" />}
        </span>
        <span className="mt-0.5 block text-[10.5px] leading-snug text-white/45">{fabric.description}</span>
      </span>
    </button>
  );
}

function ColorSwatchButton({
  color,
  active,
  onClick,
}: {
  color: (typeof COLORS)[number];
  active: boolean;
  onClick: () => void;
}) {
  const tickColor = getInkColor(color.hex) === "#0a0a0a" ? "text-black/70" : "text-white/90";
  return (
    <button type="button" onClick={onClick} className="group flex flex-col items-center gap-1.5">
      <span
        className={[
          "relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-150",
          active ? "scale-110 border-accent-300" : "border-white/20 group-hover:border-white/40",
        ].join(" ")}
        style={{ background: color.hex }}
      >
        {active && <Check size={14} className={tickColor} />}
      </span>
      <span className={["text-[9.5px] font-medium", active ? "text-white" : "text-white/45"].join(" ")}>
        {color.name}
      </span>
    </button>
  );
}

function TextStyleCard({
  item,
  active,
  onClick,
}: {
  item: (typeof TEXT_STYLES)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors duration-150",
        active
          ? "border-accent-300 bg-accent-400/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <span
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-white"
        style={item.style}
      >
        Aa
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold text-white">{item.name}</span>
          {active && <Check size={12} className="text-accent-300" />}
        </span>
        <span className="mt-0.5 block text-[10.5px] leading-snug text-white/45">{item.description}</span>
      </span>
    </button>
  );
}

function GraphicCard({
  item,
  active,
  onClick,
}: {
  item: (typeof GRAPHICS)[number];
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors duration-150",
        active
          ? "border-accent-300 bg-accent-400/10"
          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
      ].join(" ")}
    >
      <Icon size={20} strokeWidth={1.5} className={active ? "text-accent-300" : "text-white/60"} />
      <span className="flex items-center gap-1 text-[11px] font-semibold text-white">
        {item.name}
        {active && <Check size={11} className="text-accent-300" />}
      </span>
      <span className="text-[9.5px] leading-snug text-white/40">{item.description}</span>
    </button>
  );
}

/* ─── Right panel ────────────────────────────────────────────────────────── */

function OptionsPanel({
  activeTool,
  selectedFabric,
  onFabric,
  selectedColor,
  onColor,
  selectedTextStyle,
  onTextStyle,
  selectedGraphic,
  onGraphic,
  selectedFit,
  onFit,
}: {
  activeTool: ToolId;
  selectedFabric: FabricId;
  onFabric: (id: FabricId) => void;
  selectedColor: ColorId;
  onColor: (id: ColorId) => void;
  selectedTextStyle: TextStyleId;
  onTextStyle: (id: TextStyleId) => void;
  selectedGraphic: GraphicId;
  onGraphic: (id: GraphicId) => void;
  selectedFit: FitId;
  onFit: (id: FitId) => void;
}) {
  const fabricName = FABRICS.find((f) => f.id === selectedFabric)!.name;
  const colorName = COLORS.find((c) => c.id === selectedColor)!.name;

  return (
    <div className="flex flex-col rounded-2xl border border-white/10 bg-[#111]/90">
      <div className="border-b border-white/10 px-4 py-3.5">
        <p className="text-[9px] font-semibold uppercase tracking-widest text-white/40">
          {TOOL_LABELS[activeTool]} Options
        </p>
      </div>

      <div className="flex max-h-[420px] flex-col gap-2 overflow-y-auto p-3">
        {activeTool === "fabric" &&
          FABRICS.map((f) => (
            <FabricCard key={f.id} fabric={f} active={selectedFabric === f.id} onClick={() => onFabric(f.id)} />
          ))}

        {activeTool === "color" && (
          <div className="grid grid-cols-3 gap-3 py-1">
            {COLORS.map((c) => (
              <ColorSwatchButton key={c.id} color={c} active={selectedColor === c.id} onClick={() => onColor(c.id)} />
            ))}
          </div>
        )}

        {activeTool === "text" &&
          TEXT_STYLES.map((t) => (
            <TextStyleCard
              key={t.id}
              item={t}
              active={selectedTextStyle === t.id}
              onClick={() => onTextStyle(t.id)}
            />
          ))}

        {activeTool === "logo" && (
          <div className="grid grid-cols-2 gap-2.5">
            {GRAPHICS.map((g) => (
              <GraphicCard key={g.id} item={g} active={selectedGraphic === g.id} onClick={() => onGraphic(g.id)} />
            ))}
          </div>
        )}

        {activeTool === "fit" && (
          <div className="flex flex-col gap-2">
            {FITS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onFit(f.id)}
                className={[
                  "flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-colors duration-150",
                  selectedFit === f.id
                    ? "border-accent-300 bg-accent-400/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                <span>
                  <span className="block text-[12px] font-semibold text-white">{f.name}</span>
                  <span className="mt-0.5 block text-[10.5px] text-white/45">{f.description}</span>
                </span>
                {selectedFit === f.id && <Check size={14} className="text-accent-300" />}
              </button>
            ))}
          </div>
        )}

        {activeTool === "select" && (
          <div className="flex flex-col gap-3 px-1 py-2">
            <p className="text-[11.5px] leading-relaxed text-white/50">
              Click any tool on the left — fabric, color, text, or graphic — to jump straight to its options
              and edit the mockup live.
            </p>
            <div className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/30">Current design</p>
              <p className="text-[11.5px] text-white/70">
                {fabricName} · {colorName}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-white/10 bg-white/[0.02] px-4 py-3.5">
        <p className="text-[11px] text-white/50">
          Selected Fabric: <span className="font-medium text-white">{fabricName}</span>
        </p>
        <p className="text-[11px] text-white/50">
          Selected Color: <span className="font-medium text-white">{colorName}</span>
        </p>
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export default function CustomizationStudioSection() {
  const [selectedTool, setSelectedTool] = useState<ToolId>("fabric");
  const [selectedColor, setSelectedColor] = useState<ColorId>("black");
  const [selectedFabric, setSelectedFabric] = useState<FabricId>("cotton");
  const [selectedTextStyle, setSelectedTextStyle] = useState<TextStyleId>("street");
  const [selectedGraphic, setSelectedGraphic] = useState<GraphicId>("circle");
  const [selectedFit, setSelectedFit] = useState<FitId>("regular");

  const color = COLORS.find((c) => c.id === selectedColor)!;
  const fabric = FABRICS.find((f) => f.id === selectedFabric)!;
  const textStyle = TEXT_STYLES.find((t) => t.id === selectedTextStyle)!;
  const graphic = GRAPHICS.find((g) => g.id === selectedGraphic)!;

  return (
    <section className="relative w-full overflow-hidden bg-primary-900 py-20 lg:py-28">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-accent-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[420px] w-[420px] rounded-full bg-accent-400/[0.06] blur-[100px]" />
      </div>

      <Container className="relative">
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-accent-300">
            Custom Studio
          </p>
          <h2 className="mb-4 font-display text-3xl font-semibold text-white sm:text-4xl">
            Customize Every Detail
          </h2>
          <p className="text-base leading-relaxed text-white/55">
            Edit fabric, colors, text, graphics, and layout before adding your design to cart.
          </p>
        </div>

        {/* Editor workspace */}
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[88px_1fr_320px] lg:gap-5">
          {/* Desktop toolbar */}
          <div className="hidden lg:flex">
            <Toolbar activeTool={selectedTool} onTool={setSelectedTool} />
          </div>

          {/* Mobile toolbar */}
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
            {TOOLS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedTool(id)}
                className={[
                  "flex flex-shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs transition-all duration-150",
                  selectedTool === id
                    ? "bg-accent-400/20 text-accent-300"
                    : "bg-white/5 text-white/40 hover:text-white/70",
                ].join(" ")}
              >
                <Icon size={14} />
                <span className="text-[8px]">{label}</span>
              </button>
            ))}
          </div>

          {/* Canvas */}
          <EditorCanvas
            color={color}
            fabric={fabric}
            textStyle={textStyle}
            graphic={graphic}
            activeTool={selectedTool}
          />

          {/* Options panel */}
          <OptionsPanel
            activeTool={selectedTool}
            selectedFabric={selectedFabric}
            onFabric={setSelectedFabric}
            selectedColor={selectedColor}
            onColor={setSelectedColor}
            selectedTextStyle={selectedTextStyle}
            onTextStyle={setSelectedTextStyle}
            selectedGraphic={selectedGraphic}
            onGraphic={setSelectedGraphic}
            selectedFit={selectedFit}
            onFit={setSelectedFit}
          />
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex justify-center gap-4">
          <button
            type="button"
            className="rounded-full bg-gradient-to-r from-accent-300 to-accent-400 px-8 py-3 text-sm font-semibold text-primary-900 shadow-[0_8px_24px_-8px_rgba(196,181,253,0.5)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-6px_rgba(196,181,253,0.65)]"
          >
            Save Design
          </button>
          <button
            type="button"
            className="rounded-full border border-white/20 px-8 py-3 text-sm text-white/70 transition-all duration-200 hover:border-white/40 hover:bg-white/5 hover:text-white"
          >
            Add to Cart
          </button>
        </div>
      </Container>
    </section>
  );
}
