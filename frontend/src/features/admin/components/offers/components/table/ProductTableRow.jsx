import { motion } from "framer-motion";
import { ProductImage } from "./ProductImage";
import { ProductPrice } from "./ProductPrice";
import { ProductStatus } from "./ProductStatus";
import { ProductActions } from "./ProductActions";
import { getProductoImageUrl, calcularPrecioConDescuento } from "./utils";

export const ProductTableRow = ({
  producto,
  index,
  estaEnCampana,
  onEstablecerDescuento,
  onCambiarOferta,
  onVerDetalle,
}) => {
  const tieneOferta =
    Boolean(producto.enOferta) && Number(producto.porcentajeDescuento) > 0;
  const precioConDescuento = calcularPrecioConDescuento(producto);
  const enCampana = estaEnCampana(producto.idProducto);

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: index * 0.025 }}
      className="transition-colors odd:bg-white even:bg-gray-50/40 hover:bg-green-50/35"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <ProductImage
            src={getProductoImageUrl(producto)}
            alt={producto.nombreProducto}
            tieneOferta={tieneOferta}
            className="h-9 w-9 shrink-0"
          />
          <div className="min-w-0">
            <p className="truncate max-w-[200px] text-sm font-medium text-gray-900 xl:max-w-[300px]">
              {producto.nombreProducto}
            </p>
            <p className="text-xs text-gray-400">Stock: {producto.stock}</p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-600 font-medium whitespace-nowrap">
          {producto.categoria}
        </span>
      </td>

      <td className="px-4 py-3">
        <ProductPrice
          precioRegular={producto.precioRegular}
          precioConDescuento={precioConDescuento}
          tieneOferta={tieneOferta}
        />
      </td>

      <td className="px-4 py-3 text-center">
        <ProductStatus
          tieneOferta={tieneOferta}
          porcentajeDescuento={producto.porcentajeDescuento}
          enCampana={enCampana}
        />
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1.5">
          <ProductActions
            producto={producto}
            enCampana={enCampana}
            tieneOferta={tieneOferta}
            onEstablecerDescuento={onEstablecerDescuento}
            onCambiarOferta={onCambiarOferta}
            onVerDetalle={onVerDetalle}
          />
        </div>
      </td>
    </motion.tr>
  );
};
