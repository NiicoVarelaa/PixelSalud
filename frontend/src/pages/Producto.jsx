import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCarritoStore } from "../store/useCarritoStore";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { FaShoppingCart, FaTags, FaTruck, FaBoxOpen } from "react-icons/fa";
import CardProductos from "../components/CardProductos";
import Default from "../assets/default.webp";

const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col md:flex-row gap-8">
    <div className="w-full md:w-[65%] bg-gray-200 rounded-lg h-96"></div>
    <div className="w-full md:w-[35%]">
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-6"></div>
      <div className="h-12 bg-gray-200 rounded w-full"></div>
    </div>
  </div>
);

const Producto = () => {
  const { agregarCarrito } = useCarritoStore();
  const [producto, setProducto] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [precioOferta, setPrecioOferta] = useState(null);
  const [precioSinImpuestos, setPrecioSinImpuestos] = useState(null);
  const [visibleRelated, setVisibleRelated] = useState(4);
  const { id } = useParams();
  const navigate = useNavigate();

  const formatCurrency = (number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(number);

  const getProducto = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/productos/${id}`);
      const data = res.data;

      setProducto(data);
      setSelectedImage(data.img);

      const discountPercentage = 0.2;
      const precioOriginal = data.precio;
      const precioOfertaCalculado = precioOriginal / (1 - discountPercentage);
      const sinImpuestosCalculado = Math.max(
        0,
        precioOriginal - Math.floor(Math.random() * (precioOriginal * 0.15))
      );

      setPrecioOferta(precioOfertaCalculado);
      setPrecioSinImpuestos(sinImpuestosCalculado);

      const all = await axios.get(`http://localhost:5000/productos`);
      const sameCategory = all.data.filter(
        (p) =>
          p.idProducto !== data.idProducto &&
          p.categoria?.toLowerCase().trim() ===
            data.categoria?.toLowerCase().trim()
      );

      const shuffled = sameCategory.sort(() => 0.5 - Math.random());
      setRelatedProducts(shuffled.slice(0, 5));
    } catch (error) {
      console.error("Error al obtener producto o relacionados:", error);
    }
  };

  useEffect(() => {
    getProducto();
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setVisibleRelated(
  window.innerWidth < 768 ? 2 :
  window.innerWidth < 1536 ? 3 : 
  4
);

    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!producto || precioOferta === null || precioSinImpuestos === null)
    return <SkeletonLoader />;

  const productImages = [
    producto.img,
    producto.img2 || Default,
    producto.img3 || Default,
    producto.img4 || Default,
    producto.img5 || Default,
  ];

  return (
    <>
      <Header />
      <div>
        <div className="text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600 transition">
            Inicio
          </Link>{" "}
          /{" "}
          <Link
            to={`/productos?categoria=${encodeURIComponent(
              producto.categoria
            )}`}
            className=" hover:text-primary-600 transition capitalize"
          >
            {producto.categoria}
          </Link>{" "}
          / <span className="text-primary-700">{producto.nombreProducto}</span>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-stretch mb-16">
          <div className="w-full md:w-[65%] flex flex-col md:flex-row gap-4">
            <div className="flex flex-wrap md:flex-col gap-2 order-2 md:order-1">
              {productImages.slice(0, 5).map((img, index) => {
                const isDefault = img === Default;
                return (
                  <button
                    key={index}
                    onClick={() => !isDefault && setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex items-center justify-center transition-all ${
                      selectedImage === img
                        ? "border-primary-600 ring-2 ring-primary-600"
                        : "border-gray-200 hover:border-gray-400"
                    } ${isDefault ? "cursor-not-allowed opacity-50" : ""}`}
                    disabled={isDefault}
                  >
                    <img
                      src={img}
                      alt={`Miniatura ${index + 1}`}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex-1 h-[500px] rounded-xl overflow-hidden order-1 md:order-2 flex items-center justify-center bg-white shadow-lg p-8">
              <img
                src={selectedImage}
                alt={producto.nombreProducto}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>

          <div className="w-full md:w-[35%] flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4 truncate">
                {producto.nombreProducto}
              </h1>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <p className="text-gray-500 line-through">
                    {formatCurrency(precioOferta)}
                  </p>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                    20% OFF
                  </span>
                </div>
                <p className="text-3xl font-bold text-primary-600">
                  {formatCurrency(producto.precio)}
                </p>
                <p className="text-sm text-gray-500">
                  Precio sin impuestos: {formatCurrency(precioSinImpuestos)}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 text-gray-800">
                  Descripción
                </h2>
                <p className="text-gray-700 text-sm">{producto.descripcion}</p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 text-gray-800">
                  Detalles
                </h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <FaTags className="text-primary-700 mt-0.5 mr-2 flex-shrink-0" />
                    <span>
                      <strong className="text-gray-700">Categoría:</strong>{" "}
                      <span className="text-gray-700">
                        {producto.categoria}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaTruck className="text-primary-700 mt-0.5 mr-2 flex-shrink-0" />
                    <span>
                      <strong className="text-gray-700">Envío:</strong>{" "}
                      <span className="text-gray-700">
                        Gratis en compras mayores a {formatCurrency(100000)}
                      </span>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <FaBoxOpen className="text-primary-700 mt-0.5 mr-2 flex-shrink-0" />
                    <span>
                      <strong className="text-gray-700">Stock:</strong>{" "}
                      <span className="text-gray-700">
                        {producto.stock} unidades
                      </span>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={() => agregarCarrito(producto)}
                className="flex-1 py-3 px-4 font-medium bg-white text-primary-700 hover:bg-primary-100 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer border-2 border-primary-700 hover:border-primary-700 shadow-sm hover:shadow-md"
              >
                <FaShoppingCart />
                <span>Añadir</span>
              </button>
              <button
                onClick={() => {
                  agregarCarrito(producto);
                  navigate("/carrito");
                }}
                className="flex-1 py-3 px-4 font-medium bg-primary-700 text-white hover:bg-primary-800 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer border border-primary-600 hover:border-primary-700 shadow-sm hover:shadow-md"
              >
                Comprar
              </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Productos similares
            </h2>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-[65%]">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">

                  {relatedProducts.slice(0, visibleRelated).map((product) => (
                    <CardProductos key={product.idProducto} product={product} />
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-[35%]">
                <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl p-6 h-full flex flex-col justify-between text-white">
                  <div>
                    <h3 className="text-xl font-bold mb-3">Oferta Especial</h3>
                    <p className="mb-4">
                      ¡Lleva 2 y paga solo 1 en productos seleccionados!
                    </p>
                    <ul className="space-y-2 text-sm mb-6">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Válido hasta agotar stock</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Aplican términos y condiciones</span>
                      </li>
                    </ul>
                  </div>
                  <button className="w-full py-3 px-4 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    Ver promoción
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Producto;
