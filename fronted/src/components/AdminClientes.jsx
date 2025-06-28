import { useState, useEffect } from "react";
import axios from "axios";

const AdminClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [clienteEditado, setClienteEditado] = useState({
    nombreCliente: "",
    contraCliente: "",
    email: "",
    receta: false,
    rolCliente: "",
  });

  const [nuevoCliente, setNuevoCliente] = useState({
    nombreCliente: "",
    contraCliente: "",
    email: "",
    receta: false,
    rolCliente: "",
  });

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
      receta: false,
      rolCliente: "",
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
      cancelarEdicion();
      obtenerClientes();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const eliminarCliente = async (id) => {
    if (confirm("¿Eliminar este cliente?")) {
      try {
        await axios.delete(`http://localhost:5000/clientes/eliminar/${id}`);
        obtenerClientes();
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
      }
    }
  };

  const agregarCliente = async () => {
    try {
      await axios.post("http://localhost:5000/clientes/crear", nuevoCliente);
      setMostrarFormulario(false);
      obtenerClientes();
    } catch (error) {
      console.error("Error al agregar cliente:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Lista de Clientes
        </h2>

        {!mostrarFormulario ? (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Agregar Cliente
          </button>
        ) : (
          <div className="w-full bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["nombreCliente", "contraCliente", "email", "rolCliente"].map(
                (campo) => (
                  <input
                    key={campo}
                    name={campo}
                    value={nuevoCliente[campo]}
                    onChange={(e) =>
                      setNuevoCliente({
                        ...nuevoCliente,
                        [e.target.name]: e.target.value,
                      })
                    }
                    placeholder={campo}
                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                )
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={nuevoCliente.receta}
                  onChange={(e) =>
                    setNuevoCliente({
                      ...nuevoCliente,
                      receta: e.target.checked,
                    })
                  }
                />
                <span>¿Receta?</span>
              </label>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={agregarCliente}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setNuevoCliente({
                    nombreCliente: "",
                    contraCliente: "",
                    email: "",
                    receta: false,
                    rolCliente: "",
                  });
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Contraseña</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Receta</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cli) => (
              <tr key={cli.idCliente} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
                  {editandoId === cli.idCliente ? (
                    <input
                      name="nombreCliente"
                      value={clienteEditado.nombreCliente}
                      onChange={(e) =>
                        setClienteEditado({
                          ...clienteEditado,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    cli.nombreCliente
                  )}
                </td>
                <td className="px-4 py-2">
                  {editandoId === cli.idCliente ? (
                    <input
                      type="text" // mostramos la contraseña cuando se edita
                      name="contraCliente"
                      value={clienteEditado.contraCliente}
                      onChange={(e) =>
                        setClienteEditado({
                          ...clienteEditado,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    <span className="text-gray-500">••••••</span> // contraseña oculta
                  )}
                </td>
                <td className="px-4 py-2">
                  {editandoId === cli.idCliente ? (
                    <input
                      name="email"
                      value={clienteEditado.email}
                      onChange={(e) =>
                        setClienteEditado({
                          ...clienteEditado,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    cli.email
                  )}
                </td>
                <td className="px-4 py-2">
                  {editandoId === cli.idCliente ? (
                    <input
                      name="rolCliente"
                      value={clienteEditado.rolCliente}
                      onChange={(e) =>
                        setClienteEditado({
                          ...clienteEditado,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    cli.rolCliente
                  )}
                </td>
                <td className="px-4 py-2">
                  {editandoId === cli.idCliente ? (
                    <input
                      type="checkbox"
                      checked={clienteEditado.receta}
                      onChange={(e) =>
                        setClienteEditado({
                          ...clienteEditado,
                          receta: e.target.checked,
                        })
                      }
                    />
                  ) : cli.receta ? (
                    "Sí"
                  ) : (
                    "No"
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {editandoId === cli.idCliente ? (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        onClick={guardarCambios}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                        onClick={cancelarEdicion}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded"
                        onClick={() => iniciarEdicion(cli)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => eliminarCliente(cli.idCliente)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminClientes;
