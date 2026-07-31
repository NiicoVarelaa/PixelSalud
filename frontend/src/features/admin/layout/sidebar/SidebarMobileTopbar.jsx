import { Menu } from "lucide-react";

const SidebarMobileTopbar = ({ isMobileMenuOpen, onOpen }) => {
  return (
    <nav
      className="z-40 border-b-2 border-gray-200 bg-linear-to-r from-white via-green-50/30 to-white shadow-md backdrop-blur-sm lg:hidden"
      aria-label="Barra de navegación móvil"
    >
      <div className="flex h-16 items-center justify-between px-4">
        <button
          onClick={onOpen}
          className="touch-manipulation rounded-xl p-2.5 text-gray-700 shadow-sm transition-all hover:bg-green-100 hover:text-green-700 hover:shadow-md active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          aria-label="Abrir menú de navegación"
          aria-expanded={isMobileMenuOpen}
        >
          <Menu size={24} strokeWidth={2.5} />
        </button>

        <div className="flex flex-1 items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-green-600 to-green-700 shadow-sm">
            <span className="text-sm font-bold text-white">PS</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-gray-900">
            Pixel Salud
          </h1>
        </div>

        <div className="w-11" />
      </div>
    </nav>
  );
};

export default SidebarMobileTopbar;
