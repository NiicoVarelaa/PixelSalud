import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "@features/public/components/navigation/Header";
import Footer from "@features/public/components/footer/Footer";
import { useAuthStore } from "@store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { sucursalesData } from "@data/sucursalesData";
import {
  CONTACTO_CARD_ENTER,
  CONTACTO_MAP_URL,
  ContactoAuthRequiredModal,
  ContactoBranchesSection,
  ContactoFormSection,
  ContactoHero,
  TIPOS_CONSULTA_OPTIONS,
  TIPOS_REQUIEREN_LOGIN,
  useContactoForm,
} from "./contactoPage";

const Contacto = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [authRequiredReason, setAuthRequiredReason] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const navigate = useNavigate();

  const closeAuthModal = useCallback(() => {
    setShowModal(false);
    setAuthRequiredReason("");
  }, []);

  const openAuthModal = useCallback((reason) => {
    setAuthRequiredReason(reason);
    setShowModal(true);
  }, []);

  const { errors, formData, handleChange, handleSubmit, isSubmitting, userId } =
    useContactoForm({
      user,
      apiUrl,
      onAuthRequired: openAuthModal,
      onValidationError: () =>
        toast.error("Por favor corrige los errores en el formulario"),
      onSubmitSuccess: () => toast.success("¡Mensaje enviado correctamente!"),
      onSubmitError: () =>
        toast.error("No se pudo enviar el mensaje. Inténtalo de nuevo."),
    });

  const showLoginWarning = useMemo(
    () => !userId && TIPOS_REQUIEREN_LOGIN.has(formData.tipoConsulta),
    [formData.tipoConsulta, userId],
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="my-12 w-full max-w-7xl mx-auto lg:px-8">
        <ContactoHero cardEnter={CONTACTO_CARD_ENTER} />

        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12 lg:items-stretch">
          <ContactoFormSection
            cardEnter={CONTACTO_CARD_ENTER}
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            showLoginWarning={showLoginWarning}
            tipoConsultaOptions={TIPOS_CONSULTA_OPTIONS}
          />

          <ContactoBranchesSection
            cardEnter={CONTACTO_CARD_ENTER}
            sucursales={sucursalesData}
            mapUrl={CONTACTO_MAP_URL}
          />
        </div>
      </main>
      <Footer />
      <ContactoAuthRequiredModal
        isOpen={showModal}
        reason={authRequiredReason}
        onClose={closeAuthModal}
        onLogin={() => navigate("/login")}
        onRegister={() => navigate("/registro")}
      />
    </div>
  );
};

export default Contacto;
