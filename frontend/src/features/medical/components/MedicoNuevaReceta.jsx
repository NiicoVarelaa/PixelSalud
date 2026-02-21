import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";
import {
  Search,
  User,
  FilePlus,
  Pill,
  ArrowLeft,
  X,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MedicoNuevaReceta = () => {
  // <--- Sin props
  const navigate = useNavigate(); // <--- Hook
  const { user } = useAuthStore();

  // --- Estados de Paciente ---
  const [dniPaciente, setDniPaciente] = useState("");
  const [pacienteData, setPacienteData] = useState(null);
  const [buscandoPaciente, setBuscandoPaciente] = useState(false);

  // --- Estados de Medicamentos ---
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  // LISTA DE PRODUCTOS A RECETAR (CARRITO)
  const [listaRecetas, setListaRecetas] = useState([]);

  // ------------------------------------------------------
  // 1. BUSCADOR DE PACIENTE
  // ------------------------------------------------------
  useEffect(() => {
    if (dniPaciente.length < 7) {
      setPacienteData(null);
      return;
    }

    const timer = setTimeout(async () => {
      setBuscandoPaciente(true);
      try {
        const response = await apiClient.get(`/clientes/buscar/${dniPaciente}`);
        setPacienteData(response.data);
      } catch (error) {
        setPacienteData(null);
      } finally {
        setBuscandoPaciente(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [dniPaciente]);

  // ------------------------------------------------------
  // 2. BUSCADOR DE MEDICAMENTOS
  // ------------------------------------------------------
  useEffect(() => {
    if (terminoBusqueda.length < 3) {
      setResultadosBusqueda([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const response = await apiClient.get("/productos/buscar", {
          params: { term: terminoBusqueda },
        });
        if (Array.isArray(response.data)) setResultadosBusqueda(response.data);
      } catch (error) {
        console.error(error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [terminoBusqueda]);

  // ------------------------------------------------------
  // 3. FUNCIONES (HANDLERS)
  // ------------------------------------------------------

  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod);
    setResultadosBusqueda([]);
    setTerminoBusqueda("");
    setCantidad(1);
  };

  const cancelarSeleccion = () => {
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const agregarALista = () => {
    if (!productoSeleccionado || cantidad < 1) return;

    setListaRecetas([
      ...listaRecetas,
      {
        ...productoSeleccionado,
        cantidadRecetada: parseInt(cantidad),
      },
    ]);

    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const quitarDeLista = (index) => {
    const nuevaLista = [...listaRecetas];
    nuevaLista.splice(index, 1);
    setListaRecetas(nuevaLista);
  };

  // --- REGISTRAR PACIENTE (MODAL) ---
  const handleNuevoPaciente = async () => {
    const { value: formValues } = await Swal.fire({
      title:
        '<h2 class="text-2xl font-bold text-blue-800">👤 Nuevo Paciente</h2>',
      html: `
        <div class="flex flex-col gap-4 text-left mt-2">
           <div class="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-2">
                <span class="text-blue-500 text-lg">ℹ️</span>
                <p class="text-sm text-blue-700">
                    Se creará una cuenta automáticamente. <br/>
                    <strong>La contraseña temporal será el DNI.</strong>
                </p>
           </div>
           <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">DNI</label>
                <input id="swal-dni" type="number" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-lg" placeholder="Ej: 12345678" value="${dniPaciente}">
           </div>
           <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
               <input id="swal-nombre" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Juan">
             </div>
             <div>
               <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Apellido</label>
               <input id="swal-apellido" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Pérez">
             </div>
           </div>
           <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input id="swal-email" type="email" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="paciente@email.com">
           </div>
        </div>
      `,
      width: "500px",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Registrar Paciente",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2563EB",

      preConfirm: () => {
        const dni = document.getElementById("swal-dni").value;
        const nombre = document.getElementById("swal-nombre").value;
        const apellido = document.getElementById("swal-apellido").value;
        const email = document.getElementById("swal-email").value;

        if (!dni || !nombre || !apellido || !email) {
          Swal.showValidationMessage("⚠️ Todos los campos son obligatorios");
          return false;
        }
        return { dni, nombre, apellido, email };
      },
    });

    if (formValues) {
      try {
        await apiClient.post("/clientes/express", formValues);

        Swal.fire({
          icon: "success",
          title: "¡Registrado!",
          text: `El paciente ${formValues.nombre} ya está activo.`,
          confirmButtonColor: "#10B981",
          timer: 2500,
        });
        setDniPaciente(formValues.dni);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "No se pudo registrar.",
          "error",
        );
      }
    }
  };

  // --- EMITIR RECETA ---
  const handleEmitirTodo = async () => {
    if (!pacienteData) {
      Swal.fire(
        "Paciente no válido",
        "Debes ingresar un DNI de un paciente registrado.",
        "error",
      );
      return;
    }
    if (listaRecetas.length === 0) {
      Swal.fire("Receta vacía", "Agrega al menos un medicamento.", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "¿Confirmar Emisión?",
      html: `Se generarán <b>${listaRecetas.length} recetas</b> para <br/><span class="text-blue-600 font-bold text-lg">${pacienteData.nombreCliente} ${pacienteData.apellidoCliente}</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, Firmar Digitalmente",
      confirmButtonColor: "#3B82F6",
    });

    if (!result.isConfirmed) return;

    const payload = {
      dniCliente: dniPaciente,
      idMedico: user.id,
      productos: listaRecetas.map((p) => ({
        idProducto: p.idProducto,
        cantidad: p.cantidadRecetada,
      })),
    };

    try {
      Swal.fire({ title: "Emitiendo...", didOpen: () => Swal.showLoading() });
      await apiClient.post("/recetas/crear", payload);

      Swal.fire(
        "¡Éxito!",
        "Las recetas fueron emitidas correctamente.",
        "success",
      );

      setListaRecetas([]);
      setDniPaciente("");
      setPacienteData(null);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Hubo un problema al emitir.",
        "error",
      );
    }
  };

  // ------------------------------------------------------
  // RENDERIZADO
  // ------------------------------------------------------
  return (
    <div className="p-6 max-w-6xl mx-auto w-full animate-fadeIn">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FilePlus className="text-blue-600" /> Nueva Receta
          </h1>
          <p className="text-gray-500">
            Complete los datos del paciente y medicamentos.
          </p>
        </div>

        {/* BOTÓN VOLVER ARREGLADO */}
        <button
          onClick={() => navigate("/panelMedico")}
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 shadow-sm font-medium text-gray-700"
        >
          <ArrowLeft size={18} /> Volver
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* --- COLUMNA IZQUIERDA: FORMULARIOS --- */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. DATOS DEL PACIENTE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl"></div>
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                <User size={20} />
              </div>
              Datos del Paciente
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                DNI del Paciente
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="number"
                    className={`w-full pl-4 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-lg transition ${pacienteData ? "border-green-500 ring-1 ring-green-500 bg-green-50/30" : ""}`}
                    placeholder="Ingrese número sin puntos"
                    value={dniPaciente}
                    onChange={(e) => setDniPaciente(e.target.value)}
                  />
                  <div className="absolute right-3 top-3.5">
                    {buscandoPaciente && (
                      <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                    )}
                    {!buscandoPaciente && pacienteData && (
                      <CheckCircle className="text-green-500" size={20} />
                    )}
                  </div>
                </div>

                <button
                  onClick={handleNuevoPaciente}
                  type="button"
                  className="px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center justify-center"
                  title="Registrar nuevo paciente"
                >
                  <UserPlus size={24} />
                </button>
              </div>

              {/* Resultado de Búsqueda */}
              {pacienteData ? (
                <div className="mt-3 p-3 bg-green-50 border border-green-100 text-green-800 rounded-lg text-sm font-bold flex items-center gap-2 animate-fadeIn">
                  <User size={16} /> {pacienteData.nombreCliente}{" "}
                  {pacienteData.apellidoCliente}
                </div>
              ) : (
                dniPaciente.length > 7 &&
                !buscandoPaciente && (
                  <div className="mt-3 flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm animate-fadeIn">
                    <span className="flex items-center gap-2">
                      <AlertCircle size={16} /> Paciente no encontrado.
                    </span>
                    <span
                      className="font-bold cursor-pointer underline hover:text-red-800"
                      onClick={handleNuevoPaciente}
                    >
                      Registrar ahora
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 2. AGREGAR MEDICAMENTOS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 rounded-l-2xl"></div>
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                <Pill size={20} />
              </div>
              Agregar Medicamento
            </h2>

            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Buscar medicamento..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                  disabled={!!productoSeleccionado}
                />

                {/* Lista Flotante */}
                {resultadosBusqueda.length > 0 && !productoSeleccionado && (
                  <ul className="absolute z-50 w-full bg-white border border-gray-200 mt-2 rounded-xl shadow-2xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95">
                    {resultadosBusqueda.map((prod) => (
                      <li
                        key={prod.idProducto}
                        onClick={() => seleccionarProducto(prod)}
                        className="p-3 hover:bg-purple-50 cursor-pointer border-b text-sm flex flex-col"
                      >
                        <span className="font-bold text-gray-800">
                          {prod.nombreProducto}
                        </span>
                        <span className="text-xs text-gray-500">
                          {prod.categoria} • Stock: {prod.stock}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="w-full md:w-24">
                <input
                  type="number"
                  min="1"
                  max="10"
                  className="w-full p-3 border border-gray-300 rounded-xl text-center font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  disabled={!productoSeleccionado}
                />
              </div>

              <button
                onClick={agregarALista}
                disabled={!productoSeleccionado}
                className={`p-3 rounded-xl text-white transition shadow-md ${!productoSeleccionado ? "bg-gray-300 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 hover:shadow-lg active:scale-95"}`}
              >
                <Plus size={24} />
              </button>
            </div>

            {productoSeleccionado && (
              <div className="mt-4 flex justify-between items-center bg-purple-50 border border-purple-100 p-3 px-4 rounded-xl text-sm animate-fadeIn">
                <div>
                  <p className="text-purple-900 font-bold">
                    {productoSeleccionado.nombreProducto}
                  </p>
                  <p className="text-purple-600 text-xs">
                    {productoSeleccionado.categoria}
                  </p>
                </div>
                <button
                  onClick={cancelarSeleccion}
                  className="p-1 bg-white text-red-500 rounded-full hover:bg-red-50 shadow-sm border border-gray-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- COLUMNA DERECHA: RESUMEN DE RECETAS --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-100 sticky top-6">
            <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center border-b border-gray-100 pb-3">
              Resumen
              <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-bold">
                {listaRecetas.length}
              </span>
            </h3>

            {listaRecetas.length === 0 ? (
              <div className="text-center py-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                <FilePlus className="mx-auto mb-2 opacity-50" size={32} />
                <p className="text-sm font-medium">Lista vacía</p>
                <p className="text-xs mt-1">
                  Agrega medicamentos para comenzar
                </p>
              </div>
            ) : (
              <ul className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                {listaRecetas.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-start p-3 bg-gray-50 hover:bg-gray-100 transition rounded-lg border border-gray-200 text-sm group"
                  >
                    <div>
                      <p className="font-bold text-gray-800 line-clamp-1">
                        {item.nombreProducto}
                      </p>
                      <p className="text-xs text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200 inline-block mt-1">
                        Cant: {item.cantidadRecetada}
                      </p>
                    </div>
                    <button
                      onClick={() => quitarDeLista(idx)}
                      className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="mb-4 text-sm space-y-1">
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">
                  Paciente Destino
                </p>
                <div className="font-medium text-gray-900 text-lg truncate p-2 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  {pacienteData ? (
                    `${pacienteData.nombreCliente} ${pacienteData.apellidoCliente}`
                  ) : (
                    <span className="text-gray-400 italic">
                      -- Seleccionar --
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleEmitirTodo}
                disabled={listaRecetas.length === 0 || !pacienteData}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transition transform active:scale-[0.98] flex justify-center items-center gap-2 ${
                  listaRecetas.length === 0 || !pacienteData
                    ? "bg-gray-300 cursor-not-allowed shadow-none"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                }`}
              >
                Emitir Recetas <CheckCircle size={20} className="opacity-80" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicoNuevaReceta;
