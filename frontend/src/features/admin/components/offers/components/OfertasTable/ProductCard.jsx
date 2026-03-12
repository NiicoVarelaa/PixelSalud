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
  const tieneOferta = producto.enOferta && producto.porcentajeDescuento > 0;
  const precioConDescuento = calcularPrecioConDescuento(producto);
  const enCampana = estaEnCampana(producto.idProducto);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 hover:border-primary-300 hover:shadow-md transition-all overflow-hidden"
      aria-label={`${producto.nombreProducto} - ${producto.categoria}`}
    >
      {/* Header: Imagen y título */}
      <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-white">
        <ProductImageMobile
          src={getProductoImageUrl(producto)}
          alt={producto.nombreProducto}
          tieneOferta={tieneOferta}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 leading-tight mb-1.5 line-clamp-2 text-base">
            {producto.nombreProducto}
          </h3>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
              {producto.categoria}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Stock: <span className="font-semibold">{producto.stock}</span>{" "}
            unidades
          </p>
        </div>
      </div>

      {/* Cuerpo: Precios y estado */}
      <div className="p-4 space-y-4 bg-white">
        {/* Precios */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-gray-100">
          <ProductPrice
            precioRegular={producto.precioRegular}
            precioConDescuento={precioConDescuento}
            tieneOferta={tieneOferta}
            isMobile
          />
          <ProductStatus
            tieneOferta={tieneOferta}
            porcentajeDescuento={producto.porcentajeDescuento}
            enCampana={enCampana}
            isMobile
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-2.5">
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
