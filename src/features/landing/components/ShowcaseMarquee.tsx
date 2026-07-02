import { memo } from "react";
import { SHOWCASE_ITEMS } from "../data/showcaseItems";

const CARD_W = 210;
const CARD_H = 300;

interface CardProps {
  title: string;
  subtitle: string;
  imageBg: string;
  tag?: string;
}

const ShowcaseCard = memo(function ShowcaseCard({
  title,
  subtitle,
  imageBg,
  tag,
}: CardProps) {
  return (
    <div className="flex-shrink-0 px-2 py-5">
      <div
        className="relative cursor-pointer select-none overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-soft transition-transform duration-300 ease-out hover:-translate-y-2 hover:scale-[1.035]"
        style={{ width: CARD_W, height: CARD_H }}
      >
        <div
          className={["absolute inset-0 bg-gradient-to-b", imageBg].join(" ")}
        />

        <div className="absolute inset-0 bg-white/35" />

        {tag && (
          <div className="absolute left-4 top-4 z-10">
            <span className="inline-flex items-center rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-900">
              {tag}
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
          <p className="line-clamp-2 font-display text-base font-semibold leading-tight text-primary-950">
            {title}
          </p>
          <p className="mt-1 text-xs font-medium text-primary-700">
            {subtitle}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-black/5 transition-all duration-300" />
      </div>
    </div>
  );
});

const LOOP_ITEMS = [...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS];

export default function ShowcaseMarquee() {
  return (
    <section className="-mt-2 w-full overflow-hidden bg-[#F6F6F3] pb-10 pt-3">
      <div className="showcase-marquee relative overflow-hidden">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-24 bg-gradient-to-r from-[#F6F6F3] to-transparent" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-24 bg-gradient-to-l from-[#F6F6F3] to-transparent" />

        <div className="showcase-track flex w-max gap-4">
          {LOOP_ITEMS.map((item, i) => (
            <ShowcaseCard
              key={`${item.id}-${i}`}
              title={item.title}
              subtitle={item.subtitle}
              imageBg={item.imageBg}
              tag={item.tag}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
