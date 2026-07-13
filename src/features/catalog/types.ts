export type ProductStatus = "ACTIVE" | "INACTIVE" | string;

export interface ProductListItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  thumbnailUrl?: string | null;
  status: ProductStatus;
}

export type ProductSummary = ProductListItem;

export interface ProductListResponse {
  items: ProductListItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
}

export interface RawProductImage {
  id: string;
  productId?: string;
  imageUrl: string;
  thumbnail?: boolean;
  isThumbnail?: boolean;
  sortOrder?: number;
  createdAt?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  size: string;
  color: string;
  material: string;
  priceAdjustment: number;
  availableQuantity: number;
  status: ProductStatus;
}

export interface RawProductVariant {
  id: string;
  productId?: string;
  sku: string;
  size: string;
  color: string;
  material: string;
  priceAdjustment: number;
  status: ProductStatus;
  inventory?: {
    variantId: string;
    availableQuantity: number;
  };
  availableQuantity?: number;
}

export interface ProductDetail extends ProductListItem {
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface ProductListParams {
  keyword?: string;
  status?: string;
  page?: number;
  pageSize?: number;
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
