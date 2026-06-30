import { useState } from "react";
import { Sparkles, CheckCircle2, Send } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../shared/components/Container";

/* ─── Mock data ─────────────────────────────────────────────────────────── */

const MESSAGES = [
  {
    id: 1,
    role: "user" as const,
    text: "I'm 170cm, 65kg. I need an outfit for a concert.",
    time: "2:14 PM",
  },
  {
    id: 2,
    role: "coach" as const,
    text: "Great choice! For a concert I'd go with an oversized black tee, cargo pants, and cotton fabric for comfort. That streetwear fit will look sharp.",
    time: "2:14 PM",
  },
  {
    id: 3,
    role: "user" as const,
    text: "Can you make it more casual?",
    time: "2:15 PM",
  },
  {
    id: 4,
    role: "coach" as const,
    text: "Sure! Here's your configuration: Oversized T-shirt, Cargo Pants, Cotton 250gsm, Oversized fit, Black & Grey tones, Size L. Your 2D preview is ready.",
    time: "2:15 PM",
  },
];

const COMPONENTS = [
  {
    id: "top",
    label: "Top",
    value: "Oversized T-Shirt",
    colorDot: "bg-primary-900",
  },
  {
    id: "bottom",
    label: "Bottom",
    value: "Cargo Pants",
    colorDot: "bg-primary-600",
  },
  {
    id: "fabric",
    label: "Fabric",
    value: "Cotton 250gsm",
    colorDot: "bg-beige-400",
  },
  {
    id: "fit",
    label: "Fit",
    value: "Oversized",
    colorDot: "bg-accent-300",
  },
  {
    id: "color",
    label: "Color",
    value: "Black / Grey",
    colorDot: "bg-primary-500",
  },
  {
    id: "size",
    label: "Size",
    value: "L",
    colorDot: "bg-accent-400",
  },
];

/* ─── 2D Mannequin SVG ───────────────────────────────────────────────────── */

function MannequinPreview() {
  return (
    <svg
      viewBox="0 0 160 295"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="2D body model preview"
    >
      {/* Grid background */}
      <defs>
        <pattern id="grid" width="14" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M 14 0 L 0 0 0 14"
            fill="none"
            stroke="#E5E0D8"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="160" height="295" fill="url(#grid)" />

      {/* ── Body outline ── */}
      {/* Head */}
      <ellipse
        cx="80"
        cy="26"
        rx="18"
        ry="20"
        fill="#EDE8E0"
        stroke="#C8BFB0"
        strokeWidth="1.5"
      />
      {/* Neck */}
      <rect
        x="73"
        y="44"
        width="14"
        height="14"
        rx="3"
        fill="#EDE8E0"
        stroke="#C8BFB0"
        strokeWidth="1.5"
      />

      {/* ── T-shirt (oversized) ── */}
      {/* Main body */}
      <path
        d="M34 56 Q22 62 18 82 L18 140 Q18 148 26 150 L134 150 Q142 148 142 140 L142 82 Q138 62 126 56 L100 46 Q91 42 80 42 Q69 42 60 46 Z"
        fill="rgba(18,18,18,0.82)"
        stroke="rgba(18,18,18,0.4)"
        strokeWidth="1"
      />
      {/* Left sleeve */}
      <path
        d="M18 82 L8 116 Q6 122 12 124 L26 126 Q32 124 34 118 L40 92"
        fill="rgba(18,18,18,0.82)"
        stroke="rgba(18,18,18,0.4)"
        strokeWidth="1"
      />
      {/* Right sleeve */}
      <path
        d="M142 82 L152 116 Q154 122 148 124 L134 126 Q128 124 126 118 L120 92"
        fill="rgba(18,18,18,0.82)"
        stroke="rgba(18,18,18,0.4)"
        strokeWidth="1"
      />
      {/* Collar detail */}
      <path
        d="M64 46 Q80 52 96 46"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* ── Cargo pants ── */}
      <path
        d="M18 148 L16 178 L28 228 L36 268 L50 272 L58 244 L80 244 L102 244 L110 272 L124 268 L132 228 L144 178 L142 148 Z"
        fill="rgba(70,70,70,0.78)"
        stroke="rgba(70,70,70,0.4)"
        strokeWidth="1"
      />
      {/* Cargo pocket detail (left) */}
      <rect
        x="24"
        y="188"
        width="16"
        height="12"
        rx="2"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      {/* Cargo pocket detail (right) */}
      <rect
        x="120"
        y="188"
        width="16"
        height="12"
        rx="2"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1"
      />
      {/* Center seam */}
      <line
        x1="80"
        y1="148"
        x2="80"
        y2="244"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* ── Guide lines ── */}
      {/* Shoulder */}
      <line
        x1="4"
        y1="58"
        x2="156"
        y2="58"
        stroke="#C8BFB0"
        strokeWidth="0.8"
        strokeDasharray="4 3"
      />
      {/* Chest */}
      <line
        x1="4"
        y1="90"
        x2="156"
        y2="90"
        stroke="#C8BFB0"
        strokeWidth="0.8"
        strokeDasharray="4 3"
      />
      {/* Waist */}
      <line
        x1="4"
        y1="138"
        x2="156"
        y2="138"
        stroke="#C8BFB0"
        strokeWidth="0.8"
        strokeDasharray="4 3"
      />
      {/* Hip */}
      <line
        x1="4"
        y1="160"
        x2="156"
        y2="160"
        stroke="#C8BFB0"
        strokeWidth="0.8"
        strokeDasharray="4 3"
      />
      {/* Knee */}
      <line
        x1="4"
        y1="228"
        x2="156"
        y2="228"
        stroke="#C8BFB0"
        strokeWidth="0.8"
        strokeDasharray="4 3"
      />

      {/* ── Measurement labels (right side) ── */}
      <text x="146" y="61" fontSize="6" fill="#A09890" fontFamily="monospace">
        SH
      </text>
      <text x="146" y="93" fontSize="6" fill="#A09890" fontFamily="monospace">
        CH
      </text>
      <text x="146" y="141" fontSize="6" fill="#A09890" fontFamily="monospace">
        WA
      </text>
      <text x="146" y="163" fontSize="6" fill="#A09890" fontFamily="monospace">
        HI
      </text>
      <text x="146" y="231" fontSize="6" fill="#A09890" fontFamily="monospace">
        KN
      </text>

      {/* ── Vertical height indicator ── */}
      <line x1="6" y1="6" x2="6" y2="290" stroke="#C8BFB0" strokeWidth="0.8" />
      <line x1="3" y1="6" x2="9" y2="6" stroke="#C8BFB0" strokeWidth="0.8" />
      <line
        x1="3"
        y1="290"
        x2="9"
        y2="290"
        stroke="#C8BFB0"
        strokeWidth="0.8"
      />
      <text
        x="2"
        y="152"
        fontSize="6.5"
        fill="#A09890"
        fontFamily="monospace"
        transform="rotate(-90,2,152)"
      >
        170cm
      </text>
    </svg>
  );
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function ChatPanel() {
  return (
    <div
      className="flex flex-col h-full bg-white rounded-2xl border border-primary-100 overflow-hidden"
      style={{ minHeight: 460 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-primary-100 bg-white">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-300 to-accent-500 flex items-center justify-center flex-shrink-0">
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-primary-900 leading-none">
            Fashion Coach
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
            <span className="text-[10px] text-primary-400">Online</span>
          </div>
        </div>
        <span className="text-[9px] text-accent-500 font-medium bg-accent-50 px-2 py-0.5 rounded-full border border-accent-100">
          AI
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={[
              "flex gap-2.5",
              msg.role === "user" ? "flex-row-reverse" : "flex-row",
            ].join(" ")}
          >
            {/* Avatar */}
            <div
              className={[
                "flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold mt-0.5",
                msg.role === "user"
                  ? "bg-primary-900 text-white"
                  : "bg-gradient-to-br from-accent-300 to-accent-500",
              ].join(" ")}
            >
              {msg.role === "user" ? (
                "U"
              ) : (
                <Sparkles size={11} className="text-white" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={[
                "max-w-[75%]",
                msg.role === "user" ? "items-end" : "items-start",
              ].join(" ")}
            >
              <div
                className={[
                  "px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-primary-900 text-white rounded-tr-sm"
                    : "bg-beige-100 text-primary-800 rounded-tl-sm",
                ].join(" ")}
              >
                {msg.text}
              </div>
              <p className="text-[9px] text-primary-300 mt-1 px-1">
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-primary-100">
        <div className="flex items-center gap-2 bg-beige-50 rounded-xl px-3.5 py-2.5 border border-primary-100">
          <input
            type="text"
            placeholder="Ask your fashion coach..."
            className="flex-1 bg-transparent text-xs text-primary-700 placeholder-primary-300 outline-none"
            readOnly
          />
          <button className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary-900 flex items-center justify-center hover:bg-primary-700 transition-colors">
            <Send size={12} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ComponentsPanel() {
  const [selected, setSelected] = useState<string[]>(
    COMPONENTS.map((c) => c.id),
  );

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  return (
    <div
      className="flex flex-col bg-white rounded-2xl border border-primary-100 overflow-hidden"
      style={{ minHeight: 460 }}
    >
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-primary-100">
        <p className="text-[10px] text-primary-400 uppercase tracking-widest font-medium mb-0.5">
          Outfit Builder
        </p>
        <h3 className="text-sm font-semibold text-primary-900">
          Recommended Components
        </h3>
      </div>

      {/* Component cards */}
      <div className="flex-1 grid grid-cols-2 gap-3 p-4">
        {COMPONENTS.map((comp) => {
          const active = selected.includes(comp.id);
          return (
            <motion.button
              key={comp.id}
              onClick={() => toggle(comp.id)}
              whileTap={{ scale: 0.96 }}
              className={[
                "text-left p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer",
                active
                  ? "border-accent-300 bg-accent-50"
                  : "border-primary-100 bg-white hover:border-primary-200 hover:bg-beige-50",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-1 mb-2">
                <span
                  className={[
                    "w-5 h-5 rounded-md flex-shrink-0",
                    comp.colorDot,
                  ].join(" ")}
                />
                {active && (
                  <CheckCircle2
                    size={13}
                    className="text-accent-500 flex-shrink-0"
                  />
                )}
              </div>
              <p className="text-[9px] text-primary-400 uppercase tracking-wider font-medium mb-0.5">
                {comp.label}
              </p>
              <p className="text-xs font-semibold text-primary-900 leading-tight">
                {comp.value}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-primary-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-primary-500">
            <span className="font-semibold text-primary-900">
              {selected.length}
            </span>{" "}
            of {COMPONENTS.length} selected
          </span>
          <button className="text-xs font-medium text-accent-500 hover:text-accent-700 transition-colors">
            Update Preview →
          </button>
        </div>
      </div>
    </div>
  );
}

function PreviewPanel() {
  return (
    <div
      className="flex flex-col bg-beige-50 rounded-2xl border border-primary-100 overflow-hidden"
      style={{ minHeight: 460 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-primary-100 bg-white">
        <div>
          <p className="text-[10px] text-primary-400 uppercase tracking-widest font-medium mb-0.5">
            Visualization
          </p>
          <h3 className="text-sm font-semibold text-primary-900">2D Preview</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse" />
          <span className="text-[10px] text-primary-400 font-medium">Live</span>
        </div>
      </div>

      {/* Mannequin area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 gap-3">
        <div className="w-full max-w-[200px] flex-1">
          <MannequinPreview />
        </div>

        {/* Measurement tags */}
        <div className="w-full flex items-center justify-center gap-3">
          {[
            { label: "Height", value: "170cm" },
            { label: "Weight", value: "65kg" },
            { label: "Size", value: "L" },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center bg-white rounded-xl px-3 py-2 border border-primary-100 shadow-soft"
            >
              <span className="text-[9px] text-primary-400 uppercase tracking-wide">
                {label}
              </span>
              <span className="text-xs font-semibold text-primary-900 mt-0.5">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="w-full flex items-center justify-center gap-4">
          {[
            { color: "bg-primary-900", label: "T-Shirt" },
            { color: "bg-primary-600", label: "Cargo" },
            { color: "bg-beige-300", label: "Body" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={["w-2.5 h-2.5 rounded-sm", color].join(" ")} />
              <span className="text-[9px] text-primary-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ───────────────────────────────────────────────────────── */

export default function PersonalizedFashionSection() {
  return (
    <section className="w-full bg-white py-20 lg:py-28 border-t border-primary-100">
      <Container>
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] text-primary-400 uppercase tracking-widest font-medium mb-3">
            AI-Powered Styling
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-primary-900 mb-4">
            Build Your Look With
            <br className="hidden sm:block" /> a Fashion Coach
          </h2>
          <p className="text-base text-primary-500 leading-relaxed">
            Answer a few simple questions and receive personalized suggestions
            for fit, fabric, color, size, and outfit components.
          </p>
        </motion.div>

        {/* 3-panel layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0 }}
          >
            <ChatPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.1,
            }}
          >
            <ComponentsPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.2,
            }}
          >
            <PreviewPanel />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
