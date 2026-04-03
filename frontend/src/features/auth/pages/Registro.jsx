import { motion } from "framer-motion";
import {
  RegistroFooter,
  RegistroForm,
  RegistroGoogleButton,
  RegistroHeader,
} from "@features/auth/components/registro";
import useRegistroForm from "@features/auth/hooks/useRegistroForm";

const Registro = () => {
  const {
    form,
    isSubmitting,
    showPassword,
    handleChange,
    togglePassword,
    handleSubmit,
    handleGoogleRegister,
    goToLogin,
  } = useRegistroForm();

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-6 sm:px-6"
      role="main"
      aria-label="Registro de cuenta"
    >
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-xl transition-all duration-300 hover:shadow-2xl sm:p-8"
        aria-labelledby="registro-title"
      >
        <RegistroHeader onBack={goToLogin} />
        <RegistroForm
          form={form}
          showPassword={showPassword}
          isSubmitting={isSubmitting}
          onChange={handleChange}
          onTogglePassword={togglePassword}
          onSubmit={handleSubmit}
        />
        <RegistroGoogleButton onClick={handleGoogleRegister} />
        <RegistroFooter />
      </motion.section>
    </main>
  );
};

export default Registro;
