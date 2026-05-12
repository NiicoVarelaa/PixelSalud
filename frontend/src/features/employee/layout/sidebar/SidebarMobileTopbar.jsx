import { Menu } from "lucide-react";

export const SidebarMobileTopbar = ({ onOpen }) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
      <span className="text-sm font-semibold text-gray-700">Panel de Empleado</span>
      <button
        type="button"
        onClick={onOpen}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 cursor-pointer"
        aria-label="Abrir menú de navegación"
      >
        <Menu size={20} />
      </button>
    </div>
  );
};
