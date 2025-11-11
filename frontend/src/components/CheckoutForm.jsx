import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiMapPin } from "react-icons/fi";

// 1. Esquema de Validación Zod (Definición de Contacto)
const ContactSchema = z.object({
  nombre: z.string().min(1, "Nombre completo es requerido."),
  email: z.string().min(1, "Email es requerido.").email("Email no válido."),
  telefono: z.string().min(8, "Teléfono es requerido y debe tener al menos 8 dígitos."),
});

const CheckoutForm = ({ onSubmit, isProcessing }) => {
  
  // 2. Inicialización de React Hook Form
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid } 
  } = useForm({
    resolver: zodResolver(ContactSchema),
    mode: "onBlur", 
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
    }
  });

  // Función auxiliar para renderizar el input
  const FormInput = ({ name, label, icon: Icon, type = "text", placeholder }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {Icon && <Icon className="w-4 h-4 inline mr-1" />}
        {label} *
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
          errors[name] ? "border-red-500" : "border-gray-200"
        }`}
      />
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">
          {errors[name].message}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
          <FiUser className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Datos de Contacto
          </h2>
          <p className="text-gray-500 text-sm">
            Información requerida para la compra y notificación de retiro.
          </p>
        </div>
      </div>
      
      

      {/* 3. Formulario principal envuelto por RHF handleSubmit */}
      <form onSubmit={handleSubmit(onSubmit)}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiUser className="w-4 h-4 mr-2 text-primary-600" />
              Datos Personales
            </h3>
            <div className="space-y-4">
              
              <FormInput 
                name="nombre" 
                label="Nombre Completo" 
                placeholder="Tu nombre completo"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput 
                  name="email" 
                  label="Email" 
                  icon={FiMail} 
                  type="email" 
                  placeholder="ejemplo@email.com"
                />
                <FormInput 
                  name="telefono" 
                  label="Teléfono" 
                  icon={FiPhone} 
                  type="tel" 
                  placeholder="+54 11 1234-5678"
                />
              </div>
            </div>
          </div>
          
          {/* 4. Mensaje de Modalidad (Retiro) */}
          <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="w-4 h-4 mr-2 text-primary-600" />
                  Modalidad de Retiro
              </h3>
              <div className="bg-primary-50 border border-primary-200 text-primary-800 p-3 rounded-lg text-sm font-medium">
                  Compra para **Retiro en Tienda**. No se requiere dirección de envío.
              </div>
          </div>
        </div>

        {/* 5. Botones */}
        <div className="flex justify-end items-center mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit" 
            disabled={isProcessing}
            className={`inline-flex items-center px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
              isProcessing || !isValid // Deshabilita si procesando o inválido
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            <FiCreditCard className="w-5 h-5 mr-2" />
            {isProcessing ? "Procesando..." : "Continuar al Pago"}
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default CheckoutForm;