import { X } from "lucide-react";
import {
  SidebarFooter,
  SidebarMenuItem,
  SidebarMobileTopbar,
  SidebarOverlay,
  SidebarUserHeader,
  useSidebarEmpleado,
} from "../sidebar";

const SidebarEmpleado = () => {
  const {
    user,
    menuItems,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isActive,
    handleLogout,
    handleNavigate,
    sidebarRef,
    closeButtonRef,
  } = useSidebarEmpleado();

  return (
    <>
      <SidebarMobileTopbar
        isMobileMenuOpen={isMobileMenuOpen}
        onOpen={() => setIsMobileMenuOpen(true)}
      />

      <SidebarOverlay
        isVisible={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-64 flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:shadow-sm
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        aria-label="Menú de navegación del empleado"
      >
        <button
          ref={closeButtonRef}
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-0 right-0 min-h-11 min-w-11 touch-manipulation cursor-pointer p-2 text-gray-600 transition-all hover:text-gray-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:ring-offset-1 lg:hidden"
          aria-label="Cerrar menú de navegación"
        >
          <X size={22} />
        </button>

        <SidebarUserHeader user={user} />

        <nav
          className="flex-1 space-y-1.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          aria-label="Menú principal"
        >
          {menuItems.map((item) => (
            <SidebarMenuItem
              key={item.path}
              item={item}
              active={isActive(item.path)}
              onClick={handleNavigate}
            />
          ))}
        </nav>

        <SidebarFooter onLogout={handleLogout} />
      </aside>
    </>
  );
};

export default SidebarEmpleado;
