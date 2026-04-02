import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@store/useAuthStore";
import {
  EDITABLE_KEYS,
  normalizarFechaInput,
} from "@features/customer/components/profile/perfil/perfilConfig";

const getInitialFormData = () => ({
  nombreCliente: "",
  apellidoCliente: "",
  emailCliente: "",
  telefono: "",
  dni: "",
  fechaNacimiento: "",
  contraCliente: "",
  confirmarContraCliente: "",
});

const usePerfilForm = () => {
  const { user, token } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [initialSnapshot, setInitialSnapshot] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      if (!user?.id) {
        setErrorMsg("No hay usuario logueado.");
        setFetchLoading(false);
        return;
      }

      setFetchLoading(true);
      try {
        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/clientes/${user.id}`, {
          headers: { auth: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("No se pudo obtener el perfil");

        const data = await res.json();
        if (!data || !Object.keys(data).length) {
          setErrorMsg("No se encontraron datos del usuario.");
          return;
        }

        const normalizedData = {
          nombreCliente: data.nombreCliente || "",
          apellidoCliente: data.apellidoCliente || "",
          emailCliente: data.emailCliente || "",
          telefono: data.telefono || "",
          dni: data.dni || "",
          fechaNacimiento: normalizarFechaInput(data.fechaNacimiento),
          contraCliente: "",
          confirmarContraCliente: "",
        };

        setFormData(normalizedData);
        setInitialSnapshot({
          nombreCliente: normalizedData.nombreCliente,
          apellidoCliente: normalizedData.apellidoCliente,
          telefono: normalizedData.telefono,
          dni: normalizedData.dni,
          fechaNacimiento: normalizedData.fechaNacimiento,
        });
      } catch {
        setErrorMsg("Error al cargar el perfil. Intenta de nuevo mas tarde.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCliente();
  }, [token, user?.id]);

  useEffect(() => {
    if (!successMsg) return;
    const t = setTimeout(() => setSuccessMsg(""), 4000);
    return () => clearTimeout(t);
  }, [successMsg]);

  const hasChanges = useMemo(
    () =>
      Boolean(formData.contraCliente) ||
      EDITABLE_KEYS.some(
        (key) => (formData[key] || "") !== (initialSnapshot?.[key] || ""),
      ),
    [formData, initialSnapshot],
  );

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === "emailCliente") return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const openEdit = useCallback(() => {
    setErrorMsg("");
    setSuccessMsg("");
    setIsEditing(true);
  }, []);

  const cancelEdit = useCallback(() => {
    if (hasChanges && !loading) {
      const confirmarSalida = window.confirm(
        "Tenes cambios sin guardar. Queres descartarlos?",
      );
      if (!confirmarSalida) return false;
    }

    setFormData((prev) => ({
      ...prev,
      contraCliente: "",
      confirmarContraCliente: "",
    }));
    setIsEditing(false);
    setErrorMsg("");
    setSuccessMsg("");
    return true;
  }, [hasChanges, loading]);

  const submitForm = useCallback(
    async (e) => {
      e.preventDefault();
      if (!hasChanges) {
        setSuccessMsg("No hay cambios para guardar.");
        return false;
      }

      setLoading(true);
      setSuccessMsg("");
      setErrorMsg("");

      try {
        if (formData.contraCliente && formData.contraCliente.length < 6) {
          throw new Error(
            "La nueva contrasena debe tener al menos 6 caracteres",
          );
        }

        if (formData.contraCliente !== formData.confirmarContraCliente) {
          throw new Error("La confirmacion de contrasena no coincide");
        }

        if (formData.fechaNacimiento) {
          const hoy = new Date().toISOString().slice(0, 10);
          if (formData.fechaNacimiento > hoy) {
            throw new Error("La fecha de nacimiento no puede ser futura");
          }
        }

        const body = {};
        for (const key of EDITABLE_KEYS) {
          const valorActual = formData[key] ?? "";
          const valorInicial = initialSnapshot?.[key] ?? "";

          if (key === "fechaNacimiento") {
            if (valorActual !== valorInicial) {
              body[key] = valorActual || null;
            }
            continue;
          }

          if (valorActual !== "" && valorActual !== valorInicial) {
            body[key] = valorActual;
          }
        }

        if (formData.contraCliente) {
          body.contraCliente = formData.contraCliente;
        }

        const apiUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/clientes/actualizar/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            auth: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error al actualizar");

        setSuccessMsg("Perfil actualizado con exito");
        setIsEditing(false);

        setFormData((prev) => {
          const nextData = {
            ...prev,
            contraCliente: "",
            confirmarContraCliente: "",
          };

          setInitialSnapshot(
            Object.fromEntries(
              EDITABLE_KEYS.map((key) => [key, nextData[key] || ""]),
            ),
          );

          return nextData;
        });

        return true;
      } catch (err) {
        setErrorMsg(err.message || "Error al actualizar. Intenta de nuevo.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [formData, hasChanges, initialSnapshot, token, user?.id],
  );

  return {
    user,
    isEditing,
    formData,
    loading,
    fetchLoading,
    successMsg,
    errorMsg,
    hasChanges,
    setIsEditing,
    setErrorMsg,
    setSuccessMsg,
    handleInputChange,
    openEdit,
    cancelEdit,
    submitForm,
  };
};

export default usePerfilForm;
