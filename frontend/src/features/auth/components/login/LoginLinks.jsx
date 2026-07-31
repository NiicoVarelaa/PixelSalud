import { Link } from "react-router-dom";

const LoginLinks = () => {
  return (
    <nav className="mt-6 space-y-2 text-center" aria-label="Acciones de acceso">
      <p className="text-sm text-gray-600">
        ¿No tienes una cuenta?{" "}
        <Link
          to="/Registro"
          className="font-semibold text-primary-800 underline-offset-2 transition hover:text-primary-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Registrate aqui
        </Link>
      </p>
      <p className="text-sm">
        <Link
          to="/recuperarContraseña"
          className="inline-flex min-h-9 items-center justify-center text-primary-700 underline-offset-2 transition hover:text-primary-900 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
    </nav>
  );
};

export default LoginLinks;
