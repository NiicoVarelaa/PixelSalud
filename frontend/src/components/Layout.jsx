import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCarritoStore } from '../store/useCarritoStore'; 
import ModalLogin from './ModalLogin';

const Layout = () => {
  const showLoginModal = useCarritoStore((state) => state.showLoginModal);
  const setShowLoginModal = useCarritoStore((state) => state.setShowLoginModal);

  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;