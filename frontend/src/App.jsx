import { Route, Routes } from "react-router-dom";

// --- COMPONENTES GLOBALES ---
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import Error404 from "./pages/Error404";

// --- VISTAS PÚBLICAS / CLIENTE ---
import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos"; // Vista pública
import Producto from "./pages/Producto";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import CheckoutSuccess from "./components/CheckoutSuccess";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import RecuperarContrasena from "./pages/RecuperarContraseña";
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
import AdminEmpleados from "./components/AdminEmpleados";
import MenuVentas from "./components/MenuVentas";
import AdminVentasE from "./components/AdminVentasE";
import MedicosMenuAdmin from "./components/MedicosMenuAdmin";
import AdminMedicos from "./components/AdminMedicos";
// (Nota: AdminVentasO lo tenías importado pero no usado en rutas, lo omití para limpiar)

// --- PANEL EMPLEADO (Rutas Anidadas) ---
import PanelEmpleados from "./pages/PanelEmpleados"; // Layout
import VistaInicialCards from "./components/VistiaInicialCardsEmpleado"; // Ojo: Verifica si es 'Vistia' o 'Vista'
import EmpleadoRealizarVenta from "./components/EmpleadoRealizarVenta";
import EmpleadoListaVentas from "./components/EmpleadoListaVentas";
import EmpleadoEditarVenta from "./components/EmpleadoEditarVenta";
import EmpleadoProductos from "./components/EmpleadosProductos"; // Vista interna empleado

// --- PANEL MÉDICO (Rutas Anidadas) ---
import PanelMedicos from "./pages/PanelMedico"; // Layout
import VistaMenuMedico from "./components/VistaMenuMedico";; // Cards médico
import MedicoNuevaReceta from "./components/MedicoNuevaReceta";
import MedicoMisRecetas from "./components/MedicoMisRecetas";

// import Institucional from "./pages/Institucional";
import Sucursales from "./pages/Sucursales";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import TerminosCondiciones from "./pages/TerminosCondiciones";
import LegalesPromocion from "./pages/LegalesPromocion";


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
          
          {/* Tienda */}
          <Route path="productos" element={<Productos />} />
          <Route path="productos/:idProducto" element={<Producto />} />
          <Route path="productos/:categoria?" element={<Productos />} />
          
          {/* Proceso de Compra */}
          <Route path="carrito" element={<Carrito />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />
          
          {/* Institucional */}
          <Route path="sobreNosotros" element={<SobreNosotros />} />
          <Route path="contacto" element={<Contacto />} />

          {/* Dashboard Cliente */}
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

            <Route path="MenuProductos/*" element={<MenuProductos />}>
              <Route index element={<OpcionesProductos />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="ofertas" element={<AdminOfertas />} />
              <Route path="productosActivos" element={<AdminProductosActivos />} />
              <Route path="productosBaja" element={<AdminProductosBaja />} />
            </Route>

            <Route path="MenuClientes/*" element={<MenuClientes />}>
              <Route index element={<AdminClientes />} />
            </Route>

            <Route path="MenuEmpleados/*" element={<MenuEmpleados />}>
              <Route index element={<AdminEmpleados />} />
            </Route>

            <Route path="MenuVentas/*" element={<MenuVentas />}>
              <Route index element={<AdminVentasE />} />
            </Route>

            <Route path="MenuMedicosAdmin/*" element={<MedicosMenuAdmin />}>
              <Route index element={<AdminMedicos />} />
            </Route>
          </Route>
        </Route>
        
        {/* =========================================
            RUTAS EMPLEADO (NUEVAS & ANIDADAS)
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["empleado"]} />}>
          <Route path="/panelempleados" element={<PanelEmpleados />}>
             {/* 1. Inicio (Cards) */}
             <Route index element={<VistaInicialCards />} /> 
             
             {/* 2. Funciones */}
             <Route path="venta" element={<EmpleadoRealizarVenta />} />
             <Route path="productos" element={<EmpleadoProductos />} />
             
             {/* 3. Reutilización de ListaVentas con props específicas */}
             <Route 
                path="misventas" 
                element={
                    <EmpleadoListaVentas 
                        // El componente interno deberá leer el ID del store si no se pasa endpoint completo
                        // O bien, pasamos un prop 'mode="personal"'
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

             {/* 4. Edición (con parámetro ID) */}
             <Route path="editar-venta/:idVenta" element={<EmpleadoEditarVenta />} />
          </Route>
        </Route>

        {/* =========================================
            RUTAS MÉDICO (NUEVAS & ANIDADAS)
           ========================================= */}
        <Route element={<ProtectedRoute allowedRoles={["medico"]} />}>
          <Route path="/panelMedico" element={<PanelMedicos />}>
             <Route index element={<VistaMenuMedico />} />
             <Route path="nuevareceta" element={<MedicoNuevaReceta />} />
             <Route path="misrecetas" element={<MedicoMisRecetas />} />
          </Route>
        </Route>

        {/* Error Global */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </>
  );
};

export default App;