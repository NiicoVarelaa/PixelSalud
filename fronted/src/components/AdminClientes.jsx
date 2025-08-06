import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  const [clienteEditado, setClienteEditado] = useState({
    nombreCliente: "",
    contraCliente: "",
<<<<<<< HEAD
    email: "",  
=======
    email: "",
>>>>>>> Nico
    rol: ""
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombreCliente: "",
    contraCliente: "",
    email: "",
    rol: ""
  });

<<<<<<< HEAD
  // Cerrar modal al hacer click fuera
=======
>>>>>>> Nico
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
<<<<<<< HEAD
      document.addEventListener("mousedown", handleClickOutside);
=======
      document.body.style.overflow = 'hidden';
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = 'auto';
>>>>>>> Nico
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const iniciarEdicion = (cli) => {
    setEditandoId(cli.idCliente);
    setClienteEditado({ ...cli });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setClienteEditado({
      nombreCliente: "",
      contraCliente: "",
      email: "",
      rol: ""
    });
  };

  const obtenerClientes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/clientes");
      setClientes(res.data);
    } catch (error) {
      console.error("Error al obtener Clientes", error);
    }
  };

  useEffect(() => {
    obtenerClientes();
  }, []);

  const guardarCambios = async () => {
    try {
      await axios.put(
        `http://localhost:5000/clientes/actualizar/${editandoId}`,
        clienteEditado
      );
      toast.success("Cliente actualizado correctamente");
      cancelarEdicion();
      obtenerClientes();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al actualizar cliente");
    }
  };

  const eliminarCliente = async (id) => {
<<<<<<< HEAD
    console.log(id)
    if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await axios.delete(`http://localhost:5000/clientes/eliminar/${id}`);
        obtenerClientes();
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
=======
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/clientes/eliminar/${id}`);
          toast.success("Cliente eliminado correctamente");
          obtenerClientes();
          Swal.fire(
            '¡Eliminado!',
            'El cliente ha sido eliminado.',
            'success'
          );
        } catch (error) {
          console.error("Error al eliminar cliente:", error);
          toast.error("Error al eliminar cliente");
        }
>>>>>>> Nico
      }
    });
  };

  const agregarCliente = async () => {
    try {
      await axios.post("http://localhost:5000/clientes/crear", nuevoCliente);
<<<<<<< HEAD
=======
      toast.success("Cliente agregado correctamente");
>>>>>>> Nico
      setIsModalOpen(false);
      setNuevoCliente({
        nombreCliente: "",
        contraCliente: "",
        email: "",
        rol: ""
      });
      obtenerClientes();
    } catch (error) {
      console.error("Error al agregar cliente:", error);
      toast.error("Error al agregar cliente");
    }
  };

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* Modal para agregar cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
=======
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Modal para agregar cliente */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
>>>>>>> Nico
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
<<<<<<< HEAD
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
=======
                  ✕
>>>>>>> Nico
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
                    placeholder="Nombre completo"
                  />
                </div>
<<<<<<< HEAD

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
                    name="email"
                    value={nuevoCliente.email}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="correo@ejemplo.com"
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
                    <option value="">Seleccionar rol</option>
                    <option value="admin">Admin</option>
                    <option value="admin">Empleado</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
=======
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
                    name="email"
                    value={nuevoCliente.email}
                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="correo@ejemplo.com"
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
                    <option value="">Seleccionar rol</option>
                    <option value="cliente">Empleado</option>
                    <option value="cliente">Cliente</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
>>>>>>> Nico
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarCliente}
<<<<<<< HEAD
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
=======
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2"
                >
>>>>>>> Nico
                  Guardar Cliente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto">
<<<<<<< HEAD
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administración de Clientes</h1>
          </div>
          
=======
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Administración de Clientes</h1>
>>>>>>> Nico
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

<<<<<<< HEAD
        {/* Tabla de clientes */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-primary-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contraseña
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
=======
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left divide-y divide-gray-200">
              <thead className="bg-primary-100">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Contraseña</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase">Rol</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase text-right">Acciones</th>
>>>>>>> Nico
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cli) => (
<<<<<<< HEAD
                  <tr key={cli.idCliente} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
=======
                  <tr key={cli.idCliente} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
>>>>>>> Nico
                      {editandoId === cli.idCliente ? (
                        <input
                          name="nombreCliente"
                          value={clienteEditado.nombreCliente}
<<<<<<< HEAD
                          onChange={(e) =>
                            setClienteEditado({
                              ...clienteEditado,
                              [e.target.name]: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{cli.nombreCliente}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editandoId === cli.idCliente ? (
                        <input
                          type="text"
                          name="contraCliente"
                          value={clienteEditado.contraCliente}
                          onChange={(e) =>
                            setClienteEditado({
                              ...clienteEditado,
                              [e.target.name]: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      ) : (
                        <span className="text-gray-500">••••••</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
=======
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
                          name="contraCliente"
                          value={clienteEditado.contraCliente}
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        "••••••"
                      )}
                    </td>
                    <td className="px-6 py-4">
>>>>>>> Nico
                      {editandoId === cli.idCliente ? (
                        <input
                          name="email"
                          value={clienteEditado.email}
<<<<<<< HEAD
                          onChange={(e) =>
                            setClienteEditado({
                              ...clienteEditado,
                              [e.target.name]: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      ) : (
                        <div className="text-sm text-gray-900">{cli.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
=======
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        cli.email
                      )}
                    </td>
                    <td className="px-6 py-4">
>>>>>>> Nico
                      {editandoId === cli.idCliente ? (
                        <select
                          name="rol"
                          value={clienteEditado.rol}
<<<<<<< HEAD
                          onChange={(e) =>
                            setClienteEditado({
                              ...clienteEditado,
                              [e.target.name]: e.target.value,
                            })
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        >
                          <option value="admin">Admin</option>
                          <option value="admin">Empleado</option>
                          <option value="cliente">Cliente</option>
                        </select>
                      ) : (
                        <div className="text-sm text-gray-900">{cli.rol}</div>
                      )}
                    </td>
                  
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editandoId === cli.idCliente ? (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={guardarCambios}
                            className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Guardar
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => iniciarEdicion(cli)}
                            className="flex items-center gap-1 bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Editar
                          </button>
                          <button
                            onClick={() => eliminarCliente(cli.idCliente)}
                            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Eliminar
                          </button>
=======
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="empleado">Empleado</option>
                          <option value="cliente">Cliente</option>
                        </select>
                      ) : (
                        cli.rol
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editandoId === cli.idCliente ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={guardarCambios} className="px-3 py-1 bg-primary-600 text-white rounded hover:bg-primary-700 text-xs">Guardar</button>
                          <button onClick={cancelarEdicion} className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 text-xs">Cancelar</button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => iniciarEdicion(cli)} className="px-3 py-1 bg-secondary-500 text-white rounded hover:bg-secondary-600 text-xs">Editar</button>
                          <button onClick={() => eliminarCliente(cli.idCliente)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs">Eliminar</button>
>>>>>>> Nico
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientes;