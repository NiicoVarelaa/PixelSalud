-- Migración: Agregar columnas para ofertas individuales en productos
-- Fecha: 2026-03-04
-- Descripción: Permite gestionar descuentos individuales (10%, 15%, 20%) en productos
--              independientemente de las campañas

USE pixel_salud;

-- Agregar columnas para ofertas individuales
ALTER TABLE Productos
ADD COLUMN enOferta BOOLEAN DEFAULT FALSE COMMENT 'Indica si el producto tiene oferta individual activa',
ADD COLUMN porcentajeDescuento INT DEFAULT 0 COMMENT 'Porcentaje de descuento individual (0, 10, 15, 20)';

-- Agregar índice para optimizar consultas de productos en oferta
CREATE INDEX idx_productos_enOferta ON Productos(enOferta, porcentajeDescuento);

-- Verificar que los valores sean válidos (0, 10, 15, 20)
ALTER TABLE Productos
ADD CONSTRAINT chk_porcentaje_valido 
CHECK (porcentajeDescuento IN (0, 10, 15, 20));

-- Mostrar estructura actualizada
DESCRIBE Productos;

SELECT 'Migración completada: Columnas enOferta y porcentajeDescuento agregadas exitosamente' AS Status;
