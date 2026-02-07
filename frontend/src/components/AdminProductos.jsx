import { useProductStore } from "../store/useProductStore";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

const AdminProductos = () => {

  const productos = useProductStore((state) => state.productos);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const categorias = useProductStore((state) => state.categorias);

  const token = useAuthStore((state) => state.token);

  // Estados para creación (Modal normal)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();

  // Estados de filtro
  const [busqueda, setBusqueda] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 4;

  // Estado para nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombreProducto: "",
    descripcion: "",
    precio: "",
    categoria: "",
    img: "",
    stock: "",
  });

  const getConfig = () => ({
    headers: {
      'Auth': `Bearer ${token}`
    }
  });

  const formatearPrecio = (precio) => {
    const precioLimpio = String(precio).replace(',', '.');
    const numero = Number(precioLimpio);
    if (isNaN(numero)) return "$0.00";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero);
  };

  // Cierra modal de creación al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  // Resetear paginación al filtrar
  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, filtroCategoria, filtroEstado]);


  // --- 1. FUNCIÓN EDITAR CON SWEETALERT CORREGIDA ---
  const handleEditarProducto = async (prod) => {
    const opcionesCategorias = categorias.map(cat =>
      `<option value="${cat}" ${cat === prod.categoria ? 'selected' : ''}>${cat}</option>`
    ).join('');

    const { value: formValues } = await Swal.fire({
      title: `<h2 class="text-xl font-bold text-gray-700">✏️ Editando: ${prod.nombreProducto}</h2>`,
      html: `
        <div class="flex flex-col gap-4 text-left">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                    <input id="swal-nombre" class="w-full p-2.5 border rounded" value="${prod.nombreProducto}">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Categoría</label>
                    <select id="swal-categoria" class="w-full p-2.5 border rounded">
                        ${opcionesCategorias}
                    </select>
                </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Precio</label>
                    <input id="swal-precio" type="number" step="0.01" class="w-full p-2.5 border rounded" value="${prod.precioRegular || prod.precioFinal}">
                </div>
                <div>
                    <label class="text-xs font-bold text-gray-500 uppercase">Stock</label>
                    <input id="swal-stock" type="number" class="w-full p-2.5 border rounded" value="${prod.stock}">
                </div>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Imagen (URL)</label>
                <input id="swal-img" type="text" class="w-full p-2.5 border rounded" value="${prod.img}">
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 uppercase">Descripción</label>
                <textarea id="swal-desc" class="w-full p-2.5 border rounded" rows="3">${prod.descripcion || ''}</textarea>
            </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      confirmButtonColor: '#EAB308',
      width: '600px',
      preConfirm: () => {
        return {
          nombreProducto: document.getElementById('swal-nombre').value.trim(),
          categoria: document.getElementById('swal-categoria').value,
          precio: document.getElementById('swal-precio').value,
          stock: document.getElementById('swal-stock').value,
          img: document.getElementById('swal-img').value.trim(),
          descripcion: document.getElementById('swal-desc').value.trim(),
        };
      }
    });

    if (formValues) {
      try {
        await axios.put(
          `http://localhost:5000/productos/actualizar/${prod.idProducto}`,
          {
            ...formValues,
            precio: Number(formValues.precio),
            stock: Number(formValues.stock),
            activo: prod.activo
          },
          getConfig()
        );
        Swal.fire('Actualizado', 'Producto modificado correctamente', 'success');
        fetchProducts();
      } catch (error) {
        console.error("Error editando:", error);
        Swal.fire('Error', 'No se pudo actualizar el producto', 'error');
      }
    }
  };

  // --- 2. FUNCIÓN CREAR PRODUCTO ---
  const agregarProducto = async () => {
    try {
      const productoAEnviar = {
        ...nuevoProducto,
        precio: Number(nuevoProducto.precio) || 0
      };

      await axios.post("http://localhost:5000/productos/crear", productoAEnviar, getConfig());
      toast.success("Producto agregado correctamente");
      setIsModalOpen(false);
      setNuevoProducto({
        nombreProducto: "", descripcion: "", precio: "", categoria: "", img: "", stock: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      toast.error("Error al agregar el producto");
    }
  };

  // --- 3. FUNCIÓN TOGGLE ACTIVO ---
  const handleToggleActiva = (prod) => {
    const accion = prod.activo ? "Desactivar" : "Activar";
    const participio = prod.activo ? "Desactivado" : "Activado";

    const colorBtn = prod.activo ? "#d33" : "#059669";

    Swal.fire({
      title: `¿${accion} producto?`,
      text: `El producto "${prod.nombreProducto}" ${prod.activo ? 'dejará de ser' : 'será'} visible para los clientes.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: colorBtn,
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Sí, ${accion.toLowerCase()}`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:5000/productos/actualizar/activo/${prod.idProducto}`, {
            activo: !prod.activo,
          }, getConfig());

          Swal.fire(
            `${participio}!`,
            `El producto ha sido ${participio.toLowerCase()} correctamente.`,
            'success'
          );
          fetchProducts();
        } catch (error) {
          console.error("Error estado:", error);
          Swal.fire('Error', 'No se pudo cambiar el estado', 'error');
        }
      }
    });
  }

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombreProducto.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "todas" || p.categoria === filtroCategoria;
    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "activos" && p.activo) ||
      (filtroEstado === "inactivos" && !p.activo);

    return coincideBusqueda && coincideCategoria && coincideEstado;
  });

  const indiceUltimoItem = paginaActual * itemsPorPagina;
  const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
  const itemsActuales = productosFiltrados.slice(indicePrimerItem, indiceUltimoItem);
  const totalPaginas = Math.ceil(productosFiltrados.length / itemsPorPagina);

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

      <div className="w-full mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administración de Productos</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Agregar Producto
            </button>

            <Link
              to="/admin/MenuProductos"
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
            >
              ← Volver
            </Link>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="border p-2 rounded w-full md:w-1/3"
          />
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border p-2 rounded w-full md:w-1/4"
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="inactivos">Inactivos</option>
          </select>
        </div>

        {/* Modal de CREACIÓN */}
        {isModalOpen && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
            <div ref={modalRef} className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Producto</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Imagen</label>
                    <input type="text" name="img" value={nuevoProducto.img} onChange={(e) => setNuevoProducto({ ...nuevoProducto, img: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="https://..." />
                    {nuevoProducto.img && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                        <img src={nuevoProducto.img} alt="Preview" className="h-20 w-20 object-cover rounded border" onError={(e) => e.target.src = 'https://via.placeholder.com/100'} />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                    <input type="text" name="nombreProducto" value={nuevoProducto.nombreProducto} onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombreProducto: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="Nombre" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea name="descripcion" value={nuevoProducto.descripcion} onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} className="w-full px-3 py-2 border rounded-md" rows="2" placeholder="Detalles..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                    <input type="number" name="precio" value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" name="stock" value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })} className="w-full px-3 py-2 border rounded-md" placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select name="categoria" value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} className="w-full px-3 py-2 border rounded-md">
                      <option value="">Seleccione...</option>
                      {categorias.map((c, i) => <option key={i} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancelar</button>
                  <button onClick={agregarProducto} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center gap-2">Guardar Producto</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TABLA DE PRODUCTOS */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="w-full">
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-primary-100">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-580 uppercase tracking-wider w-16">Imagen</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-1/3">Nombre</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-24">Precio</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider w-24">Categoría</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-16">Stock</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-20">Estado</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-800 uppercase tracking-wider w-40">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {itemsActuales.length > 0 ? (
                  itemsActuales.map((prod) => (
                    <tr key={prod.idProducto} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-md object-cover" src={prod.img} alt={prod.nombreProducto} onError={(e) => e.target.src = 'https://via.placeholder.com/40'} />
                        </div>
                      </td>
                      <td className="px-3 py-3 align-middle">
                        <div className="text-sm font-medium text-gray-900 whitespace-normal break-words" title={prod.nombreProducto}>
                          {prod.nombreProducto}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm text-gray-900">{formatearPrecio(+prod.precioFinal)}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap align-middle">
                        <div className="text-sm text-gray-900">{prod.categoria}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center align-middle">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {prod.stock}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-center align-middle">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.activo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {prod.activo ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right align-middle">
                        <div className="flex gap-1 justify-end">

                          {/* BOTÓN EDITAR (Icono solo) */}
                          <button
                            onClick={() => handleEditarProducto(prod)}
                            className="px-2 py-1 text-sm font-medium bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors cursor-pointer"
                            title="Editar Producto"
                          >
                            Editar
                          </button>

                          {/* BOTÓN TOGGLE (Icono solo) */}
                          <button
                            onClick={() => handleToggleActiva(prod)}
                            className={`px-2 text-white rounded-md transition-colors cursor-pointer ${prod.activo ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                              }`}
                            title={prod.activo ? "Desactivar Producto" : "Activar Producto"}
                          >
                            {prod.activo ? "Desactivar" : "Activar"}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No se encontraron productos.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Controles de paginación */}
          {productosFiltrados.length > 0 && (
            <div className="flex justify-center py-6 bg-white border-t border-gray-200">
              <nav className="flex items-center gap-1">
                <button onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))} disabled={paginaActual === 1} className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  &lt;
                </button>
                {getPaginationNumbers().map((number, index) => (
                  <button key={index} onClick={() => typeof number === 'number' ? cambiarPagina(number) : null} disabled={typeof number !== 'number'} className={`w-9 h-9 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${number === paginaActual ? 'bg-blue-500 text-white' : typeof number === 'number' ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' : 'bg-white text-gray-400 cursor-default'}`}>
                    {number}
                  </button>
                ))}
                <button onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))} disabled={paginaActual === totalPaginas} className={`w-9 h-9 flex items-center justify-center rounded-md text-blue-500 hover:bg-blue-50 transition-colors ${paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                  &gt;
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProductos;