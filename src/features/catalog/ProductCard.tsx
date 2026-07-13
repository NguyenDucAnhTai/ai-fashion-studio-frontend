import { ArrowUpRight, Eye } from "lucide-react";
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
  const isActive = product.status.toUpperCase() === "ACTIVE";

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block h-full overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-[0_16px_50px_rgba(0,0,0,0.05)] transition duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_24px_70px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-900 focus-visible:ring-offset-4"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-beige-50">
        <ProductVisual
          imageUrl={product.thumbnailUrl}
          name={product.name}
          tone={tone}
          className="transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4">
          <span
            className={[
              "rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest shadow-sm",
              isActive
                ? "bg-success-50 text-success-700"
                : "bg-primary-900 text-white",
            ].join(" ")}
          >
            {product.status}
          </span>
        </div>
        <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary-900 shadow-soft transition duration-300 group-hover:rotate-45 group-hover:bg-primary-900 group-hover:text-white">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="flex min-h-52 flex-col p-5">
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-display text-xl font-semibold text-primary-950">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-primary-500">
            {product.description || "Ready for a custom print design."}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between gap-4 border-t border-primary-100 pt-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary-400">
              From
            </p>
            <p className="mt-1 text-lg font-semibold tabular-nums text-primary-950">
              {formatCurrency(product.basePrice)}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-beige-50 px-3 py-2 text-xs font-semibold text-primary-700 transition group-hover:border-primary-900 group-hover:bg-primary-900 group-hover:text-white">
            <Eye size={14} />
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
