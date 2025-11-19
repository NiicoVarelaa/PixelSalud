import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "../store/useAuthStore"; 

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
  
  // NUEVO: Estado para almacenar TODOS los permisos de todos los empleados
  const [todosLosPermisos, setTodosLosPermisos] = useState([]); 
  // NUEVO: Estado para manejar los permisos del empleado que se está editando
  const [permisosEditados, setPermisosEditados] = useState(PERMISOS_DEFAULT);

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const token = useAuthStore((state) => state.token);


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

  const getConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Al cerrar el modal, limpiar permisos
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
  
  // NUEVA FUNCIÓN: Obtener todos los permisos (necesario para filtrar)
  const obtenerTodosLosPermisos = async () => {
      if (!token) return;
      try {
          // La ruta GET /permisos está protegida
          const res = await axios.get("http://localhost:5000/permisos", getConfig());
          setTodosLosPermisos(res.data);
      } catch (error) {
          console.error("Error al obtener todos los permisos:", error);
      }
  };


  const obtenerEmpleados = async () => {
    try {
      if (!token) return;
      const res = await axios.get("http://localhost:5000/Empleados", getConfig());
      setEmpleados(res.data.results || res.data); 
    } catch (error) {
      console.error("Error al obtener empleados", error);
      toast.error("Error al cargar empleados. ¿Permisos?");
    }
  };

  useEffect(() => {
    if (token) {
        obtenerEmpleados();
        obtenerTodosLosPermisos(); // Cargar todos los permisos
    }
  }, [token]);

  const iniciarEdicion = (emp) => {
    setEditandoId(emp.idEmpleado);
    // Cargar datos del empleado
    setEmpleadoEditado({
      nombreEmpleado: emp.nombreEmpleado,
      apellidoEmpleado: emp.apellidoEmpleado || "",
      emailEmpleado: emp.emailEmpleado,
      contraEmpleado: "",
    });

    // NUEVO: Buscar y cargar permisos del empleado que se está editando
    const permisosExistentes = todosLosPermisos.find(p => p.idEmpleado === emp.idEmpleado);
    if (permisosExistentes) {
        // Mapear los permisos existentes (booleanos 0/1) a true/false
        const permisosLimpios = Object.keys(PERMISOS_DEFAULT).reduce((acc, key) => {
            acc[key] = permisosExistentes[key] === 1 || permisosExistentes[key] === true;
            return acc;
        }, PERMISOS_DEFAULT);
        setPermisosEditados({ ...PERMISOS_DEFAULT, ...permisosLimpios });
    } else {
        setPermisosEditados(PERMISOS_DEFAULT);
    }
    
    setIsModalOpen(true);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setIsModalOpen(false); // Asegura que el modal se cierre
    setEmpleadoEditado({
      nombreEmpleado: "",
      apellidoEmpleado: "",
      emailEmpleado: "",
      contraEmpleado: "",
    });
    setPermisosEditados(PERMISOS_DEFAULT); // Limpiar permisos
  };

  // NUEVA FUNCIÓN: Manejar el cambio en los checkboxes de permisos
  const handlePermisoChange = (e) => {
    setPermisosEditados({
        ...permisosEditados,
        [e.target.name]: e.target.checked,
    });
  };

  // NUEVA FUNCIÓN: Crear o actualizar los permisos
  const actualizarPermisos = async (idEmpleado) => {
      const tienePermisoExistente = todosLosPermisos.some(p => p.idEmpleado === idEmpleado);
      const endpoint = tienePermisoExistente ? 
          `http://localhost:5000/permisos/update/${idEmpleado}` :
          `http://localhost:5000/permisos/crear/${idEmpleado}`;
      const method = tienePermisoExistente ? 'put' : 'post';
      
      // Convertir booleanos a 1 o 0 para la base de datos
      const permisosDB = Object.keys(permisosEditados).reduce((acc, key) => {
          acc[key] = permisosEditados[key] ? 1 : 0;
          return acc;
      }, {});

      try {
          await axios({
              method: method,
              url: endpoint,
              data: permisosDB,
              ...getConfig()
          });
          toast.info(`Permisos del empleado ${idEmpleado} ${tienePermisoExistente ? 'actualizados' : 'creados'}.`);
          obtenerTodosLosPermisos(); // Recargar la lista maestra de permisos
      } catch (error) {
          console.error(`Error al gestionar permisos:`, error);
          toast.error(`Error al gestionar permisos. ${error.response?.data?.error || ''}`);
      }
  };


  const guardarCambios = async () => {
    try {
      // 1. Actualizar datos del empleado
      const dataToUpdate = {
        ...empleadoEditado,
        apellidoEmpleado: empleadoEditado.apellidoEmpleado || ""
      }
      
      await axios.put(
        `http://localhost:5000/empleados/actualizar/${editandoId}`,
        dataToUpdate,
        getConfig()
      );
      
      // 2. Actualizar/Crear Permisos
      await actualizarPermisos(editandoId);
      
      // 3. Finalizar
      cancelarEdicion();
      obtenerEmpleados();
      toast.success("Empleado y permisos actualizados correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al actualizar empleado");
    }
  };

  const toggleActivo = async (idEmpleado, activoActual) => {
    const endpoint = activoActual ? 
        `http://localhost:5000/empleados/baja/${idEmpleado}` : 
        `http://localhost:5000/empleados/reactivar/${idEmpleado}`;
    
    const action = activoActual ? "dado de baja" : "reactivado";

    try {
        await axios.put(endpoint, {}, getConfig());
        
        setEmpleados(empleados.map(emp => 
          emp.idEmpleado === idEmpleado ? { ...emp, activo: !activoActual } : emp
        ));

        toast.success(`Empleado ${action} correctamente`);
    } catch (error) {
        console.error(`Error al ${action} empleado:`, error);
        toast.error(`Error al ${action} empleado`);
    }
  }


  const agregarEmpleado = async () => {
    try {
      // 1. Crear el empleado (El ID se asigna en el backend)
      const res = await axios.post("http://localhost:5000/Empleados/crear", nuevoEmpleado, getConfig());
      
      // 2. Dado que el ID del nuevo empleado no está disponible aquí directamente,
      //    la creación de permisos del nuevo empleado debería hacerse en la edición posterior
      //    o tu backend debería devolver el ID del empleado recién creado.
      //    Por ahora, simplemente refrescamos la lista y el admin lo edita después.

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
      toast.error("Error al agregar empleado. Verifica el email.");
    }
  };
  
  // LÓGICA DE FILTRADO Y BÚSQUEDA
  const empleadosFiltrados = empleados.filter((emp) => {
    const isActive = emp.activo === 0 ? false : (emp.activo === 1 ? true : emp.activo === undefined ? true : emp.activo);

    const coincideBusqueda = 
      emp.nombreEmpleado.toLowerCase().includes(busqueda.toLowerCase()) ||
      (emp.apellidoEmpleado && emp.apellidoEmpleado.toLowerCase().includes(busqueda.toLowerCase())) ||
      emp.emailEmpleado.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && isActive) ||
      (filtroEstado === "inactivos" && !isActive);

    return coincideBusqueda && coincideEstado;
  });

  // Renderizado del Modal de Edición/Creación
  const renderEmpleadoModal = () => {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl" // Aumentado el ancho
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editandoId ? 'Editar Empleado y Permisos' : 'Agregar Nuevo Empleado'}
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
                    <h3 className="text-xl font-semibold mb-3 text-primary-700">Datos Personales</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {[
                        { label: "Nombre", name: "nombreEmpleado", value: empleadoEditado.nombreEmpleado },
                        { label: "Apellido", name: "apellidoEmpleado", value: empleadoEditado.apellidoEmpleado },
                        { label: "Email", name: "emailEmpleado", value: empleadoEditado.emailEmpleado },
                        {
                            label: "Contraseña (dejar vacío si no cambia)",
                            name: "contraEmpleado",
                            type: "password",
                            value: empleadoEditado.contraEmpleado,
                        },
                        ].map(({ label, name, type = "text", value }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                            <input
                            type={type}
                            name={name}
                            value={value}
                            onChange={(e) =>
                                setEmpleadoEditado({ ...empleadoEditado, [name]: e.target.value })
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        ))}
                    </div>
                </div>

                {/* COLUMNA 2: PERMISOS (Solo en Edición) */}
                {editandoId && (
                    <div>
                        <h3 className="text-xl font-semibold mb-3 text-primary-700">Permisos de Acceso</h3>
                        <div className="space-y-2 bg-gray-50 p-4 rounded-md border">
                            {Object.keys(PERMISOS_DEFAULT).map(permiso => (
                                <div key={permiso} className="flex items-center">
                                    <input
                                        id={permiso}
                                        name={permiso}
                                        type="checkbox"
                                        checked={permisosEditados[permiso]}
                                        onChange={handlePermisoChange}
                                        className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor={permiso} className="ml-3 text-sm font-medium text-gray-700">
                                        {/* Texto amigable para el permiso */}
                                        {permiso === 'crear_productos' && 'Crear Productos'}
                                        {permiso === 'modificar_productos' && 'Modificar Productos (Editar/Baja/Activar)'}
                                        {permiso === 'modificar_ventasE' && 'Modificar Ventas Empleados'}
                                        {permiso === 'modificar_ventasO' && 'Modificar Ventas Online (Estado)'}
                                        {permiso === 'ver_ventasTotalesE' && 'Ver Ventas Totales Empleados'}
                                        {permiso === 'ver_ventasTotalesO' && 'Ver Ventas Totales Online'}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
              </div> {/* Fin grid principal */}

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

      {/* MODAL CONDICIONAL: Usa el nuevo renderModal */}
      {isModalOpen && renderEmpleadoModal()}

      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Administración de Empleados
          </h1>
          <button
            // Abrir el modal en modo "Agregar"
            onClick={() => {
                setEditandoId(null);
                setEmpleadoEditado({
                    nombreEmpleado: "",
                    apellidoEmpleado: "",
                    emailEmpleado: "",
                    contraEmpleado: "",
                });
                setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar Empleado
          </button>
        </div>
        
        {/* BUSQUEDA Y FILTRADO */}
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
                    const isActive = emp.activo === 0 ? false : (emp.activo === 1 ? true : emp.activo === undefined ? true : emp.activo);
                    
                    return (
                        <tr key={emp.idEmpleado} className="hover:bg-gray-50">
                            {editandoId === emp.idEmpleado ? (
                            <>
                                {/* Campos Editables en línea eliminados para forzar el uso del modal */}
                                <td colSpan="5" className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900">Editando a {emp.nombreEmpleado} {emp.apellidoEmpleado}...</p>
                                </td>
                                
                                {/* Columna Acciones (Solo Cancelar en línea, Edición completa en modal) */}
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex gap-2 justify-end">
                                    <button
                                    onClick={cancelarEdicion}
                                    className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors"
                                    >
                                    Cerrar Edición
                                    </button>
                                </div>
                                </td>
                            </>
                            ) : (
                            <>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {emp.nombreEmpleado}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {emp.apellidoEmpleado || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {emp.emailEmpleado}
                                </td>
                                
                                {/* Columna Estado */}
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {isActive ? "Activo" : "Inactivo"}
                                    </span>
                                </td>

                                {/* Columna Acciones */}
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex gap-2 justify-end">
                                    <button
                                    onClick={() => iniciarEdicion(emp)}
                                    className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1"
                                    >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                    Editar Permisos
                                    </button>
                                    <button
                                    onClick={() => toggleActivo(emp.idEmpleado, isActive)}
                                    className={`px-3 py-1 text-white rounded hover:opacity-90 text-xs flex items-center gap-1 ${isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}
                                    >
                                    {isActive ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    )}
                                    {isActive ? "Desactivar" : "Activar"}
                                    </button>
                                </div>
                                </td>
                            </>
                            )}
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