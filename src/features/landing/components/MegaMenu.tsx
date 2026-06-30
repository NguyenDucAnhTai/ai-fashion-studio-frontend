import { ArrowRight } from "lucide-react";
import type { NavDropdownItem } from "../../../shared/types";

interface MegaMenuProps {
  items: NavDropdownItem[];
  isVisible: boolean;
}

export default function MegaMenu({ items, isVisible }: MegaMenuProps) {
  return (
    <div
      className={[
        "absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[680px] z-50",
        "bg-white rounded-2xl shadow-large border border-primary-100",
        "transition-all duration-200 ease-out origin-top",
        isVisible
          ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
          : "opacity-0 scale-95 pointer-events-none -translate-y-2",
      ].join(" ")}
    >
      <div className="p-6">
        <div className="grid grid-cols-2 gap-3">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex items-start gap-3 p-3 rounded-xl hover:bg-beige-50 transition-colors duration-150"
            >
              <div
                className={[
                  "flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden",
                  item.imageBg,
                ].join(" ")}
              >
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-black/5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-primary-900 group-hover:text-primary-700 transition-colors">
                    {item.title}
                  </span>
                  <ArrowRight
                    size={12}
                    className="text-primary-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
                  />
                </div>
                <p className="text-xs text-primary-500 mt-0.5 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-primary-100 flex items-center justify-between">
          <p className="text-xs text-primary-400">Explore all features →</p>
          <div className="flex gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-accent-600 bg-accent-50 px-2.5 py-1 rounded-full font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
              Live Preview Available
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
