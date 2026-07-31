import { ChevronLeft, ChevronRight } from "lucide-react";

const PromoControlButton = ({
  onClick,
  label,
  direction = "left",
  size = "md",
}) => {
  const sizeClasses = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex ${sizeClasses} cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300`}
    >
      {direction === "left" ? (
        <ChevronLeft className={iconSize} />
      ) : (
        <ChevronRight className={iconSize} />
      )}
    </button>
  );
};

export default PromoControlButton;
