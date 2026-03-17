import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@features/admin/components/shared";
import VentasSwitch from "./shared/VentasSwitch";
import AdminVentasE from "./employees/AdminVentasE";
import AdminVentasO from "./online/AdminVentasO";

const OpcionesVentas = () => {
  const [activeOption, setActiveOption] = useState("empleados");

  const handleOptionChange = (option) => {
    setActiveOption(option);
  };

  return (
    <AdminLayout
      title="Gestión de Ventas"
      description="Alterna entre ventas del mostrador y pedidos online en una misma vista."
      contentClassName="flex flex-col gap-4 sm:gap-5 h-full"
    >
      <nav 
        className="shrink-0 w-full sm:w-fit" 
        aria-label="Navegación de vistas de ventas"
      >
        <VentasSwitch
          activeOption={activeOption}
          onOptionChange={handleOptionChange}
        />
      </nav>

      <main 
        role="tabpanel" 
        aria-labelledby={`tab-${activeOption}`}
        className="flex-1 flex flex-col min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded-xl"
        tabIndex={-1}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeOption}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col min-h-0 w-full"
          >
            {activeOption === "empleados" ? <AdminVentasE /> : <AdminVentasO />}
          </motion.div>
        </AnimatePresence>
      </main>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="colored"
        limit={3}
        toastClassName="rounded-xl shadow-lg font-sans text-sm"
      />
    </AdminLayout>
  );
};

export default OpcionesVentas;