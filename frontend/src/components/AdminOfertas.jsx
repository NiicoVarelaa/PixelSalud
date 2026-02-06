import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useAuthStore } from "../store/useAuthStore";
import { useProductStore } from "../store/useProductStore";
import { Link } from "react-router-dom";

const AdminOfertas = () => {
  const [ofertas, setOfertas] = useState([]);

  const { productos, fetchProducts, categorias } = useProductStore();
  const token = useAuthStore((state) => state.token);

  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const modalRef = useRef();

  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 4;

  const [nuevaOferta, setNuevaOferta] = useState({
    idProducto: "",
    porcentajeDescuento: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const getConfig = () => ({
    headers: { 'Auth': `Bearer ${token}` }
  });

  const fetchOfertas = async () => {
    setCargando(true);
    try {
      await fetchProducts();
      const response = await axios.get("http://localhost:5000/ofertas");
      setOfertas(response.data);
    } catch (error) {
      console.error("Error al cargar ofertas:", error);
      toast.error("Error al cargar las ofertas.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchOfertas();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModalAbierto(false);
      }
    };
    if (modalAbierto) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalAbierto]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroEstado, filtroCategoria]);


  const formatearFechaInput = (fechaISO) => {
    if (!fechaISO) return "";
    return new Date(fechaISO).toISOString().split('T')[0];
  };

  const formatearFechaTabla = (fecha) => {
    if (!fecha) return "N/A";
    const fechaObj = new Date(fecha);
    const fechaCorregida = new Date(fechaObj.getTime() + fechaObj.getTimezoneOffset() * 60000);
    return fechaCorregida.toLocaleDateString("es-AR");
  };

  const getOfertaEnriquecida = (oferta) => {
    const prod = productos.find(p => p.idProducto === oferta.idProducto);
    return {
      ...oferta,
      img: prod?.img || "https://via.placeholder.com/50",
      categoria: prod?.categoria || "Sin Categoría",
      nombreProducto: prod?.nombreProducto || oferta.nombreProducto
    };
  };

  const crearOferta = async () => {
    try {
      if (!nuevaOferta.idProducto || !nuevaOferta.porcentajeDescuento) {
        toast.error("Complete los datos obligatorios");
        return;
      }
      await axios.post("http://localhost:5000/ofertas/crear", nuevaOferta, getConfig());
      setModalAbierto(false);
      setNuevaOferta({ idProducto: "", porcentajeDescuento: "", fechaInicio: "", fechaFin: "" });
      fetchOfertas();
      toast.success("Oferta creada correctamente.");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear oferta.");
    }
  };

  const handleChange = (e) => {
    setNuevaOferta({ ...nuevaOferta, [e.target.name]: e.target.value });
  };


  const handleEditarOferta = async (ofertaRaw) => {
    const oferta = getOfertaEnriquecida(ofertaRaw);

    const { value: formValues } = await Swal.fire({
      title: `<h2 class="text-xl font-bold text-gray-700">✏️ Editar Oferta</h2>`,
      html: `
        <div class="flex flex-col gap-4 text-left">
            <div class="bg-gray-50 p-3 rounded border">
                <p class="text-sm font-bold text-gray-700">${oferta.nombreProducto}</p>
                <p class="text-xs text-gray-500">${oferta.categoria}</p>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Descuento (%)</label>
                <input id="swal-descuento" type="number" class="w-full p-2.5 border rounded" value="${oferta.porcentajeDescuento}">
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Inicio</label>
                    <input id="swal-inicio" type="date" class="w-full p-2.5 border rounded" value="${formatearFechaInput(oferta.fechaInicio)}">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Fin</label>
                    <input id="swal-fin" type="date" class="w-full p-2.5 border rounded" value="${formatearFechaInput(oferta.fechaFin)}">
                </div>
            </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      confirmButtonColor: '#EAB308',
      preConfirm: () => {
        return {
          porcentajeDescuento: document.getElementById('swal-descuento').value,
          fechaInicio: document.getElementById('swal-inicio').value,
          fechaFin: document.getElementById('swal-fin').value,
          idProducto: oferta.idProducto,
          esActiva: oferta.esActiva
        };
      }
    });

    if (formValues) {
      try {
        await axios.put(
          `http://localhost:5000/ofertas/actualizar/${oferta.idOferta}`,
          formValues,
          getConfig()
        );
        Swal.fire('Actualizado', 'Oferta modificada correctamente', 'success');
        fetchOfertas();
      } catch (error) {
        Swal.fire('Error', 'No se pudo actualizar la oferta', 'error');
      }
    }
  };


  const toggleActiva = (idOferta, esActiva) => {
    const accion = esActiva ? "Desactivar" : "Activar";
    const participio = esActiva ? "Desactivada" : "Activada";
    const colorBtn = esActiva ? "#d33" : "#059669";

    Swal.fire({
      title: `¿${accion} oferta?`,
      text: `La oferta ${esActiva ? "dejará de aplicarse" : "se aplicará"} a los productos.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colorBtn,
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Sí, ${accion.toLowerCase()}`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5000/ofertas/esActiva/${idOferta}`, {
            esActiva: !esActiva,
          }, getConfig());

          Swal.fire(
            `${participio}!`,
            `La oferta ha sido ${participio.toLowerCase()} correctamente.`,
            'success'
          );
          fetchOfertas();
        } catch (error) {
          Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
        }
      }
    });
  };


  const ofertasEnriquecidas = ofertas.map(getOfertaEnriquecida);

  const ofertasFiltradas = ofertasEnriquecidas.filter((oferta) => {
    const coincideBusqueda = oferta.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "todas" || oferta.categoria === filtroCategoria;
    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activas" && oferta.esActiva) ||
      (filtroEstado === "inactivas" && !oferta.esActiva);

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = ofertasFiltradas.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(ofertasFiltradas.length / itemsPorPagina);

  const cambiarPagina = (numeroPagina) => setPaginaActual(numeroPagina);

  const getPaginationNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    for (let i = 1; i <= totalPaginas; i++) {
      if (i === 1 || i === totalPaginas || (i >= paginaActual - delta && i <= paginaActual + delta)) {
        range.push(i);
      }
    }
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="min-h-screen bg-white p-6 w-full">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      {/* Modal Crear */}
      {modalAbierto && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Crear Nueva Oferta</h2>
                <button onClick={() => setModalAbierto(false)} className="text-gray-500 hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                  <select
                    name="idProducto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                    value={nuevaOferta.idProducto}
                    onChange={handleChange}
                  >
                    <option value="">Seleccione un producto...</option>
                    {productos.filter(p => p.activo).map(p => (
                      <option key={p.idProducto} value={p.idProducto}>{p.nombreProducto} (${p.precio})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descuento (%)</label>
                  <input type="number" name="porcentajeDescuento" placeholder="Ej: 15" className="w-full px-3 py-2 border rounded-md" value={nuevaOferta.porcentajeDescuento} onChange={handleChange} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Inicio</label>
                    <input type="date" name="fechaInicio" className="w-full px-3 py-2 border rounded-md" value={nuevaOferta.fechaInicio} onChange={handleChange} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fin</label>
                    <input type="date" name="fechaFin" className="w-full px-3 py-2 border rounded-md" value={nuevaOferta.fechaFin} onChange={handleChange} />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button onClick={() => setModalAbierto(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancelar</button>
                <button onClick={crearOferta} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">Guardar Oferta</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administración de Ofertas</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setModalAbierto(true)}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" /></svg>
              Agregar Oferta
            </button>
            <Link to="/admin/MenuProductos" className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium">← Volver</Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="border p-2 rounded w-full md:w-1/4">
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
          </select>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="border p-2 rounded w-full md:w-1/4">
            <option value="todos">Todos</option>
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
          </select>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="w-full">
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-primary-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-580 uppercase tracking-wider w-16">Img</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-1/3">Producto</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-24">Descuento</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-24">Categoría</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-24">Vence</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-20">Estado</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-40">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {itemsActuales.length > 0 ? (
                  itemsActuales.map((oferta) => (
                    <tr key={oferta.idOferta} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <img className="h-10 w-10 rounded-md object-cover border" src={oferta.img} alt="Prod" onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="text-sm font-medium text-gray-900 whitespace-normal break-words">{oferta.nombreProducto}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap align-middle">
                        <span className="text-sm font-bold text-green-600">-{oferta.porcentajeDescuento}%</span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap align-middle text-sm text-gray-600">
                        {oferta.categoria}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap align-middle text-sm text-gray-700">
                        {formatearFechaTabla(oferta.fechaFin)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center align-middle">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${oferta.esActiva ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {oferta.esActiva ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right align-middle">
                        <div className="flex gap-1 justify-end">

                          {/* BOTÓN EDITAR (Icono solo) */}
                          {/* BOTÓN EDITAR (Texto) */}
                          <button
                            onClick={() => handleEditarOferta(oferta)}
                            className="px-2 py-1 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors cursor-pointer"
                            title="Editar Oferta"
                          >
                            Editar
                          </button>

                          {/* BOTÓN TOGGLE (Texto) */}
                          <button
                            onClick={() => toggleActiva(oferta.idOferta, oferta.esActiva)}
                            className={`px-2 py-1 text-sm font-medium text-white rounded-md transition-colors cursor-pointer ${oferta.esActiva ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                              }`}
                            title={oferta.esActiva ? "Desactivar Oferta" : "Activar Oferta"}
                          >
                            {oferta.esActiva ? "Desactivar" : "Activar"}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No se encontraron ofertas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          {ofertasFiltradas.length > 0 && (
            <div className="flex justify-center py-6 bg-white border-t border-gray-200">
              <nav className="flex items-center gap-1">
                <button onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))} disabled={paginaActual === 1} className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>&lt;</button>
                {getPaginationNumbers().map((number, index) => (
                  <button key={index} onClick={() => typeof number === 'number' ? cambiarPagina(number) : null} disabled={typeof number !== 'number'} className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${number === paginaActual ? 'bg-blue-500 text-white' : typeof number === 'number' ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' : 'bg-white text-gray-400 cursor-default'}`}>{number}</button>
                ))}
                <button onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))} disabled={paginaActual === totalPaginas} className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>&gt;</button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOfertas;