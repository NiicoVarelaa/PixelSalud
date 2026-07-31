const PromoDots = ({ items, activeIndex, onSelect, compact = false }) => {
  const activeClass = compact ? "w-6" : "w-7";
  const inactiveClass = compact ? "w-2" : "w-2.5";
  const dotHeight = compact ? "h-2" : "h-2.5";

  return (
    <div className={`flex items-center ${compact ? "gap-1.5" : "gap-2"}`}>
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={item.id || `dot-${index}`}
            type="button"
            aria-label={`Ir al elemento ${index + 1}`}
            onClick={() => onSelect(index)}
            className={`${dotHeight} rounded-full transition-all ${
              isActive
                ? `${activeClass} cursor-pointer bg-orange-500`
                : `${inactiveClass} cursor-pointer bg-slate-300 hover:bg-slate-400`
            }`}
          />
        );
      })}
    </div>
  );
};

export default PromoDots;
