import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  getInitialContactoForm,
  LABELS_TIPO_CONSULTA,
  TIPOS_REQUIEREN_LOGIN,
} from "../constants";
import { validateContactoForm } from "../utils/validation";

export const useContactoForm = ({
  user,
  apiUrl,
  onAuthRequired,
  onValidationError,
  onSubmitSuccess,
  onSubmitError,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(() => getInitialContactoForm(user));

  const userId = useMemo(() => user?.idCliente || user?.id || null, [user]);

  useEffect(() => {
    setFormData(getInitialContactoForm(user));
    setErrors({});
  }, [user]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      return { ...prev, [name]: "" };
    });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const requiresLogin = TIPOS_REQUIEREN_LOGIN.has(formData.tipoConsulta);
      if (!userId && requiresLogin) {
        const reason =
          LABELS_TIPO_CONSULTA[formData.tipoConsulta] || "esta consulta";
        onAuthRequired?.(reason);
        return;
      }

      const { errors: nextErrors, hasErrors } = validateContactoForm(formData);
      if (hasErrors) {
        setErrors(nextErrors);
        onValidationError?.();
        return;
      }

      setErrors({});
      setIsSubmitting(true);

      try {
        await axios.post(`${apiUrl}/mensajes/crear`, {
          ...(userId ? { idCliente: userId } : {}),
          nombre: formData.nombre.trim(),
          email: formData.email.trim(),
          tipoConsulta: formData.tipoConsulta,
          asunto: formData.asunto.trim(),
          mensaje: formData.mensaje.trim(),
        });

        setFormData(getInitialContactoForm(user));
        onSubmitSuccess?.();
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
        onSubmitError?.();
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      apiUrl,
      formData,
      onAuthRequired,
      onSubmitError,
      onSubmitSuccess,
      onValidationError,
      user,
      userId,
    ],
  );

  return {
    errors,
    formData,
    isSubmitting,
    userId,
    handleChange,
    handleSubmit,
  };
};
