import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { PackageX } from "lucide-react";
import ProductCard from "./ProductCard";

const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const TopProductsSection = ({ productos, loading }) => {
  return (
    <section className="space-y-2" aria-labelledby="top-products-heading">
      <div className="flex items-center justify-between">
        <h2
          id="top-products-heading"
          className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight"
        >
          Productos Más Vendidos
        </h2>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-4">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-100 rounded-2xl h-56 sm:h-60 animate-pulse flex flex-col overflow-hidden"
                aria-hidden="true"
              >
                <div className="w-full aspect-square bg-gray-200" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-full mt-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : productos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
            <PackageX className="w-10 h-10 text-gray-300 mb-2" />
            <p className="text-gray-700 font-semibold text-base">
              Sin ventas registradas
            </p>
            <p className="text-gray-500 text-sm max-w-sm mt-1">
              Aún no hay datos de productos vendidos para el período
              seleccionado.
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariant}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3"
          >
            {productos.map((producto, index) => (
              <ProductCard
                key={producto.idProducto}
                producto={producto}
                index={index}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

TopProductsSection.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      idProducto: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      ingresoTotal: PropTypes.number.isRequired,
      cantidadVendida: PropTypes.number.isRequired,
      imagen: PropTypes.string,
      imagenes: PropTypes.arrayOf(PropTypes.object),
    }),
  ).isRequired,
  loading: PropTypes.bool,
};

TopProductsSection.defaultProps = {
  loading: false,
};

export default TopProductsSection;
