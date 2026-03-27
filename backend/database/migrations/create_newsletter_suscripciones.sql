-- Tabla de suscripciones newsletter (flujo público)
CREATE TABLE IF NOT EXISTS NewsletterSuscripciones (
  idSuscripcion INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL,
  nombre VARCHAR(100) NULL,
  idCliente INT NULL,
  fuente VARCHAR(50) NOT NULL DEFAULT 'footer',
  aceptaMarketing TINYINT(1) NOT NULL DEFAULT 1,
  estado ENUM('activa', 'baja') NOT NULL DEFAULT 'activa',
  fechaSuscripcion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fechaActualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_newsletter_email (email),
  INDEX idx_newsletter_estado (estado),
  INDEX idx_newsletter_fecha (fechaSuscripcion),
  CONSTRAINT fk_newsletter_cliente
    FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
