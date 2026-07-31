import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import ProductSearchPanel from "./panels/ProductSearchPanel";
import TicketPanel from "./panels/TicketPanel";
import { ConfirmVaciarDialog } from "./dialogs";

const EmpleadoRealizarVenta = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const idEmpleado = user?.idEmpleado || user?.id;

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [recetaPresentada, setRecetaPresentada] = useState(false);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [total, setTotal] = useState(0);
  const [buscando, setBuscando] = useState(false);
  const [confirmVaciar, setConfirmVaciar] = useState(false);

  useEffect(() => {
    setTotal(carrito.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0));
  }, [carrito]);

  useEffect(() => {
    if (terminoBusqueda.length < 3) { setResultadosBusqueda([]); return; }
    const timer = setTimeout(() => buscarProductos(terminoBusqueda), 300);
    return () => clearTimeout(timer);
  }, [terminoBusqueda]);

  const buscarProductos = async (term) => {
    setBuscando(true);
    try {
      const response = await apiClient.get("/productos/buscar", { params: { term } });
      setResultadosBusqueda(Array.isArray(response.data) ? response.data : []);
    } catch { setResultadosBusqueda([]); }
    finally { setBuscando(false); }
  };

  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod); setResultadosBusqueda([]); setTerminoBusqueda(""); setCantidad(1); setRecetaPresentada(false);
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const cantInt = parseInt(cantidad);
    if (isNaN(cantInt) || cantInt <= 0) { toast.warning("Ingresa una cantidad mayor a cero."); return; }
    if (cantInt > productoSeleccionado.stock) { toast.warning(`Solo quedan ${productoSeleccionado.stock} unidades.`); return; }
    if (productoSeleccionado.requiereReceta && !recetaPresentada) { toast.warning("Este producto requiere receta. Verifica el documento y marca la casilla."); return; }

    setCarrito([...carrito, {
      idProducto: productoSeleccionado.idProducto, nombreProducto: productoSeleccionado.nombreProducto,
      precioUnitario: productoSeleccionado.precio, cantidad: cantInt,
      requiereReceta: productoSeleccionado.requiereReceta, recetaFisica: recetaPresentada ? "Presentada en mostrador" : null,
    }]);
    setProductoSeleccionado(null); setCantidad(1); setRecetaPresentada(false);
  };

  const finalizarVenta = async () => {
    if (carrito.length === 0) { toast.info("Agrega productos antes de finalizar."); return; }
    if (!idEmpleado) { toast.error("No se pudo identificar al empleado. Inicia sesión de nuevo."); return; }

    try {
      const response = await apiClient.post("/ventasEmpleados/crear", {
        idEmpleado, totalPago: total, metodoPago,
        productos: carrito.map((i) => ({ idProducto: i.idProducto, cantidad: i.cantidad, precioUnitario: i.precioUnitario, recetaFisica: i.recetaFisica })),
      });
      setCarrito([]); setTotal(0); setTerminoBusqueda(""); setProductoSeleccionado(null);
      toast.success(`La venta #${response.data.idVentaE} se completó con éxito.`);
      setTimeout(() => navigate("/panelempleados/misventas"), 2000);
    } catch { toast.error("Error al registrar la venta."); }
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50"><ShoppingCart size={18} className="text-green-600" /></div>
          <div><h1 className="text-xl font-bold text-gray-900">Nueva venta</h1><p className="text-xs text-gray-400">Registrar venta en mostrador</p></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-5 min-h-0">
        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <ProductSearchPanel terminoBusqueda={terminoBusqueda} setTerminoBusqueda={setTerminoBusqueda}
            resultadosBusqueda={resultadosBusqueda} buscando={buscando}
            productoSeleccionado={productoSeleccionado} cancelarSeleccion={() => setProductoSeleccionado(null)}
            cantidad={cantidad} setCantidad={setCantidad} recetaPresentada={recetaPresentada} setRecetaPresentada={setRecetaPresentada}
            seleccionarProducto={seleccionarProducto} agregarAlCarrito={agregarAlCarrito} />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col min-h-0">
          <TicketPanel carrito={carrito} metodoPago={metodoPago} setMetodoPago={setMetodoPago}
            total={total} finalizarVenta={finalizarVenta} onVaciar={() => setConfirmVaciar(true)}
            onVaciarItem={(index) => setCarrito(carrito.filter((_, i) => i !== index))} />
        </div>
      </div>

      <ConfirmVaciarDialog isOpen={confirmVaciar} onClose={() => setConfirmVaciar(false)} onConfirm={() => { setCarrito([]); setConfirmVaciar(false); }} />
    </div>
  );
};

export default EmpleadoRealizarVenta;
