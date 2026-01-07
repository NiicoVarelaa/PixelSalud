import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserPlus,
  Edit,
  UserX,
  Mail,
  CreditCard,
  CheckCircle,
  Search,
} from "lucide-react";

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // 1. Protección de Ruta
  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // 2. Cargar Clientes
  const obtenerClientes = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/clientes");
      if (Array.isArray(res.data)) {
        setClientes(res.data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error("Error al obtener clientes", error);
      // Ignoramos el 404 si es que no hay clientes aun
      if (error.response?.status !== 404) {
        toast.error("Error al cargar lista de clientes.");
      }
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  // 3. Crear Cliente
  const handleCrearCliente = async () => {
    const { value: formValues } = await Swal.fire({
      title:
        '<h2 class="text-2xl font-bold text-green-700">👤 Nuevo Cliente</h2>',
      html: `
        <div class="flex flex-col gap-4 text-left">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                    <input id="swal-nombre" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Ej: María">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Apellido</label>
                    <input id="swal-apellido" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Gómez">
                </div>
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">DNI</label>
                <input id="swal-dni" type="number" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="12345678">
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
                <input id="swal-email" type="email" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="maria@email.com">
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                <input id="swal-pass" type="password" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="*******">
            </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Registrar",
      confirmButtonColor: "#059669", // Verde
      width: "500px",
      focusConfirm: false,
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre").value.trim();
        const apellido = document.getElementById("swal-apellido").value.trim();
        const dni = document.getElementById("swal-dni").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const contra = document.getElementById("swal-pass").value.trim();

        if (!nombre || !apellido || !dni || !email || !contra) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }

        return {
          nombreCliente: nombre,
          apellidoCliente: apellido,
          dni,
          emailCliente: email,
          contraCliente: contra,
        };
      },
    });

    if (formValues) {
      try {
        await apiClient.post("/clientes/crear", formValues);
        Swal.fire("Creado", "Paciente registrado correctamente.", "success");
        obtenerClientes();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "No se pudo crear",
          "error"
        );
      }
    }
  };

  // 4. Editar Cliente
// 4. Editar Cliente (SIN CAMPO DE CONTRASEÑA)
  const handleEditarCliente = async (cli) => {
    const { value: formValues } = await Swal.fire({
      title: `<h2 class="text-xl font-bold text-gray-700">✏️ Editando: ${cli.nombreCliente}</h2>`,
      html: `
        <div class="flex flex-col gap-4 text-left">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                    <input id="swal-nombre" class="w-full p-2.5 border rounded" value="${cli.nombreCliente}">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Apellido</label>
                    <input id="swal-apellido" class="w-full p-2.5 border rounded" value="${cli.apellidoCliente}">
                </div>
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">DNI</label>
                <input id="swal-dni" type="number" class="w-full p-2.5 border rounded" value="${cli.dni || ''}">
            </div>
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
                <input id="swal-email" type="email" class="w-full p-2.5 border rounded" value="${cli.emailCliente}">
            </div>
            
            </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        return {
            nombreCliente: document.getElementById('swal-nombre').value.trim(),
            apellidoCliente: document.getElementById('swal-apellido').value.trim(),
            dni: document.getElementById('swal-dni').value.trim(),
            emailCliente: document.getElementById('swal-email').value.trim(),
            // Ya no mandamos contraCliente
        };
      }
    });

    if (formValues) {
      try {
        await apiClient.put(`/clientes/actualizar/${cli.idCliente}`, formValues);
        Swal.fire('Actualizado', 'Datos modificados correctamente', 'success');
        obtenerClientes();
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar', 'error');
      }
    }
  };

  // 5. Cambiar Estado (Activar/Desactivar)
  const handleCambiarEstado = (cli) => {
    // Si el backend no manda 'activo', asumimos true
    const esActivo = cli.activo !== 0 && cli.activo !== false;
    const accion = esActivo ? "Dar de Baja" : "Reactivar";
    const color = esActivo ? "#d33" : "#059669";

    Swal.fire({
      title: `¿${accion}?`,
      text: `El paciente ${
        esActivo ? "perderá" : "recuperará"
      } el acceso al sistema.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: color,
      confirmButtonText: `Sí, ${accion}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const endpoint = esActivo
            ? `/clientes/baja/${cli.idCliente}`
            : `/clientes/activar/${cli.idCliente}`;

          await apiClient.put(endpoint);
          Swal.fire(
            "Estado Actualizado",
            `Cliente ${accion.toLowerCase()} con éxito`,
            "success"
          );
          obtenerClientes();
        } catch (error) {
          Swal.fire("Error", "No se pudo cambiar el estado", "error");
        }
      }
    });
  };

  // --- Lógica de Filtrado ---
  const clientesFiltrados = clientes.filter((cli) => {
    const termino = busqueda.toLowerCase();
    return (
      cli.nombreCliente.toLowerCase().includes(termino) ||
      cli.apellidoCliente.toLowerCase().includes(termino) ||
      cli.emailCliente.toLowerCase().includes(termino) ||
      (cli.dni && cli.dni.toString().includes(termino))
    );
  });

  // --- RENDERIZADO ---
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-green-600" size={32} /> Administración de
              Clientes
            </h1>
            <p className="text-gray-500 mt-1">
              Gestiona los usuarios registrados en la farmacia.
            </p>
          </div>
          <button
            onClick={handleCrearCliente}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition shadow-lg hover:shadow-green-500/30 font-medium"
          >
            <UserPlus size={20} /> Nuevo Cliente
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Buscador */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
            <Search className="text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, DNI o email..."
              className="w-full bg-transparent outline-none text-gray-700"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando pacientes...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs border-b">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Paciente</th>
                    <th className="px-6 py-4">DNI</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clientesFiltrados.map((cli) => {
                    const esActivo = cli.activo !== 0 && cli.activo !== false;
                    return (
                      <tr
                        key={cli.idCliente}
                        className={`hover:bg-green-50/30 transition duration-150 ${
                          !esActivo ? "opacity-60 bg-gray-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                          #{cli.idCliente}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                              esActivo
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-200 text-gray-500"
                            }`}
                          >
                            <Users size={18} />
                          </div>
                          {cli.nombreCliente} {cli.apellidoCliente}
                        </td>
                        <td className="px-6 py-4 text-gray-600 font-mono">
                          <div className="flex items-center gap-2">
                            <CreditCard size={14} className="text-gray-400" />{" "}
                            {cli.dni || "---"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-400" />{" "}
                            {cli.emailCliente}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`px-2 py-1 text-xs font-bold rounded-full ${
                              esActivo
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {esActivo ? "Activo" : "Baja"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex justify-center gap-3">
                          <button
                            onClick={() => handleEditarCliente(cli)}
                            className="p-2 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 rounded-lg transition border border-yellow-200"
                            title="Editar Datos"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleCambiarEstado(cli)}
                            className={`p-2 rounded-lg transition border ${
                              esActivo
                                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                                : "bg-green-50 text-green-600 border-green-200 hover:bg-green-100"
                            }`}
                            title={esActivo ? "Dar de Baja" : "Reactivar"}
                          >
                            {esActivo ? (
                              <UserX size={18} />
                            ) : (
                              <CheckCircle size={18} />
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {clientesFiltrados.length === 0 && !loading && (
            <div className="p-10 text-center text-gray-400">
              No se encontraron resultados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientes;
