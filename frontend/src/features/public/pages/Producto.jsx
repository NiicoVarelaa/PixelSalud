import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useProductDetailStore } from "@store/useProductDetailStore";
import { Frown, ArrowLeft } from "lucide-react";
import Header from "@features/public/components/navigation/Header";
import Footer from "@features/public/components/footer/Footer";
import { Breadcrumbs } from "@components/molecules/navigation";
import {
  SkeletonDetailProduct,
  ProductImageGallery,
  ProductInfo,
  ProductsRelated,
} from "@features/customer/components/products";

const Producto = () => {
  const { idProducto } = useParams();
  const navigate = useNavigate();

  const {
    producto,
    relatedProducts,
    precioOriginal,
    isLoading,
    error,
    fetchProductDetail,
  } = useProductDetailStore();

  useEffect(() => {
    if (idProducto) {
      fetchProductDetail(idProducto);
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [idProducto, fetchProductDetail]);

  // ── Loading ──
  if (isLoading) {
    return (
      <>
        <Header />
        <SkeletonDetailProduct />
        <Footer />
      </>
    );
  }

  // ── Error ──
  if (error || !producto) {
    return (
      <>
        <Header />
        <main
          className="min-h-[60vh] flex items-center justify-center px-4 py-16"
          aria-labelledby="error-heading"
        >
          <div className="text-center max-w-sm mx-auto">
            <Frown
              className="w-16 h-16 mx-auto text-gray-200 mb-5"
              aria-hidden="true"
            />
            <h1
              id="error-heading"
              className="text-xl font-bold text-gray-800 mb-2"
            >
              Producto no encontrado
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              {error || "No pudimos encontrar el producto que estás buscando."}
            </p>
            <button
              onClick={() => navigate("/productos")}
              className="
                inline-flex items-center justify-center gap-2
                px-6 py-3 rounded-xl
                bg-primary-700 text-white font-semibold text-sm
                hover:bg-primary-800 active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                transition-all duration-200 group cursor-pointer shadow-md
              "
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
                aria-hidden="true"
              />
              Volver a Productos
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Success ──
  return (
    <>
      <Header />

      <main className="w-full max-w-7xl mx-auto lg:px-8 my-6 sm:my-10 lg:my-12">
        {/* Breadcrumbs */}
        <Breadcrumbs categoria={producto.categoria} />

        {/* Product card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-10 sm:mb-14 mt-4"
        >
          {/*
            Mobile: single column (gallery → info stacked)
            Desktop: two equal columns side by side
          */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Divider only appears on desktop between columns */}
            <div className="lg:border-r lg:border-gray-100">
              <ProductImageGallery product={producto} />
            </div>
            <ProductInfo product={producto} precioOriginal={precioOriginal} />
          </div>
        </motion.div>

        {/* Related products */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15, ease: "easeOut" }}
        >
          <ProductsRelated
            relatedProducts={relatedProducts}
            category={producto?.categoria}
          />
        </motion.div>
      </main>

      <Footer />
    </>
  );
};

export default Producto;
