import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { User, Heart, ShoppingBag, LogOut, MapPin } from "lucide-react";
import Header from "@features/public/components/navigation/Header";
import { motion } from "framer-motion";

const DashboardCliente = () => {
  const { logoutUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/perfil", label: "Perfil", icon: User },
    { path: "/perfil/pedidos", label: "Pedidos", icon: ShoppingBag },
    { path: "/perfil/direcciones", label: "Direcciones", icon: MapPin },
    { path: "/perfil/favoritos", label: "Favoritos", icon: Heart },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="h-dvh overflow-hidden flex flex-col bg-gray-50"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-gray-900 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Saltar al contenido
      </a>

      <Header />

      <div className="flex flex-col md:flex-row flex-1 min-h-0 pb-16 md:pb-0">
        <motion.aside
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="hidden md:flex md:w-64 bg-gray-50 flex-col"
          role="navigation"
          aria-label="Navegación principal del perfil"
        >
          <nav className="flex-1 py-12 px-6" aria-label="Menú de perfil">
            <ul className="space-y-1" role="list">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.04 * index }}
                  >
                    <Link
                      to={item.path}
                      aria-current={active ? "page" : undefined}
                      className={`
                        group relative flex items-center gap-3 px-3 py-2.5 rounded-lg
                        text-sm font-medium transition-all duration-200
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                        ${
                          active
                            ? "bg-primary-100 text-primary-700"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary-50 rounded-lg border-l-4 border-primary-600"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon
                        size={20}
                        className={`relative z-10 shrink-0 ${active ? "text-primary-600" : ""}`}
                        strokeWidth={active ? 2.5 : 2}
                        aria-hidden="true"
                      />
                      <span className="relative z-10">{item.label}</span>
                    </Link>
                  </motion.li>
                );
              })}

              <li className="mt-6 border-t border-gray-100 pt-4">
                <button
                  onClick={handleLogout}
                  aria-label="Cerrar sesión y volver al inicio"
                  className="
                    group flex items-center gap-3 w-full px-3 py-2.5 rounded-lg
                    text-sm font-medium text-red-600 transition-all duration-200
                    hover:bg-red-50 hover:text-red-700
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 cursor-pointer
                  "
                >
                  <LogOut
                    size={20}
                    className="shrink-0 group-hover:scale-110 transition-transform"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span>Cerrar Sesión</span>
                </button>
              </li>
            </ul>
          </nav>
        </motion.aside>

        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.08 }}
          id="main-content"
          className="flex-1 min-h-0 overflow-hidden"
          role="main"
          aria-label="Contenido principal"
        >
          <div className="h-full overflow-hidden py-8">
            <Outlet />
          </div>
        </motion.main>
      </div>

      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 safe-area-inset-bottom"
        role="navigation"
        aria-label="Navegación inferior"
      >
        <ul className="flex justify-around items-center h-16 px-4" role="list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path} className="flex-1">
                <Link
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  aria-label={item.label}
                  className={`
                    relative flex flex-col items-center justify-center gap-1 h-full px-2
                    transition-all duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500
                    ${
                      active
                        ? "text-primary-700"
                        : "text-gray-600 active:text-gray-900"
                    }
                  `}
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.5 : 2}
                    className={`transition-transform ${active ? "scale-110" : ""}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`text-xs font-medium leading-none ${active ? "font-semibold" : ""}`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}

          <li className="flex-1">
            <button
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              className="
                relative flex flex-col items-center justify-center gap-1 h-full w-full px-2
                text-red-600 transition-all duration-200
                active:text-red-700
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500
              "
            >
              <LogOut size={22} strokeWidth={2} aria-hidden="true" />
              <span className="text-xs font-medium leading-none">Salir</span>
            </button>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default DashboardCliente;
