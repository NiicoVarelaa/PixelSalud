import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Iconos de Lucide React
import { ShoppingCart, Tag, Truck, Package, ArrowLeft, Frown, Star, Shield, RotateCcw, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

// Stores y nuestro Custom Hook
import { useCarritoStore } from '../store/useCarritoStore';
import { useProductDetailStore } from '../store/useProductDetailStore'; 

// Componentes de UI
import Header from '../components/Header';
import Footer from '../components/Footer';
import CardProductos from '../components/CardProductos';
import Breadcrumbs from '../components/Breadcrumbs';
import SkeletonDetailProduct from '../components/SkeletonDetailProduct';
import Default from '../assets/default.webp';

const Producto = () => {
  const { producto, relatedProducts, precioOriginal, isLoading, error } = useProductDetailStore();
  
  const { agregarCarrito } = useCarritoStore();
  const navigate = useNavigate();
  
  const [selectedImage, setSelectedImage] = useState(null); 
  const [quantity, setQuantity] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  
  useEffect(() => {
    if (producto) {
      setSelectedImage(producto.img);
    }
  }, [producto]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 768) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const formatCurrency = (number) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(number);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      agregarCarrito(producto);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/carrito");
  };

  const calculateDiscount = () => {
    if (!precioOriginal || precioOriginal <= producto.precio) return 0;
    return Math.round(((precioOriginal - producto.precio) / precioOriginal) * 100);
  };

  // Navegación del carrusel
  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev + itemsPerView >= relatedProducts.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.max(0, relatedProducts.length - itemsPerView) : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (isLoading) return <><Header /><SkeletonDetailProduct /><Footer /></>;

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <Frown className="h-24 w-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Producto no encontrado</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">{error}</p>
            <button
              onClick={() => navigate('/productos')}
              className="flex items-center justify-center gap-2 mx-auto bg-primary-600 text-white font-medium py-3 px-6 rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ArrowLeft size={18} />
              Volver a Productos
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const productImages = [
    producto.img,
    producto.img2 || Default,
    producto.img3 || Default,
    producto.img4 || Default,
    producto.img5 || Default,
  ].filter(img => img);

  const discountPercentage = calculateDiscount();

  return (
    <>
      <Header />
      <main className="my-8 lg:my-12">
        <div className="container mx-auto px-4">
          <Breadcrumbs categoria={producto.categoria} />
          
          {/* Contenedor principal con altura igualada */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
              
              {/* Columna de Imágenes */}
              <div className="bg-gray-50 p-6 lg:p-8 flex flex-col">
                <div className="flex flex-col-reverse sm:flex-row gap-4 flex-1">
                  <div className="flex sm:flex-col gap-3 sm:gap-4">
                    {productImages.map((img, index) => {
                      const isDefault = img === Default;
                      return (
                        <button
                          key={index}
                          onClick={() => !isDefault && setSelectedImage(img)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                            selectedImage === img 
                              ? 'border-primary-600 shadow-md scale-105' 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          } ${isDefault ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                          disabled={isDefault}
                        >
                          <img 
                            src={img} 
                            alt={`Miniatura ${index + 1}`} 
                            className="w-full h-full object-cover transition-transform duration-200 hover:scale-110" 
                          />
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="flex-1 flex items-center justify-center bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm">
                    {selectedImage && (
                      <img 
                        src={selectedImage} 
                        alt={producto.nombreProducto} 
                        className="max-h-full max-w-full object-contain transition-opacity duration-300"
                        onError={(e) => {
                          e.target.src = Default;
                        }}
                      />
                    )}
                  </div>
                </div>
                
                {/* Indicadores de confianza */}
                <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield size={16} className="text-green-600" />
                    <span>Compra protegida</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Truck size={16} className="text-blue-600" />
                    <span>Envío rápido</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <RotateCcw size={16} className="text-purple-600" />
                    <span>Devolución gratis</span>
                  </div>
                </div>
              </div>
              
              {/* Columna de Información y Acciones */}
              <div className="p-6 lg:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                        {producto.nombreProducto}
                      </h1>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={16} 
                              className="fill-yellow-400 text-yellow-400" 
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                        </div>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500 capitalize">{producto.categoria}</span>
                      </div>
                    </div>
                  </div>

                  {/* Precio y Descuento */}
                  <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-100 rounded-xl p-5 mb-6">
                    <div className="flex items-baseline gap-3 mb-2">
                      <p className="text-3xl font-extrabold text-primary-600">
                        {formatCurrency(producto.precio)}
                      </p>
                      {precioOriginal > producto.precio && (
                        <>
                          <p className="text-lg text-gray-500 line-through">
                            {formatCurrency(precioOriginal)}
                          </p>
                          <span className="bg-red-500 text-white text-sm font-bold px-2.5 py-1 rounded-full">
                            {discountPercentage}% OFF
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      en 12x {formatCurrency(producto.precio / 12)} sin interés
                    </p>
                  </div>

                  {/* Descripción */}
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-3">Descripción</h2>
                    <p className="text-gray-600 leading-relaxed">{producto.descripcion}</p>
                  </div>
                  
                  {/* Selector de cantidad */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3">Cantidad</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(producto.stock, quantity + 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={quantity >= producto.stock}
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500 ml-2">
                        {producto.stock} disponibles
                      </span>
                    </div>
                  </div>
                  
                  {/* Características */}
                  <ul className="space-y-3 border-t border-gray-200 pt-6 mb-6">
                    <li className="flex items-center gap-3">
                      <Tag size={20} className="text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        <strong className="font-semibold text-gray-800">{producto.stock} unidades</strong> en stock
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Truck size={20} className="text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700">
                        Envío gratis en compras superiores a <strong className="font-semibold">{formatCurrency(150000)}</strong>
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Package size={20} className="text-primary-600 flex-shrink-0" />
                      <span className="text-gray-700">Devoluciones gratuitas durante los primeros 15 días</span>
                    </li>
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="grid sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 font-semibold bg-white text-primary-700 rounded-xl hover:bg-primary-50 transition-all duration-200 border-2 border-primary-200 hover:border-primary-300 shadow-sm hover:shadow-md"
                  >
                    <ShoppingCart size={20} />
                    Añadir al Carrito
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="w-full flex items-center justify-center gap-3 py-4 px-6 font-semibold bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl hover:from-primary-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Comprar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Productos relacionados - MEJORADO */}
          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="h-6 w-6 text-primary-600" />
                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      También te puede interesar
                    </h2>
                  </div>
                  <p className="text-gray-600 text-lg">
                    Productos similares que podrían gustarte
                  </p>
                </div>
                
                {/* Controles del carrusel - solo mostrar si hay más productos de los que caben en la vista */}
                {relatedProducts.length > itemsPerView && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevSlide}
                      className="p-3 rounded-full border border-gray-300 hover:border-primary-600 hover:bg-primary-50 transition-all duration-200 group"
                      aria-label="Productos anteriores"
                    >
                      <ChevronLeft 
                        size={20} 
                        className="text-gray-600 group-hover:text-primary-600 transition-colors" 
                      />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="p-3 rounded-full border border-gray-300 hover:border-primary-600 hover:bg-primary-50 transition-all duration-200 group"
                      aria-label="Siguientes productos"
                    >
                      <ChevronRight 
                        size={20} 
                        className="text-gray-600 group-hover:text-primary-600 transition-colors" 
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Indicadores de paginación */}
              {relatedProducts.length > itemsPerView && (
                <div className="flex justify-center gap-2 mb-6">
                  {Array.from({ length: Math.ceil(relatedProducts.length / itemsPerView) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index * itemsPerView)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        currentSlide >= index * itemsPerView && currentSlide < (index + 1) * itemsPerView
                          ? 'bg-primary-600 w-8'
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                      aria-label={`Ir a página ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Contenedor del carrusel */}
              <div className="relative">
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-500 ease-out gap-6"
                    style={{ 
                      transform: `translateX(-${currentSlide * (100 / itemsPerView)}%)`,
                      width: `${Math.ceil(relatedProducts.length / itemsPerView) * 100}%`
                    }}
                  >
                    {relatedProducts.map((product, index) => (
                      <div 
                        key={product.idProducto} 
                        className="flex-none"
                        style={{ width: `${100 / itemsPerView}%` }}
                      >
                        <div className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                          <CardProductos 
                            product={product} 
                            className="h-full shadow-lg hover:shadow-xl border border-gray-100 rounded-2xl overflow-hidden"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Efecto de desvanecimiento en los bordes */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent"></div>
              </div>

              {/* Contador de productos */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Mostrando <span className="font-semibold text-gray-800">
                    {Math.min(currentSlide + 1, relatedProducts.length)}
                  </span> de <span className="font-semibold text-gray-800">
                    {relatedProducts.length}
                  </span> productos
                </p>
                
                <button
                  onClick={() => navigate('/productos')}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center gap-2 transition-colors group"
                >
                  Ver todos los productos
                  <ChevronRight 
                    size={16} 
                    className="group-hover:translate-x-1 transition-transform" 
                  />
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Producto;