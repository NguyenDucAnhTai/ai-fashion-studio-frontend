import { useState } from "react";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import Container from "../../../shared/components/Container";

/* ─── Data ───────────────────────────────────────────────────────────────── */

type CollectionCategory =
  | "all"
  | "street"
  | "campus"
  | "gym"
  | "concert"
  | "formal";

const FILTERS: { id: CollectionCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "street", label: "Street" },
  { id: "campus", label: "Campus" },
  { id: "gym", label: "Gym" },
  { id: "concert", label: "Concert" },
  { id: "formal", label: "Formal" },
];

const COLLECTIONS = [
  {
    id: "streetwear",
    title: "Streetwear Drop",
    subtitle: "Urban Edge SS25",
    tag: "New Drop",
    pieces: "24 pieces",
    gradient: "from-primary-700 via-primary-800 to-primary-900",
    decorGradient: "from-accent-400/20 to-transparent",
    textLight: true,
    category: "street" as CollectionCategory,
  },
  {
    id: "minimal",
    title: "Minimal Essentials",
    subtitle: "Clean & Timeless",
    tag: "Bestseller",
    pieces: "18 pieces",
    gradient: "from-beige-100 via-beige-200 to-beige-300",
    decorGradient: "from-white/60 to-transparent",
    textLight: false,
    category: "street" as CollectionCategory,
  },
  {
    id: "campus",
    title: "Campus Daily",
    subtitle: "Everyday Essentials",
    tag: "Popular",
    pieces: "30 pieces",
    gradient: "from-beige-200 via-beige-300 to-beige-400",
    decorGradient: "from-white/40 to-transparent",
    textLight: false,
    category: "campus" as CollectionCategory,
  },
  {
    id: "gym",
    title: "Gym Active",
    subtitle: "Performance Meets Style",
    tag: "Active",
    pieces: "16 pieces",
    gradient: "from-accent-100 via-accent-200 to-accent-300",
    decorGradient: "from-white/30 to-transparent",
    textLight: false,
    category: "gym" as CollectionCategory,
  },
  {
    id: "concert",
    title: "Concert Night",
    subtitle: "Bold & Dramatic",
    tag: "Limited",
    pieces: "12 pieces",
    gradient: "from-primary-900 via-primary-900 to-black",
    decorGradient: "from-accent-400/15 to-transparent",
    textLight: true,
    category: "concert" as CollectionCategory,
  },
  {
    id: "business",
    title: "Business Casual",
    subtitle: "Polished & Professional",
    tag: "Classic",
    pieces: "22 pieces",
    gradient: "from-primary-100 via-primary-200 to-primary-300",
    decorGradient: "from-white/50 to-transparent",
    textLight: false,
    category: "formal" as CollectionCategory,
  },
];

/* ─── Card ───────────────────────────────────────────────────────────────── */

interface CollectionCardProps {
  title: string;
  subtitle: string;
  tag: string;
  pieces: string;
  gradient: string;
  decorGradient: string;
  textLight: boolean;
  index: number;
}

function CollectionCard({
  title,
  subtitle,
  tag,
  pieces,
  gradient,
  decorGradient,
  textLight,
  index,
}: CollectionCardProps) {
  const titleColor = textLight ? "text-white" : "text-primary-900";
  const subtitleColor = textLight ? "text-white/65" : "text-primary-500";
  const tagColor = textLight
    ? "bg-white/15 text-white border-white/20"
    : "bg-white/70 text-primary-700 border-primary-200/50";

  return (
    <motion.a
      href={`/collections/${title.toLowerCase().replace(" ", "-")}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
      whileHover={{ y: -8 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer"
      style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}
    >
      {/* Visual area */}
      <div className="relative h-72 overflow-hidden">
        {/* Background */}
        <motion.div
          className={["absolute inset-0 bg-gradient-to-br", gradient].join(" ")}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
        {/* Decorative top light */}
        <div
          className={[
            "absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b opacity-60",
            decorGradient,
          ].join(" ")}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: textLight
              ? "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Tag */}
        <div className="absolute top-4 left-4">
          <span
            className={[
              "text-[9px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border",
              tagColor,
            ].join(" ")}
          >
            {tag}
          </span>
        </div>
        {/* Add to cart button on hover */}
        <motion.div
          className="absolute bottom-4 right-4"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-medium hover:scale-110 transition-transform">
            <ShoppingBag size={14} className="text-primary-900" />
          </button>
        </motion.div>
        {/* Bottom fade */}
        <div
          className={[
            "absolute bottom-0 left-0 right-0 h-16",
            textLight
              ? "bg-gradient-to-t from-black/30"
              : "bg-gradient-to-t from-white/20",
          ].join(" ")}
        />
      </div>

      {/* Content */}
      <div
        className={[
          "flex items-center justify-between px-5 py-4",
          textLight ? "bg-primary-900" : "bg-white",
        ].join(" ")}
      >
        <div>
          <h3
            className={[
              "text-base font-display font-semibold leading-tight",
              titleColor,
            ].join(" ")}
          >
            {title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <p className={["text-xs", subtitleColor].join(" ")}>{subtitle}</p>
            <span className={["text-[9px]", subtitleColor].join(" ")}>·</span>
            <p className={["text-[10px] font-medium", subtitleColor].join(" ")}>
              {pieces}
            </p>
          </div>
        </div>
        <div
          className={[
            "flex items-center justify-center w-8 h-8 rounded-full transition-transform duration-300 group-hover:rotate-45",
            textLight
              ? "bg-white/10 text-white"
              : "bg-primary-100 text-primary-900",
          ].join(" ")}
        >
          <ArrowUpRight size={14} strokeWidth={2.5} />
        </div>
      </div>
    </motion.a>
  );
}

/* ─── Section ────────────────────────────────────────────────────────────── */

export default function CollectionsSection() {
  const [activeFilter, setActiveFilter] = useState<CollectionCategory>("all");

  const visible =
    activeFilter === "all"
      ? COLLECTIONS
      : COLLECTIONS.filter((c) => c.category === activeFilter);

  return (
    <section className="w-full bg-white py-20 lg:py-28 border-t border-primary-100">
      <Container>
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] text-primary-400 uppercase tracking-widest font-medium mb-3">
            Shop By Collection
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-primary-900 mb-4">
            Shop By Collection
          </h2>
          <p className="text-base text-primary-500 leading-relaxed">
            Choose ready-made fashion directions and customize them to your
            style later.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 mb-12 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={[
                "px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200",
                activeFilter === f.id
                  ? "bg-primary-900 text-white"
                  : "bg-primary-50 text-primary-500 hover:bg-primary-100 hover:text-primary-800",
              ].join(" ")}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((col, i) => (
            <CollectionCard key={col.id} {...col} index={i} />
          ))}
        </div>

        {/* View all */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <a
            href="/collections"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900 border-b border-primary-300 hover:border-primary-700 pb-0.5 transition-all"
          >
            View All Collections
            <ArrowUpRight size={14} />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
