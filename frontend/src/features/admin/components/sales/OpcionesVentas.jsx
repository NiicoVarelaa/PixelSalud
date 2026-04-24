import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@features/admin/components/shared";
import VentasSwitch from "./shared/VentasSwitch";
import AdminVentasE from "./employees/AdminVentasE";
import AdminVentasO from "./online/AdminVentasO";

const OpcionesVentas = () => {
  const [activeOption, setActiveOption] = useState("empleados");
  const [openVentaEmpleadoToken, setOpenVentaEmpleadoToken] = useState(0);

  const handleOptionChange = (option) => {
    setActiveOption(option);
  };

  return (
    <>
      <AdminLayout
        title="Gestión de Ventas"
        description="Alterna entre ventas del mostrador y pedidos online en una misma vista."
        contentClassName="flex min-h-0 flex-1 flex-col"
      >
        <div className="mb-4 flex w-full shrink-0 flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between">
          <nav
            className="w-full sm:w-fit"
            aria-label="Navegación de vistas de ventas"
          >
            <VentasSwitch
              activeOption={activeOption}
              onOptionChange={handleOptionChange}
            />
          </nav>

          {activeOption === "empleados" && (
            <button
              onClick={() => setOpenVentaEmpleadoToken((prev) => prev + 1)}
              className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 sm:w-auto"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-green-600 group-hover:bg-green-50">
                <Plus size={16} />
              </span>
              Nueva Venta
            </button>
          )}
        </div>

        <main
          role="tabpanel"
          aria-labelledby={`tab-${activeOption}`}
          className="flex min-h-0 flex-1 flex-col rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
          tabIndex={-1}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeOption}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex min-h-0 w-full flex-1 flex-col"
            >
              {activeOption === "empleados" ? (
                <AdminVentasE openRequestToken={openVentaEmpleadoToken} />
              ) : (
                <AdminVentasO />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </AdminLayout>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        limit={3}
        toastClassName="rounded-xl shadow-lg font-sans text-sm"
      />
    </>
  );
};

export default OpcionesVentas;
