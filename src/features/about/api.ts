import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type { AboutSection } from "./types";

type AboutRecord = Record<string, unknown>;

const SECTION_ORDER = [
  "INTRODUCTION",
  "MISSION",
  "VISION",
  "HOW_IT_WORKS",
  "VALUES",
];

function isRecord(value: unknown): value is AboutRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAboutSection(value: unknown): AboutSection | null {
  if (!isRecord(value)) {
    return null;
  }

  const sectionKey = readString(value.sectionKey);
  const title = readString(value.title);
  const content = readString(value.content);
  const imageUrl = readString(value.imageUrl);

  if (!sectionKey || !title || !content) {
    return null;
  }

  return {
    sectionKey,
    title,
    content,
    imageUrl: imageUrl || null,
  };
}

function normalizeAboutSections(value: unknown) {
  const items = Array.isArray(value) ? value : [];

  return items
    .map((item) => normalizeAboutSection(item))
    .filter((item): item is AboutSection => Boolean(item))
    .sort((a, b) => {
      const aIndex = SECTION_ORDER.indexOf(a.sectionKey);
      const bIndex = SECTION_ORDER.indexOf(b.sectionKey);

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
}

export async function getAboutUs() {
  const response = await apiRequest<unknown>({
    url: "/api/about-us",
    method: "GET",
  });

  return {
    ...response,
    data: normalizeAboutSections(response.data),
  } satisfies ApiResponse<AboutSection[]>;
}

export function useAboutUsQuery() {
  return useQuery<ApiResponse<AboutSection[]>>({
    queryKey: ["about-us"],
    queryFn: getAboutUs,
  });
}
