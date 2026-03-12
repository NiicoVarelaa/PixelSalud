import { Edit, ShoppingBag, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { ProductSearchVentasOnline } from "./ProductSearchVentasOnline";
import { VentaOnlineTicket } from "./VentaOnlineTicket";
import { useProductSearch } from "../../sales/hooks/useProductSearch";

export const VentasOnlineModal = ({
  isOpen,
  onClose,
  ventaForm,
  dispatch,
  isEditing,
  editingId,
  clienteEditando,
  onSubmit,
}) => {
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    resultadosBusqueda,
    productoSeleccionado,
    seleccionarProducto,
    limpiarSeleccion,
  } = useProductSearch();

  const handleAgregarAlCarrito = (producto) => {
    dispatch({
      type: "ADD_PRODUCT",
      product: producto,
    });
    limpiarSeleccion();
    toast.success("Producto agregado");
  };

  const handleSubmit = async () => {
    const success = await onSubmit();
    if (success) {
      onClose();
      limpiarSeleccion();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-hidden">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-fadeIn overflow-hidden">
        <div className="p-4 bg-primary-600 text-white flex justify-between items-center shadow-md shrink-0">
          <h2 className="text-xl font-bold flex items-center gap-2">
            {isEditing ? <Edit size={24} /> : <ShoppingBag size={24} />}
            {isEditing
              ? `Editar Venta Online #${editingId}`
              : "Registrar Nueva Venta Online"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-primary-700 p-2 rounded-full transition"
          >
            <XCircle size={28} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
          <ProductSearchVentasOnline
            terminoBusqueda={terminoBusqueda}
            setTerminoBusqueda={setTerminoBusqueda}
            resultadosBusqueda={resultadosBusqueda}
            productoSeleccionado={productoSeleccionado}
            onSeleccionarProducto={seleccionarProducto}
            onAgregarAlCarrito={handleAgregarAlCarrito}
          />

          <VentaOnlineTicket
            ventaForm={ventaForm}
            dispatch={dispatch}
            isEditing={isEditing}
            clienteEditando={clienteEditando}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};
