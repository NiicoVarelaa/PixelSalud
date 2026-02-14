-- =====================================================
-- MIGRACIÓN: Sistema de Campañas de Ofertas
-- Fecha: 2026-02-11
-- Descripción: Migra de modelo 1:1 (ofertas) a modelo N:N (campañas)
-- =====================================================

-- PASO 1: CREAR NUEVAS TABLAS
-- =====================================================

-- Tabla: Campañas de Ofertas (eventos promocionales)
CREATE TABLE IF NOT EXISTS campanas_ofertas (
  idCampana INT AUTO_INCREMENT PRIMARY KEY,
  nombreCampana VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  porcentajeDescuento DECIMAL(5,2) NOT NULL,
  fechaInicio DATETIME NOT NULL,
  fechaFin DATETIME NOT NULL,
  esActiva BOOLEAN DEFAULT 1,
  tipo ENUM('EVENTO', 'DESCUENTO', 'LIQUIDACION', 'TEMPORADA') DEFAULT 'DESCUENTO',
  prioridad INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_activa (esActiva),
  INDEX idx_fechas (fechaInicio, fechaFin),
  INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Relación N:N entre Productos y Campañas
CREATE TABLE IF NOT EXISTS productos_campanas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  idCampana INT NOT NULL,
  idProducto INT NOT NULL,
  porcentajeDescuentoOverride DECIMAL(5,2) NULL COMMENT 'Anula el descuento de la campaña para este producto',
  esActivo BOOLEAN DEFAULT 1,
  fechaAgregado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (idCampana) REFERENCES campanas_ofertas(idCampana) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE,
  
  UNIQUE KEY unique_campana_producto (idCampana, idProducto),
  INDEX idx_campana (idCampana),
  INDEX idx_producto (idProducto),
  INDEX idx_activo (esActivo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- PASO 2: MIGRAR DATOS EXISTENTES
-- =====================================================

-- 2.1: Crear campaña "Cyber Monday" agrupando ofertas del 25%
INSERT INTO campanas_ofertas (
  nombreCampana, 
  descripcion, 
  porcentajeDescuento, 
  fechaInicio, 
  fechaFin, 
  esActiva, 
  tipo, 
  prioridad
)
SELECT 
  'Cyber Monday' as nombreCampana,
  'Ofertas migradas automáticamente del sistema anterior' as descripcion,
  25.00 as porcentajeDescuento,
  MIN(fechaInicio) as fechaInicio,
  MAX(fechaFin) as fechaFin,
  1 as esActiva,
  'EVENTO' as tipo,
  10 as prioridad
FROM ofertas
WHERE porcentajeDescuento = 25.00 AND esActiva = 1
HAVING COUNT(*) > 0;

-- 2.2: Migrar productos de ofertas con 25% descuento a "Cyber Monday"
INSERT INTO productos_campanas (idCampana, idProducto, porcentajeDescuentoOverride, esActivo, fechaAgregado)
SELECT 
  (SELECT idCampana FROM campanas_ofertas WHERE nombreCampana = 'Cyber Monday') as idCampana,
  o.idProducto,
  NULL as porcentajeDescuentoOverride,
  o.esActiva as esActivo,
  NOW() as fechaAgregado
FROM ofertas o
WHERE o.porcentajeDescuento = 25.00;

-- 2.3: Crear campañas individuales para ofertas con descuentos diferentes al 25%
INSERT INTO campanas_ofertas (
  nombreCampana, 
  descripcion, 
  porcentajeDescuento, 
  fechaInicio, 
  fechaFin, 
  esActiva, 
  tipo, 
  prioridad
)
SELECT 
  CONCAT('Oferta ', o.porcentajeDescuento, '% - Producto ', p.nombreProducto) as nombreCampana,
  CONCAT('Oferta migrada: ', o.porcentajeDescuento, '% de descuento') as descripcion,
  o.porcentajeDescuento,
  o.fechaInicio,
  o.fechaFin,
  o.esActiva,
  'DESCUENTO' as tipo,
  0 as prioridad
FROM ofertas o
JOIN Productos p ON o.idProducto = p.idProducto
WHERE o.porcentajeDescuento != 25.00;

-- 2.4: Migrar productos de ofertas individuales
INSERT INTO productos_campanas (idCampana, idProducto, porcentajeDescuentoOverride, esActivo, fechaAgregado)
SELECT 
  c.idCampana,
  o.idProducto,
  NULL as porcentajeDescuentoOverride,
  o.esActiva as esActivo,
  NOW() as fechaAgregado
FROM ofertas o
JOIN Productos p ON o.idProducto = p.idProducto
JOIN campanas_ofertas c ON c.nombreCampana COLLATE utf8mb4_unicode_ci = CONCAT('Oferta ', o.porcentajeDescuento, '% - Producto ', p.nombreProducto) COLLATE utf8mb4_unicode_ci
WHERE o.porcentajeDescuento != 25.00;


-- PASO 3: RENOMBRAR TABLA ANTIGUA (NO ELIMINAR)
-- =====================================================
-- Renombramos la tabla por seguridad, por si necesitas hacer rollback

RENAME TABLE ofertas TO ofertas_old_backup;


-- PASO 4: VERIFICACIÓN (SOLO CONSULTAS)
-- =====================================================
-- Ejecuta estas consultas para verificar que todo migró correctamente:

-- Ver campañas creadas:
-- SELECT * FROM campanas_ofertas;

-- Ver total productos por campaña:
-- SELECT c.nombreCampana, COUNT(pc.idProducto) as total_productos
-- FROM campanas_ofertas c
-- LEFT JOIN productos_campanas pc ON c.idCampana = pc.idCampana
-- GROUP BY c.idCampana;

-- Comparar totales (deben ser iguales):
-- SELECT 'Tabla antigua' as origen, COUNT(*) as total FROM ofertas_old_backup;
-- SELECT 'Tabla nueva' as origen, COUNT(*) as total FROM productos_campanas;

-- Ver productos en múltiples campañas:
-- SELECT p.nombreProducto, COUNT(pc.idCampana) as num_campanas
-- FROM Productos p
-- JOIN productos_campanas pc ON p.idProducto = pc.idProducto
-- GROUP BY p.idProducto
-- HAVING num_campanas > 1;


-- PASO 5 (OPCIONAL): ELIMINAR TABLA ANTIGUA
-- =====================================================
-- ⚠️ SOLO EJECUTAR DESPUÉS DE VERIFICAR QUE TODO FUNCIONA
-- ⚠️ ESPERA AL MENOS 1 SEMANA CON EL NUEVO SISTEMA

-- DROP TABLE IF EXISTS ofertas_old_backup;


-- =====================================================
-- NOTAS IMPORTANTES:
-- =====================================================
-- 1. La tabla "ofertas" se renombra a "ofertas_old_backup" por seguridad
-- 2. Todas las ofertas del 25% se agrupan en "Cyber Monday"
-- 3. Otras ofertas se crean como campañas individuales
-- 4. NO eliminar ofertas_old_backup hasta confirmar que todo funciona
-- 5. Después de migrar, actualiza el código backend para usar las nuevas tablas
-- 6. Las foreign keys tienen ON DELETE CASCADE por seguridad
-- =====================================================
