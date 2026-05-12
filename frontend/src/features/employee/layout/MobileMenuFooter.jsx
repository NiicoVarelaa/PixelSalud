import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import logoutIcon from "@assets/iconos/logout.png";
import profileIcon from "@assets/iconos/profile_icon.png";

const MobileMenuFooter = ({ isAuthorized, onClose }) => {
  const navigate = useNavigate();
  const { logoutUser } = useAuthStore();

  const handleLogout = () => {
    logoutUser();
    onClose();
    navigate("/login");
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
      {isAuthorized ? (
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
        >
          <img src={logoutIcon} className="w-5 cursor-pointer" alt="logoutIcon" />
          Cerrar Sesión
        </button>
      ) : (
        <button
          onClick={() => {
            onClose();
            navigate("/login");
          }}
          className="flex items-center gap-3 py-3 px-4 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-green-700 transition-colors duration-200"
        >
          <img src={profileIcon} className="w-5 cursor-pointer" alt="profileIcon" />
          Iniciar Sesión
        </button>
      )}
    </div>
  );
};

export default MobileMenuFooter;
