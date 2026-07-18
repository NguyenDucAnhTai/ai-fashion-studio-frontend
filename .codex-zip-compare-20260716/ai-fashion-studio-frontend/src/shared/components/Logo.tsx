import { Scissors } from "lucide-react";
import { Link } from "react-router-dom";

interface LogoProps {
  inverted?: boolean;
  className?: string;
}

export default function Logo({ inverted = false, className = "" }: LogoProps) {
  return (
    <Link
      to="/"
      className={["flex items-center gap-2 group select-none", className].join(
        " ",
      )}
    >
      <span
        className={[
          "flex items-center justify-center w-8 h-8 rounded-lg transition-transform duration-200 group-hover:scale-110",
          inverted ? "bg-white text-primary-900" : "bg-primary-900 text-white",
        ].join(" ")}
      >
        <Scissors size={16} strokeWidth={2} />
      </span>
      <span className="text-[22px] font-semibold tracking-tight">
        Fitwear <span className="text-purple-500">Studio</span>
      </span>
    </Link>
  );
}
