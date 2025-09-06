import { useState, useEffect } from "react";
import {
  FiX,
  FiCreditCard,
  FiUser,
  FiMail,
  FiCalendar,
  FiLock,
  FiCheckCircle
} from "react-icons/fi";

const ModalTarjetaCredito = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    numero: "",
    vencimiento: "",
    cvv: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        nombre: "",
        email: "",
        numero: "",
        vencimiento: "",
        cvv: ""
      });
      setErrors({});
      setSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "numero") {
      const formattedValue = value
        .replace(/\s?/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setFormData({...formData, [name]: formattedValue});
      return;
    }
    if (name === "vencimiento") {
      const formattedValue = value
        .replace(/^(\d{2})(\d)/g, '$1/$2')
        .replace(/\/\//g, '/');
      setFormData({...formData, [name]: formattedValue});
      return;
    }
    
    setFormData({...formData, [name]: value});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = "Nombre completo es requerido";
    if (!formData.email.trim()) {
      newErrors.email = "Correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico no válido";
    }
    if (!formData.numero.trim()) {
      newErrors.numero = "Número de tarjeta es requerido";
    } else if (!/^(\d{4}\s?){4}$/.test(formData.numero.trim())) {
      newErrors.numero = "Número de tarjeta no válido";
    }
    if (!formData.vencimiento.trim()) {
      newErrors.vencimiento = "Fecha de vencimiento es requerida";
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(formData.vencimiento)) {
      newErrors.vencimiento = "Formato MM/AA requerido";
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV es requerido";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV no válido";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));      
      const payload = {
        cardholder_name: formData.nombre,
        email: formData.email,
        card_number: formData.numero.replace(/\s/g, ''),
        expiration_date: formData.vencimiento,
        security_code: formData.cvv
      };      
      onConfirm(payload);
      setSuccess(true);      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error al procesar el pago:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
        {/* Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
          aria-label="Cerrar modal"
        >
          <FiX size={24} />
        </button>

        {success ? (
          <div className="text-center py-8">
            <FiCheckCircle className="mx-auto text-green-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pago exitoso</h2>
            <p className="text-gray-600">Tu pago ha sido procesado correctamente.</p>
          </div>
        ) : (
          <>
            {/* Título */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-full">
                <FiCreditCard className="text-green-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">Pago con Tarjeta</h2>
                <p className="text-sm text-gray-500">Ingresa los datos de tu tarjeta</p>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className={`flex items-center border ${errors.nombre ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all`}>
                  <FiUser className={`${errors.nombre ? 'text-red-500' : 'text-gray-400'} mr-2`} />
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre completo como aparece en la tarjeta"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="flex-1 outline-none placeholder-gray-400"
                    autoComplete="cc-name"
                  />
                </div>
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <div className={`flex items-center border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all`}>
                  <FiMail className={`${errors.email ? 'text-red-500' : 'text-gray-400'} mr-2`} />
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleChange}
                    className="flex-1 outline-none placeholder-gray-400"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className={`flex items-center border ${errors.numero ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all`}>
                  <FiCreditCard className={`${errors.numero ? 'text-red-500' : 'text-gray-400'} mr-2`} />
                  <input
                    type="text"
                    name="numero"
                    placeholder="1234 5678 9012 3456"
                    value={formData.numero}
                    onChange={handleChange}
                    className="flex-1 outline-none placeholder-gray-400"
                    maxLength={19}
                    autoComplete="cc-number"
                  />
                </div>
                {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className={`flex items-center border ${errors.vencimiento ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all`}>
                    <FiCalendar className={`${errors.vencimiento ? 'text-red-500' : 'text-gray-400'} mr-2`} />
                    <input
                      type="text"
                      name="vencimiento"
                      placeholder="MM/AA"
                      value={formData.vencimiento}
                      onChange={handleChange}
                      className="flex-1 outline-none placeholder-gray-400"
                      maxLength={5}
                      autoComplete="cc-exp"
                    />
                  </div>
                  {errors.vencimiento && <p className="text-red-500 text-xs mt-1">{errors.vencimiento}</p>}
                </div>
                <div>
                  <div className={`flex items-center border ${errors.cvv ? 'border-red-500' : 'border-gray-200'} rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all`}>
                    <FiLock className={`${errors.cvv ? 'text-red-500' : 'text-gray-400'} mr-2`} />
                    <input
                      type="text"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      className="flex-1 outline-none placeholder-gray-400"
                      maxLength={4}
                      autoComplete="cc-csc"
                    />
                  </div>
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              {/* Información de seguridad */}
              <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <FiLock className="text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600">
                  Tus datos están protegidos con encriptación SSL. No almacenamos la información de tu tarjeta.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                {/* Botón cancelar */}
                <button
                  onClick={onClose}
                  type="button" // Use type="button" to prevent form submission
                  className="px-4 py-2 bg-white text-primary-700 hover:bg-primary-100 transition-all rounded-lg cursor-pointer border border-primary-700 hover:border-primary-700 shadow-sm hover:shadow-md"
                >
                  Cancelar
                </button>

                {/* Botón confirmar */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border shadow-sm cursor-pointer ${
                    isSubmitting ? 'bg-green-400 text-white' : 'bg-green-600 hover:bg-green-700 text-white border-green-600 hover:border-green-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Procesando...
                    </>
                  ) : (
                    "Confirmar pago"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ModalTarjetaCredito;