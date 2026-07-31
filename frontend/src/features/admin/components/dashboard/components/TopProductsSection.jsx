import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { PackageX, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const TopProductsSection = ({ productos, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsPerPage = 3;

  const totalProductos = productos?.length || 0;
  const canScroll = totalProductos > itemsPerPage;

  const nextSlide = () => {
    if (canScroll) {
      setCurrentIndex((prev) =>
        prev + itemsPerPage >= totalProductos ? 0 : prev + itemsPerPage,
      );
    }
  };

  const prevSlide = () => {
    if (canScroll) {
      setCurrentIndex((prev) =>
        prev - itemsPerPage < 0
          ? Math.max(0, totalProductos - itemsPerPage)
          : prev - itemsPerPage,
      );
    }
  };

  const visibleProducts = productos.slice(
    currentIndex,
    currentIndex + itemsPerPage,
  );

  return (
    <section
      className="bg-white rounded-xl border border-gray-100 p-3 h-full flex flex-col"
      aria-labelledby="top-products-heading"
    >
      <div className="flex items-center justify-between mb-2 px-1">
        <h2
          id="top-products-heading"
          className="text-sm sm:text-base font-extrabold text-gray-900"
        >
          Productos Más Vendidos
        </h2>

        <div className="flex items-center gap-1">
          <button
            onClick={prevSlide}
            disabled={!canScroll || loading}
            aria-label="Productos anteriores"
            className={`p-1 rounded-md transition-all duration-200 flex items-center justify-center ${
              !canScroll || loading
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={!canScroll || loading}
            aria-label="Siguientes productos"
            className={`p-1 rounded-md transition-all duration-200 flex items-center justify-center ${
              !canScroll || loading
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:bg-orange-50 hover:text-orange-600 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {loading ? (
          <div className="grid grid-cols-3 gap-2 h-full">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-100 rounded-xl h-full min-h-40 animate-pulse flex flex-col overflow-hidden"
              >
                <div className="w-full h-24 bg-gray-200" />
                <div className="p-2 flex flex-col gap-1 mt-auto">
                  <div className="h-2 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : totalProductos === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-40 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 p-2">
            <PackageX className="w-8 h-8 text-gray-300 mb-1" />
            <p className="text-gray-600 font-semibold text-xs">
              Sin ventas registradas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 h-full">
            <AnimatePresence mode="popLayout">
              {visibleProducts.map((producto, index) => (
                <motion.div
                  key={producto.idProducto}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="h-full"
                >
                  <ProductCard
                    producto={producto}
                    index={currentIndex + index}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

TopProductsSection.propTypes = {
  productos: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

TopProductsSection.defaultProps = {
  loading: false,
};

export default TopProductsSection;
