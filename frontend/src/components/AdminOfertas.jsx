import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useAuthStore } from "../store/useAuthStore";

const AdminOfertas = () => {
  const [ofertas, setOfertas] = useState([]);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [nuevaOferta, setNuevaOferta] = useState({
    idProducto: "",
    porcentajeDescuento: "",
    fechaInicio: "",
    fechaFin: "",
  });
  
  // ESTADOS PARA BÚSQUEDA Y FILTRADO
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos"); // 'todos', 'activas', 'inactivas'

  const modalRef = useRef();
  const token = useAuthStore((state) => state.token);

  const getConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const fechOfertas = async () => {
    try {
      // Ruta GET /ofertas NO está protegida, no necesita Token
      const response = await axios.get("http://localhost:5000/ofertas");
      setOfertas(response.data);
    } catch (error) {
      console.error("Error al cargar las ofertas:", error);
      toast.error("Error al cargar las ofertas.");
    }
  };

  useEffect(() => {
    fechOfertas();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalAbierto(false);
      }
    };

    if (modalAbierto) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalAbierto]);

  const toggleActiva = async (idOferta, esActiva) => {
    try {
      // Ruta PUT /ofertas/esActiva/:idOferta NO está protegida, no necesita Token
      await axios.put(`http://localhost:5000/ofertas/esActiva/${idOferta}`, {
        esActiva: !esActiva,
      });
      
      // Actualización optimista de la UI
      setOfertas(ofertas.map(oferta => 
        oferta.idOferta === idOferta ? { ...oferta, esActiva: !esActiva } : oferta
      ));

      toast.success(`Oferta ${!esActiva ? "activada" : "desactivada"} correctamente.`);
    } catch (error) {
      console.error("Error al cambiar estado de oferta:", error);
      toast.error("Error al cambiar estado de oferta.");
    }
  };

  const eliminarOferta = async (idOferta) => {
    const resultado = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡Esta acción eliminará la oferta permanentemente!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (resultado.isConfirmed) {
        try {
            // Ruta DELETE /ofertas/eliminar/:idOferta ESTÁ PROTEGIDA, USA TOKEN
            await axios.delete(`http://localhost:5000/ofertas/eliminar/${idOferta}`, getConfig());
            fechOfertas();
            toast.success("Oferta eliminada correctamente.");
        } catch (error) {
            console.error("Error al eliminar oferta:", error);
            toast.error("Error al eliminar oferta. Verifica tus permisos.");
        }
    }
  };

  const crearOferta = async () => {
    try {
      // Ruta POST /ofertas/crear ESTÁ PROTEGIDA, USA TOKEN
      await axios.post("http://localhost:5000/ofertas/crear", nuevaOferta, getConfig());
      
      setModalAbierto(false);
      setNuevaOferta({
        idProducto: "",
        porcentajeDescuento: "",
        fechaInicio: "",
        fechaFin: "",
      });
      fechOfertas();
      toast.success("Oferta creada correctamente.");
    } catch (error) {
      console.error("Error al crear una oferta:", error);
      toast.error("Error al crear una oferta. Verifica datos y permisos.");
    }
  };

  const handleChange = (e) => {
    setNuevaOferta({ ...nuevaOferta, [e.target.name]: e.target.value });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    const fechaObj = new Date(fecha);
    const fechaCorregida = new Date(fechaObj.getTime() + fechaObj.getTimezoneOffset() * 60000);
    return fechaCorregida.toLocaleDateString("es-AR");
  };

  // LÓGICA DE FILTRADO Y BÚSQUEDA
  const ofertasFiltradas = ofertas.filter((oferta) => {
    const coincideBusqueda = 
      oferta.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activas" && oferta.esActiva) ||
      (filtroEstado === "inactivas" && !oferta.esActiva);

    return coincideBusqueda && coincideEstado;
  });


  return (
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Modal para agregar oferta */}
      {modalAbierto && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Crear Nueva Oferta
                </h2>
                <button
                  onClick={() => setModalAbierto(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID del Producto
                  </label>
                  <input
                    type="number"
                    name="idProducto"
                    placeholder="ID del producto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={nuevaOferta.idProducto}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Porcentaje Descuento (%)
                  </label>
                  <input
                    type="number"
                    name="porcentajeDescuento"
                    placeholder="Ej: 15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={nuevaOferta.porcentajeDescuento}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    name="fechaInicio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={nuevaOferta.fechaInicio}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de Fin
                  </label>
                  <input
                    type="date"
                    name="fechaFin"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={nuevaOferta.fechaFin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setModalAbierto(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={crearOferta}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Guardar Oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Administración de Ofertas
            </h1>
          </div>

          <button
            onClick={() => setModalAbierto(true)}
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
            Agregar Oferta
          </button>
        </div>

        {/* BÚSQUEDA Y FILTRADO */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre de producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded w-full md:w-1/2"
          />

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="todos">Todas las ofertas</option>
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
          </select>
        </div>

        {/* Tabla de ofertas */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-primary-100">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Producto
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Descuento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Inicio
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Fin
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Estado
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ofertasFiltradas.map((oferta) => (
                <tr
                  key={oferta.idOferta}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {oferta.nombreProducto}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {oferta.porcentajeDescuento}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatearFecha(oferta.fechaInicio)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatearFecha(oferta.fechaFin)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        oferta.esActiva
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {oferta.esActiva ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() =>
                          toggleActiva(oferta.idOferta, oferta.esActiva)
                        }
                        className={`flex items-center gap-1 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
                          oferta.esActiva
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {oferta.esActiva ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        )}
                        {oferta.esActiva ? "Desactivar" : "Activar"}
                      </button>
                      {/* Botón de Eliminar permanente */}
                      <button
                        onClick={() => eliminarOferta(oferta.idOferta)}
                        className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOfertas;