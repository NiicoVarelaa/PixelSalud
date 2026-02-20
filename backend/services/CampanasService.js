const campanasRepository = require("../repositories/CampanasRepository");
const productosCampanasRepository = require("../repositories/ProductosCampanasRepository");

const obtenerCampanas = async () => {
  const campanas = await campanasRepository.findAll();

  const campanasConConteo = await Promise.all(
    campanas.map(async (campana) => {
      const totalProductos = await campanasRepository.countProductos(
        campana.idCampana,
      );
      return {
        ...campana,
        totalProductos,
      };
    }),
  );

  return campanasConConteo;
};

const obtenerCampanasActivas = async () => {
  const campanas = await campanasRepository.findActive();

  const campanasConConteo = await Promise.all(
    campanas.map(async (campana) => {
      const totalProductos = await campanasRepository.countProductos(
        campana.idCampana,
      );
      return {
        ...campana,
        totalProductos,
      };
    }),
  );

  return campanasConConteo;
};

const obtenerCampanaPorId = async (idCampana) => {
  const campana = await campanasRepository.findById(idCampana);

  if (!campana) {
    throw new Error("Campaña no encontrada");
  }

  const totalProductos = await campanasRepository.countProductos(idCampana);

  return {
    ...campana,
    totalProductos,
  };
};

const obtenerCampanaConProductos = async (idCampana) => {
  const productos = await campanasRepository.findWithProductos(idCampana);

  if (productos.length === 0) {
    throw new Error("Campaña no encontrada");
  }

  const campana = {
    idCampana: productos[0].idCampana,
    nombreCampana: productos[0].nombreCampana,
    descripcion: productos[0].descripcion,
    descuentoCampana: productos[0].descuentoCampana,
    fechaInicio: productos[0].fechaInicio,
    fechaFin: productos[0].fechaFin,
    esActiva: productos[0].esActiva,
    tipo: productos[0].tipo,
    prioridad: productos[0].prioridad,
    productos: productos
      .filter((p) => p.idProducto !== null)
      .map((p) => ({
        idProducto: p.idProducto,
        nombreProducto: p.nombreProducto,
        precio: p.precio,
        stock: p.stock,
        categoria: p.categoria,
        img: p.img,
        porcentajeDescuentoOverride: p.porcentajeDescuentoOverride,
        productoActivo: p.productoActivo,
        descuentoFinal: p.descuentoFinal,
      })),
  };

  return campana;
};

const crearCampana = async (campanaData) => {
  const existe = await campanasRepository.findByNombre(
    campanaData.nombreCampana,
  );
  if (existe) {
    throw new Error("Ya existe una campaña con ese nombre");
  }

  const fechaInicio = new Date(campanaData.fechaInicio);
  const fechaFin = new Date(campanaData.fechaFin);

  if (fechaFin <= fechaInicio) {
    throw new Error("La fecha de fin debe ser posterior a la fecha de inicio");
  }

  const idCampana = await campanasRepository.create(campanaData);

  return await obtenerCampanaPorId(idCampana);
};

const actualizarCampana = async (idCampana, campanaData) => {
  const campanaExiste = await campanasRepository.findById(idCampana);
  if (!campanaExiste) {
    throw new Error("Campaña no encontrada");
  }

  if (
    campanaData.nombreCampana &&
    campanaData.nombreCampana !== campanaExiste.nombreCampana
  ) {
    const existe = await campanasRepository.findByNombre(
      campanaData.nombreCampana,
    );
    if (existe) {
      throw new Error("Ya existe una campaña con ese nombre");
    }
  }

  if (campanaData.fechaInicio && campanaData.fechaFin) {
    const fechaInicio = new Date(campanaData.fechaInicio);
    const fechaFin = new Date(campanaData.fechaFin);

    if (fechaFin <= fechaInicio) {
      throw new Error(
        "La fecha de fin debe ser posterior a la fecha de inicio",
      );
    }
  }

  await campanasRepository.update(idCampana, campanaData);

  return await obtenerCampanaPorId(idCampana);
};

const eliminarCampana = async (idCampana) => {
  const campana = await campanasRepository.findById(idCampana);
  if (!campana) {
    throw new Error("Campaña no encontrada");
  }

  await campanasRepository.delete(idCampana);

  return { mensaje: "Campaña eliminada correctamente" };
};

const agregarProducto = async (
  idCampana,
  idProducto,
  porcentajeDescuentoOverride = null,
) => {
  const campana = await campanasRepository.findById(idCampana);
  if (!campana) {
    throw new Error("Campaña no encontrada");
  }

  const existe = await productosCampanasRepository.exists(
    idCampana,
    idProducto,
  );
  if (existe) {
    throw new Error("El producto ya está en esta campaña");
  }

  await productosCampanasRepository.create(
    idCampana,
    idProducto,
    porcentajeDescuentoOverride,
  );

  return { mensaje: "Producto agregado a la campaña" };
};

const agregarProductos = async (
  idCampana,
  productosIds,
  porcentajeDescuentoOverride = null,
) => {
  const campana = await campanasRepository.findById(idCampana);
  if (!campana) {
    throw new Error("Campaña no encontrada");
  }

  if (!Array.isArray(productosIds) || productosIds.length === 0) {
    throw new Error("Debe proporcionar al menos un producto");
  }

  const agregados = await productosCampanasRepository.addMultiple(
    idCampana,
    productosIds,
    porcentajeDescuentoOverride,
  );

  return {
    mensaje: `${agregados} producto(s) agregado(s) a la campaña`,
    totalAgregados: agregados,
  };
};

const quitarProducto = async (idCampana, idProducto) => {
  const eliminado = await productosCampanasRepository.deleteByProducto(
    idCampana,
    idProducto,
  );

  if (eliminado === 0) {
    throw new Error("Producto no encontrado en esta campaña");
  }

  return { mensaje: "Producto quitado de la campaña" };
};

const quitarProductos = async (idCampana, productosIds) => {
  if (!Array.isArray(productosIds) || productosIds.length === 0) {
    throw new Error("Debe proporcionar al menos un producto");
  }

  const eliminados = await productosCampanasRepository.deleteMultiple(
    idCampana,
    productosIds,
  );

  return {
    mensaje: `${eliminados} producto(s) quitado(s) de la campaña`,
    totalQuitados: eliminados,
  };
};

const actualizarDescuentoOverride = async (id, porcentajeDescuentoOverride) => {
  const actualizado = await productosCampanasRepository.updateOverride(
    id,
    porcentajeDescuentoOverride,
  );

  if (actualizado === 0) {
    throw new Error("Relación producto-campaña no encontrada");
  }

  return { mensaje: "Descuento override actualizado" };
};

const obtenerProductosDeCampana = async (idCampana, soloActivos = false) => {
  const campana = await campanasRepository.findById(idCampana);
  if (!campana) {
    throw new Error("Campaña no encontrada");
  }

  const productos = soloActivos
    ? await productosCampanasRepository.findActiveByCampana(idCampana)
    : await productosCampanasRepository.findByCampana(idCampana);

  return productos;
};

const obtenerCampanasDeProducto = async (idProducto) => {
  const campanas = await productosCampanasRepository.findByProducto(idProducto);
  return campanas;
};

const obtenerMejorDescuento = async (idProducto) => {
  const campanas = await productosCampanasRepository.findByProducto(idProducto);

  if (campanas.length === 0) {
    return null;
  }

  const campanasActivas = campanas.filter((c) => {
    const ahora = new Date();
    const inicio = new Date(c.fechaInicio);
    const fin = new Date(c.fechaFin);
    return c.campanaActiva && c.esActivo && ahora >= inicio && ahora <= fin;
  });

  if (campanasActivas.length === 0) {
    return null;
  }

  campanasActivas.sort((a, b) => {
    if (a.prioridad !== b.prioridad) {
      return b.prioridad - a.prioridad;
    }
    return b.descuentoFinal - a.descuentoFinal;
  });

  return campanasActivas[0];
};

const obtenerCampanasProximasAVencer = async (dias = 7) => {
  const campanas = await campanasRepository.findExpiringIn(dias);
  return campanas;
};

module.exports = {
  obtenerCampanas,
  obtenerCampanasActivas,
  obtenerCampanaPorId,
  obtenerCampanaConProductos,
  crearCampana,
  actualizarCampana,
  eliminarCampana,
  agregarProducto,
  agregarProductos,
  quitarProducto,
  quitarProductos,
  actualizarDescuentoOverride,
  obtenerProductosDeCampana,
  obtenerCampanasDeProducto,
  obtenerMejorDescuento,
  obtenerCampanasProximasAVencer,
};
