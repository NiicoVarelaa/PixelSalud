import { useEffect, useState } from "react";
import axios from "axios";

const AdminProductos = () => {
  //estados

  const [productos, setProductos] = useState([]);

  const [editandoId, setEditandoId] = useState(null);

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

  const obtenerProductos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/productos");
      setProductos(res.data);
    } catch (error) {
      console.error("Error al obtener Productos:", error);
    }
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
    if (confirm("¿Estás seguro de que querés eliminar este producto?")) {
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
      obtenerProductos();
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  const iniciarEdicion = (prod) => {
    setEditandoId(prod.idProducto);
    setProductoEditado({
      nombreProducto: prod.nombreProducto,
      descripcion: prod.descripcion,
      precio: prod.precio,
      categoria: prod.categoria,
      img: prod.img,
      stock: prod.stock,
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

  const manejarCambio = (e) => {
    setProductoEditado({ ...productoEditado, [e.target.name]: e.target.value });
  };

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-bold mb-4">Lista de Productos</h2>

      {!mostrarFormulario ? (
        <button
          onClick={() => setMostrarFormulario(true)}
          className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Agregar Producto
        </button>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-4 gap-2">
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
              className="border p-2 rounded"
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
              className="border p-2 rounded"
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
              className="border p-2 rounded"
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
              className="border p-2 rounded"
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
              className="border p-2 rounded"
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
              className="border p-2 rounded"
            />
            
            
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                agregarProducto();
                setMostrarFormulario(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
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
                });
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
        </>
      )}
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">imagen</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Categoria</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.idProducto}>
              <td className="border p-2">
                {editandoId === prod.idProducto ? (
                  <input
                    name="img"
                    value={productoEditado.img || ""}
                    onChange={manejarCambio}
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
              <td className="border p-2">
                {editandoId === prod.idProducto ? (
                  <input
                    name="nombreProducto"
                    value={productoEditado.nombreProducto}
                    onChange={manejarCambio}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  prod.nombreProducto
                )}
              </td>
              <td className="border p-2">
                {editandoId === prod.idProducto ? (
                  <input
                    name="precio"
                    value={productoEditado.precio}
                    onChange={manejarCambio}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  `$${prod.precio}`
                )}
              </td>
              <td className="border p-2">
                {editandoId === prod.idProducto ? (
                  <input
                    name="categoria"
                    value={productoEditado.categoria}
                    onChange={manejarCambio}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  prod.categoria
                )}
              </td>
              <td className="border p-2">
                {editandoId === prod.idProducto ? (
                  <input
                    name="stock"
                    value={productoEditado.stock}
                    onChange={manejarCambio}
                    className="border rounded p-1 w-full"
                  />
                ) : (
                  `$${prod.stock}`
                )}
              </td>
              <td className="border p-2 flex gap-2">
                {editandoId === prod.idProducto ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded"
                      onClick={guardarCambios}
                    >
                      Guardar
                    </button>
                    <button
                      className="bg-gray-500 text-white px-2 py-1 rounded"
                      onClick={cancelarEdicion}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="bg-yellow-400 text-black px-2 py-1 rounded"
                      onClick={() => iniciarEdicion(prod)}
                    >
                      Modificar
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
};

export default AdminProductos;
