const { conection } = require("../config/database");

// ------------------------------------------------------------------
// --- FUNCIONES PRINCIPALES DE PRODUCTOS (Cálculo de Precios) ---
// ------------------------------------------------------------------

/**
 * Obtiene todos los productos con precios actualizados y flag de oferta.
 * ¡Consulta corregida para evitar ONLY_FULL_GROUP_BY!
 */
const getProductos = (req, res) => {
  const consulta = `
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcion,
        p.precio AS precioRegular,
        p.img,
        p.categoria,
        p.stock,
        p.activo,
        p.requiereReceta,
        o.porcentajeDescuento,
        -- Calcula el precio final (si o.idOferta existe, aplica descuento, sino usa el precio regular).
        CASE
            WHEN o.idOferta IS NOT NULL 
            THEN p.precio * (1 - o.porcentajeDescuento / 100)
            ELSE p.precio
        END AS precioFinal,
        -- Campo booleano 'enOferta'
        CASE
            WHEN o.idOferta IS NOT NULL 
            THEN TRUE
            ELSE FALSE
        END AS enOferta
    FROM 
        Productos p
    LEFT JOIN 
        ofertas o ON p.idProducto = o.idProducto
        -- Mueve el filtro de vigencia al JOIN para evitar conflictos con GROUP BY
        AND o.esActiva = 1 
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    ORDER BY 
        p.idProducto;
  `;

  conection.query(consulta, (err, results) => {
    if (err) {
      console.error("Error al obtener productos:", err);
      return res.status(500).json({ error: "Error al obtener productos" });
    }
    res.json(results);
  });
};


const getProductoBajado = (req, res)=>{
  const consulta = "select * from Productos where activo = false;"
  conection.query(consulta, (error, result)=>{
    if (error) {
       console.error("Error al obtener productos dados de baja:", error);
      return res.status(500).json({ error: "Error al obtener productos dados de baja" });
    }
    if (result.length === 0) {
        return res.status(404).json({ error: "Producto dado de baja no encontrados" });
    }
    res.json(result);
  })
}


/**
 * Obtiene un único producto con precio actualizado y flag de oferta.
 * ¡Consulta corregida para evitar ONLY_FULL_GROUP_BY!
 */
const getProducto = (req, res) => {
  const id = req.params.idProducto;
  const consulta = `
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcion,
        p.precio AS precioRegular,
        p.img,
        p.categoria,
        p.stock,
        p.activo,
        p.requiereReceta,
        o.porcentajeDescuento,
        CASE
            WHEN o.idOferta IS NOT NULL 
            THEN p.precio * (1 - o.porcentajeDescuento / 100)
            ELSE p.precio
        END AS precioFinal,
        CASE
            WHEN o.idOferta IS NOT NULL 
            THEN TRUE
            ELSE FALSE
        END AS enOferta
    FROM 
        Productos p
    LEFT JOIN 
        ofertas o ON p.idProducto = o.idProducto
        -- Mueve el filtro de vigencia al JOIN
        AND o.esActiva = 1 
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    WHERE 
        p.idProducto = ?
    LIMIT 1;
  `;

  conection.query(consulta, [id], (err, results) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al obtener el producto" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(results[0]);
  });
};

/**
 * Obtiene solo los productos que están en oferta AHORA y son de la categoría 'Dermocosmética'.
 */
const getOfertasDestacadas = (req, res) => {
  const categoriaDestacada = "Dermocosmética"; 

  const consulta = `
    SELECT 
        p.idProducto,
        p.nombreProducto,
        p.descripcion,
        p.precio AS precioRegular,
        p.img,
        p.categoria,
        o.porcentajeDescuento,
        -- Aquí el precioFinal SIEMPRE es el precio con descuento, gracias al INNER JOIN
        p.precio * (1 - o.porcentajeDescuento / 100) AS precioFinal,
        TRUE AS enOferta
    FROM 
        Productos p
    INNER JOIN 
        ofertas o ON p.idProducto = o.idProducto
    WHERE 
        p.activo = 1 
        AND p.categoria = ?
        AND o.esActiva = 1 
        AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
    LIMIT 10;
  `;

  conection.query(consulta, [categoriaDestacada], (err, results) => {
    if (err) {
      console.error("Error al obtener ofertas destacadas:", err);
      return res.status(500).json({ error: "Error al obtener ofertas destacadas" });
    }
    res.json(results);
  });
};


// ------------------------------------------------------------------
// --- FUNCIONES CRUD DE PRODUCTOS (Administración) ---
// ------------------------------------------------------------------

const createProducto = (req, res) => {
  const { nombreProducto, descripcion, precio, img, categoria, stock, requiereReceta } =
    req.body;
  
  const consulta = `
        INSERT INTO Productos (nombreProducto, descripcion, precio, img, categoria, stock, requiereReceta, activo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 1) 
    `;

  conection.query(
    consulta,
    [nombreProducto, descripcion, precio, img, categoria, stock, requiereReceta],
    (err, results) => {
      if (err) {
        console.error("Error al crear el producto:", err);
        return res.status(500).json({ error: "Error al crear el producto" });
      }
      res.status(201).json({ message: "Producto creado correctamente" });
    }
  );
};

const updateProducto = (req, res) => {
  const id = req.params.idProducto;
  const { nombreProducto, descripcion, precio, img, categoria, stock, requiereReceta, activo } =
    req.body;

  const consulta = `
        UPDATE Productos 
        SET nombreProducto = ?, descripcion = ?, precio = ?, img = ?, categoria = ?, stock=?, requiereReceta=?, activo=?
        WHERE idProducto = ?
    `;

  conection.query(
    consulta,
    [nombreProducto, descripcion, precio, img, categoria, stock, requiereReceta, activo, id],
    (err, results) => {
      if (err) {
        console.error("Error al obtener el producto:", err);
        return res
          .status(500)
          .json({ error: "Error al actualizar el producto" });
      }
      res.status(200).json({ message: "Producto actualizado correctamente" });
    }
  );
};

const updateProductosActivo = (req, res) => {
  const id = req.params.idProducto
  const {activo} = req.body

  const consulta = `UPDATE Productos SET Activo = ? WHERE idProducto = ?`

  conection.query(consulta,[activo, id],(err,results)=>{
    if(err){
      console.error("error al cambiar estado del producto")
      return res.status(500).json({error: "error al cambiar de estado"})
    }
    res.status(200).json({message: "estado actualizado correctamente"})
  })
}

const darBajaProducto = (req, res) => {
  const id = req.params.id;
  const consulta = "update productos set activo = false where idProducto=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.error("Error al obtener el producto:", err);
      return res.status(500).json({ error: "Error al eliminar el producto" });
    }
    res
      .status(201)
      .json({ message: "Productos dado de baja/eliminado con exito" });
  });
};

const activarProducto = (req, res) => {
  const id = req.params.id;
  const consulta = "update productos set activo = true where idProducto=?";

  conection.query(consulta, [id], (err, result) => {
    if (err) {
      console.log("Error al activar de baja al producto:", err);
      return res
        .status(500)
        .json({ error: "Error al activar de baja al producto" });
    }
    res
      .status(201)
      .json({ message: "Productos activado con exito" });
  });
};


// ------------------------------------------------------------------
// --- FUNCIONES CRUD DE OFERTAS (Administración de Promociones) ---
// ------------------------------------------------------------------

const createOferta = (req, res) => {
    const { 
        idProducto, 
        porcentajeDescuento, 
        fechaInicio, 
        fechaFin 
    } = req.body;

    const consulta = `
        INSERT INTO ofertas (idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva) 
        VALUES (?, ?, ?, ?, 1)
    `;

    conection.query(
        consulta,
        [idProducto, porcentajeDescuento, fechaInicio, fechaFin],
        (err, results) => {
            if (err) {
                console.error("Error al crear la oferta:", err);
                return res.status(500).json({ error: "Error al crear la oferta. Verifica el idProducto." });
            }
            res.status(201).json({ 
                message: "Oferta creada correctamente y activa.",
                ofertaId: results.insertId
            });
        }
    );
};

const getOfertas = (req, res) => {
    const consulta = `
        SELECT 
            o.*, 
            p.nombreProducto 
        FROM 
            ofertas o
        JOIN 
            Productos p ON o.idProducto = p.idProducto
        ORDER BY o.fechaFin DESC
    `;

    conection.query(consulta, (err, results) => {
        if (err) {
            console.error("Error al obtener ofertas:", err);
            return res.status(500).json({ error: "Error al obtener ofertas" });
        }
        res.json(results);
    });
};

const getOferta = (req, res) => {
    const id = req.params.idOferta;
    const consulta = `
        SELECT 
            o.*, 
            p.nombreProducto 
        FROM 
            ofertas o
        JOIN 
            Productos p ON o.idProducto = p.idProducto
        WHERE 
            o.idOferta = ?
    `;

    conection.query(consulta, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener la oferta:", err);
            return res.status(500).json({ error: "Error al obtener la oferta" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Oferta no encontrada" });
        }
        res.json(results[0]);
    });
};

const updateOferta = (req, res) => {
    const id = req.params.idOferta;
    const { 
        idProducto, 
        porcentajeDescuento, 
        fechaInicio, 
        fechaFin, 
        esActiva 
    } = req.body;

    const consulta = `
        UPDATE ofertas 
        SET idProducto = ?, porcentajeDescuento = ?, fechaInicio = ?, fechaFin = ?, esActiva = ?
        WHERE idOferta = ?
    `;
    conection.query(
        consulta,
        [idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva, id],
        (err, results) => {
            if (err) {
                console.error("Error al actualizar la oferta:", err);
                return res.status(500).json({ error: "Error al actualizar la oferta" });
            }
            res.status(200).json({ message: "Oferta actualizada correctamente" });
        }
    );
};

const updateOfertaEsActiva = (req,res) => {
  const id = req.params.idOferta
  const {esActiva} = req.body

  const consulta = `UPDATE ofertas SET esActiva = ? WHERE idOferta = ?`

  conection.query(consulta, [esActiva, id], (err,results) =>{
    if(err){
      console.error("error al cambiar estado de oferta", err)
      return res.status(500).json({error: "error al cambiar estado"})
    }
    res.status(200).json({message: "estado actualizado correctamente"})
  })
}

const deleteOferta = (req, res) => {
    const id = req.params.idOferta;
    const consulta = "DELETE FROM ofertas WHERE idOferta = ?";

    conection.query(consulta, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar la oferta:", err);
            return res.status(500).json({ error: "Error al eliminar la oferta" });
        }
        res.status(200).json({ message: "Oferta eliminada correctamente" });
    });
};

/**
 * Crea una oferta masiva para una lista de IDs de producto específicos.
 * POST /ofertas/mass-create
 */
const ofertaCyberMonday = (req, res) => {
    // Lista de IDs. Se espera que vengan en el body como un array 'productIds'.
    // También se espera el porcentaje de descuento y la fecha de fin.
    const { productIds, porcentajeDescuento } = req.body;
    
    // --- PARÁMETROS FIJOS Y AJUSTADOS POR REQUERIMIENTO ---
    const DESCUENTO = 25.00; // Por requerimiento: 25% de descuento
    const FECHA_INICIO = new Date().toISOString().slice(0, 19).replace('T', ' '); // Fecha y hora actual del servidor
    const FECHA_FIN = '2025-11-16 23:59:59'; // Ajustado por requerimiento: Oferta hasta el 16 de noviembre.
    const ES_ACTIVA = 1;

    // Los IDs que proporcionaste: 23 productos
    const CYBER_MONDAY_IDS = [1, 2, 3, 4, 12, 14, 15, 22, 25, 26, 28, 34, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52];
    
    // Usaremos los IDs fijos para esta función Cyber Monday
    const idsToOffer = CYBER_MONDAY_IDS;

    if (!Array.isArray(idsToOffer) || idsToOffer.length === 0) {
        return res.status(400).json({ error: "La lista de IDs de productos para la oferta está vacía." });
    }

    // 1. Preparar los valores para la inserción masiva: [idProducto, descuento, inicio, fin, activa]
    const ofertaValues = idsToOffer.map(idProducto => 
        [idProducto, DESCUENTO, FECHA_INICIO, FECHA_FIN, ES_ACTIVA]
    );

    // 2. Consulta de inserción masiva (utiliza el placeholder 'VALUES ?' para arrays)
    const insertQuery = `
        INSERT INTO ofertas (idProducto, porcentajeDescuento, fechaInicio, fechaFin, esActiva) 
        VALUES ?
    `;

    conection.query(insertQuery, [ofertaValues], (err, results) => {
        if (err) {
            console.error("Error al insertar ofertas masivas:", err);
            return res.status(500).json({ error: "Error al crear las ofertas masivas. Verifica si los IDs de producto existen o si ya tienen una oferta activa con la misma vigencia." });
        }
        
        res.status(201).json({ 
            message: `¡Oferta Cyber Monday (25%) creada exitosamente para ${results.affectedRows} productos!`,
            vigencia: `Del ${FECHA_INICIO.split(' ')[0]} al ${FECHA_FIN.split(' ')[0]}`,
            productosInsertados: idsToOffer
        });
    });
};

const getCyberMondayOffers = (req, res) => {
    // Parámetros fijos de la promoción de Cyber Monday
    const DESCUENTO_CM = 25.00;
    const FECHA_FIN_CM = '2025-11-16 23:59:59'; 

    const consulta = `
        SELECT 
            p.idProducto,
            p.nombreProducto,
            p.descripcion,
            p.precio AS precioRegular,
            p.img,
            p.categoria,
            o.porcentajeDescuento,
            -- Calcula el precio con el descuento
            p.precio * (1 - o.porcentajeDescuento / 100) AS precioFinal,
            TRUE AS enOferta
        FROM 
            Productos p
        INNER JOIN 
            ofertas o ON p.idProducto = o.idProducto
        WHERE 
            p.activo = 1 
            AND o.esActiva = 1 
            AND o.porcentajeDescuento = ?  /* Filtro por descuento (25%) */
            AND o.fechaFin = ?             /* Filtro por fecha de fin específica */
            AND NOW() BETWEEN o.fechaInicio AND o.fechaFin 
        ORDER BY
            p.idProducto;
    `;

    conection.query(consulta, [DESCUENTO_CM, FECHA_FIN_CM], (err, results) => {
        if (err) {
            console.error("Error al obtener ofertas de Cyber Monday:", err);
            return res.status(500).json({ error: "Error al obtener ofertas de Cyber Monday" });
        }
        res.json(results);
    });
};

const buscarProductos = (req, res) => {
    // Obtenemos el término de búsqueda de la URL (ej: /buscar?term=aspirina)
    const { term } = req.query;

    // Si no hay término o es muy corto, devolvemos lista vacía para no sobrecargar
    if (!term || term.length < 3) {
        return res.status(200).json([]);
    }

    // Consulta SQL:
    // 1. LOWER(...) para que no importen mayúsculas/minúsculas.
    // 2. LIKE ? para búsquedas parciales.
    // 3. activo = 1 y stock > 0 para solo mostrar lo vendible.
    // 4. LIMIT 10 para que no traiga mil productos de golpe.
    const consulta = `
      SELECT idProducto, nombreProducto, precio, stock, categoria, requiereReceta 
      FROM Productos 
      WHERE LOWER(nombreProducto) LIKE LOWER(?) AND activo = 1 AND stock > 0
      LIMIT 10
    `;

    conection.query(consulta, [`%${term}%`], (err, results) => {
        if (err) {
            console.error("Error buscando productos:", err);
            return res.status(500).json({ error: "Error al buscar productos" });
        }
        // Devolvemos el array de resultados (puede estar vacío si no encontró nada)
        res.status(200).json(results);
    });
};


module.exports = {
  getProductos,
  getProducto,
  getProductoBajado,
  createProducto,
  darBajaProducto,
  activarProducto,
  updateProducto,
  updateProductosActivo,
  getOfertasDestacadas, 
  createOferta,
  getOfertas,
  getOferta,
  updateOferta,
  updateOfertaEsActiva,
  deleteOferta,
  ofertaCyberMonday,
  getCyberMondayOffers,
  buscarProductos
};
