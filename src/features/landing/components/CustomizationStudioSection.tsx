import { useState } from "react";
import {
  MousePointer2,
  Type,
  Upload,
  Square,
  Layers,
  Palette,
  Maximize2,
  Eye,
  EyeOff,
  Lock,
  ZoomIn,
} from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../shared/components/Container";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const TOOLS = [
  { id: "select", icon: MousePointer2, label: "Select" },
  { id: "text", icon: Type, label: "Add Text" },
  { id: "logo", icon: Upload, label: "Add Logo" },
  { id: "graphic", icon: Square, label: "Add Graphic" },
  { id: "fabric", icon: Layers, label: "Fabric" },
  { id: "color", icon: Palette, label: "Color" },
  { id: "fit", icon: Maximize2, label: "Adjust Fit" },
];

const CANVAS_LAYERS = [
  {
    id: "body",
    label: "Body Base",
    color: "bg-primary-400",
    locked: true,
    visible: true,
  },
  {
    id: "tshirt",
    label: "T-Shirt Layer",
    color: "bg-white",
    locked: false,
    visible: true,
  },
  {
    id: "graphic",
    label: "Graphic Layer",
    color: "bg-accent-300",
    locked: false,
    visible: true,
  },
  {
    id: "text",
    label: "Text Layer",
    color: "bg-beige-300",
    locked: false,
    visible: true,
  },
  {
    id: "pants",
    label: "Pants Layer",
    color: "bg-primary-600",
    locked: false,
    visible: true,
  },
];

const SWATCHES = [
  { hex: "#0A0A0A", label: "Black" },
  { hex: "#FFFFFF", label: "White" },
  { hex: "#8B8680", label: "Warm Gray" },
  { hex: "#C4B5FD", label: "Lavender" },
  { hex: "#F5F0E6", label: "Cream" },
  { hex: "#4F4A45", label: "Charcoal" },
];

/* ─── Canvas ─────────────────────────────────────────────────────────────── */

function EditorCanvas({ activeLayer }: { activeLayer: string }) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "#0D0D0D",
        minHeight: 440,
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      {/* View toggle */}
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <span className="text-[9px] font-semibold tracking-widest uppercase bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full border border-white/20">
          Front View
        </span>
        <span className="text-[9px] font-semibold tracking-widest uppercase text-white/30 px-3 py-1.5 rounded-full border border-white/10">
          Reverse
        </span>
      </div>

      {/* Zoom */}
      <button className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
        <ZoomIn size={14} />
      </button>

      {/* Garment SVG */}
      <div className="flex-1 flex items-center justify-center py-8 px-4">
        <svg
          viewBox="0 0 300 340"
          className="w-56 h-auto drop-shadow-2xl"
          aria-hidden="true"
        >
          {/* T-shirt body */}
          <path
            d="M62 55 Q37 65 16 85 L42 106 L88 106 L72 305 L228 305 L212 106 L258 106 L284 85 Q263 65 238 55 Q213 38 150 34 Q87 38 62 55 Z"
            fill="rgba(255,255,255,0.06)"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
          />
          {/* Collar arc */}
          <path
            d="M100 48 Q150 70 200 48"
            fill="none"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
          />
          {/* Sleeve seam lines */}
          <line
            x1="88"
            y1="106"
            x2="42"
            y2="106"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <line
            x1="212"
            y1="106"
            x2="258"
            y2="106"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* ── Graphic layer (selected when activeLayer === 'graphic') ── */}
          <circle
            cx="150"
            cy="185"
            r="46"
            fill="rgba(196,181,253,0.1)"
            stroke={
              activeLayer === "graphic" ? "#C4B5FD" : "rgba(196,181,253,0.3)"
            }
            strokeWidth={activeLayer === "graphic" ? 1.5 : 1}
            strokeDasharray={activeLayer === "graphic" ? "5 3" : "none"}
          />
          <circle
            cx="150"
            cy="185"
            r="23"
            fill="none"
            stroke="rgba(196,181,253,0.4)"
            strokeWidth="1"
          />
          <line
            x1="104"
            y1="185"
            x2="196"
            y2="185"
            stroke="rgba(196,181,253,0.25)"
            strokeWidth="1"
          />
          <line
            x1="150"
            y1="139"
            x2="150"
            y2="231"
            stroke="rgba(196,181,253,0.25)"
            strokeWidth="1"
          />

          {/* Selection handles (only when graphic layer active) */}
          {activeLayer === "graphic" && (
            <>
              <rect
                x="99"
                y="133"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
              <rect
                x="192"
                y="133"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
              <rect
                x="99"
                y="225"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
              <rect
                x="192"
                y="225"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
              {/* Edge mid handles */}
              <rect
                x="145"
                y="133"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
              <rect
                x="145"
                y="225"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
              <rect
                x="99"
                y="179"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
              <rect
                x="192"
                y="179"
                width="9"
                height="9"
                fill="white"
                stroke="#C4B5FD"
                strokeWidth="1"
                rx="1.5"
              />
            </>
          )}

          {/* Text layer */}
          <text
            x="150"
            y="264"
            textAnchor="middle"
            fill={
              activeLayer === "text"
                ? "rgba(255,255,255,0.75)"
                : "rgba(255,255,255,0.35)"
            }
            fontSize="13"
            fontFamily="monospace"
            letterSpacing="7"
          >
            FITWEAR
          </text>
          {activeLayer === "text" && (
            <rect
              x="106"
              y="248"
              width="88"
              height="22"
              fill="none"
              stroke="#C4B5FD"
              strokeDasharray="4 2"
              strokeWidth="1"
              rx="2"
            />
          )}
        </svg>
      </div>

      {/* Color swatches bottom */}
      <div className="flex items-center justify-center gap-2 pb-4">
        {SWATCHES.map((s) => (
          <button
            key={s.hex}
            aria-label={s.label}
            className="w-5 h-5 rounded-full border-2 border-white/20 hover:scale-125 transition-transform"
            style={{ background: s.hex }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Toolbar ────────────────────────────────────────────────────────────── */

function Toolbar({
  activeTool,
  onTool,
}: {
  activeTool: string;
  onTool: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1 bg-[#111] rounded-2xl p-2 border border-white/8">
      {TOOLS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTool(id)}
          title={label}
          className={[
            "group relative flex flex-col items-center gap-1 px-2.5 py-2.5 rounded-xl transition-all duration-150",
            activeTool === id
              ? "bg-accent-400/20 text-accent-300"
              : "text-white/40 hover:text-white/70 hover:bg-white/5",
          ].join(" ")}
        >
          <Icon size={16} strokeWidth={1.5} />
          <span className="text-[8px] font-medium tracking-wide leading-none">
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─── Layers panel ───────────────────────────────────────────────────────── */

function LayersPanel({
  activeLayer,
  onLayer,
}: {
  activeLayer: string;
  onLayer: (id: string) => void;
}) {
  const [visibility, setVisibility] = useState<Record<string, boolean>>(
    Object.fromEntries(CANVAS_LAYERS.map((l) => [l.id, true])),
  );

  const toggleVisibility = (id: string) =>
    setVisibility((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex flex-col bg-[#111] rounded-2xl border border-white/8 overflow-hidden">
      <div className="px-3 py-3 border-b border-white/10">
        <p className="text-[9px] text-white/40 uppercase tracking-widest font-medium">
          Layers
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-px p-2">
        {CANVAS_LAYERS.map((layer) => {
          const isVisible = visibility[layer.id];
          return (
            <button
              key={layer.id}
              onClick={() => onLayer(layer.id)}
              className={[
                "group flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-150",
                activeLayer === layer.id
                  ? "bg-accent-400/15 text-white"
                  : "text-white/50 hover:text-white/75 hover:bg-white/5",
              ].join(" ")}
            >
              <span
                className={[
                  "flex-shrink-0 w-2.5 h-2.5 rounded-sm",
                  layer.color,
                ].join(" ")}
              />
              <span className="flex-1 text-[10px] font-medium leading-none truncate">
                {layer.label}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleVisibility(layer.id);
                }}
                className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {isVisible ? (
                  <Eye size={11} className="text-white/50 hover:text-white" />
                ) : (
                  <EyeOff size={11} className="text-white/30" />
                )}
              </button>
              {layer.locked && (
                <Lock size={10} className="flex-shrink-0 text-white/25" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export default function CustomizationStudioSection() {
  const [activeTool, setActiveTool] = useState("graphic");
  const [activeLayer, setActiveLayer] = useState("graphic");

  return (
    <section className="w-full bg-primary-900 py-20 lg:py-28">
      <Container>
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] text-accent-300 uppercase tracking-widest font-medium mb-3">
            Custom Studio
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-white mb-4">
            Customize Every Detail
          </h2>
          <p className="text-base text-white/55 leading-relaxed">
            Edit clothing components, colors, fabric, text, graphics, and layout
            before adding your design to cart.
          </p>
        </motion.div>

        {/* Editor workspace */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-[72px_1fr_180px] gap-4 items-start"
        >
          {/* Toolbar (hidden on mobile, shown inline) */}
          <div className="hidden lg:flex">
            <Toolbar activeTool={activeTool} onTool={setActiveTool} />
          </div>

          {/* Mobile toolbar (horizontal) */}
          <div className="flex lg:hidden gap-2 overflow-x-auto pb-1">
            {TOOLS.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTool(id)}
                className={[
                  "flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs transition-all",
                  activeTool === id
                    ? "bg-accent-400/20 text-accent-300"
                    : "text-white/40 hover:text-white/70 bg-white/5",
                ].join(" ")}
              >
                <Icon size={14} />
                <span className="text-[8px]">{label}</span>
              </button>
            ))}
          </div>

          {/* Canvas */}
          <EditorCanvas activeLayer={activeLayer} />

          {/* Layers panel */}
          <div className="hidden lg:block">
            <LayersPanel activeLayer={activeLayer} onLayer={setActiveLayer} />
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="flex justify-center mt-10 gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button className="bg-accent-300 text-primary-900 font-semibold text-sm px-8 py-3 rounded-full hover:bg-accent-400 transition-colors">
            Save Design
          </button>
          <button className="border border-white/20 text-white/70 text-sm px-8 py-3 rounded-full hover:border-white/40 hover:text-white transition-colors">
            Add to Cart
          </button>
        </motion.div>
      </Container>
    </section>
  );
}
