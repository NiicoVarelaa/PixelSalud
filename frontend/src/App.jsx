import { Route, Routes } from "react-router-dom";

// --- COMPONENTES GLOBALES ---
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Error404 from "./pages/Error404";

// --- VISTAS PÚBLICAS / CLIENTE ---
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./components/CheckoutSuccess";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import RecuperarContrasena from "./pages/RecuperarContraseña";
import RestablecerContrasena from "./pages/RestablecerContrasena"; // <--- 1. NUEVA IMPORTACIÓN AQUÍ
import SobreNosotros from "./pages/SobreNosotros";
import Contacto from "./pages/Contacto";

// --- PERFIL CLIENTE ---
import DashboardCliente from "../src/components/DashboardCliente";
import Perfil from "./pages/Perfil";
import PerfilFavoritos from "./pages/PerfilFavoritos";
import MisCompras from "./pages/MisCompras";
import PerfilDirecciones from "./pages/PerfilDirecciones";

// --- ADMINISTRADOR ---
import Administrador from "./pages/Administrador";
import AdminMenu from "./components/AdminMenu";
import MenuProductos from "./components/MenuProductos";
import OpcionesProductos from "./components/OpcionesProductos";
import AdminProductos from "./components/AdminProductos";
import AdminOfertas from "./components/AdminOfertas";
import AdminProductosActivos from "./components/AdminProductosActivos";
import AdminProductosBaja from "./components/AdminProductosBaja";
import MenuClientes from "./components/MenuClientes";
import AdminClientes from "./components/AdminClientes";
import MenuEmpleados from "./components/MenuEmpleados";
import AdminMensajes from "./pages/AdminMensajes";
import AdminEmpleados from "./components/AdminEmpleados";
import MenuVentas from "./components/MenuVentas";
import AdminVentasE from "./components/AdminVentasE";
import AdminReportes from "./components/AdminReportes";
import AdminCupones from "./components/AdminCupones";

// (Nota: AdminVentasO lo tenías importado pero no usado en rutas, lo omití para limpiar)

// --- PANEL EMPLEADO ---
import PanelEmpleados from "./pages/PanelEmpleados";
import VistaInicialCards from "./components/VistiaInicialCardsEmpleado";
import EmpleadoRealizarVenta from "./components/EmpleadoRealizarVenta";
import EmpleadoListaVentas from "./components/EmpleadoListaVentas";
import EmpleadoEditarVenta from "./components/EmpleadoEditarVenta";
import EmpleadoProductos from "./components/EmpleadosProductos";

// --- PANEL MÉDICO ---
import PanelMedicos from "./pages/PanelMedico";
import VistaMenuMedico from "./components/VistaMenuMedico";
import MedicoNuevaReceta from "./components/MedicoNuevaReceta";
import MedicoMisRecetas from "./components/MedicoMisRecetas";

import Sucursales from "./pages/Sucursales";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import LegalesPromocion from "./pages/LegalesPromocion";
import AdminVentasO from "./components/AdminVentasO";
import OpcionesVentas from "./components/OpcionesVentas";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* =========================================
            RUTAS PÚBLICAS / CLIENTE
           ========================================= */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="registro" element={<Registro />} />
          <Route path="login" element={<Login />} />
          <Route path="recuperarContraseña" element={<RecuperarContrasena />} />

          {/* 2. NUEVA RUTA AQUÍ */}
          {/* Esta ruta recibe el token por URL (?token=...) y muestra el form para cambiar la clave */}
          <Route path="reset-password" element={<RestablecerContrasena />} />

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

        {/* ... (RUTAS ADMIN, EMPLEADO Y MÉDICO QUEDAN IGUAL) ... */}

        {/* =========================================
            RUTAS ADMINISTRADOR
           ========================================= */}
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
              <Route path="VentasO" element={<AdminVentasO />} />
            </Route>

            {/* <Route path="MenuMedicosAdmin/*" element={<MedicosMenuAdmin />}>
              <Route index element={<AdminMedicos />} />
            </Route> */}

            <Route path="reportes" element={<AdminReportes />} />
            <Route path="cupones" element={<AdminCupones />} />
            <Route path="mensajes" element={<AdminMensajes />} />
          </Route>
        </Route>

        {/* =========================================
            RUTAS EMPLEADO
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>
          <Route path="/panelempleados" element={<PanelEmpleados />}>
            <Route index element={<VistaInicialCards />} />
            <Route path="venta" element={<EmpleadoRealizarVenta />} />
            <Route path="productos" element={<EmpleadoProductos />} />
            <Route
              path="misventas"
              element={
                <EmpleadoListaVentas
                  endpoint="personal"
                  title="Mis Ventas Personales"
                />
              }
            />
            <Route
              path="ventastotales"
              element={
                <EmpleadoListaVentas
                  endpoint="general"
                  title="Ventas Totales"
                />
              }
            />
            <Route
              path="editar-venta/:idVenta"
              element={<EmpleadoEditarVenta />}
            />
          </Route>
        </Route>

        {/* =========================================
            RUTAS MÉDICO
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["medico"]} />}>
          <Route path="/panelMedico" element={<PanelMedicos />}>
            <Route index element={<VistaMenuMedico />} />
            <Route path="nuevareceta" element={<MedicoNuevaReceta />} />
            <Route path="misrecetas" element={<MedicoMisRecetas />} />
          </Route>
        </Route>

        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default App;
