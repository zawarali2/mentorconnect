/**
 * Renders filled and empty stars based on a numeric rating (0–5).
 */
export default function StarRating({ rating = 0, size = "md", showNumber = false }) {
  const stars = [];
  const sizeClass = size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-base";

  for (let i = 1; i <= 5; i++) {
    const filled = i <= Math.round(rating);
    stars.push(
      <span
        key={i}
        className={`${sizeClass} ${filled ? "text-yellow-400" : "text-gray-300"}`}
      >
        ★
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-0.5">
      {stars}
      {showNumber && (
        <span className="ml-1 text-sm font-medium text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </span>
  );
}
