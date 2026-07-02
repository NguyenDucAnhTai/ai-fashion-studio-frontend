import type { DesignStatus } from "../../shared/constants/designStatus";

export type DesignLayerType = "TEXT" | "IMAGE" | "SHAPE" | string;

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

export interface DesignSummary {
  id: string;
  name: string;
  productId: string;
  productVariantId: string;
  previewImageUrl?: string | null;
  status: DesignStatus;
  createdAt: string;
}

export interface DesignDetail extends DesignSummary {
  customerId: string;
  canvasJson?: Record<string, unknown> | null;
  printFileUrl?: string | null;
  layers: DesignLayer[];
}

export interface SaveDesignRequest {
  name: string;
  canvasJson: Record<string, unknown>;
  previewImageUrl: string;
  printFileUrl: string;
  layers: DesignLayer[];
}

export interface SaveDesignResponse {
  designId: string;
  status: DesignStatus;
  previewImageUrl: string;
  printFileUrl: string;
}
