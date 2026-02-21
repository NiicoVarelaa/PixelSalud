import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import apiClient from "@utils/apiClient";
import { useAuthStore } from "@store/useAuthStore";
import {
  Package,
  Tag,
  Plus,
  Edit,
  Trash2,
  Archive,
  RotateCcw,
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmpleadoProductos = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const permisos = user?.permisos || {};

  const [subVista, setSubVista] = useState("menu");
  const [productos, setProductos] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- LÓGICA DE CARGA DE DATOS ---
  const cargarInventario = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/productos");
      setProductos(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar el inventario.", "error");
    } finally {
      setLoading(false);
    }
  };

  const cargarOfertas = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/ofertas");
      setOfertas(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las ofertas.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- ACCIONES (Mantengo tus funciones originales, resumidas para no repetir lógica innecesaria) ---
  const handleCrearProducto = async () => {
    const { value: formValues } = await Swal.fire({
      title:
        '<h2 class="text-2xl font-bold text-gray-800">✨ Nuevo Producto</h2>',
      html: `
        <div class="flex flex-col gap-4 text-left mt-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
                <input id="swal-nombre" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="Ej: Ibuprofeno 400mg">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <input id="swal-desc" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Breve descripción">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select id="swal-cat" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                        <option value="" disabled selected>Seleccionar...</option>
                        <option value="Medicamentos">Medicamentos</option>
                        <option value="Dermocosmética">Dermocosmética</option>
                        <option value="Higiene">Higiene</option>
                        <option value="Perfumería">Perfumería</option>
                        <option value="Accesorios">Accesorios</option>
                    </select>
                </div>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen</label>
                <input id="swal-img" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://...">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                    <input id="swal-precio" type="number" step="0.01" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-gray-700" placeholder="0.00">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
                    <input id="swal-stock" type="number" class="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0">
                </div>
            </div>
            <div class="flex items-center mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <input type="checkbox" id="swal-receta" class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300">
                <label for="swal-receta" class="ml-2 block text-sm text-gray-900 font-medium cursor-pointer">Este producto requiere receta médica</label>
            </div>
        </div>
      `,
      width: "600px",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Guardar Producto",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const nombre = document.getElementById("swal-nombre").value;
        const precio = document.getElementById("swal-precio").value;
        const stock = document.getElementById("swal-stock").value;

        if (!nombre || !precio || !stock) {
          Swal.showValidationMessage(
            "Por favor completa los campos obligatorios (Nombre, Precio, Stock)",
          );
          return false;
        }

        return {
          nombreProducto: nombre,
          descripcion: document.getElementById("swal-desc").value,
          categoria: document.getElementById("swal-cat").value,
          img: document.getElementById("swal-img").value,
          precio: parseFloat(precio),
          stock: parseInt(stock),
          requiereReceta: document.getElementById("swal-receta").checked
            ? 1
            : 0,
        };
      },
    });

    if (formValues) {
      try {
        await apiClient.post("/productos/crear", formValues);
        Swal.fire({
          icon: "success",
          title: "¡Producto Creado!",
          text: "Se agregó correctamente al inventario.",
          confirmButtonColor: "#10B981",
        });
        cargarInventario();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "Error al crear.",
          "error",
        );
      }
    }
  };

  const handleEditarProducto = async (prod) => {
    const { value: formValues } = await Swal.fire({
      title: `<h2 class="text-xl font-bold text-gray-700">✏️ Editando: <span class="text-blue-600">${prod.nombreProducto}</span></h2>`,
      html: `
        <div class="flex flex-col gap-4 text-left mt-4">
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Nombre</label>
                <input id="swal-nombre" class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400 outline-none" value="${prod.nombreProducto}">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Categoría</label>
                    <input id="swal-cat" class="w-full p-2 border border-gray-300 rounded outline-none" value="${prod.categoria || ""}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Descripción</label>
                    <input id="swal-desc" class="w-full p-2 border border-gray-300 rounded outline-none" value="${prod.descripcion || ""}">
                </div>
            </div>
            <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Imagen URL</label>
                <input id="swal-img" class="w-full p-2 border border-gray-300 rounded outline-none text-gray-600" value="${prod.img || ""}">
            </div>
            <div class="grid grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div>
                    <label class="block text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">Precio ($)</label>
                    <input id="swal-precio" type="number" step="0.01" class="w-full p-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-gray-800" value="${prod.precioRegular}">
                </div>
                <div>
                    <label class="block text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">Stock</label>
                    <input id="swal-stock" type="number" class="w-full p-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 outline-none font-bold text-gray-800" value="${prod.stock}">
                </div>
            </div>
            <div class="flex items-center mt-1">
                <input type="checkbox" id="swal-receta" class="w-4 h-4 text-yellow-600 border-gray-300 rounded" ${prod.requiereReceta ? "checked" : ""}>
                <label for="swal-receta" class="ml-2 text-sm text-gray-700">Requiere Receta</label>
            </div>
        </div>
      `,
      width: "550px",
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#EAB308",
      cancelButtonColor: "#9CA3AF",
      confirmButtonText: "Guardar Cambios",
      preConfirm: () => {
        return {
          nombreProducto: document.getElementById("swal-nombre").value,
          descripcion: document.getElementById("swal-desc").value,
          categoria: document.getElementById("swal-cat").value,
          img: document.getElementById("swal-img").value,
          precio: parseFloat(document.getElementById("swal-precio").value),
          stock: parseInt(document.getElementById("swal-stock").value),
          requiereReceta: document.getElementById("swal-receta").checked,
          activo: prod.activo,
        };
      },
    });

    if (formValues) {
      try {
        await apiClient.put(
          `/productos/actualizar/${prod.idProducto}`,
          formValues,
        );
        Swal.fire({
          icon: "success",
          title: "Actualizado",
          confirmButtonColor: "#EAB308",
        });
        cargarInventario();
      } catch (error) {
        Swal.fire("Error", "No se pudo actualizar.", "error");
      }
    }
  };

  const handleCrearOferta = async () => {
    const { value: formValues } = await Swal.fire({
      title:
        '<h2 class="text-2xl font-bold text-purple-700">🏷️ Nueva Oferta</h2>',
      html: `
        <div class="flex flex-col gap-4 text-left mt-4">
            <div class="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <label class="block text-sm font-bold text-purple-800 mb-1">Producto ID</label>
                <input id="swal-id" type="number" class="w-full p-2 border border-purple-200 rounded focus:ring-2 focus:ring-purple-500 outline-none" placeholder="Mirar ID en inventario">
                <p class="text-xs text-gray-500 mt-1">Ingresa el ID del producto a promocionar.</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Porcentaje de Descuento (%)</label>
                <input id="swal-desc" type="number" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none font-bold text-lg" placeholder="Ej: 25">
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                    <input id="swal-ini" type="datetime-local" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                    <input id="swal-fin" type="datetime-local" class="w-full p-2 border border-gray-300 rounded-lg text-sm">
                </div>
            </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: "#9333EA",
      confirmButtonText: "Crear Oferta",
      preConfirm: () => {
        const id = document.getElementById("swal-id").value;
        const desc = document.getElementById("swal-desc").value;
        const ini = document.getElementById("swal-ini").value;
        const fin = document.getElementById("swal-fin").value;

        if (!id || !desc || !ini || !fin) {
          Swal.showValidationMessage("Todos los campos son obligatorios");
          return false;
        }
        return {
          idProducto: id,
          porcentajeDescuento: desc,
          fechaInicio: ini,
          fechaFin: fin,
        };
      },
    });

    if (formValues) {
      try {
        await apiClient.post("/ofertas/crear", formValues);
        Swal.fire({
          icon: "success",
          title: "Oferta Activa",
          text: "El descuento se aplicará automáticamente.",
          confirmButtonColor: "#9333EA",
        });
        cargarOfertas();
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.error || "Error al crear oferta.",
          "error",
        );
      }
    }
  };

  const handleEliminarOferta = (idOferta) => {
    Swal.fire({
      title: "¿Eliminar oferta?",
      text: "Esta acción quitará el descuento del producto. No se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await apiClient.delete(`/ofertas/eliminar/${idOferta}`);
          Swal.fire(
            "¡Eliminada!",
            "La oferta ha sido borrada correctamente.",
            "success",
          );
          cargarOfertas();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            error.response?.data?.error || "No se pudo eliminar la oferta.",
            "error",
          );
        }
      }
    });
  };

  const handleCambiarEstado = (prod) => {
    const esActivo = prod.activo === 1 || prod.activo === true;
    const accion = esActivo ? "Dar de Baja" : "Re-Activar";
    const texto = esActivo
      ? `El producto "${prod.nombreProducto}" dejará de estar visible para la venta.`
      : `El producto "${prod.nombreProducto}" volverá a estar disponible.`;
    const colorBtn = esActivo ? "#d33" : "#28a745";

    Swal.fire({
      title: `¿${accion}?`,
      text: texto,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: colorBtn,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const endpoint = esActivo
            ? `/productos/darBaja/${prod.idProducto}`
            : `/productos/activar/${prod.idProducto}`;

          await apiClient.put(endpoint);

          Swal.fire(
            "¡Estado Actualizado!",
            `El producto ahora está ${esActivo ? "Inactivo" : "Activo"}.`,
            "success",
          );
          cargarInventario();
        } catch (error) {
          console.error(error);
          Swal.fire(
            "Error",
            error.response?.data?.error || "No se pudo cambiar el estado.",
            "error",
          );
        }
      }
    });
  };

  // =================================================================
  // --- COMPONENTE INTERNO: TABLA CON BUSCADOR Y PAGINACIÓN ---
  // =================================================================
  const TablaPaginada = ({ datos, tipo }) => {
    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 10;

    // 1. Filtrado
    const datosFiltrados = datos.filter((item) => {
      const termino = busqueda.toLowerCase();
      if (tipo === "producto") {
        const estadoTexto = item.activo ? "activo" : "inactivo baja";
        return (
          item.nombreProducto.toLowerCase().includes(termino) ||
          item.categoria.toLowerCase().includes(termino) ||
          estadoTexto.includes(termino)
        );
      } else {
        // Oferta
        const estadoTexto = item.esActiva ? "activa" : "inactiva";
        return (
          item.nombreProducto.toLowerCase().includes(termino) ||
          estadoTexto.includes(termino)
        );
      }
    });

    // 2. Paginación
    const totalPaginas = Math.ceil(datosFiltrados.length / itemsPorPagina);
    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const itemsActuales = datosFiltrados.slice(
      indicePrimerItem,
      indiceUltimoItem,
    );

    useEffect(() => {
      setPaginaActual(1);
    }, [busqueda]);

    return (
      <div>
        {/* BARRA DE BÚSQUEDA */}
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={
              tipo === "producto"
                ? "Buscar por nombre, categoría o estado..."
                : "Buscar oferta..."
            }
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* TABLA */}
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200 mb-4">
          <table className="min-w-full w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
              <tr>
                {tipo === "producto" ? (
                  <>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Categoría</th>
                    <th className="px-4 py-3 text-right">Precio</th>
                    <th className="px-4 py-3 text-center">Stock</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3 text-center">Descuento</th>
                    <th className="px-4 py-3 text-center">Vigencia</th>
                    <th className="px-4 py-3 text-center">Estado</th>
                  </>
                )}
                {/* FIX AQUI: !! para evitar el 0 */}
                {!!permisos.modificar_productos && (
                  <th className="px-4 py-3 text-center">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {itemsActuales.length > 0 ? (
                itemsActuales.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {tipo === "producto" ? (
                      <>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {item.nombreProducto}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {item.categoria}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-green-600">
                          ${item.precioRegular}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${item.stock < 5 ? "bg-red-100 text-red-600" : "bg-blue-50 text-blue-600"}`}
                          >
                            {item.stock}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.activo ? (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                              Activo
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                              Inactivo
                            </span>
                          )}
                        </td>
                        {/* FIX AQUI: !! para evitar el 0 */}
                        {!!permisos.modificar_productos && (
                          <td className="px-4 py-3 flex justify-center gap-2">
                            <button
                              onClick={() => handleEditarProducto(item)}
                              className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleCambiarEstado(item)}
                              className={`p-2 rounded text-white ${item.activo ? "bg-red-500" : "bg-green-500"}`}
                            >
                              {item.activo ? (
                                <Archive size={16} />
                              ) : (
                                <RotateCcw size={16} />
                              )}
                            </button>
                          </td>
                        )}
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium">
                          {item.nombreProducto}
                        </td>
                        <td className="px-4 py-3 text-center font-bold text-purple-600">
                          -{item.porcentajeDescuento}%
                        </td>
                        <td className="px-4 py-3 text-center text-gray-500 text-xs">
                          {new Date(item.fechaInicio).toLocaleDateString()} -{" "}
                          {new Date(item.fechaFin).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {item.esActiva ? (
                            <span className="text-green-600 font-bold">
                              Activa
                            </span>
                          ) : (
                            <span className="text-gray-400">Inactiva</span>
                          )}
                        </td>
                        {/* FIX AQUI: !! para evitar el 0 */}
                        {!!permisos.modificar_productos && (
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() =>
                                handleEliminarOferta(item.idOferta)
                              }
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        )}
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Página {paginaActual} de {totalPaginas} ({datosFiltrados.length}{" "}
              resultados)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                disabled={paginaActual === 1}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() =>
                  setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
                }
                disabled={paginaActual === totalPaginas}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // =================================================================
  // --- RENDERIZADO PRINCIPAL ---
  // =================================================================

  const VistaInventario = () => (
    <div className="w-full animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          📦 Inventario General
        </h2>
        <div className="flex gap-2">
          {permisos.crear_productos && (
            <button
              onClick={handleCrearProducto}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow"
            >
              <Plus size={18} /> Nuevo Producto
            </button>
          )}
          <button
            onClick={() => setSubVista("menu")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={18} /> Volver
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center p-10">Cargando...</div>
      ) : (
        <TablaPaginada datos={productos} tipo="producto" />
      )}
    </div>
  );

  const VistaOfertas = () => (
    <div className="w-full animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          🏷️ Gestión de Ofertas
        </h2>
        <div className="flex gap-2">
          {permisos.crear_productos && (
            <button
              onClick={handleCrearOferta}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition shadow"
            >
              <Plus size={18} /> Nueva Oferta
            </button>
          )}
          <button
            onClick={() => setSubVista("menu")}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            <ArrowLeft size={18} /> Volver
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center p-10">Cargando ofertas...</div>
      ) : (
        <TablaPaginada datos={ofertas} tipo="oferta" />
      )}
    </div>
  );

  // --- MENÚ PRINCIPAL ---
  if (subVista === "menu") {
    return (
      <div className="p-6 max-w-7xl mx-auto w-full min-h-screen flex flex-col items-center mt-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Gestión de Productos
        </h1>
        <p className="text-gray-600 mb-10">¿Qué deseas administrar?</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div
            onClick={() => {
              setSubVista("inventario");
              cargarInventario();
            }}
            className="group p-10 bg-white rounded-2xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
          >
            <div className="p-4 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
              <Package
                size={48}
                className="text-blue-600 group-hover:text-white"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Inventario General
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Ver listado, stock y buscar activos/inactivos.
            </p>
          </div>

          <div
            onClick={() => {
              setSubVista("ofertas");
              cargarOfertas();
            }}
            className="group p-10 bg-white rounded-2xl shadow-lg border border-gray-100 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center"
          >
            <div className="p-4 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-600 transition-colors">
              <Tag
                size={48}
                className="text-purple-600 group-hover:text-white"
              />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Ofertas y Promos
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Buscar y gestionar promociones activas.
            </p>
          </div>
        </div>

        {/* BOTÓN VOLVER MODIFICADO PARA USAR NAVIGATE */}
        <button
          onClick={() => navigate("/panelempleados")}
          className="mt-12 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
        >
          ⬅ Volver al Panel Principal
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto w-full min-h-screen">
      {subVista === "inventario" && <VistaInventario />}
      {subVista === "ofertas" && <VistaOfertas />}
    </div>
  );
};

export default EmpleadoProductos;
