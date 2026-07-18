import type { DesignStatus as SharedDesignStatus } from "../../shared/constants/designStatus";

export type DesignStatus = SharedDesignStatus;

export type DesignLayerType = "TEXT" | "IMAGE" | "ICON" | string;

export interface CreateDraftDesignRequest {
  productId: string;
  productVariantId: string;
  name: string;
}

export interface CreateDraftDesignResponse {
  designId: string;
  status: DesignStatus;
}

export interface DesignLayer {
  layerType: DesignLayerType;
  content?: string | null;
  imageUrl?: string | null;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  rotation: number;
  color?: string | null;
  zIndex: number;
}

export interface MyDesignListItem {
  id: string;
  name: string;
  productId: string;
  productVariantId: string;
  previewImageUrl?: string | null;
  status: DesignStatus;
  createdAt: string;
}

export type DesignSummary = MyDesignListItem;

export interface MyDesignsResponse {
  items: MyDesignListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface DesignDetail {
  id: string;
  customerId?: string;
  productId: string;
  productVariantId: string;
  name: string;
  canvasJson: unknown;
  previewImageUrl?: string | null;
  printFileUrl?: string | null;
  status: DesignStatus;
  layers: DesignLayer[];
}

export interface SaveDesignRequest {
  name: string;
  canvasJson: unknown;
  previewImageUrl: string;
  printFileUrl: string;
  layers: DesignLayer[];
}

export interface SaveDesignResponse {
  designId: string;
  status: DesignStatus;
  previewImageUrl?: string | null;
  printFileUrl?: string | null;
}
