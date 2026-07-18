export type FitOption = "slim" | "regular" | "oversized";

export type FabricOption = "cotton" | "linen" | "satin";

export interface ColorSwatch {
  id: string;
  label: string;
  hex: string;
}

export interface FabricSwatch {
  id: FabricOption;
  label: string;
  roughness: number;
  metalness: number;
}

export interface FitSwatch {
  id: FitOption;
  label: string;
  scale: number;
}

export interface CustomizerState {
  color: string;
  fabric: FabricOption;
  fit: FitOption;
}

export const COLOR_OPTIONS: ColorSwatch[] = [
  { id: "ivory", label: "Ivory", hex: "#F3EEE6" },
  { id: "midnight", label: "Midnight", hex: "#1A1A1E" },
  { id: "clay", label: "Clay", hex: "#B8754F" },
  { id: "sage", label: "Sage", hex: "#8A9A7E" },
  { id: "violet", label: "Violet", hex: "#9B6CFF" },
];

export const FABRIC_OPTIONS: FabricSwatch[] = [
  { id: "cotton", label: "Cotton", roughness: 0.65, metalness: 0.02 },
  { id: "linen", label: "Linen", roughness: 0.85, metalness: 0.0 },
  { id: "satin", label: "Satin", roughness: 0.25, metalness: 0.15 },
];

export const FIT_OPTIONS: FitSwatch[] = [
  { id: "slim", label: "Slim", scale: 0.9 },
  { id: "regular", label: "Regular", scale: 1 },
  { id: "oversized", label: "Oversized", scale: 1.18 },
];