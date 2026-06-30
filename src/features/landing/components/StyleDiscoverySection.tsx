import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import Container from "../../../shared/components/Container";

const STYLES = [
  {
    id: "streetwear",
    tag: "Urban & Bold",
    title: "Streetwear",
    description:
      "Oversized fits, graphic layers, cargo pants, and bold urban looks.",
    href: "/collections/streetwear",
    gradient: "from-primary-800 via-primary-900 to-black",
    tagColor: "text-accent-300 bg-accent-300/10 border-accent-300/20",
    arrowBg: "bg-accent-300 text-primary-900",
    decorColor: "bg-primary-700",
    textLight: true,
  },
  {
    id: "minimal",
    tag: "Clean & Timeless",
    title: "Minimal",
    description:
      "Clean silhouettes, neutral colors, simple textures, and timeless essentials.",
    href: "/collections/minimal",
    gradient: "from-beige-100 via-beige-200 to-beige-300",
    tagColor: "text-primary-700 bg-primary-100/60 border-primary-200",
    arrowBg: "bg-primary-900 text-white",
    decorColor: "bg-beige-300",
    textLight: false,
  },
  {
    id: "sporty",
    tag: "Active & Free",
    title: "Sporty",
    description:
      "Breathable fabrics, relaxed movement, gym-ready and daily activewear.",
    href: "/collections/sporty",
    gradient: "from-accent-100 via-accent-200 to-accent-300",
    tagColor: "text-accent-700 bg-accent-100 border-accent-200",
    arrowBg: "bg-primary-900 text-white",
    decorColor: "bg-accent-200",
    textLight: false,
  },
  {
    id: "campus",
    tag: "Casual & Everyday",
    title: "Campus",
    description:
      "Comfortable everyday outfits for school, coffee, events, and casual hangouts.",
    href: "/collections/campus",
    gradient: "from-beige-200 via-beige-300 to-beige-400",
    tagColor: "text-primary-700 bg-white/50 border-primary-200",
    arrowBg: "bg-primary-900 text-white",
    decorColor: "bg-beige-400",
    textLight: false,
  },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut, delay: i * 0.1 },
  }),
};

interface StyleCardProps {
  tag: string;
  title: string;
  description: string;
  href: string;
  gradient: string;
  tagColor: string;
  arrowBg: string;
  decorColor: string;
  textLight: boolean;
  index: number;
}

function StyleCard({
  tag,
  title,
  description,
  href,
  gradient,
  tagColor,
  arrowBg,
  decorColor,
  textLight,
  index,
}: StyleCardProps) {
  const titleColor = textLight ? "text-white" : "text-primary-900";
  const descColor = textLight ? "text-white/70" : "text-primary-600";

  return (
    <motion.a
      href={href}
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
      }}
    >
      {/* Visual area */}
      <div className="relative h-64 overflow-hidden">
        {/* Background that zooms on hover */}
        <motion.div
          className={["absolute inset-0 bg-gradient-to-br", gradient].join(" ")}
          whileHover={{ scale: 1.07 }}
          transition={{ duration: 0.5, ease: easeOut }}
        />

        {/* Decorative abstract shapes */}
        <div
          className={[
            "absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-30 blur-2xl",
            decorColor,
          ].join(" ")}
        />
        <div
          className={[
            "absolute bottom-4 -left-6 w-24 h-24 rounded-full opacity-20 blur-xl",
            decorColor,
          ].join(" ")}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: textLight
              ? "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)"
              : "linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Tag in visual area */}
        <div className="absolute top-4 left-4 z-10">
          <span
            className={[
              "inline-flex text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border",
              tagColor,
            ].join(" ")}
          >
            {tag}
          </span>
        </div>

        {/* Gradient fade at bottom of visual */}
        <div
          className={[
            "absolute bottom-0 left-0 right-0 h-16",
            textLight
              ? "bg-gradient-to-t from-black/40 to-transparent"
              : "bg-gradient-to-t from-white/20 to-transparent",
          ].join(" ")}
        />
      </div>

      {/* Content area */}
      <div
        className={[
          "flex flex-col flex-1 p-5",
          textLight ? "bg-primary-900" : "bg-white",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className={[
                "text-xl font-display font-semibold mb-1.5",
                titleColor,
              ].join(" ")}
            >
              {title}
            </h3>
            <p className={["text-sm leading-relaxed", descColor].join(" ")}>
              {description}
            </p>
          </div>
          {/* Arrow */}
          <div
            className={[
              "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full mt-0.5 transition-transform duration-300 group-hover:rotate-45",
              arrowBg,
            ].join(" ")}
          >
            <ArrowUpRight size={16} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </motion.a>
  );
}

export default function StyleDiscoverySection() {
  return (
    <section className="w-full bg-beige-50 py-20 lg:py-28">
      <Container>
        {/* Header */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <p className="text-[10px] text-primary-400 uppercase tracking-widest font-medium mb-3">
            Style Directions
          </p>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-primary-900 mb-4">
            Discover Your Style
          </h2>
          <p className="text-base text-primary-500 leading-relaxed">
            Explore curated fashion directions and find the look that matches
            your personality, body profile, and occasion.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STYLES.map((style, i) => (
            <StyleCard key={style.id} {...style} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
