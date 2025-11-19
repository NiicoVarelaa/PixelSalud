import { Route, Routes } from "react-router-dom";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
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
import DashboardCliente from "../src/components/DashboardCliente";
import AdminProductos from "./components/AdminProductos";
import AdminVentasE from "./components/AdminVentasE";
import AdminVentasO from "./components/AdminVentasO";
import AdminClientes from "./components/AdminClientes";
import AdminEmpleados from "./components/AdminEmpleados";
import AdminMenu from "./components/AdminMenu";
import PanelMedicos from "./pages/PanelMedico";
import MenuProductos from "./components/MenuProductos";
import OpcionesProductos from "./components/OpcionesProductos";
import AdminOfertas from "./components/AdminOfertas";
import AdminProductosActivos from "./components/AdminProductosActivos";
import AdminProductosBaja from "./components/AdminProductosBaja";
import MenuEmpleados from "./components/MenuEmpleados";
import MenuVentas from "./components/MenuVentas";
import OpcionesVentas from "./components/OpcionesVentas";
import MenuClientes from "./components/MenuClientes";
import MedicosMenuAdmin from "./components/MedicosMenuAdmin";
import AdminMedicos from "./components/AdminMedicos";


const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="registro" element={<Registro />} />
          <Route path="login" element={<Login />} />
          <Route path="recuperarContraseña" element={<RecuperarContrasena />} />
          <Route path="productos" element={<Productos />} />
          <Route path="productos/:idProducto" element={<Producto />} />
          <Route path="productos/:categoria?" element={<Productos />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />
          <Route path="sobreNosotros" element={<SobreNosotros />} />
          <Route path="contacto" element={<Contacto />} />

          <Route path="perfil" element={<DashboardCliente />}>
            <Route index element={<Perfil />} />
            <Route path="favoritos" element={<PerfilFavoritos />} />
            <Route path="mis-compras" element={<MisCompras />} />
            <Route path="perfil/direcciones" element={<PerfilDirecciones />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/*" element={<Administrador />}>
            <Route index element={<AdminMenu />} />

            <Route path="MenuProductos/*" element={<MenuProductos />}>
              <Route index element={<OpcionesProductos />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="ofertas" element={<AdminOfertas />} />
              <Route
                path="productosActivos"
                element={<AdminProductosActivos />}
              />
              <Route path="productosBaja" element={<AdminProductosBaja />} />
            </Route>

            <Route path="MenuClientes/*" element={<MenuClientes />}>
              <Route index element={<AdminClientes />} />
            </Route>

            <Route path="MenuEmpleados/*" element={<MenuEmpleados />}>
              <Route index element={<AdminEmpleados />} />
            </Route>

            <Route path="MenuVentas/*" element={<MenuVentas />}>
              <Route index element={<OpcionesVentas />} />
              <Route path="VentasE" element={<AdminVentasE />} />
              <Route path="ventasO" element={<AdminVentasO />} />
            </Route>

            <Route path="MenuMedicosAdmin/*" element={<MedicosMenuAdmin />}>
              <Route index element={<AdminMedicos />} />
            </Route>
          </Route>
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>
          <Route path="/panelempleados" element={<PanelEmpleados />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["medico"]} />}>
          <Route path="/panelMedico" element={<PanelMedicos />} />
        </Route>
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default App;
