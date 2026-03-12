import { useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@features/admin/components/shared";
import { ReportCard, ReportFilters, ReportInfo } from "./components";
import { useReportDownload, useReportFilters } from "./hooks";
import { REPORTS_CONFIG } from "./constants/reportData";
import { staggerContainer, fadeInUp } from "./utils/animations";

/**
 * Componente principal de administración de reportes
 * ✅ Mobile-first design (320px → 1440px+)
 * ✅ Layout sin scroll (flex-1 h-full min-h-0)
 * ✅ Animaciones con Framer Motion
 * ✅ Accesibilidad (a11y) completa
 * ✅ Hooks personalizados memoizados
 */
const AdminReportes = () => {
  // Hooks personalizados para gestión de estado y lógica
  const filterHook = useReportFilters();
  const {
    filters,
    isOpen,
    hasActiveFilters,
    activeFiltersCount,
    setDateRange,
    updateFilter,
    clearFilters,
    toggleFilters,
  } = filterHook;

  const { downloading, downloadReport } = useReportDownload(filters);

  // Memoizar la configuración de reportes (no cambia)
  const reports = useMemo(() => REPORTS_CONFIG, []);

  /**
   * Callback memoizado para descargar un reporte específico
   * Se recrea solo si cambia downloadReport
   */
  const handleDownloadReport = useCallback(
    (reportId) => () => {
      downloadReport(reportId);
    },
    [downloadReport],
  );

  return (
    <AdminLayout
      title="Reportes y Estadísticas"
      description="Exporta reportes de ventas y productos en formato Excel con análisis detallados"
      contentClassName="space-y-3 sm:space-y-4"
    >
      {/* Toast notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Sección de Filtros */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <ReportFilters
          filters={filters}
          isOpen={isOpen}
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFiltersCount}
          onToggle={toggleFilters}
          onDateRangeChange={setDateRange}
          onFilterChange={updateFilter}
          onClear={clearFilters}
        />
      </motion.div>

      {/* Grid de Reportes */}
      <motion.section
        aria-labelledby="reportes-heading"
        className="space-y-3 sm:space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:gap-5"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <h2 id="reportes-heading" className="sr-only">
          Tipos de reportes disponibles
        </h2>

        <AnimatePresence mode="wait">
          {reports.map((report, index) => (
            <motion.div
              key={report.id}
              variants={fadeInUp}
              custom={index}
              layout
            >
              <ReportCard
                report={report}
                downloading={downloading[report.id]}
                onDownload={handleDownloadReport(report.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.section>

      {/* Información adicional */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <ReportInfo />
      </motion.div>
    </AdminLayout>
  );
};

export default AdminReportes;
