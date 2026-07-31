import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useModalLock } from "@hooks/useModalLock";
import { EmpleadoModalHeader } from "./EmpleadoModalHeader";
import { EmpleadoModalFormSections } from "./EmpleadoModalFormSections";
import { EmpleadoModalActions } from "./EmpleadoModalActions";

const FORM_INIT = {
  nombreEmpleado: "",
  apellidoEmpleado: "",
  dniEmpleado: "",
  emailEmpleado: "",
  contraEmpleado: "",
  permisos: {
    crear_productos: false,
    modificar_productos: false,
    modificar_ventasE: false,
    ver_ventasTotalesE: false,
  },
};

export const EmpleadoModal = ({
  isOpen,
  onClose,
  onGuardar,
  empleadoEditar = null,
}) => {
  const esEdicion = !!empleadoEditar;
  const closeRef = useRef(null);

  const [formData, setFormData] = useState(FORM_INIT);
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  useModalLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (empleadoEditar) {
      setFormData({
        nombreEmpleado: empleadoEditar.nombreEmpleado || "",
        apellidoEmpleado: empleadoEditar.apellidoEmpleado || "",
        dniEmpleado: empleadoEditar.dniEmpleado || "",
        emailEmpleado: empleadoEditar.emailEmpleado || "",
        contraEmpleado: "",
        permisos: {
          crear_productos:
            empleadoEditar.crear_productos === 1 ||
            empleadoEditar.crear_productos === true,
          modificar_productos:
            empleadoEditar.modificar_productos === 1 ||
            empleadoEditar.modificar_productos === true,
          modificar_ventasE:
            empleadoEditar.modificar_ventasE === 1 ||
            empleadoEditar.modificar_ventasE === true,
          ver_ventasTotalesE:
            empleadoEditar.ver_ventasTotalesE === 1 ||
            empleadoEditar.ver_ventasTotalesE === true,
        },
      });
    } else {
      setFormData(FORM_INIT);
    }
    setErrores({});
  }, [empleadoEditar, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePermisoChange = (permiso, checked) =>
    setFormData((prev) => ({
      ...prev,
      permisos: { ...prev.permisos, [permiso]: checked },
    }));

  const validar = () => {
    const e = {};
    if (!formData.nombreEmpleado.trim())
      e.nombreEmpleado = "El nombre es obligatorio";
    if (!formData.apellidoEmpleado.trim())
      e.apellidoEmpleado = "El apellido es obligatorio";
    if (!String(formData.dniEmpleado || "").trim()) e.dniEmpleado = "El DNI es obligatorio";
    if (!formData.emailEmpleado.trim())
      e.emailEmpleado = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailEmpleado))
      e.emailEmpleado = "Email inválido";
    if (!esEdicion && !formData.contraEmpleado.trim())
      e.contraEmpleado = "La contraseña es obligatoria";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setEnviando(true);
    const ok = await onGuardar(formData, empleadoEditar?.idEmpleado);
    setEnviando(false);
    if (ok) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="empleado-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
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
            className="relative flex w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-2xl sm:rounded-2xl max-h-[92vh]"
          >
            <EmpleadoModalHeader
              esEdicion={esEdicion}
              closeRef={closeRef}
              onClose={onClose}
              enviando={enviando}
            />

            <form
              id="form-empleado"
              onSubmit={handleSubmit}
              noValidate
              className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
            >
              <EmpleadoModalFormSections
                esEdicion={esEdicion}
                formData={formData}
                errores={errores}
                onChange={handleChange}
                onPermisoChange={handlePermisoChange}
              />
            </form>

            <EmpleadoModalActions
              enviando={enviando}
              esEdicion={esEdicion}
              onClose={onClose}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
