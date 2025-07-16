
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number | null;
  userRating: number | null;
  onRate?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const StarRating = ({ 
  rating, 
  userRating, 
  onRate, 
  readonly = false, 
  size = "sm" 
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRate) {
      onRate(starRating);
    }
  };

  const displayRating = rating || 0;
  const fullStars = Math.floor(displayRating);
  const hasHalfStar = displayRating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= fullStars || (star === fullStars + 1 && hasHalfStar);
        const isUserRated = userRating && star <= userRating;
        
        return (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              "transition-colors",
              {
                "fill-yellow-400 text-yellow-400": isFilled && !isUserRated,
                "fill-blue-500 text-blue-500": isUserRated,
                "text-muted-foreground": !isFilled && !isUserRated,
                "cursor-pointer hover:text-yellow-400": !readonly && onRate,
              }
            )}
            onClick={() => handleStarClick(star)}
          />
        );
      })}
      {rating !== null && (
        <span className="text-xs text-muted-foreground ml-1">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
