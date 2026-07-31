import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import axios from "axios";

const RecuperarContrasena = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(`${apiUrl}/clientes/olvide-password`, { email });
      toast.success("¡Correo enviado! Revisa tu bandeja de entrada.");
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.error || "Error al enviar el correo.");
      } else {
        toast.error("Error al conectar con el servidor.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6"
      role="main"
      aria-label="Recuperar contraseña"
    >
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-lg transition-all duration-300 hover:shadow-2xl sm:p-8"
        aria-labelledby="recover-title"
        aria-describedby="recover-subtitle"
      >
        <div className="mb-6 grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-all duration-200 hover:border-primary-700 hover:bg-slate-50 hover:text-primary-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            aria-label="Volver atrás"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <h1
            id="recover-title"
            className="text-center text-2xl font-extrabold tracking-tight text-primary-700 sm:text-3xl"
          >
            Recuperar Contrasena
          </h1>
          <div className="min-h-11 min-w-11" aria-hidden="true" />
        </div>

        <p
          id="recover-subtitle"
          className="mb-6 text-center text-sm leading-relaxed text-gray-600 sm:text-base"
        >
          Ingresa tu correo electronico para recibir un enlace de recuperacion.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700"
            >
              Correo electronico
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                className="h-11 w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 transition duration-200 focus:border-primary-700 focus:outline-none focus:ring focus:ring-primary-600/60 disabled:cursor-not-allowed disabled:bg-slate-50"
                required
                aria-required="true"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className={`flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-primary-700 bg-primary-700 py-3 text-sm font-semibold text-white shadow-md transition duration-300 hover:bg-primary-800 hover:shadow-lg active:scale-[0.995] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 focus-visible:ring-offset-2 ${
              isSubmitting ? "cursor-not-allowed opacity-75" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" aria-hidden="true" />
                <span>Enviar enlace de recuperacion</span>
              </>
            )}
          </button>
        </form>
      </motion.section>
    </main>
  );
};

export default RecuperarContrasena;
