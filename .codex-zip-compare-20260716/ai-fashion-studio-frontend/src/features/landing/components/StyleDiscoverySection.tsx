import { useMemo, useState } from "react";
import CircularGallery from "../../../shared/components/CircularGallery";
import type { GalleryItem } from "../../../shared/components/CircularGallery";

const FILTERS = ["All", "Street", "Campus", "Gym", "Concert", "Formal"];

const PRODUCTS = [
  {
    id: "streetwear",
    category: "Street",
    tag: "New",
    title: "Streetwear Drop",
    brand: "Urban Edge SS25",
    price: "$25.00",
    oldPrice: "",
    href: "/collections/streetwear",
    visual: "STREET",
    bg: "bg-[#eeeeee]",
    text: "text-black",
    favorite: false,
  },
  {
    id: "minimal",
    category: "Formal",
    tag: "Best",
    title: "Minimal Essentials",
    brand: "Clean & Timeless",
    price: "$19.00",
    oldPrice: "$25.00",
    href: "/collections/minimal",
    visual: "MINIMAL",
    bg: "bg-[#f1efe9]",
    text: "text-black",
    favorite: false,
  },
  {
    id: "campus",
    category: "Campus",
    tag: "Hot",
    title: "Campus Daily",
    brand: "Everyday Essentials",
    price: "$22.00",
    oldPrice: "",
    href: "/collections/campus",
    visual: "CAMPUS",
    bg: "bg-[#efe4cf]",
    text: "text-black",
    favorite: true,
  },
  {
    id: "sporty",
    category: "Gym",
    tag: "Active",
    title: "Gym Active",
    brand: "Performance Meets Style",
    price: "$28.00",
    oldPrice: "",
    href: "/collections/sporty",
    visual: "GYM",
    bg: "bg-[#ebe5ff]",
    text: "text-black",
    favorite: false,
  },
  {
    id: "concert",
    category: "Concert",
    tag: "Limited",
    title: "Concert Night",
    brand: "Bold & Dramatic",
    price: "$30.00",
    oldPrice: "$36.00",
    href: "/collections/concert",
    visual: "CONCERT",
    bg: "bg-[#1a1a1a]",
    text: "text-white",
    favorite: false,
  },
];

type Product = (typeof PRODUCTS)[number];

// No product photography exists yet, so each collection gets an on-brand
// poster (its own accent color + wordmark) rendered as an SVG data URI —
// this keeps the gallery's WebGL texture pipeline fed with real images
// without depending on external stock-photo URLs.
function buildPlaceholderImage(item: Product) {
  const hexMatch = item.bg.match(/#([0-9a-fA-F]{3,8})/);
  const bgHex = hexMatch ? `#${hexMatch[1]}` : "#f5f0e6";
  const fgHex = item.text === "text-white" ? "#ffffff" : "#0a0a0a";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1100">
    <rect width="100%" height="100%" fill="${bgHex}" />
    <text x="50%" y="54%" font-family="Georgia, 'Playfair Display', serif" font-weight="700" font-size="118" letter-spacing="-4" fill="${fgHex}" fill-opacity="0.92" text-anchor="middle" dominant-baseline="middle">${item.visual}</text>
    <text x="50%" y="67%" font-family="Arial, sans-serif" font-weight="600" font-size="30" letter-spacing="8" fill="${fgHex}" fill-opacity="0.55" text-anchor="middle">${item.category.toUpperCase()}</text>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export default function StyleDiscoverySection() {
  const [activeFilter, setActiveFilter] = useState("All");

  const galleryItems = useMemo<GalleryItem[]>(() => {
    const visibleProducts =
      activeFilter === "All"
        ? PRODUCTS
        : PRODUCTS.filter((item) => item.category === activeFilter);

    return visibleProducts.map((item) => ({
      image: buildPlaceholderImage(item),
      text: item.title,
    }));
  }, [activeFilter]);

  return (
    <section className="w-full bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-[26px] font-medium tracking-[-0.04em] text-black">
            Popular collections
          </h2>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={[
                    "rounded-full border px-4 py-2 text-[13px] font-medium transition",
                    isActive
                      ? "border-black bg-black text-white"
                      : "border-black bg-white text-black hover:bg-black hover:text-white",
                  ].join(" ")}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mb-3 text-[12px] text-gray-400">
          Drag, scroll, or use ← → to explore the collection.
        </p>

        <div
          key={activeFilter}
          className="relative h-[520px] w-full overflow-hidden rounded-[20px] bg-[#faf8f4] sm:h-[600px]"
        >
          <CircularGallery
            items={galleryItems}
            bend={2}
            textColor="#0a0a0a"
            borderRadius={0.06}
            scrollSpeed={1.6}
            scrollEase={0.06}
            font="600 30px Georgia"
          />
        </div>
      </div>
    </section>
  );
}
