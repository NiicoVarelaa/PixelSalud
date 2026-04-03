import { ChevronLeft, ChevronRight } from "lucide-react";

const navBtnBase = `
  flex-shrink-0 flex items-center justify-center
  w-9 h-9 rounded-full border-2
  transition-all duration-200 shadow-sm
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
`;

const navBtnActive =
  "border-primary-500 text-primary-700 bg-white hover:bg-primary-50 hover:shadow-md cursor-pointer";
const navBtnDisabled =
  "border-gray-200 text-gray-300 bg-white cursor-not-allowed";

const RelatedNavButton = ({ id, direction, disabled, label }) => (
  <button
    id={id}
    aria-label={label}
    aria-disabled={disabled}
    className={`hidden sm:flex ${navBtnBase} ${disabled ? navBtnDisabled : navBtnActive}`}
  >
    {direction === "left" ? (
      <ChevronLeft size={18} aria-hidden="true" />
    ) : (
      <ChevronRight size={18} aria-hidden="true" />
    )}
  </button>
);

export default RelatedNavButton;
