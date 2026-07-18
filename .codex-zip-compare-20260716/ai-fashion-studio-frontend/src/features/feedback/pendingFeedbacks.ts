import type { PendingFeedbackDraft } from "./types";

const STORAGE_KEY = "pendingFeedbackDrafts";

export function getPendingFeedbackDrafts() {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as PendingFeedbackDraft[];
  } catch {
    return [];
  }
}

export function addPendingFeedbackDraft(draft: PendingFeedbackDraft) {
  const existing = getPendingFeedbackDrafts().filter((item) => item.feedbackId !== draft.feedbackId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([draft, ...existing].slice(0, 20)));
}

export function removePendingFeedbackDraft(feedbackId: string) {
  const next = getPendingFeedbackDrafts().filter((item) => item.feedbackId !== feedbackId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
