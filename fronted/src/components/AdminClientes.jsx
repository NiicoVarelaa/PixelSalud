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
    email: "",
    rol: ""
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombreCliente: "",
    contraCliente: "",
    email: "",
    rol: ""
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
      }
    });
  };

  const agregarCliente = async () => {
    try {
      await axios.post("http://localhost:5000/clientes/crear", nuevoCliente);
      toast.success("Cliente agregado correctamente");
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
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Modal para agregar cliente */}
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
                    placeholder="Nombre completo"
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cli) => (
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
                      {editandoId === cli.idCliente ? (
                        <input
                          name="email"
                          value={clienteEditado.email}
                          onChange={(e) => setClienteEditado({ ...clienteEditado, [e.target.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        cli.email
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
