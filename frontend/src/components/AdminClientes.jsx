import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import {
  Users,
  UserPlus,
  Edit,
  UserX,
  CheckCircle,
  Search,
} from "lucide-react";

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // Nuevo filtro

  // --- ESTADOS PARA PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 4; 

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

  // Resetear pagina al buscar o filtrar
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  // 3. Crear Cliente
  const handleCrearCliente = async () => {
    const { value: formValues } = await Swal.fire({
      title: '<h2 class="text-2xl font-bold text-green-700">👤 Nuevo Cliente</h2>',
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
      confirmButtonColor: "#059669",
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
        Swal.fire("Creado", "Cliente registrado correctamente.", "success");
        obtenerClientes();
      } catch (error) {
        Swal.fire("Error", error.response?.data?.error || "No se pudo crear", "error");
      }
    }
  };

  // 4. Editar Cliente
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

  // 5. Cambiar Estado
  const handleCambiarEstado = (cli) => {
    const esActivo = cli.activo !== 0 && cli.activo !== false;
    const accion = esActivo ? "Dar de Baja" : "Reactivar";
    const color = esActivo ? "#d33" : "#059669";

    Swal.fire({
      title: `¿${accion}?`,
      text: `El cliente ${esActivo ? "perderá" : "recuperará"} el acceso al sistema.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: color,
      confirmButtonText: `Sí, ${accion}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const endpoint = esActivo
            ? `/clientes/darBaja/${cli.idCliente}`
            : `/clientes/activar/${cli.idCliente}`;

          await apiClient.put(endpoint);
          Swal.fire(
            "Estado Actualizado",
            `Cliente ${accion.toLowerCase()} con éxito`,
            "success"
          );
          obtenerClientes();
        } catch (error) {
          console.error("Error cambiando estado:", error); 
          Swal.fire("Error", "No se pudo cambiar el estado. Revisa la consola.", "error");
        }
      }
    });
  };

  // --- Lógica de Filtrado Actualizada ---
  const clientesFiltrados = clientes.filter((cli) => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda = 
      cli.nombreCliente.toLowerCase().includes(termino) ||
      cli.apellidoCliente.toLowerCase().includes(termino) ||
      cli.emailCliente.toLowerCase().includes(termino) ||
      (cli.dni && cli.dni.toString().includes(termino));

    // Lógica para estado activo/inactivo
    const esActivo = cli.activo !== 0 && cli.activo !== false;
    
    const coincideEstado = 
        filtroEstado === "todos" ||
        (filtroEstado === "activos" && esActivo) ||
        (filtroEstado === "inactivos" && !esActivo);

    return coincideBusqueda && coincideEstado;
  });

  // --- LÓGICA DE PAGINACIÓN ---
  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = clientesFiltrados.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(clientesFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const getPaginationNumbers = () => {
    const delta = 1; 
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || (i >= paginaActual - delta && i <= paginaActual + delta)) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-white p-6 w-full">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="text-green-600" size={32} /> Administración de Clientes
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
                Gestiona los usuarios registrados en la farmacia.
            </p>
          </div>
          
          <div className="flex gap-3">
          <button
            onClick={handleCrearCliente}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <UserPlus size={20} /> Nuevo Cliente
          </button>
          <Link
              to="/admin"
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
            >
              ← Volver
            </Link>
            </div>
        </div>

        {/* Buscador y Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Input Búsqueda */}
            <div className="relative w-full md:w-1/3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="text-gray-400" size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="border p-2 pl-10 rounded w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                />
            </div>

            {/* Select Estado */}
            <div className="w-full md:w-1/4">
                <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value)}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-green-500"
                >
                    <option value="todos">Todos</option>
                    <option value="activos">Activos</option>
                    <option value="inactivos">Inactivos</option>
                </select>
            </div>
        </div>

        {/* Tabla de Clientes */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {loading ? (
             <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Cargando clientes...</p>
             </div>
          ) : (
            <div className="w-full">
                <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-green-100">
                    <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-16">
                        ID
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-1/4">
                        Cliente
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-32">
                        DNI
                    </th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-1/3">
                        Email
                    </th>
                    <th scope="col" className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-24">
                        Estado
                    </th>
                    <th scope="col" className="px-3 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider w-32">
                        Acciones
                    </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {itemsActuales.length > 0 ? (
                        itemsActuales.map((cli) => {
                            const esActivo = cli.activo !== 0 && cli.activo !== false;
                            return (
                                <tr key={cli.idCliente} className="hover:bg-gray-50 transition-colors">
                                    {/* ID */}
                                    <td className="px-3 py-3 whitespace-nowrap text-gray-500 font-mono text-xs">
                                        #{cli.idCliente}
                                    </td>

                                    {/* CLIENTE */}
                                    <td className="px-3 py-3 align-middle">
                                        <div className="text-sm font-medium text-gray-900 whitespace-normal break-words">
                                            {cli.nombreCliente} {cli.apellidoCliente}
                                        </div>
                                    </td>

                                    {/* DNI */}
                                    <td className="px-3 py-3 whitespace-nowrap align-middle text-sm text-gray-700">
                                        {cli.dni || "---"}
                                    </td>

                                    {/* EMAIL */}
                                    <td className="px-3 py-3 align-middle">
                                        <div className="text-sm text-gray-600 whitespace-normal break-words break-all">
                                            {cli.emailCliente}
                                        </div>
                                    </td>

                                    {/* ESTADO */}
                                    <td className="px-3 py-3 whitespace-nowrap text-center align-middle">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            esActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}>
                                            {esActivo ? "Activo" : "Baja"}
                                        </span>
                                    </td>

                                    {/* ACCIONES (ICONOS SIN TEXTO) */}
                                    <td className="px-3 py-3 whitespace-nowrap text-right align-middle">
                                        <div className="flex gap-1 justify-end">
                                            <button
                                                onClick={() => handleEditarCliente(cli)}
                                                className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors cursor-pointer"
                                                title="Editar Cliente"
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <button
                                                onClick={() => handleCambiarEstado(cli)}
                                                className={`p-1.5 text-white rounded-md transition-colors cursor-pointer ${
                                                    esActivo ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                                }`}
                                                title={esActivo ? "Dar de Baja" : "Reactivar Cliente"}
                                            >
                                                {esActivo ? <UserX size={16} /> : <CheckCircle size={16} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                No se encontraron clientes.
                            </td>
                        </tr>
                    )}
                </tbody>
                </table>
            </div>
          )}

          {/* --- CONTROLES DE PAGINACIÓN --- */}
          {!loading && clientesFiltrados.length > 0 && (
            <div className="flex justify-center py-6 bg-white border-t border-gray-200">
              <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                  onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === 1 ? 'opacity-50 cursor-not-allowed text-gray-400 hover:bg-white' : 'cursor-pointer'}`}
                >
                  &lt;
                </button>

                {getPaginationNumbers().map((number, index) => (
                  <button
                    key={index}
                    onClick={() => typeof number === 'number' ? cambiarPagina(number) : null}
                    disabled={typeof number !== 'number'}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${
                      number === paginaActual
                        ? 'bg-blue-500 text-white' 
                        : typeof number === 'number'
                          ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' 
                          : 'bg-white text-gray-400 cursor-default'
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <button
                  onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))}
                  disabled={paginaActual === totalPaginas}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed text-gray-400 hover:bg-white' : 'cursor-pointer'}`}
                >
                  &gt;
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientes;