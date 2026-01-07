import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Users, UserPlus, Edit, Trash2, Mail, Shield } from "lucide-react";

const AdminEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // 1. Protección de Ruta
  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // 2. Cargar Empleados
  const obtenerEmpleados = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/empleados");

      // Verificamos estructura del backend (que ahora devuelve { results: [...] })
      if (res.data.results && Array.isArray(res.data.results)) {
        setEmpleados(res.data.results);
      } else if (Array.isArray(res.data)) {
        setEmpleados(res.data);
      } else {
        setEmpleados([]);
      }
    } catch (error) {
      console.error("Error al obtener empleados", error);
      toast.error("No se pudieron cargar los empleados.");
      setEmpleados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  // --- HTML PARA LOS PERMISOS (Helper) ---
  const generarHtmlPermisos = (emp = {}) => {
    const isChecked = (key) =>
      emp[key] === 1 || emp[key] === true ? "checked" : "";

    return `
      <div class="mt-4 text-left bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 class="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
          🛡️ Asignar Permisos
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-crear-prod" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked(
                  "crear_productos"
                )}>
                <span class="text-sm text-gray-700 font-medium">Crear Productos/Ofertas</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-mod-prod" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked(
                  "modificar_productos"
                )}>
                <span class="text-sm text-gray-700 font-medium">Modif/Eliminar Productos</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-mod-ventas" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked(
                  "modificar_ventasE"
                )}>
                <span class="text-sm text-gray-700 font-medium">Editar/Anular Ventas</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-ver-totales" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked(
                  "ver_ventasTotalesE"
                )}>
                <span class="text-sm text-gray-700 font-medium">Ver Ventas Totales</span>
            </label>
        </div>
      </div>
    `;
  };

  // 3. Crear Empleado
  const handleCrearEmpleado = async () => {
    const { value: formValues } = await Swal.fire({
      title:
        '<h2 class="text-2xl font-bold text-gray-800">👤 Nuevo Empleado</h2>',
      html: `
        <div class="flex flex-col gap-4 text-left">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                    <input id="swal-nombre" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: Juan">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Apellido</label>
                    <input id="swal-apellido" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Pérez">
                </div>
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
                <input id="swal-email" type="email" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="juan@farmacia.com">
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                <input id="swal-pass" type="password" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="*******">
            </div>
        </div>
        ${generarHtmlPermisos()} 
      `,
      showCancelButton: true,
      confirmButtonText: "Registrar Empleado",
      confirmButtonColor: "#2563EB",
      width: "600px",
      focusConfirm: false,
      preConfirm: () => {
        // Usamos .trim() para evitar espacios accidentales
        const nombre = document.getElementById("swal-nombre").value.trim();
        const apellido = document.getElementById("swal-apellido").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const contra = document.getElementById("swal-pass").value.trim();

        if (!nombre || !apellido || !email || !contra) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        const permisos = {
          crear_productos: document.getElementById("p-crear-prod").checked,
          modificar_productos: document.getElementById("p-mod-prod").checked,
          modificar_ventasE: document.getElementById("p-mod-ventas").checked,
          ver_ventasTotalesE: document.getElementById("p-ver-totales").checked,
        };

        return {
          nombreEmpleado: nombre,
          apellidoEmpleado: apellido,
          emailEmpleado: email,
          contraEmpleado: contra,
          permisos,
        };
      },
    });

    if (formValues) {
      try {
        await apiClient.post("/empleados/crear", formValues);
        Swal.fire(
          "Creado",
          "Empleado y permisos registrados correctamente.",
          "success"
        );
        obtenerEmpleados();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "No se pudo crear",
          "error"
        );
      }
    }
  };

  // 4. Editar Empleado
  const handleEditarEmpleado = async (emp) => {
    const { value: formValues } = await Swal.fire({
      title: `<h2 class="text-xl font-bold text-gray-700">✏️ Editando: ${emp.nombreEmpleado}</h2>`,
      html: `
        <div class="flex flex-col gap-4 text-left">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                    <input id="swal-nombre" class="w-full p-2.5 border border-gray-300 rounded-lg" value="${
                      emp.nombreEmpleado
                    }">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Apellido</label>
                    <input id="swal-apellido" class="w-full p-2.5 border border-gray-300 rounded-lg" value="${
                      emp.apellidoEmpleado || ""
                    }">
                </div>
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
                <input id="swal-email" type="email" class="w-full p-2.5 border border-gray-300 rounded-lg" value="${
                  emp.emailEmpleado
                }">
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <label class="text-xs font-bold text-yellow-700 uppercase">Nueva Contraseña (Opcional)</label>
                <input id="swal-pass" type="password" class="w-full p-2 border border-yellow-300 rounded bg-white mt-1" placeholder="Dejar vacío para no cambiar">
            </div>
        </div>
        ${generarHtmlPermisos(emp)} 
      `,
      showCancelButton: true,
      confirmButtonText: "Guardar Cambios",
      confirmButtonColor: "#EAB308",
      width: "600px",
      preConfirm: () => {
        const permisos = {
          crear_productos: document.getElementById("p-crear-prod").checked,
          modificar_productos: document.getElementById("p-mod-prod").checked,
          modificar_ventasE: document.getElementById("p-mod-ventas").checked,
          ver_ventasTotalesE: document.getElementById("p-ver-totales").checked,
        };

        return {
          nombreEmpleado: document.getElementById("swal-nombre").value.trim(),
          apellidoEmpleado: document
            .getElementById("swal-apellido")
            .value.trim(),
          emailEmpleado: document.getElementById("swal-email").value.trim(),
          contraEmpleado: document.getElementById("swal-pass").value.trim(), // Si está vacío, devuelve ""
          permisos,
        };
      },
    });

    if (formValues) {
      try {
        await apiClient.put(
          `/empleados/actualizar/${emp.idEmpleado}`,
          formValues
        );
        Swal.fire(
          "Actualizado",
          "Datos y permisos modificados correctamente",
          "success"
        );
        obtenerEmpleados();
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar", "error");
      }
    }
  };

  // 5. Eliminar Empleado
  const handleEliminarEmpleado = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminará el empleado y sus permisos asociados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/empleados/eliminar/${id}`);
          Swal.fire("Eliminado", "Empleado eliminado correctamente", "success");
          obtenerEmpleados();
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar", "error");
        }
      }
    });
  };

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="text-blue-600" size={32} /> Administración de
              Empleados
            </h1>
            <p className="text-gray-500 mt-1">
              Gestiona el acceso y permisos del personal.
            </p>
          </div>
          <button
            onClick={handleCrearEmpleado}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition shadow-lg hover:shadow-blue-500/30 font-medium"
          >
            <UserPlus size={20} /> Agregar Empleado
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando personal...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {empleados.map((emp) => (
                    <tr
                      key={emp.idEmpleado}
                      className="hover:bg-blue-50/40 transition duration-150"
                    >
                      <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                        #{emp.idEmpleado}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm">
                          <Users size={18} />
                        </div>
                        {emp.nombreEmpleado} {emp.apellidoEmpleado}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-gray-400" />{" "}
                          {emp.emailEmpleado}
                        </div>
                      </td>
                      <td className="px-6 py-4 flex justify-center gap-3">
                        <button
                          onClick={() => handleEditarEmpleado(emp)}
                          className="p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition border border-yellow-200"
                          title="Editar Datos y Permisos"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleEliminarEmpleado(emp.idEmpleado)}
                          className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition border border-red-200"
                          title="Eliminar Empleado"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {empleados.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-400">
              No hay empleados registrados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEmpleados;
