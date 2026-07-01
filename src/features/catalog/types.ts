export interface ProductSummary {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  material: string;
  priceAdjustment: number;
  availableQuantity: number;
  status: "ACTIVE" | "INACTIVE" | string;
}

export interface ProductDetail extends ProductSummary {
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductListParams {
  keyword?: string;
  page: number;
  pageSize: number;
}

export interface CreateDraftDesignRequest {
  productId: string;
  productVariantId: string;
  name: string;
}

export interface CreateDraftDesignResponse {
  designId: string;
  status: "DRAFT" | string;
}
