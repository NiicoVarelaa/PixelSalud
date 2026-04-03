import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";

const INITIAL_FORM = {
  nombreCliente: "",
  apellidoCliente: "",
  email: "",
  contraCliente: "",
};

const normalizeApiBaseUrl = (rawUrl) => {
  const sanitized = (rawUrl || "http://localhost:5000/api").replace(/\/$/, "");
  return /\/api$/i.test(sanitized) ? sanitized : `${sanitized}/api`;
};

const getApiErrorMessage = (error) => {
  const responseData = error?.response?.data;

  if (responseData?.errors && Array.isArray(responseData.errors)) {
    const first = responseData.errors[0];

    if (first?.field && first?.message) {
      return `${first.field}: ${first.message}`;
    }

    if (first?.message) {
      return first.message;
    }
  }

  const rawMessage =
    responseData?.message ||
    responseData?.mensaje ||
    responseData?.error ||
    "No pudimos crear tu cuenta. Intenta nuevamente en unos segundos.";

  if (
    /duplicate|duplicado|ya existe|already exists|ER_DUP_ENTRY/i.test(
      rawMessage,
    )
  ) {
    return "Ese email o DNI ya está registrado. Probá iniciar sesión o recuperar contraseña.";
  }

  if (/validaci[oó]n|validation/i.test(rawMessage)) {
    return "Revisá los datos ingresados. Hay campos con formato inválido.";
  }

  return rawMessage;
};

const useRegistroForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const loginUser = useAuthStore((state) => state.loginUser);

  const googleAuthUrl = useMemo(() => {
    const apiBaseUrl = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_GOOGLE_AUTH_URL || `${apiBaseUrl}/google-auth`;
  }, []);

  const navigateByRole = useCallback(
    (data) => {
      const rol = (data?.rol || "").toString().toLowerCase();

      if (rol === "empleado") {
        navigate("/panelempleados");
        return;
      }

      if (rol === "admin") {
        navigate("/admin");
        return;
      }

      if (rol === "medico") {
        navigate("/panelMedico");
        return;
      }

      navigate("/");
    },
    [navigate],
  );

  const validateForm = useCallback(() => {
    const nombre = form.nombreCliente.trim();
    const apellido = form.apellidoCliente.trim();
    const email = form.email.trim();
    const password = form.contraCliente;

    if (!nombre || !apellido || !email || !password) {
      return "Completá todos los campos para crear tu cuenta.";
    }

    if (nombre.length < 2 || apellido.length < 2) {
      return "Nombre y apellido deben tener al menos 2 caracteres.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Ingresá un correo electrónico válido.";
    }

    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return null;
  }, [form]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const goToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const validationError = validateForm();
      if (validationError) {
        toast.warning(validationError);
        return;
      }

      setIsSubmitting(true);

      const dataToSend = {
        nombreCliente: form.nombreCliente.trim(),
        apellidoCliente: form.apellidoCliente.trim(),
        emailCliente: form.email.toLowerCase().trim(),
        contraCliente: form.contraCliente,
      };

      try {
        const registerResponse = await apiClient.post(
          "/registroCliente",
          dataToSend,
        );
        const loginResponse = await apiClient.post("/login", {
          email: dataToSend.emailCliente,
          contrasenia: dataToSend.contraCliente,
        });

        const authData = loginResponse.data || {};
        if (!authData?.token || !authData?.rol) {
          throw new Error(
            "No se pudo completar el inicio de sesión automático.",
          );
        }

        loginUser(authData);

        toast.success(
          registerResponse?.data?.mensaje ||
            "Cuenta creada con éxito. Ya iniciamos tu sesión.",
        );

        setForm(INITIAL_FORM);

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
    [form, loginUser, navigateByRole, validateForm],
  );

  const handleGoogleRegister = useCallback(() => {
    if (!googleAuthUrl || !/^https?:\/\//.test(googleAuthUrl)) {
      toast.info(
        "El acceso con Google aún no está configurado en este entorno.",
      );
      return;
    }

    window.location.href = googleAuthUrl;
  }, [googleAuthUrl]);

  return {
    form,
    isSubmitting,
    showPassword,
    handleChange,
    togglePassword,
    handleSubmit,
    handleGoogleRegister,
    goToLogin,
  };
};

export default useRegistroForm;
