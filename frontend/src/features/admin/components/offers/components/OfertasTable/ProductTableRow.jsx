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
  const tieneOferta = producto.enOferta && producto.porcentajeDescuento > 0;
  const precioConDescuento = calcularPrecioConDescuento(producto);
  const enCampana = estaEnCampana(producto.idProducto);

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="hover:bg-gray-50 transition-colors group"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <ProductImage
            src={getProductoImageUrl(producto)}
            alt={producto.nombreProducto}
            tieneOferta={tieneOferta}
            className="w-14 h-14"
          />
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
              {producto.nombreProducto}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Stock: <span className="font-medium">{producto.stock}</span>
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
          {producto.categoria}
        </span>
      </td>
      <td className="px-6 py-4">
        <ProductPrice
          precioRegular={producto.precioRegular}
          precioConDescuento={precioConDescuento}
          tieneOferta={tieneOferta}
        />
      </td>
      <td className="px-6 py-4 text-center">
        <ProductStatus
          tieneOferta={tieneOferta}
          porcentajeDescuento={producto.porcentajeDescuento}
          enCampana={enCampana}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-center gap-2">
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
