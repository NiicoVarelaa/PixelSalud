import { createElement } from "react";

export const SidebarMenuItem = ({ item, active, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={() => onClick(item.path)}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer ${
        active
          ? "bg-green-600 text-white shadow-md"
          : "text-gray-600 hover:bg-green-50 hover:text-green-600"
      }`}
      aria-label={item.ariaLabel}
      aria-current={active ? "page" : undefined}
    >
      {createElement(Icon, { size: 18, className: "shrink-0" })}
      <span>{item.label}</span>
    </button>
  );
};
