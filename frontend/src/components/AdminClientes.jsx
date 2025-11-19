import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "../store/useAuthStore";

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();
  
  // ESTADOS PARA BÚSQUEDA Y FILTRADO
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const token = useAuthStore((state) => state.token);

  const [clienteEditado, setClienteEditado] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    contraCliente: "",
    emailCliente: "",
    rol: "",
    dni: "", // Aseguramos que el DNI esté en el estado de edición
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombreCliente: "",
    apellidoCliente: "",
    contraCliente: "",
    emailCliente: "",
    rol: "cliente", // Valor predeterminado
    dni: "",
  });

  const getConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const iniciarEdicion = (cli) => {
    setEditandoId(cli.idCliente);
    setClienteEditado({ 
        ...cli,
        apellidoCliente: cli.apellidoCliente || "", 
        contraCliente: "", 
        dni: cli.dni || "",
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setClienteEditado({
      nombreCliente: "",
      apellidoCliente: "",
      contraCliente: "",
      emailCliente: "",
      rol: "",
      dni: "",
    });
  };

  const obtenerClientes = async () => {
    try {
      // Necesitas crear un endpoint en el backend que devuelva el campo 'activo'
      // Tu controlador `getClientes` solo devuelve `idCliente, nombreCliente, apellidoCliente, emailCliente, fecha_registro, hora_registro, rol`.
      // Si el campo `activo` no viene de la base de datos, la lógica de filtro y el botón no funcionarán correctamente.
      // ASUMO que tu consulta SQL ya fue actualizada para incluir el campo `activo`.
      const res = await axios.get("http://localhost:5000/clientes", getConfig());
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener Clientes", error);
      toast.error("Error al cargar clientes. ¿Token inválido o permisos insuficientes?");
    }
  };

  useEffect(() => {
    if (token) {
        obtenerClientes();
    }
  }, [token]);

  const guardarCambios = async () => {
    try {
      const dataToUpdate = {
        ...clienteEditado,
        // Si no se cambia la contraseña, el backend recibirá el campo vacío y lo hashea,
        // lo que podría ser incorrecto. Tu controlador UPDATE asume que siempre se envía
        // y hashea `contraCliente`. Esto puede requerir un manejo de contraseña más inteligente en el backend.
        apellidoCliente: clienteEditado.apellidoCliente || "",
        dni: clienteEditado.dni || "",
      };

      await axios.put(
        `http://localhost:5000/clientes/actualizar/${editandoId}`,
        dataToUpdate,
        getConfig()
      );
      toast.success("Cliente actualizado correctamente");
      cancelarEdicion();
      obtenerClientes();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al actualizar cliente");
    }
  };


  const agregarCliente = async () => {
    try {
      const dataToCreate = {
        ...nuevoCliente,
        apellidoCliente: nuevoCliente.apellidoCliente || "",
        dni: nuevoCliente.dni || "",
      };

      await axios.post("http://localhost:5000/clientes/crear", dataToCreate);
      toast.success("Cliente agregado correctamente");
      setIsModalOpen(false);
      setNuevoCliente({
        nombreCliente: "",
        apellidoCliente: "",
        contraCliente: "",
        emailCliente: "",
        rol: "cliente",
        dni: "",
      });
      obtenerClientes();
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      toast.error("Error al agregar cliente. Verifica que el email no exista.");
    }
  };

  // LÓGICA CORREGIDA DEL BOTÓN (Actualización del estado 'clientes')
  const toggleActivo = async (idCliente, activoActual) => {
    const endpoint = activoActual ? 
        `http://localhost:5000/clientes/darBaja/${idCliente}` :
        `http://localhost:5000/clientes/activar/${idCliente}`;
    
    const action = activoActual ? "dado de baja" : "reactivado";

    try {
        await axios.put(endpoint, {}, getConfig());
        
        // CORRECCIÓN CLAVE: Actualizar el estado local directamente
        setClientes(clientes.map(cli => 
          cli.idCliente === idCliente ? { ...cli, activo: !activoActual } : cli
        ));

        toast.success(`Cliente ${action} correctamente`);
        // No es estrictamente necesario, pero lo mantenemos para sincronizar completamente
        // obtenerClientes(); 
    } catch (error) {
        console.error(`Error al ${action} cliente:`, error);
        toast.error(`Error al ${action} cliente`);
    }
  }
  
  // LÓGICA DE FILTRADO Y BÚSQUEDA
  const clientesFiltrados = clientes.filter((cli) => {
    // ASUMIMOS que el backend devuelve el campo 'activo'. Si no lo hace, el valor 
    // por defecto debe ser 'true' o la base de datos debe corregirse.
    const activoCliente = cli.activo === undefined ? true : cli.activo;

    const coincideBusqueda = 
      cli.nombreCliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      (cli.apellidoCliente && cli.apellidoCliente.toLowerCase().includes(busqueda.toLowerCase())) ||
      cli.emailCliente.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && activoCliente) ||
      (filtroEstado === "inactivos" && !activoCliente);

    return coincideBusqueda && coincideEstado;
  });


  return (
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] relative">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administración de Clientes</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar Cliente
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


      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div 
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Cliente</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    name="nombreCliente"
                    value={nuevoCliente.nombreCliente}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    name="apellidoCliente"
                    value={nuevoCliente.apellidoCliente}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Apellido"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input
                    type="password"
                    name="contraCliente"
                    value={nuevoCliente.contraCliente}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Contraseña segura"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="emailCliente"
                    value={nuevoCliente.emailCliente}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="correo@ejemplo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DNI</label>
                  <input
                    type="text"
                    name="dni"
                    value={nuevoCliente.dni}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="DNI/Identificación"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                  <select
                    name="rol"
                    value={nuevoCliente.rol}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="cliente">Cliente</option>
                    <option value="empleado">Empleado</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarCliente}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
                >
                  Guardar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-gray-200">
              <thead className="bg-primary-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Apellido</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Rol</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Estado</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientesFiltrados.map((cli) => {
                  // Corregimos la asunción: si 'activo' no viene del backend, asumimos 'true'
                  const isActive = cli.activo === 0 ? false : (cli.activo === 1 ? true : cli.activo === undefined ? true : cli.activo);

                  return (
                  <tr key={cli.idCliente} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {editandoId === cli.idCliente ? (
                        <input
                          name="nombreCliente"
                          value={clienteEditado.nombreCliente}
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        cli.nombreCliente
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editandoId === cli.idCliente ? (
                        <input
                          name="apellidoCliente"
                          value={clienteEditado.apellidoCliente}
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        cli.apellidoCliente || 'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editandoId === cli.idCliente ? (
                        <input
                          type="email"
                          name="emailCliente"
                          value={clienteEditado.emailCliente}
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        cli.emailCliente
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editandoId === cli.idCliente ? (
                        <select
                          name="rol"
                          value={clienteEditado.rol}
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="empleado">Empleado</option>
                          <option value="cliente">Cliente</option>
                          <option value="admin">Administrador</option>
                        </select>
                      ) : (
                        cli.rol
                      )}
                    </td>
                    
                    {/* COLUMNA DE ESTADO */}
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

                    <td className="px-6 py-4 text-right">
                      {editandoId === cli.idCliente ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={guardarCambios} className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs">Guardar</button>
                          <button onClick={cancelarEdicion} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-xs">Cancelar</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => iniciarEdicion(cli)} 
                            className="px-3 py-1 bg-secondary-500 text-white rounded hover:bg-secondary-600 text-xs flex items-center gap-1"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Editar
                          </button>
                          <button 
                            onClick={() => toggleActivo(cli.idCliente, isActive)}
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
                      )}
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

export default AdminClientes;