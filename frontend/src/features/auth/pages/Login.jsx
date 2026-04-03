import {
  LoginForm,
  LoginHeader,
  LoginLinks,
} from "@features/auth/components/login";
import { motion } from "framer-motion";
import useLoginForm from "@features/auth/hooks/useLoginForm";

const Login = () => {
  const {
    user,
    isSubmitting,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword,
    goHome,
  } = useLoginForm();

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6"
      role="main"
      aria-label="Pantalla de inicio de sesión"
    >
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-2xl sm:p-8"
        aria-label="Formulario de acceso"
      >
        <LoginHeader onBack={goHome} />
        <LoginForm
          user={user}
          showPassword={showPassword}
          isSubmitting={isSubmitting}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onTogglePassword={togglePassword}
        />
        <LoginLinks />
      </motion.section>
    </main>
  );
};

export default Login;
