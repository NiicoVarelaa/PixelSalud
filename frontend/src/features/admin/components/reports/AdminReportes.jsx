import { useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminLayout } from "@features/admin/components/shared";
import {
  ReportCard,
  ReportFilters,
  ReportInfo,
  ReportInfoModal,
  ReportIncludesModal,
} from "./components";
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
  const [selectedReport, setSelectedReport] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Hooks personalizados para gestión de estado y lógica
  const filterHook = useReportFilters();
  const {
    filters,
    hasActiveFilters,
    activeFiltersCount,
    activeDateRange,
    setDateRange,
    updateFilter,
    clearFilters,
    clearDateRange,
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

  const handleOpenDetails = useCallback(
    (report) => () => {
      setSelectedReport(report);
    },
    [],
  );

  const handleCloseDetails = useCallback(() => {
    setSelectedReport(null);
  }, []);

  const handleOpenInfoModal = useCallback(() => {
    setIsInfoModalOpen(true);
  }, []);

  const handleCloseInfoModal = useCallback(() => {
    setIsInfoModalOpen(false);
  }, []);

  return (
    <AdminLayout
      title="Reportes y Estadísticas"
      description="Exporta reportes de ventas y productos en formato Excel con análisis detallados"
      contentClassName="space-y-2.5 sm:space-y-3 pb-2"
      usePageScroll
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
          isOpen
          hasActiveFilters={hasActiveFilters}
          activeFiltersCount={activeFiltersCount}
          activeDateRange={activeDateRange}
          onToggle={() => {}}
          onDateRangeChange={setDateRange}
          onFilterChange={updateFilter}
          onClearDateRange={clearDateRange}
          onClear={clearFilters}
          onOpenInfo={handleOpenInfoModal}
          fixed
        />
      </motion.div>

      {/* Grid de Reportes */}
      <motion.section
        aria-labelledby="reportes-heading"
        className="space-y-2 sm:space-y-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 xl:grid-cols-4 xl:gap-3"
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
                onViewDetails={handleOpenDetails(report)}
                onDownload={handleDownloadReport(report.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.section>

      {/* Información adicional */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="lg:hidden"
      >
        <ReportInfo />
      </motion.div>

      <ReportIncludesModal
        isOpen={Boolean(selectedReport)}
        report={selectedReport}
        onClose={handleCloseDetails}
      />

      <ReportInfoModal
        isOpen={isInfoModalOpen}
        onClose={handleCloseInfoModal}
      />
    </AdminLayout>
  );
};

export default AdminReportes;
