import { Route, Routes } from "react-router-dom";

import { ScrollToTop } from "@components/templates";
import AppLayout from "@features/public/layout/AppLayout";
import ProtectedRoute from "@features/auth/routing/ProtectedRoute";
import Error404 from "./pages/Error404";

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
  NewsletterBajaPage as NewsletterBaja,
} from "@features/public/pages";
import { CheckoutPage as Checkout, CheckoutSuccess } from "@features/customer";
import {
  LoginPage as Login,
  RegistroPage as Registro,
  RecuperarContrasenaPage as RecuperarContrasena,
  RestablecerContrasenaPage as RestablecerContrasena,
} from "@features/auth/pages";

import {
  DashboardCliente,
  MenuClientes,
  PerfilPage as Perfil,
  PerfilFavoritosPage as PerfilFavoritos,
  MisComprasPage as MisCompras,
  PerfilDireccionesPage as PerfilDirecciones,
} from "@features/customer";

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
  OpcionesVentas,
  AdminReportes,
  AdminCupones,
  AdminAuditoria,
} from "@features/admin";

import {
  PanelEmpleadosPage as PanelEmpleados,
  DashboardEmpleado,
  MenuEmpleados,
  EmpleadoRealizarVenta,
  EmpleadoListaVentas,
  EmpleadoEditarVenta,
  EmpleadosProductos,
} from "@features/employee";

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
        <Route path="/" element={<AppLayout />}>
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
          <Route path="sucursales" element={<Sucursales />} />
          <Route
            path="preguntas-frecuentes"
            element={<PreguntasFrecuentes />}
          />
          <Route
            path="terminos-condiciones"
            element={<TerminosCondiciones />}
          />
          <Route path="legales-promocion" element={<LegalesPromocion />} />
          <Route path="newsletter/baja" element={<NewsletterBaja />} />

          <Route path="perfil" element={<DashboardCliente />}>
            <Route index element={<Perfil />} />
            <Route path="favoritos" element={<PerfilFavoritos />} />
            <Route path="pedidos" element={<MisCompras />} />
            <Route path="direcciones" element={<PerfilDirecciones />} />
          </Route>
        </Route>

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
            </Route>

            <Route path="reportes" element={<AdminReportes />} />
            <Route path="cupones" element={<AdminCupones />} />
            <Route path="mensajes" element={<AdminMensajes />} />
            <Route path="auditoria" element={<AdminAuditoria />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>
          <Route path="/panelempleados" element={<PanelEmpleados />}>
            <Route index element={<DashboardEmpleado />} />
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
