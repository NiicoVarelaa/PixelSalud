import { useState, useEffect, useReducer } from "react";
import apiClient from "../utils/apiClient";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// --- 1. REDUCER (Misma lógica funcional que ya teníamos) ---
const ventaReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'SET_DIRECCION':
            return { ...state, direccionEnvio: { ...state.direccionEnvio, [action.field]: action.value } };
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

const AdminVentasO = () => {
    // --- ESTADO INICIAL ---
    const initialState = {
        idCliente: "",
        metodoPago: "Efectivo",
        tipoEntrega: "Retiro",
        direccionEnvio: {
            nombreDestinatario: "",
            telefono: "",
            direccion: "",
            ciudad: "",
            provincia: "",
            codigoPostal: ""
        },
        totalPago: 0,
        productos: []
    };

    const [ventaForm, dispatch] = useReducer(ventaReducer, initialState);
    
    // Estados de datos
    const [ventas, setVentas] = useState([]);
    const [ventasFiltradas, setVentasFiltradas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    
    // Estados de UI
    const [filtro, setFiltro] = useState("");
    const [orden, setOrden] = useState({ campo: "fechaPago", direccion: "desc" });
    const [cargando, setCargando] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const estadosPosibles = ["Pendiente", "Enviado", "Entregado", "Retirado", "Cancelado"];

    // --- CARGA DE DATOS ---
    const obtenerDatos = async () => {
        try {
            setCargando(true);
            const [resVentas, resProd, resCli] = await Promise.all([
                apiClient.get("/ventasOnline/todas"),
                apiClient.get("/productos"),
                apiClient.get("/clientes")
            ]);

            // Normalización de respuesta por si el backend cambia estructura
            const dataVentas = resVentas.data.results || resVentas.data || [];
            const dataProd = resProd.data.results || resProd.data || [];
            const dataCli = resCli.data.results || resCli.data || [];

            setVentas(dataVentas);
            setVentasFiltradas(dataVentas);
            setProductosDisponibles(dataProd);
            setClientes(dataCli);

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

    // --- CALCULO AUTOMATICO DEL TOTAL ---
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

    // --- FILTROS Y ORDEN ---
    useEffect(() => {
        const resultados = ventas.filter((venta) => {
            const busqueda = filtro.toLowerCase();
            return (
                (venta.nombreCliente?.toLowerCase() || "").includes(busqueda) ||
                (venta.nombreProducto?.toLowerCase() || "").includes(busqueda) ||
                (venta.estado?.toLowerCase() || "").includes(busqueda) ||
                (venta.metodoPago?.toLowerCase() || "").includes(busqueda)
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

    // --- ACCIONES ---
    const registrarVenta = async () => {
        if (!ventaForm.idCliente || ventaForm.productos.length === 0) {
            toast.error("Selecciona un cliente y al menos un producto.");
            return;
        }
        try {
            await apiClient.post("/ventaOnline/crear", ventaForm);
            toast.success("Venta Online registrada con éxito.");
            setIsModalOpen(false);
            obtenerDatos();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Error al registrar la venta.");
        }
    };

    const handleEstadoChange = async (idVentaO, nuevoEstado) => {
        try {
            await apiClient.put("/ventaOnline/estado", { idVentaO, nuevoEstado });
            
            // Actualización optimista
            const newVentas = ventas.map((v) => v.idVentaO === idVentaO ? { ...v, estado: nuevoEstado } : v);
            setVentas(newVentas);
            setVentasFiltradas(newVentas.filter(v => ventasFiltradas.some(f => f.idVentaO === v.idVentaO))); 
            toast.success(`Estado actualizado a ${nuevoEstado}`);
        } catch (error) {
            toast.error("Error al cambiar estado.");
        }
    };

    // --- UTILS (Formato idéntico a VentasE) ---
    const formatearFecha = (fecha) => !fecha ? "N/A" : new Date(fecha).toLocaleDateString("es-ES");
    const formatearHora = (hora) => (!hora || typeof hora !== "string") ? "N/A" : hora.slice(0, 5);
    const formatearMoneda = (valor) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(valor) || 0);
    const getProductInfo = (id) => productosDisponibles.find(p => p.idProducto === Number(id));

    // --- MODAL (Estilo idéntico a VentasE) ---
    const abrirModal = () => {
        dispatch({ type: 'RESET', initialState });
        setIsModalOpen(true);
    };

    const renderModal = () => {
        const productosEnVenta = productosDisponibles.filter(p => ventaForm.productos.some(d => d.idProducto === p.idProducto));
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrar Nueva Venta Online</h2>

                        {/* INPUTS DE CABECERA (Estilo VentasE) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border p-4 rounded-md bg-gray-50">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={ventaForm.idCliente}
                                    onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'idCliente', value: e.target.value })}
                                >
                                    <option value="">Seleccione Cliente</option>
                                    {clientes.map(c => (
                                        <option key={c.idCliente} value={c.idCliente}>
                                            {c.nombreCliente} {c.apellidoCliente}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
                                <select 
                                    className="w-full px-3 py-2 border rounded-md"
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
                                    className="w-full px-3 py-2 border rounded-md"
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

                        {/* Formulario de Dirección (Solo si es Envio) */}
                        {ventaForm.tipoEntrega === "Envio" && (
                            <div className="mb-6 border border-blue-100 bg-blue-50 p-4 rounded-lg shadow-sm">
                                <h3 className="font-semibold text-blue-800 mb-3 text-sm uppercase tracking-wide">Datos de Envío</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <input placeholder="Nombre Destinatario" className="w-full px-3 py-2 border rounded-md bg-white" 
                                        onChange={(e) => dispatch({type: 'SET_DIRECCION', field: 'nombreDestinatario', value: e.target.value})} />
                                    <input placeholder="Teléfono" className="w-full px-3 py-2 border rounded-md bg-white" 
                                        onChange={(e) => dispatch({type: 'SET_DIRECCION', field: 'telefono', value: e.target.value})} />
                                    <input placeholder="Dirección" className="w-full px-3 py-2 border rounded-md bg-white md:col-span-2" 
                                        onChange={(e) => dispatch({type: 'SET_DIRECCION', field: 'direccion', value: e.target.value})} />
                                    <input placeholder="Ciudad" className="w-full px-3 py-2 border rounded-md bg-white" 
                                        onChange={(e) => dispatch({type: 'SET_DIRECCION', field: 'ciudad', value: e.target.value})} />
                                    <input placeholder="Provincia" className="w-full px-3 py-2 border rounded-md bg-white" 
                                        onChange={(e) => dispatch({type: 'SET_DIRECCION', field: 'provincia', value: e.target.value})} />
                                    <input placeholder="Código Postal" className="w-full px-3 py-2 border rounded-md bg-white" 
                                        onChange={(e) => dispatch({type: 'SET_DIRECCION', field: 'codigoPostal', value: e.target.value})} />
                                </div>
                            </div>
                        )}

                        {/* DETALLES DE PRODUCTOS */}
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">Productos ({ventaForm.productos.length})</h3>
                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto border p-3 rounded-md">
                            {ventaForm.productos.map((prod, index) => (
                                <div key={index} className="flex gap-4 items-center bg-white p-3 rounded-md shadow-sm">
                                    <div className="w-1/2">
                                        <select 
                                            className="w-full border rounded-md p-2"
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
                                        <input type="number" min="1" placeholder="Cant." className="w-full border rounded-md p-2" 
                                            value={prod.cantidad} 
                                            onChange={(e) => dispatch({ type: 'UPDATE_PRODUCT', index, field: 'cantidad', value: e.target.value })} />
                                    </div>
                                    <div className="w-1/6 text-sm">{formatearMoneda(prod.precioUnitario)}</div>
                                    <div className="w-1/6 text-sm font-semibold">{formatearMoneda(prod.cantidad * prod.precioUnitario)}</div>
                                    <button onClick={() => dispatch({ type: 'REMOVE_PRODUCT', index })} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={() => dispatch({ type: 'ADD_PRODUCT', product: { idProducto: "", cantidad: 1, precioUnitario: 0 } })}
                            className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md mb-6"
                        >
                            + Añadir Producto
                        </button>

                        <div className="flex justify-between items-center pt-4 border-t">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">Cerrar</button>
                            <button onClick={registrarVenta} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors">Registrar Venta</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDER PRINCIPAL (Estilo Idéntico a VentasE) ---
    return (
        <div className="min-h-screen bg-white p-4 md:p-8">
            <ToastContainer position="top-right" autoClose={3000} />
            {isModalOpen && renderModal()}

            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administración de Ventas Online</h1>
                    
                    <button 
                        onClick={abrirModal}
                        className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
                    >
                        Registrar Venta
                    </button>
                </div>

                {/* Buscador (Mismo estilo) */}
                <div className="relative w-full md:w-64 mb-6">
                    <input 
                        type="text" 
                        placeholder="Buscar ventas..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={filtro} 
                        onChange={(e) => setFiltro(e.target.value)}
                    />
                    <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                {/* Tabla (Estructura idéntica) */}
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
                                        <Cabecera titulo="ID Venta" campo="idVentaO" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Cliente" campo="nombreCliente" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Producto" campo="nombreProducto" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Total" campo="totalPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Pago" campo="metodoPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Fecha" campo="fechaPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Hora" campo="horaPago" ordenarVentas={ordenarVentas} orden={orden} />
                                        <Cabecera titulo="Estado" campo="estado" ordenarVentas={ordenarVentas} orden={orden} />
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {ventasFiltradas.length > 0 ? (
                                        ventasFiltradas.map((venta, index) => (
                                            <tr key={venta.idVentaO || index} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.idVentaO}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{venta.nombreCliente || "Cliente N/A"}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-[150px]" title={venta.nombreProducto}>{venta.nombreProducto}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-primary-600">{formatearMoneda(venta.totalPago)}</td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        venta.metodoPago === "Efectivo" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                                                    }`}>
                                                        {venta.metodoPago || "N/A"}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatearFecha(venta.fechaPago)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatearHora(venta.horaPago)}</td>

                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {/* Usamos un Select "disfrazado" para mantener la función rápida de cambio de estado de online pero con el look similar */}
                                                    <select 
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold border-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 ${
                                                            venta.estado === "Entregado" || venta.estado === "Retirado" ? "bg-green-100 text-green-800" : 
                                                            venta.estado === "Pendiente" ? "bg-yellow-100 text-yellow-800" :
                                                            venta.estado === "Enviado" ? "bg-blue-100 text-blue-800" :
                                                            "bg-red-100 text-red-800"
                                                        }`}
                                                        value={venta.estado || "Pendiente"}
                                                        onChange={(e) => handleEstadoChange(venta.idVentaO, e.target.value)}
                                                    >
                                                        {estadosPosibles.map(e => <option key={e} value={e} className="bg-white text-gray-900">{e}</option>)}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No se encontraron ventas online.
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

// Componente Cabecera (Copiado exactamente de VentasE para mantener el estilo con la flecha SVG)
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

export default AdminVentasO;