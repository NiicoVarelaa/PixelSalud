

const AdminCards = ({ productos}) => {

  const ultimoProducto = productos[productos.length - 1];

  if (!ultimoProducto) {
    return <p>No hay productos</p>;
  }

  return (
    <>
      <div className="flex items-center justify-center flex-wrap gap-10 w-full">
      <div className="bg-indigo-500/5 border border-gray-500/20 text-sm text-gray-500 flex flex-col items-center w-128 rounded-lg">
        <div className="flex items-center justify-between w-full px-4 py-2">
          <div className="flex items-center justify-between gap-3">
            <p className="text-lg text-gray-800">Último Producto</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 w-full p-4 pb-2 rounded-b-lg bg-white border-t border-gray-500/20">
          <div className="flex flex-col items-start w-full gap-2">
            <p className="text-sm text-gray-500">Nombre:</p>
            <p className="text-lg text-gray-800 font-semibold">{ultimoProducto.nombreProducto}</p>

            <p className="text-sm text-gray-500">Descripción:</p>
            <p className="text-gray-700">{ultimoProducto.descripcion}</p>

            <p className="text-sm text-gray-500">Categoría:</p>
            <p className="text-gray-700">{ultimoProducto.categoria}</p>

            <p className="text-sm text-gray-500">Precio:</p>
            <p className="text-blue-600 font-bold">${ultimoProducto.precio}</p>

            <p className="text-sm text-gray-500">Stock:</p>
            <p className="text-gray-700">{ultimoProducto.stock}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminCards;
