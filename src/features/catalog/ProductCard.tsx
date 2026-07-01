import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import type { ProductSummary } from "./types";
import ProductVisual from "./ProductVisual";

interface ProductCardProps {
  product: ProductSummary;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const tone = index % 3 === 1 ? "dark" : index % 3 === 2 ? "accent" : "light";

  return (
    <Link
      to={`/products/${product.id}`}
      className="group overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-medium"
    >
      <div className="h-72 overflow-hidden">
        <ProductVisual imageUrl={product.thumbnailUrl} name={product.name} tone={tone} className="transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold text-primary-900">{product.name}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-primary-500">{product.description}</p>
          </div>
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-900 transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight size={16} />
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-primary-100 pt-4">
          <p className="text-sm font-semibold text-primary-900">{formatCurrency(product.basePrice)}</p>
          <span className="rounded-full bg-success-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-success-700">
            {product.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
