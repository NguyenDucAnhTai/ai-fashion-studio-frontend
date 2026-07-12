import type { BadgeTone } from "../../shared/types";

export function getProductStatusTone(status: string): BadgeTone {
  if (status === "ACTIVE") {
    return "success";
  }

  if (status === "INACTIVE") {
    return "error";
  }

  return "neutral";
}
