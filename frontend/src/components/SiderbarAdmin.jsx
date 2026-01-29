import React from 'react';
import { ShoppingCart, Package, User, BarChart2, Home, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarAdmin = () => {
    const { logoutUser } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    
    const isActive = (path) => {
        const segmentos = location.pathname.split('/');
        return segmentos.includes(path);
    };

    const btnClass = (path) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-2 font-medium
    ${isActive(path)
            ? 'bg-blue-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }
  `;



    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col p-4 shadow-sm hidden md:flex animate-slideInLeft">

            {/* CABECERA */}
            <div className="mb-8 px-2 flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shrink-0">
                    {User?.nombre?.charAt(0)}{User?.apellido?.charAt(0)}
                </div>
                <div className="overflow-hidden">
                    <h2
                        className="text-sm font-bold text-gray-800 truncate"
                        title={`${User?.nombre} ${User?.apellido}`}
                    >
                        {User?.nombre} {User?.apellido}
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        PixelSalud • Administrador
                    </p>
                </div>
            </div>

            <nav className="flex-1">

                {/* INICIO */}
                <div
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer mb-2 text-gray-600 hover:bg-gray-100 font-medium"
                >
                    <Home size={20} />
                    <span>Inicio</span>
                </div>

                <div className="my-2 border-t border-gray-100 mx-2"></div>

                {/* PRODUCTOS */}
                <div onClick={() => navigate('/admin/MenuProductos')} className={btnClass('productos')}>
                    <Package size={20} />
                    <span>Productos</span>
                </div>

                {/* Clientes */}
                <div onClick={() => navigate('/admin/MenuClientes')} className={btnClass('usuarios')}>
                    <User size={20} />
                    <span>Clientes</span>
                </div>

                {/* Empleados */}
                <div onClick={() => navigate('/admin/MenuEmpleados')} className={btnClass('usuarios')}>
                    <User size={20} />
                    <span>Empleados</span>
                </div>

                {/* Medicos */}
                <div onClick={() => navigate('/admin/MenuMedicosAdmin')} className={btnClass('usuarios')}>
                    <User size={20} />
                    <span>Medicos</span>
                </div>

                {/* Ventas */}
                <div onClick={() => navigate('/admin/MenuVentas')} className={btnClass('usuarios')}>
                    <User size={20} />
                    <span>Ventas</span>
                </div>

            </nav>

            <div className="border-t border-gray-100 pt-4">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg w-full transition font-medium"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>

        </div>
    )
}

export default SidebarAdmin