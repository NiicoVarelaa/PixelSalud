import React from "react";
import PropTypes from "prop-types";
import { ShoppingBag } from "lucide-react";
import Default from "@assets/default.webp";
import { motion } from "framer-motion";
import { formatCurrency, getProductoImageUrl } from "../utils/dashboardUtils";

const itemVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.3 } },
};

const ProductCard = ({ producto, index }) => {
  return (
    <motion.article
      variants={itemVariant}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md hover:border-green-400 transition-all duration-300 flex flex-col h-full w-full"
    >
      <div className="relative w-full h-24 sm:h-28 bg-white p-2 flex items-center justify-center shrink-0 border-b border-gray-50 overflow-hidden">
        <div className="absolute top-0 left-0 z-10 bg-linear-to-r from-green-600 to-green-500 text-white font-black text-[10px] px-2.5 py-1 rounded-br-xl shadow-sm">
          #{index + 1}
        </div>
        <img
          src={getProductoImageUrl(producto)}
          alt={producto.nombre}
          className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => (e.target.src = Default)}
        />
      </div>

      <div className="p-2.5 flex flex-col flex-1 gap-2 bg-white">
        <div className="flex flex-col gap-1.5">
          <h3 
            className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-2 leading-snug wrap-break-word min-h-8" 
            title={producto.nombre}
          >
            {producto.nombre}
          </h3>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-bold rounded-md border border-orange-100 self-start">
            <ShoppingBag className="w-3 h-3 shrink-0" />
            <span className="truncate">{producto.cantidadVendida} unid.</span>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-50 flex items-end justify-between">
          <div className="w-full">
            <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Ingreso</p>
            <p className="text-sm sm:text-base font-black text-green-600 leading-none truncate w-full">
              {formatCurrency(producto.ingresoTotal)}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

ProductCard.propTypes = {
  producto: PropTypes.shape({
    idProducto: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    cantidadVendida: PropTypes.number.isRequired,
    ingresoTotal: PropTypes.number.isRequired,
    imagen: PropTypes.string,
    imagenes: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default ProductCard;