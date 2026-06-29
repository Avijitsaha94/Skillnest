import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = { sm: "w-3 h-3", md: "w-4 h-4", lg: "w-5 h-5" };

export function StarRating({
  rating,
  max = 5,
  size = "md",
  showValue = false,
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i + 1)}
          className={cn("transition-colors", interactive && "cursor-pointer hover:scale-110")}
          aria-label={`Rate ${i + 1} out of ${max}`}
        >
          <Star
            className={cn(
              sizeMap[size],
              i < Math.round(rating) ? "text-[var(--accent)] fill-current" : "text-[var(--border-strong)]"
            )}
          />
        </button>
      ))}
      {showValue && (
        <span className="text-sm font-semibold text-[var(--text)] ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
