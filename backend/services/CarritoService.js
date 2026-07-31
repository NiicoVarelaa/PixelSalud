const carritoRepository = require("../repositories/CarritoRepository");
const productosRepository = require("../repositories/ProductosRepository");
const {
  createNotFoundError,
  createValidationError,
  createConflictError,
} = require("../errors");

const obtenerCarrito = async (idCliente) => {
  const items = await carritoRepository.findByClienteWithProducts(idCliente);
  return items;
};

const agregarProducto = async (idCliente, idProducto, cantidad = 1) => {
  const cantidadInt = parseInt(cantidad);
  if (isNaN(cantidadInt) || cantidadInt < 1) {
    throw createValidationError("La cantidad debe ser un número mayor a 0");
  }

  const producto = await productosRepository.findByIdWithOfertas(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  if (!producto.activo) {
    throw createConflictError("El producto no está disponible");
  }

  const cantidadActualEnCarrito = await carritoRepository.getItemQuantity(
    idCliente,
    idProducto,
  );
  const cantidadTotal = cantidadActualEnCarrito + cantidadInt;

  if (cantidadTotal > producto.stock) {
    throw createConflictError(
      `Stock insuficiente. Disponible: ${producto.stock}, En carrito: ${cantidadActualEnCarrito}`,
    );
  }

  if (cantidadActualEnCarrito > 0) {
    await carritoRepository.incrementQuantity(
      idCliente,
      idProducto,
      cantidadInt,
    );
    return {
      message: "Cantidad del producto actualizada en el carrito",
      accion: "incrementado",
      cantidadTotal,
    };
  }

  const nuevoItem = await carritoRepository.create({
    idCliente,
    idProducto,
    cantidad: cantidadInt,
  });

  return {
    message: "Producto agregado al carrito",
    accion: "creado",
    idCarrito: nuevoItem.insertId,
    cantidad: cantidadInt,
  };
};

const incrementarCantidad = async (idCliente, idProducto) => {
  const itemExiste = await carritoRepository.existsItem(idCliente, idProducto);
  if (!itemExiste) {
    throw createNotFoundError("Producto no encontrado en el carrito");
  }

  const producto = await productosRepository.findByIdWithOfertas(idProducto);
  if (!producto) {
    throw createNotFoundError("Producto no encontrado");
  }

  const cantidadActual = await carritoRepository.getItemQuantity(
    idCliente,
    idProducto,
  );
  const cantidadNueva = cantidadActual + 1;

  if (cantidadNueva > producto.stock) {
    throw createConflictError(
      `No se puede incrementar. Stock máximo: ${producto.stock}`,
    );
  }

  await carritoRepository.incrementQuantity(idCliente, idProducto, 1);

  return {
    message: "Cantidad aumentada correctamente",
    cantidadNueva,
  };
};

const decrementarCantidad = async (idCliente, idProducto) => {
  const itemExiste = await carritoRepository.existsItem(idCliente, idProducto);
  if (!itemExiste) {
    throw createNotFoundError("Producto no encontrado en el carrito");
  }

  await carritoRepository.decrementQuantity(idCliente, idProducto);

  const cantidadNueva = await carritoRepository.getItemQuantity(
    idCliente,
    idProducto,
  );

  return {
    message: "Cantidad disminuida correctamente",
    cantidadNueva,
  };
};

const eliminarProducto = async (idCliente, idProducto) => {
  const itemExiste = await carritoRepository.existsItem(idCliente, idProducto);
  if (!itemExiste) {
    throw createNotFoundError("Producto no encontrado en el carrito");
  }

  const result = await carritoRepository.deleteItem(idCliente, idProducto);

  if (result.affectedRows === 0) {
    throw createNotFoundError("No se pudo eliminar el producto del carrito");
  }

  return {
    message: "Producto eliminado del carrito correctamente",
  };
};

const vaciarCarrito = async (idCliente) => {
  const cantidadItems = await carritoRepository.countByCliente(idCliente);

  if (cantidadItems === 0) {
    return {
      message: "El carrito ya estaba vacío",
      itemsEliminados: 0,
    };
  }

  const result = await carritoRepository.deleteByCliente(idCliente);

  return {
    message: "Carrito vaciado correctamente",
    itemsEliminados: result.affectedRows,
  };
};

const obtenerEstadisticas = async (idCliente) => {
  const items = await carritoRepository.findByClienteWithProducts(idCliente);
  const totalItems = await carritoRepository.getTotalItems(idCliente);

  const subtotal = items.reduce(
    (sum, item) => sum + parseFloat(item.precioFinal) * item.cantidad,
    0,
  );
  const subtotalSinDescuento = items.reduce(
    (sum, item) => sum + parseFloat(item.precioRegular) * item.cantidad,
    0,
  );
  const descuentoTotal = subtotalSinDescuento - subtotal;

  return {
    cantidadProductos: items.length,
    totalItems,
    subtotal: subtotal.toFixed(2),
    descuentoTotal: descuentoTotal.toFixed(2),
    items,
  };
};

module.exports = {
  obtenerCarrito,
  agregarProducto,
  incrementarCantidad,
  decrementarCantidad,
  eliminarProducto,
  vaciarCarrito,
  obtenerEstadisticas,
};
