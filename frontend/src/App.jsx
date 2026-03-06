import { Route, Routes } from "react-router-dom";

// --- COMPONENTES GLOBALES ---
import { Layout, ScrollToTop, ProtectedRoute } from "@components/templates";
import Error404 from "./pages/Error404";

// --- VISTAS PÚBLICAS / CLIENTE ---
import {
  InicioPage as Inicio,
  ProductosPage as Productos,
  ProductoPage as Producto,
  SobreNosotrosPage as SobreNosotros,
  ContactoPage as Contacto,
  SucursalesPage as Sucursales,
  PreguntasFrecuentesPage as PreguntasFrecuentes,
  TerminosCondicionesPage as TerminosCondiciones,
  LegalesPromocionPage as LegalesPromocion,
} from "@features/public/pages";
import {
  // CarritoPage as Carrito, // Ya no se usa, ahora es un modal
  CheckoutPage as Checkout,
  CheckoutSuccess,
} from "@features/customer";
import {
  LoginPage as Login,
  RegistroPage as Registro,
  RecuperarContrasenaPage as RecuperarContrasena,
  RestablecerContrasenaPage as RestablecerContrasena,
} from "@features/auth/pages";

// --- PERFIL CLIENTE ---
import {
  DashboardCliente,
  MenuClientes,
  PerfilPage as Perfil,
  PerfilFavoritosPage as PerfilFavoritos,
  MisComprasPage as MisCompras,
  PerfilDireccionesPage as PerfilDirecciones,
} from "@features/customer";

// --- ADMINISTRADOR ---
import {
  AdministradorPage as Administrador,
  AdminMensajesPage as AdminMensajes,
  AdminMenu,
  AdminProductos,
  AdminOfertas,
  AdminCampanas,
  AdminClientes,
  AdminEmpleados,
  MenuVentas,
  AdminVentasE,
  AdminVentasO,
  OpcionesVentas,
  AdminReportes,
  AdminCupones,
  AdminAuditoria,
} from "@features/admin";

// --- PANEL EMPLEADO ---
import {
  PanelEmpleadosPage as PanelEmpleados,
  MenuEmpleados,
  VistiaInicialCardsEmpleado,
  EmpleadoRealizarVenta,
  EmpleadoListaVentas,
  EmpleadoEditarVenta,
  EmpleadosProductos,
} from "@features/employee";

// --- PANEL MÉDICO ---
import {
  PanelMedicoPage as PanelMedicos,
  VistaMenuMedico,
  MedicoNuevaReceta,
  MedicoMisRecetas,
} from "@features/medical";

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
          <Route path="reset-password" element={<RestablecerContrasena />} />

          <Route path="productos" element={<Productos />} />
          <Route path="productos/:idProducto" element={<Producto />} />
          <Route path="productos/:categoria?" element={<Productos />} />
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

        {/* =========================================
            RUTAS ADMINISTRADOR
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/*" element={<Administrador />}>
            <Route index element={<AdminMenu />} />

            <Route path="productos" element={<AdminProductos />} />
            <Route path="ofertas" element={<AdminOfertas />} />
            <Route path="campanas" element={<AdminCampanas />} />

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

            <Route path="reportes" element={<AdminReportes />} />
            <Route path="cupones" element={<AdminCupones />} />
            <Route path="mensajes" element={<AdminMensajes />} />
            <Route path="auditoria" element={<AdminAuditoria />} />
          </Route>
        </Route>

        {/* =========================================
            RUTAS EMPLEADO
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>
          <Route path="/panelempleados" element={<PanelEmpleados />}>
            <Route index element={<VistiaInicialCardsEmpleado />} />
            <Route path="venta" element={<EmpleadoRealizarVenta />} />
            <Route path="productos" element={<EmpleadosProductos />} />
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
