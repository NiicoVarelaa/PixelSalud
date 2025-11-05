import { useProductStore } from "../store/useProductStore";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Swal from 'sweetalert2';
import "react-toastify/dist/ReactToastify.css";

const AdminProductos = () => {

  const productos = useProductStore((state) => state.productos);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const categorias = useProductStore((state) => state.categorias)


  const [editandoId, setEditandoId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef();


  const [productoEditado, setProductoEditado] = useState({
    nombreProducto: "",
    descripcion: "",
    precio: "",
    categoria: "",
    img: "",
    stock: "",
  });

  const [nuevoProducto, setNuevoProducto] = useState({
    nombreProducto: "",
    descripcion: "",
    precio: "",
    categoria: "",
    img: "",
    stock: "",
  });

  // Función para formatear el precio
  const formatearPrecio = (precio) => {
    const numero = Number(precio);
    if (isNaN(numero)) return "$0.00";

    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(numero);
  };

  // Cerrar modal al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  const iniciarEdicion = (prod) => {
    setEditandoId(prod.idProducto);
    setProductoEditado({
      ...prod,
      precio: Number(prod.precio) || ""
    });
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setProductoEditado({
      nombreProducto: "",
      descripcion: "",
      precio: "",
      categoria: "",
      img: "",
      stock: "",
    });
  };

  const guardarCambios = async () => {
    try {
      const productoAEnviar = {
        ...productoEditado,
        precio: Number(productoEditado.precio) || 0
      };

      await axios.put(
        `http://localhost:5000/productos/actualizar/${editandoId}`,
        productoAEnviar
      );
      toast.success("Producto actualizado correctamente");
      cancelarEdicion();
      fetchProducts();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast.error("Error al actualizar el producto");
    }
  };

  const eliminarProductos = async (id) => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (resultado.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/productos/eliminar/${id}`);
        toast.success("Producto eliminado correctamente");
        fetchProducts();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error("Error al eliminar el producto");
      }
    }
  };


  const agregarProducto = async () => {
    try {
      const productoAEnviar = {
        ...nuevoProducto,
        precio: Number(nuevoProducto.precio) || 0
      };

      await axios.post("http://localhost:5000/productos/crear", productoAEnviar);
      toast.success("Producto agregado correctamente");
      setIsModalOpen(false);
      setNuevoProducto({
        nombreProducto: "",
        descripcion: "",
        precio: "",
        categoria: "",
        img: "",
        stock: "",
      });
      fetchProducts();
    } catch (error) {
      console.error("Error al agregar producto:", error);
      toast.error("Error al agregar el producto");
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      {/* Modal para agregar producto */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Producto</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL de la imagen</label>
                  <input
                    type="text"
                    name="img"
                    value={nuevoProducto.img}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  {nuevoProducto.img && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Vista previa:</p>
                      <img
                        src={nuevoProducto.img}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded border"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/100'}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto</label>
                  <input
                    type="text"
                    name="nombreProducto"
                    value={nuevoProducto.nombreProducto}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nombre del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    name="descripcion"
                    value={nuevoProducto.descripcion}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows="3"
                    placeholder="Descripción detallada del producto"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      name="precio"
                      value={nuevoProducto.precio}
                      onChange={(e) => setNuevoProducto({
                        ...nuevoProducto,
                        [e.target.name]: e.target.value
                      })}
                      className="w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">ARS</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    name="categoria"
                    value={nuevoProducto.categoria}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias.map((categoria, index) => (
                      <option key={index} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock disponible</label>
                  <input
                    type="number"
                    name="stock"
                    value={nuevoProducto.stock}
                    onChange={(e) => setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={agregarProducto}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Guardar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administración de Productos</h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Agregar Producto
          </button>
        </div>

        {/* Tabla de productos */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-primary-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-580 uppercase tracking-wider">
                  Imagen
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Categoría
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-800 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {productos.map((prod) => (
                <tr key={prod.idProducto} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editandoId === prod.idProducto ? (
                      <input
                        name="img"
                        value={productoEditado.img}
                        onChange={(e) =>
                          setProductoEditado({
                            ...productoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    ) : (
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-md object-cover" src={prod.img} alt={prod.nombreProducto} />
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap max-w-xs"> 
                    {editandoId === prod.idProducto ? (
                      <input
                        name="nombreProducto"
                        value={productoEditado.nombreProducto}
                        onChange={(e) =>
                          setProductoEditado({
                            ...productoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    ) : (
                      
                      <div
                        className="text-sm font-medium text-gray-900 truncate" 
                        title={prod.nombreProducto} 
                      >
                        {prod.nombreProducto}
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    {editandoId === prod.idProducto ? (
                      <div className="relative rounded-md shadow-sm">
                        <span className="text-gray-500 sm:text-sm">$</span>
                        <input
                          type="number"
                          name="precio"
                          value={productoEditado.precio}
                          onChange={(e) =>
                            setProductoEditado({
                              ...productoEditado,
                              [e.target.name]: e.target.value,
                            })
                          }
                          className="w-full pl-7 pr-12 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                        <span className="text-gray-500 sm:text-sm">ARS</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-900">
                        {formatearPrecio(prod.precio)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editandoId === prod.idProducto ? (
                      <select
                        name="categoria"
                        value={productoEditado.categoria}
                        onChange={(e) =>
                          setProductoEditado({
                            ...productoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((categoria, index) => (
                          <option key={index} value={categoria}>
                            {categoria}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm text-gray-900">{prod.categoria}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editandoId === prod.idProducto ? (
                      <input
                        name="stock"
                        value={productoEditado.stock}
                        onChange={(e) =>
                          setProductoEditado({
                            ...productoEditado,
                            [e.target.name]: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                      />
                    ) : (
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${prod.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {prod.stock}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editandoId === prod.idProducto ? (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={guardarCambios}
                          className="flex items-center gap-1 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Guardar
                        </button>
                        <button
                          onClick={cancelarEdicion}
                          className="bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => iniciarEdicion(prod)}
                          className="flex items-center gap-1 bg-secondary-500 hover:bg-secondary-600 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarProductos(prod.idProducto)}
                          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProductos;