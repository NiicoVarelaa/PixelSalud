import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, AlertCircle } from "lucide-react";
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
  cuponEditar = null,
}) => {
  const closeRef = useRef(null);
  const [segmentoFiltro, setSegmentoFiltro] = useState("todos");
  const [formData, setFormData] = useState(() => {
    if (cuponEditar) {
      return {
        codigo: cuponEditar.codigo || "",
        tipoCupon: cuponEditar.tipoCupon || "porcentaje",
        valorDescuento: cuponEditar.valorDescuento || "",
        descripcion: cuponEditar.descripcion || "",
        fechaInicio: cuponEditar.fechaInicio ? cuponEditar.fechaInicio.split("T")[0] : "",
        fechaVencimiento: cuponEditar.fechaVencimiento ? cuponEditar.fechaVencimiento.split("T")[0] : "",
        usoMaximo: cuponEditar.usoMaximo || "",
        tipoUsuario: cuponEditar.tipoUsuario || "todos",
        montoMinimo: cuponEditar.montoMinimo || "",
        enviarPorMail: false,
        destinatarios: [],
      };
    }
    return createInitialCuponFormData();
  });
  const prevDestinatariosRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const resetForm = useCallback(() => {
    setSegmentoFiltro("todos");
    if (cuponEditar) {
      setFormData({
        codigo: cuponEditar.codigo || "",
        tipoCupon: cuponEditar.tipoCupon || "porcentaje",
        valorDescuento: cuponEditar.valorDescuento || "",
        descripcion: cuponEditar.descripcion || "",
        fechaInicio: cuponEditar.fechaInicio ? cuponEditar.fechaInicio.split("T")[0] : "",
        fechaVencimiento: cuponEditar.fechaVencimiento ? cuponEditar.fechaVencimiento.split("T")[0] : "",
        usoMaximo: cuponEditar.usoMaximo || "",
        tipoUsuario: cuponEditar.tipoUsuario || "todos",
        montoMinimo: cuponEditar.montoMinimo || "",
        enviarPorMail: false,
        destinatarios: [],
      });
    } else {
      setFormData(createInitialCuponFormData());
    }
    setErrors({});
    setTouched({});
    prevDestinatariosRef.current = null;
  }, [cuponEditar]);

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

  useEffect(() => {
    if (cuponEditar) {
      setFormData({
        codigo: cuponEditar.codigo || "",
        tipoCupon: cuponEditar.tipoCupon || "porcentaje",
        valorDescuento: cuponEditar.valorDescuento || "",
        descripcion: cuponEditar.descripcion || "",
        fechaInicio: cuponEditar.fechaInicio ? cuponEditar.fechaInicio.split("T")[0] : "",
        fechaVencimiento: cuponEditar.fechaVencimiento ? cuponEditar.fechaVencimiento.split("T")[0] : "",
        usoMaximo: cuponEditar.usoMaximo || "",
        tipoUsuario: cuponEditar.tipoUsuario || "todos",
        montoMinimo: cuponEditar.montoMinimo || "",
        enviarPorMail: false,
        destinatarios: [],
      });
    } else {
      setFormData(createInitialCuponFormData());
    }
    setErrors({});
    setTouched({});
    setSegmentoFiltro("todos");
    prevDestinatariosRef.current = null;
  }, [cuponEditar, isOpen]);

  const validateField = useCallback((key, value) => {
    switch (key) {
      case "codigo":
        return !value.trim() ? "El codigo es obligatorio" : "";
      case "tipoCupon":
        return !value ? "El tipo de descuento es obligatorio" : "";
      case "valorDescuento":
        if (!value) return "El valor es obligatorio";
        if (parseFloat(value) <= 0) return "Debe ser mayor a 0";
        if (formData.tipoCupon === "porcentaje" && parseFloat(value) > 100) return "Maximo 100%";
        return "";
      case "fechaInicio":
        if (!value) return "La fecha de inicio es obligatoria";
        return "";
      case "fechaVencimiento":
        if (!value) return "La fecha de vencimiento es obligatoria";
        if (formData.fechaInicio && new Date(value) <= new Date(formData.fechaInicio)) {
          return "Debe ser posterior a la fecha de inicio";
        }
        return "";
      case "destinatarios":
        if (formData.enviarPorMail && value !== "todos" && (!Array.isArray(value) || value.length === 0)) {
          return "Selecciona al menos un cliente";
        }
        return "";
      default:
        return "";
    }
  }, [formData.tipoCupon, formData.fechaInicio, formData.enviarPorMail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    const validarCampos = ["codigo", "tipoCupon", "valorDescuento", "fechaInicio", "fechaVencimiento"];
    validarCampos.forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    if (formData.enviarPorMail) {
      const err = validateField("destinatarios", formData.destinatarios);
      if (err) newErrors.destinatarios = err;
    }
    setErrors(newErrors);
    setTouched((prev) => {
      const all = { ...prev };
      validarCampos.forEach((k) => (all[k] = true));
      if (formData.enviarPorMail) all.destinatarios = true;
      return all;
    });

    if (Object.keys(newErrors).length > 0) return;

    const ok = await onSubmit(formData);
    if (ok) resetForm();
  };

  const setField = useCallback((key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => {
      const err = validateField(key, value);
      if (!err) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: err };
    });
  }, [validateField]);
  const clientesFiltrados = useMemo(
    () => filtrarClientesPorSegmento(clientes, segmentoFiltro),
    [clientes, segmentoFiltro],
  );

  useEffect(() => {
    if (!isOpen) return;
    if (formData.enviarPorMail && formData.destinatarios === "todos") {
      prevDestinatariosRef.current = clientesFiltrados.map((c) => c.idCliente);
    } else if (Array.isArray(formData.destinatarios)) {
      prevDestinatariosRef.current = formData.destinatarios;
    }
  }, [isOpen, clientesFiltrados, formData.enviarPorMail, formData.destinatarios]);

  useEffect(() => {
    if (
      !formData.enviarPorMail &&
      prevDestinatariosRef.current !== null &&
      prevDestinatariosRef.current.length > 0
    ) {
      setFormData((prev) => ({
        ...prev,
        destinatarios: prevDestinatariosRef.current,
      }));
    }
  }, [formData.enviarPorMail]);

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
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white shrink-0">
                <Tag size={17} aria-hidden="true" />
              </span>
              <div>
                <h2
                  id="cupon-modal-title"
                  className="text-base font-semibold text-gray-900"
                >
                  {cuponEditar ? "Editar cupón" : "Nuevo cupón"}
                </h2>
                <p className="text-xs text-gray-500">
                  {cuponEditar
                    ? "Modifica los datos del cupón"
                    : "Completa los datos para crear el cupón"}
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
              <X size={18} />
            </button>
          </div>

          <form
            id="form-cupon"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
          >
            <CuponModalFormSections formData={formData} setField={setField} errors={errors} touched={touched} />

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

          <CuponModalActions onClose={handleClose} esEdicion={!!cuponEditar} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
