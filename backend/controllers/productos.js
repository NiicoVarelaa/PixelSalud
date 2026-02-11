const productosService = require("../services/ProductosService");

// ==========================================
// CONTROLADORES DE PRODUCTOS
// ==========================================

/**
 * Obtiene todos los productos con ofertas
 */
const getProductos = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene productos inactivos (dados de baja)
 */
const getProductoBajado = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerProductosInactivos();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un producto por ID con ofertas
 */
const getProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const producto = await productosService.obtenerProductoPorId(idProducto);
    res.json(producto);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene ofertas destacadas de una categoría
 */
const getOfertasDestacadas = async (req, res, next) => {
  try {
    const productos = await productosService.obtenerOfertasDestacadas();
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

/**
 * Busca productos por término
 */
const buscarProductos = async (req, res, next) => {
  try {
    const { term } = req.query;

    // Si no hay término o es muy corto, devolver array vacío
    if (!term || term.length < 3) {
      return res.status(200).json([]);
    }

    const productos = await productosService.buscarProductos(term);
    res.status(200).json(productos);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea un nuevo producto
 */
const createProducto = async (req, res, next) => {
  try {
    const producto = await productosService.crearProducto(req.body);
    res.status(201).json({
      message: "Producto creado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza un producto existente
 */
const updateProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const producto = await productosService.actualizarProducto(
      idProducto,
      req.body,
    );
    res.status(200).json({
      message: "Producto actualizado correctamente",
      producto,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza solo el estado activo de un producto
 */
const updateProductosActivo = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { activo } = req.body;
    await productosService.actualizarEstadoActivo(idProducto, activo);
    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * Da de baja un producto (activo = false)
 */
const darBajaProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productosService.darBajaProducto(id);
    res
      .status(200)
      .json({ message: "Producto dado de baja/eliminado con éxito" });
  } catch (error) {
    next(error);
  }
};

/**
 * Activa un producto (activo = true)
 */
const activarProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    await productosService.activarProducto(id);
    res.status(200).json({ message: "Producto activado con éxito" });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CONTROLADORES DE OFERTAS
// ==========================================

/**
 * Obtiene todas las ofertas con información de productos
 */
const getOfertas = async (req, res, next) => {
  try {
    const ofertas = await productosService.obtenerOfertas();
    res.json(ofertas);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una oferta por ID
 */
const getOferta = async (req, res, next) => {
  try {
    const { idOferta } = req.params;
    const oferta = await productosService.obtenerOfertaPorId(idOferta);
    res.json(oferta);
  } catch (error) {
    next(error);
  }
};

/**
 * Crea una nueva oferta
 */
const createOferta = async (req, res, next) => {
  try {
    const oferta = await productosService.crearOferta(req.body);
    res.status(201).json({
      message: "Oferta creada correctamente y activa",
      oferta,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una oferta existente
 */
const updateOferta = async (req, res, next) => {
  try {
    const { idOferta } = req.params;
    const oferta = await productosService.actualizarOferta(idOferta, req.body);
    res.status(200).json({
      message: "Oferta actualizada correctamente",
      oferta,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza solo el estado activo de una oferta
 */
const updateOfertaEsActiva = async (req, res, next) => {
  try {
    const { idOferta } = req.params;
    const { esActiva } = req.body;
    await productosService.actualizarEstadoOferta(idOferta, esActiva);
    res.status(200).json({ message: "Estado actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una oferta
 */
const deleteOferta = async (req, res, next) => {
  try {
    const { idOferta } = req.params;
    await productosService.eliminarOferta(idOferta);
    res.status(200).json({ message: "Oferta eliminada correctamente" });
  } catch (error) {
    next(error);
  }
};

/**
 * Crea ofertas masivas (Cyber Monday)
 */
const ofertaCyberMonday = async (req, res, next) => {
  try {
    // IDs por defecto para Cyber Monday
    const CYBER_MONDAY_IDS = [
      1, 2, 3, 4, 12, 14, 15, 22, 25, 26, 28, 34, 42, 43, 44, 45, 46, 47, 48,
      49, 50, 51, 52,
    ];

    const { productIds = CYBER_MONDAY_IDS, porcentajeDescuento = 25.0 } =
      req.body;

    const resultado = await productosService.crearOfertasMasivas(
      productIds,
      porcentajeDescuento,
    );

    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene ofertas de Cyber Monday
 */
const getCyberMondayOffers = async (req, res, next) => {
  try {
    const ofertas = await productosService.obtenerOfertasCyberMonday();
    res.json(ofertas);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Productos
  getProductos,
  getProducto,
  getProductoBajado,
  createProducto,
  updateProducto,
  updateProductosActivo,
  darBajaProducto,
  activarProducto,
  buscarProductos,
  getOfertasDestacadas,

  // Ofertas
  getOfertas,
  getOferta,
  createOferta,
  updateOferta,
  updateOfertaEsActiva,
  deleteOferta,
  ofertaCyberMonday,
  getCyberMondayOffers,
};
