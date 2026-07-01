import type { AboutSection } from "./types";

export const MOCK_ABOUT_SECTIONS: AboutSection[] = [
  {
    sectionKey: "INTRODUCTION",
    title: "AI T-Shirt Customization Platform",
    content:
      "Fitwear Studio helps customers choose a T-shirt, customize the design, preview the look with AI Try-On, create an order, and pay through the backend gateway.",
    imageUrl: null,
  },
  {
    sectionKey: "MISSION",
    title: "Design first, preview second, print from source",
    content:
      "The saved design is the source of truth for print files. AI Try-On results are used only for confidence before checkout, keeping production data clean and predictable.",
    imageUrl: null,
  },
  {
    sectionKey: "HOW_IT_WORKS",
    title: "Built for an end-to-end learning MVP",
    content:
      "The platform connects React, API Gateway, Java core services, C# identity/payment services, PostgreSQL, MinIO, Kafka events, and real payment provider integration.",
    imageUrl: null,
  },
];
