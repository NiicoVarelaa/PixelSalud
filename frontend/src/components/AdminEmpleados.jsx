import { useState, useEffect, useRef } from "react";
// 1. USAMOS apiClient EN LUGAR DE AXIOS
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Ya no necesitamos importar el store de auth para leer el token manualmente

const PERMISOS_DEFAULT = {
  crear_productos: false,
  modificar_productos: false,
  modificar_ventasE: false,
  modificar_ventasO: false,
  ver_ventasTotalesE: false,
  ver_ventasTotalesO: false,
};

const AdminEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  const [todosLosPermisos, setTodosLosPermisos] = useState([]);
  const [permisosEditados, setPermisosEditados] = useState(PERMISOS_DEFAULT);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // El token ya lo maneja apiClient internamente, no necesitamos leerlo aquí para las peticiones

  const [empleadoEditado, setEmpleadoEditado] = useState({
    nombreEmpleado: "",
    apellidoEmpleado: "",
    emailEmpleado: "",
    contraEmpleado: "",
  });

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombreEmpleado: "",
    apellidoEmpleado: "",
    emailEmpleado: "",
    contraEmpleado: "",
  });

  // 2. ELIMINAMOS getConfig() (apiClient lo hace solo)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        cancelarEdicion();
      }
    };

    if (isModalOpen) {
      document.body.classList.add("overflow-hidden");
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const obtenerTodosLosPermisos = async () => {
    try {
      // 3. USAMOS apiClient Y RUTAS RELATIVAS
      const res = await apiClient.get("/permisos");
      setTodosLosPermisos(res.data);
    } catch (error) {
      console.error("Error al obtener todos los permisos:", error);
    }
  };

  const obtenerEmpleados = async () => {
    try {
      const res = await apiClient.get("/Empleados");
      setEmpleados(res.data.results || res.data);
    } catch (error) {
      console.error("Error al obtener empleados", error);
      toast.error("Error al cargar empleados.");
    }
  };

  useEffect(() => {
    // apiClient maneja el token, si falla redirige al login.
    obtenerEmpleados();
    obtenerTodosLosPermisos();
  }, []);

  const iniciarEdicion = (emp) => {
    setEditandoId(emp.idEmpleado);
    setEmpleadoEditado({
      nombreEmpleado: emp.nombreEmpleado,
      apellidoEmpleado: emp.apellidoEmpleado || "",
      emailEmpleado: emp.emailEmpleado,
      contraEmpleado: "",
    });

    const permisosExistentes = todosLosPermisos.find(
      (p) => p.idEmpleado === emp.idEmpleado
    );
    if (permisosExistentes) {
      const permisosLimpios = Object.keys(PERMISOS_DEFAULT).reduce(
        (acc, key) => {
          acc[key] =
            permisosExistentes[key] === 1 || permisosExistentes[key] === true;
          return acc;
        },
        PERMISOS_DEFAULT
      );
      setPermisosEditados({ ...PERMISOS_DEFAULT, ...permisosLimpios });
    } else {
      setPermisosEditados(PERMISOS_DEFAULT);
    }

    setIsModalOpen(true);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setIsModalOpen(false);
    setEmpleadoEditado({
      nombreEmpleado: "",
      apellidoEmpleado: "",
      emailEmpleado: "",
      contraEmpleado: "",
    });
    setPermisosEditados(PERMISOS_DEFAULT);
  };

  const handlePermisoChange = (e) => {
    setPermisosEditados({
      ...permisosEditados,
      [e.target.name]: e.target.checked,
    });
  };

  const actualizarPermisos = async (idEmpleado) => {
    const tienePermisoExistente = todosLosPermisos.some(
      (p) => p.idEmpleado === idEmpleado
    );
    // Rutas relativas
    const endpoint = tienePermisoExistente
      ? `/permisos/update/${idEmpleado}`
      : `/permisos/crear/${idEmpleado}`;
    const method = tienePermisoExistente ? "put" : "post";

    const permisosDB = Object.keys(permisosEditados).reduce((acc, key) => {
      acc[key] = permisosEditados[key] ? 1 : 0;
      return acc;
    }, {});

    try {
      // Axios genérico con apiClient
      await apiClient({
        method: method,
        url: endpoint,
        data: permisosDB,
      });
      toast.info(`Permisos actualizados.`);
      obtenerTodosLosPermisos();
    } catch (error) {
      console.error(`Error al gestionar permisos:`, error);
      toast.error(`Error al gestionar permisos.`);
    }
  };

  const guardarCambios = async () => {
    try {
      const dataToUpdate = {
        ...empleadoEditado,
        apellidoEmpleado: empleadoEditado.apellidoEmpleado || "",
      };

      await apiClient.put(`/empleados/actualizar/${editandoId}`, dataToUpdate);

      await actualizarPermisos(editandoId);

      cancelarEdicion();
      obtenerEmpleados();
      toast.success("Empleado actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al actualizar empleado");
    }
  };

  const toggleActivo = async (idEmpleado, activoActual) => {
    const endpoint = activoActual
      ? `/empleados/baja/${idEmpleado}`
      : `/empleados/reactivar/${idEmpleado}`;

    const action = activoActual ? "dado de baja" : "reactivado";

    try {
      await apiClient.put(endpoint, {});

      setEmpleados(
        empleados.map((emp) =>
          emp.idEmpleado === idEmpleado
            ? { ...emp, activo: !activoActual }
            : emp
        )
      );

      toast.success(`Empleado ${action} correctamente`);
    } catch (error) {
      console.error(`Error al ${action} empleado:`, error);
      toast.error(`Error al ${action} empleado`);
    }
  };

  const agregarEmpleado = async () => {
    try {
      // apiClient ya incluye la URL base
      await apiClient.post("/Empleados/crear", nuevoEmpleado);

      setIsModalOpen(false);
      setNuevoEmpleado({
        nombreEmpleado: "",
        apellidoEmpleado: "",
        emailEmpleado: "",
        contraEmpleado: "",
      });
      obtenerEmpleados();
      toast.success("Empleado agregado. ¡Ahora edita para asignar permisos!");
    } catch (error) {
      console.error("Error al agregar empleado:", error);
      // AQUÍ ES DONDE SE CAPTURA EL ERROR 409
      if (error.response && error.response.status === 409) {
        toast.error("Ese email ya está registrado.");
      } else {
        toast.error("Error al agregar empleado.");
      }
    }
  };

  const empleadosFiltrados = empleados.filter((emp) => {
    const isActive =
      emp.activo === 0
        ? false
        : emp.activo === 1
        ? true
        : emp.activo === undefined
        ? true
        : emp.activo;

    const coincideBusqueda =
      emp.nombreEmpleado.toLowerCase().includes(busqueda.toLowerCase()) ||
      (emp.apellidoEmpleado &&
        emp.apellidoEmpleado.toLowerCase().includes(busqueda.toLowerCase())) ||
      emp.emailEmpleado.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && isActive) ||
      (filtroEstado === "inactivos" && !isActive);

    return coincideBusqueda && coincideEstado;
  });

  const renderEmpleadoModal = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
        <div
          ref={modalRef}
          className="bg-white rounded-xl shadow-xl w-full max-w-4xl"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {editandoId
                  ? "Editar Empleado y Permisos"
                  : "Agregar Nuevo Empleado"}
              </h2>
              <button
                onClick={cancelarEdicion}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* COLUMNA 1: DATOS BÁSICOS */}
              <div>
                <h3 className="text-xl font-semibold mb-3 text-primary-700">
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { label: "Nombre", name: "nombreEmpleado", type: "text" },
                    {
                      label: "Apellido",
                      name: "apellidoEmpleado",
                      type: "text",
                    },
                    { label: "Email", name: "emailEmpleado", type: "email" },
                    {
                      label: "Contraseña (dejar vacío si no cambia)",
                      name: "contraEmpleado",
                      type: "password",
                    },
                  ].map(({ label, name, type }) => {
                    // CORRECCIÓN: Decidimos qué valor mostrar según si estamos editando o creando
                    const valorInput = editandoId
                      ? empleadoEditado[name]
                      : nuevoEmpleado[name];

                    return (
                      <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {label}
                        </label>
                        <input
                          type={type}
                          name={name}
                          // Aquí usamos el valor dinámico corregido
                          value={valorInput}
                          onChange={(e) =>
                            editandoId
                              ? setEmpleadoEditado({
                                  ...empleadoEditado,
                                  [name]: e.target.value,
                                })
                              : setNuevoEmpleado({
                                  ...nuevoEmpleado,
                                  [name]: e.target.value,
                                })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {editandoId && (
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary-700">
                    Permisos de Acceso
                  </h3>
                  <div className="space-y-2 bg-gray-50 p-4 rounded-md border">
                    {Object.keys(PERMISOS_DEFAULT).map((permiso) => (
                      <div key={permiso} className="flex items-center">
                        <input
                          id={permiso}
                          name={permiso}
                          type="checkbox"
                          checked={permisosEditados[permiso]}
                          onChange={handlePermisoChange}
                          className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                        />
                        <label
                          htmlFor={permiso}
                          className="ml-3 text-sm font-medium text-gray-700"
                        >
                          {permiso === "crear_productos" && "Crear Productos"}
                          {permiso === "modificar_productos" &&
                            "Modificar Productos"}
                          {permiso === "modificar_ventasE" &&
                            "Modificar Ventas Empleados"}
                          {permiso === "modificar_ventasO" &&
                            "Modificar Ventas Online"}
                          {permiso === "ver_ventasTotalesE" &&
                            "Ver Ventas Totales Empleados"}
                          {permiso === "ver_ventasTotalesO" &&
                            "Ver Ventas Totales Online"}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <button
                onClick={cancelarEdicion}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={editandoId ? guardarCambios : agregarEmpleado}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                {editandoId ? "Guardar Cambios" : "Guardar Empleado"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer position="top-right" autoClose={3000} />

      {isModalOpen && renderEmpleadoModal()}

      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Administración de Empleados
          </h1>
          <button
            onClick={() => {
              setEditandoId(null);
              setNuevoEmpleado({
                // Limpiar estado de nuevo empleado
                nombreEmpleado: "",
                apellidoEmpleado: "",
                emailEmpleado: "",
                contraEmpleado: "",
              });
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Agregar Empleado
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="todos">Todos los estados</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-primary-100">
                <tr>
                  {["Nombre", "Apellido", "Email", "Estado", "Acciones"].map(
                    (title, i) => (
                      <th
                        key={i}
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                          title === "Acciones" ? "text-right" : ""
                        }`}
                      >
                        {title}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {empleadosFiltrados.map((emp) => {
                  const isActive =
                    emp.activo === 0
                      ? false
                      : emp.activo === 1
                      ? true
                      : emp.activo === undefined
                      ? true
                      : emp.activo;

                  return (
                    <tr key={emp.idEmpleado} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {emp.nombreEmpleado}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {emp.apellidoEmpleado || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {emp.emailEmpleado}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {isActive ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => iniciarEdicion(emp)}
                            className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Editar Permisos
                          </button>
                          <button
                            onClick={() =>
                              toggleActivo(emp.idEmpleado, isActive)
                            }
                            className={`px-3 py-1 text-white rounded hover:opacity-90 text-xs flex items-center gap-1 ${
                              isActive
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-green-500 hover:bg-green-600"
                            }`}
                          >
                            {isActive ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {isActive ? "Desactivar" : "Activar"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEmpleados;
