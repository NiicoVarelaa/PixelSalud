import {Link, Outlet } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";
import { useEffect} from "react";
import { useProductStore } from "../store/useProductStore";


const Administrador = () => {
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  // 3. LLAMAR AL STORE AL MONTAR EL COMPONENTE
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <>
      <div>
        <NavbarAdmin />
        <div className="p-6">
      
          <Outlet></Outlet>
          
        </div>
      </div>
    </>
  );
};

export default Administrador;