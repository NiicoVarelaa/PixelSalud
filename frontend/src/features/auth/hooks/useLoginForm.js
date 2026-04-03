import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";

const decodeOAuthPayload = (payload) => {
  const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const decoded = new TextDecoder().decode(bytes);
  return JSON.parse(decoded);
};

const useLoginForm = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginUser } = useAuthStore();

  const navigateByRole = useCallback(
    (data) => {
      const rol = (data.rol || "").toString().toLowerCase();

      if (rol === "cliente") {
        navigate("/");
      } else if (rol === "empleado") {
        navigate("/panelempleados");
      } else if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "medico") {
        navigate("/panelMedico");
      } else {
        navigate("/");
      }
    },
    [navigate],
  );

  useEffect(() => {
    const oauthError = searchParams.get("oauth_error");
    const oauthPayload = searchParams.get("oauth");

    if (oauthError) {
      toast.error(oauthError);
      navigate("/login", { replace: true });
      return;
    }

    if (!oauthPayload) return;

    try {
      const data = decodeOAuthPayload(oauthPayload);

      if (!data?.token || !data?.rol) {
        throw new Error("Datos incompletos");
      }

      loginUser(data);
      toast.success("Ingreso con Google exitoso");
      navigateByRole(data);
    } catch {
      toast.error("No se pudo procesar el acceso con Google");
      navigate("/login", { replace: true });
    }
  }, [searchParams, loginUser, navigateByRole, navigate]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }, []);

  const togglePassword = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      setIsSubmitting(true);

      try {
        const response = await apiClient.post("/login", {
          email: user.email.toLowerCase().trim(),
          contrasenia: user.password,
        });

        const data = response.data || {};

        if (!data.rol || !data.token) {
          toast.warn("No se pudo obtener la sesión completa (rol o token).");
          return;
        }

        loginUser(data);

        const nombreCapitalizado =
          (data.nombre?.charAt(0)?.toUpperCase() || "") +
          (data.nombre?.slice(1) || "");
        toast.success(`¡Bienvenido, ${nombreCapitalizado}!`);

        navigateByRole(data);
      } catch (error) {
        const serverMsg =
          error.response?.data?.msg ||
          error.response?.data?.mensaje ||
          error.response?.data?.error ||
          null;

        if (serverMsg) {
          toast.error(serverMsg);
        } else {
          toast.error("Error al conectar con el servidor.");
        }

        console.error("Login error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [loginUser, navigateByRole, user.email, user.password],
  );

  return {
    user,
    isSubmitting,
    showPassword,
    handleInputChange,
    handleSubmit,
    togglePassword,
    goHome: () => navigate("/"),
  };
};

export default useLoginForm;
