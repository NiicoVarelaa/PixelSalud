import { Route, Routes, useLocation } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import Registro from "./pages/Registro";
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import RecuperarContrasena from "./pages/RecuperarContraseña";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Administrador from "./pages/Administrador";
import PanelEmpleados from "./pages/PanelEmpleados";
import MisCompras from "./pages/MisCompras";
import Checkout from "./pages/Checkout";
import Error404 from "./pages/Error404";
import Perfil from "./pages/Perfil";
import PerfilDirecciones from "./pages/PerfilDirecciones";
import PerfilFavoritos from "./pages/PerfilFavoritos";

const App = () => {
  const location = useLocation();
  
  if (location.pathname.startsWith("/admin")) {
    return (
      <Routes>
        <Route path="/admin/*" element={<Administrador />} />
      </Routes>
    );
  }

  if (location.pathname.startsWith("/panelempleados")) {
    return (
      <Routes>
        <Route path="/panelempleados" element={<PanelEmpleados />} />
      </Routes>
    );
  }
  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <ToastContainer position="bottom-right" autoClose={2500} />
      <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/sobreNosotros" element={<SobreNosotros />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/Registro" element={<Registro />} />
          <Route path="/productos/:id" element={<Producto />} />
          <Route path="/productos/:categoria?" element={<Productos />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/recuperarContraseña" element={<RecuperarContrasena />} />
          <Route path="/perfil/favoritos" element={<PerfilFavoritos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/perfil/direcciones" element={<PerfilDirecciones />} />
          <Route path="/mis-compras" element={<MisCompras />} />
          <Route path="*" element={<Error404/>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
