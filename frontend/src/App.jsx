import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

import { ScrollToTop } from "@components/templates";
import AppLayout from "@features/public/layout/AppLayout";
import ProtectedRoute from "@features/auth/routing/ProtectedRoute";
import Error404 from "./pages/Error404";
import Unauthorized from "./pages/Unauthorized";

const RouteFallback = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-green-200 border-t-green-600" />
  </div>
);

const lazyLoad = (importFn) =>
  lazy(() => importFn().then((mod) => ({ default: mod.default || mod })));

const Inicio = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.InicioPage })));
const Productos = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.ProductosPage })));
const Producto = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.ProductoPage })));
const SobreNosotros = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.SobreNosotrosPage })));
const Contacto = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.ContactoPage })));
const Sucursales = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.SucursalesPage })));
const PreguntasFrecuentes = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.PreguntasFrecuentesPage })));
const TerminosCondiciones = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.TerminosCondicionesPage })));
const LegalesPromocion = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.LegalesPromocionPage })));
const NewsletterBaja = lazyLoad(() => import("@features/public/pages").then((m) => ({ default: m.NewsletterBajaPage })));

const Checkout = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.CheckoutPage })));
const CheckoutSuccess = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.CheckoutSuccess })));

const Login = lazyLoad(() => import("@features/auth/pages").then((m) => ({ default: m.LoginPage })));
const Registro = lazyLoad(() => import("@features/auth/pages").then((m) => ({ default: m.RegistroPage })));
const RecuperarContrasena = lazyLoad(() => import("@features/auth/pages").then((m) => ({ default: m.RecuperarContrasenaPage })));
const RestablecerContrasena = lazyLoad(() => import("@features/auth/pages").then((m) => ({ default: m.RestablecerContrasenaPage })));

const DashboardCliente = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.DashboardCliente })));
const MenuClientes = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.MenuClientes })));
const Perfil = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.PerfilPage })));
const PerfilFavoritos = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.PerfilFavoritosPage })));
const MisCompras = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.MisComprasPage })));
const PerfilDirecciones = lazyLoad(() => import("@features/customer").then((m) => ({ default: m.PerfilDireccionesPage })));

const Administrador = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdministradorPage })));
const AdminMensajes = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminMensajesPage })));
const AdminMenu = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminMenu })));
const AdminProductos = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminProductos })));
const AdminOfertas = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminOfertas })));
const AdminCampanas = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminCampanas })));
const AdminClientes = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminClientes })));
const AdminEmpleados = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminEmpleados })));
const MenuVentas = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.MenuVentas })));
const OpcionesVentas = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.OpcionesVentas })));
const AdminReportes = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminReportes })));
const AdminCupones = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminCupones })));
const AdminAuditoria = lazyLoad(() => import("@features/admin").then((m) => ({ default: m.AdminAuditoria })));

const PanelEmpleados = lazyLoad(() => import("@features/employee").then((m) => ({ default: m.PanelEmpleadosPage })));
const DashboardEmpleado = lazyLoad(() => import("@features/employee").then((m) => ({ default: m.DashboardEmpleado })));
const MenuEmpleados = lazyLoad(() => import("@features/employee").then((m) => ({ default: m.MenuEmpleados })));
const EmpleadoRealizarVenta = lazyLoad(() => import("@features/employee").then((m) => ({ default: m.EmpleadoRealizarVenta })));
const EmpleadoListaVentas = lazyLoad(() => import("@features/employee").then((m) => ({ default: m.EmpleadoListaVentas })));
const EmpleadoEditarVenta = lazyLoad(() => import("@features/employee").then((m) => ({ default: m.EmpleadoEditarVenta })));
const EmpleadosProductos = lazyLoad(() => import("@features/employee").then((m) => ({ default: m.EmpleadosProductos })));

const PanelMedicos = lazyLoad(() => import("@features/medical").then((m) => ({ default: m.PanelMedicoPage })));
const VistaMenuMedico = lazyLoad(() => import("@features/medical").then((m) => ({ default: m.VistaMenuMedico })));
const MedicoNuevaReceta = lazyLoad(() => import("@features/medical").then((m) => ({ default: m.MedicoNuevaReceta })));
const MedicoMisRecetas = lazyLoad(() => import("@features/medical").then((m) => ({ default: m.MedicoMisRecetas })));

const SuspensedRoute = ({ children }) => (
  <Suspense fallback={<RouteFallback />}>{children}</Suspense>
);

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<SuspensedRoute><Inicio /></SuspensedRoute>} />
          <Route path="registro" element={<SuspensedRoute><Registro /></SuspensedRoute>} />
          <Route path="login" element={<SuspensedRoute><Login /></SuspensedRoute>} />
          <Route path="recuperarContraseña" element={<SuspensedRoute><RecuperarContrasena /></SuspensedRoute>} />
          <Route path="reset-password" element={<SuspensedRoute><RestablecerContrasena /></SuspensedRoute>} />

          <Route path="productos" element={<SuspensedRoute><Productos /></SuspensedRoute>} />
          <Route path="productos/categoria/:slug" element={<SuspensedRoute><Productos /></SuspensedRoute>} />
          <Route path="productos/:idProducto" element={<SuspensedRoute><Producto /></SuspensedRoute>} />
          <Route path="checkout" element={<SuspensedRoute><Checkout /></SuspensedRoute>} />
          <Route path="checkout/success" element={<SuspensedRoute><CheckoutSuccess /></SuspensedRoute>} />
          <Route path="sobreNosotros" element={<SuspensedRoute><SobreNosotros /></SuspensedRoute>} />
          <Route path="contacto" element={<SuspensedRoute><Contacto /></SuspensedRoute>} />
          <Route path="sucursales" element={<SuspensedRoute><Sucursales /></SuspensedRoute>} />
          <Route path="preguntas-frecuentes" element={<SuspensedRoute><PreguntasFrecuentes /></SuspensedRoute>} />
          <Route path="terminos-condiciones" element={<SuspensedRoute><TerminosCondiciones /></SuspensedRoute>} />
          <Route path="legales-promocion" element={<SuspensedRoute><LegalesPromocion /></SuspensedRoute>} />
          <Route path="newsletter/baja" element={<SuspensedRoute><NewsletterBaja /></SuspensedRoute>} />

          <Route path="perfil" element={<SuspensedRoute><DashboardCliente /></SuspensedRoute>}>
            <Route index element={<SuspensedRoute><Perfil /></SuspensedRoute>} />
            <Route path="favoritos" element={<SuspensedRoute><PerfilFavoritos /></SuspensedRoute>} />
            <Route path="pedidos" element={<SuspensedRoute><MisCompras /></SuspensedRoute>} />
            <Route path="direcciones" element={<SuspensedRoute><PerfilDirecciones /></SuspensedRoute>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/*" element={<SuspensedRoute><Administrador /></SuspensedRoute>}>
            <Route index element={<SuspensedRoute><AdminMenu /></SuspensedRoute>} />
            <Route path="productos" element={<SuspensedRoute><AdminProductos /></SuspensedRoute>} />
            <Route path="ofertas" element={<SuspensedRoute><AdminOfertas /></SuspensedRoute>} />
            <Route path="campanas" element={<SuspensedRoute><AdminCampanas /></SuspensedRoute>} />
            <Route path="MenuClientes/*" element={<SuspensedRoute><MenuClientes /></SuspensedRoute>}>
              <Route index element={<SuspensedRoute><AdminClientes /></SuspensedRoute>} />
            </Route>
            <Route path="MenuEmpleados/*" element={<SuspensedRoute><MenuEmpleados /></SuspensedRoute>}>
              <Route index element={<SuspensedRoute><AdminEmpleados /></SuspensedRoute>} />
            </Route>
            <Route path="MenuVentas/*" element={<SuspensedRoute><MenuVentas /></SuspensedRoute>}>
              <Route index element={<SuspensedRoute><OpcionesVentas /></SuspensedRoute>} />
            </Route>
            <Route path="reportes" element={<SuspensedRoute><AdminReportes /></SuspensedRoute>} />
            <Route path="cupones" element={<SuspensedRoute><AdminCupones /></SuspensedRoute>} />
            <Route path="mensajes" element={<SuspensedRoute><AdminMensajes /></SuspensedRoute>} />
            <Route path="auditoria" element={<SuspensedRoute><AdminAuditoria /></SuspensedRoute>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>
          <Route path="/panelempleados" element={<SuspensedRoute><PanelEmpleados /></SuspensedRoute>}>
            <Route index element={<SuspensedRoute><DashboardEmpleado /></SuspensedRoute>} />
            <Route path="venta" element={<SuspensedRoute><EmpleadoRealizarVenta /></SuspensedRoute>} />
            <Route path="productos" element={<SuspensedRoute><EmpleadosProductos /></SuspensedRoute>} />
            <Route path="misventas" element={<SuspensedRoute><EmpleadoListaVentas endpoint="personal" title="Mis Ventas Personales" /></SuspensedRoute>} />
            <Route path="ventastotales" element={<SuspensedRoute><EmpleadoListaVentas endpoint="general" title="Ventas Totales" /></SuspensedRoute>} />
            <Route path="editar-venta/:idVenta" element={<SuspensedRoute><EmpleadoEditarVenta /></SuspensedRoute>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["medico"]} />}>
          <Route path="/panelMedico" element={<SuspensedRoute><PanelMedicos /></SuspensedRoute>}>
            <Route index element={<SuspensedRoute><VistaMenuMedico /></SuspensedRoute>} />
            <Route path="nuevareceta" element={<SuspensedRoute><MedicoNuevaReceta /></SuspensedRoute>} />
            <Route path="misrecetas" element={<SuspensedRoute><MedicoMisRecetas /></SuspensedRoute>} />
          </Route>
        </Route>

        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default App;
