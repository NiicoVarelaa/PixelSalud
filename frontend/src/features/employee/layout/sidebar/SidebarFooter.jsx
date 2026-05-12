import { LogOut } from "lucide-react";

export const SidebarFooter = ({ onLogout }) => {
  return (
    <div className="border-t border-gray-100 p-4">
      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 cursor-pointer"
        aria-label="Cerrar sesión"
      >
        <LogOut size={18} className="shrink-0" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};
