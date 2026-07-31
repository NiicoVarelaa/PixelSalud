import { Link } from "react-router-dom";

const RegistroFooter = () => {
  return (
    <>
      <div className="mt-6 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary-800 underline-offset-2 transition hover:text-primary-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Inicia sesión
        </Link>
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-gray-500">
        Al registrarte, aceptas nuestros{" "}
        <Link
          to="/terminos-condiciones"
          className="text-primary-800 underline-offset-2 transition hover:text-primary-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Términos de servicio
        </Link>{" "}
        y{" "}
        <Link
          to="/terminos-condiciones"
          className="text-primary-800 underline-offset-2 transition hover:text-primary-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Política de privacidad.
        </Link>
      </p>
    </>
  );
};

export default RegistroFooter;
