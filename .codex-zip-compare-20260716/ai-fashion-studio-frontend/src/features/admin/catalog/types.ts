export type CatalogStatus = "DRAFT" | "ACTIVE" | "INACTIVE" | string;

export interface AdminCatalog {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  status: CatalogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCatalogRequest {
  name: string;
  description: string;
  basePrice: number;
}
