import type { BadgeTone } from "../types";

export const DESIGN_STATUS = {
  draft: "DRAFT",
  saved: "SAVED",
  locked: "LOCKED",
} as const;

export type DesignStatus = (typeof DESIGN_STATUS)[keyof typeof DESIGN_STATUS] | string;

export function getDesignStatusTone(status: DesignStatus): BadgeTone {
  if (status === DESIGN_STATUS.saved) {
    return "success";
  }

  if (status === DESIGN_STATUS.locked) {
    return "warning";
  }

  return "neutral";
}
