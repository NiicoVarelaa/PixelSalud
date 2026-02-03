import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import { useEffect } from "react";
import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-toastify";
import SiderbarAdmin from "../components/SiderbarAdmin";


const Administrador = () => {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // 3. LLAMAR AL STORE AL MONTAR EL COMPONENTE
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!user || user.rol !== 'admin') {
      toast.error("Acceso no autorizado");
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return <p>Cargando...</p>;

  const esDashboardInicial = location.pathname === '/admin';

  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <NavbarAdmin />

      <div className="flex flex-1 overflow-hidden">
        {!esDashboardInicial && <SiderbarAdmin user={user} />}

        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
    </>
  );
};

export default Administrador;