import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import profileIcon from "@assets/iconos/profile_icon.png";
import logoutIcon from "@assets/iconos/logout.png";

const ProfileDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logoutUser } = useAuthStore();

  const handleLogout = () => {
    logoutUser();
    onClose();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="group relative">
      <button
        onClick={() => onClose(!isOpen)}
        className="w-6 h-6 cursor-pointer text-gray-700 hover:text-primary-700 transition-colors duration-200 flex items-center justify-center"
        aria-label="Abrir menú de perfil"
      >
        <img src={profileIcon} className="w-5 cursor-pointer" alt="profileIcon" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10 overflow-hidden animate-fadeIn">
          <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500">Conectado como:</p>
            <p className="text-sm font-bold text-gray-800 truncate">
              {user.nombre} {user.apellido}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 cursor-pointer"
          >
            <img src={logoutIcon} className="w-5 cursor-pointer" alt="logoutIcon" />
            Cerrar Sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
