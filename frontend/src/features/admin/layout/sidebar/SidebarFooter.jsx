import { LogOut } from "lucide-react";

const SidebarFooter = ({ onLogout }) => {
  return (
    <div className="border-t border-gray-100 bg-gray-50 p-3 sm:p-4 lg:p-4 lg:pb-6">
      <button
        onClick={onLogout}
        className="flex min-h-11 w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-3 text-sm font-medium text-red-700 transition-all hover:border-red-300 hover:bg-red-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:ring-offset-1"
        aria-label="Cerrar sesión"
      >
        <LogOut size={18} />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );
};

export default SidebarFooter;
