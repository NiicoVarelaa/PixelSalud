import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useCarritoStore } from "@store/useCarritoStore";
import { ModalLogin } from "@features/auth/components";

const Layout = () => {
  const showLoginModal = useCarritoStore((state) => state.showLoginModal);
  const setShowLoginModal = useCarritoStore((state) => state.setShowLoginModal);

  return (
    <>
      {/* Skip Navigation Link - Accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        Saltar al contenido principal
      </a>

      {/* Toast Notifications */}
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
        theme="light"
        className="z-9999"
      />

      {/* Modal de Login */}
      <ModalLogin
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      {/* Main Content Container */}
      <div className="min-h-screen bg-gray-50">
        <main
          id="main-content"
          className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12"
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
