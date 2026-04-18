import { motion } from "framer-motion";
import { ProductImageMobile } from "./ProductImage";
import { ProductPrice } from "./ProductPrice";
import { ProductStatus } from "./ProductStatus";
import { ProductActions } from "./ProductActions";
import { getProductoImageUrl, calcularPrecioConDescuento } from "./utils";

export const ProductCard = ({
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
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className={`overflow-hidden rounded-2xl border bg-white transition-all ${
        tieneOferta ? "border-orange-200 shadow-sm" : "border-gray-200"
      }`}
      aria-label={`${producto.nombreProducto}, ${producto.categoria}`}
    >
      <div className="flex items-start gap-3 p-3.5">
        <ProductImageMobile
          src={getProductoImageUrl(producto)}
          alt={producto.nombreProducto}
          tieneOferta={tieneOferta}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">
            {producto.nombreProducto}
          </h3>
          <span className="inline-block rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            {producto.categoria}
          </span>
          <p className="mt-1 text-xs text-gray-500">
            Stock:{" "}
            <span className="font-medium text-gray-700">{producto.stock}</span>
          </p>
        </div>
        <div className="mt-0.5 shrink-0">
          <ProductStatus
            tieneOferta={tieneOferta}
            porcentajeDescuento={producto.porcentajeDescuento}
            enCampana={enCampana}
            isMobile
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-3.5 py-3">
        <ProductPrice
          precioRegular={producto.precioRegular}
          precioConDescuento={precioConDescuento}
          tieneOferta={tieneOferta}
          isMobile
        />
        <div className="flex gap-2 shrink-0">
          <ProductActions
            producto={producto}
            enCampana={enCampana}
            tieneOferta={tieneOferta}
            onEstablecerDescuento={onEstablecerDescuento}
            onCambiarOferta={onCambiarOferta}
            isMobile
          />
        </div>
      </div>
    </motion.article>
  );
};
