import { useState, useEffect, useReducer } from "react";
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useAuthStore } from "../store/useAuthStore";
import { Search, Plus, Eye, Edit, ShoppingBag, XCircle, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

// --- REDUCER ---
const ventaReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD': return { ...state, [action.field]: action.value };
        case 'LOAD_SALE': return { ...state, ...action.payload };
        case 'ADD_PRODUCT': return { ...state, productos: [...state.productos, action.product] };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                productos: state.productos.map((prod, index) =>
                    index === action.index ? { ...prod, [action.field]: action.value } : prod
                ),
            };
        case 'REMOVE_PRODUCT':
            return { ...state, productos: state.productos.filter((_, index) => index !== action.index) };
        case 'RESET': return action.initialState;
        default: return state;
    }
};

const AdminVentasE = () => {
    const initialState = {
        idEmpleado: "",
        totalPago: 0,
        metodoPago: "Efectivo",
        productos: [],
    };

    const [ventas, setVentas] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [filtro, setFiltro] = useState("");
    
    // --- CAMBIO AQUI: Por defecto inicia en "todas" ---
    const [filtroEstado, setFiltroEstado] = useState("todas"); 
    
    const [cargando, setCargando] = useState(true);
    
    // Estados de Edición
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 6; 

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);

    const { user } = useAuthStore();
    const permisos = user?.permisos || {}; 

    // Auto-asignar ID de empleado
    useEffect(() => {
        if (user && (user.rol === "empleado" || user.rol === "admin") && !isEditing) {
            dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: user.id });
        }
    }, [user, isEditing]);

    // --- CARGA DE DATOS ---
    const obtenerVentas = async () => {
        try {
            setCargando(true);
            const res = await apiClient.get("/ventasEmpleados");
            const data = Array.isArray(res.data) ? res.data : [];
            setVentas(data);
        } catch (error) {
            console.error("Error al obtener ventas", error);
            toast.error("Error al cargar historial.");
        } finally {
            setCargando(false);
        }
    };

    const fetchProductosDisponibles = async () => {
        try {
            const res = await apiClient.get("/productos");
            const prods = Array.isArray(res.data) ? res.data.filter(p => p.activo && p.stock > 0) : [];
            setProductosDisponibles(prods);
        } catch (error) {
            console.error("Error productos:", error);
        }
    };

    useEffect(() => {
        obtenerVentas();
        fetchProductosDisponibles();
    }, []);

    // Calculo automático del total
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


    // --- ACCIONES DE APERTURA DE MODAL ---

    const abrirModalRegistro = () => {
        setIsEditing(false);
        setEditingId(null);
        dispatch({ type: 'RESET', initialState });
        if (user) dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: user.id });
        setIsModalOpen(true);
    };

    const handleEditarVenta = async (venta) => {
        Swal.fire({ title: 'Cargando datos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const res = await apiClient.get(`/ventasEmpleados/detalle/${venta.idVentaE}`);
            const detalles = res.data;

            const productosFormateados = detalles.map(d => ({
                idProducto: d.idProducto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            }));

            setIsEditing(true);
            setEditingId(venta.idVentaE);
            
            dispatch({ 
                type: 'LOAD_SALE', 
                payload: {
                    idEmpleado: user.rol === 'admin' ? venta.idEmpleado : user.id,
                    metodoPago: venta.metodoPago,
                    totalPago: venta.totalPago,
                    productos: productosFormateados
                } 
            });

            Swal.close();
            setIsModalOpen(true);

        } catch (error) {
            Swal.fire("Error", "No se pudo cargar la venta para editar", "error");
        }
    };

    // --- GUARDAR ---
    const handleSubmit = async () => {
        if (!ventaForm.idEmpleado || ventaForm.productos.length === 0) {
            toast.error("Faltan datos (Empleado o Productos)");
            return;
        }

        try {
            if (isEditing) {
                await apiClient.put(`/ventasEmpleados/actualizar/${editingId}`, ventaForm);
                toast.success("Venta actualizada correctamente.");
            } else {
                await apiClient.post("/ventasEmpleados/crear", ventaForm);
                toast.success("Venta registrada con éxito.");
            }

            setIsModalOpen(false);
            obtenerVentas();
            fetchProductosDisponibles(); 
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Error al procesar la venta.");
        }
    };

    // --- ANULAR VENTA ---
    const handleAnular = (idVentaE) => {
        Swal.fire({
            title: '¿Anular Venta?',
            text: `Se devolverá el stock y la venta pasará a estado "Anulada".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, anular'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.put(`/ventasEmpleados/anular/${idVentaE}`);
                    Swal.fire('Anulada', 'La venta ha sido anulada.', 'success');
                    obtenerVentas();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo anular la venta.', 'error');
                }
            }
        });
    };

    // --- VER DETALLE (TICKET) ---
    const handleVerDetalle = async (idVentaE) => {
        Swal.fire({ title: 'Cargando ticket...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const res = await apiClient.get(`/ventasEmpleados/detalle/${idVentaE}`);
            const detalles = res.data;
            const totalCalculado = detalles.reduce((acc, item) => acc + (item.cantidad * item.precioUnitario), 0);

            let rowsHtml = detalles.map(d => `
                <tr class="border-b border-gray-100 last:border-0">
                    <td class="px-4 py-2 text-left text-gray-700 text-xs">${d.nombreProducto}</td>
                    <td class="px-4 py-2 text-center text-gray-600 text-xs">${d.cantidad}</td>
                    <td class="px-4 py-2 text-right text-gray-500 text-xs">$${new Intl.NumberFormat("es-AR").format(d.precioUnitario)}</td>
                    <td class="px-4 py-2 text-right font-bold text-gray-800 text-xs">$${new Intl.NumberFormat("es-AR").format(d.cantidad * d.precioUnitario)}</td>
                </tr>
            `).join('');

            Swal.fire({
                title: `<div class="text-lg font-bold text-gray-800">🧾 Ticket #${idVentaE}</div>`,
                html: `
                    <div class="mt-2 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <table class="min-w-full text-sm">
                            <thead class="bg-gray-100 text-xs font-bold text-gray-500 uppercase">
                                <tr>
                                    <th class="px-4 py-2 text-left w-5/12">Prod</th>
                                    <th class="px-4 py-2 text-center w-2/12">Cant</th>
                                    <th class="px-4 py-2 text-right w-2/12">Unit</th>
                                    <th class="px-4 py-2 text-right w-3/12">Sub</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-100">${rowsHtml}</tbody>
                            <tfoot class="bg-blue-50">
                                <tr>
                                    <td colspan="3" class="px-4 py-2 text-right font-bold text-gray-600 text-xs">TOTAL:</td>
                                    <td class="px-4 py-2 text-right font-bold text-blue-700 text-sm">$${new Intl.NumberFormat("es-AR").format(totalCalculado)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                `,
                width: '500px',
                confirmButtonText: 'Cerrar',
                confirmButtonColor: '#3B82F6'
            });
        } catch (error) {
            Swal.fire("Error", "No se pudo cargar el detalle", "error");
        }
    };

    // --- FILTROS Y PAGINACIÓN ---
    const ventasFiltradas = ventas.filter((v) => {
        const coincideBusqueda = 
            (v.nombreEmpleado?.toLowerCase() || "").includes(filtro.toLowerCase()) ||
            v.idVentaE?.toString().includes(filtro);

        const coincideEstado = filtroEstado === "todas" 
            ? true 
            : v.estado === filtroEstado;

        return coincideBusqueda && coincideEstado;
    });

    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const indicePrimerItem = indiceUltimoItem - itemsPorPagina;
    const itemsActuales = ventasFiltradas.slice(indicePrimerItem, indiceUltimoItem);
    const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);

    const cambiarPagina = (n) => setPaginaActual(n);
    
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
    const getProductInfo = (id) => productosDisponibles.find(p => p.idProducto === Number(id));

    // --- RENDER MODAL ---
    const renderModalRegistro = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        {isEditing ? `✏️ Editar Venta #${editingId}` : "🛒 Registrar Nueva Venta"}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border p-4 rounded-lg bg-gray-50">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Empleado ID</label>
                            <input 
                                type="number" 
                                value={ventaForm.idEmpleado} 
                                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: e.target.value })} 
                                className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                                disabled={user.rol !== 'admin'} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Método de Pago</label>
                            <select 
                                value={ventaForm.metodoPago} 
                                onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'metodoPago', value: e.target.value })} 
                                className="w-full px-3 py-2 border rounded-md bg-white focus:ring-2 focus:ring-primary-500 outline-none"
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Tarjeta">Tarjeta</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                        </div>
                        <div className="text-right">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Total a Pagar</label>
                            <p className="text-2xl font-extrabold text-primary-600">{formatearMoneda(ventaForm.totalPago)}</p>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-700 mb-2 uppercase">Detalle de Productos</h3>
                    <div className="space-y-2 mb-4 max-h-60 overflow-y-auto border p-2 rounded-lg bg-gray-50">
                        {ventaForm.productos.map((prod, index) => (
                            <div key={index} className="flex gap-2 items-center bg-white p-2 rounded border shadow-sm">
                                <div className="flex-grow">
                                    <select
                                        value={prod.idProducto}
                                        onChange={(e) => {
                                            const pInfo = getProductInfo(e.target.value);
                                            dispatch({ type: 'UPDATE_PRODUCT', index, field: 'idProducto', value: e.target.value });
                                            if (pInfo) dispatch({ type: 'UPDATE_PRODUCT', index, field: 'precioUnitario', value: pInfo.precioFinal || pInfo.precioRegular || 0 });
                                        }}
                                        className="w-full border rounded p-1 text-sm focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="">Seleccionar Producto...</option>
                                        {productosDisponibles.map(p => (
                                            <option key={p.idProducto} value={p.idProducto}>{p.nombreProducto} (Stock: {p.stock})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-20">
                                    <input 
                                        type="number" 
                                        placeholder="Cant" 
                                        value={prod.cantidad} 
                                        onChange={(e) => dispatch({ type: 'UPDATE_PRODUCT', index, field: 'cantidad', value: e.target.value })} 
                                        className="w-full border rounded p-1 text-sm text-center" 
                                        min="1" 
                                    />
                                </div>
                                <div className="w-24 text-right text-sm font-mono text-gray-600">
                                    {formatearMoneda(prod.precioUnitario)}
                                </div>
                                <button onClick={() => dispatch({ type: 'REMOVE_PRODUCT', index })} className="text-red-500 hover:text-red-700 p-1">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {ventaForm.productos.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No hay productos agregados</p>}
                    </div>

                    <button 
                        onClick={() => dispatch({ type: 'ADD_PRODUCT', product: { idProducto: "", cantidad: 1, precioUnitario: 0 } })} 
                        className="text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-md font-medium transition"
                    >
                        + Agregar Producto
                    </button>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                        <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition">Cancelar</button>
                        <button onClick={handleSubmit} className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition shadow-lg shadow-primary-500/30">
                            {isEditing ? "Guardar Cambios" : "Confirmar Venta"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white p-6 w-full animate-fadeIn">
            <ToastContainer position="top-right" autoClose={3000} theme="colored"/>
            {isModalOpen && renderModalRegistro()}

            <div className="w-full mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <ShoppingBag className="text-primary-600" size={32} />
                            Ventas Empleados
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">Gestiona y registra las ventas del local.</p>
                    </div>
                    <div className="flex gap-3">
                    <button
                        onClick={abrirModalRegistro}
                        className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg transition shadow-md font-medium"
                    >
                        <Plus size={20} /> Nueva Venta
                    </button>
                    <Link
                        to="/admin/MenuVentas"
                        className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium"
                    >
                        ← Volver
                    </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por ID, Empleado..."
                            value={filtro}
                            onChange={(e) => { setFiltro(e.target.value); setPaginaActual(1); }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow"
                        />
                    </div>
                    
                    {/* SELECTOR DE ESTADO */}
                    <div className="w-full md:w-48">
                        <select 
                            value={filtroEstado}
                            onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                        >
                            <option value="todas">📁 Todas</option>
                            <option value="completada">✅ Completadas</option>
                            <option value="anulada">🚫 Anuladas</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
                    {cargando ? (
                        <div className="p-12 text-center">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div>
                            <p className="text-gray-500">Cargando...</p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <table className="w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-primary-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-20">ID</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-1/4">Empleado</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-32">Fecha</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase w-24">Pago</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase w-32">Total</th>
                                        <th className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase w-24">Estado</th>
                                        <th className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase w-32">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itemsActuales.length > 0 ? (
                                        itemsActuales.map((venta) => (
                                            <tr key={venta.idVentaE} className={`hover:bg-gray-50 transition-colors ${venta.estado === 'anulada' ? 'bg-red-50/50' : ''}`}>
                                                <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{venta.idVentaE}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-800 truncate">{venta.nombreEmpleado}</td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {formatearFecha(venta.fechaPago)} 
                                                    <span className="text-gray-400 text-xs ml-1">{venta.horaPago?.slice(0, 5)}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200">
                                                        {venta.metodoPago}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-sm font-bold text-primary-700">
                                                    {formatearMoneda(venta.totalPago)}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        venta.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {venta.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex gap-2 justify-end">
                                                        {/* BOTÓN VER TICKET (SIEMPRE VISIBLE) */}
                                                        <button 
                                                            onClick={() => handleVerDetalle(venta.idVentaE)}
                                                            className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                                                            title="Ver Ticket"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        {/* ACCIONES SOLO SI ESTÁ COMPLETADA */}
                                                        {venta.estado === 'completada' && (
                                                            <>
                                                                {!!permisos.modificar_ventasE && (
                                                                    <button
                                                                        onClick={() => handleEditarVenta(venta)}
                                                                        className="p-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition"
                                                                        title="Editar Venta"
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                )}
                                                                {!!permisos.modificar_ventasE && (
                                                                    <button 
                                                                        onClick={() => handleAnular(venta.idVentaE)}
                                                                        className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                                                                        title="Anular Venta"
                                                                    >
                                                                        <XCircle size={16} />
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="7" className="px-6 py-8 text-center text-gray-400 text-sm">No se encontraron ventas con este criterio.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {!cargando && itemsActuales.length > 0 && (
                        <div className="flex justify-center py-6 bg-white border-t border-gray-200">
                            <nav className="flex items-center gap-1">
                                <button onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))} disabled={paginaActual === 1} className={`w-8 h-8 flex items-center justify-center rounded-md text-primary-600 hover:bg-primary-50 transition-colors ${paginaActual === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>&lt;</button>
                                {getPaginationNumbers().map((num, i) => (
                                    <button key={i} onClick={() => typeof num === 'number' && cambiarPagina(num)} disabled={typeof num !== 'number'} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${num === paginaActual ? 'bg-primary-600 text-white shadow-md' : typeof num === 'number' ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' : 'text-gray-400'}`}>{num}</button>
                                ))}
                                <button onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))} disabled={paginaActual === totalPaginas} className={`w-8 h-8 flex items-center justify-center rounded-md text-primary-600 hover:bg-primary-50 transition-colors ${paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed' : ''}`}>&gt;</button>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminVentasE;