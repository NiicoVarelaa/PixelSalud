-- ================================================
-- SISTEMA DE CUPONES DE DESCUENTO
-- ================================================

-- Tabla principal de cupones
CREATE TABLE IF NOT EXISTS Cupones (
    idCupon INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipoCupon ENUM('porcentaje', 'monto_fijo') NOT NULL DEFAULT 'porcentaje',
    valorDescuento DECIMAL(10, 2) NOT NULL,
    descripcion VARCHAR(255),
    fechaInicio DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
    usoMaximo INT DEFAULT 1 COMMENT 'Cantidad máxima de veces que se puede usar',
    vecesUsado INT DEFAULT 0,
    tipoUsuario ENUM('nuevo', 'todos', 'vip') DEFAULT 'todos',
    montoMinimo DECIMAL(10, 2) DEFAULT 0 COMMENT 'Monto mínimo de compra para aplicar',
    estado ENUM('activo', 'inactivo', 'expirado') DEFAULT 'activo',
    creadoPor INT COMMENT 'ID del admin que creó el cupón',
    fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fechaInicio, fechaVencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de registro de uso de cupones
CREATE TABLE IF NOT EXISTS CuponesUsados (
    idUso INT PRIMARY KEY AUTO_INCREMENT,
    idCupon INT NOT NULL,
    idCliente INT NOT NULL,
    idVentaO INT NOT NULL,
    montoDescuento DECIMAL(10, 2) NOT NULL,
    montoOriginal DECIMAL(10, 2) NOT NULL,
    montoFinal DECIMAL(10, 2) NOT NULL,
    fechaUso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (idCupon) REFERENCES Cupones(idCupon) ON DELETE CASCADE,
    FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
    FOREIGN KEY (idVentaO) REFERENCES VentasOnlines(idVentaO) ON DELETE CASCADE,
    
    INDEX idx_cupon (idCupon),
    INDEX idx_cliente (idCliente),
    INDEX idx_venta (idVentaO),
    INDEX idx_fecha (fechaUso)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- DATOS INICIALES - CUPÓN DE BIENVENIDA
-- ================================================

-- Template del cupón de bienvenida (se creará uno único por usuario)
-- Este es solo un ejemplo, los cupones reales se generarán dinámicamente
INSERT INTO Cupones (
    codigo, 
    tipoCupon, 
    valorDescuento, 
    descripcion, 
    fechaInicio, 
    fechaVencimiento, 
    usoMaximo, 
    tipoUsuario, 
    montoMinimo
) VALUES (
    'BIENVENIDA10-TEMPLATE',
    'porcentaje',
    10.00,
    'Cupón de bienvenida - 10% de descuento en tu primera compra',
    CURDATE(),
    DATE_ADD(CURDATE(), INTERVAL 60 DAY),
    1,
    'nuevo',
    0.00
) ON DUPLICATE KEY UPDATE idCupon = idCupon;

-- ================================================
-- VISTAS ÚTILES
-- ================================================

-- Vista de cupones activos
CREATE OR REPLACE VIEW CuponesActivos AS
SELECT 
    c.*,
    (c.usoMaximo - c.vecesUsado) AS usosDisponibles,
    CASE 
        WHEN CURDATE() > c.fechaVencimiento THEN 'expirado'
        WHEN c.vecesUsado >= c.usoMaximo THEN 'agotado'
        ELSE c.estado
    END AS estadoReal
FROM Cupones c
WHERE c.estado = 'activo' 
  AND CURDATE() BETWEEN c.fechaInicio AND c.fechaVencimiento
  AND c.vecesUsado < c.usoMaximo;

-- Vista de uso de cupones con información completa
CREATE OR REPLACE VIEW CuponesUsadosDetalle AS
SELECT 
    cu.*,
    c.codigo,
    c.tipoCupon,
    c.valorDescuento,
    cl.nombreCliente,
    cl.emailCliente,
    vo.fechaPago,
    vo.estado AS estadoVenta
FROM CuponesUsados cu
JOIN Cupones c ON cu.idCupon = c.idCupon
JOIN Clientes cl ON cu.idCliente = cl.idCliente
JOIN VentasOnlines vo ON cu.idVentaO = vo.idVentaO
ORDER BY cu.fechaUso DESC;

-- ================================================
-- PROCEDIMIENTOS ALMACENADOS OPCIONALES
-- ================================================

DELIMITER $$

-- Generar código único de cupón
CREATE FUNCTION IF NOT EXISTS GenerarCodigoCupon(prefijo VARCHAR(20))
RETURNS VARCHAR(50)
DETERMINISTIC
BEGIN
    DECLARE codigo VARCHAR(50);
    DECLARE existe INT;
    
    REPEAT
        SET codigo = CONCAT(
            prefijo, 
            '-',
            UPPER(SUBSTRING(MD5(RAND()), 1, 8))
        );
        
        SELECT COUNT(*) INTO existe 
        FROM Cupones 
        WHERE Cupones.codigo = codigo;
        
    UNTIL existe = 0 END REPEAT;
    
    RETURN codigo;
END$$

DELIMITER ;

-- ================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- ================================================

/*
TIPOS DE CUPÓN:
- porcentaje: Descuento en % (ej: 10% = 10.00)
- monto_fijo: Descuento en $ (ej: $500 = 500.00)

TIPO DE USUARIO:
- nuevo: Solo para usuarios que nunca compraron
- todos: Cualquier usuario registrado
- vip: Solo usuarios con muchas compras (futuro)

ESTADOS:
- activo: Cupón disponible para usar
- inactivo: Deshabilitado manualmente
- expirado: Fuera de fecha o usos agotados (se actualiza automáticamente)

FLUJO TÍPICO:
1. Usuario se registra → Se crea cupón único BIENVENIDA10-XXXXXXXX
2. Usuario aplica cupón en checkout → Se valida
3. Pago aprobado → Se registra en CuponesUsados
4. vecesUsado += 1 en Cupones
*/
