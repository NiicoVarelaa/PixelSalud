-- ================================================
-- AGREGAR SOPORTE DE CUPONES A VENTAS ONLINE
-- ================================================

-- Agregar campo para almacenar el cupón aplicado
ALTER TABLE VentasOnlines
ADD COLUMN idCuponAplicado INT DEFAULT NULL COMMENT 'Cupón aplicado en esta venta' AFTER externalReference;

-- Crear foreign key
ALTER TABLE VentasOnlines
ADD CONSTRAINT fk_venta_cupon
FOREIGN KEY (idCuponAplicado) REFERENCES Cupones(idCupon) ON DELETE SET NULL;

-- Crear índice para mejorar búsquedas
CREATE INDEX idx_cupon_aplicado ON VentasOnlines(idCuponAplicado);

-- Verificar cambios
DESCRIBE VentasOnlines;
