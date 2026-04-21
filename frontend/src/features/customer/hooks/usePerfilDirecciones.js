import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@store/useAuthStore";
import {
  ARGENTINA,
  inicialForm,
  MAX_DIRECCIONES,
} from "@features/customer/components/profile/direcciones/direccionesConfig";

const usePerfilDirecciones = () => {
  const { user, token } = useAuthStore();
  const userId = user?.id;

  const [direcciones, setDirecciones] = useState([]);
  const [form, setForm] = useState(inicialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const cupoCompleto = direcciones.length >= MAX_DIRECCIONES;
  const modoEdicion = editandoId !== null;
  const isFormVisible = mostrarFormulario || modoEdicion;

  const contador = useMemo(
    () => `${direcciones.length}/${MAX_DIRECCIONES} direcciones`,
    [direcciones.length],
  );

  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    [],
  );

  const onChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      if (error) setError("");
    },
    [error],
  );

  const cargarDirecciones = useCallback(async () => {
    if (!userId || !token) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${apiUrl}/clientes/${userId}/direcciones`, {
        headers: { auth: `Bearer ${token}` },
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(
          data?.error || data?.msg || "No se pudieron cargar las direcciones",
        );
      }

      const data = await response.json();
      setDirecciones(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar las direcciones");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, token, userId]);

  useEffect(() => {
    cargarDirecciones();
  }, [cargarDirecciones]);

  const validarFormulario = useCallback(() => {
    if (!modoEdicion && cupoCompleto) {
      return `Solo podes guardar hasta ${MAX_DIRECCIONES} direcciones.`;
    }

    if (!form.alias.trim() || !form.calle.trim() || !form.numero.trim()) {
      return "Completa alias, calle y numero.";
    }

    if (
      !form.localidad.trim() ||
      !form.provincia.trim() ||
      !form.codigoPostal.trim()
    ) {
      return "Completa localidad, provincia y codigo postal.";
    }

    if (!/^\d{4}$/.test(form.codigoPostal.trim())) {
      return "El codigo postal de Argentina debe tener 4 digitos.";
    }

    return "";
  }, [cupoCompleto, form, modoEdicion]);

  const onSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const mensajeError = validarFormulario();
      if (mensajeError) {
        setError(mensajeError);
        return;
      }

      const payload = {
        pais: ARGENTINA,
        alias: form.alias.trim(),
        calle: form.calle.trim(),
        numero: form.numero.trim(),
        piso: form.piso.trim(),
        departamento: form.departamento.trim(),
        localidad: form.localidad.trim(),
        provincia: form.provincia.trim(),
        codigoPostal: form.codigoPostal.trim(),
        referencias: form.referencias.trim(),
      };

      setGuardando(true);
      setError("");

      try {
        const endpoint = modoEdicion
          ? `${apiUrl}/clientes/${userId}/direcciones/${editandoId}`
          : `${apiUrl}/clientes/${userId}/direcciones`;
        const method = modoEdicion ? "PUT" : "POST";

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            auth: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            data?.error || data?.msg || "No se pudo guardar la direccion",
          );
        }

        setForm(inicialForm);
        setEditandoId(null);
        setMostrarFormulario(false);
        await cargarDirecciones();
      } catch (err) {
        setError(err.message || "No se pudo guardar la direccion");
      } finally {
        setGuardando(false);
      }
    },
    [
      apiUrl,
      cargarDirecciones,
      editandoId,
      form,
      modoEdicion,
      token,
      userId,
      validarFormulario,
    ],
  );

  const iniciarEdicion = useCallback((direccion) => {
    setEditandoId(direccion.idDireccion);
    setMostrarFormulario(true);
    setForm({
      alias: direccion.alias || "",
      calle: direccion.calle || "",
      numero: direccion.numero || "",
      piso: direccion.piso || "",
      departamento: direccion.departamento || "",
      localidad: direccion.localidad || "",
      provincia: direccion.provincia || "",
      codigoPostal: direccion.codigoPostal || "",
      referencias: direccion.referencias || "",
    });
    setError("");
  }, []);

  const cancelarEdicion = useCallback(() => {
    setEditandoId(null);
    setForm(inicialForm);
    setMostrarFormulario(false);
    setError("");
  }, []);

  const toggleFormularioNuevaDireccion = useCallback(() => {
    if (cupoCompleto) {
      setError(`Solo podes guardar hasta ${MAX_DIRECCIONES} direcciones.`);
      return;
    }

    setEditandoId(null);
    setForm(inicialForm);
    setError("");
    setMostrarFormulario((prev) => !prev);
  }, [cupoCompleto]);

  const marcarPredeterminada = useCallback(
    async (idDireccion) => {
      setError("");
      try {
        const response = await fetch(
          `${apiUrl}/clientes/${userId}/direcciones/${idDireccion}/predeterminada`,
          {
            method: "PUT",
            headers: { auth: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            data?.error || data?.msg || "No se pudo marcar como predeterminada",
          );
        }

        await cargarDirecciones();
      } catch (err) {
        setError(err.message || "No se pudo marcar como predeterminada");
      }
    },
    [apiUrl, cargarDirecciones, token, userId],
  );

  const eliminarDireccion = useCallback(
    async (idDireccion) => {
      setError("");
      try {
        const response = await fetch(
          `${apiUrl}/clientes/${userId}/direcciones/${idDireccion}`,
          {
            method: "DELETE",
            headers: { auth: `Bearer ${token}` },
          },
        );

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(
            data?.error || data?.msg || "No se pudo eliminar la direccion",
          );
        }

        await cargarDirecciones();
      } catch (err) {
        setError(err.message || "No se pudo eliminar la direccion");
      }
    },
    [apiUrl, cargarDirecciones, token, userId],
  );

  return {
    contador,
    cupoCompleto,
    direcciones,
    error,
    form,
    guardando,
    isFormVisible,
    loading,
    modoEdicion,
    mostrarFormulario,
    cancelarEdicion,
    eliminarDireccion,
    iniciarEdicion,
    marcarPredeterminada,
    onChange,
    onSubmit,
    toggleFormularioNuevaDireccion,
  };
};

export default usePerfilDirecciones;
