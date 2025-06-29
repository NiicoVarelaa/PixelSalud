import { Routes, Route, Link } from "react-router-dom";
import AdminProductos from "../components/AdminProductos";
import AdminEmpleados from "../components/AdminEmpleados";
import AdminClientes from "../components/AdminClientes";
import AdminVentasE from "../components/AdminVentasE";
import AdminVentasO from "../components/AdminVentasO";
import NavbarAdmin from "../components/NavbarAdmin";
import AdminCards from "../components/AdminCards";
import { useState, useEffect} from "react";
import axios from "axios";


const Administrador = () => {
const [productos, setProductos] = useState([]);

const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener Productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <>
      <div>
        <NavbarAdmin />
        <div className="p-6">
          {/* Navegación interna del administrador */}
          <nav className="flex flex-wrap justify-center gap-4 mb-10">
            <Link to="/admin/productos" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Productos</Link>
            <Link to="/admin/clientes" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Clientes</Link>
            <Link to="/admin/Empleados" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Empleados</Link>
            <Link to="/admin/ventasE" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Ventas Empleados</Link>
            <Link to="/admin/ventasO" className="px-5 py-2 text-lg font-medium transition-transform duration-200 hover:scale-105 hover:bg-primary-700 hover:text-white rounded-full shadow-md">Ventas Online</Link>
          </nav>

           {location.pathname === "/admin" && (
            <AdminCards productos={productos} obtenerProductos={obtenerProductos} />
          )}

          {/* Subrutas dentro del administrador */}
          <Routes>
            <Route path="productos" element={<AdminProductos productos={productos} obtenerProductos={obtenerProductos} />} />
            <Route path="clientes" element={<AdminClientes/>} />
            <Route path= "empleados" element={<AdminEmpleados/>} />
            <Route path="ventasE" element={<AdminVentasE />} />
            <Route path="ventasO" element={<AdminVentasO />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Administrador;
