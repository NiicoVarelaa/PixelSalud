import Header from "@features/public/components/navigation/Header";
import Footer from "@features/public/components/footer/Footer";
import { MainCarrito } from "@features/customer/components/cart";

const Carrito = () => {
  return (
    <div>
      <Header />
      <MainCarrito breadcrumbsCategoria="carrito" />
      <Footer />
    </div>
  );
};

export default Carrito;
