import { useState, useEffect } from "react";
import axios from "axios";

const AdminEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [empleadoEditado, setEmpleadoEditado] = useState({
    nombreEmpleado: "",
    email: "",
    contraEmpleado: "",
    rol: "",
  });

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombreEmpleado: "",
    email: "",
    contraEmpleado: "",
    rol: "",
  });

  const obtenerEmpleados = async () => {
    try {
      const res = await axios.get("http://localhost:5000/empleados");
      setEmpleados(res.data);
    } catch (error) {
      console.error("Error al obtener empleados", error);
    }
  };

  useEffect(() => {
    obtenerEmpleados();
  }, []);

  const iniciarEdicion = (emp) => {
    setEditandoId(emp.idEmpleado);
    setEmpleadoEditado({ ...emp });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEmpleadoEditado({
      nombreEmpleado: "",
      email: "",
      contraEmpleado: "",
      rol: "",
    });
  };

  const guardarCambios = async () => {
    try {
      await axios.put(
        `http://localhost:5000/empleados/actualizar/${editandoId}`,
        empleadoEditado
      );
      cancelarEdicion();
      obtenerEmpleados();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    if (confirm("¿Eliminar este empleado?")) {
      try {
        await axios.delete(`http://localhost:5000/empleados/eliminar/${id}`);
        obtenerEmpleados();
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
      }
    }
  };

  const agregarEmpleado = async () => {
    try {
      await axios.post("http://localhost:5000/empleados/crear", nuevoEmpleado);
      setMostrarFormulario(false);
      obtenerEmpleados();
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Lista de Empleados
        </h2>

        {!mostrarFormulario ? (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Agregar Empleado
          </button>
        ) : (
          <div className="w-full bg-white p-4 rounded-lg shadow mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {["nombreEmpleado", "email", "contraEmpleado", "rol"].map((campo) => (
                <input
                  key={campo}
                  name={campo}
                  value={nuevoEmpleado[campo]}
                  onChange={(e) =>
                    setNuevoEmpleado({
                      ...nuevoEmpleado,
                      [e.target.name]: e.target.value,
                    })
                  }
                  placeholder={campo}
                  className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={agregarEmpleado}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Confirmar
              </button>
              <button
                onClick={() => {
                  setMostrarFormulario(false);
                  setNuevoEmpleado({
                    nombreEmpleado: "",
                    email: "",
                    contraEmpleado: "",
                    rol: "",
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
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Contraseña</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(empleados) &&
              empleados.map((emp) => (
                <tr key={emp.idEmpleado} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {editandoId === emp.idEmpleado ? (
                      <input
                        name="nombreEmpleado"
                        value={empleadoEditado.nombreEmpleado}
                        onChange={(e) =>
                          setEmpleadoEditado({
                            ...empleadoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      emp.nombreEmpleado
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editandoId === emp.idEmpleado ? (
                      <input
                        name="email"
                        value={empleadoEditado.email}
                        onChange={(e) =>
                          setEmpleadoEditado({
                            ...empleadoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      emp.email
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editandoId === emp.idEmpleado ? (
                      <input
                        name="contraEmpleado"
                        value={empleadoEditado.contraEmpleado}
                        onChange={(e) =>
                          setEmpleadoEditado({
                            ...empleadoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      <span className="text-gray-500">••••••</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editandoId === emp.idEmpleado ? (
                      <input
                        name="rol"
                        value={empleadoEditado.rol}
                        onChange={(e) =>
                          setEmpleadoEditado({
                            ...empleadoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="border rounded p-1 w-full"
                      />
                    ) : (
                      emp.rol
                    )}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    {editandoId === emp.idEmpleado ? (
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
                          onClick={() => iniciarEdicion(emp)}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                          onClick={() => eliminarEmpleado(emp.idEmpleado)}
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

export default AdminEmpleados;
