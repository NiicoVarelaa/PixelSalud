import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import mpLogo from "@/assets/mpLogo.webp";

const ContactSchema = z.object({
  nombre: z.string().min(1, "Nombre completo es requerido."),
  email: z.string().min(1, "Email es requerido.").email("Email no válido."),
  telefono: z.string().min(8, "Teléfono es requerido y debe tener al menos 8 dígitos."),
});

const CheckoutForm = ({ onSubmit, isProcessing }) => {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(ContactSchema),
    mode: "onBlur", 
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
    }
  });

  const onFormError = () => {
    toast.error("Por favor, completa correctamente todos los campos obligatorios.");
  };

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
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
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
      
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FiUser className="w-4 h-4 mr-2 text-primary-600" />
              Datos Personales
            </h3>
            <div className="space-y-4">
              <FormInput name="nombre" label="Nombre Completo" placeholder="Tu nombre completo" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput name="email" label="Email" icon={FiMail} type="email" placeholder="ejemplo@email.com" />
                <FormInput name="telefono" label="Teléfono" icon={FiPhone} type="tel" placeholder="+54 11 1234-5678" />
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiMapPin className="w-4 h-4 mr-2 text-primary-600" />
                  Modalidad de Retiro
              </h3>
              <div className="bg-primary-50 border border-primary-200 text-primary-800 p-3 rounded-lg text-sm font-medium">
                  Compra para <strong>Retiro en Tienda</strong>. No se requiere dirección de envío.
              </div>
          </div>
        </div>

        <div className="flex justify-center sm:justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit" 
            disabled={isProcessing}
            className={`inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-extrabold text-white transition-all duration-300 w-full sm:w-auto shadow-md transform ${
              isProcessing
                ? "bg-gray-300 cursor-not-allowed text-gray-500"
                : "bg-[#009EE3] hover:bg-[#008ACA] hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white/50"></div>
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <img src={mpLogo} alt="MP" className="h-5 md:h-6 w-auto object-contain" />
                <span className="tracking-tight text-base md:text-lg uppercase">MERCADO PAGO</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;