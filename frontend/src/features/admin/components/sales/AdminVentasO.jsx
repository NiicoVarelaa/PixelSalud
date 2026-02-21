import { useState, useEffect, useReducer } from "react";
import apiClient from "@utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import {
  Search,
  Eye,
  Globe,
  Edit,
  ShoppingBag,
  XCircle,
  Trash2,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

// --- REDUCER (Igual que en Ventas Empleados) ---
const ventaReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "LOAD_SALE":
      return { ...state, ...action.payload };
    case "ADD_PRODUCT":
      return { ...state, productos: [...state.productos, action.product] };
    case "UPDATE_PRODUCT": // Para cambiar cantidad o precio en el ticket si fuera necesario
      return {
        ...state,
        productos: state.productos.map((prod, index) =>
          index === action.index
            ? { ...prod, [action.field]: action.value }
            : prod,
        ),
      };
    case "REMOVE_PRODUCT":
      return {
        ...state,
        productos: state.productos.filter((_, index) => index !== action.index),
      };
    case "RESET":
      return action.initialState;
    default:
      return state;
  }
};

const AdminVentasO = () => {
  const initialState = {
    idCliente: "",
    metodoPago: "Efectivo",
    totalPago: 0,
    productos: [],
  };

  const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);

  // Datos
  const [ventas, setVentas] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  // Filtros y UI
  const [filtro, setFiltro] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [cargando, setCargando] = useState(true);

  // Edición
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clienteEditando, setClienteEditando] = useState(""); // Para mostrar nombre en el modal

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 6;

  // Estados posibles
  const estadosPosibles = ["Pendiente", "Retirado", "Cancelado"];

  // Estados para el Buscador del Modal (Igual a VentasEmpleados)
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // --- CARGA DE DATOS ---
  const obtenerDatos = async () => {
    try {
      setCargando(true);
      const [resVentas, resProd] = await Promise.all([
        apiClient.get("/ventasOnline/todas"),
        apiClient.get("/productos"),
      ]);

      // Deduplicación
      const rawVentas = resVentas.data.results || resVentas.data || [];
      const ventasUnicas = [];
      const map = new Map();
      for (const item of rawVentas) {
        if (!map.has(item.idVentaO)) {
          map.set(item.idVentaO, true);
          ventasUnicas.push(item);
        }
      }

      setVentas(ventasUnicas);
      // Filtramos productos activos para el buscador
      const prods = resProd.data.results || resProd.data || [];
      setProductosDisponibles(prods.filter((p) => p.activo));
    } catch (error) {
      console.error("Error cargando datos:", error);
      toast.error("Error al cargar datos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, []);

  // Cálculo Total Automático
  useEffect(() => {
    const nuevoTotal = ventaForm.productos.reduce((acc, prod) => {
      return (
        acc + (Number(prod.cantidad) || 0) * (Number(prod.precioUnitario) || 0)
      );
    }, 0);
    if (ventaForm.totalPago !== nuevoTotal) {
      dispatch({ type: "SET_FIELD", field: "totalPago", value: nuevoTotal });
    }
  }, [ventaForm.productos]);

  // --- LÓGICA DEL BUSCADOR EN EL MODAL (Igual a Empleados) ---
  useEffect(() => {
    if (terminoBusqueda.length < 3) {
      setResultadosBusqueda([]);
      return;
    }
    const timer = setTimeout(() => {
      // Filtramos localmente los productos disponibles para no hacer tantas peticiones
      const resultados = productosDisponibles.filter((p) =>
        p.nombreProducto.toLowerCase().includes(terminoBusqueda.toLowerCase()),
      );
      setResultadosBusqueda(resultados);
    }, 300);
    return () => clearTimeout(timer);
  }, [terminoBusqueda, productosDisponibles]);

  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod);
    setResultadosBusqueda([]);
    setTerminoBusqueda("");
    setCantidad(1);
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const cantInt = parseInt(cantidad);
    if (isNaN(cantInt) || cantInt <= 0)
      return Swal.fire("Error", "Cantidad inválida", "warning");
    if (cantInt > productoSeleccionado.stock)
      return Swal.fire("Error", "Stock insuficiente", "warning");

    dispatch({
      type: "ADD_PRODUCT",
      product: {
        idProducto: productoSeleccionado.idProducto,
        nombreProducto: productoSeleccionado.nombreProducto,
        precioUnitario: productoSeleccionado.precio,
        cantidad: cantInt,
      },
    });
    setProductoSeleccionado(null);
    setCantidad(1);
    toast.success("Producto agregado");
  };

  // --- LÓGICA EDICIÓN ---
  const handleEditarVenta = async (venta) => {
    Swal.fire({ title: "Cargando...", didOpen: () => Swal.showLoading() });
    try {
      const res = await apiClient.get(
        `/ventasOnline/detalle/${venta.idVentaO}`,
      );
      const detalles = res.data;

      const productosFormateados = detalles.map((d) => ({
        idProducto: d.idProducto,
        nombreProducto: d.nombreProducto, // Importante para que se vea en el ticket
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      }));

      dispatch({
        type: "LOAD_SALE",
        payload: {
          idCliente: venta.idCliente,
          metodoPago: venta.metodoPago,
          totalPago: venta.totalPago,
          productos: productosFormateados,
        },
      });

      setEditingId(venta.idVentaO);
      setClienteEditando(`${venta.nombreCliente} ${venta.apellidoCliente}`);
      setTerminoBusqueda("");
      setProductoSeleccionado(null);

      Swal.close();
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar la venta.", "error");
    }
  };

  const handleSubmit = async () => {
    if (ventaForm.productos.length === 0) {
      toast.error("El carrito está vacío.");
      return;
    }
    try {
      await apiClient.put(`/ventaOnline/actualizar/${editingId}`, ventaForm);
      toast.success("Venta Online actualizada.");
      setIsModalOpen(false);
      obtenerDatos();
    } catch (error) {
      toast.error("Error al guardar cambios.");
    }
  };

  // --- CAMBIO ESTADO ---
  const handleEstadoChange = async (idVentaO, nuevoEstado) => {
    try {
      const estadoLower = nuevoEstado.toLowerCase();
      await apiClient.put("/ventaOnline/estado", {
        idVentaO,
        nuevoEstado: estadoLower,
      });

      setVentas((prev) =>
        prev.map((v) =>
          v.idVentaO === idVentaO ? { ...v, estado: estadoLower } : v,
        ),
      );
      toast.success(`Estado cambiado a: ${nuevoEstado}`);
    } catch (error) {
      toast.error("Error al cambiar estado.");
    }
  };

  // --- VER TICKET (DETALLE) ---
  const handleVerDetalle = async (venta) => {
    Swal.fire({ title: "Cargando...", didOpen: () => Swal.showLoading() });
    try {
      const res = await apiClient.get(
        `/ventasOnline/detalle/${venta.idVentaO}`,
      );
      const detalles = res.data;

      let rows = detalles
        .map(
          (d) => `
                <tr style="border-bottom: 1px solid #eee;">
                    <td style="padding: 8px; text-align: left;">${d.nombreProducto}</td>
                    <td style="padding: 8px; text-align: center;">${d.cantidad}</td>
                    <td style="padding: 8px; text-align: right;">$${d.precioUnitario}</td>
                    <td style="padding: 8px; text-align: right; font-weight: bold;">$${d.cantidad * d.precioUnitario}</td>
                </tr>`,
        )
        .join("");

      const envioInfo =
        venta.tipoEntrega === "Envio"
          ? `<div style="background: #eff6ff; padding: 10px; border-radius: 8px; margin-bottom: 10px; text-align: left; font-size: 12px; color: #1e40af;">
                    <strong>🚚 Envío:</strong> ${venta.direccion || "Sin dirección"} (${venta.ciudad || "-"})
                 </div>`
          : "";

      Swal.fire({
        title: `<span style="color: #333;">Orden #${venta.idVentaO}</span>`,
        html: `
                    <div style="font-size: 14px; margin-bottom: 10px; text-align: left;">
                        <strong>Cliente:</strong> ${venta.nombreCliente} ${venta.apellidoCliente}<br/>
                        <strong>DNI:</strong> ${venta.dni || "-"}<br/>
                    </div>
                    ${envioInfo}
                    <div style="border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                        <table width="100%" style="font-size: 13px; border-collapse: collapse;">
                            <thead style="background: #f3f4f6;">
                                <tr>
                                    <th style="padding: 8px; text-align: left;">Prod</th>
                                    <th style="padding: 8px; text-align: center;">Cant</th>
                                    <th style="padding: 8px; text-align: right;">$ Unit</th>
                                    <th style="padding: 8px; text-align: right;">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                            <tfoot style="background: #f9fafb;">
                                <tr>
                                    <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold;">TOTAL:</td>
                                    <td style="padding: 10px; text-align: right; font-weight: bold; color: #4338ca; font-size: 15px;">
                                        ${formatearMoneda(venta.totalPago)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                `,
        width: "600px",
        confirmButtonColor: "#4f46e5",
        confirmButtonText: "Cerrar",
      });
    } catch (e) {
      Swal.fire("Error", "No se pudo cargar detalle", "error");
    }
  };

  // --- UTILS ---
  const formatearMoneda = (val) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(Number(val) || 0);
  const formatearFecha = (f) =>
    !f ? "-" : new Date(f).toLocaleDateString("es-ES");

  // --- FILTROS Y PAGINACIÓN ---
  const ventasFiltradas = ventas.filter((v) => {
    const txt = filtro.toLowerCase();
    const coincide =
      (v.nombreCliente?.toLowerCase() || "").includes(txt) ||
      v.idVentaO?.toString().includes(txt) ||
      (v.dni?.toString() || "").includes(txt);
    const estadoVenta = (v.estado || "").toLowerCase();
    const estadoFiltro = filtroEstado.toLowerCase();
    const coincideEstado =
      filtroEstado === "Todos" ? true : estadoVenta === estadoFiltro;
    return coincide && coincideEstado;
  });

  const itemsActuales = ventasFiltradas.slice(
    (paginaActual - 1) * itemsPorPagina,
    paginaActual * itemsPorPagina,
  );
  const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);
  const cambiarPagina = (n) => setPaginaActual(n);
  const getPaginationNumbers = () => {
    const r = [];
    for (let i = 1; i <= totalPaginas; i++) r.push(i);
    return r;
  };

  // --- RENDER MODAL "PANEL DE EDICIÓN" (Estilo AdminVentasE) ---
  const renderModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-fadeIn overflow-hidden">
        {/* Header Modal */}
        <div className="p-4 bg-indigo-600 text-white flex justify-between items-center shadow-md shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Edit size={24} /> {`Editar Venta Online #${editingId}`}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-white hover:bg-indigo-700 p-2 rounded-full transition"
          >
            <XCircle size={28} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          {/* IZQUIERDA: BUSCADOR */}
          <div className="w-full lg:w-1/2 p-6 bg-gray-50 flex flex-col border-r border-gray-200 overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Search size={20} /> Buscar Producto
            </h3>
            <div className="relative mb-6">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                placeholder="Escribe nombre del producto..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              {resultadosBusqueda.length > 0 && (
                <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {resultadosBusqueda.map((prod) => (
                    <li
                      key={prod.idProducto}
                      onClick={() => seleccionarProducto(prod)}
                      className="p-3 hover:bg-indigo-50 cursor-pointer border-b flex justify-between items-center"
                    >
                      <span className="font-medium truncate mr-2">
                        {prod.nombreProducto}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        Stock: {prod.stock}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Tarjeta de Producto Seleccionado */}
            <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white min-h-[300px]">
              {productoSeleccionado ? (
                <div className="w-full text-center animate-fadeIn">
                  <h3 className="text-xl font-bold text-indigo-800 mb-2">
                    {productoSeleccionado.nombreProducto}
                  </h3>
                  <div className="flex justify-center gap-8 text-gray-600 text-lg mb-6">
                    <p className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                      Precio:{" "}
                      <span className="font-bold text-green-600">
                        ${productoSeleccionado.precio}
                      </span>
                    </p>
                    <p className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                      Stock:{" "}
                      <span className="font-bold text-blue-600">
                        {productoSeleccionado.stock}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <label className="font-medium text-gray-700">
                      Cantidad:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={productoSeleccionado.stock}
                      className="w-24 p-2 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={agregarAlCarrito}
                    className="w-full py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg transform active:scale-95"
                  >
                    Agregar al Ticket ⬇️
                  </button>
                </div>
              ) : (
                <div className="text-gray-400 text-center">
                  <ShoppingBag size={48} className="mx-auto mb-2 opacity-50" />
                  <p>Busca y selecciona un producto para agregarlo.</p>
                </div>
              )}
            </div>
          </div>

          {/* DERECHA: TICKET */}
          <div className="w-full lg:w-1/2 p-6 flex flex-col bg-white overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                🧾 Ticket de Venta{" "}
                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs">
                  {ventaForm.productos.length} items
                </span>
              </h3>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border">
                <UserCircle size={16} className="text-gray-500" />
                <span className="text-xs font-bold text-gray-600 uppercase">
                  CLIENTE: {clienteEditando}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg mb-4">
              <table className="w-full text-left">
                <thead className="bg-gray-100 sticky top-0">
                  <tr>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase">
                      Prod.
                    </th>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase text-center">
                      Cant.
                    </th>
                    <th className="p-3 text-xs font-bold text-gray-500 uppercase text-right">
                      Subtotal
                    </th>
                    <th className="p-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ventaForm.productos.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 group">
                      <td className="p-3 text-sm font-medium text-gray-800">
                        {item.nombreProducto}
                      </td>
                      <td className="p-3 text-center text-sm">
                        {item.cantidad}
                      </td>
                      <td className="p-3 text-right text-sm font-bold text-gray-700">
                        {formatearMoneda(item.cantidad * item.precioUnitario)}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() =>
                            dispatch({ type: "REMOVE_PRODUCT", index })
                          }
                          className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {ventaForm.productos.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-8 text-center text-gray-400 italic"
                      >
                        El ticket está vacío.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={ventaForm.metodoPago}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "metodoPago",
                        value: e.target.value,
                      })
                    }
                    className="p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-indigo-500 outline-none text-sm w-40"
                  >
                    <option value="Efectivo">💵 Efectivo</option>
                    <option value="Tarjeta">💳 Tarjeta</option>
                    <option value="Transferencia">🏦 Transferencia</option>
                  </select>
                </div>
                <div className="text-right">
                  <span className="block text-gray-500 text-xs uppercase">
                    Total Final
                  </span>
                  <span className="text-3xl font-extrabold text-indigo-700">
                    {formatearMoneda(ventaForm.totalPago)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                disabled={ventaForm.productos.length === 0}
                className={`w-full py-3 rounded-lg font-bold text-lg shadow-md transition ${ventaForm.productos.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"}`}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white p-6 w-full animate-fadeIn">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      {isModalOpen && renderModal()}

      <div className="w-full mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Globe className="text-indigo-600" size={32} /> Ventas Online
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Gestión de pedidos web y envíos.
            </p>
          </div>
          <Link
            to="/admin/MenuVentas"
            className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
          >
            ← Volver
          </Link>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar por ID, Cliente..."
              value={filtro}
              onChange={(e) => {
                setFiltro(e.target.value);
                setPaginaActual(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setPaginaActual(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="Todos">📂 Todos</option>
              {estadosPosibles.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
          {cargando ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando...</p>
            </div>
          ) : (
            <div className="w-full">
              <table className="w-full divide-y divide-gray-200 table-fixed">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[5%]">
                      ID
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[15%]">
                      Cliente
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">
                      DNI
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[8%]">
                      Detalle
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">
                      Fecha
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[8%]">
                      Hora
                    </th>
                    <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">
                      Método
                    </th>
                    <th className="px-2 py-3 text-right text-xs font-bold text-gray-600 uppercase w-[12%]">
                      Total
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[15%]">
                      Estado
                    </th>
                    <th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[7%]">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {itemsActuales.length > 0 ? (
                    itemsActuales.map((venta) => {
                      const st = (venta.estado || "").toLowerCase();
                      const estadoVisual =
                        st.charAt(0).toUpperCase() + st.slice(1);
                      // Lógica para color del select
                      let colorSelect = "bg-yellow-100 text-yellow-800";
                      if (st === "retirado")
                        colorSelect = "bg-green-100 text-green-800";
                      if (st === "cancelado")
                        colorSelect = "bg-red-100 text-red-800";
                      // Valor exacto para el value del select
                      const valSelect =
                        estadosPosibles.find((e) => e.toLowerCase() === st) ||
                        "Pendiente";

                      return (
                        <tr
                          key={venta.idVentaO}
                          className={`hover:bg-indigo-50/30 transition ${st === "cancelado" ? "bg-red-50/50" : ""}`}
                        >
                          <td className="px-2 py-3 text-gray-500 font-mono text-xs break-all">
                            #{venta.idVentaO}
                          </td>
                          <td
                            className="px-2 py-3 text-sm font-medium text-gray-800 truncate"
                            title={venta.nombreCliente}
                          >
                            {venta.nombreCliente} {venta.apellidoCliente}
                          </td>
                          <td className="px-2 py-3 text-sm text-gray-600 font-mono truncate">
                            {venta.dni || "-"}
                          </td>

                          {/* OJITO SOLO */}
                          <td className="px-2 py-3 text-center">
                            <button
                              onClick={() => handleVerDetalle(venta)}
                              className="p-1.5 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
                            >
                              <Eye size={16} />
                            </button>
                          </td>

                          <td className="px-2 py-3 text-sm text-gray-600">
                            {formatearFecha(venta.fechaPago)}
                          </td>
                          <td className="px-2 py-3 text-sm text-gray-500 font-mono">
                            {venta.horaPago?.slice(0, 5)}
                          </td>
                          <td className="px-2 py-3">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200 capitalize truncate block">
                              {venta.metodoPago}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-right text-sm font-bold text-indigo-700">
                            {formatearMoneda(venta.totalPago)}
                          </td>

                          {/* SELECTOR DE ESTADO */}
                          <td className="px-2 py-3 text-center">
                            <select
                              className={`text-xs font-bold px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${colorSelect}`}
                              value={valSelect}
                              onChange={(e) =>
                                handleEstadoChange(
                                  venta.idVentaO,
                                  e.target.value,
                                )
                              }
                            >
                              {estadosPosibles.map((op) => (
                                <option
                                  key={op}
                                  value={op}
                                  className="bg-white text-gray-800"
                                >
                                  {op}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* SOLO EDITAR EN ACCIONES */}
                          <td className="px-2 py-3 text-center">
                            <button
                              onClick={() => handleEditarVenta(venta)}
                              className="p-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                              title="Editar"
                            >
                              <Edit size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="10"
                        className="px-6 py-8 text-center text-gray-400 text-sm"
                      >
                        No se encontraron pedidos web.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          {/* PAGINACIÓN */}
          {!cargando && itemsActuales.length > 0 && (
            <div className="flex justify-center py-6 bg-white border-t border-gray-200">
              <nav className="flex items-center gap-1">
                <button
                  onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))}
                  disabled={paginaActual === 1}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors ${paginaActual === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  &lt;
                </button>
                {getPaginationNumbers().map((num, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      typeof num === "number" && cambiarPagina(num)
                    }
                    disabled={typeof num !== "number"}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${num === paginaActual ? "bg-indigo-600 text-white shadow-md" : typeof num === "number" ? "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50" : "text-gray-400"}`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() =>
                    cambiarPagina(Math.min(totalPaginas, paginaActual + 1))
                  }
                  disabled={paginaActual === totalPaginas}
                  className={`w-8 h-8 flex items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors ${paginaActual === totalPaginas ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  &gt;
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminVentasO;
