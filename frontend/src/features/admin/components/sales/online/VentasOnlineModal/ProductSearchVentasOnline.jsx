import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { EmptyOnlineProductSearchState } from "./productSearchOnline/EmptyOnlineProductSearchState";
import { OnlineCategoryProductsPanel } from "./productSearchOnline/OnlineCategoryProductsPanel";
import { ProductSearchOnlineHeader } from "./productSearchOnline/ProductSearchOnlineHeader";
import { SelectedOnlineProductPanel } from "./productSearchOnline/SelectedOnlineProductPanel";
import {
  buildOpcionesCategoria,
  filtrarCategoriasPermitidas,
  getProductImage,
  requiereReceta,
} from "./productSearchOnline/productSearchOnline.utils";

export const ProductSearchVentasOnline = ({
  terminoBusqueda,
  setTerminoBusqueda,
  filtroCategoria,
  setFiltroCategoria,
  categorias = [],
  resultadosBusqueda,
  productosCategoria = [],
  productoSeleccionado,
  productosTicket = [],
  productosEnTicketIds = new Set(),
  onSeleccionarProducto,
  onAgregarAlCarrito,
  onToggleProductoTicket,
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [recetaPresentada, setRecetaPresentada] = useState(false);

  const categoriasPermitidas = useMemo(() => {
    return filtrarCategoriasPermitidas(categorias);
  }, [categorias]);

  const opcionesCategoria = useMemo(() => {
    return buildOpcionesCategoria(categoriasPermitidas);
  }, [categoriasPermitidas]);

  const handleCantidadChange = (value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return setCantidad(1);
    if (!productoSeleccionado) return setCantidad(Math.max(1, parsed));
    const cantidadEnTicket = productosTicket
      .filter((item) => item.idProducto === productoSeleccionado.idProducto)
      .reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
    const max = Math.max(
      1,
      Number(productoSeleccionado.stock || 1) - cantidadEnTicket,
    );
    setCantidad(Math.min(Math.max(1, parsed), max));
  };

  const handleAgregar = () => {
    if (!productoSeleccionado) return;

    const cantInt = Number.parseInt(cantidad, 10);
    if (Number.isNaN(cantInt) || cantInt <= 0) {
      return toast.warning("Ingresa una cantidad mayor a cero.");
    }

    const cantidadEnTicket = productosTicket
      .filter((item) => item.idProducto === productoSeleccionado.idProducto)
      .reduce((acc, item) => acc + Number(item.cantidad || 0), 0);
    const stockTotal = Number(productoSeleccionado.stock || 0);
    const disponible = Math.max(0, stockTotal - cantidadEnTicket);

    if (disponible <= 0) {
      return toast.warning("Stock agotado para este producto en el ticket.");
    }
    if (cantInt > disponible) {
      return toast.warning(
        `Stock insuficiente. Solo quedan ${disponible} unidades disponibles.`,
      );
    }
    if (requiereReceta(productoSeleccionado) && !recetaPresentada) {
      return toast.warning(
        "⚠️ Requiere Receta. Verifica el documento físico marcando la casilla.",
      );
    }

    onAgregarAlCarrito({
      idProducto: productoSeleccionado.idProducto,
      nombreProducto: productoSeleccionado.nombreProducto,
      precioUnitario: productoSeleccionado.precio,
      cantidad: cantInt,
      imagenProducto: getProductImage(productoSeleccionado),
      stockDisponible: Number(productoSeleccionado.stock || 0),
      requiereReceta: productoSeleccionado.requiereReceta,
      recetaFisica: recetaPresentada ? "Presentada" : null,
    });

    setCantidad(1);
    setRecetaPresentada(false);
  };

  const handleSelectFromSearch = (producto) => {
    onSeleccionarProducto(producto);
    setCantidad(1);
    setRecetaPresentada(false);
  };

  return (
    <div className="w-full lg:w-[45%] min-h-0 flex flex-col bg-white border-b lg:border-b-0 lg:border-r border-gray-200 z-40 lg:z-10 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)]">
      <ProductSearchOnlineHeader
        terminoBusqueda={terminoBusqueda}
        setTerminoBusqueda={setTerminoBusqueda}
        resultadosBusqueda={resultadosBusqueda}
        onSelectFromSearch={handleSelectFromSearch}
        filtroCategoria={filtroCategoria}
        setFiltroCategoria={setFiltroCategoria}
        opcionesCategoria={opcionesCategoria}
        getProductImage={getProductImage}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gray-50/50 flex flex-col justify-center">
        {productoSeleccionado ? (
          <SelectedOnlineProductPanel
            producto={productoSeleccionado}
            cantidad={cantidad}
            recetaPresentada={recetaPresentada}
            onCantidadChange={handleCantidadChange}
            setRecetaPresentada={setRecetaPresentada}
            onAgregar={handleAgregar}
            getProductImage={getProductImage}
          />
        ) : filtroCategoria !== "todas" ? (
          <OnlineCategoryProductsPanel
            filtroCategoria={filtroCategoria}
            productosCategoria={productosCategoria}
            productosEnTicketIds={productosEnTicketIds}
            onToggleProductoTicket={onToggleProductoTicket}
            getProductImage={getProductImage}
          />
        ) : (
          <EmptyOnlineProductSearchState />
        )}
      </div>
    </div>
  );
};
