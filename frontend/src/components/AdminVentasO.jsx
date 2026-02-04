import { useState, useEffect, useReducer } from "react";
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { Search, Eye, Globe, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

// --- REDUCER (Solo para el modal de edición) ---
const ventaReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD': return { ...state, [action.field]: action.value };
        case 'SET_DIRECCION': return { ...state, direccionEnvio: { ...state.direccionEnvio, [action.field]: action.value } };
        case 'LOAD_SALE': return { ...state, ...action.payload };
        case 'ADD_PRODUCT': return { ...state, productos: [...state.productos, action.product] };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                productos: state.productos.map((prod, index) =>
                    index === action.index ? { ...prod, [action.field]: action.value } : prod
                ),
            };
        case 'REMOVE_PRODUCT': return { ...state, productos: state.productos.filter((_, index) => index !== action.index) };
        case 'RESET': return action.initialState;
        default: return state;
    }
};

const AdminVentasO = () => {
    const initialState = {
        idCliente: "",
        metodoPago: "Efectivo",
        tipoEntrega: "Retiro",
        direccionEnvio: { nombreDestinatario: "", telefono: "", direccion: "", ciudad: "", provincia: "", codigoPostal: "" },
        totalPago: 0,
        productos: []
    };

    const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);
    
    // Estados de datos
    const [ventas, setVentas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    
    // Estados de UI y Filtros
    const [filtro, setFiltro] = useState("");
    
    // --- CAMBIO AQUI: Por defecto inicia en "Todos" ---
    const [filtroEstado, setFiltroEstado] = useState("Todos"); 
    
    const [orden, setOrden] = useState({ campo: "idVentaO", direccion: "desc" });
    const [cargando, setCargando] = useState(true);
    
    // Edición y Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 6; 

    // --- CAMBIO: Solo los estados que existen en tu DB y pediste ---
    const estadosPosibles = ["Pendiente", "Retirado", "Cancelado"];

    // --- CARGA DE DATOS ---
    const obtenerDatos = async () => {
        try {
            setCargando(true);
            const [resVentas, resProd, resCli] = await Promise.all([
                apiClient.get("/ventasOnline/todas"),
                apiClient.get("/productos"),
                apiClient.get("/clientes")
            ]);

            const rawVentas = resVentas.data.results || resVentas.data || [];
            
            // --- CORRECCIÓN IMPORTANTE: DEDUPLICACIÓN ---
            // Como tu backend trae una fila por producto, aquí filtramos para tener 1 fila por VENTA
            const ventasUnicas = [];
            const map = new Map();
            for (const item of rawVentas) {
                if (!map.has(item.idVentaO)) {
                    map.set(item.idVentaO, true);
                    ventasUnicas.push(item);
                }
            }

            setVentas(ventasUnicas);
            setProductosDisponibles(resProd.data.results || resProd.data || []);
            setClientes(resCli.data.results || resCli.data || []);

        } catch (error) {
            console.error("Error cargando datos:", error);
            toast.error("Error al cargar datos del sistema.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, []);

    // Cálculo automático del total (Modal)
    useEffect(() => {
        const nuevoTotal = ventaForm.productos.reduce((acc, prod) => {
            const cantidad = Number(prod.cantidad) || 0;
            const precio = Number(prod.precioUnitario) || 0;
            return acc + (cantidad * precio);
        }, 0);
        
        if (ventaForm.totalPago !== nuevoTotal) {
            dispatch({ type: 'SET_FIELD', field: 'totalPago', value: nuevoTotal });
        }
    }, [ventaForm.productos]);

    // --- LÓGICA DE EDICIÓN ---
    const handleEditarVenta = async (venta) => {
        Swal.fire({ title: 'Cargando datos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const res = await apiClient.get(`/ventasOnline/detalle/${venta.idVentaO}`);
            const detalles = res.data;

            const productosFormateados = detalles.map(d => ({
                idProducto: d.idProducto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            }));

            dispatch({
                type: 'LOAD_SALE',
                payload: {
                    idCliente: venta.idCliente, 
                    metodoPago: venta.metodoPago,
                    tipoEntrega: venta.tipoEntrega || 'Retiro',
                    totalPago: venta.totalPago,
                    productos: productosFormateados,
                    // Si el backend trae datos de envío en el detalle, se cargarían aquí
                    direccionEnvio: {
                        nombreDestinatario: venta.nombreDestinatario || "", // Ejemplo si viniera en la venta
                        telefono: "",
                        direccion: "",
                        ciudad: "",
                        provincia: "",
                        codigoPostal: ""
                    }
                }
            });

            setEditingId(venta.idVentaO);
            Swal.close();
            setIsModalOpen(true);

        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo cargar la venta para editar", "error");
        }
    };

    const handleSubmit = async () => {
        if (!ventaForm.idCliente || ventaForm.productos.length === 0) {
            toast.error("Selecciona un cliente y al menos un producto.");
            return;
        }

        try {
            // Asume que creaste la ruta PUT /ventasOnline/actualizar/:id en tu backend
            await apiClient.put(`/ventaOnline/actualizar/${editingId}`, ventaForm);
            toast.success("Venta Online actualizada.");
            setIsModalOpen(false);
            obtenerDatos();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Error al actualizar la venta.");
        }
    };

    // --- CAMBIO DE ESTADO (SOLUCIÓN ERROR 500) ---
    const handleEstadoChange = async (idVentaO, nuevoEstado) => {
        try {
            // Enviamos siempre en minúscula para que la DB lo acepte
            const estadoLower = nuevoEstado.toLowerCase();
            
            await apiClient.put("/ventaOnline/estado", { idVentaO, nuevoEstado: estadoLower });
            
            // Actualizamos el estado localmente para reflejar el cambio sin recargar
            setVentas(prev => prev.map(v => 
                v.idVentaO === idVentaO ? { ...v, estado: estadoLower } : v
            ));
            
            toast.success(`Estado cambiado a: ${estadoLower}`);
        } catch (error) {
            console.error(error);
            toast.error("Error al cambiar estado.");
        }
    };

    // --- VER DETALLE (TICKET) ---
    const handleVerDetalle = async (venta) => {
        Swal.fire({ title: 'Cargando detalle...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        try {
            const res = await apiClient.get(`/ventasOnline/detalle/${venta.idVentaO}`); 
            const detalles = res.data;

            let rowsHtml = detalles.map(d => `
                <tr class="border-b border-gray-100 last:border-0">
                    <td class="px-4 py-3 text-left font-medium text-gray-700 whitespace-normal text-xs">${d.nombreProducto || 'Producto'}</td>
                    <td class="px-4 py-3 text-center text-gray-600 text-xs">${d.cantidad}</td>
                    <td class="px-4 py-3 text-right text-gray-500 text-xs">$${new Intl.NumberFormat("es-AR").format(d.precioUnitario)}</td>
                    <td class="px-4 py-3 text-right font-bold text-gray-800 text-xs">$${new Intl.NumberFormat("es-AR").format(d.cantidad * d.precioUnitario)}</td>
                </tr>
            `).join('');

            const datosEnvioHtml = venta.tipoEntrega === 'Envio' ? `
                <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-left text-xs text-blue-800">
                    <strong>🚚 Datos de Envío:</strong><br/>
                    Destinatario: ${venta.nombreDestinatario || 'N/A'}<br/>
                    Dirección: ${venta.direccion || 'N/A'} - ${venta.ciudad || ''}<br/>
                    Tel: ${venta.telefono || 'N/A'}
                </div>
            ` : '';

            Swal.fire({
                title: `<div class="text-xl font-bold text-gray-800">📦 Orden Web #${venta.idVentaO}</div>`,
                html: `
                    <div class="text-left text-xs mb-2 text-gray-500">
                        Cliente: <b>${venta.nombreCliente}</b> <br/>
                        DNI: <b>${venta.dni || venta.dniCliente || '-'}</b>
                    </div>
                    ${datosEnvioHtml}
                    <div class="mt-2 overflow-hidden rounded-xl border border-gray-200 shadow-inner bg-gray-50">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th class="px-4 py-2 text-left">Producto</th>
                                    <th class="px-4 py-2 text-center">Cant.</th>
                                    <th class="px-4 py-2 text-right">Precio</th>
                                    <th class="px-4 py-2 text-right">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-100">${rowsHtml}</tbody>
                            <tfoot class="bg-indigo-50">
                                <tr>
                                    <td colspan="3" class="px-4 py-3 text-right font-bold text-gray-600 uppercase text-xs">Total Final:</td>
                                    <td class="px-4 py-3 text-right font-bold text-indigo-700 text-sm">$${new Intl.NumberFormat("es-AR").format(venta.totalPago)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                `,
                width: '600px',
                showCloseButton: true,
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#4F46E5'
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: `Venta #${venta.idVentaO}`,
                text: "No se pudo cargar el detalle.",
                icon: "info"
            });
        }
    };

    // --- FILTROS Y PAGINACIÓN CORREGIDOS ---
    const ventasFiltradas = ventas.filter((v) => {
        // 1. Filtro Texto (Buscador)
        const coincideTexto = 
            (v.nombreCliente?.toLowerCase() || "").includes(filtro.toLowerCase()) ||
            v.idVentaO?.toString().includes(filtro) ||
            (v.dni?.toString() || "").includes(filtro);
        
        // 2. Filtro Estado (Selector) - COMPARACIÓN NORMALIZADA
        // Convertimos ambos a lowercase para asegurar coincidencia
        const estadoVenta = (v.estado || "").toLowerCase();
        const estadoFiltro = filtroEstado.toLowerCase();

        const coincideEstado = filtroEstado === "Todos" 
            ? true 
            : estadoVenta === estadoFiltro;

        return coincideTexto && coincideEstado;
    });

    const ordenarVentas = (campo) => {
        const direccion = orden.campo === campo && orden.direccion === "asc" ? "desc" : "asc";
        setOrden({ campo, direccion });
    };

    const ventasOrdenadas = [...ventasFiltradas].sort((a, b) => {
        const valA = a[orden.campo] || "";
        const valB = b[orden.campo] || "";
        
        if (valA < valB) return orden.direccion === "asc" ? -1 : 1;
        if (valA > valB) return orden.direccion === "asc" ? 1 : -1;
        return 0;
    });

    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const itemsActuales = ventasOrdenadas.slice(indicePrimerItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(ventasOrdenadas.length / itemsPorPagina);

    const cambiarPagina = (n) => setPaginaActual(n);

    // Paginación lógica
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

    const formatearFecha = (fecha) => !fecha ? "-" : new Date(fecha).toLocaleDateString("es-ES");
    const formatearMoneda = (val) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(val) || 0);
    const Cabecera = ({ titulo, campo, ordenarVentas, orden, width }) => (
        <th scope="col" className={`px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 ${width}`} onClick={() => ordenarVentas(campo)}>
            <div className="flex items-center">
                {titulo}
                {orden.campo === campo && (
                    <svg className={`ml-1 h-3 w-3 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                )}
            </div>
        </th>
    );

    // --- RENDER MODAL EDICIÓN ---
    const renderModal = () => {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Editar Venta Online #{editingId}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border p-4 rounded-md bg-gray-50">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                                    value={ventaForm.idCliente}
                                    disabled
                                >
                                    <option value="">Seleccione Cliente</option>
                                    {clientes.map(c => (
                                        <option key={c.idCliente} value={c.idCliente}>{c.nombreCliente} {c.apellidoCliente}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                    value={ventaForm.metodoPago}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'metodoPago', value: e.target.value })}
                                >
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tipo Entrega</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                    value={ventaForm.tipoEntrega}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'tipoEntrega', value: e.target.value })}
                                >
                                    <option value="Retiro">Retiro en local</option>
                                    <option value="Envio">Envío a domicilio</option>
                                </select>
                            </div>
                            <div className="md:col-span-3 text-right border-t pt-2 mt-2">
                                <span className="block text-sm font-bold text-gray-700">Total a Pagar</span>
                                <span className="text-lg font-extrabold text-primary-600">{formatearMoneda(ventaForm.totalPago)}</span>
                            </div>
                        </div>

                        {ventaForm.tipoEntrega === "Envio" && (
                            <div className="mb-6 border border-blue-100 bg-blue-50 p-4 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide">Datos de Envío</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input placeholder="Nombre Destinatario" className="w-full px-3 py-2 border rounded-md bg-white" value={ventaForm.direccionEnvio?.nombreDestinatario || ''} onChange={(e) => dispatch({ type: 'SET_DIRECCION', field: 'nombreDestinatario', value: e.target.value })} />
                                    <input placeholder="Teléfono" className="w-full px-3 py-2 border rounded-md bg-white" value={ventaForm.direccionEnvio?.telefono || ''} onChange={(e) => dispatch({ type: 'SET_DIRECCION', field: 'telefono', value: e.target.value })} />
                                    <input placeholder="Dirección" className="w-full px-3 py-2 border rounded-md bg-white md:col-span-2" value={ventaForm.direccionEnvio?.direccion || ''} onChange={(e) => dispatch({ type: 'SET_DIRECCION', field: 'direccion', value: e.target.value })} />
                                    <input placeholder="Ciudad" className="w-full px-3 py-2 border rounded-md bg-white" value={ventaForm.direccionEnvio?.ciudad || ''} onChange={(e) => dispatch({ type: 'SET_DIRECCION', field: 'ciudad', value: e.target.value })} />
                                    <input placeholder="Provincia" className="w-full px-3 py-2 border rounded-md bg-white" value={ventaForm.direccionEnvio?.provincia || ''} onChange={(e) => dispatch({ type: 'SET_DIRECCION', field: 'provincia', value: e.target.value })} />
                                    <input placeholder="Código Postal" className="w-full px-3 py-2 border rounded-md bg-white" value={ventaForm.direccionEnvio?.codigoPostal || ''} onChange={(e) => dispatch({ type: 'SET_DIRECCION', field: 'codigoPostal', value: e.target.value })} />
                                </div>
                            </div>
                        )}

                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Productos ({ventaForm.productos.length})</h3>
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto border p-3 rounded-md">
                            {ventaForm.productos.map((prod, index) => (
                                <div key={index} className="flex gap-4 items-center bg-white p-3 rounded-md shadow-sm">
                                    <div className="w-1/2">
                                        <select 
                                            className="w-full border rounded-md p-2 text-sm"
                                            value={prod.idProducto}
                                            onChange={(e) => {
                                                const pInfo = getProductInfo(e.target.value);
                                                dispatch({ type: 'UPDATE_PRODUCT', index, field: 'idProducto', value: e.target.value });
                                                if (pInfo) dispatch({ type: 'UPDATE_PRODUCT', index, field: 'precioUnitario', value: pInfo.precioFinal || pInfo.precioRegular });
                                            }}
                                        >
                                            <option value="">Seleccione Producto</option>
                                            {productosDisponibles.map(p => (
                                                <option key={p.idProducto} value={p.idProducto}>{p.nombreProducto} (Stock: {p.stock})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="w-1/6">
                                        <input type="number" min="1" placeholder="Cant." className="w-full border rounded-md p-2 text-center" 
                                            value={prod.cantidad} 
                                            onChange={(e) => dispatch({ type: 'UPDATE_PRODUCT', index, field: 'cantidad', value: e.target.value })} />
                                    </div>
                                    <div className="w-1/6 text-sm">{formatearMoneda(prod.precioUnitario)}</div>
                                    <div className="w-1/6 text-sm font-semibold">{formatearMoneda(prod.cantidad * prod.precioUnitario)}</div>
                                    <button onClick={() => dispatch({ type: 'REMOVE_PRODUCT', index })} className="text-red-500 hover:text-red-700 font-bold p-1">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => dispatch({ type: 'ADD_PRODUCT', product: { idProducto: "", cantidad: 1, precioUnitario: 0 } })} 
                            className="text-sm bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-4 py-2 rounded-md mb-6 font-medium transition"
                        >
                            + Añadir Producto
                        </button>

                        <div className="flex justify-end items-center gap-3 pt-4 border-t">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cancelar</button>
                            <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                                Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white p-6 w-full animate-fadeIn">
            <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
            {isModalOpen && renderModal()}

            <div className="w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <Globe className="text-indigo-600" size={32} />
                            Ventas Online
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Gestión de pedidos web y envíos.</p>
                    </div>
                    <Link
                        to="/admin/MenuVentas"
                        className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
                    >
                        ← Volver
                    </Link>
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, DNI, Cliente..."
                            value={filtro}
                            onChange={(e) => { setFiltro(e.target.value); setPaginaActual(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                        />
                    </div>

                    {/* SELECTOR FILTRO ESTADO CORREGIDO */}
                    <div className="w-full md:w-48">
                        <select 
                            value={filtroEstado}
                            onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                        >
                            <option value="Todos">📂 Todos</option>
                            <option value="Pendiente">⏳ Pendientes</option>
                            <option value="Retirado">🏪 Retirados</option>
                            <option value="Cancelado">🚫 Cancelados</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
                    {cargando ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando pedidos...</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <table className="w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-indigo-50">
                                    <tr>
                                        <Cabecera titulo="ID" campo="idVentaO" ordenarVentas={ordenarVentas} orden={orden} width="w-16" />
                                        <Cabecera titulo="Cliente" campo="nombreCliente" ordenarVentas={ordenarVentas} orden={orden} width="w-1/5" />
                                        
                                        {/* COLUMNA DNI */}
                                        <Cabecera titulo="DNI" campo="dni" ordenarVentas={ordenarVentas} orden={orden} width="w-24" />
                                        
                                        <Cabecera titulo="Fecha" campo="fechaPago" ordenarVentas={ordenarVentas} orden={orden} width="w-28" />
                                        {/* COLUMNA ENTREGA ELIMINADA */}
                                        <Cabecera titulo="Total" campo="totalPago" ordenarVentas={ordenarVentas} orden={orden} width="w-28" />
                                        <Cabecera titulo="Estado" campo="estado" ordenarVentas={ordenarVentas} orden={orden} width="w-32" />
                                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase w-20">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itemsActuales.length > 0 ? (
                                        itemsActuales.map((venta) => {
                                            // Normalización visual para mostrar en la tabla (Primera mayúscula)
                                            // Esto NO afecta la lógica, solo la visualización
                                            const estadoDB = venta.estado || "";
                                            const estadoVisual = estadoDB.charAt(0).toUpperCase() + estadoDB.slice(1).toLowerCase();
                                            
                                            // Para el value del select, necesitamos el valor exacto que queremos mostrar en las opciones.
                                            // Dado que "estadosPosibles" tiene Capitalizado, usaremos estadoVisual.
                                            // PERO debemos asegurarnos que "Retirado" se muestre si la DB dice "retirado".
                                            let estadoSelect = "Pendiente";
                                            if (estadoVisual === "Retirado") estadoSelect = "Retirado";
                                            if (estadoVisual === "Cancelado") estadoSelect = "Cancelado";
                                            if (estadoVisual === "Pendiente") estadoSelect = "Pendiente";

                                            return (
                                            <tr key={venta.idVentaO} className="hover:bg-indigo-50/30 transition-colors">
                                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{venta.idVentaO}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800 truncate" title={venta.nombreCliente}>{venta.nombreCliente}</td>
                                                
                                                {/* DATO DNI */}
                                                <td className="px-4 py-3 text-sm text-gray-600 font-mono">{venta.dni || venta.dniCliente || '-'}</td>
                                                
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {formatearFecha(venta.fechaPago)} 
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-bold text-indigo-700">
                                                    {formatearMoneda(venta.totalPago)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <select 
                                                        className={`w-full px-2 py-1 rounded-full text-xs font-semibold border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
                                                            estadoSelect === "Retirado" ? "bg-green-100 text-green-800" : 
                                                            estadoSelect === "Pendiente" ? "bg-yellow-100 text-yellow-800" : 
                                                            "bg-red-100 text-red-800"
                                                        }`} 
                                                        value={estadoSelect} 
                                                        onChange={(e) => handleEstadoChange(venta.idVentaO, e.target.value)}
                                                    >
                                                        {estadosPosibles.map(e => <option key={e} value={e} className="bg-white text-gray-900">{e}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        <button 
                                                            onClick={() => handleVerDetalle(venta)}
                                                            className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition inline-flex"
                                                            title="Ver Detalle"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        {/* BOTÓN EDITAR */}
                                                        <button 
                                                            onClick={() => handleEditarVenta(venta)}
                                                            className="p-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition inline-flex"
                                                            title="Editar Venta"
                                                        >
                                                            <Edit size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )})
                                    ) : (
                                        <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">No se encontraron pedidos web.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!cargando && itemsActuales.length > 0 && (
                        <div className="flex justify-center py-6 bg-white border-t border-gray-200">
                            <nav className="flex items-center gap-1">
                                <button onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))} disabled={paginaActual === 1} className={`w-8 h-8 flex items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors ${paginaActual === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>&lt;</button>
                                {getPaginationNumbers().map((num, i) => (
                                    <button key={i} onClick={() => typeof num === 'number' && cambiarPagina(num)} disabled={typeof num !== 'number'} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${num === paginaActual ? 'bg-indigo-600 text-white shadow-md' : typeof num === 'number' ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' : 'text-gray-400'}`}>{num}</button>
                                ))}
                                <button onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))} disabled={paginaActual === totalPaginas} className={`w-8 h-8 flex items-center justify-center rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors ${paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed' : ''}`}>&gt;</button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Cabecera = ({ titulo, campo, ordenarVentas, orden, width }) => (
    <th scope="col" className={`px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-indigo-100 ${width}`} onClick={() => ordenarVentas(campo)}>
        <div className="flex items-center">
            {titulo}
            {orden.campo === campo && (
                <svg className={`ml-1 h-3 w-3 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            )}
        </div>
    </th>
);

export default AdminVentasO;