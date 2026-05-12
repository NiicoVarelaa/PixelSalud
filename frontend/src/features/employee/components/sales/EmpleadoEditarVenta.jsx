import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "@store/useAuthStore";
import {
  Search,
  ArrowLeft,
  Plus,
  Trash2,
  Minus,
  Receipt,
  Package,
  Loader2,
  X,
} from "lucide-react";

const formatMoneda = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return "$0";
  return `$${num.toLocaleString("es-AR")}`;
};

const OPCIONES_METODO_PAGO = [
  { value: "Efectivo", label: "Efectivo" },
  { value: "Tarjeta - Débito", label: "Tarjeta - Débito" },
  { value: "Tarjeta - Crédito", label: "Tarjeta - Crédito" },
  { value: "Transferencia", label: "Transferencia" },
];

const EmpleadoEditarVenta = () => {
  const navigate = useNavigate();
  const { idVenta } = useParams();
  const { user } = useAuthStore();
  const idEmpleado = user?.idEmpleado || user?.id;

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [buscando, setBuscando] = useState(false);

  useEffect(() => {
    const nuevoTotal = carrito.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  const buscarProductos = useCallback(async (term) => {
    if (term.length < 3) {
      setResultadosBusqueda([]);
      return;
    }
    setBuscando(true);
    try {
      const response = await apiClient.get("/productos/buscar", { params: { term } });
      setResultadosBusqueda(Array.isArray(response.data) ? response.data : []);
    } catch {
      setResultadosBusqueda([]);
    } finally {
      setBuscando(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => buscarProductos(terminoBusqueda), 300);
    return () => clearTimeout(timer);
  }, [terminoBusqueda, buscarProductos]);

  useEffect(() => {
    if (!idVenta) return;
    setLoading(true);

    const cargarDatosVenta = async () => {
      try {
        const [cabeceraRes, detalleRes] = await Promise.all([
          apiClient.get(`/ventasEmpleados/venta/${idVenta}`),
          apiClient.get(`/ventasEmpleados/detalle/${idVenta}`),
        ]);

        setMetodoPago(cabeceraRes.data.metodoPago);
        setCarrito(
          detalleRes.data.map((prod) => ({
            idProducto: prod.idProducto,
            nombreProducto: prod.nombreProducto,
            precioUnitario: prod.precioUnitario,
            cantidad: prod.cantidad,
            recetaFisica: prod.recetaFisica || null,
          })),
        );
      } catch {
      toast.error("No se pudieron cargar los datos de la venta.");
        navigate("/panelempleados/misventas");
      } finally {
        setLoading(false);
      }
    };

    cargarDatosVenta();
  }, [idVenta, navigate]);

  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod);
    setResultadosBusqueda([]);
    setTerminoBusqueda("");
    setCantidad(1);
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const cantInt = parseInt(cantidad);

    if (isNaN(cantInt) || cantInt <= 0) {
      toast.warning("Ingresa una cantidad mayor a cero.");
      return;
    }

    if (cantInt > productoSeleccionado.stock) {
      toast.warning(`Solo quedan ${productoSeleccionado.stock} unidades.`);
      return;
    }

    setCarrito([
      ...carrito,
      {
        idProducto: productoSeleccionado.idProducto,
        nombreProducto: productoSeleccionado.nombreProducto,
        precioUnitario: productoSeleccionado.precio,
        cantidad: cantInt,
      },
    ]);
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const eliminarDelCarrito = (index) => {
    setCarrito(carrito.filter((_, i) => i !== index));
  };

  const ajustarCantidad = (index, delta) => {
    setCarrito((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const nueva = Math.max(1, item.cantidad + delta);
        return { ...item, cantidad: nueva };
      }),
    );
  };

  const handleGuardarCambios = async () => {
    if (carrito.length === 0) {
      toast.info("No puedes dejar una venta sin productos.");
      return;
    }

    setGuardando(true);
    try {
      await apiClient.put(`/ventasEmpleados/actualizar/${idVenta}`, {
        totalPago: total,
        metodoPago: metodoPago,
        idEmpleado,
        productos: carrito.map((i) => ({
          idProducto: i.idProducto,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
        })),
      });

      toast.success(`La venta #${idVenta} se modificó con éxito.`);
      setTimeout(() => navigate("/panelempleados/misventas"), 1500);
    } catch {
      toast.error("No se pudo actualizar la venta.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="text-green-600 animate-spin" />
          <p className="text-sm text-gray-500">Cargando venta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/panelempleados/misventas")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
            aria-label="Volver"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
            <Receipt size={18} className="text-amber-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Editando Venta #{idVenta}</h1>
            <p className="text-xs text-gray-400">Modifica los productos y el método de pago</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6 min-h-0">
        {/* Left: Product Search */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 flex flex-col flex-1">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Search size={16} className="text-gray-400" />
              Buscar Producto
            </h2>

            {/* Search Input */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="search"
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                placeholder="Escribe nombre del producto..."
                className="w-full h-[42px] pl-11 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-500 transition-all hover:border-gray-300 hover:bg-white focus:border-green-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20"
              />
              {buscando && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Loader2 size={18} className="text-gray-400 animate-spin" />
                </div>
              )}

              {/* Results Dropdown */}
              {resultadosBusqueda.length > 0 && (
                <ul className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                  {resultadosBusqueda.map((prod) => (
                    <li
                      key={prod.idProducto}
                      onClick={() => seleccionarProducto(prod)}
                      className="px-4 py-3 hover:bg-green-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors flex justify-between items-center"
                    >
                      <span className="font-medium text-sm text-gray-800 truncate mr-2">
                        {prod.nombreProducto}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatMoneda(prod.precio)} · Stock: {prod.stock}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selected Product Panel */}
            {productoSeleccionado ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="rounded-2xl border border-green-200 bg-green-50/50 p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                      <Package size={22} className="text-green-600" />
                    </div>
                    <button
                      onClick={() => setProductoSeleccionado(null)}
                      className="text-green-400 hover:text-green-600 transition-colors cursor-pointer"
                      aria-label="Quitar selección"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-green-900 mb-3">
                    {productoSeleccionado.nombreProducto}
                  </h3>

                  <div className="flex gap-6 mb-5">
                    <div>
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Precio</p>
                      <p className="text-xl font-extrabold text-green-800">{formatMoneda(productoSeleccionado.precio)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">Stock</p>
                      <p className="text-xl font-extrabold text-green-800">{productoSeleccionado.stock}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <label className="text-sm font-semibold text-gray-700">Cantidad:</label>
                    <div className="flex items-center bg-white rounded-lg border border-green-200 p-0.5">
                      <button
                        onClick={() => setCantidad(Math.max(1, Number(cantidad) - 1))}
                        className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={productoSeleccionado.stock}
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        className="w-14 text-center text-sm font-bold text-gray-900 border-none focus:outline-none bg-transparent"
                      />
                      <button
                        onClick={() => setCantidad(Math.min(productoSeleccionado.stock, Number(cantidad) + 1))}
                        className="h-8 w-8 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={agregarAlCarrito}
                    className="w-full py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-colors active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Agregar al Ticket
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-3">
                  <Package size={24} className="text-gray-300" />
                </div>
                <p className="text-sm font-semibold text-gray-500">Selecciona un producto</p>
                <p className="text-xs text-gray-400 mt-1">Busca y agrega productos al ticket</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Ticket */}
        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <div className="rounded-2xl border border-gray-100 bg-white flex flex-col flex-1 overflow-hidden">
            {/* Ticket Header */}
            <div className="border-b border-gray-100 px-4 sm:px-5 py-4 shrink-0">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Receipt size={16} className="text-gray-400" />
                Ticket
                <span className="text-xs font-normal text-gray-400">({carrito.length} productos)</span>
              </h2>
            </div>

            {/* Ticket Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {carrito.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 mb-3">
                    <Package size={20} className="text-gray-300" />
                  </div>
                  <p className="text-sm font-semibold text-gray-500">El ticket está vacío</p>
                  <p className="text-xs text-gray-400 mt-1">Agrega productos desde el buscador</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {carrito.map((item, index) => (
                    <li
                      key={index}
                      className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-gray-900 truncate">{item.nombreProducto}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{formatMoneda(item.precioUnitario)} c/u</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-0.5">
                          <button
                            onClick={() => ajustarCantidad(index, -1)}
                            className="h-7 w-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-gray-900">{item.cantidad}</span>
                          <button
                            onClick={() => ajustarCantidad(index, 1)}
                            className="h-7 w-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-gray-900 min-w-[60px] text-right">
                          {formatMoneda(item.cantidad * item.precioUnitario)}
                        </span>

                        <button
                          onClick={() => eliminarDelCarrito(index)}
                          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-lg text-red-500 bg-red-50 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                          aria-label={`Eliminar ${item.nombreProducto}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Ticket Footer */}
            <div className="border-t border-gray-100 bg-white p-4 sm:p-5 shrink-0">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="w-48">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Método de pago
                  </label>
                  <select
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="w-full h-[42px] px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 transition-all hover:border-gray-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 cursor-pointer"
                  >
                    {OPCIONES_METODO_PAGO.map((op) => (
                      <option key={op.value} value={op.value}>{op.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col items-end rounded-xl bg-green-50 px-4 py-2 border border-green-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-700">Total</span>
                  <span className="text-2xl font-extrabold leading-none text-green-700">{formatMoneda(total)}</span>
                </div>
              </div>

              <button
                onClick={handleGuardarCambios}
                disabled={carrito.length === 0 || guardando}
                className={`w-full py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  carrito.length === 0 || guardando
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-amber-500 text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 active:scale-[0.98]"
                }`}
              >
                {guardando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoEditarVenta;
