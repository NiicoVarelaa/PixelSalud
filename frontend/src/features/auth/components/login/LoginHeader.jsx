import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const LoginHeader = ({ onBack }) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="mb-6"
      role="banner"
      aria-labelledby="login-title"
      aria-describedby="login-subtitle"
    >
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-slate-50 hover:text-primary-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
          aria-label="Volver a la página principal"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <h1
          id="login-title"
          className="text-center text-2xl font-extrabold tracking-tight text-primary-700 sm:text-3xl"
        >
          Iniciar Sesión
        </h1>

        <div className="min-h-11 min-w-11" aria-hidden="true" />
      </div>

      <p
        id="login-subtitle"
        className="mt-3 text-center text-sm leading-relaxed text-gray-600 sm:text-base"
      >
        Accede a tu cuenta para continuar
      </p>
    </motion.header>
  );
};

export default LoginHeader;
