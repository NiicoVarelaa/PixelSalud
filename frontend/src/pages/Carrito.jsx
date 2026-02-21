import { Header, Footer } from "@components/organisms";
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
