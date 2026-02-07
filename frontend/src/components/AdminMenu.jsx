import { Link } from "react-router-dom";
import {
  Package,
  Users,
  Briefcase,
  DollarSign,
  MessageSquare,
  FileSpreadsheet,
} from "lucide-react";

const AdminMenu = () => {
  const modulos = [
    {
      titulo: "Productos",
      ruta: "/admin/MenuProductos",
      icono: <Package size={40} className="text-green-600" />,
      colorBg: "bg-green-100",
      desc: "Gestión de inventario",
    },
    {
      titulo: "Clientes",
      ruta: "/admin/MenuClientes",
      icono: <Users size={40} className="text-blue-600" />,
      colorBg: "bg-blue-100",
      desc: "Administrar usuarios",
    },
    {
      titulo: "Empleados",
      ruta: "/admin/MenuEmpleados",
      icono: <Briefcase size={40} className="text-yellow-600" />,
      colorBg: "bg-yellow-100",
      desc: "Control de personal",
    },
    {
      titulo: "Ventas",
      ruta: "/admin/MenuVentas",
      icono: <DollarSign size={40} className="text-purple-600" />,
      colorBg: "bg-purple-100",
      desc: "Historial y reportes",
    },
    {
      titulo: "Reportes",
      ruta: "/admin/reportes",
      icono: <FileSpreadsheet size={40} className="text-indigo-600" />,
      colorBg: "bg-indigo-100",
      desc: "Informes exportables",
    },
    {
      titulo: "Mensajes",
      ruta: "/admin/mensajes",
      icono: <MessageSquare size={40} className="text-cyan-600" />,
      colorBg: "bg-cyan-100",
      desc: "Consultas de clientes",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-8">
      {/* Encabezado */}
      <div className="text-center mb-16 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
          Panel de Administración
        </h1>
        <p className="text-gray-500 text-lg">
          Bienvenido, selecciona un módulo para comenzar.
        </p>
      </div>

      {/* Grid de Tarjetas */}
      <nav className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {modulos.map((item, index) => (
          <Link
            key={index}
            to={item.ruta}
            className="group relative bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col items-center justify-center text-center h-64"
          >
            {/* Círculo del icono */}
            <div
              className={`p-5 rounded-full mb-6 ${item.colorBg} group-hover:scale-110 transition-transform duration-300`}
            >
              {item.icono}
            </div>

            {/* Título */}
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
              {item.titulo}
            </h3>

            {/* Descripción pequeña (opcional) */}
            <p className="text-sm text-gray-400 mt-2 font-medium">
              {item.desc}
            </p>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminMenu;
