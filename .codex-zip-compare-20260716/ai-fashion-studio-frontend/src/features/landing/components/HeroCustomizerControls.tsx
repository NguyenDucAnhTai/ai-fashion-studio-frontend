import { Check, Ruler } from "lucide-react";
import {
  COLOR_OPTIONS,
  FABRIC_OPTIONS,
  FIT_OPTIONS,
  type FabricOption,
  type FitOption,
} from "../types/heroTypes";

const panelBase =
  "rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-medium";

interface ColorPanelProps {
  value: string;
  onChange: (hex: string) => void;
}

function ColorPanel({ value, onChange }: ColorPanelProps) {
  return (
    <div className={`${panelBase} flex flex-col gap-3 px-4 py-3`}>
      <span className="text-xs font-medium uppercase tracking-wider text-primary-500">
        Color
      </span>
      <div className="flex gap-2">
        {COLOR_OPTIONS.map((swatch) => {
          const isActive = value === swatch.hex;
          return (
            <button
              key={swatch.id}
              type="button"
              aria-label={swatch.label}
              onClick={() => onChange(swatch.hex)}
              className={[
                "relative h-8 w-8 rounded-full ring-offset-2 transition-transform",
                "hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
                isActive
                  ? "ring-2 ring-primary-900"
                  : "ring-1 ring-primary-200",
              ].join(" ")}
              style={{ backgroundColor: swatch.hex }}
            >
              {isActive && (
                <Check
                  size={14}
                  className="absolute inset-0 m-auto text-white drop-shadow"
                  strokeWidth={3}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface FabricPanelProps {
  value: FabricOption;
  onChange: (fabric: FabricOption) => void;
}

function FabricPanel({ value, onChange }: FabricPanelProps) {
  return (
    <div className={`${panelBase} flex flex-col gap-3 px-4 py-3`}>
      <span className="text-xs font-medium uppercase tracking-wider text-primary-500">
        Fabric
      </span>
      <div className="flex gap-2">
        {FABRIC_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
              value === option.id
                ? "bg-primary-900 text-white"
                : "bg-white/70 text-primary-700 hover:bg-primary-50",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface FitPanelProps {
  value: FitOption;
  onChange: (fit: FitOption) => void;
}

function FitPanel({ value, onChange }: FitPanelProps) {
  return (
    <div className={`${panelBase} flex flex-col gap-3 px-4 py-3`}>
      <span className="text-xs font-medium uppercase tracking-wider text-primary-500">
        Fit
      </span>
      <div className="flex gap-2">
        {FIT_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400",
              value === option.id
                ? "bg-primary-900 text-white"
                : "bg-white/70 text-primary-700 hover:bg-primary-50",
            ].join(" ")}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeBadge() {
  return (
    <div
      className={`${panelBase} flex items-center gap-2 px-4 py-3 text-sm font-medium text-primary-800`}
    >
      <Ruler size={16} className="text-accent-500" />
      Recommended size: <span className="text-primary-950">M</span>
    </div>
  );
}

interface HeroCustomizerControlsProps {
  color: string;
  fabric: FabricOption;
  fit: FitOption;
  onColorChange: (hex: string) => void;
  onFabricChange: (fabric: FabricOption) => void;
  onFitChange: (fit: FitOption) => void;
}

export default function HeroCustomizerControls({
  color,
  fabric,
  fit,
  onColorChange,
  onFabricChange,
  onFitChange,
}: HeroCustomizerControlsProps) {
  return (
    <>
      {/* Desktop: floating panels positioned around the model */}
      <div className="pointer-events-auto absolute left-0 top-1/4 hidden flex-col gap-4 lg:flex">
        <ColorPanel value={color} onChange={onColorChange} />
        <FabricPanel value={fabric} onChange={onFabricChange} />
      </div>

      <div className="pointer-events-auto absolute right-0 top-1/4 hidden flex-col gap-4 lg:flex">
        <FitPanel value={fit} onChange={onFitChange} />
        <SizeBadge />
      </div>

      {/* Mobile / tablet: stacked controls below the model */}
      <div className="pointer-events-auto mt-8 flex flex-col items-center gap-4 lg:hidden">
        <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-4">
          <ColorPanel value={color} onChange={onColorChange} />
          <FabricPanel value={fabric} onChange={onFabricChange} />
        </div>
        <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-4">
          <FitPanel value={fit} onChange={onFitChange} />
          <SizeBadge />
        </div>
      </div>
    </>
  );
}
