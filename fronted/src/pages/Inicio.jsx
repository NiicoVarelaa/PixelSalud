import Categorias from "../components/Categorias";
import Footer from "../components/Footer";
import MainBanner from "../components/MainBanner";
import { useEffect, useState } from "react";
import axios from "axios";
import CardProductos from "../components/CardProductos";

const Inicio = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get("http://localhost:5000/productos");
        const todos = res.data;

        // Elegimos 7 productos al azar
        const random = todos.sort(() => 0.5 - Math.random()).slice(0, 7);
        setProductos(random);
      } catch (error) {
        console.error("Error al traer productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <MainBanner />
      <Categorias />
      <section className="py-10">
        <h2 className="text-2xl font-bold mb-6">Recomendados</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productos.map((p) => (
            <CardProductos key={p.idProducto} product={p} />
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Inicio;
