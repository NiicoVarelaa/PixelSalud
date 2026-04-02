import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@store/useAuthStore";
import { MapPin, Plus, Trash2, AlertCircle, Pencil, Check } from "lucide-react";

const MAX_DIRECCIONES = 2;
const ARGENTINA = "Argentina";

const provinciasArgentina = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Cordoba",
  "Corrientes",
  "Entre Rios",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquen",
  "Rio Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucuman",
];

const inicialForm = {
  alias: "",
  calle: "",
  numero: "",
  piso: "",
  departamento: "",
  localidad: "",
  provincia: "",
  codigoPostal: "",
  referencias: "",
};

const PerfilDirecciones = () => {
  const { user, token } = useAuthStore();
  const userId = user?.id;

  const [direcciones, setDirecciones] = useState([]);
  const [form, setForm] = useState(inicialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const cupoCompleto = direcciones.length >= MAX_DIRECCIONES;
  const modoEdicion = editandoId !== null;

  const contador = useMemo(
    () => `${direcciones.length}/${MAX_DIRECCIONES} direcciones`,
    [direcciones.length],
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const apiUrl = useMemo(
    () => import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    [],
  );

  const cargarDirecciones = useCallback(async () => {
    if (!userId || !token) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${apiUrl}/clientes/${userId}/direcciones`, {
        headers: {
          auth: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error || data?.msg || "No se pudieron cargar las direcciones",
        );
      }

      const data = await res.json();
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

  const validarFormulario = () => {
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
  };

  const onSubmit = async (e) => {
    e.preventDefault();
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
      const metodo = modoEdicion ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
          auth: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error || data?.msg || "No se pudo guardar la dirección",
        );
      }

      setForm(inicialForm);
      setEditandoId(null);
      await cargarDirecciones();
    } catch (err) {
      setError(err.message || "No se pudo guardar la dirección");
    } finally {
      setGuardando(false);
    }
  };

  const iniciarEdicion = (direccion) => {
    setEditandoId(direccion.idDireccion);
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
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setForm(inicialForm);
    setError("");
  };

  const marcarPredeterminada = async (idDireccion) => {
    setError("");
    try {
      const res = await fetch(
        `${apiUrl}/clientes/${userId}/direcciones/${idDireccion}/predeterminada`,
        {
          method: "PUT",
          headers: {
            auth: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error || data?.msg || "No se pudo marcar como predeterminada",
        );
      }

      await cargarDirecciones();
    } catch (err) {
      setError(err.message || "No se pudo marcar como predeterminada");
    }
  };

  const eliminarDireccion = async (idDireccion) => {
    setError("");
    try {
      const res = await fetch(
        `${apiUrl}/clientes/${userId}/direcciones/${idDireccion}`,
        {
          method: "DELETE",
          headers: {
            auth: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error || data?.msg || "No se pudo eliminar la dirección",
        );
      }

      await cargarDirecciones();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la dirección");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.22 }}
        className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center">
            <MapPin size={20} aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Mis Direcciones
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gestiona hasta {MAX_DIRECCIONES} direcciones de envio. Disponible
              solo para {ARGENTINA}.
            </p>
            <p className="text-xs font-semibold text-primary-700 mt-2">
              {contador}
            </p>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm"
          >
            <AlertCircle size={16} className="mt-0.5" aria-hidden="true" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-4">
        {loading ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="bg-white border border-gray-200 rounded-xl p-5 text-sm text-gray-600"
          >
            Cargando direcciones...
          </motion.div>
        ) : direcciones.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            className="bg-white border border-gray-200 rounded-xl p-5 text-sm text-gray-600"
          >
            Aun no guardaste direcciones.
          </motion.div>
        ) : (
          direcciones.map((dir, index) => (
            <motion.article
              key={dir.idDireccion}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: 0.03 * index }}
              className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-gray-900">
                      {dir.alias}
                    </h2>
                    {dir.esPredeterminada && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-0.5">
                        <Check size={12} aria-hidden="true" /> Predeterminada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {dir.calle} {dir.numero}
                    {dir.piso ? `, Piso ${dir.piso}` : ""}
                    {dir.departamento ? `, Depto ${dir.departamento}` : ""}
                  </p>
                  <p className="text-sm text-gray-700">
                    {dir.localidad}, {dir.provincia} ({dir.codigoPostal}) -{" "}
                    {dir.pais}
                  </p>
                  {dir.referencias && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ref: {dir.referencias}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!dir.esPredeterminada && (
                    <button
                      type="button"
                      onClick={() => marcarPredeterminada(dir.idDireccion)}
                      className="inline-flex items-center gap-1.5 text-xs text-primary-700 hover:text-primary-800 font-semibold cursor-pointer"
                    >
                      <Check size={14} aria-hidden="true" />
                      Marcar predeterminada
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => iniciarEdicion(dir)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 font-medium cursor-pointer"
                  >
                    <Pencil size={14} aria-hidden="true" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarDireccion(dir.idDireccion)}
                    className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    <Trash2 size={15} aria-hidden="true" />
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: 0.08 }}
        className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          {modoEdicion ? "Editar Direccion" : "Agregar Direccion"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="alias"
            value={form.alias}
            onChange={onChange}
            placeholder="Alias (Ej: Casa, Trabajo)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
          <input
            value={ARGENTINA}
            readOnly
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600"
          />
          <input
            name="calle"
            value={form.calle}
            onChange={onChange}
            placeholder="Calle"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
          <input
            name="numero"
            value={form.numero}
            onChange={onChange}
            placeholder="Numero"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
          <input
            name="piso"
            value={form.piso}
            onChange={onChange}
            placeholder="Piso (opcional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
          <input
            name="departamento"
            value={form.departamento}
            onChange={onChange}
            placeholder="Departamento (opcional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
          <input
            name="localidad"
            value={form.localidad}
            onChange={onChange}
            placeholder="Localidad"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
          <select
            name="provincia"
            value={form.provincia}
            onChange={onChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none bg-white"
            disabled={!modoEdicion && cupoCompleto}
          >
            <option value="">Provincia</option>
            {provinciasArgentina.map((provincia) => (
              <option key={provincia} value={provincia}>
                {provincia}
              </option>
            ))}
          </select>
          <input
            name="codigoPostal"
            value={form.codigoPostal}
            onChange={onChange}
            placeholder="Codigo Postal (4 digitos)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
          <input
            name="referencias"
            value={form.referencias}
            onChange={onChange}
            placeholder="Referencias (opcional)"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary-200 focus:border-primary-500 outline-none"
            disabled={!modoEdicion && cupoCompleto}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={(!modoEdicion && cupoCompleto) || guardando || loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus size={16} aria-hidden="true" />
            {guardando
              ? "Guardando..."
              : modoEdicion
                ? "Actualizar Direccion"
                : "Guardar Direccion"}
          </button>
          {modoEdicion && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 text-gray-700 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </motion.form>
    </motion.section>
  );
};

export default PerfilDirecciones;
