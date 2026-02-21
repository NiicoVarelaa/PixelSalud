import { useState, useEffect } from "react";
import {
  FaPaperPlane,
  FaUser,
  FaEnvelope,
  FaComment,
  FaAt,
  FaClock,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Header, Footer } from "@components/organisms";
import { MiniBanner } from "@components/organisms/banners";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";

const Contacto = () => {
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        asunto: "",
        mensaje: "",
      });
    } else {
      setFormData({ nombre: "", email: "", asunto: "", mensaje: "" });
    }
  }, [user]);

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
    if (!user) {
      setShowModal(true);
      return;
    }

    const mensajeError = validarMensaje(formData.mensaje);
    if (mensajeError) {
      setErrors({ mensaje: mensajeError });
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/mensajes/crear", {
        idCliente: user.id,
        nombre: formData.nombre,
        email: formData.email,
        asunto: formData.asunto || `Consulta de ${user.nombre}`,
        mensaje: formData.mensaje,
      });
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
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
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <MiniBanner />
      <Header />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto py-12 flex flex-col items-center">
          <div className="text-center mb-10 max-w-2xl">
            <h2 className="text-4xl font-bold text-primary-700 mb-4">
              Contáctanos
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              ¿Tienes preguntas o comentarios? Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
            <form
              onSubmit={handleSubmit}
              className="w-full lg:w-[48%] bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
            >
              <div className="space-y-6 h-full flex flex-col">
                <div className="flex-grow space-y-6">
                  {/* Nombre Input */}
                  <div>
                    <label
                      htmlFor="nombre"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nombre
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaUser className="text-sm" />
                      </div>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        readOnly={!!user}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                          errors.nombre
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary-600"
                        } ${!user ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="Inicia sesión para autocompletar"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaEnvelope className="text-sm" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        readOnly={!!user}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                          errors.email
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary-600"
                        } ${!user ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="Inicia sesión para autocompletar"
                      />
                    </div>
                  </div>

                  {/* Asunto Input */}
                  <div>
                    <label
                      htmlFor="asunto"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Asunto
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaAt className="text-sm" />
                      </div>
                      <input
                        type="text"
                        id="asunto"
                        name="asunto"
                        value={formData.asunto || ""}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                          errors.asunto
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary-600"
                        }`}
                        placeholder="Motivo del mensaje (opcional)"
                        maxLength="100"
                      />
                    </div>
                  </div>

                  {/* Mensaje Input */}
                  <div>
                    <label
                      htmlFor="mensaje"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Mensaje *{" "}
                      <span className="text-gray-500 text-xs">
                        ({formData.mensaje.length}/1000)
                      </span>
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <FaComment className="text-lg" />
                      </div>
                      <textarea
                        id="mensaje"
                        name="mensaje"
                        rows="5"
                        value={formData.mensaje}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-colors ${
                          errors.mensaje
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-primary-600"
                        }`}
                        placeholder="Escribe tu mensaje aquí..."
                        maxLength="1000"
                      ></textarea>
                    </div>
                    {errors.mensaje && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <FaExclamationTriangle className="mr-1 text-xs" />
                        <span>{errors.mensaje}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-primary-700 text-white py-3 rounded-lg hover:bg-primary-800 transition duration-300 font-medium flex items-center justify-center space-x-2 cursor-pointer ${
                      isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Enviando...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Enviar mensaje</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="w-full lg:w-[48%] bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-primary-700 mb-6">
                  Información de contacto
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <FaAt className="text-primary-700 text-lg" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">
                        Correo electrónico
                      </h4>
                      <a
                        href="mailto:contacto@pixelsalud.com"
                        className="text-gray-600 hover:text-primary-700 transition-colors"
                      >
                        contacto@pixelsalud.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <FaClock className="text-primary-700 text-lg" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">
                        Horario de atención
                      </h4>
                      <p className="text-gray-600">
                        Lunes a Viernes: 9:00 - 22:00
                      </p>
                      <p className="text-gray-600">Sábados: 10:00 - 18:00</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Ubicación</h4>
                <div className="rounded-lg overflow-hidden h-60 w-full shadow-lg border border-gray-200">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Ubicación de Pixel Salud en San Miguel de Tucumán"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showModal && (
        <div
          id="modal-backdrop"
          onClick={handleOutsideClick}
          className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
        >
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 text-center relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              aria-label="Cerrar modal"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Necesitas una cuenta
            </h3>
            <p className="text-gray-600 mb-6">
              Para enviar un mensaje debes iniciar sesión o registrarte.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 font-medium bg-white text-primary-700 hover:bg-primary-100 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer border-2 border-primary-700 hover:border-primary-700 shadow-sm hover:shadow-md"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate("/registro")}
                className="px-4 py-2 font-medium bg-primary-700 text-white hover:bg-primary-800 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-primary-600 hover:border-primary-700 shadow-sm hover:shadow-md"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacto;
