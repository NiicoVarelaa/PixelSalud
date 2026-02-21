import { useNavigate } from 'react-router-dom';
// 1. Importamos el nuevo ícono FiX
import { FiX } from 'react-icons/fi';
import { MdLogin } from "react-icons/md";

const ModalLogin = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) {
    return null;
  }

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        
        className="relative flex flex-col items-center bg-white shadow-lg rounded-xl py-6 px-5 md:w-[460px] w-full max-w-[370px] border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="flex items-center justify-center p-4 bg-primary-100 rounded-full">
          <MdLogin className="w-6 h-6 text-primary-700" />
        </div>
        <h2 className="text-gray-900 font-semibold mt-4 text-xl">
          ¡Un momento!
        </h2>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Para agregar productos al carrito, primero debes iniciar sesión.
        </p>
        <div className="flex items-center justify-center gap-4 mt-5 w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-full md:w-36 h-10 rounded-lg border-2 border-primary-700 bg-white text-primary-700 font-medium text-sm hover:bg-primary-100 active:scale-95 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="w-full md:w-36 h-10 rounded-lg text-white bg-primary-700 font-medium text-sm hover:bg-primary-800 active:scale-95 transition cursor-pointer"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;