import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type { AboutSection } from "./types";

export function getAboutUs() {
  return apiRequest<AboutSection[]>({
    url: "/about-us",
    method: "GET",
  });
}

export function useAboutUsQuery() {
  return useQuery<ApiResponse<AboutSection[]>>({
    queryKey: ["about-us"],
    queryFn: getAboutUs,
  });
}
