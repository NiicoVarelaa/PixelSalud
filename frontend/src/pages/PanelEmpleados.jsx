import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// 1. Importa el store de autenticación unificado
import { useAuthStore } from "../store/useAuthStore";
import NavbarEmpleado from "../components/NavbarEmpleado";
import { toast } from "react-toastify";

const PanelEmpleados = () => {
  // 2. Obtiene el usuario del store de autenticación
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [formVisible, setFormVisible] = useState(false);
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([{ idProducto: "", cantidad: "", precio: "" }]);
  const [recetas, setRecetas] = useState([{ idProducto: "", cantidad: "", descripcion: "" }]);
  const [cargarReceta, setCargarReceta] = useState(false);
  const [totalPago, setTotalPago] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  const obtenerVentas = async () => {
    // 3. Usa el ID del usuario del store, si existe
    if (!user?.id) return;
    try {
      const res = await axios.get(`http://localhost:5000/ventasEmpleados/${user.id}`);
      if (res.data) {
        setVentas(res.data);
      }
    } catch (error) {
      console.error("Error al obtener ventas:", error);
      toast.error("No se pudieron cargar las ventas.");
    }
  };

  // 4. El useEffect ahora depende de 'user' para recargar los datos si cambia el usuario
  useEffect(() => {
    // Protección de la ruta: si no hay usuario o no es empleado, redirige
    if (!user || user.rol !== 'empleado') {
        toast.error("Acceso no autorizado.");
        navigate('/login'); // Redirige a la página de login
        return;
    }
    obtenerVentas();
  }, [user, navigate]);

  const agregarProducto = () => {
    setProductos([...productos, { idProducto: "", cantidad: "", precio: "" }]);
  };

  const eliminarProducto = (index) => {
    const updated = [...productos];
    updated.splice(index, 1);
    setProductos(updated);
  };

  const agregarReceta = () => {
    setRecetas([...recetas, { idProducto: "", cantidad: "", descripcion: "" }]);
  };

  const eliminarReceta = (index) => {
    const updated = [...recetas];
    updated.splice(index, 1);
    setRecetas(updated);
  };

  const handleSubmit = async () => {
    if (!totalPago || !metodoPago) {
      toast.warn("Por favor completa el método de pago y el total.");
      return;
    }
    // 5. Obtiene el idEmpleado directamente del store
    if (!user?.id) {
      toast.error("No se pudo identificar al empleado. Inicia sesión de nuevo.");
      return;
    }

    const body = {
      idEmpleado: user.id, 
      totalPago: parseFloat(totalPago),
      metodoPago,
      productos: productos.map(p => ({
        idProducto: parseInt(p.idProducto),
        cantidad: parseInt(p.cantidad),
        precioUnitario: parseFloat(p.precio),
      })),
      recetas: cargarReceta
        ? recetas.map(r => ({
            idProducto: parseInt(r.idProducto),
            cantidad: parseInt(r.cantidad),
            descripcion: r.descripcion
          }))
        : []
    };

    try {
      await axios.post("http://localhost:5000/ventasEmpleados/crear", body);
      toast.success("Venta registrada exitosamente");
      setFormVisible(false);
      // Limpiar formularios
      setProductos([{ idProducto: "", cantidad: "", precio: "" }]);
      setRecetas([{ idProducto: "", cantidad: "", descripcion: "" }]);
      setTotalPago("");
      setMetodoPago("");
      setCargarReceta(false);
      obtenerVentas(); // Recarga la lista de ventas
    } catch (error) {
      console.error("Error al registrar la venta:", error);
      toast.error("Error al registrar la venta");
    }
  };

  // Si el usuario aún no se ha cargado o no es un empleado, no renderiza el panel.
  if (!user || user.rol !== 'empleado') {
      return (
          <div className="flex justify-center items-center h-screen">
              <p>Redirigiendo...</p>
          </div>
      );
  }

  return (
    <>
      <NavbarEmpleado />

      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Ventas Presenciales</h2>
          <button
            className={`px-4 py-2 rounded text-white transition duration-300 ${
              formVisible ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={() => setFormVisible(!formVisible)}
          >
            {formVisible ? "Volver Atrás" : "Registrar Venta"}
          </button>
        </div>

        {formVisible && (
          <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Registrar nueva venta</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                <input
                  type="text"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  placeholder="Ej: Débito, Crédito, Efectivo..."
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total a Pagar</label>
                <input
                  type="number"
                  value={totalPago}
                  onChange={(e) => setTotalPago(e.target.value)}
                  placeholder="Ej: 1500"
                  className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <h3 className="font-semibold mb-2 text-gray-700">Productos</h3>
            {productos.map((p, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                <input
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="ID Producto"
                  value={p.idProducto}
                  onChange={(e) => {
                    const updated = [...productos];
                    updated[index].idProducto = e.target.value;
                    setProductos(updated);
                  }}
                />
                <input
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Cantidad"
                  value={p.cantidad}
                  onChange={(e) => {
                    const updated = [...productos];
                    updated[index].cantidad = e.target.value;
                    setProductos(updated);
                  }}
                />
                <input
                  className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Precio Unitario"
                  value={p.precio}
                  onChange={(e) => {
                    const updated = [...productos];
                    updated[index].precio = e.target.value;
                    setProductos(updated);
                  }}
                />
                <button
                  onClick={() => eliminarProducto(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button onClick={agregarProducto} className="text-blue-600 mt-1 hover:underline">
              + Agregar Producto
            </button>

            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={cargarReceta}
                  onChange={(e) => setCargarReceta(e.target.checked)}
                />
                ¿Cargar receta?
              </label>
            </div>

            {cargarReceta && (
              <>
                <h3 className="font-semibold mt-4 mb-2 text-gray-700">Recetas</h3>
                {recetas.map((r, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                    <input
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="ID Producto"
                      value={r.idProducto}
                      onChange={(e) => {
                        const updated = [...recetas];
                        updated[index].idProducto = e.target.value;
                        setRecetas(updated);
                      }}
                    />
                    <input
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Cantidad"
                      value={r.cantidad}
                      onChange={(e) => {
                        const updated = [...recetas];
                        updated[index].cantidad = e.target.value;
                        setRecetas(updated);
                      }}
                    />
                    <input
                      className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Descripción"
                      value={r.descripcion}
                      onChange={(e) => {
                        const updated = [...recetas];
                        updated[index].descripcion = e.target.value;
                        setRecetas(updated);
                      }}
                    />
                    <button
                      onClick={() => eliminarReceta(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
                <button onClick={agregarReceta} className="text-blue-600 mt-1 hover:underline">
                  + Agregar Receta
                </button>
              </>
            )}

            <div className="mt-6">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition duration-300"
              >
                Confirmar Venta
              </button>
            </div>
          </div>
        )}

        {!formVisible && (
          <div className="bg-white shadow rounded p-4">
            <h3 className="text-xl font-semibold mb-4">Ventas Registradas</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">ID Venta</th>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Precio</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Pago</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((v, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">{v.idVentaE}</td>
                      <td className="px-4 py-2">{v.fechaPago}</td>
                      <td className="px-4 py-2">{v.horaPago}</td>
                      <td className="px-4 py-2">{v.nombreProducto}</td>
                      <td className="px-4 py-2">{v.cantidad}</td>
                      <td className="px-4 py-2">${v.precioUnitario}</td>
                      <td className="px-4 py-2">${v.totalPago}</td>
                      <td className="px-4 py-2">{v.metodoPago}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PanelEmpleados;