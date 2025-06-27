import Categorias from "../components/Categorias";
import Footer from "../components/Footer";
import MainBanner from "../components/MainBanner";
import { useEffect, useState } from "react";
import axios from "axios";
import CardProductos from "../components/CardProductos";
import BannerPromo from "../components/BannerPromo";

const Inicio = () => {
  const [productosArriba, setProductosArriba] = useState([]);
  const [productosAbajo, setProductosAbajo] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/productos");
        const todos = res.data;

        const shuffled = todos.sort(() => 0.5 - Math.random());
        const arriba = shuffled.slice(0, 7);
        const usadosIds = new Set(arriba.map((p) => p.idProducto));
        const abajo = shuffled
          .filter((p) => !usadosIds.has(p.idProducto))
          .slice(0, 7);

        setProductosArriba(arriba);
        setProductosAbajo(abajo);
      } catch (error) {
        console.error("Error al traer productos:", error);
      }
    };

    getProducts();
  }, []);

  return (
    <div>
      <MainBanner />
      <Categorias />
      <section className="mt-12">
        <p className="text-2xl md:text-3xl font-medium">Recomendados</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mt-6">
          {productosArriba.map((p) => (
            <CardProductos key={p.idProducto} product={p} />
          ))}
        </div>
      </section>

      <BannerPromo />

      <section className="mt-12">
        <p className="text-2xl md:text-3xl font-medium">
          También podría interesarte
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6 mt-6">
          {productosAbajo.map((p) => (
            <CardProductos key={p.idProducto} product={p} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Inicio;
