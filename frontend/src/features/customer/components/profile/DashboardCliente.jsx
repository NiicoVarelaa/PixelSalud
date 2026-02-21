import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import { User, Heart, ShoppingBag, LogOut } from "lucide-react";
import { Header } from "@components/organisms";
const DashboardCliente = () => {
  const { user, logoutUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/perfil", label: "Mi Perfil", icon: User },
    { path: "/perfil/mis-compras", label: "Mis Compras", icon: ShoppingBag },
    { path: "/perfil/favoritos", label: "Mis Favoritos", icon: Heart },
  ];

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      <Header />
      <div className="flex flex-1 mt-4 overflow-hidden">
        <div className="md:w-64 w-16 border-r border-gray-200 bg-white flex flex-col transition-all duration-300 h-full">
          <div className="flex items-center px-4 gap-3 py-4 border-b border-gray-200">
            <div className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="md:block hidden min-w-0 flex-1">
              <h2 className="font-semibold text-gray-800 text-sm">
                Bienvenido
              </h2>
              <p className="text-xs text-gray-600 truncate">
                {user?.nombre} {user?.apellido}
              </p>
            </div>
          </div>
          <nav className="flex-1 py-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        flex items-center py-3 px-4 gap-3 transition-all duration-200
                        ${
                          isActive(item.path)
                            ? "border-r-4 md:border-r-[6px] bg-primary-50 border-primary-500 text-primary-600"
                            : "hover:bg-primary-100/50 border-white text-gray-600 hover:text-gray-700"
                        }
                      `}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span className="md:block hidden text-center font-medium">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="p-4 border-t border-gray-100 mt-auto">
            <button
              onClick={handleLogout}
              className={`
                flex items-center py-3 px-4 gap-3 w-full text-left transition-all duration-200 cursor-pointer
                hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg
              `}
            >
              <LogOut size={20} className="flex-shrink-0" />
              <span className="md:block hidden font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
        <main className="flex-1 overflow-hidden">
          <div className="p-4 lg:p-8 h-full overflow-auto">
            <div className="bg-gray-50 h-full">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardCliente;
