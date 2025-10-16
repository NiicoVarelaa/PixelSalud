import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";
import Registro from "./pages/Registro";
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import RecuperarContrasena from "./pages/RecuperarContraseña";
import Administrador from "./pages/Administrador";
import PanelEmpleados from "./pages/PanelEmpleados";
import MisCompras from "./pages/MisCompras";
import Checkout from "./pages/Checkout";
import Error404 from "./pages/Error404";
import Perfil from "./pages/Perfil";
import PerfilDirecciones from "./pages/PerfilDirecciones";
import PerfilFavoritos from "./pages/PerfilFavoritos";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<Producto />} />
        <Route path="productos/:categoria?" element={<Productos />} />
        <Route path="sobreNosotros" element={<SobreNosotros />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="registro" element={<Registro />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="login" element={<Login />} />
        <Route path="recuperarContraseña" element={<RecuperarContrasena />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="perfil/favoritos" element={<PerfilFavoritos />} />
        <Route path="perfil/direcciones" element={<PerfilDirecciones />} />
        <Route path="mis-compras" element={<MisCompras />} />
      </Route>
      <Route path="/admin/*" element={<Administrador />} />
      <Route path="/panelempleados" element={<PanelEmpleados />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default App;