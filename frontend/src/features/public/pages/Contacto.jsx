import { useState, useEffect } from "react";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  AtSign,
  Clock3,
  Tags,
  AlertTriangle,
  X,
  LogIn,
  UserPlus,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Header from "@features/public/components/navigation/Header";
import Footer from "@features/public/components/footer/Footer";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Contacto = () => {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    tipoConsulta: "general",
    asunto: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [authRequiredReason, setAuthRequiredReason] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();
  const userId = user?.idCliente || user?.id || null;

  const TIPOS_REQUIEREN_LOGIN = new Set(["pedido", "receta"]);

  const LABELS_TIPO = {
    general: "Consulta general",
    pedido: "Pedido",
    receta: "Receta",
    facturacion: "Facturacion",
    otro: "Otro",
  };

  const cardEnter = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user?.nombre || "",
        email: user?.email || "",
        tipoConsulta: "general",
        asunto: "",
        mensaje: "",
      });
    } else {
      setFormData({
        nombre: "",
        email: "",
        tipoConsulta: "general",
        asunto: "",
        mensaje: "",
      });
    }
  }, [user]);

  const validarNombre = (nombre) => {
    const trimmedNombre = nombre.trim();
    if (!trimmedNombre) return "El nombre es obligatorio";
    if (trimmedNombre.length < 2)
      return "El nombre debe tener al menos 2 caracteres";
    if (trimmedNombre.length > 100)
      return "El nombre no puede tener más de 100 caracteres";
    return "";
  };

  const validarEmail = (email) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return "El correo electrónico es obligatorio";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail))
      return "El correo electrónico no es válido";
    if (trimmedEmail.length > 100)
      return "El correo electrónico no puede tener más de 100 caracteres";
    return "";
  };

  const validarAsunto = (asunto) => {
    const trimmedAsunto = asunto.trim();
    if (trimmedAsunto.length > 200)
      return "El asunto no puede tener más de 200 caracteres";
    return "";
  };

  const validarMensaje = (mensaje) => {
    const trimmedMensaje = mensaje.trim();
    if (!trimmedMensaje) return "El mensaje es obligatorio";
    if (trimmedMensaje.length < 10)
      return "El mensaje debe tener al menos 10 caracteres";
    if (trimmedMensaje.length > 1000)
      return "El mensaje no puede tener más de 1000 caracteres";
    if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(trimmedMensaje))
      return "El mensaje debe contener al menos algunas letras";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiereLogin = TIPOS_REQUIEREN_LOGIN.has(formData.tipoConsulta);
    if (!userId && requiereLogin) {
      setAuthRequiredReason(
        LABELS_TIPO[formData.tipoConsulta] || "esta consulta",
      );
      setShowModal(true);
      return;
    }

    const nombreError = validarNombre(formData.nombre);
    const emailError = validarEmail(formData.email);
    const asuntoError = validarAsunto(formData.asunto);
    const mensajeError = validarMensaje(formData.mensaje);

    const nextErrors = {
      nombre: nombreError,
      email: emailError,
      asunto: asuntoError,
      mensaje: mensajeError,
    };

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) {
      setErrors(nextErrors);
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await axios.post(`${apiUrl}/mensajes/crear`, {
        ...(userId ? { idCliente: userId } : {}),
        nombre: formData.nombre.trim(),
        email: formData.email.trim(),
        tipoConsulta: formData.tipoConsulta,
        asunto: formData.asunto.trim(),
        mensaje: formData.mensaje.trim(),
      });
      setFormData({
        nombre: user?.nombre || "",
        email: user?.email || "",
        tipoConsulta: "general",
        asunto: "",
        mensaje: "",
      });
      setErrors({});
      toast.success("¡Mensaje enviado correctamente!");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      toast.error("No se pudo enviar el mensaje. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.751939871542!2d-65.20793688495086!3d-26.81603598316744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad7f30f61%3A0x880ef21f4358844!2sPlaza%20Independencia!5e0!3m2!1ses-419!2sar!4v1615832094258!5m2!1ses-419!2sar";

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      setShowModal(false);
      setAuthRequiredReason("");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="my-12 w-full max-w-7xl mx-auto lg:px-8">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={cardEnter}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mb-8 sm:p-6"
          aria-labelledby="contacto-title"
        >
          <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary-50  py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
            Soporte Pixel Salud
          </p>
          <h1
            id="contacto-title"
            className="text-balance text-2xl font-bold leading-tight text-slate-900 sm:text-3xl"
          >
            Contáctanos
          </h1>
          <p className="mt-3  text-sm leading-relaxed text-slate-600 sm:text-base">
            Resolvemos dudas de compras, productos y facturación. Si tu consulta
            es sobre pedido o receta, te pediremos iniciar sesión para proteger
            tus datos.
          </p>
        </motion.section>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:items-start">
          <motion.section
            initial="hidden"
            animate="visible"
            variants={cardEnter}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-7"
            aria-labelledby="formulario-title"
          >
            <h2
              id="formulario-title"
              className="text-lg font-semibold text-slate-900"
            >
              Envíanos tu consulta
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Completá el formulario y te responderemos a la brevedad.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="mt-5 space-y-4 sm:space-y-5"
              aria-label="Formulario de contacto"
            >
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Nombre
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.nombre)}
                    aria-describedby={
                      errors.nombre ? "nombre-error" : undefined
                    }
                    className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary-500/60 active:scale-[0.998] ${
                      errors.nombre
                        ? "border-red-400 focus-visible:border-red-500"
                        : "border-slate-300 focus-visible:border-primary-600"
                    }`}
                    placeholder="Tu nombre"
                    maxLength="100"
                  />
                </div>
                {errors.nombre && (
                  <p
                    id="nombre-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
                    role="alert"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary-500/60 active:scale-[0.998] ${
                      errors.email
                        ? "border-red-400 focus-visible:border-red-500"
                        : "border-slate-300 focus-visible:border-primary-600"
                    }`}
                    placeholder="tuemail@ejemplo.com"
                    maxLength="100"
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
                    role="alert"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {errors.email}
                  </p>
                )}
              </div>

              <fieldset className="space-y-1.5">
                <label
                  htmlFor="tipoConsulta"
                  className="block text-sm font-medium text-slate-700"
                >
                  Tipo de consulta
                </label>
                <div className="relative">
                  <Tags className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <select
                    id="tipoConsulta"
                    name="tipoConsulta"
                    value={formData.tipoConsulta}
                    onChange={handleChange}
                    aria-label="Seleccionar tipo de consulta"
                    className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-9 pr-8 text-sm text-slate-900 outline-none transition focus-visible:border-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500/60"
                  >
                    <option value="general">Consulta general</option>
                    <option value="pedido">Pedido (requiere cuenta)</option>
                    <option value="receta">Receta (requiere cuenta)</option>
                    <option value="facturacion">Facturación</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                {!userId &&
                  TIPOS_REQUIEREN_LOGIN.has(formData.tipoConsulta) && (
                    <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      Para consultas de pedido o receta, necesitas iniciar
                      sesión.
                    </p>
                  )}
              </fieldset>

              <div>
                <label
                  htmlFor="asunto"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Asunto
                </label>
                <div className="relative">
                  <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    id="asunto"
                    name="asunto"
                    value={formData.asunto || ""}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.asunto)}
                    aria-describedby={
                      errors.asunto ? "asunto-error" : undefined
                    }
                    className={`h-11 w-full rounded-xl border bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary-500/60 active:scale-[0.998] ${
                      errors.asunto
                        ? "border-red-400 focus-visible:border-red-500"
                        : "border-slate-300 focus-visible:border-primary-600"
                    }`}
                    placeholder="Motivo del mensaje (opcional)"
                    maxLength="200"
                  />
                </div>
                {errors.asunto && (
                  <p
                    id="asunto-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
                    role="alert"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {errors.asunto}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <label
                    htmlFor="mensaje"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Mensaje <span className="text-red-600">*</span>
                  </label>
                  <span className="text-xs text-slate-500" aria-live="polite">
                    {formData.mensaje.length}/1000
                  </span>
                </div>
                <div className="relative">
                  <MessageSquare className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    rows="5"
                    value={formData.mensaje}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.mensaje)}
                    aria-describedby={
                      errors.mensaje ? "mensaje-error" : undefined
                    }
                    className={`w-full resize-none rounded-xl border bg-white pl-9 pr-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary-500/60 ${
                      errors.mensaje
                        ? "border-red-400 focus-visible:border-red-500"
                        : "border-slate-300 focus-visible:border-primary-600"
                    }`}
                    placeholder="Escribe tu mensaje aquí..."
                    maxLength="1000"
                  />
                </div>
                {errors.mensaje && (
                  <p
                    id="mensaje-error"
                    className="mt-1.5 flex items-center gap-1 text-xs text-red-600"
                    role="alert"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {errors.mensaje}
                  </p>
                )}
              </div>

              <motion.button
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-primary-700 bg-primary-700 px-4 text-sm font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70 active:bg-primary-900 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-20"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Enviar mensaje</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.section>

          <motion.aside
            initial="hidden"
            animate="visible"
            variants={cardEnter}
            transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-5"
            aria-labelledby="info-contacto-title"
          >
            <h2
              id="info-contacto-title"
              className="text-lg font-semibold text-slate-900"
            >
              Información de contacto
            </h2>

            <div className="mt-4 space-y-4">
              <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-primary-100 p-2 text-primary-700">
                    <AtSign className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Email
                    </h3>
                    <a
                      href="mailto:contacto@pixelsalud.com"
                      className="text-sm text-slate-600 underline-offset-2 transition hover:text-primary-700 hover:underline focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60"
                    >
                      contacto@pixelsalud.com
                    </a>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start gap-3">
                  <span className="rounded-lg bg-primary-100 p-2 text-primary-700">
                    <Clock3 className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Horario
                    </h3>
                    <p className="text-sm text-slate-600">
                      Lunes a Viernes: 9:00 - 22:00
                    </p>
                    <p className="text-sm text-slate-600">
                      Sábados: 10:00 - 18:00
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div className="mt-5 border-t border-slate-200 pt-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Ubicación
              </h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Ubicación de Pixel Salud en San Miguel de Tucumán"
                />
              </div>
            </div>
          </motion.aside>
        </div>
      </main>
      <Footer />
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="modal-backdrop"
            onClick={handleOutsideClick}
            className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="auth-modal-title"
              aria-describedby="auth-modal-description"
              className="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute right-3 top-3 rounded-full p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>

              <h3
                id="auth-modal-title"
                className="text-lg font-semibold text-slate-900"
              >
                Inicia sesión para continuar
              </h3>
              <p
                id="auth-modal-description"
                className="mt-2 text-sm text-slate-600"
              >
                Para enviar una consulta sobre{" "}
                {authRequiredReason || "pedido o receta"}, debes iniciar sesión
                o registrarte.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary-700 bg-white px-3 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 active:bg-primary-100"
                >
                  <LogIn className="h-4 w-4" />
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate("/registro")}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary-700 bg-primary-700 px-3 text-sm font-semibold text-white transition hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60 active:bg-primary-900"
                >
                  <UserPlus className="h-4 w-4" />
                  Registrarse
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contacto;
