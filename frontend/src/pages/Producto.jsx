import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useProductDetailStore } from "../store/useProductDetailStore";

import { Frown, ArrowLeft } from "lucide-react";

import Header from "../components/Header";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import SkeletonDetailProduct from "../components/SkeletonDetailProduct";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductInfo from "../components/ProductInfo";
import ProductsRelated from "../components/ProductsRelated";

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
    window.scrollTo(0, 0);
  }, [idProducto, fetchProductDetail]);

  if (isLoading) {
    return (
      <>
        <Header />
        <SkeletonDetailProduct />
        <Footer />
      </>
    );
  }

  if (error || !producto) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <Frown className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Producto no encontrado
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={() => navigate("/productos")}
              className="flex items-center justify-center gap-2 mx-auto bg-primary-700 text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-800 cursor-pointer transition-all duration-300 group"
            >
              <ArrowLeft
                size={18}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />
              Volver a Productos
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="my-8 lg:my-12">
        <div>
          <Breadcrumbs categoria={producto.categoria} />
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              <ProductImageGallery product={producto} />
              <ProductInfo product={producto} precioOriginal={precioOriginal} />
            </div>
          </div>
          <ProductsRelated relatedProducts={relatedProducts} category={producto?.categoria} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Producto;
