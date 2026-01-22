import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; 
import apiClient from '../utils/apiClient'; 
import { useNavigate, useParams } from 'react-router-dom'; // <--- Hooks de Router

const EmpleadoEditarVenta = () => {
  
  const navigate = useNavigate();
  const { idVenta } = useParams(); // <--- Capturamos el ID de la URL (definido en App.jsx como :idVenta)

  // --- Estados ---
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]); 
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [total, setTotal] = useState(0);
  
  // --- Estado de Carga ---
  const [loading, setLoading] = useState(true);

  // 1. CALCULAR TOTAL
  useEffect(() => {
    const nuevoTotal = carrito.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    setTotal(nuevoTotal);
  }, [carrito]);

  // 2. BUSCAR PRODUCTOS
  useEffect(() => {
    if (terminoBusqueda.length < 3) {
      setResultadosBusqueda([]);
      return;
    }
    const timer = setTimeout(() => buscarProductos(terminoBusqueda), 300);
    return () => clearTimeout(timer);
  }, [terminoBusqueda]);

  // =======================================================
  // --- CARGAR DATOS DE LA VENTA (Usando idVenta de la URL) ---
  // =======================================================
  useEffect(() => {
    if (!idVenta) return; 
    
    setLoading(true);
    Swal.fire({ title: 'Cargando Venta...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const cargarDatosVenta = async () => {
      try {
        const [cabeceraRes, detalleRes] = await Promise.all([
          apiClient.get(`/ventasEmpleados/venta/${idVenta}`), 
          apiClient.get(`/ventasEmpleados/detalle/${idVenta}`) 
        ]);

        // 1. Seteamos datos cabecera
        setMetodoPago(cabeceraRes.data.metodoPago);

        // 2. Seteamos carrito
        setCarrito(detalleRes.data.map(prod => ({
          idProducto: prod.idProducto,
          nombreProducto: prod.nombreProducto,
          precioUnitario: prod.precioUnitario,
          cantidad: prod.cantidad,
          // Si tu backend guarda info de receta en el detalle, asignala acá. 
          // Si no, asumimos null o false por defecto al editar.
          recetaFisica: prod.recetaFisica || null 
        })));
        
        Swal.close();

      } catch (error) {
        console.error("Error al cargar datos de la venta:", error);
        Swal.fire('Error', 'No se pudieron cargar los datos de la venta.', 'error');
        navigate('/panelempleados/misventas'); // Si falla, volvemos a la lista
      } finally {
        setLoading(false);
      }
    };

    cargarDatosVenta();
  }, [idVenta, navigate]); // Dependencias actualizadas

  // --- FUNCIONES ---

  const buscarProductos = async (term) => {
    try {
        const response = await apiClient.get('/productos/buscar', { params: { term } });
        if (Array.isArray(response.data)) {
            setResultadosBusqueda(response.data);
        } else {
            setResultadosBusqueda([]);
        }
    } catch (error) { 
        console.error("Error buscando:", error.response?.data || error.message);
        setResultadosBusqueda([]);
    }
  };

  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod);
    setResultadosBusqueda([]);
    setTerminoBusqueda('');
    setCantidad(1);
  };

  const agregarAlCarrito = () => {
    if (!productoSeleccionado) return;
    const cantInt = parseInt(cantidad);

    if (isNaN(cantInt) || cantInt <= 0) {
        Swal.fire('Cantidad no válida', 'Ingresa una cantidad mayor a cero.', 'warning');
        return;
    }
    
    if (cantInt > productoSeleccionado.stock) {
        Swal.fire('Stock insuficiente', `Solo quedan ${productoSeleccionado.stock} unidades.`, 'warning');
        return;
    }

    setCarrito([...carrito, {
        idProducto: productoSeleccionado.idProducto,
        nombreProducto: productoSeleccionado.nombreProducto,
        precioUnitario: productoSeleccionado.precio,
        cantidad: cantInt
    }]);
    setProductoSeleccionado(null);
    setCantidad(1);
  };

  const eliminarDelCarrito = (index) => {
     setCarrito(carrito.filter((_, i) => i !== index));
  };

  // =======================================================
  // --- GUARDAR CAMBIOS ---
  // =======================================================
  const handleGuardarCambios = async () => {
      if (carrito.length === 0) {
        Swal.fire('Ticket vacío', 'No puedes dejar una venta sin productos.', 'info');
        return;
      }
      
      const ventaData = {
          totalPago: total, 
          metodoPago: metodoPago,
          productos: carrito.map(i => ({ 
              idProducto: i.idProducto, 
              cantidad: i.cantidad, 
              precioUnitario: i.precioUnitario 
          }))
      };

      Swal.fire({ title: 'Guardando Cambios...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      try {
          await apiClient.put(`/ventasEmpleados/actualizar/${idVenta}`, ventaData);
          
          Swal.fire(
            '¡Actualizado!',
            `La venta #${idVenta} se modificó con éxito.`,
            'success'
          ).then(() => {
             // Volver a la lista de ventas tras guardar
             navigate('/panelempleados/misventas'); 
          });
          
      } catch (error) { 
          console.error("Error al actualizar venta:", error.response?.data || error.message);
          Swal.fire({
            title: 'Error al Guardar',
            text: error.response?.data?.error || 'Error de conexión.',
            icon: 'error'
          });
      }
  };


  // --- RENDERIZADO ---
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen"></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col animate-fadeIn">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">✍️ Editando Venta #{idVenta}</h1>
        
        {/* BOTÓN CANCELAR */}
        <button 
            onClick={() => navigate('/panelempleados/misventas')} 
            className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
            ⬅ Cancelar y Volver
        </button>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 gap-6">
        
        {/* === LADO IZQUIERDO (Buscador) === */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white p-4 md:p-6 rounded-xl shadow-md order-1 lg:order-1">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">🔍 Buscar Producto</h2>
          <div className="relative">
              <input 
                  type="text" 
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base md:text-lg"
                  placeholder="Escribe nombre del producto..." 
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
              {resultadosBusqueda.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-48 md:max-h-64 overflow-y-auto">
                      {resultadosBusqueda.map(prod => (
                          <li 
                              key={prod.idProducto} 
                              onClick={() => seleccionarProducto(prod)}
                              className="p-3 hover:bg-blue-50 cursor-pointer border-b flex justify-between text-sm md:text-base"
                          >
                              <span className="font-medium truncate mr-2">{prod.nombreProducto}</span>
                              <span className="text-gray-500 whitespace-nowrap">${prod.precio} (Stock: {prod.stock})</span>
                          </li>
                      ))}
                  </ul>
              )}
          </div>
          <div className="mt-6 flex-1 flex flex-col justify-center items-center min-h-[200px]">
            {productoSeleccionado ? (
                <div className="w-full bg-blue-50 p-4 md:p-6 rounded-xl border border-blue-100 text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">{productoSeleccionado.nombreProducto}</h3>
                    <div className="flex justify-center gap-4 md:gap-8 text-gray-600 text-base md:text-lg mb-4 md:mb-6">
                        <p>Precio: <span className="font-bold text-green-600">${productoSeleccionado.precio}</span></p>
                        <p>Stock: <span className="font-bold text-blue-600">{productoSeleccionado.stock}</span></p>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <label className="font-medium text-gray-700">Cantidad:</label>
                        <input 
                            type="number" min="1" max={productoSeleccionado.stock}
                            className="w-20 p-2 text-center text-lg border-2 border-blue-300 rounded-lg focus:border-blue-500 outline-none"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                        />
                    </div>
                    <button onClick={agregarAlCarrito}
                        className="w-full py-3 bg-blue-600 text-white text-lg font-bold rounded-lg hover:bg-blue-700 transition active:scale-95">
                        Agregar al Ticket ⬇️
                    </button>
                </div>
            ) : (
                <div className="text-gray-400 text-center py-8">
                    <p className="text-lg">Busca y selecciona un producto.</p>
                </div>
            )}
          </div>
        </div>

        {/* === LADO DERECHO (Ticket) === */}
        <div className="w-full lg:w-1/2 flex flex-col bg-white p-4 md:p-6 rounded-xl shadow-md order-2 lg:order-2">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
              🧾 Ticket <span className="text-sm font-normal text-gray-500">({carrito.length})</span>
          </h2>
          <div className="flex-1 overflow-auto border rounded-lg max-h-[300px] lg:max-h-none">
              <table className="w-full text-left min-w-[350px]">
                  <tbody className="divide-y divide-gray-100">
                      {carrito.map((item, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                              <td className="p-2 md:p-3 text-sm truncate max-w-[120px]">{item.nombreProducto}</td>
                              <td className="p-2 md:p-3 text-center">{item.cantidad}</td>
                              <td className="p-2 md:p-3 text-right font-medium">${(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                              <td className="p-2 md:p-3 text-center">
                                  <button onClick={() => eliminarDelCarrito(index)} className="text-red-500 hover:bg-red-50 p-1 rounded">🗑️</button>
                              </td>
                          </tr>
                      ))}
                      {carrito.length === 0 && (
                          <tr><td colSpan="5" className="p-8 text-center text-gray-400">El ticket está vacío.</td></tr>
                      )}
                  </tbody>
              </table>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                  <select 
                      value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}
                      className="w-full sm:w-auto p-2 border rounded-md"
                  >
                      <option value="Efectivo">💵 Efectivo</option>
                      <option value="Tarjeta - Débito">💳 Débito</option>
                      <option value="Tarjeta - Crédito">💳 Crédito</option>
                  </select>
                  <div className="text-right w-full sm:w-auto">
                      <p className="text-gray-500 text-sm">Total a Pagar</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-800">${total.toFixed(2)}</p>
                  </div>
              </div>
              
              <button 
                  onClick={handleGuardarCambios}
                  disabled={carrito.length === 0}
                  className={`w-full py-3 md:py-4 text-lg md:text-xl font-bold text-white rounded-xl transition ${
                      carrito.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
              >
                  {carrito.length === 0 ? 'Ticket Vacío' : '💾 GUARDAR CAMBIOS'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoEditarVenta;