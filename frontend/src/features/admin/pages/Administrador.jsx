import { useNavigate, Outlet } from "react-router-dom";
import { SiderbarAdmin } from "@features/admin/layout";
import { useEffect } from "react";
import { useProductStore } from "@store/useProductStore";
import { useAuthStore } from "@store/useAuthStore";
import { toast } from "react-toastify";

const Administrador = () => {
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!user || user.rol !== "admin") {
      toast.error("Acceso no autorizado");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return <p>Cargando...</p>;

  return (
    <>
      <div className="flex h-dvh flex-col overflow-hidden bg-gray-50 lg:flex-row">
        <SiderbarAdmin user={user} />

        <main className="flex h-full min-h-0 flex-1 overflow-hidden bg-gray-50 lg:p-6">
          <div className="flex h-full min-h-0 w-full flex-col p-4 lg:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Administrador;
