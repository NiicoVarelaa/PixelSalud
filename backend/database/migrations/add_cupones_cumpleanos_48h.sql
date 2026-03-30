USE pixel_salud;

ALTER TABLE Clientes
  ADD COLUMN IF NOT EXISTS fechaNacimiento DATE NULL AFTER dni;

ALTER TABLE Cupones
  MODIFY COLUMN fechaInicio DATETIME NOT NULL,
  MODIFY COLUMN fechaVencimiento DATETIME NOT NULL;

CREATE TABLE IF NOT EXISTS CuponesCumpleanosEnvios (
  idEnvio INT PRIMARY KEY AUTO_INCREMENT,
  idCliente INT NOT NULL,
  idCupon INT NULL,
  anioCumple SMALLINT NOT NULL,
  estado ENUM('enviado', 'fallido') NOT NULL,
  detalleError VARCHAR(255) NULL,
  fechaEnvio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  FOREIGN KEY (idCupon) REFERENCES Cupones(idCupon) ON DELETE SET NULL,

  INDEX idx_cliente_anio_estado (idCliente, anioCumple, estado),
  INDEX idx_fecha_envio (fechaEnvio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW CuponesActivos AS
SELECT
  c.*,
  (c.usoMaximo - c.vecesUsado) AS usosDisponibles,
  CASE
    WHEN NOW() > c.fechaVencimiento THEN 'expirado'
    WHEN c.vecesUsado >= c.usoMaximo THEN 'agotado'
    ELSE c.estado
  END AS estadoReal
FROM Cupones c
WHERE c.estado = 'activo'
  AND NOW() BETWEEN c.fechaInicio AND c.fechaVencimiento
  AND c.vecesUsado < c.usoMaximo;
