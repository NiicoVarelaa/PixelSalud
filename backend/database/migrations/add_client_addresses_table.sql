USE pixel_salud;

CREATE TABLE IF NOT EXISTS DireccionesClientes (
  idDireccion INT PRIMARY KEY AUTO_INCREMENT,
  idCliente INT NOT NULL,
  alias VARCHAR(60) NOT NULL,
  pais VARCHAR(50) NOT NULL DEFAULT 'Argentina',
  calle VARCHAR(120) NOT NULL,
  numero VARCHAR(20) NOT NULL,
  piso VARCHAR(20) NULL,
  departamento VARCHAR(20) NULL,
  localidad VARCHAR(80) NOT NULL,
  provincia VARCHAR(80) NOT NULL,
  codigoPostal VARCHAR(10) NOT NULL,
  referencias VARCHAR(255) NULL,
  esPredeterminada BOOLEAN NOT NULL DEFAULT FALSE,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  INDEX idx_direcciones_cliente (idCliente),
  INDEX idx_direcciones_cliente_predeterminada (idCliente, esPredeterminada)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
