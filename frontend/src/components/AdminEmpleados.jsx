import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Edit,
  Mail,
  Shield,
  UserX,
  CheckCircle,
  Search,
} from "lucide-react";

const AdminEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // 🔐 Protección de ruta
  useEffect(() => {
    if (!user || user.rol !== "admin") navigate("/");
  }, [user, navigate]);

  // 📦 Obtener empleados
  const obtenerEmpleados = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/empleados");
      if (res.data.results) setEmpleados(res.data.results);
      else if (Array.isArray(res.data)) setEmpleados(res.data);
      else setEmpleados([]);
    } catch (error) {
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  // 📝 Crear empleado
  const handleCrearEmpleado = async () => {
    const { value } = await Swal.fire({
      title: '<h2 class="text-2xl font-bold text-blue-700">👤 Nuevo Empleado</h2>',
      html: `
        <div class="flex flex-col gap-3 text-left">
          <input id="nombre" class="swal2-input" placeholder="Nombre">
          <input id="apellido" class="swal2-input" placeholder="Apellido">
          <input id="email" type="email" class="swal2-input" placeholder="Email">
          <input id="pass" type="password" class="swal2-input" placeholder="Contraseña">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      preConfirm: () => ({
        nombreEmpleado: document.getElementById("nombre").value.trim(),
        apellidoEmpleado: document.getElementById("apellido").value.trim(),
        emailEmpleado: document.getElementById("email").value.trim(),
        contraEmpleado: document.getElementById("pass").value.trim(),
      }),
    });

    if (value) {
      await apiClient.post("/empleados/crear", value);
      obtenerEmpleados();
    }
  };

  // ✏️ Editar empleado
  const handleEditarEmpleado = async (emp) => {
    const { value } = await Swal.fire({
      title: `<h2 class="text-xl font-bold">✏️ Editar ${emp.nombreEmpleado}</h2>`,
      html: `
        <div class="flex flex-col gap-3 text-left">
          <input id="nombre" class="swal2-input" value="${emp.nombreEmpleado}">
          <input id="apellido" class="swal2-input" value="${emp.apellidoEmpleado}">
          <input id="email" class="swal2-input" value="${emp.emailEmpleado}">
          <input id="pass" type="password" class="swal2-input" placeholder="Nueva contraseña (opcional)">
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#EAB308",
      preConfirm: () => ({
        nombreEmpleado: document.getElementById("nombre").value.trim(),
        apellidoEmpleado: document.getElementById("apellido").value.trim(),
        emailEmpleado: document.getElementById("email").value.trim(),
        contraEmpleado: document.getElementById("pass").value.trim(),
      }),
    });

    if (value) {
      await apiClient.put(`/empleados/actualizar/${emp.idEmpleado}`, value);
      obtenerEmpleados();
    }
  };

  // En AdminEmpleados.jsx

const handleCambiarEstado = (emp) => {
    const activo = emp.activo !== 0 && emp.activo !== false;

    Swal.fire({
      title: activo ? "¿Dar de baja?" : "¿Reactivar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: activo ? "#dc2626" : "#16a34a",
    }).then(async (r) => {
      if (r.isConfirmed) {
        try {
          await apiClient.put(
            activo
              ? `/empleados/baja/${emp.idEmpleado}`
              : `/empleados/reactivar/${emp.idEmpleado}` // ✅ CORREGIDO: "reactivar" en lugar de "activar"
          );
          
          // Opcional: Mostrar mensaje de éxito
          Swal.fire("¡Éxito!", "El estado del empleado ha sido actualizado.", "success");
          
          obtenerEmpleados();
        } catch (error) {
          console.error("Error al cambiar estado:", error);
          Swal.fire("Error", "No se pudo cambiar el estado del empleado", "error");
        }
      }
    });
  };

  // 🔍 Filtro
  const empleadosFiltrados = empleados.filter((e) => {
    const t = busqueda.toLowerCase();
    return (
      e.nombreEmpleado.toLowerCase().includes(t) ||
      e.apellidoEmpleado.toLowerCase().includes(t) ||
      e.emailEmpleado.toLowerCase().includes(t)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <ToastContainer />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="text-blue-600" size={32} />
              Administración de Empleados
            </h1>
            <p className="text-gray-500 mt-1">
              Gestiona el personal del sistema.
            </p>
          </div>

          <button
            onClick={handleCrearEmpleado}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shadow-lg hover:shadow-blue-500/30"
          >
            <UserPlus size={20} /> Nuevo Empleado
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Buscador */}
          <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
            <Search className="text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar empleado..."
              className="w-full bg-transparent outline-none"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-500">
              Cargando empleados...
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-6 py-4">Empleado</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {empleadosFiltrados.map((emp) => {
                    const activo = emp.activo !== 0 && emp.activo !== false;
                    return (
                      <tr
                        key={emp.idEmpleado}
                        className={`${!activo ? "opacity-60 bg-gray-50" : ""}`}
                      >
                        <td className="px-6 py-4 hover:bg-blue-50/40 flex items-center gap-3 font-medium">
                          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                            <Users size={18} />
                          </div>
                          {emp.nombreEmpleado} {emp.apellidoEmpleado}
                        </td>

                        <td className="px-6 py-4 hover:bg-blue-50/40 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail size={14} />
                            {emp.emailEmpleado}
                          </div>
                        </td>

                        <td className="px-6 py-4 hover:bg-blue-50/40 text-center">
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-full ${activo
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                              }`}
                          >
                            {activo ? "Activo" : "Baja"}
                          </span>
                        </td>

                        <td className="px-6 py-4 hover:bg-blue-50/40">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleEditarEmpleado(emp)}
                              className="p-2 bg-yellow-50 text-yellow-600 rounded-lg border hover:bg-yellow-100"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleCambiarEstado(emp)}
                              className={`p-2 rounded-lg border ${activo
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-600 hover:bg-green-100"
                                }`}
                            >
                              {activo ? (
                                <UserX size={18} />
                              ) : (
                                <CheckCircle size={18} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {empleadosFiltrados.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-400">
              No se encontraron empleados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmpleados;
