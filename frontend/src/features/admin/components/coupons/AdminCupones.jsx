import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAuthStore } from "@store/useAuthStore";
import {
  FiTag,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiFilter,
} from "react-icons/fi";

const AdminCupones = () => {
  const [cupones, setCupones] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [vistaActual, setVistaActual] = useState("cupones"); // 'cupones' o 'historial'
  const token = useAuthStore((state) => state.token);

  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const modalRef = useRef();

  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 8;

  const [nuevoCupon, setNuevoCupon] = useState({
    codigo: "",
    tipoCupon: "porcentaje",
    valorDescuento: "",
    descripcion: "",
    fechaInicio: "",
    fechaVencimiento: "",
    usoMaximo: 1,
    tipoUsuario: "todos",
    montoMinimo: 0,
  });

  const getConfig = () => ({
    headers: { Auth: `Bearer ${token}` },
  });

  const fetchCupones = async () => {
    setCargando(true);
    try {
      const response = await axios.get(
        "http://localhost:5000/cupones",
        getConfig(),
      );
      setCupones(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar cupones:", error);
      toast.error("Error al cargar los cupones");
      setCupones([]);
    } finally {
      setCargando(false);
    }
  };

  const fetchHistorial = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/cupones/historial",
        getConfig(),
      );
      setHistorial(response.data.data || []);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    }
  };

  useEffect(() => {
    fetchCupones();
  }, []);

  useEffect(() => {
    if (vistaActual === "historial") {
      fetchHistorial();
    }
  }, [vistaActual]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalAbierto(false);
      }
    };
    if (modalAbierto)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalAbierto]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado, filtroTipo]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "N/A";
    return new Date(fecha).toLocaleDateString("es-AR");
  };

  const formatearFechaInput = (fechaISO) => {
    if (!fechaISO) return "";
    return new Date(fechaISO).toISOString().split("T")[0];
  };

  const crearCupon = async () => {
    try {
      if (
        !nuevoCupon.codigo ||
        !nuevoCupon.valorDescuento ||
        !nuevoCupon.fechaInicio ||
        !nuevoCupon.fechaVencimiento
      ) {
        toast.error("Complete todos los campos obligatorios");
        return;
      }

      if (parseFloat(nuevoCupon.valorDescuento) <= 0) {
        toast.error("El valor del descuento debe ser mayor a 0");
        return;
      }

      if (
        nuevoCupon.tipoCupon === "porcentaje" &&
        parseFloat(nuevoCupon.valorDescuento) > 100
      ) {
        toast.error("El porcentaje no puede ser mayor a 100");
        return;
      }

      await axios.post(
        "http://localhost:5000/cupones",
        nuevoCupon,
        getConfig(),
      );
      toast.success("Cupón creado exitosamente");
      setModalAbierto(false);
      resetFormulario();
      fetchCupones();
    } catch (error) {
      console.error("Error al crear cupón:", error);
      toast.error(error.response?.data?.message || "Error al crear el cupón");
    }
  };

  const cambiarEstado = async (idCupon, estadoActual) => {
    const nuevoEstado = estadoActual === "activo" ? "inactivo" : "activo";

    const result = await Swal.fire({
      title: "¿Cambiar estado del cupón?",
      text: `El cupón será ${nuevoEstado}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(
          `http://localhost:5000/cupones/${idCupon}/estado`,
          { estado: nuevoEstado },
          getConfig(),
        );
        toast.success(`Cupón ${nuevoEstado} exitosamente`);
        fetchCupones();
      } catch (error) {
        console.error("Error al cambiar estado:", error);
        toast.error("Error al cambiar el estado del cupón");
      }
    }
  };

  const eliminarCupon = async (idCupon) => {
    const result = await Swal.fire({
      title: "¿Eliminar cupón?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:5000/cupones/${idCupon}`,
          getConfig(),
        );
        toast.success("Cupón eliminado exitosamente");
        fetchCupones();
      } catch (error) {
        console.error("Error al eliminar cupón:", error);
        toast.error("Error al eliminar el cupón");
      }
    }
  };

  const abrirModal = () => {
    resetFormulario();
    setModalAbierto(true);
  };

  const resetFormulario = () => {
    setNuevoCupon({
      codigo: "",
      tipoCupon: "porcentaje",
      valorDescuento: "",
      descripcion: "",
      fechaInicio: "",
      fechaVencimiento: "",
      usoMaximo: 1,
      tipoUsuario: "todos",
      montoMinimo: 0,
    });
  };

  const cuponesFiltrados = cupones.filter((cupon) => {
    const matchBusqueda =
      cupon.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      cupon.descripcion?.toLowerCase().includes(busqueda.toLowerCase());

    const matchEstado =
      filtroEstado === "todos" || cupon.estado === filtroEstado;

    const matchTipo =
      filtroTipo === "todos" || cupon.tipoUsuario === filtroTipo;

    return matchBusqueda && matchEstado && matchTipo;
  });

  const indiceUltimo = paginaActual * itemsPorPagina;
  const indicePrimero = indiceUltimo - itemsPorPagina;
  const cuponesActuales = cuponesFiltrados.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(cuponesFiltrados.length / itemsPorPagina);

  const getBadgeColor = (estado) => {
    switch (estado) {
      case "activo":
        return "bg-green-100 text-green-800";
      case "inactivo":
        return "bg-gray-100 text-gray-800";
      case "expirado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FiTag className="text-green-600" />
              Gestión de Cupones
            </h1>
            <p className="text-gray-600 mt-1">
              Administra cupones de descuento y promociones
            </p>
          </div>
          <button
            onClick={abrirModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiPlus />
            Nuevo Cupón
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setVistaActual("cupones")}
            className={`px-4 py-2 font-medium transition-colors ${
              vistaActual === "cupones"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Cupones ({cupones.length})
          </button>
          <button
            onClick={() => setVistaActual("historial")}
            className={`px-4 py-2 font-medium transition-colors ${
              vistaActual === "historial"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Historial de Uso
          </button>
        </div>
      </div>

      {vistaActual === "cupones" ? (
        <>
          {/* Filtros */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiSearch className="inline mr-2" />
                  Buscar
                </label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Código o descripción..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Filtro Estado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FiFilter className="inline mr-2" />
                  Estado
                </label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="activo">Activos</option>
                  <option value="inactivo">Inactivos</option>
                  <option value="expirado">Expirados</option>
                </select>
              </div>

              {/* Filtro Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo Usuario
                </label>
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="todos">Todos</option>
                  <option value="nuevo">Nuevos</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla */}
          {cargando ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : cuponesActuales.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FiTag className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No se encontraron cupones</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Código
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descuento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vigencia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cuponesActuales.map((cupon) => (
                      <tr
                        key={cupon.idCupon}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {cupon.codigo}
                            </div>
                            <div className="text-sm text-gray-500">
                              {cupon.descripcion}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-green-600">
                            {cupon.tipoCupon === "porcentaje"
                              ? `${cupon.valorDescuento}%`
                              : `$${cupon.valorDescuento}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {cupon.tipoUsuario}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{formatearFecha(cupon.fechaInicio)}</div>
                          <div>{formatearFecha(cupon.fechaVencimiento)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <span className="font-medium text-gray-900">
                              {cupon.vecesUsado}
                            </span>
                            <span className="text-gray-500">
                              {" "}
                              / {cupon.usoMaximo}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getBadgeColor(
                              cupon.estado,
                            )}`}
                          >
                            {cupon.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                cambiarEstado(cupon.idCupon, cupon.estado)
                              }
                              className={`p-2 rounded-lg transition-colors ${
                                cupon.estado === "activo"
                                  ? "text-gray-600 hover:bg-gray-100"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={
                                cupon.estado === "activo"
                                  ? "Desactivar"
                                  : "Activar"
                              }
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => eliminarCupon(cupon.idCupon)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {totalPaginas > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando{" "}
                    <span className="font-medium">{indicePrimero + 1}</span> a{" "}
                    <span className="font-medium">
                      {Math.min(indiceUltimo, cuponesFiltrados.length)}
                    </span>{" "}
                    de{" "}
                    <span className="font-medium">
                      {cuponesFiltrados.length}
                    </span>{" "}
                    cupones
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setPaginaActual((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={paginaActual === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() =>
                        setPaginaActual((prev) =>
                          Math.min(prev + 1, totalPaginas),
                        )
                      }
                      disabled={paginaActual === totalPaginas}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Historial de Uso */
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Código
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Descuento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Venta
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historial.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <p className="text-gray-500">
                        No hay registros de uso de cupones
                      </p>
                    </td>
                  </tr>
                ) : (
                  historial.map((uso) => (
                    <tr key={uso.idUso} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">
                          {uso.codigo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {uso.nombreCliente}
                        </div>
                        <div className="text-sm text-gray-500">
                          {uso.emailCliente}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          <div className="font-medium text-green-600">
                            ${uso.montoDescuento}
                          </div>
                          <div className="text-gray-500">
                            ${uso.montoOriginal} → ${uso.montoFinal}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatearFecha(uso.fechaUso)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="text-blue-600">#{uso.idVentaO}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Crear Cupón */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800">
                Crear Nuevo Cupón
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Código */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del Cupón *
                </label>
                <input
                  type="text"
                  value={nuevoCupon.codigo}
                  onChange={(e) =>
                    setNuevoCupon({
                      ...nuevoCupon,
                      codigo: e.target.value.toUpperCase(),
                    })
                  }
                  placeholder="Ej: VERANO2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={nuevoCupon.descripcion}
                  onChange={(e) =>
                    setNuevoCupon({
                      ...nuevoCupon,
                      descripcion: e.target.value,
                    })
                  }
                  placeholder="Ej: Descuento especial de verano"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Tipo y Valor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Descuento *
                  </label>
                  <select
                    value={nuevoCupon.tipoCupon}
                    onChange={(e) =>
                      setNuevoCupon({
                        ...nuevoCupon,
                        tipoCupon: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="porcentaje">Porcentaje (%)</option>
                    <option value="monto_fijo">Monto Fijo ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor del Descuento *
                  </label>
                  <input
                    type="number"
                    value={nuevoCupon.valorDescuento}
                    onChange={(e) =>
                      setNuevoCupon({
                        ...nuevoCupon,
                        valorDescuento: e.target.value,
                      })
                    }
                    placeholder={
                      nuevoCupon.tipoCupon === "porcentaje" ? "10" : "500"
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Inicio *
                  </label>
                  <input
                    type="date"
                    value={nuevoCupon.fechaInicio}
                    onChange={(e) =>
                      setNuevoCupon({
                        ...nuevoCupon,
                        fechaInicio: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha Vencimiento *
                  </label>
                  <input
                    type="date"
                    value={nuevoCupon.fechaVencimiento}
                    onChange={(e) =>
                      setNuevoCupon({
                        ...nuevoCupon,
                        fechaVencimiento: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Configuración */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usos Máximos
                  </label>
                  <input
                    type="number"
                    value={nuevoCupon.usoMaximo}
                    onChange={(e) =>
                      setNuevoCupon({
                        ...nuevoCupon,
                        usoMaximo: e.target.value,
                      })
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo Usuario
                  </label>
                  <select
                    value={nuevoCupon.tipoUsuario}
                    onChange={(e) =>
                      setNuevoCupon({
                        ...nuevoCupon,
                        tipoUsuario: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="todos">Todos</option>
                    <option value="nuevo">Nuevos</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto Mínimo ($)
                  </label>
                  <input
                    type="number"
                    value={nuevoCupon.montoMinimo}
                    onChange={(e) =>
                      setNuevoCupon({
                        ...nuevoCupon,
                        montoMinimo: e.target.value,
                      })
                    }
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={crearCupon}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Crear Cupón
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCupones;
