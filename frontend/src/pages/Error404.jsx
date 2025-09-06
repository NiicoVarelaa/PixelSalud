import { Link } from "react-router-dom";

const Error404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-50 text-sm">
      <h1 className="text-[6rem] sm:text-[8rem] font-bold text-primary-700">404</h1>
      <div className="h-1 w-20 rounded bg-primary-700 my-6"></div>

      <p className="text-2xl sm:text-3xl font-semibold text-gray-800">Página no encontrada</p>
      <p className="text-base sm:text-lg mt-4 text-gray-600 max-w-md">
        Lo sentimos, la página que buscas no existe, ha sido movida o está temporalmente fuera de servicio.
      </p>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <Link
          to="/"
          className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-2.5 rounded-lg shadow-md transition-all duration-200 active:scale-95"
          aria-label="Volver al inicio"
        >
          Volver al inicio
        </Link>
        <Link
          to="/contacto"
          className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-100 transition-all duration-200 active:scale-95"
          aria-label="Contactar soporte"
        >
          Contactar soporte
        </Link>
      </div>
    </div>
  );
};

export default Error404;
