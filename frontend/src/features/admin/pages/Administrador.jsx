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
    document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!user || user.rol !== "admin") {
      toast.error("Acceso no autorizado");
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return <p>Cargando...</p>;

  return (
    <>
      <div className="flex min-h-dvh flex-col bg-gray-50 lg:h-dvh lg:flex-row lg:overflow-hidden">
        <SiderbarAdmin user={user} />

        <main className="flex min-h-0 flex-1 overflow-visible bg-gray-50 lg:h-full lg:overflow-hidden lg:p-6">
          <div className="flex w-full flex-1 flex-col p-4 lg:h-full lg:min-h-0 lg:p-0">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Administrador;
