import { Star } from "lucide-react";

interface RatingInputProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: number;
  disabled?: boolean;
  className?: string;
}

export default function RatingInput({
  value,
  onChange,
  max = 5,
  size = 15,
  disabled = false,
  className = "",
}: RatingInputProps) {
  const stars = Array.from({ length: max }, (_, index) => index + 1);

  if (onChange) {
    return (
      <div className={["flex gap-2", className].join(" ")}>
        {stars.map((star) => (
          <button
            key={star}
            type="button"
            disabled={disabled}
            aria-label={`Rate ${star} out of ${max}`}
            onClick={() => onChange(star)}
            className={[
              "flex h-11 w-11 items-center justify-center rounded-full border transition",
              star <= value
                ? "border-accent-300 bg-accent-100 text-accent-700"
                : "border-primary-100 text-primary-300",
            ].join(" ")}
          >
            <Star size={17} fill="currentColor" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className={["flex items-center gap-1 text-accent-500", className].join(" ")}
      role="img"
      aria-label={`Rating: ${value} out of ${max}`}
    >
      {stars.map((star) => (
        <Star key={star} size={size} fill={star <= value ? "currentColor" : "none"} />
      ))}
    </div>
  );
}
