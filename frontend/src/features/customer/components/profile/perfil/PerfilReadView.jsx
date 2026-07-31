import { AnimatePresence, motion } from "framer-motion";
import { User, Mail, IdCard, Phone, CalendarDays } from "lucide-react";
import PerfilInfoRow from "./PerfilInfoRow";
import PerfilToast from "./PerfilToast";

const PerfilReadView = ({ formData, successMsg }) => {
  return (
    <motion.div
      key="view"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      aria-label="Datos del perfil"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <PerfilInfoRow
          icon={User}
          label="Nombre"
          value={`${formData.nombreCliente} ${formData.apellidoCliente}`.trim()}
        />
        <PerfilInfoRow
          icon={Mail}
          label="Correo electrónico"
          value={formData.emailCliente}
        />
        <PerfilInfoRow icon={IdCard} label="DNI" value={formData.dni} />
        <PerfilInfoRow
          icon={Phone}
          label="Teléfono"
          value={formData.telefono}
        />
        <PerfilInfoRow
          icon={CalendarDays}
          label="Fecha de nacimiento"
          value={formData.fechaNacimiento || "Sin cargar"}
        />
      </div>

      <AnimatePresence>
        {successMsg && (
          <div className="mt-4">
            <PerfilToast msg={successMsg} type="success" />
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PerfilReadView;
