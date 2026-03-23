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
      className="hover:bg-gray-50 transition-colors group"
    >
      <td className="px-4 py-2.5">
        <div className="flex items-center gap-3">
          <ProductImage
            src={getProductoImageUrl(producto)}
            alt={producto.nombreProducto}
            tieneOferta={tieneOferta}
            className="w-10 h-10"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 group-hover:text-primary-700 transition-colors truncate max-w-[230px] xl:max-w-[320px]">
              {producto.nombreProducto}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Stock: <span className="font-medium">{producto.stock}</span>
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-2.5">
        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium whitespace-nowrap">
          {producto.categoria}
        </span>
      </td>
      <td className="px-4 py-2.5">
        <ProductPrice
          precioRegular={producto.precioRegular}
          precioConDescuento={precioConDescuento}
          tieneOferta={tieneOferta}
        />
      </td>
      <td className="px-4 py-2.5 text-center">
        <ProductStatus
          tieneOferta={tieneOferta}
          porcentajeDescuento={producto.porcentajeDescuento}
          enCampana={enCampana}
        />
      </td>
      <td className="px-4 py-2.5">
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
