import { useState, useEffect } from "react";
import apiClient from "@utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { Users, UserPlus, Shield, Mail, Search } from "lucide-react";

const AdminEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // --- ESTADOS PARA PAGINACIÓN ---
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 4;

  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.rol !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  const obtenerEmpleados = async () => {
    setLoading(true);
    try {
      // Obtener empleados activos
      const resActivos = await apiClient.get("/empleados");
      let activos = [];
      if (resActivos.data.results && Array.isArray(resActivos.data.results)) {
        activos = resActivos.data.results;
      } else if (Array.isArray(resActivos.data)) {
        activos = resActivos.data;
      }

      // Obtener empleados inactivos
      let inactivos = [];
      try {
        const resBajados = await apiClient.get("/Empleados/Bajados");
        if (Array.isArray(resBajados.data)) {
          inactivos = resBajados.data;
        }
      } catch (error) {
        // Si no hay empleados bajados, no es un error crítico
        console.log("No hay empleados inactivos o error al obtenerlos");
      }

      // Combinar ambos arrays
      setEmpleados([...activos, ...inactivos]);
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

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado]);

  const generarHtmlPermisos = (emp = {}) => {
    const isChecked = (key) =>
      emp[key] == 1 || emp[key] === true ? "checked" : "";
    return `
      <div class="mt-4 text-left bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 class="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
          🛡️ Asignar Permisos
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-crear-prod" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked("crear_productos")}>
                <span class="text-sm text-gray-700 font-medium">Crear Productos/Ofertas</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-mod-prod" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked("modificar_productos")}>
                <span class="text-sm text-gray-700 font-medium">Modif/Eliminar Productos</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-mod-ventas" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked("modificar_ventasE")}>
                <span class="text-sm text-gray-700 font-medium">Editar/Anular Ventas</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-1 rounded transition">
                <input type="checkbox" id="p-ver-totales" class="form-checkbox h-4 w-4 text-blue-600 rounded" ${isChecked("ver_ventasTotalesE")}>
                <span class="text-sm text-gray-700 font-medium">Ver Ventas Totales</span>
            </label>
        </div>
      </div>
    `;
  };

  const handleCrearEmpleado = async () => {
    // Truco: Quitamos el foco para evitar autocompletado del navegador
    if (document.activeElement) {
      document.activeElement.blur();
    }

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
            
            <div class="grid grid-cols-2 gap-4">
               <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">DNI</label>
                    <input id="swal-dni" type="number" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Ej: 30123456">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <input id="swal-email" type="email" autocomplete="off" readonly onfocus="this.removeAttribute('readonly');" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="juan@farmacia.com">
                </div>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Contraseña</label>
                <input id="swal-pass" type="password" autocomplete="new-password" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="*******">
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
        const nombre = document.getElementById("swal-nombre").value.trim();
        const apellido = document.getElementById("swal-apellido").value.trim();
        const dni = document.getElementById("swal-dni").value.trim();
        const email = document.getElementById("swal-email").value.trim();
        const contra = document.getElementById("swal-pass").value.trim();

        if (!nombre || !apellido || !dni || !email || !contra) {
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
          dniEmpleado: dni,
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
          "success",
        );
        obtenerEmpleados();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "No se pudo crear",
          "error",
        );
      }
    }
  };

  const handleEditarEmpleado = async (emp) => {
    if (document.activeElement) {
      document.activeElement.blur();
    }

    const { value: formValues } = await Swal.fire({
      title: `<h2 class="text-xl font-bold text-gray-700">✏️ Editando: ${emp.nombreEmpleado}</h2>`,
      html: `
        <div class="flex flex-col gap-4 text-left">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                    <input id="swal-nombre" class="w-full p-2.5 border border-gray-300 rounded-lg" value="${emp.nombreEmpleado}">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Apellido</label>
                    <input id="swal-apellido" class="w-full p-2.5 border border-gray-300 rounded-lg" value="${emp.apellidoEmpleado || ""}">
                </div>
            </div>
            
             <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">DNI</label>
                    <input id="swal-dni" type="number" class="w-full p-2.5 border border-gray-300 rounded-lg" value="${emp.dniEmpleado || ""}">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Email</label>
                    <input id="swal-email" type="email" autocomplete="off" class="w-full p-2.5 border border-gray-300 rounded-lg" value="${emp.emailEmpleado}">
                </div>
            </div>

            <div class="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <label class="text-xs font-bold text-yellow-700 uppercase">Nueva Contraseña (Opcional)</label>
                <input id="swal-pass" type="password" autocomplete="new-password" class="w-full p-2 border border-yellow-300 rounded bg-white mt-1" placeholder="Dejar vacío para no cambiar">
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
          dniEmpleado: document.getElementById("swal-dni").value.trim(),
          emailEmpleado: document.getElementById("swal-email").value.trim(),
          contraEmpleado: document.getElementById("swal-pass").value.trim(),
          permisos,
        };
      },
    });

    if (formValues) {
      try {
        await apiClient.put(
          `/empleados/actualizar/${emp.idEmpleado}`,
          formValues,
        );
        Swal.fire(
          "Actualizado",
          "Datos y permisos modificados correctamente",
          "success",
        );
        obtenerEmpleados();
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar", "error");
      }
    }
  };

  const handleCambiarEstado = (emp) => {
    const esActivo = emp.activo !== 0 && emp.activo !== false;
    const accion = esActivo ? "Dar de Baja" : "Reactivar";
    const color = esActivo ? "#d33" : "#059669";

    Swal.fire({
      title: `¿${accion}?`,
      text: `El empleado ${esActivo ? "perderá" : "recuperará"} el acceso al sistema.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: color,
      confirmButtonText: `Sí, ${accion}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const endpoint = esActivo
            ? `/empleados/baja/${emp.idEmpleado}`
            : `/empleados/reactivar/${emp.idEmpleado}`;

          await apiClient.put(endpoint);
          Swal.fire(
            "Estado Actualizado",
            `Empleado ${accion.toLowerCase()} con éxito`,
            "success",
          );
          obtenerEmpleados();
        } catch (error) {
          console.error("Error cambiando estado:", error);
          Swal.fire("Error", "No se pudo cambiar el estado", "error");
        }
      }
    });
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    const termino = busqueda.toLowerCase();
    const coincideBusqueda =
      emp.nombreEmpleado.toLowerCase().includes(termino) ||
      emp.apellidoEmpleado.toLowerCase().includes(termino) ||
      emp.emailEmpleado.toLowerCase().includes(termino) ||
      (emp.dniEmpleado && emp.dniEmpleado.toString().includes(termino)) ||
      emp.idEmpleado.toString().includes(termino);

    const esActivo = emp.activo !== 0 && emp.activo !== false;
    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && esActivo) ||
      (filtroEstado === "inactivos" && !esActivo);

    return coincideBusqueda && coincideEstado;
  });

  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = empleadosFiltrados.slice(
    indicePrimerItem,
    indiceUltimoItem,
  );
  const totalPaginas = Math.ceil(empleadosFiltrados.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const getPaginationNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    for (let i = 1; i <= totalPaginas; i++) {
      if (
        i === 1 ||
        i === totalPaginas ||
        (i >= paginaActual - delta && i <= paginaActual + delta)
      ) {
        range.push(i);
      }
    }
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
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
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Shield className="text-blue-600" size={32} /> Administración de
              Empleados
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Gestiona el acceso y permisos del personal.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCrearEmpleado}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              <UserPlus size={20} /> Agregar Empleado
            </button>
            <Link
              to="/admin"
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
            >
              ← Volver
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            {/* CORRECCIÓN: Input con autoComplete off y name único para despistar al navegador */}
            <input
              type="text"
              name="search_empleados_unique_id"
              id="search_empleados"
              autoComplete="off"
              placeholder="Buscar por nombre, DNI o email..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border p-2 pl-10 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="w-full md:w-1/4">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border p-2 rounded w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando personal...</p>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-1/4">
                      Nombre
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-32">
                      DNI
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-64">
                      Email
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-32">
                      Estado
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-40">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {itemsActuales.length > 0 ? (
                    itemsActuales.map((emp) => {
                      const esActivo = emp.activo !== 0 && emp.activo !== false;
                      return (
                        <tr
                          key={emp.idEmpleado}
                          className={`hover:bg-blue-50/40 transition duration-150 ${!esActivo ? "opacity-60 bg-gray-50" : ""}`}
                        >
                          <td className="px-3 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                            #{emp.idEmpleado}
                          </td>
                          <td className="px-3 py-3 align-middle">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                                <Users size={16} />
                              </div>
                              <div className="text-sm font-medium text-gray-900 whitespace-normal break-words">
                                {emp.nombreEmpleado} {emp.apellidoEmpleado}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap align-middle text-sm text-gray-700">
                            {emp.dniEmpleado || "---"}
                          </td>
                          <td className="px-3 py-3 align-middle">
                            <div
                              className="flex items-center gap-2 text-sm text-gray-600 max-w-[240px] truncate"
                              title={emp.emailEmpleado}
                            >
                              <Mail
                                size={14}
                                className="text-gray-400 flex-shrink-0"
                              />{" "}
                              {emp.emailEmpleado}
                            </div>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-center align-middle">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${esActivo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {esActivo ? "Activo" : "Baja"}
                            </span>
                          </td>
                          <td className="px-3 py-3 whitespace-nowrap text-right align-middle">
                            <div className="flex gap-1 justify-end">
                              <button
                                onClick={() => handleEditarEmpleado(emp)}
                                className="px-2 py-1 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors cursor-pointer"
                                title="Editar Empleado"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleCambiarEstado(emp)}
                                className={`px-2 py-1 text-sm font-medium text-white rounded-md transition-colors cursor-pointer ${esActivo ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                                title={
                                  esActivo ? "Dar Baja" : "Reactivar Empleado"
                                }
                              >
                                {esActivo ? "Desactivar" : "Activar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No hay empleados registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && itemsActuales.length > 0 && (
            <div className="flex justify-center py-6 bg-white border-t border-gray-200">
              <nav className="flex items-center gap-1" aria-label="Pagination">
                <button
                  onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === 1 ? "opacity-50 cursor-not-allowed text-gray-400 hover:bg-white" : "cursor-pointer"}`}
                >
                  &lt;
                </button>
                {getPaginationNumbers().map((number, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof number === "number" ? cambiarPagina(number) : null
                    }
                    disabled={typeof number !== "number"}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${number === paginaActual ? "bg-blue-500 text-white" : typeof number === "number" ? "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50" : "bg-white text-gray-400 cursor-default"}`}
                  >
                    {number}
                  </button>
                ))}
                <button
                  onClick={() =>
                    cambiarPagina(Math.min(totalPaginas, paginaActual + 1))
                  }
                  disabled={paginaActual === totalPaginas}
                  className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed text-gray-400 hover:bg-white" : "cursor-pointer"}`}
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

export default AdminEmpleados;
