import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import Swal from "sweetalert2";

const AdminEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  const [empleadoEditado, setEmpleadoEditado] = useState({
    nombreEmpleado: "",
    emailEmpleado: "",
    contraEmpleado: "",
  });

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombreEmpleado: "",
    emailEmpleado: "",
    contraEmpleado: "",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
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
    setEmpleadoEditado({
      nombreEmpleado: emp.nombreEmpleado,
      emailEmpleado: emp.emailEmpleado,
      contraEmpleado: emp.contraEmpleado,
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setEmpleadoEditado({
      nombreEmpleado: "",
      emailEmpleado: "",
      contraEmpleado: "",
    });
  };

  const guardarCambios = async () => {
    try {
      await axios.put(
        `http://localhost:5000/empleados/modificar/${editandoId}`,
        empleadoEditado
      );
      cancelarEdicion();
      obtenerEmpleados();
      toast.success("Empleado actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const eliminarEmpleado = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/empleados/eliminar/${id}`);
        obtenerEmpleados();
        toast.success("Empleado eliminado correctamente");
      } catch (error) {
        console.error("Error al eliminar empleado:", error);
      }
    }
  };

  const agregarEmpleado = async () => {
    try {
      await axios.post("http://localhost:5000/empleados/crear", nuevoEmpleado);
      setIsModalOpen(false);
      setNuevoEmpleado({
        nombreEmpleado: "",
        emailEmpleado: "",
        contraEmpleado: "",
      });
      obtenerEmpleados();
      toast.success("Empleado agregado correctamente");
    } catch (error) {
      console.error("Error al agregar empleado:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer position="top-right" autoClose={3000} />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Agregar Nuevo Empleado
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: "Nombre", name: "nombreEmpleado" },
                  { label: "Email", name: "emailEmpleado" },
                  {
                    label: "Contraseña",
                    name: "contraEmpleado",
                    type: "password",
                  },
                ].map(({ label, name, type = "text" }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={type}
                      name={name}
                      value={nuevoEmpleado[name]}
                      onChange={(e) =>
                        setNuevoEmpleado({
                          ...nuevoEmpleado,
                          [name]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarEmpleado}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Guardar Empleado
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Administración de Empleados
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar Empleado
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-primary-100">
                <tr>
                  {["Nombre", "Email", "Contraseña", "Acciones"].map(
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
                {empleados.map((emp) => (
                  <tr key={emp.idEmpleado} className="hover:bg-gray-50">
                    {editandoId === emp.idEmpleado ? (
                      <>
                        {["nombreEmpleado", "emailEmpleado", "contraEmpleado"].map(
                          (campo) => (
                            <td
                              key={campo}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              <input
                                name={campo}
                                value={empleadoEditado[campo]}
                                onChange={(e) =>
                                  setEmpleadoEditado({
                                    ...empleadoEditado,
                                    [campo]: e.target.value,
                                  })
                                }
                                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                              />
                            </td>
                          )
                        )}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={guardarCambios}
                              className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-xs transition-colors"
                            >
                              Guardar
                            </button>
                            <button
                              onClick={cancelarEdicion}
                              className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors"
                            >
                              Cancelar
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {emp.nombreEmpleado}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {emp.emailEmpleado}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ••••••
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => iniciarEdicion(emp)}
                              className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => eliminarEmpleado(emp.idEmpleado)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-colors"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </>
                    )}
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

export default AdminEmpleados;
