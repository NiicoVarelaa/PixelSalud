import { useState, useEffect, useReducer } from "react";
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { useAuthStore } from "../store/useAuthStore";
import { Search, Plus, Eye, Edit, ShoppingBag, XCircle, Trash2, RotateCcw, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";

// --- REDUCER ---
const ventaReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD': return { ...state, [action.field]: action.value };
        case 'LOAD_SALE': return { ...state, ...action.payload };
        case 'ADD_PRODUCT': return { ...state, productos: [...state.productos, action.product] };
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
    const [filtro, setFiltro] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todas");
    const [cargando, setCargando] = useState(true);
    
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [nombreVendedorOriginal, setNombreVendedorOriginal] = useState(""); // Para mostrar en el modal

    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 8; 

    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);
    
    // Buscador Modal
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]); 
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [recetaPresentada, setRecetaPresentada] = useState(false);

    const { user } = useAuthStore();
    const permisos = user?.permisos || {}; 

    // --- AUTO-DETECTAR USUARIO PARA NUEVAS VENTAS ---
    useEffect(() => {
        if (user && !isEditing) {
            // Usamos tu ID (gracias al Empleado Espejo ID 1)
            dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: user.id });
        }
    }, [user, isEditing]);

    const obtenerVentas = async () => {
        try {
            setCargando(true);
            // CAMBIO: Usamos la ruta nueva exclusiva para Admin
            const res = await apiClient.get("/ventasEmpleados/admin/listado");
            const data = Array.isArray(res.data) ? res.data : [];
            setVentas(data);
        } catch (error) {
            console.error("Error al obtener ventas", error);
            toast.error("Error al cargar historial.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerVentas();
    }, []);

    // Calcular Total Automático
    useEffect(() => {
        const nuevoTotal = ventaForm.productos.reduce((acc, prod) => {
            return acc + (Number(prod.cantidad) * Number(prod.precioUnitario));
        }, 0);
        if (ventaForm.totalPago !== nuevoTotal) {
            dispatch({ type: 'SET_FIELD', field: 'totalPago', value: nuevoTotal });
        }
    }, [ventaForm.productos]);

    // Buscador con delay
    useEffect(() => {
        if (terminoBusqueda.length < 3) {
            setResultadosBusqueda([]);
            return;
        }
        const timer = setTimeout(() => buscarProductos(terminoBusqueda), 300);
        return () => clearTimeout(timer);
    }, [terminoBusqueda]);

    const buscarProductos = async (term) => {
        try {
            const response = await apiClient.get('/productos/buscar', { params: { term } });
            if (Array.isArray(response.data)) {
                setResultadosBusqueda(response.data);
            } else {
                setResultadosBusqueda([]);
            }
        } catch (error) { 
            setResultadosBusqueda([]);
        }
    };

    const seleccionarProducto = (prod) => {
        setProductoSeleccionado(prod);
        setResultadosBusqueda([]);
        setTerminoBusqueda('');
        setCantidad(1);
        setRecetaPresentada(false); 
    };

    const agregarAlCarrito = () => {
        if (!productoSeleccionado) return;
        const cantInt = parseInt(cantidad);
        if (isNaN(cantInt) || cantInt <= 0) {
            Swal.fire('Cantidad inválida', 'Ingresa una cantidad mayor a cero.', 'warning');
            return;
        }
        if (cantInt > productoSeleccionado.stock) {
            Swal.fire('Stock insuficiente', `Solo quedan ${productoSeleccionado.stock} unidades.`, 'warning');
            return;
        }
        if ((productoSeleccionado.requiereReceta === 1 || productoSeleccionado.requiereReceta === true) && !recetaPresentada) {
            Swal.fire('⚠️ Requiere Receta', 'Verifica el documento físico.', 'warning');
            return;
        }
        dispatch({ 
            type: 'ADD_PRODUCT', 
            product: {
                idProducto: productoSeleccionado.idProducto,
                nombreProducto: productoSeleccionado.nombreProducto,
                precioUnitario: productoSeleccionado.precio,
                cantidad: cantInt,
                requiereReceta: productoSeleccionado.requiereReceta,
                recetaFisica: recetaPresentada ? "Presentada" : null 
            }
        });
        setProductoSeleccionado(null);
        setCantidad(1);
        setRecetaPresentada(false);
        toast.success("Producto agregado");
    };

    const abrirModalRegistro = () => {
        setIsEditing(false);
        setEditingId(null);
        setNombreVendedorOriginal("");
        dispatch({ type: 'RESET', initialState });
        setProductoSeleccionado(null);
        setTerminoBusqueda('');
        if (user) dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: user.id });
        setIsModalOpen(true);
    };

    const handleEditarVenta = async (venta) => {
        Swal.fire({ title: 'Cargando venta...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            // 1. Traemos los detalles (productos) - Ruta estándar
            const resDetalles = await apiClient.get(`/ventasEmpleados/detalle/${venta.idVentaE}`);
            const detalles = resDetalles.data;
            
            // 2. Traemos la DATA CRUDA usando la NUEVA RUTA ADMIN para obtener el ID real del empleado
            const resVentaRaw = await apiClient.get(`/ventasEmpleados/admin/detalle/${venta.idVentaE}`);
            const datosReales = resVentaRaw.data; 

            const productosFormateados = detalles.map(d => ({
                idProducto: d.idProducto,
                nombreProducto: d.nombreProducto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            }));
            
            setIsEditing(true);
            setEditingId(venta.idVentaE);
            setNombreVendedorOriginal(`${venta.nombreEmpleado} ${venta.apellidoEmpleado}`);

            // 3. Cargamos el formulario con el ID REAL
            dispatch({ 
                type: 'LOAD_SALE', 
                payload: {
                    idEmpleado: datosReales.idEmpleado, 
                    metodoPago: venta.metodoPago,
                    totalPago: venta.totalPago,
                    productos: productosFormateados
                } 
            });
            
            setProductoSeleccionado(null);
            setTerminoBusqueda('');
            Swal.close();
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "No se pudo cargar la venta para editar", "error");
        }
    };

    const handleSubmit = async () => {
        // Validar
        if (!ventaForm.idEmpleado || ventaForm.productos.length === 0) {
            toast.error("El ticket está vacío o falta el ID del empleado.");
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
        } catch (error) {
            toast.error(error.response?.data?.error || "Error al procesar la venta.");
        }
    };

    const handleAnular = (idVentaE) => {
        Swal.fire({
            title: '¿Anular Venta?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, anular'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.put(`/ventasEmpleados/anular/${idVentaE}`);
                    Swal.fire('Anulada', 'Venta anulada.', 'success');
                    obtenerVentas();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo anular.', 'error');
                }
            }
        });
    };

    const handleReactivar = (idVentaE) => {
        Swal.fire({
            title: '¿Reactivar Venta?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10B981',
            confirmButtonText: 'Sí, reactivar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await apiClient.put(`/ventasEmpleados/reactivar/${idVentaE}`);
                    Swal.fire('Reactivada', 'Venta activa de nuevo.', 'success');
                    obtenerVentas();
                } catch (error) {
                    Swal.fire('Error', 'No se pudo reactivar.', 'error');
                }
            }
        });
    };

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

    // --- FILTRADO ---
    const ventasFiltradas = ventas.filter((v) => {
        const termino = filtro.toLowerCase();
        const id = v.idVentaE?.toString() || '';
        const dni = v.dniEmpleado?.toString() || ''; 
        const nombre = v.nombreEmpleado?.toLowerCase() || '';
        const apellido = v.apellidoEmpleado?.toLowerCase() || ''; 
        const nombreCompleto = `${nombre} ${apellido}`;

        const coincideBusqueda = id.includes(termino) || dni.includes(termino) || nombreCompleto.includes(termino);
        const coincideEstado = filtroEstado === "todas" ? true : v.estado === filtroEstado;
        return coincideBusqueda && coincideEstado;
    });

    const indiceUltimoItem = paginaActual * itemsPorPagina;
    const itemsActuales = ventasFiltradas.slice(indiceUltimoItem - itemsPorPagina, indiceUltimoItem);
    const totalPaginas = Math.ceil(ventasFiltradas.length / itemsPorPagina);
    const cambiarPagina = (n) => setPaginaActual(n);
    const getPaginationNumbers = () => {
        const range = [];
        for (let i = 1; i <= totalPaginas; i++) range.push(i);
        return range; 
    };
    const formatearFecha = (fecha) => !fecha ? "-" : new Date(fecha).toLocaleDateString("es-ES");
    const formatearMoneda = (val) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(val) || 0);

    // --- MODAL ---
    const renderModalRegistro = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-hidden">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col animate-fadeIn overflow-hidden">
                <div className="p-4 bg-primary-600 text-white flex justify-between items-center shadow-md shrink-0">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        {isEditing ? <Edit size={24}/> : <ShoppingBag size={24}/>}
                        {isEditing ? `Editar Venta #${editingId}` : "Registrar Nueva Venta"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-white hover:bg-primary-700 p-2 rounded-full transition">
                        <XCircle size={28} />
                    </button>
                </div>
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                    <div className="w-full lg:w-1/2 p-6 bg-gray-50 flex flex-col border-r border-gray-200 overflow-y-auto">
                        <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><Search size={20} /> Buscar Producto</h3>
                        <div className="relative mb-6">
                            <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none shadow-sm" placeholder="Escribe nombre del producto..." value={terminoBusqueda} onChange={(e) => setTerminoBusqueda(e.target.value)} />
                            {resultadosBusqueda.length > 0 && (
                                <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                                    {resultadosBusqueda.map(prod => (
                                        <li key={prod.idProducto} onClick={() => seleccionarProducto(prod)} className="p-3 hover:bg-primary-50 cursor-pointer border-b flex justify-between items-center">
                                            <span className="font-medium truncate mr-2">{prod.nombreProducto}</span>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">Stock: {prod.stock}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex-1 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-white min-h-[300px]">
                            {productoSeleccionado ? (
                                <div className="w-full text-center animate-fadeIn">
                                    <h3 className="text-xl font-bold text-primary-800 mb-2">{productoSeleccionado.nombreProducto}</h3>
                                    <div className="flex justify-center gap-8 text-gray-600 text-lg mb-6">
                                        <p className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">Precio: <span className="font-bold text-green-600">${productoSeleccionado.precio}</span></p>
                                        <p className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">Stock: <span className="font-bold text-blue-600">{productoSeleccionado.stock}</span></p>
                                    </div>
                                    {(productoSeleccionado.requiereReceta === 1 || productoSeleccionado.requiereReceta === true) && (
                                        <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-center gap-3">
                                            <input type="checkbox" id="checkRecetaModal" className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 cursor-pointer" checked={recetaPresentada} onChange={(e) => setRecetaPresentada(e.target.checked)} />
                                            <label htmlFor="checkRecetaModal" className="text-orange-800 font-bold cursor-pointer select-none">📄 Receta Física Verificada</label>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center gap-4 mb-6">
                                        <label className="font-medium text-gray-700">Cantidad:</label>
                                        <input type="number" min="1" max={productoSeleccionado.stock} className="w-24 p-2 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
                                    </div>
                                    <button onClick={agregarAlCarrito} className="w-full py-3 bg-primary-600 text-white text-lg font-bold rounded-lg hover:bg-primary-700 transition shadow-lg transform active:scale-95">Agregar al Ticket ⬇️</button>
                                </div>
                            ) : (
                                <div className="text-gray-400 text-center"><ShoppingBag size={48} className="mx-auto mb-2 opacity-50"/><p>Busca y selecciona un producto para agregarlo.</p></div>
                            )}
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2 p-6 flex flex-col bg-white overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">🧾 Ticket de Venta <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-xs">{ventaForm.productos.length} items</span></h3>
                            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full border">
                                <UserCircle size={16} className="text-gray-500"/>
                                <span className="text-xs font-bold text-gray-600 uppercase">
                                    {isEditing && nombreVendedorOriginal ? `Editando a: ${nombreVendedorOriginal}` : (user.nombre || `Admin (ID: ${user.id})`)}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                            <table className="w-full text-left">
                                <thead className="bg-gray-100 sticky top-0"><tr><th className="p-3 text-xs font-bold text-gray-500 uppercase">Prod.</th><th className="p-3 text-xs font-bold text-gray-500 uppercase text-center">Cant.</th><th className="p-3 text-xs font-bold text-gray-500 uppercase text-right">Subtotal</th><th className="p-3"></th></tr></thead>
                                <tbody className="divide-y divide-gray-100">
                                    {ventaForm.productos.map((item, index) => (
                                        <tr key={index} className="hover:bg-gray-50 group">
                                            <td className="p-3 text-sm"><div className="font-medium text-gray-800">{item.nombreProducto}</div>{item.recetaFisica && (<span className="inline-block bg-orange-100 text-orange-800 text-[10px] px-1.5 rounded font-bold mt-1">Rx</span>)}</td>
                                            <td className="p-3 text-center text-sm">{item.cantidad}</td>
                                            <td className="p-3 text-right text-sm font-bold text-gray-700">{formatearMoneda(item.cantidad * item.precioUnitario)}</td>
                                            <td className="p-3 text-center"><button onClick={() => dispatch({ type: 'REMOVE_PRODUCT', index })} className="text-red-400 hover:text-red-600 p-1 opacity-0 group-hover:opacity-100 transition"><Trash2 size={16} /></button></td>
                                        </tr>
                                    ))}
                                    {ventaForm.productos.length === 0 && (<tr><td colSpan="4" className="p-8 text-center text-gray-400 italic">El ticket está vacío.</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Método de Pago</label><select value={ventaForm.metodoPago} onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'metodoPago', value: e.target.value })} className="p-2 border border-gray-300 rounded-md bg-white focus:ring-1 focus:ring-primary-500 outline-none text-sm w-40"><option value="Efectivo">💵 Efectivo</option><option value="Tarjeta">💳 Tarjeta</option><option value="Transferencia">🏦 Transferencia</option></select></div>
                                <div className="text-right"><span className="block text-gray-500 text-xs uppercase">Total Final</span><span className="text-3xl font-extrabold text-primary-700">{formatearMoneda(ventaForm.totalPago)}</span></div>
                            </div>
                            <button onClick={handleSubmit} disabled={ventaForm.productos.length === 0} className={`w-full py-3 rounded-lg font-bold text-lg shadow-md transition ${ventaForm.productos.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700 active:scale-95'}`}>{isEditing ? "Guardar Cambios" : "✅ Confirmar Venta"}</button>
                        </div>
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
                    <div><h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2"><ShoppingBag className="text-primary-600" size={32} /> Ventas Empleados</h1><p className="text-gray-500 mt-1 text-sm">Gestiona y registra las ventas del local.</p></div>
                    <div className="flex gap-3"><button onClick={abrirModalRegistro} className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg transition shadow-md font-medium cursor-pointer"><Plus size={20} /> Nueva Venta</button><Link to="/admin/MenuVentas" className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer font-medium">← Volver</Link></div>
                </div>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative w-full md:w-96"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="text-gray-400" size={18} /></div><input type="text" placeholder="Buscar por ID, DNI o Empleado..." value={filtro} onChange={(e) => { setFiltro(e.target.value); setPaginaActual(1); }} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-shadow" /></div>
                    <div className="w-full md:w-48"><select value={filtroEstado} onChange={(e) => { setFiltroEstado(e.target.value); setPaginaActual(1); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"><option value="todas">📁 Todas</option><option value="completada">✅ Completadas</option><option value="anulada">🚫 Anuladas</option></select></div>
                </div>
                <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col border border-gray-100">
                    {cargando ? (<div className="p-12 text-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-4"></div><p className="text-gray-500">Cargando...</p></div>) : (
                        <div className="w-full">
                            <table className="w-full divide-y divide-gray-200 table-fixed">
                                <thead className="bg-primary-50">
                                    <tr>
                                        <th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[5%]">ID</th><th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[17%]">Empleado</th><th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">DNI</th><th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[8%]">Detalle</th><th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">Fecha</th><th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[8%]">Hora</th><th className="px-2 py-3 text-left text-xs font-bold text-gray-600 uppercase w-[10%]">Método</th><th className="px-2 py-3 text-right text-xs font-bold text-gray-600 uppercase w-[11%]">Total</th><th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[10%]">Estado</th><th className="px-2 py-3 text-center text-xs font-bold text-gray-600 uppercase w-[11%]">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {itemsActuales.length > 0 ? (
                                        itemsActuales.map((venta) => (
                                            <tr key={venta.idVentaE} className={`hover:bg-gray-50 transition-colors ${venta.estado === 'anulada' ? 'bg-red-50/50' : ''}`}>
                                                <td className="px-2 py-3 text-gray-500 font-mono text-xs break-all leading-tight">#{venta.idVentaE}</td>
                                                <td className="px-2 py-3 text-sm font-medium text-gray-800 whitespace-normal leading-tight">{venta.nombreEmpleado} {venta.apellidoEmpleado}</td>
                                                <td className="px-2 py-3 text-sm text-gray-600 font-mono truncate">{venta.dniEmpleado || '-'}</td>
                                                <td className="px-2 py-3 text-center"><button onClick={() => handleVerDetalle(venta.idVentaE)} className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition" title="Ver Ticket"><Eye size={16} /></button></td>
                                                <td className="px-2 py-3 text-sm text-gray-600">{formatearFecha(venta.fechaPago)}</td>
                                                <td className="px-2 py-3 text-sm text-gray-500 font-mono">{venta.horaPago ? venta.horaPago.slice(0, 5) : '-'}</td>
                                                <td className="px-2 py-3"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium border border-gray-200 capitalize truncate block">{venta.metodoPago}</span></td>
                                                <td className="px-2 py-3 text-right text-sm font-bold text-primary-700">{formatearMoneda(venta.totalPago)}</td>
                                                <td className="px-2 py-3 text-center"><span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${venta.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{venta.estado}</span></td>
                                                <td className="px-2 py-3 text-center">
                                                    <div className="flex gap-1 justify-center">
                                                        {venta.estado === 'completada' ? (
                                                            <>
                                                                {!!permisos.modificar_ventasE && (<button onClick={() => handleEditarVenta(venta)} className="p-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition" title="Editar Venta"><Edit size={16} /></button>)}
                                                                {!!permisos.modificar_ventasE && (<button onClick={() => handleAnular(venta.idVentaE)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition" title="Anular Venta"><Trash2 size={16} /></button>)}
                                                            </>
                                                        ) : (
                                                            !!permisos.modificar_ventasE && (<button onClick={() => handleReactivar(venta.idVentaE)} className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition" title="Reactivar Venta"><RotateCcw size={16} /></button>)
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (<tr><td colSpan="10" className="px-6 py-8 text-center text-gray-400 text-sm">No se encontraron ventas.</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {!cargando && itemsActuales.length > 0 && (<div className="flex justify-center py-6 bg-white border-t border-gray-200"><nav className="flex items-center gap-1"><button onClick={() => cambiarPagina(Math.max(1, paginaActual - 1))} disabled={paginaActual === 1} className={`w-8 h-8 flex items-center justify-center rounded-md text-primary-600 hover:bg-primary-50 transition-colors ${paginaActual === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>&lt;</button>{getPaginationNumbers().map((num, i) => (<button key={i} onClick={() => typeof num === 'number' && cambiarPagina(num)} disabled={typeof num !== 'number'} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${num === paginaActual ? 'bg-primary-600 text-white shadow-md' : typeof num === 'number' ? 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50' : 'text-gray-400'}`}>{num}</button>))}<button onClick={() => cambiarPagina(Math.min(totalPaginas, paginaActual + 1))} disabled={paginaActual === totalPaginas} className={`w-8 h-8 flex items-center justify-center rounded-md text-primary-600 hover:bg-primary-50 transition-colors ${paginaActual === totalPaginas ? 'opacity-50 cursor-not-allowed' : ''}`}>&gt;</button></nav></div>)}
                </div>
            </div>
        </div>
    );
};

export default AdminVentasE;