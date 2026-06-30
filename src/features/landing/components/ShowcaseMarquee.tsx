import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { SHOWCASE_ITEMS } from "../data/showcaseItems";

const CARD_W = 150;
const CARD_H = 220;

interface CardProps {
  title: string;
  subtitle: string;
  imageBg: string;
  tag?: string;
}

function ShowcaseCard({ title, subtitle, imageBg, tag }: CardProps) {
  return (
    <motion.div
      className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer select-none bg-white border border-black/10 shadow-sm"
      style={{ width: CARD_W, height: CARD_H }}
      whileHover={{ scale: 1.04, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Background gradient */}
      <div
        className={["absolute inset-0 bg-gradient-to-b", imageBg].join(" ")}
      />

      {/* Soft white overlay */}
      <div className="absolute inset-0 bg-white/35" />

      {/* Tag */}
      {tag && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center text-[9px] font-semibold tracking-wide uppercase bg-white/70 backdrop-blur-sm text-primary-900 px-2 py-0.5 rounded-full border border-black/10">
            {tag}
          </span>
        </div>
      )}

      {/* Text content */}
      <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10">
        <p className="text-primary-950 text-xs font-semibold leading-tight line-clamp-2">
          {title}
        </p>
        <p className="text-primary-700 text-[9px] mt-0.5 font-medium">
          {subtitle}
        </p>
      </div>

      {/* Hover ring */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 hover:ring-primary-300/60 transition-all duration-300" />
    </motion.div>
  );
}

/* Duplicate 3× so -50% always loops cleanly regardless of viewport width */
const ITEMS = [...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS];

export default function ShowcaseMarquee() {
  const controls = useAnimationControls();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered) {
      controls.stop();
    } else {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: 35,
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
        },
      });
    }
  }, [hovered, controls]);

  return (
    <section className="w-full bg-[#F6F6F3] pt-4 pb-10 overflow-hidden -mt-2">
      {/* Track wrapper */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#F6F6F3] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#F6F6F3] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-4"
          animate={controls}
          style={{ willChange: "transform" }}
        >
          {ITEMS.map((item, i) => (
            <ShowcaseCard
              key={`${item.id}-${i}`}
              title={item.title}
              subtitle={item.subtitle}
              imageBg={item.imageBg}
              tag={item.tag}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
