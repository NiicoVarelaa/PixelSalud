import { useState } from "react";
import axios from "axios";

const AdminProductos = ({ productos, obtenerProductos }) => {
  const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

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

  const iniciarEdicion = (prod) => {
    setEditandoId(prod.idProducto);
    setProductoEditado({ ...prod });
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
      await axios.put(
        `http://localhost:5000/productos/actualizar/${editandoId}`,
        productoEditado
      );
      cancelarEdicion();
      obtenerProductos();
    } catch (error) {
      console.error("Error al guardar cambios:", error);
    }
  };

  const eliminarProductos = async (id) => {
    if (confirm("¿Eliminar este producto?")) {
      try {
        await axios.delete(`http://localhost:5000/productos/eliminar/${id}`);
        obtenerProductos();
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const agregarProducto = async () => {
    try {
      await axios.post("http://localhost:5000/productos/crear", nuevoProducto);
      setMostrarFormulario(false);
      obtenerProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
  <h2 className="text-2xl font-semibold text-gray-800">Lista de Productos</h2>

  {!mostrarFormulario ? (
    <button
      onClick={() => setMostrarFormulario(true)}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >
      Agregar Producto
    </button>
  ) : (
    <div className="w-full bg-white p-4 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          name="img"
          value={nuevoProducto.img}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="URL de imagen"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="nombreProducto"
          value={nuevoProducto.nombreProducto}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Nombre"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="descripcion"
          value={nuevoProducto.descripcion}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Descripción"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="precio"
          value={nuevoProducto.precio}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Precio"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="categoria"
          value={nuevoProducto.categoria}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Categoría"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="stock"
          value={nuevoProducto.stock}
          onChange={(e) =>
            setNuevoProducto({
              ...nuevoProducto,
              [e.target.name]: e.target.value,
            })
          }
          placeholder="Stock"
          className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => {
            agregarProducto();
            setMostrarFormulario(false);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Confirmar
        </button>

        <button
          onClick={() => {
            setMostrarFormulario(false);
            setNuevoProducto({
              nombreProducto: "",
              descripcion: "",
              precio: "",
              categoria: "",
              img: "",
              stock: "",
            });
          }}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancelar
        </button>
      </div>
    </div>
  )}
</div>

      <div className="overflow-x-auto rounded-lg border bg-white shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Imagen</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.idProducto} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">
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
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    <img
                      src={prod.img}
                      alt={prod.nombreProducto}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                </td>
                <td className="px-4 py-2">
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
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    prod.nombreProducto
                  )}
                </td>
                <td className="px-4 py-2">
                  {editandoId === prod.idProducto ? (
                    <input
                      name="precio"
                      value={productoEditado.precio}
                      onChange={(e) =>
                        setProductoEditado({
                          ...productoEditado,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    `$${prod.precio}`
                  )}
                </td>
                <td className="px-4 py-2">
                  {editandoId === prod.idProducto ? (
                    <input
                      name="categoria"
                      value={productoEditado.categoria}
                      onChange={(e) =>
                        setProductoEditado({
                          ...productoEditado,
                          [e.target.name]: e.target.value,
                        })
                      }
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    prod.categoria
                  )}
                </td>
                <td className="px-4 py-2">
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
                      className="border rounded p-1 w-full"
                    />
                  ) : (
                    prod.stock
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {editandoId === prod.idProducto ? (
                    <>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
                        onClick={guardarCambios}
                      >
                        Guardar
                      </button>
                      <button
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                        onClick={cancelarEdicion}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded"
                        onClick={() => iniciarEdicion(prod)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => eliminarProductos(prod.idProducto)}
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProductos;
