import { useState } from "react";
import apiClient from "../utils/apiClient";
import { 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  ArrowLeft,
  ScanText,
  Eye,       
  EyeOff,    
  Loader2    
} 
from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify"; 

const Registro = () => {
  const [form, setForm] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    email: "", // Usamos 'email' internamente
    contraCliente: "",
    dni: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    
    // Solo números para el DNI
    if (name === 'dni') {
        newValue = value.replace(/\D/g, '');
    }

    setForm(prevForm => ({ ...prevForm, [name]: newValue }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas antes de enviar
    if (!form.nombreCliente || !form.apellidoCliente || !form.email || !form.contraCliente || !form.dni) {
        toast.warning("Por favor completa todos los campos.");
        return;
    }

    setIsSubmitting(true);
    
    // Preparamos el objeto EXACTO que espera el backend
    const dataToSend = {
        nombreCliente: form.nombreCliente.trim(),
        apellidoCliente: form.apellidoCliente.trim(),
        emailCliente: form.email.toLowerCase().trim(), // Mapeo clave: email -> emailCliente
        contraCliente: form.contraCliente,
        dni: form.dni
    };

    try {
      const res = await apiClient.post("/registroCliente", dataToSend);
      
      toast.success(res.data.mensaje || "¡Registro exitoso! Inicia sesión.");
      
      // Limpiamos el formulario
      setForm({
        nombreCliente: "",
        apellidoCliente: "",
        email: "",
        contraCliente: "",
        dni: "", 
      });
      
      // Redirigimos al login después de un breve delay para que el usuario lea el toast
      setTimeout(() => {
          navigate("/login");
      }, 1500);

    } catch (error) {
      console.error("Error de registro:", error);
      const errorMessage = error.response?.data?.mensaje || 
                           error.response?.data?.error || 
                           "Error al registrar el cliente. Intenta nuevamente.";
      toast.error(errorMessage); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 transform transition-all duration-300 hover:shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-gray-500 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600 cursor-pointer"
            aria-label="Volver al inicio de sesión"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-extrabold text-center text-primary-700 flex-1">
            Crear Cuenta
          </h1>
        </div>
        
        <p className="text-gray-600 text-center mb-8 text-md leading-relaxed">
          Únete a nuestra farmacia y comienza tu experiencia
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Nombre y Apellido (Grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                name="nombreCliente"
                placeholder="Nombre"
                value={form.nombreCliente}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </div>
              <input
                name="apellidoCliente"
                placeholder="Apellido"
                value={form.apellidoCliente}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
                required
              />
            </div>
          </div>
          
          {/* DNI */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <ScanText className="w-4 h-4" />
            </div>
            <input
              type="text"
              name="dni" 
              placeholder="DNI / Cédula"
              value={form.dni}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
              required
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8} // Opcional: limitar a 8 dígitos
            />
          </div>

          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              name="email" // Coincide con el estado local
              placeholder="Correo electrónico"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
              required
            />
          </div>
          
          {/* Contraseña */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              name="contraCliente"
              placeholder="Contraseña"
              value={form.contraCliente}
              onChange={handleChange}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
              required
              minLength={6} // Mínimo recomendado
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-700 transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-primary-700 text-white py-3 rounded-lg hover:bg-primary-800 transition duration-300 font-semibold flex items-center justify-center space-x-2 shadow-md hover:shadow-lg cursor-pointer ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Crear Cuenta</span>
              </>
            )}
          </button>

        </form>
        
        {/* Links Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            to="/login"
            className="text-primary-800 font-semibold hover:underline"
          >
            Inicia sesión
          </Link>
        </div>
        
        <p className="mt-4 text-xs text-gray-500 text-center leading-relaxed">
          Al registrarte, aceptas nuestros{" "}
          <Link to="/terminos" className="text-primary-800 hover:underline">
            Términos de servicio
          </Link>{" "}
          y{" "}
          <Link to="/privacidad" className="text-primary-800 hover:underline">
            Política de privacidad.
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Registro;