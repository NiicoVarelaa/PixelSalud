import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2'; // Importamos SweetAlert

// Asegúrate de que estas rutas sean correctas
import apiClient from '../utils/apiClient'; 
import { useAuthStore } from '../store/useAuthStore';

// Recibimos las props para navegación
const EmpleadoRealizarVenta = ({ onVolver, onVentaExitosa }) => {
  
  // --- ESTADOS ---
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]); // Siempre debe ser un array
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [total, setTotal] = useState(0);

  // Obtenemos el usuario logueado desde Zustand
  const user = useAuthStore((state) => state.user); 
  // Saca el ID (asegúrate que user.idEmpleado o user.id sea correcto)
  const idEmpleado = user?.idEmpleado || user?.id; 

  // --- EFECTOS ---

  // 1. Calcula el total cada vez que cambia el carrito (CON LA CORRECCIÓN)
  useEffect(() => {
    const nuevoTotal = carrito.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    setTotal(nuevoTotal); // ¡Corregido!
  }, [carrito]);

  // 2. Busca productos con debounce
  useEffect(() => {
    if (terminoBusqueda.length < 3) {
      setResultadosBusqueda([]); // Limpia si la búsqueda es corta
      return;
    }
    // Espera 300ms antes de llamar a la API
    const timer = setTimeout(() => buscarProductos(terminoBusqueda), 300);
    return () => clearTimeout(timer);
  }, [terminoBusqueda]);


  // --- FUNCIONES ---

  // 3. Función de Búsqueda (¡IMPORTANTE!)
  const buscarProductos = async (term) => {
    try {
        // (Asegúrate que tu ruta NO lleva /api si ya está en la baseURL)
        const response = await apiClient.get('/productos/buscar', { 
            params: { term } 
        });

        // ¡BLINDAJE! Nos aseguramos que SÓLO un array se guarde en el estado
        if (Array.isArray(response.data)) {
            setResultadosBusqueda(response.data);
        } else {
            // Si la API devuelve un error (ej: {msg: "..."}), evitamos que rompa el .map()
            setResultadosBusqueda([]);
        }
    } catch (error) { 
        console.error("Error buscando:", error.response?.data || error.message);
        // Si hay un error de red (401, 500), también seteamos array vacío
        setResultadosBusqueda([]);
    }
  };

  // 4. Función de Selección (¡AQUÍ ESTÁ LA MAGIA!)
  const seleccionarProducto = (prod) => {
    setProductoSeleccionado(prod);    // <- Muestra el panel de detalle
    setResultadosBusqueda([]);        // <- Oculta la lista de búsqueda
    setTerminoBusqueda('');           // <- Limpia el input
    setCantidad(1);                   // <- Resetea la cantidad
  };

  // 5. Función de Agregar al Carrito
  const agregarAlCarrito = () => {
    // Check 1: ¿Hay un producto seleccionado?
    if (!productoSeleccionado) return; 

    // Parseamos la cantidad, ya que viene de un input
    const cantInt = parseInt(cantidad);

    // Check 2: ¿La cantidad es un número válido y mayor a cero?
    if (isNaN(cantInt) || cantInt <= 0) {
        Swal.fire({
          title: 'Cantidad no válida',
          text: 'Por favor, ingresa una cantidad mayor a cero.',
          icon: 'warning',
          confirmButtonColor: '#d33' // Color rojo para error
        });
        return;
    }
    
    // Check 3: ¿Hay stock suficiente?
    if (cantInt > productoSeleccionado.stock) {
        Swal.fire({
          title: '¡Stock insuficiente!',
          text: `Solo quedan ${productoSeleccionado.stock} unidades disponibles.`,
          icon: 'warning',
          confirmButtonColor: '#d33'
        });
        return;
    }

    // ¡Éxito! Agregamos al carrito
    setCarrito([...carrito, {
        idProducto: productoSeleccionado.idProducto,
        nombreProducto: productoSeleccionado.nombreProducto,
        precioUnitario: productoSeleccionado.precio,
        cantidad: cantInt // Usamos la cantidad parseada
    }]);

    // Limpiamos para la próxima búsqueda
    setProductoSeleccionado(null);
    setCantidad(1); // Reseteamos el input a 1
  };

  // 6. Función de Eliminar del Carrito
  const eliminarDelCarrito = (index) => {
     setCarrito(carrito.filter((_, i) => i !== index));
  };

  // 7. Función de Finalizar Venta
  const finalizarVenta = async () => {
      if (carrito.length === 0) {
        Swal.fire('Ticket vacío', 'Agrega productos antes de finalizar.', 'info');
        return;
      }
      if (!idEmpleado) {
        Swal.fire('Error de Sesión', 'No se pudo identificar al empleado. Inicia sesión de nuevo.', 'error');
        return;
      }
      
      const ventaData = {
          idEmpleado, totalPago: total, metodoPago,
          productos: carrito.map(i => ({ 
              idProducto: i.idProducto, 
              cantidad: i.cantidad, 
              precioUnitario: i.precioUnitario 
          }))
      };

      try {
          // (Asegúrate que tu ruta NO lleva /api si ya está en la baseURL)
          const response = await apiClient.post('/ventasEmpleados/crear', ventaData);
          
          // Limpiamos el formulario
          setCarrito([]);
          setTotal(0);
          setTerminoBusqueda('');
          setProductoSeleccionado(null);

          // Mostramos alerta de éxito con opciones
          Swal.fire({
            title: '¡Venta Registrada!',
            text: `La venta #${response.data.idVentaE} se completó con éxito.`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#5cb85c',
            confirmButtonText: 'Ver "Mis Ventas"',
            cancelButtonText: 'Registrar Nueva Venta'
          }).then((result) => {
            if (result.isConfirmed) {
              onVentaExitosa(); // ¡Navega a Mis Ventas!
            }
            // Si es 'cancel' (Nueva Venta), no hace nada y se queda en la pantalla limpia.
          });
          
      } catch (error) { 
          console.error("Error al registrar venta:", error.response?.data || error.message);
          Swal.fire({
            title: 'Error al Registrar',
            text: error.response?.data?.error || 'Error de conexión. Revisa la consola.',
            icon: 'error'
          });
      }
  };


  // --- RENDERIZADO (JSX) ---
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">🛒 Nueva Venta</h1>
        {onVolver && (
            <button 
                onClick={onVolver} 
                className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            >
                ⬅ Volver al Panel
            </button>
        )}
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
              {/* Esta lista SÓLO se muestra si 'resultadosBusqueda' es un array con items */}
              {resultadosBusqueda.length > 0 && (
                  <ul className="absolute z-20 w-full bg-white border border-gray-200 mt-1 rounded-lg shadow-xl max-h-48 md:max-h-64 overflow-y-auto">
                      {resultadosBusqueda.map(prod => (
                          <li 
                              key={prod.idProducto} 
                              onClick={() => seleccionarProducto(prod)} // <-- ¡ESTA ES LA LÍNEA CRÍTICA!
                              className="p-3 hover:bg-blue-50 cursor-pointer border-b flex justify-between text-sm md:text-base"
                          >
                              <span className="font-medium truncate mr-2">{prod.nombreProducto}</span>
                              <span className="text-gray-500 whitespace-nowrap">${prod.precio} (Stock: {prod.stock})</span>
                          </li>
                      ))}
                  </ul>
              )}
          </div>

          {/* Área de Detalle (Sólo se muestra si 'productoSeleccionado' NO es null) */}
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
                  <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                          <th className="p-2 md:p-3 text-xs md:text-sm font-semibold text-gray-600">Prod.</th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-center">Cant.</th>
                          <th className="p-2 md:p-3 text-xs md:text-sm text-right">Total</th>
                          <th className="p-2 md:p-3"></th>
                      </tr>
                  </thead>
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
              <button onClick={finalizarVenta} disabled={carrito.length === 0}
                  className={`w-full py-3 md:py-4 text-lg md:text-xl font-bold text-white rounded-xl transition ${
                      carrito.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
                  }`}>
                  {carrito.length === 0 ? 'Ticket Vacío' : '✅ CONFIRMAR'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoRealizarVenta;