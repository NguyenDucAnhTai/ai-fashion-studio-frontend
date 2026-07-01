import type { ProductDetail, ProductSummary } from "./types";

export const MOCK_PRODUCTS: ProductSummary[] = [
  {
    id: "basic-tee",
    name: "Basic Cotton T-Shirt",
    description: "A soft cotton tee ready for text, graphics, and print-ready customization.",
    basePrice: 150000,
    thumbnailUrl: null,
    status: "ACTIVE",
  },
  {
    id: "oversized-tee",
    name: "Oversized Studio Tee",
    description: "Relaxed silhouette with extra canvas space for bold front artwork.",
    basePrice: 180000,
    thumbnailUrl: null,
    status: "ACTIVE",
  },
  {
    id: "premium-tee",
    name: "Premium Heavyweight Tee",
    description: "Structured 250gsm cotton for sharper print output and a premium hand feel.",
    basePrice: 220000,
    thumbnailUrl: null,
    status: "ACTIVE",
  },
  {
    id: "campus-tee",
    name: "Campus Daily Tee",
    description: "Everyday fit for school, events, and club designs with easy sizing.",
    basePrice: 165000,
    thumbnailUrl: null,
    status: "ACTIVE",
  },
  {
    id: "street-tee",
    name: "Streetwear Drop Tee",
    description: "Dark urban base with high contrast graphics and oversized styling.",
    basePrice: 195000,
    thumbnailUrl: null,
    status: "ACTIVE",
  },
  {
    id: "minimal-tee",
    name: "Minimal Essentials Tee",
    description: "Clean neutral tee for small typography, logos, and subtle artwork.",
    basePrice: 175000,
    thumbnailUrl: null,
    status: "ACTIVE",
  },
];

export const MOCK_PRODUCT_DETAILS: ProductDetail[] = MOCK_PRODUCTS.map((product, index) => ({
  ...product,
  images: [],
  variants: [
    {
      id: `${product.id}-white-m`,
      sku: `${product.id.toUpperCase()}-WHITE-M`,
      size: "M",
      color: "White",
      material: index % 2 === 0 ? "Cotton" : "Cotton 250gsm",
      priceAdjustment: 0,
      availableQuantity: 20 + index * 3,
      status: "ACTIVE",
    },
    {
      id: `${product.id}-black-l`,
      sku: `${product.id.toUpperCase()}-BLACK-L`,
      size: "L",
      color: "Black",
      material: index % 2 === 0 ? "Cotton" : "Heavy Cotton",
      priceAdjustment: 20000,
      availableQuantity: 8 + index,
      status: "ACTIVE",
    },
    {
      id: `${product.id}-cream-xl`,
      sku: `${product.id.toUpperCase()}-CREAM-XL`,
      size: "XL",
      color: "Cream",
      material: "Cotton Blend",
      priceAdjustment: 15000,
      availableQuantity: index % 3 === 0 ? 0 : 12,
      status: "ACTIVE",
    },
  ],
}));

export function findMockProduct(productId: string) {
  return MOCK_PRODUCT_DETAILS.find((product) => product.id === productId) ?? MOCK_PRODUCT_DETAILS[0];
}
