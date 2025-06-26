import { Routes, Route, Link, useNavigate } from "react-router-dom";
import AdminProductos from "../components/AdminProductos";
import AdminMedicos from "../components/AdminMedicos";
import AdminRecetas from "../components/AdminRecetas";
import AdminClientes from "../components/AdminClientes";
import AdminVentasE from "../components/AdminVentasE";
import AdminVentasO from "../components/AdminVentasO";
import NavbarAdmin from "../components/NavbarAdmin";
import AdminCards from "../components/AdminCards";

const Administrador = () => {
  const navigate = useNavigate();

  const handlenavegador = (ruta) => {
    navigate("/admin/${ruta}");
  };

  return (
    <>
      <div>
        <NavbarAdmin />
        <div className="p-6">
          {/* Navegación interna del administrador */}
          <nav className="flex flex-wrap justify-center gap-4 mb-10">
            <Link to="/admin/productos" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Productos</Link>
            <Link to="/admin/clientes" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Clientes</Link>
            <Link to="/admin/medicos" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Médicos</Link>
            <Link to="/admin/recetas" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Recetas</Link>
            <Link to="/admin/ventasE" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Ventas Empleados</Link>
            <Link to="/admin/ventasO" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Ventas Online</Link>
          </nav>

          {/* Subrutas dentro del administrador */}
          <Routes>
            <Route path="productos" element={<AdminProductos />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="medicos" element={<AdminMedicos />} />
            <Route path="recetas" element={<AdminRecetas />} />
            <Route path="ventasE" element={<AdminVentasE />} />
            <Route path="ventasO" element={<AdminVentasO />} />
          </Routes>
        </div>
        <AdminCards/>
      </div>
    </>
  );
};

export default Administrador;
