import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";
import {
  getNewsletterStorageKey,
  normalizeEmail,
} from "../utils/footer.helpers";

const useFooterNewsletter = ({ user }) => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aceptaMarketing, setAceptaMarketing] = useState(false);

  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const currentEmail = normalizeEmail(user?.email);
    if (currentEmail) {
      setEmail(currentEmail);
    }
  }, [user]);

  useEffect(() => {
    if (!normalizedEmail) {
      setIsSubscribed(false);
      return;
    }

    const key = getNewsletterStorageKey(normalizedEmail);
    const isAlreadySubscribed = localStorage.getItem(key) === "true";
    setIsSubscribed(isAlreadySubscribed);
  }, [normalizedEmail]);

  const handleSubscribe = useCallback(
    async (event) => {
      event.preventDefault();

      if (!normalizedEmail) {
        toast.error("Por favor, ingresa un email válido.");
        return;
      }

      if (!aceptaMarketing) {
        toast.error("Debes aceptar recibir comunicaciones comerciales.");
        return;
      }

      if (isSubscribed) {
        toast.info("Este email ya está suscrito.");
        return;
      }

      const idCliente = Number(user?.id) || undefined;
      const nombre = user?.nombre || user?.nombreCliente || undefined;

      try {
        setIsSubmitting(true);

        const payload = {
          email: normalizedEmail,
          nombre,
          aceptaMarketing: true,
          fuente: "footer",
        };

        if (idCliente) {
          payload.idCliente = idCliente;
        }

        await apiClient.post("/newsletter/suscripciones", payload);

        localStorage.setItem(getNewsletterStorageKey(normalizedEmail), "true");
        setIsSubscribed(true);
        toast.success("¡Gracias por suscribirte a nuestras ofertas!");
      } catch (error) {
        if (error?.response?.status === 409) {
          localStorage.setItem(
            getNewsletterStorageKey(normalizedEmail),
            "true",
          );
          setIsSubscribed(true);
          toast.info("Este email ya está suscrito a novedades.");
        } else {
          toast.error(
            "No pudimos registrar tu suscripción. Intenta nuevamente.",
          );
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [aceptaMarketing, isSubscribed, normalizedEmail, user],
  );

  const inputDisabled = isSubscribed || isSubmitting;
  const buttonDisabled =
    isSubscribed || isSubmitting || !normalizedEmail || !aceptaMarketing;

  return {
    email,
    isSubscribed,
    isSubmitting,
    aceptaMarketing,
    inputDisabled,
    buttonDisabled,
    currentYear,
    setEmail,
    setAceptaMarketing,
    handleSubscribe,
  };
};

export default useFooterNewsletter;
