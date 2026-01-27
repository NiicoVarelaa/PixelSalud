import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { 
  User, Mail, MapPin, Package, Heart, CreditCard, 
  Edit2, Save, X, Camera, Calendar, ShieldCheck, KeyRound, IdCard, Phone 
} from "lucide-react";

const Perfil = () => {

  const { user, token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    emailCliente: "",
    telefono: "",
    direccion: "",
    dni: "",
    contraCliente: ""
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Cargar datos reales del cliente
  useEffect(() => {
    console.log('user en Perfil.jsx:', user);
    const fetchCliente = async () => {
      if (!user || !user.id) {
        setErrorMsg('No hay usuario logueado o falta id en user.');
        return;
      }
      setLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const res = await fetch(`${apiUrl}/clientes/${user.id}`, {
          headers: { auth: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("No se pudo obtener el perfil");
        const data = await res.json();
        console.log('Respuesta del backend perfil:', data);
        if (!data || Object.keys(data).length === 0) {
          setErrorMsg("No se encontraron datos del usuario en el backend");
          return;
        }
        setFormData({
          nombreCliente: data.nombreCliente || "",
          apellidoCliente: data.apellidoCliente || "",
          emailCliente: data.emailCliente || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
          dni: data.dni || "",
          contraCliente: ""
        });
      } catch (err) {
        setErrorMsg("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetchCliente();
  }, [user]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      // Solo enviar campos modificados o no vacíos
      const body = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== "" && formData[key] !== null && typeof formData[key] !== "undefined") {
          body[key] = formData[key];
        }
      });
      // Si la contraseña está vacía, no la mandes
      if (!body.contraCliente) delete body.contraCliente;
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/clientes/actualizar/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          auth: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");
      setSuccessMsg("Perfil actualizado con éxito");
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, contraCliente: "" })); // Limpiar campo contraseña
    } catch (err) {
      setErrorMsg(err.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };


  if (!user) return null;
  if (errorMsg) {
    return <div className="text-red-600 font-bold p-8">{errorMsg}</div>;
  }

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
              <div className="h-32 bg-linear-to-b from-primary-600 to-primary-500 relative">
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
                  {formData.nombreCliente} {formData.apellidoCliente}
                </h2>
                <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-2">
                  <ShieldCheck size={16} className="text-green-600" />
                  Cuenta Verificada
                </p>

                {/* Info de pedidos/favoritos eliminada por pedido */}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            {/* Cards de método de pago, lista de deseos y dirección principal eliminadas por pedido */}

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
                        name="nombreCliente"
                        value={formData.nombreCliente}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Apellido</label>
                      <input
                        type="text"
                        name="apellidoCliente"
                        value={formData.apellidoCliente}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-3 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          name="emailCliente"
                          value={formData.emailCliente}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">DNI</label>
                      <input
                        type="number"
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Dirección</label>
                      <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2"><KeyRound size={16}/> Nueva Contraseña <span className="text-xs text-gray-400">(opcional)</span></label>
                      <input
                        type="password"
                        name="contraCliente"
                        value={formData.contraCliente}
                        onChange={handleInputChange}
                        autoComplete="new-password"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        placeholder="Dejar vacío para no cambiar"
                      />
                    </div>
                    <div className="md:col-span-2 pt-4 flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-all shadow-md hover:shadow-lg transform active:scale-95 disabled:opacity-60"
                      >
                        <Save size={18} />
                        {loading ? "Guardando..." : "Guardar Cambios"}
                      </button>
                    </div>
                    {successMsg && <div className="md:col-span-2 text-green-600 font-medium mt-2">{successMsg}</div>}
                    {errorMsg && <div className="md:col-span-2 text-red-600 font-medium mt-2">{errorMsg}</div>}
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
                            {formData.nombreCliente || '-'} {formData.apellidoCliente || '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <Mail size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Correo Electrónico</p>
                          <p className="text-gray-900 font-semibold mt-0.5">{formData.emailCliente || '-'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <IdCard size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">DNI</p>
                          <p className="text-gray-900 font-semibold mt-0.5">{formData.dni || '-'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <Phone size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                          <p className="text-gray-900 font-semibold mt-0.5">{formData.telefono || '-'}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors md:col-span-2">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-primary-600">
                          <MapPin size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Dirección</p>
                          <p className="text-gray-900 font-semibold mt-0.5">{formData.direccion || '-'}</p>
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