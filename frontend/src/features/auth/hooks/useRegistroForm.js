import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";
import { registroSchema } from "@features/auth/schemas/authSchemas";
import { normalizeApiBaseUrl } from "@utils/normalizeApiBaseUrl";

const getApiErrorMessage = (error) => {
  const responseData = error?.response?.data;

  if (responseData?.errors && Array.isArray(responseData.errors)) {
    const first = responseData.errors[0];
    if (first?.field && first?.message) return `${first.field}: ${first.message}`;
    if (first?.message) return first.message;
  }

  const rawMessage =
    responseData?.message ||
    responseData?.mensaje ||
    responseData?.error ||
    "No pudimos crear tu cuenta. Intenta nuevamente en unos segundos.";

  if (/duplicate|duplicado|ya existe|already exists|ER_DUP_ENTRY/i.test(rawMessage)) {
    return "Ese email o DNI ya está registrado. Probá iniciar sesión o recuperar contraseña.";
  }

  if (/validaci[oó]n|validation/i.test(rawMessage)) {
    return "Revisá los datos ingresados. Hay campos con formato inválido.";
  }

  return rawMessage;
};

const useRegistroForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.loginUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      nombreCliente: "",
      apellidoCliente: "",
      email: "",
      contraCliente: "",
    },
  });

  const googleAuthUrl = useMemo(() => {
    const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_GOOGLE_AUTH_URL || `${apiBaseUrl}/google-auth`;
  }, []);

  const navigateByRole = useCallback(
    (data) => {
      const rol = (data?.rol || "").toString().toLowerCase();
      if (rol === "empleado") navigate("/panelempleados");
      else if (rol === "admin") navigate("/admin");
      else if (rol === "medico") navigate("/panelMedico");
      else navigate("/");
    },
    [navigate],
  );

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const goToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const onSubmit = useCallback(
    async (data) => {
      setIsSubmitting(true);

      const dataToSend = {
        nombreCliente: data.nombreCliente.trim(),
        apellidoCliente: data.apellidoCliente.trim(),
        emailCliente: data.email.toLowerCase().trim(),
        contraCliente: data.contraCliente,
      };

      try {
        await apiClient.post("/registroCliente", dataToSend);
        const loginResponse = await apiClient.post("/login", {
          email: dataToSend.emailCliente,
          contrasenia: dataToSend.contraCliente,
        });

        const authData = loginResponse.data || {};
        if (!authData?.token || !authData?.rol) {
          throw new Error("No se pudo completar el inicio de sesión automático.");
        }

        loginUser(authData);
        toast.success("Cuenta creada con éxito. Ya iniciamos tu sesión.");

        setTimeout(() => {
          navigateByRole(authData);
        }, 800);
      } catch (error) {
        console.error("Error de registro:", error);
        toast.error(getApiErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginUser, navigateByRole],
  );

  const handleGoogleRegister = useCallback(() => {
    if (!googleAuthUrl || !/^https?:\/\//.test(googleAuthUrl)) {
      toast.info("El acceso con Google aún no está configurado en este entorno.");
      return;
    }
    window.location.href = googleAuthUrl;
  }, [googleAuthUrl]);

  return {
    register,
    errors,
    isSubmitting,
    showPassword,
    handleSubmit: handleSubmit(onSubmit),
    togglePassword,
    handleGoogleRegister,
    goToLogin,
  };
};

export default useRegistroForm;
