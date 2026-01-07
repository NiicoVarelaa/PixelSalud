import { useState, useEffect, useReducer } from "react";
// 1. USAMOS apiClient
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "../store/useAuthStore"; 

// --- REDUCER (Misma lógica, sin cambios) ---
const ventaReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_VENTA':
            return action.venta;
        case 'ADD_PRODUCT':
            return { ...state, productos: [...state.productos, action.product] };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                productos: state.productos.map((prod, index) =>
                    index === action.index ? { ...prod, [action.field]: action.value } : prod
                ),
            };
        case 'REMOVE_PRODUCT':
            return { ...state, productos: state.productos.filter((_, index) => index !== action.index) };
        case 'RESET':
            return action.initialState;
        default:
            return state;
    }
};

const AdminVentasE = () => {
    const initialState = {
        idVentaE: null,
        idEmpleado: "", 
        totalPago: 0,
        metodoPago: "Efectivo",
        productos: [], 
        estado: "completada" 
    };

    const [ventas, setVentas] = useState([]);
    const [filtro, setFiltro] = useState("");
    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [orden, setOrden] = useState({ campo: "fechaPago", direccion: "desc" });
    const [cargando, setCargando] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);
    const [productosDisponibles, setProductosDisponibles] = useState([]); 

    // apiClient maneja el token, solo necesitamos el user para el ID por defecto
    const user = useAuthStore((state) => state.user);
    
    useEffect(() => {
        if (user && (user.rol === "empleado" || user.rol === "admin")) {
            dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: user.id });
        }
    }, [user]);

    // 2. ELIMINAMOS getConfig() (apiClient lo hace solo)

    const obtenerVentas = async () => {
        try {
            setCargando(true);
            // 3. USAMOS apiClient Y RUTA RELATIVA
            const res = await apiClient.get("/ventasEmpleados");
            const data = Array.isArray(res.data) ? res.data : (res.data.msg ? [] : res.data);

            setVentas(data || []);
            setVentasFiltradas(data || []);
        } catch (error) {
            console.error("Error al obtener las ventas", error);
            toast.error("Error al cargar el historial de ventas.");
        } finally {
            setCargando(false);
        }
    };
    
    const fetchProductosDisponibles = async () => {
        try {
            // Usamos apiClient también aquí por consistencia
            const res = await apiClient.get("/productos"); 
            setProductosDisponibles(res.data);
        } catch (error) {
            console.error("Error al obtener productos disponibles:", error);
        }
    };

    useEffect(() => {
        obtenerVentas();
        fetchProductosDisponibles(); 
    }, []); // El array vacío está bien porque apiClient gestiona el token internamente

    const iniciarEdicion = async (ventaCabecera) => {
        try {
            // 1. Obtener los detalles (apiClient)
            const resDetalle = await apiClient.get(`/ventasEmpleados/detalle/${ventaCabecera.idVentaE}`); 
            const detalles = resDetalle.data;

            // 2. Obtener la cabecera (apiClient)
            const resCabecera = await apiClient.get(`/ventasEmpleados/venta/${ventaCabecera.idVentaE}`); 
            const cabecera = resCabecera.data;
            
            const productosDetalle = detalles.map(d => ({
                idProducto: d.idProducto,
                cantidad: d.cantidad,
                precioUnitario: d.precioUnitario
            }));

            dispatch({
                type: 'SET_VENTA',
                venta: {
                    idVentaE: cabecera.idVentaE,
                    idEmpleado: ventaCabecera.idEmpleado,
                    totalPago: cabecera.totalPago,
                    metodoPago: cabecera.metodoPago,
                    productos: productosDetalle,
                    estado: cabecera.estado
                }
            });

            setIsEditing(true);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error al cargar la venta para edición:", error);
            toast.error("No se pudo cargar la venta completa.");
        }
    };
    
    const abrirModalRegistro = () => {
        dispatch({ type: 'RESET', initialState });
        // Restablecer ID empleado si el usuario está logueado
        if (user && (user.rol === "empleado" || user.rol === "admin")) {
            dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: user.id });
        }
        setIsEditing(false);
        setIsModalOpen(true);
    };

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


    // --- CRUD OPERACIONES CON API CLIENT ---

    const registrarVenta = async () => {
        if (!ventaForm.idEmpleado || ventaForm.productos.length === 0) {
            toast.error("Faltan datos (Empleado o Productos)");
            return;
        }
        
        try {
            await apiClient.post("/ventasEmpleados/crear", ventaForm);
            toast.success("Venta registrada con éxito.");
            setIsModalOpen(false);
            obtenerVentas();
            // Actualizar productos para reflejar nuevo stock
            fetchProductosDisponibles(); 
        } catch (error) {
            console.error("Error al registrar venta:", error);
            toast.error(error.response?.data?.error || "Error al registrar venta. Revisa el stock.");
        }
    };

    const guardarCambiosVenta = async () => {
        if (ventaForm.productos.length === 0) {
            toast.error("La venta debe tener al menos un producto.");
            return;
        }

        try {
            await apiClient.put(`/ventasEmpleados/actualizar/${ventaForm.idVentaE}`, ventaForm);
            toast.success("Venta actualizada con éxito.");
            setIsModalOpen(false);
            obtenerVentas();
            fetchProductosDisponibles();
        } catch (error) {
            console.error("Error al actualizar venta:", error);
            toast.error(error.response?.data?.error || "Error al actualizar venta. Revisa el stock.");
        }
    };

    // --- FILTROS Y ORDENACIÓN (Sin cambios) ---

    useEffect(() => {
        const resultados = ventas.filter((venta) => {
            const busqueda = filtro.toLowerCase();
            return (
                (venta.nombreEmpleado?.toLowerCase() || "").includes(busqueda) ||
                (venta.metodoPago?.toLowerCase() || "").includes(busqueda) ||
                (venta.fechaPago || "").includes(busqueda) ||
                (venta.estado?.toLowerCase() || "").includes(busqueda)
            );
        });
        setVentasFiltradas(resultados);
    }, [filtro, ventas]);

    const ordenarVentas = (campo) => {
        const direccion = orden.campo === campo && orden.direccion === "asc" ? "desc" : "asc";
        setOrden({ campo, direccion });

        setVentasFiltradas([...ventasFiltradas].sort((a, b) => {
            const valA = a[campo] || "";
            const valB = b[campo] || "";

            if (valA < valB) return direccion === "asc" ? -1 : 1;
            if (valA > valB) return direccion === "asc" ? 1 : -1;
            return 0;
        }));
    };

    // --- UTILS ---

    const formatearFecha = (fecha) => {
        if (!fecha) return "N/A";
        return new Date(fecha).toLocaleDateString("es-ES");
    };

    const formatearHora = (hora) => {
        if (!hora || typeof hora !== "string") return "N/A";
        return hora.slice(0, 5);
    };

    const formatearMoneda = (valor) => {
        const num = Number(valor) || 0;
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
        }).format(num);
    };
    
    const getProductInfo = (idProducto) => {
        return productosDisponibles.find(p => p.idProducto === Number(idProducto));
    };


    // --- RENDER MODAL ---

    const renderModal = () => {
        const productosEnVenta = productosDisponibles.filter(p => !isEditing || ventaForm.productos.some(d => d.idProducto === p.idProducto));

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            {isEditing ? `Editar Venta #${ventaForm.idVentaE}` : "Registrar Nueva Venta"}
                        </h2>
                        
                        {/* INPUTS DE CABECERA */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border p-4 rounded-md bg-gray-50">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Empleado ID</label>
                                <input
                                    type="number"
                                    value={ventaForm.idEmpleado}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'idEmpleado', value: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    disabled={!isEditing && (user.rol === "empleado" || user.rol === "admin")} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                                <select
                                    value={ventaForm.metodoPago}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'metodoPago', value: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                    disabled={ventaForm.estado === 'anulada'}
                                >
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Transferencia">Transferencia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700">Total a Pagar</label>
                                <p className="mt-2 text-lg font-extrabold text-primary-600">{formatearMoneda(ventaForm.totalPago)}</p>
                            </div>
                        </div>

                        {/* DETALLES DE PRODUCTOS */}
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Productos ({ventaForm.productos.length})</h3>
                        
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto border p-3 rounded-md">
                            {ventaForm.productos.map((prod, index) => (
                                <div key={index} className="flex gap-4 items-center bg-white p-3 rounded-md shadow-sm">
                                    <div className="w-1/2">
                                        <select
                                            value={prod.idProducto}
                                            onChange={(e) => {
                                                const selectedProduct = getProductInfo(e.target.value);
                                                dispatch({ 
                                                    type: 'UPDATE_PRODUCT', 
                                                    index, 
                                                    field: 'idProducto', 
                                                    value: e.target.value 
                                                });
                                                if (selectedProduct) {
                                                    dispatch({ 
                                                        type: 'UPDATE_PRODUCT', 
                                                        index, 
                                                        field: 'precioUnitario', 
                                                        value: selectedProduct.precioFinal || selectedProduct.precioRegular || 0
                                                    });
                                                }
                                            }}
                                            className="w-full border rounded-md p-2"
                                            disabled={ventaForm.estado === 'anulada'}
                                        >
                                            <option value="">Seleccione Producto</option>
                                            {productosEnVenta.map((p) => (
                                                <option key={p.idProducto} value={p.idProducto}>
                                                    {p.nombreProducto} ({p.stock} en Stock)
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="w-1/6">
                                        <input
                                            type="number"
                                            placeholder="Cant."
                                            value={prod.cantidad}
                                            onChange={(e) => dispatch({ type: 'UPDATE_PRODUCT', index, field: 'cantidad', value: e.target.value })}
                                            className="w-full border rounded-md p-2"
                                            min="1"
                                            disabled={ventaForm.estado === 'anulada'}
                                        />
                                    </div>

                                    <div className="w-1/6 text-sm">
                                        {formatearMoneda(prod.precioUnitario)}
                                    </div>

                                    <div className="w-1/6 text-sm font-semibold">
                                        {formatearMoneda(Number(prod.cantidad) * Number(prod.precioUnitario))}
                                    </div>
                                    
                                    <button
                                        onClick={() => dispatch({ type: 'REMOVE_PRODUCT', index })}
                                        className="text-red-500 hover:text-red-700"
                                        disabled={ventaForm.estado === 'anulada'}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        <button
                            onClick={() => dispatch({ type: 'ADD_PRODUCT', product: { idProducto: "", cantidad: 1, precioUnitario: 0 } })}
                            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md mb-6"
                            disabled={ventaForm.estado === 'anulada'}
                        >
                            + Añadir Producto
                        </button>

                        {/* FOOTER Y ACCIONES */}
                        <div className="flex justify-between items-center pt-4 border-t">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cerrar
                            </button>
                            {ventaForm.estado !== 'anulada' && (
                                <button
                                    onClick={isEditing ? guardarCambiosVenta : registrarVenta}
                                    className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                                >
                                    {isEditing ? "Guardar Cambios" : "Registrar Venta"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    // --- RENDER COMPONENTE PRINCIPAL ---

    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <ToastContainer position="top-right" autoClose={3000} />
            {isModalOpen && renderModal()}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ventas Realizadas por Empleados</h1>
                    
                    <button
                        onClick={abrirModalRegistro}
                        className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
                    >
                        Registrar Venta
                    </button>
                </div>
                
                <div className="relative w-full md:w-64 mb-6">
                    <input
                        type="text"
                        placeholder="Buscar ventas..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <svg
                        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>


                {cargando ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <Cabecera titulo="ID Venta" campo="idVentaE" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Empleado" campo="nombreEmpleado" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Total" campo="totalPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Pago" campo="metodoPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Fecha" campo="fechaPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Hora" campo="horaPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Estado" campo="estado" ordenarVentas={ordenarVentas} orden={orden} />
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ventasFiltradas.length > 0 ? (
                                        ventasFiltradas.map((venta, index) => (
                                            <tr key={venta.idVentaE || index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta?.idVentaE}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta?.nombreEmpleado || "N/A"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">{formatearMoneda(venta?.totalPago)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        venta?.metodoPago === "Efectivo" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                                    }`}>
                                                        {venta?.metodoPago || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatearFecha(venta?.fechaPago)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatearHora(venta?.horaPago)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        venta?.estado === "completada" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}>
                                                        {venta?.estado || "N/A"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex gap-2 justify-end">
                                                        <button 
                                                            onClick={() => iniciarEdicion(venta)}
                                                            disabled={venta?.estado === 'anulada'}
                                                            className={`text-white px-3 py-1 rounded-md text-xs transition-colors ${venta?.estado === 'anulada' ? 'bg-gray-400 cursor-not-allowed' : 'bg-secondary-500 hover:bg-secondary-600'}`}
                                                        >
                                                            Editar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No se encontraron ventas que coincidan con tu búsqueda.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Cabecera = ({ titulo, campo, ordenarVentas, orden }) => (
    <th
        scope="col"
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
        onClick={() => ordenarVentas(campo)}
    >
        <div className="flex items-center">
            {titulo}
            {orden.campo === campo && (
                <svg
                    className={`ml-1 h-4 w-4 ${orden.direccion === "asc" ? "transform rotate-180" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
        </div>
    </th>
);

export default AdminVentasE;