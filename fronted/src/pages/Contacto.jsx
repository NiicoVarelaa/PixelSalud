import { useState } from "react";
import { FaPaperPlane, FaUser, FaEnvelope, FaComment, FaGlobe, FaAt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const [mensajeEnviado, setMensajeEnviado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setMensajeEnviado(true);
      setFormData({ nombre: "", email: "", mensaje: "" });
      setIsSubmitting(false);
      setTimeout(() => setMensajeEnviado(false), 3000);
    }, 1500);
  };

  // Reemplaza la URL del mapa con la nueva ubicación en Tucumán
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14238.169376662453!2d-65.22683935!3d-26.83226955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94225d3ad7f30f1d%3A0xfc6374a441161726!2sSan%20Miguel%20de%20Tucum%C3%A1n%2C%20Tucum%C3%A1n%20Province%2C%20Argentina!5e0!3m2!1sen!2sus!4v1628045091234!5m2!1sen!2sus";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50"> 
        <div className="container mx-auto px-4 py-12 flex flex-col items-center">
          {/* Encabezado */}
          <div className="text-center mb-10 max-w-2xl">
            <h2 className="text-4xl font-bold text-primary-700 mb-4">Contáctanos</h2> 
            <p className="text-lg text-gray-700 mb-6">
              ¿Tienes preguntas o comentarios? Estamos aquí para ayudarte.
            </p>         
          </div>

          <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8">
            {/* Formulario */}
            <form
              onSubmit={handleSubmit}
              className="w-full lg:w-[48%] bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
            >
              <div className="space-y-6 h-full flex flex-col">
                <div className="flex-grow space-y-6">
                  <div className="relative">
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pt-6 pointer-events-none text-gray-500">
                      <FaUser className="text-sm" />
                    </div>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Correo electrónico
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pt-6 pointer-events-none text-gray-500"> 
                      <FaEnvelope className="text-sm" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent" 
                    />
                  </div>

                  <div className="relative">
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje
                    </label>
                    <div className="absolute top-10 left-3 text-gray-500">
                      <FaComment className="text-sm" />
                    </div>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      rows="5"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      className="w-full min-h-[150px] pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent resize-none" 
                    ></textarea>
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
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

                  {mensajeEnviado && (
                    <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-lg text-sm font-medium">
                      ¡Gracias por contactarnos! Te responderemos a la brevedad.
                    </div>
                  )}
                </div>
              </div>
            </form>

            <div className="w-full lg:w-[48%] bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
              <div className="flex-grow">
                <h3 className="text-xl font-semibold text-primary-700 mb-6">Información de contacto</h3> 
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <FaAt className="text-primary-700 text-lg" /> 
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Correo electrónico</h4>
                      <a href="mailto:contacto@pixelsalud.com" className="text-gray-600 hover:text-primary-700 transition-colors">
                        contacto@pixelsalud.com
                      </a>
                    </div>
                  </div>  

                  <div className="flex items-start">
                    <div className="bg-primary-100 p-3 rounded-full mr-4 flex-shrink-0">
                      <FaClock className="text-primary-700 text-lg" /> 
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700">Horario de atención</h4>
                      <p className="text-gray-600">Lunes a Viernes: 9:00 - 22:00</p>
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
    </div>
  );
};

export default Contacto;