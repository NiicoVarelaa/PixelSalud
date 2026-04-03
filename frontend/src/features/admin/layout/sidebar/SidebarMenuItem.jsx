const SidebarMenuItem = ({ item, active, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.path)}
      className={`
        group flex w-full items-center rounded-r-lg border-l-4 px-4 py-3
        text-base font-medium transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 cursor-pointer
        ${
          active
            ? "border-green-600  text-green-700 "
            : "rounded-lg border-transparent bg-white text-gray-700  hover:text-green-700"
        }
      `}
      aria-label={item.ariaLabel}
      aria-current={active ? "page" : undefined}
      style={{ minHeight: 48 }}
    >
      <Icon
        size={22}
        className={`mr-3 transition-colors duration-200 ${
          active ? "text-green-700" : "text-gray-600 group-hover:text-green-700"
        }`}
        aria-hidden="true"
      />
      <span className="flex-1 truncate text-left">{item.label}</span>

      {item.badge && (
        <span
          className="ml-2 min-w-5 rounded-full bg-orange-500 px-2 py-0.5 text-center text-xs font-bold text-white shadow-sm"
          role="status"
          aria-label={`${item.badge.count} notificaciones`}
        >
          {item.badge.count}
        </span>
      )}
    </button>
  );
};

export default SidebarMenuItem;
