import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import apiClient from "@utils/apiClient";
import LogoPixelSalud from "@assets/LogoPixelSalud.webp";
import {
  Menu,
  User,
  LogOut,
  X,
  Bell,
  Home,
  Package,
  Users,
  Briefcase,
  BarChart2,
} from "lucide-react";

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [recentMessages, setRecentMessages] = useState([]);
  const menuRef = useRef(null);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Obtener mensajes no leídos
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await apiClient.get("/mensajes/no-leidos");
        setUnreadMessages(response.data.count || 0);
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
      }
    };

    const fetchRecentMessages = async () => {
      try {
        const response = await apiClient.get(
          "/mensajes/recientes-no-leidos?limit=5",
        );
        setRecentMessages(response.data.mensajes || []);
      } catch (error) {
        console.error("Error al obtener mensajes recientes:", error);
      }
    };

    if (user) {
      fetchUnreadMessages();
      fetchRecentMessages();
      // Actualizar cada 30 segundos
      const interval = setInterval(() => {
        fetchUnreadMessages();
        fetchRecentMessages();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsProfileDropdownOpen(false);
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    setIsProfileDropdownOpen(false);
    setIsMenuOpen(false);
    navigate("/login");
  };

  const isAuthorized =
    user && (user.rol === "admin" || user.rol === "empleado");

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
      {/* Contenedor principal con altura fija */}
      <div className="h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full max-w-[1920px] mx-auto">
          {/* IZQUIERDA: Logo */}
          <div className="flex items-center">
            <Link to="/admin" className="flex items-center">
              <img
                className="h-8 w-auto transition-transform hover:scale-105"
                src={LogoPixelSalud}
                alt="Pixel Salud"
              />
            </Link>
          </div>

          {/* DERECHA: Acciones */}
          <div className="flex items-center gap-2">
            {isAuthorized && (
              <>
                {/* Notificaciones - Funcional con mensajes */}
                <div className="relative" ref={notificationsRef}>
                  <button
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Notificaciones"
                  >
                    <Bell size={20} />
                    {unreadMessages > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Dropdown de notificaciones */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-fadeIn z-50">
                      {/* Header */}
                      <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-gray-900">
                            Notificaciones
                          </h3>
                          {unreadMessages > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {unreadMessages}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Lista de mensajes */}
                      <div className="max-h-96 overflow-y-auto">
                        {recentMessages.length > 0 ? (
                          recentMessages.map((mensaje) => (
                            <button
                              key={mensaje.idMensaje}
                              onClick={() => {
                                navigate(`/admin/mensajes`);
                                setIsNotificationsOpen(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                                  {mensaje.nombre?.charAt(0) || "?"}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <p className="text-sm font-semibold text-gray-900 truncate">
                                      {mensaje.nombre}
                                    </p>
                                    <span className="text-xs text-gray-500 flex-shrink-0">
                                      {new Date(
                                        mensaje.fechaEnvio,
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-gray-700 truncate">
                                    {mensaje.asunto || "Sin asunto"}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    {mensaje.mensaje}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <Bell
                              size={32}
                              className="mx-auto text-gray-300 mb-2"
                            />
                            <p className="text-sm text-gray-500">
                              No hay mensajes nuevos
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer con botón "Ver todos" */}
                      <div className="border-t border-gray-200 bg-gray-50">
                        <button
                          onClick={() => {
                            navigate("/admin/mensajes");
                            setIsNotificationsOpen(false);
                          }}
                          className="w-full px-4 py-3 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                        >
                          Ver todos los mensajes
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Separador vertical */}
                <div className="hidden sm:block w-px h-6 bg-gray-200"></div>

                {/* Perfil dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 
                                  flex items-center justify-center text-white text-sm font-bold shadow-sm"
                    >
                      {user?.nombre?.charAt(0)}
                      {user?.apellido?.charAt(0)}
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold text-gray-900 leading-tight">
                        {user?.nombre} {user?.apellido}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {user?.rol}
                      </div>
                    </div>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
                      {/* Header del perfil */}
                      <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 
                                        flex items-center justify-center text-white font-bold shadow-md"
                          >
                            {user?.nombre?.charAt(0)}
                            {user?.apellido?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {user?.nombre} {user?.apellido}
                            </p>
                            <p className="text-xs text-gray-600 capitalize">
                              {user?.rol}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Opciones */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            navigate("/admin/perfil");
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 
                                   hover:bg-gray-50 transition-colors"
                        >
                          <User size={16} />
                          Mi Perfil
                        </button>
                      </div>

                      {/* Cerrar sesión */}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 
                                   hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Menú hamburguesa móvil */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Menú"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL LATERAL (Drawer) */}
      <div
        className={`fixed inset-0 z-50 ${isMenuOpen ? "" : "pointer-events-none"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel lateral */}
        <div
          ref={menuRef}
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header del drawer */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <img className="h-6" src={LogoPixelSalud} alt="Logo" />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navegación */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-1">
              <button
                onClick={() => {
                  navigate("/admin");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Home size={20} />
                <span className="font-medium">Inicio</span>
              </button>
              <button
                onClick={() => {
                  navigate("/admin/MenuProductos");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Package size={20} />
                <span className="font-medium">Productos</span>
              </button>
              <button
                onClick={() => {
                  navigate("/admin/MenuClientes");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Users size={20} />
                <span className="font-medium">Clientes</span>
              </button>
              <button
                onClick={() => {
                  navigate("/admin/MenuEmpleados");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Briefcase size={20} />
                <span className="font-medium">Empleados</span>
              </button>
              <button
                onClick={() => {
                  navigate("/admin/MenuVentas");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <BarChart2 size={20} />
                <span className="font-medium">Ventas</span>
              </button>
            </div>
          </nav>

          {/* Footer del drawer - Perfil y Logout */}
          {isAuthorized && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-3 mb-3 p-3 bg-white rounded-lg">
                <div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 
                              flex items-center justify-center text-white text-sm font-bold"
                >
                  {user?.nombre?.charAt(0)}
                  {user?.apellido?.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.rol}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full p-3 rounded-lg bg-red-500 text-white 
                         font-medium hover:bg-red-600 transition-colors"
              >
                <LogOut size={18} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
