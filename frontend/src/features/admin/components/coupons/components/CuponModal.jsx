import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag } from "lucide-react";
import { CuponModalFormSections } from "./CuponModalFormSections";
import { CuponModalEmailSection } from "./CuponModalEmailSection";
import { CuponModalActions } from "./CuponModalActions";
import {
  createInitialCuponFormData,
  filtrarClientesPorSegmento,
} from "../utils/CuponModal.utils";

export const CuponModal = ({
  isOpen,
  onClose,
  onSubmit,
  clientes = [],
  cargandoClientes = false,
}) => {
  const closeRef = useRef(null);
  const [segmentoFiltro, setSegmentoFiltro] = useState("todos");
  const [formData, setFormData] = useState(createInitialCuponFormData);

  const resetForm = useCallback(() => {
    setSegmentoFiltro("todos");
    setFormData(createInitialCuponFormData());
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await onSubmit(formData);
    if (ok) resetForm();
  };

  const setField = (key, value) =>
    setFormData((prev) => ({ ...prev, [key]: value }));
  const clientesFiltrados = useMemo(
    () => filtrarClientesPorSegmento(clientes, segmentoFiltro),
    [clientes, segmentoFiltro],
  );

  const seleccionarSegmento = () => {
    const ids = clientesFiltrados.map((c) => c.idCliente);
    const actuales = Array.isArray(formData.destinatarios)
      ? formData.destinatarios
      : [];
    setField("destinatarios", Array.from(new Set([...actuales, ...ids])));
  };

  const limpiarSeleccion = () => setField("destinatarios", []);

  const toggleDestinatario = (id, checked) => {
    const current = Array.isArray(formData.destinatarios)
      ? formData.destinatarios
      : [];
    setField(
      "destinatarios",
      checked ? [...current, id] : current.filter((x) => x !== id),
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cupon-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-xl sm:rounded-2xl max-h-[92vh]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <Tag size={17} className="text-green-700" aria-hidden="true" />
              </div>
              <div>
                <h2
                  id="cupon-modal-title"
                  className="text-sm font-semibold text-gray-900 leading-none"
                >
                  Crear cupón
                </h2>
                <p className="mt-0.5 text-xs text-gray-500">
                  Completá los datos del nuevo cupón
                </p>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={handleClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
              aria-label="Cerrar modal"
            >
              <X size={17} />
            </button>
          </div>

          <form
            id="form-cupon"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
          >
            <CuponModalFormSections formData={formData} setField={setField} />

            <CuponModalEmailSection
              formData={formData}
              setField={setField}
              segmentoFiltro={segmentoFiltro}
              setSegmentoFiltro={setSegmentoFiltro}
              seleccionarSegmento={seleccionarSegmento}
              limpiarSeleccion={limpiarSeleccion}
              clientesFiltrados={clientesFiltrados}
              cargandoClientes={cargandoClientes}
              toggleDestinatario={toggleDestinatario}
            />
          </form>

          <CuponModalActions onClose={handleClose} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
