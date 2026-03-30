-- Agrega el tipo de campaña 2X1 al enum existente
ALTER TABLE campanas_ofertas
  MODIFY COLUMN tipo ENUM('EVENTO', 'DESCUENTO', 'LIQUIDACION', 'TEMPORADA', '2X1') DEFAULT 'DESCUENTO';
