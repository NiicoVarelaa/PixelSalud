import { NavbarAdmin } from "@features/admin/layout";
import { Outlet } from "react-router-dom";

const PanelMedicos = () => {
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

export default PanelMedicos;
