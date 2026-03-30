USE pixel_salud;

CREATE TABLE IF NOT EXISTS Sucursales (
  idSucursal INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  horario VARCHAR(120) NULL,
  telefono VARCHAR(30) NULL,
  activo BOOLEAN DEFAULT TRUE,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Sucursales (codigo, nombre, direccion, horario, telefono)
VALUES
  ('central', 'Sucursal Central', '25 de Mayo 789, San Miguel de Tucuman, Tucuman', 'Lunes a Viernes 9:00-21:00', '+54 381 123-4567'),
  ('norte', 'Sucursal Norte', 'Av. Alem 199, San Miguel de Tucuman, Tucuman', 'Lunes a Sabado 8:00-22:00', '+54 381 765-4321')
ON DUPLICATE KEY UPDATE
  nombre = VALUES(nombre),
  direccion = VALUES(direccion),
  horario = VALUES(horario),
  telefono = VALUES(telefono),
  activo = TRUE;

ALTER TABLE VentasOnlines
  ADD COLUMN idSucursal INT NULL AFTER idCuponAplicado,
  ADD COLUMN sucursalNombre VARCHAR(100) NULL AFTER idSucursal,
  ADD COLUMN sucursalDireccion VARCHAR(255) NULL AFTER sucursalNombre,
  ADD COLUMN tipoEntrega ENUM('retiro_sucursal') DEFAULT 'retiro_sucursal' AFTER sucursalDireccion,
  ADD COLUMN dniClienteSnapshot INT NULL AFTER tipoEntrega,
  ADD COLUMN fechaNacimientoSnapshot DATE NULL AFTER dniClienteSnapshot,
  ADD COLUMN celularSnapshot VARCHAR(20) NULL AFTER fechaNacimientoSnapshot,
  ADD COLUMN termsAccepted BOOLEAN DEFAULT FALSE AFTER celularSnapshot,
  ADD COLUMN termsAcceptedAt DATETIME NULL AFTER termsAccepted,
  ADD COLUMN termsVersion VARCHAR(40) NULL AFTER termsAcceptedAt;

ALTER TABLE VentasOnlines
  ADD CONSTRAINT fk_ventas_sucursal
  FOREIGN KEY (idSucursal) REFERENCES Sucursales(idSucursal)
  ON DELETE SET NULL;

CREATE INDEX idx_ventas_sucursal ON VentasOnlines(idSucursal);
