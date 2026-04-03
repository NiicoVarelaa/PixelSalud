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
}) => {
  const tieneOferta =
    Boolean(producto.enOferta) && Number(producto.porcentajeDescuento) > 0;
  const precioConDescuento = calcularPrecioConDescuento(producto);
  const enCampana = estaEnCampana(producto.idProducto);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="group transition-colors hover:bg-gray-50"
    >
      <td className="px-3 py-1.5">
        <div className="flex items-center gap-3">
          <ProductImage
            src={getProductoImageUrl(producto)}
            alt={producto.nombreProducto}
            tieneOferta={tieneOferta}
            className="h-9 w-9"
          />
          <div className="min-w-0">
            <p className="truncate max-w-[230px] text-sm font-semibold text-gray-900 transition-colors group-hover:text-primary-700 xl:max-w-[320px]">
              {producto.nombreProducto}
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              Stock: <span className="font-medium">{producto.stock}</span>
            </p>
          </div>
        </div>
      </td>
      <td className="px-3 py-1.5">
        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium whitespace-nowrap">
          {producto.categoria}
        </span>
      </td>
      <td className="px-3 py-1.5">
        <ProductPrice
          precioRegular={producto.precioRegular}
          precioConDescuento={precioConDescuento}
          tieneOferta={tieneOferta}
        />
      </td>
      <td className="px-3 py-1.5 text-center">
        <ProductStatus
          tieneOferta={tieneOferta}
          porcentajeDescuento={producto.porcentajeDescuento}
          enCampana={enCampana}
        />
      </td>
      <td className="px-3 py-1.5">
        <div className="flex items-center justify-center gap-1.5">
          <ProductActions
            producto={producto}
            enCampana={enCampana}
            tieneOferta={tieneOferta}
            onEstablecerDescuento={onEstablecerDescuento}
            onCambiarOferta={onCambiarOferta}
          />
        </div>
      </td>
    </motion.tr>
  );
};
