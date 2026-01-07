import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { 
  User, Mail, MapPin, Package, Heart, CreditCard, 
  Edit2, Save, X, Camera, Calendar, ShieldCheck 
} from "lucide-react";

const Perfil = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "", 
    direccion: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        email: user.email || "",
        telefono: user.telefono || "", 
        direccion: user.direccion || "", 
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos actualizados:", formData);
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50/50  px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
          <p className="mt-2 text-gray-600">Administra tu información personal y revisa tu actividad.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gradient-to-b from-primary-600 to-primary-500 relative">
                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shadow-lg overflow-hidden">
                      <span className="text-3xl font-bold text-gray-500">
                        {user.nombre?.charAt(0)}{user.apellido?.charAt(0)}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md border border-gray-100 text-gray-600 hover:text-primary-600 transition-colors">
                      <Camera size={14} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {user.nombre} {user.apellido}
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  Cuenta Verificada
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-6">
                  <div className="text-center">
                    <span className="block text-2xl font-bold text-gray-900">12</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Pedidos</span>
                  </div>
                  <div className="text-center border-l border-gray-100">
                    <span className="block text-2xl font-bold text-gray-900">5</span>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Favoritos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start justify-between h-full">
                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 mb-3">
                  <CreditCard size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Método de Pago</p>
                  <p className="text-gray-900 font-semibold mt-1">Visa •••• 4242</p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start justify-between h-full">
                <div className="p-2.5 bg-red-50 rounded-xl text-red-600 mb-3">
                  <Heart size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Lista de Deseos</p>
                  <p className="text-gray-900 font-semibold mt-1">8 productos</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col items-start justify-between h-full">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 mb-3">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dirección Principal</p>
                  <p className="text-gray-900 font-semibold mt-1 truncate w-full">Calle French 247</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Información Personal</h3>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isEditing 
                      ? "bg-red-50 text-red-600 hover:bg-red-100" 
                      : "bg-primary-50 text-primary-700 hover:bg-primary-100"
                    }`}
                >
                  {isEditing ? (
                    <>
                      <X size={16} /> Cancelar
                    </>
                  ) : (
                    <>
                      <Edit2 size={16} /> Editar
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="md:col-span-2 pt-4 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all shadow-md hover:shadow-lg transform active:scale-95"
                      >
                        <Save size={18} />
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Nombre Completo</p>
                          <p className="text-gray-900 font-semibold mt-0.5">
                            {user.nombre} {user.apellido}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Correo Electrónico</p>
                          <p className="text-gray-900 font-semibold mt-0.5">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Fecha de Registro</p>
                          <p className="text-gray-900 font-semibold mt-0.5">Noviembre 2025</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Tipo de Cuenta</p>
                          <p className="text-gray-900 font-semibold mt-0.5 capitalize">
                            {user.tipo || "Cliente Estándar"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;