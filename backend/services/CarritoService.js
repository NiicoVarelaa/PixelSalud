const carritoRepository = require("../repositories/CarritoRepository");
const productosRepository = require("../repositories/ProductosRepository");
const { NotFoundError, ValidationError, ConflictError } = require("../errors");

/**
 * Servicio para la lógica de negocio del carrito de compras
 * Maneja validaciones y operaciones complejas del carrito
 */

/**
 * Obtiene el carrito de un cliente con productos y ofertas
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Array>} Items del carrito
 */
const obtenerCarrito = async (idCliente) => {
  const items = await carritoRepository.findByClienteWithProducts(idCliente);
  return items;
};

/**
 * Agrega un producto al carrito o incrementa su cantidad si ya existe
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @param {number} cantidad - Cantidad a agregar
 * @returns {Promise<Object>} Resultado de la operación
 */
const agregarProducto = async (idCliente, idProducto, cantidad = 1) => {
  // Validar cantidad
  const cantidadInt = parseInt(cantidad);
  if (isNaN(cantidadInt) || cantidadInt < 1) {
    throw new ValidationError("La cantidad debe ser un número mayor a 0");
  }

  // Verificar que el producto existe y está activo
  const producto = await productosRepository.findByIdWithOfertas(idProducto);
  if (!producto) {
    throw new NotFoundError("Producto no encontrado");
  }

  if (!producto.activo) {
    throw new ConflictError("El producto no está disponible");
  }

  // Verificar stock disponible
  const cantidadActualEnCarrito = await carritoRepository.getItemQuantity(
    idCliente,
    idProducto,
  );
  const cantidadTotal = cantidadActualEnCarrito + cantidadInt;

  if (cantidadTotal > producto.stock) {
    throw new ConflictError(
      `Stock insuficiente. Disponible: ${producto.stock}, En carrito: ${cantidadActualEnCarrito}`,
    );
  }

  // Si el producto ya está en el carrito, incrementar cantidad
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

  // Si no existe, crear nuevo item
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

/**
 * Incrementa en 1 la cantidad de un producto en el carrito
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
const incrementarCantidad = async (idCliente, idProducto) => {
  // Verificar que el item existe en el carrito
  const itemExiste = await carritoRepository.existsItem(idCliente, idProducto);
  if (!itemExiste) {
    throw new NotFoundError("Producto no encontrado en el carrito");
  }

  // Verificar stock disponible
  const producto = await productosRepository.findByIdWithOfertas(idProducto);
  if (!producto) {
    throw new NotFoundError("Producto no encontrado");
  }

  const cantidadActual = await carritoRepository.getItemQuantity(
    idCliente,
    idProducto,
  );
  const cantidadNueva = cantidadActual + 1;

  if (cantidadNueva > producto.stock) {
    throw new ConflictError(
      `No se puede incrementar. Stock máximo: ${producto.stock}`,
    );
  }

  await carritoRepository.incrementQuantity(idCliente, idProducto, 1);

  return {
    message: "Cantidad aumentada correctamente",
    cantidadNueva,
  };
};

/**
 * Decrementa en 1 la cantidad de un producto en el carrito (mínimo 1)
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
const decrementarCantidad = async (idCliente, idProducto) => {
  // Verificar que el item existe en el carrito
  const itemExiste = await carritoRepository.existsItem(idCliente, idProducto);
  if (!itemExiste) {
    throw new NotFoundError("Producto no encontrado en el carrito");
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

/**
 * Elimina un producto específico del carrito
 * @param {number} idCliente - ID del cliente
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object>} Resultado de la operación
 */
const eliminarProducto = async (idCliente, idProducto) => {
  // Verificar que el item existe
  const itemExiste = await carritoRepository.existsItem(idCliente, idProducto);
  if (!itemExiste) {
    throw new NotFoundError("Producto no encontrado en el carrito");
  }

  const result = await carritoRepository.deleteItem(idCliente, idProducto);

  if (result.affectedRows === 0) {
    throw new NotFoundError("No se pudo eliminar el producto del carrito");
  }

  return {
    message: "Producto eliminado del carrito correctamente",
  };
};

/**
 * Vacía completamente el carrito de un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Object>} Resultado de la operación
 */
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

/**
 * Obtiene estadísticas del carrito de un cliente
 * @param {number} idCliente - ID del cliente
 * @returns {Promise<Object>} Estadísticas del carrito
 */
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
