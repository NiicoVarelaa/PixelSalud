USE pixel_salud;

ALTER TABLE DireccionesClientes
ADD COLUMN esPredeterminada BOOLEAN NOT NULL DEFAULT FALSE AFTER referencias;

UPDATE DireccionesClientes dc
INNER JOIN (
  SELECT idCliente, MIN(idDireccion) AS idDireccion
  FROM DireccionesClientes
  GROUP BY idCliente
) primeras ON primeras.idDireccion = dc.idDireccion
SET dc.esPredeterminada = TRUE;

CREATE INDEX idx_direcciones_cliente_predeterminada
ON DireccionesClientes (idCliente, esPredeterminada);
