import { Edit, ShoppingBag, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ProductSearch } from "./ProductSearch";
import { VentaTicket } from "./VentaTicket";
import { useProductSearch } from "../hooks/useProductSearch";

export const VentasModal = ({
  isOpen,
  onClose,
  ventaForm,
  dispatch,
  isEditing,
  editingId,
  nombreVendedorOriginal,
  user,
  onSubmit,
}) => {
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    resultadosBusqueda,
    productoSeleccionado,
    seleccionarProducto,
    limpiarSeleccion,
    filtroCategoria,
    setFiltroCategoria,
    categoriasDisponibles = [],
    productosCategoria = [],
  } = useProductSearch();

  const [isMobileTicketCollapsed, setIsMobileTicketCollapsed] = useState(false);

  const productosEnTicketIds = useMemo(() => {
    return new Set(ventaForm.productos.map((producto) => producto.idProducto));
  }, [ventaForm.productos]);

  const handleAgregarAlCarrito = (producto) => {
    dispatch({ type: "ADD_PRODUCT", product: producto });
    setIsMobileTicketCollapsed(false);
    limpiarSeleccion();
    toast.success("Producto agregado al ticket");
  };

  const handleToggleProductoTicket = (producto, checked) => {
    if (checked) {
      handleAgregarAlCarrito({
        idProducto: producto.idProducto,
        nombreProducto: producto.nombreProducto,
        precioUnitario: Number(producto.precioFinal || producto.precio || 0),
        cantidad: 1,
        imagenProducto:
          producto.img ||
          producto.urlImagen ||
          producto.imagen ||
          producto.imagenPrincipal ||
          null,
        stockDisponible: Number(producto.stock || 0),
        requiereReceta: producto.requiereReceta,
        recetaFisica: null,
      });
      return;
    }

    const indexProducto = ventaForm.productos.findIndex(
      (item) => item.idProducto === producto.idProducto,
    );

    if (indexProducto >= 0) {
      dispatch({ type: "REMOVE_PRODUCT", index: indexProducto });
      toast.info("Producto removido del ticket");
    }
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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-gray-900/60 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-gray-50 w-full h-[92dvh] max-h-[92dvh] rounded-t-3xl sm:rounded-2xl sm:h-[90vh] sm:max-w-7xl flex flex-col shadow-2xl overflow-hidden animate-slideUp sm:animate-fadeIn">
        <div className="sm:hidden flex justify-center pt-2.5 pb-1 bg-gray-50/95">
          <span
            className="h-1.5 w-14 rounded-full bg-gray-300"
            aria-hidden="true"
          />
        </div>

        <header className="px-4 sm:px-6 py-4 bg-green-700 text-white flex justify-between items-center shadow-md shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div
              className="p-2 bg-white rounded-lg shrink-0 text-primary-700"
              aria-hidden="true"
            >
              {isEditing ? <Edit size={20} /> : <ShoppingBag size={20} />}
            </div>
            <h2
              id="modal-title"
              className="text-lg sm:text-xl font-bold tracking-tight"
            >
              {isEditing
                ? `Editar Venta #${editingId}`
                : "Registrar Nueva Venta"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-200 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-white p-2 rounded-xl transition-colors outline-none cursor-pointer"
            aria-label="Cerrar modal de ventas"
          >
            <X size={24} />
          </button>
        </header>

        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-y-auto lg:overflow-hidden overscroll-contain">
          <ProductSearch
            terminoBusqueda={terminoBusqueda}
            setTerminoBusqueda={setTerminoBusqueda}
            filtroCategoria={filtroCategoria}
            setFiltroCategoria={setFiltroCategoria}
            categorias={categoriasDisponibles}
            resultadosBusqueda={resultadosBusqueda}
            productosCategoria={productosCategoria}
            productoSeleccionado={productoSeleccionado}
            productosTicket={ventaForm.productos}
            productosEnTicketIds={productosEnTicketIds}
            onSeleccionarProducto={seleccionarProducto}
            onAgregarAlCarrito={handleAgregarAlCarrito}
            onToggleProductoTicket={handleToggleProductoTicket}
          />

          <VentaTicket
            ventaForm={ventaForm}
            dispatch={dispatch}
            isEditing={isEditing}
            nombreVendedorOriginal={nombreVendedorOriginal}
            user={user}
            onSubmit={handleSubmit}
            mobileCollapsed={isMobileTicketCollapsed}
            onToggleMobileCollapsed={() =>
              setIsMobileTicketCollapsed((prev) => !prev)
            }
          />
        </div>
      </div>
    </div>
  );
};