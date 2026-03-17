import { useState } from "react";
import { Search, ShoppingBag } from "lucide-react";
import Swal from "sweetalert2";

export const ProductSearchVentasOnline = ({
  terminoBusqueda,
  setTerminoBusqueda,
  resultadosBusqueda,
  productoSeleccionado,
  onSeleccionarProducto,
  onAgregarAlCarrito,
}) => {
  const [cantidad, setCantidad] = useState(1);
  const [recetaPresentada, setRecetaPresentada] = useState(false);

  const handleAgregar = () => {
    if (!productoSeleccionado) return;

    const cantInt = parseInt(cantidad);
    if (isNaN(cantInt) || cantInt <= 0) {
      Swal.fire(
        "Cantidad inválida",
        "Ingresa una cantidad mayor a cero.",
        "warning",
      );
      return;
    }

    if (cantInt > productoSeleccionado.stock) {
      Swal.fire(
        "Stock insuficiente",
        `Solo quedan ${productoSeleccionado.stock} unidades.`,
        "warning",
      );
      return;
    }

    if (
      (productoSeleccionado.requiereReceta === 1 ||
        productoSeleccionado.requiereReceta === true) &&
      !recetaPresentada
    ) {
      Swal.fire(
        "⚠️ Requiere Receta",
        "Verifica el documento físico o digital.",
        "warning",
      );
      return;
    }

    onAgregarAlCarrito({
      idProducto: productoSeleccionado.idProducto,
      nombreProducto: productoSeleccionado.nombreProducto,
      precioUnitario: productoSeleccionado.precio,
      cantidad: cantInt,
      requiereReceta: productoSeleccionado.requiereReceta,
      recetaFisica: recetaPresentada ? "Presentada" : null,
    });

    setCantidad(1);
    setRecetaPresentada(false);
  };

  return (
    <div className="w-full lg:w-1/2 p-6 bg-gray-50 flex flex-col border-r border-gray-200 overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
        <Search size={20} /> Buscar Producto
      </h3>

      <div className="relative mb-6">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
          placeholder="Escribe nombre del producto..."
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
        {resultadosBusqueda.length > 0 && (
          <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto">
            {resultadosBusqueda.map((prod) => (
              <li
                key={prod.idProducto}
                onClick={() => {
                  onSeleccionarProducto(prod);
                  setCantidad(1);
                  setRecetaPresentada(false);
                }}
                className="p-3 hover:bg-primary-50 cursor-pointer border-b flex justify-between items-center"
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

      <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white min-h-[300px]">
        {productoSeleccionado ? (
          <div className="w-full text-center animate-fadeIn">
            <h3 className="text-xl font-bold text-primary-800 mb-2">
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
            {(productoSeleccionado.requiereReceta === 1 ||
              productoSeleccionado.requiereReceta === true) && (
              <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center gap-3">
                <input
                  type="checkbox"
                  id="checkRecetaModalOnline"
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer"
                  checked={recetaPresentada}
                  onChange={(e) => setRecetaPresentada(e.target.checked)}
                />
                <label
                  htmlFor="checkRecetaModalOnline"
                  className="text-orange-800 font-bold cursor-pointer select-none"
                >
                  📄 Receta Física/Digital Verificada
                </label>
              </div>
            )}
            <div className="flex items-center justify-center gap-4 mb-6">
              <label className="font-medium text-gray-700">Cantidad:</label>
              <input
                type="number"
                min="1"
                max={productoSeleccionado.stock}
                className="w-24 p-2 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <button
              onClick={handleAgregar}
              className="w-full py-3 bg-primary-600 text-white text-lg font-bold rounded-lg hover:bg-primary-700 transition shadow-lg transform active:scale-95"
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
  );
};
