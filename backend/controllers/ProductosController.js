const productosService = require("../services/ProductosService");
const { Auditoria } = require("../helps");

const getProductos = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const getProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const producto = await productosService.obtenerProductoPorId(idProducto);
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

const getProductoBajado = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductosInactivos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const buscarProductos = async (req, res, next) => {
  try {
    const { term } = req.query;
    const productos = await productosService.buscarProductos(term);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const createProducto = async (req, res, next) => {
  try {
    const producto = await productosService.crearProducto(req.body);

    // Registrar auditoría de creación de producto
    await Auditoria.registrarAuditoria(
      {
        evento: "PRODUCTO_CREADO",
        modulo: Auditoria.MODULOS.PRODUCTOS,
        accion: Auditoria.ACCIONES.CREATE,
        descripcion: `Producto "${req.body.nombreProducto}" creado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Productos",
        idEntidad: producto.idProducto,
        datosAnteriores: null,
        datosNuevos: req.body,
      },
      req,
    );

    res.status(201).json({
      message: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
};

const updateProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;

    // Obtener producto antes de actualizar para auditoría
    const productoAnterior =
      await productosService.obtenerProductoPorId(idProducto);

    const producto = await productosService.actualizarProducto(
      idProducto,
      req.body,
    );

    // Registrar auditoría de actualización de producto
    await Auditoria.registrarModificacionProducto(
      producto,
      req.user,
      productoAnterior,
      req,
    );

    res.status(200).json({
      message: "Producto actualizado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
};

const updateProductoActivo = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { activo } = req.body;

    // Obtener producto antes de cambiar estado para auditoría
    const productoAnterior =
      await productosService.obtenerProductoPorId(idProducto);

    await productosService.actualizarEstadoActivo(idProducto, activo);

    // Registrar auditoría de cambio de estado
    await Auditoria.registrarAuditoria(
      {
        evento: activo ? "PRODUCTO_ACTIVADO" : "PRODUCTO_DESACTIVADO",
        modulo: Auditoria.MODULOS.PRODUCTOS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Producto "${productoAnterior.nombreProducto}" ${activo ? "activado" : "desactivado"}`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Productos",
        idEntidad: idProducto,
        datosAnteriores: { activo: productoAnterior.activo },
        datosNuevos: { activo },
      },
      req,
    );

    res.status(200).json({
      message: `Producto ${activo ? "activado" : "desactivado"} correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;

    // Obtener producto antes de dar de baja para auditoría
    const productoAnterior =
      await productosService.obtenerProductoPorId(idProducto);

    await productosService.darBajaProducto(idProducto);

    // Registrar auditoría de baja de producto
    await Auditoria.registrarAuditoria(
      {
        evento: "PRODUCTO_ELIMINADO",
        modulo: Auditoria.MODULOS.PRODUCTOS,
        accion: Auditoria.ACCIONES.DELETE,
        descripcion: `Producto "${productoAnterior.nombreProducto}" dado de baja`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Productos",
        idEntidad: idProducto,
        datosAnteriores: productoAnterior,
        datosNuevos: { baja: true },
      },
      req,
    );

    res.status(200).json({
      message: "Producto dado de baja correctamente",
    });
  } catch (error) {
    next(error);
  }
};

const activarProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;

    // Obtener producto antes de activar para auditoría
    const productoAnterior =
      await productosService.obtenerProductoPorId(idProducto);

    await productosService.activarProducto(idProducto);

    // Registrar auditoría de activación de producto
    await Auditoria.registrarAuditoria(
      {
        evento: "PRODUCTO_ACTIVADO",
        modulo: Auditoria.MODULOS.PRODUCTOS,
        accion: Auditoria.ACCIONES.UPDATE,
        descripcion: `Producto "${productoAnterior.nombreProducto}" reactivado`,
        tipoUsuario: req.user?.role || "admin",
        idUsuario: req.user?.id,
        entidadAfectada: "Productos",
        idEntidad: idProducto,
        datosAnteriores: { baja: productoAnterior.baja },
        datosNuevos: { baja: false },
      },
      req,
    );

    res.status(200).json({
      message: "Producto activado correctamente",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductos,
  getProductoBajado,
  getProducto,
  buscarProductos,
  createProducto,
  updateProducto,
  updateProductoActivo,
  deleteProducto,
  activarProducto,
};
