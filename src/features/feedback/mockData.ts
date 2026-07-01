import type { PublicFeedback } from "./types";

export const MOCK_PUBLIC_FEEDBACKS: PublicFeedback[] = [
  {
    id: "fb-1",
    productId: "oversized-tee",
    rating: 5,
    comment: "The oversized tee looked exactly like my saved design. The try-on preview helped me commit to the size before checkout.",
    imageUrl: null,
    createdAt: "2026-06-19T10:30:00Z",
  },
  {
    id: "fb-2",
    productId: "basic-tee",
    rating: 5,
    comment: "Simple flow: choose variant, customize, save, then order. The print file came from my saved design, which makes sense.",
    imageUrl: null,
    createdAt: "2026-06-20T09:15:00Z",
  },
  {
    id: "fb-3",
    productId: "premium-tee",
    rating: 4,
    comment: "The heavyweight tee felt premium and the AI preview was useful for checking proportions before payment.",
    imageUrl: null,
    createdAt: "2026-06-21T14:40:00Z",
  },
  {
    id: "fb-4",
    productId: "campus-tee",
    rating: 5,
    comment: "Good for club shirts. The variant selector was clear and the order tracking made the demo feel complete.",
    imageUrl: null,
    createdAt: "2026-06-22T08:20:00Z",
  },
];
