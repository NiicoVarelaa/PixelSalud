import React from "react";
import PropTypes from "prop-types";
import { ShoppingBag } from "lucide-react";
import Default from "@assets/default.webp";
import { motion } from "framer-motion";
import { formatCurrency, getProductoImageUrl } from "../utils/dashboardUtils";

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.4 } },
};

const ProductCard = ({ producto, index }) => {
  return (
    <motion.article
      variants={itemVariant}
      className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-green-600 transition-all duration-300 flex flex-col h-full"
      aria-label={`Top ${index + 1}: ${producto.nombre}`}
    >
      <div className="relative w-full aspect-square bg-white p-4 flex items-center justify-center shrink-0 border-b border-gray-100">
        <div className="absolute top-0 left-0 z-10 bg-green-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-br-xl shadow-md">
          #{index + 1}
        </div>

        <img
          src={getProductoImageUrl(producto)}
          alt={producto.nombre}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => (e.target.src = Default)}
        />
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between gap-2 bg-white">
        <div>
          <h3
            className="font-bold text-gray-800 text-xs sm:text-sm line-clamp-2 leading-snug mb-1.5"
            title={producto.nombre}
          >
            {producto.nombre}
          </h3>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md border border-orange-200">
            <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{producto.cantidadVendida} unid.</span>
          </div>
        </div>

        <div className="mt-auto pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-0.5">Generó</p>
          <p className="text-lg sm:text-xl font-black text-green-600">
            {formatCurrency(producto.ingresoTotal)}
          </p>
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
