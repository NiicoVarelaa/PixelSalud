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

const AdminReportes = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

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

  const reports = useMemo(() => REPORTS_CONFIG, []);

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
      contentClassName="flex h-full min-h-0 flex-col gap-2.5 sm:gap-3"
    >
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

      <div className="min-h-0 flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
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

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="mt-3 lg:hidden"
        >
          <ReportInfo />
        </motion.div>
      </div>

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
