/* import { useState, useEffect, useRef } from "react";
import apiClient from "../utils/apiClient"; // Usamos tu cliente configurado
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AdminMedicos = () => {
  const [medicos, setMedicos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Estados para el formulario
  const [medicoEditado, setMedicoEditado] = useState({
    nombreMedico: "",
    apellidoMedico: "",
    matricula: "",
    emailMedico: "",
    contraMedico: "",
  });

  const [nuevoMedico, setNuevoMedico] = useState({
    nombreMedico: "",
    apellidoMedico: "",
    matricula: "",
    emailMedico: "",
    contraMedico: "",
  });

  const getConfig = () => ({
    headers: {
      'Auth': `Bearer ${token}`
    }
  });


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

  // --- FUNCIONES DE API ---

  const obtenerMedicos = async () => {
    try {
      // Nota: Usamos minúscula '/medicos' que es lo estándar. 
      // Si tu backend define la ruta como '/Medicos', cámbialo aquí.
      const res = await apiClient.get("/medicos");
      setMedicos(res.data);
    } catch (error) {
      // MANEJO ESPECÍFICO PARA TU CONTROLADOR
      // Tu backend devuelve 404 si no hay médicos (results.length === 0)
      if (error.response && error.response.status === 404) {
        setMedicos([]); // No es un error real, solo que está vacío
        console.log("La base de datos de médicos está vacía.");
      } else {
        console.error("Error al obtener médicos", error);
        toast.error("Error al cargar la lista de médicos.");
      }
    }
  };

  useEffect(() => {
    obtenerMedicos();
  }, []);

  const iniciarEdicion = (med) => {
    setEditandoId(med.idMedico);
    setMedicoEditado({
      nombreMedico: med.nombreMedico,
      apellidoMedico: med.apellidoMedico,
      matricula: med.matricula,
      emailMedico: med.emailMedico,
      contraMedico: "", // Se inicia vacía por seguridad
    });
    setIsModalOpen(true);
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setIsModalOpen(false);
    // Limpiamos ambos estados
    setMedicoEditado({
      nombreMedico: "",
      apellidoMedico: "",
      matricula: "",
      emailMedico: "",
      contraMedico: "",
    });
    setNuevoMedico({
        nombreMedico: "",
        apellidoMedico: "",
        matricula: "",
        emailMedico: "",
        contraMedico: "",
    });
  };

  const guardarCambios = async () => {
    // VALIDACIÓN IMPORTANTE: Tu backend siempre hashea la contraseña.
    // Si envías una cadena vacía, la contraseña del usuario dejará de funcionar.
    if (medicoEditado.contraMedico.trim() === "") {
        toast.warning("Debes ingresar la contraseña para confirmar la edición.");
        return;
    }

    try {
      // Tu backend updateMedico NO usa el campo matrícula en el SET
      // Solo actualiza nombre, apellido, email y contraseña.
      await apiClient.put(
        `/medicos/actualizar/${editandoId}`,
        medicoEditado
      );
      
      cancelarEdicion();
      obtenerMedicos();
      toast.success("Médico actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al actualizar médico");
    }
  };

  const toggleActivo = async (idMedico, activoActual) => {
    const endpoint = activoActual ? 
        `/medicos/darBaja/${idMedico}` : 
        `/medicos/reactivar/${idMedico}`;
    
    const action = activoActual ? "dado de baja" : "reactivado";

    try {
        await apiClient.put(endpoint, {});
        
        // Actualización optimista de la UI
        setMedicos(medicos.map(med => 
          med.idMedico === idMedico ? { ...med, activo: !activoActual } : med
        ));

        toast.success(`Médico ${action} correctamente`);
    } catch (error) {
        console.error(`Error al ${action} médico:`, error);
        toast.error(`Error al ${action} médico`);
    }
  }

  const agregarMedico = async () => {
    try {
      await apiClient.post("/medicos/crear", nuevoMedico);
      
      setIsModalOpen(false);
      setNuevoMedico({
        nombreMedico: "",
        apellidoMedico: "",
        matricula: "",
        emailMedico: "",
        contraMedico: "",
      });
      obtenerMedicos();
      toast.success("Médico creado exitosamente");
    } catch (error) {
      console.error("Error al agregar médico:", error);
      // Tu backend devuelve 409 si ya existe email o matrícula
      if (error.response && error.response.status === 409) {
          toast.error("Error: El email o la matrícula ya están registrados.");
      } else {
          toast.error("Error al crear el médico.");
      }
    }
  };
  
  // --- FILTROS ---
  const medicosFiltrados = medicos.filter((med) => {
    // Normalización del estado activo (mysql devuelve 1/0)
    const isActive = med.activo === 0 ? false : (med.activo === 1 ? true : med.activo === undefined ? true : med.activo);

    const coincideBusqueda = 
      med.nombreMedico.toLowerCase().includes(busqueda.toLowerCase()) ||
      (med.apellidoMedico && med.apellidoMedico.toLowerCase().includes(busqueda.toLowerCase())) ||
      (med.matricula && String(med.matricula).includes(busqueda)) ||
      med.emailMedico.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && isActive) ||
      (filtroEstado === "inactivos" && !isActive);

    return coincideBusqueda && coincideEstado;
  });

  // --- RENDERIZADO ---
  const renderMedicoModal = () => {
      const isEdit = editandoId !== null;
      
      const fields = [
          { label: "Nombre", name: "nombreMedico", type: "text" },
          { label: "Apellido", name: "apellidoMedico", type: "text" },
          // Matrícula deshabilitada en edición porque el backend no la actualiza
          { label: "Matrícula", name: "matricula", type: "text", disabled: isEdit },
          { label: "Email", name: "emailMedico", type: "email" },
          { 
              label: isEdit ? "Re-ingresar Contraseña (Obligatorio)" : "Contraseña", 
              name: "contraMedico", 
              type: "password" 
          },
      ];

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-2xl"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEdit ? 'Editar Médico' : 'Registrar Nuevo Médico'}
                </h2>
                <button
                  onClick={cancelarEdicion}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {fields.map(({ label, name, type, disabled = false }) => {
                  
                  // LÓGICA DE INPUT (CORRECCIÓN ANTERIOR)
                  const valorInput = isEdit 
                      ? medicoEditado[name] 
                      : nuevoMedico[name];

                  return (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                      <input
                        type={type}
                        name={name}
                        value={valorInput}
                        onChange={(e) => {
                            if (isEdit) {
                                setMedicoEditado({ ...medicoEditado, [name]: e.target.value });
                            } else {
                                setNuevoMedico({ ...nuevoMedico, [name]: e.target.value });
                            }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:text-gray-500"
                        disabled={disabled}
                        placeholder={isEdit && name === 'contraMedico' ? "Requerido para guardar" : ""}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={cancelarEdicion}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={isEdit ? guardarCambios : agregarMedico}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  {isEdit ? "Guardar Cambios" : "Guardar Médico"}
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

      {isModalOpen && renderMedicoModal()}

      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Administración de Médicos
          </h1>
          <button
            onClick={() => {
                setEditandoId(null);
                setNuevoMedico({
                    nombreMedico: "",
                    apellidoMedico: "",
                    matricula: "",
                    emailMedico: "",
                    contraMedico: "",
                });
                setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Registrar Médico
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, matrícula o email..."
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
                  {["Nombre", "Apellido", "Matrícula", "Email", "Estado", "Acciones"].map(
                    (title, i) => (
                      <th key={i} className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${title === "Acciones" ? "text-right" : ""}`}>
                        {title}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {medicosFiltrados.length > 0 ? (
                    medicosFiltrados.map((med) => {
                        const isActive = med.activo === 0 ? false : (med.activo === 1 ? true : med.activo === undefined ? true : med.activo);
                        
                        return (
                            <tr key={med.idMedico} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.nombreMedico}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.apellidoMedico || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{med.matricula}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{med.emailMedico}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {isActive ? "Activo" : "Inactivo"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className="flex gap-2 justify-end">
                                    <button onClick={() => iniciarEdicion(med)} className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    Editar
                                    </button>
                                    <button onClick={() => toggleActivo(med.idMedico, isActive)} className={`px-3 py-1 text-white rounded hover:opacity-90 text-xs flex items-center gap-1 ${isActive ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}`}>
                                    {isActive ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                    )}
                                    {isActive ? "Desactivar" : "Activar"}
                                    </button>
                                </div>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                            No se encontraron médicos registrados.
                        </td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMedicos; */