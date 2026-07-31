-- ============================================================
-- PIXEL SALUD - BASE DE DATOS COMPLETA (VERSIÓN CONSOLIDADA)
-- Versión: 2026
-- Descripción: Script limpio y refactorizado de una sola pasada.
-- Uso: Copiar y ejecutar todo el bloque en MySQL.
-- ============================================================

-- Eliminar base de datos si existe (¡CUIDADO EN PRODUCCIÓN!)
DROP DATABASE IF EXISTS pixel_salud;

-- Crear base de datos
CREATE DATABASE pixel_salud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pixel_salud;

-- ============================================================
-- 1. TABLAS SIN DEPENDENCIAS (Catálogos y Entidades Base)
-- ============================================================

CREATE TABLE Clientes (
  idCliente INT PRIMARY KEY AUTO_INCREMENT,
  nombreCliente VARCHAR(30) NOT NULL,
  apellidoCliente VARCHAR(30) NOT NULL,
  contraCliente VARCHAR(255) NOT NULL,
  emailCliente VARCHAR(50) UNIQUE NOT NULL,
  dni INT UNIQUE,
  fechaNacimiento DATE NULL,
  telefono VARCHAR(20) NULL,     
  direccion VARCHAR(100) NULL,   
  fecha_registro DATE DEFAULT (DATE(CURRENT_TIMESTAMP)),
  hora_registro TIME DEFAULT (TIME(CURRENT_TIMESTAMP)),
  rol VARCHAR(20) DEFAULT "cliente",
  activo BOOLEAN DEFAULT TRUE,
  tokenRecuperacion VARCHAR(255) NULL DEFAULT NULL,
  tokenExpiracion DATETIME NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Empleados (
  idEmpleado INT PRIMARY KEY AUTO_INCREMENT,
  nombreEmpleado VARCHAR(30) NOT NULL,
  apellidoEmpleado VARCHAR(30) NOT NULL,
  emailEmpleado VARCHAR(50) UNIQUE NOT NULL,
  contraEmpleado VARCHAR(255) NOT NULL,
  fecha_registro DATE DEFAULT (DATE(CURRENT_TIMESTAMP)),
  hora_registro TIME DEFAULT (TIME(CURRENT_TIMESTAMP)),
  rol VARCHAR(20) DEFAULT "empleado",
  activo BOOLEAN DEFAULT TRUE,
  dniEmpleado INT UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Admins (
  idAdmin INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  nombreAdmin VARCHAR(50) NOT NULL,
  contraAdmin VARCHAR(255) NOT NULL,
  emailAdmin VARCHAR(80) UNIQUE NOT NULL,
  rol VARCHAR(20) DEFAULT "admin",
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro DATE DEFAULT (DATE(CURRENT_TIMESTAMP)),
  hora_registro TIME DEFAULT (TIME(CURRENT_TIMESTAMP)), 
  dniAdmin INT UNIQUE 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Medicos (
  idMedico INT PRIMARY KEY AUTO_INCREMENT,
  nombreMedico VARCHAR(30) NOT NULL,
  apellidoMedico VARCHAR(30) NOT NULL,
  matricula INT UNIQUE NOT NULL,
  emailMedico VARCHAR(50) UNIQUE NOT NULL,
  contraMedico VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT "medico",
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro DATE DEFAULT (DATE(CURRENT_TIMESTAMP)),
  hora_registro TIME DEFAULT (TIME(CURRENT_TIMESTAMP))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Productos (
  idProducto INT PRIMARY KEY AUTO_INCREMENT,
  nombreProducto VARCHAR(200) NOT NULL,
  descripcion VARCHAR(500),
  precio DECIMAL(10,2),
  img TEXT NULL COMMENT 'DEPRECATED: Usar ImagenesProductos para nuevas imágenes.',
  categoria VARCHAR(30),
  stock INT, 
  activo BOOL DEFAULT TRUE,
  requiereReceta BOOLEAN DEFAULT FALSE,
  enOferta BOOLEAN DEFAULT FALSE COMMENT 'Indica si el producto tiene oferta individual activa',
  porcentajeDescuento INT DEFAULT 0 COMMENT 'Porcentaje de descuento individual (0, 10, 15, 20)',
  CONSTRAINT chk_porcentaje_valido CHECK (porcentajeDescuento IN (0, 10, 15, 20)),
  INDEX idx_productos_enOferta (enOferta, porcentajeDescuento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Cupones (
    idCupon INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipoCupon ENUM('porcentaje', 'monto_fijo') NOT NULL DEFAULT 'porcentaje',
    valorDescuento DECIMAL(10, 2) NOT NULL,
    descripcion VARCHAR(255),
    fechaInicio DATETIME NOT NULL,
    fechaVencimiento DATETIME NOT NULL,
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

CREATE TABLE campanas_ofertas (
  idCampana INT AUTO_INCREMENT PRIMARY KEY,
  nombreCampana VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  porcentajeDescuento DECIMAL(5,2) NOT NULL,
  fechaInicio DATETIME NOT NULL,
  fechaFin DATETIME NOT NULL,
  esActiva BOOLEAN DEFAULT 1,
  tipo ENUM('EVENTO', 'DESCUENTO', 'LIQUIDACION', 'TEMPORADA', '2X1') DEFAULT 'DESCUENTO',
  prioridad INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_activa (esActiva),
  INDEX idx_fechas (fechaInicio, fechaFin),
  INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Sucursales (
  idSucursal INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(30) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  horario VARCHAR(120) NULL,
  telefono VARCHAR(30) NULL,
  activo BOOLEAN DEFAULT TRUE,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 2. TABLAS CON DEPENDENCIAS (Foreign Keys)
-- ============================================================

CREATE TABLE ImagenesProductos (
  idImagen INT AUTO_INCREMENT PRIMARY KEY,
  idProducto INT NOT NULL,
  urlImagen VARCHAR(500) NOT NULL,
  orden TINYINT DEFAULT 1,
  esPrincipal BOOLEAN DEFAULT FALSE,
  altText VARCHAR(255) DEFAULT NULL,
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE,
  INDEX idx_producto (idProducto),
  INDEX idx_principal (idProducto, esPrincipal),
  INDEX idx_orden (idProducto, orden)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Permisos (
  idPermiso INT PRIMARY KEY AUTO_INCREMENT,
  crear_productos BOOLEAN DEFAULT FALSE,
  modificar_productos BOOLEAN DEFAULT FALSE,
  modificar_ventasE BOOLEAN DEFAULT FALSE,
  modificar_ventasO BOOLEAN DEFAULT FALSE,
  ver_ventasTotalesE BOOLEAN DEFAULT FALSE,
  ver_ventasTotalesO BOOLEAN DEFAULT FALSE,
  idEmpleado INT,
  idAdmin INT,
  FOREIGN KEY (idEmpleado) REFERENCES Empleados(idEmpleado),
  FOREIGN KEY (idAdmin) REFERENCES Admins(idAdmin) 
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DireccionesClientes (
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

CREATE TABLE Carrito (
  idCarrito INT PRIMARY KEY AUTO_INCREMENT,
  idProducto INT,
  idCliente INT,
  cantidad INT,
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VentasOnlines (
  idVentaO INT PRIMARY KEY AUTO_INCREMENT,
  totalPago DECIMAL(10,2) NOT NULL,
  fechaPago DATE DEFAULT (CURRENT_DATE),
  horaPago TIME DEFAULT (CURRENT_TIME),
  metodoPago VARCHAR(80),
  estado ENUM('pendiente', 'retirado', 'cancelado') DEFAULT 'pendiente',
  externalReference VARCHAR(255) UNIQUE,
  idCuponAplicado INT DEFAULT NULL COMMENT 'Cupón aplicado en esta venta',
  idCliente INT NOT NULL,
  idSucursal INT NULL,
  sucursalNombre VARCHAR(100) NULL,
  sucursalDireccion VARCHAR(255) NULL,
  tipoEntrega ENUM('retiro_sucursal') DEFAULT 'retiro_sucursal',
  dniClienteSnapshot INT NULL,
  fechaNacimientoSnapshot DATE NULL,
  celularSnapshot VARCHAR(20) NULL,
  termsAccepted BOOLEAN DEFAULT FALSE,
  termsAcceptedAt DATETIME NULL,
  termsVersion VARCHAR(40) NULL,
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  FOREIGN KEY (idCuponAplicado) REFERENCES Cupones(idCupon) ON DELETE SET NULL,
  FOREIGN KEY (idSucursal) REFERENCES Sucursales(idSucursal) ON DELETE SET NULL,
  INDEX idx_cupon_aplicado (idCuponAplicado),
  INDEX idx_ventas_sucursal (idSucursal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DetalleVentaOnline (
  idDetalle INT PRIMARY KEY AUTO_INCREMENT,
  idVentaO INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL NOT NULL,
  FOREIGN KEY (idVentaO) REFERENCES VentasOnlines(idVentaO) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE VentasEmpleados (
  idVentaE INT PRIMARY KEY AUTO_INCREMENT,
  idEmpleado INT NOT NULL,
  totalPago DECIMAL NOT NULL,
  fechaPago DATE DEFAULT (DATE(CURRENT_TIMESTAMP)),
  horaPago TIME DEFAULT (TIME(CURRENT_TIMESTAMP)),
  metodoPago VARCHAR(80),
  estado ENUM('completada', 'anulada') DEFAULT 'completada',
  FOREIGN KEY (idEmpleado) REFERENCES Empleados(idEmpleado) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE DetalleVentaEmpleado (
  idDetalleEm INT PRIMARY KEY AUTO_INCREMENT,
  idVentaE INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL NOT NULL,
  recetaFisica VARCHAR(100) DEFAULT NULL,
  FOREIGN KEY (idVentaE) REFERENCES VentasEmpleados(idVentaE) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Recetas (
  idReceta INT PRIMARY KEY AUTO_INCREMENT,
  dniCliente INT NOT NULL,
  idMedico INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  usada BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  fechaEmision DATE DEFAULT (CURRENT_DATE),
  FOREIGN KEY (dniCliente) REFERENCES Clientes(dni),
  FOREIGN KEY (idMedico) REFERENCES Medicos(idMedico),
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE MensajesClientes (
  idMensaje INT PRIMARY KEY AUTO_INCREMENT,
  idCliente INT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  asunto VARCHAR(200) DEFAULT 'Sin Asunto',
  tipoConsulta ENUM('general', 'pedido', 'receta', 'facturacion', 'otro') DEFAULT 'general',
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'nuevo',
  fechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
  leido TINYINT(1) DEFAULT 0,
  respuesta TEXT NULL,
  fechaRespuesta DATETIME NULL,
  respondidoPor VARCHAR(100) NULL,
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE SET NULL,
  INDEX idx_mensajes_estado_fecha (estado, fechaEnvio),
  INDEX idx_mensajes_tipo (tipoConsulta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Favoritos (
  idFavorito INT AUTO_INCREMENT PRIMARY KEY,
  idCliente INT NOT NULL,
  idProducto INT NOT NULL,
  fechaAgregado TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_cliente_producto (idCliente, idProducto),
  INDEX idx_cliente (idCliente),
  CONSTRAINT fk_fav_cliente FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  CONSTRAINT fk_fav_producto FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Ofertas (
    idOferta INT AUTO_INCREMENT PRIMARY KEY,
    idProducto INT NOT NULL,
    porcentajeDescuento DECIMAL(5, 2) NOT NULL,
    fechaInicio DATETIME NOT NULL,
    fechaFin DATETIME NOT NULL,
    esActiva TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='DEPRECATED: Usar campanas_ofertas y productos_campanas en su lugar';

CREATE TABLE productos_campanas (
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

CREATE TABLE CuponesUsados (
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

CREATE TABLE CuponesCumpleanosEnvios (
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

CREATE TABLE NewsletterSuscripciones (
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
  CONSTRAINT fk_newsletter_cliente FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE historial_ofertas (
  idHistorial INT PRIMARY KEY AUTO_INCREMENT,
  idProducto INT NOT NULL,
  accion ENUM('ACTIVADA', 'MODIFICADA', 'DESACTIVADA') NOT NULL,
  porcentajeAnterior INT DEFAULT 0,
  porcentajeNuevo INT DEFAULT 0,
  idUsuario INT NOT NULL,
  nombreUsuario VARCHAR(100),
  tipoUsuario ENUM('admin', 'empleado', 'sistema') NOT NULL,
  fechaHora DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE,
  INDEX idx_producto (idProducto),
  INDEX idx_fecha (fechaHora),
  INDEX idx_usuario (idUsuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historial de cambios en ofertas individuales de productos';

CREATE TABLE auditoria (
  idAuditoria INT PRIMARY KEY AUTO_INCREMENT,
  evento VARCHAR(100) NOT NULL COMMENT 'Tipo de evento',
  modulo VARCHAR(50) NOT NULL COMMENT 'Módulo del sistema',
  accion VARCHAR(50) NOT NULL COMMENT 'Acción realizada (CREATE, UPDATE, etc)',
  descripcion TEXT COMMENT 'Descripción detallada de la acción',
  tipoUsuario ENUM('admin', 'empleado', 'medico', 'cliente', 'sistema') NOT NULL,
  idUsuario INT NOT NULL COMMENT 'ID del usuario',
  nombreUsuario VARCHAR(100) COMMENT 'Nombre completo del usuario',
  emailUsuario VARCHAR(100) COMMENT 'Email del usuario',
  entidadAfectada VARCHAR(50) COMMENT 'Nombre de la entidad',
  idEntidad INT COMMENT 'ID del registro',
  datosAnteriores JSON COMMENT 'Estado anterior',
  datosNuevos JSON COMMENT 'Estado nuevo',
  ip VARCHAR(45) COMMENT 'Dirección IP del cliente',
  userAgent VARCHAR(255) COMMENT 'User agent',
  fechaHora DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_evento (evento),
  INDEX idx_modulo (modulo),
  INDEX idx_usuario (tipoUsuario, idUsuario),
  INDEX idx_fecha (fechaHora),
  INDEX idx_entidad (entidadAfectada, idEntidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
-- 3. VISTAS
-- ============================================================

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
  

-- ============================================================
-- 4. INSERCIÓN DE DATOS (Mocks y configuraciones)
-- ============================================================

-- Sucursales
INSERT INTO Sucursales (codigo, nombre, direccion, horario, telefono) VALUES
  ('central', 'Sucursal Central', '25 de Mayo 789, San Miguel de Tucuman, Tucuman', 'Lunes a Viernes 9:00-21:00', '+54 381 123-4567'),
  ('norte', 'Sucursal Norte', 'Av. Alem 199, San Miguel de Tucuman, Tucuman', 'Lunes a Sabado 8:00-22:00', '+54 381 765-4321');

-- Clientes
INSERT INTO Clientes (nombreCliente, apellidoCliente, contraCliente, emailCliente, dni) VALUES
('Carlos', 'Ramírez', 'carlos123', 'carlos.ramirez@email.com', 28123456),
('María', 'González', 'maria2024', 'maria.gonzalez@email.com', 30987654),
('Javier', 'Pérez', 'javipz', 'javier.perez@email.com', 25555111),
('Lucía', 'Hernández', 'luciaH99', 'lucia.hernandez@email.com', 33222888),
('Andrés', 'Torres', 'andresT!', 'andres.torres@email.com',27456789 ),
('Sofía', 'Martínez', 'sofiaM21', 'sofia.martinez@email.com',31654321 ),
('Pedro', 'Castillo', 'pedroC$', 'pedro.castillo@email.com',29111222 ),
('Daniela', 'López', 'daniL22', 'daniela.lopez@email.com',34777333 ),
('Juan', 'Cruz', 'juancrz', 'juan.cruz@email.com', 26888999),
('Valentina', 'Rojas', 'valenRojas', 'valentina.rojas@email.com', 32333444),
('Hugo', 'Salazar', 'hugoS!', 'hugo.salazar@email.com', 24901234),
('Paula', 'Méndez', 'paulamdz', 'paula.mendez@email.com', 35123987),
('Diego', 'Ruiz', 'diegoruiz', 'diego.ruiz@email.com', 28765123),
('Camila', 'Ortiz', 'camilaO99', 'camila.ortiz@email.com', 30432678),
('Fernando', 'Navarro', 'fernav', 'fernando.navarro@email.com', 27999555);

-- Empleados
INSERT INTO Empleados (nombreEmpleado, apellidoEmpleado, emailEmpleado, contraEmpleado) VALUES
('Luis', 'Fernández', 'luis.fernandez@empresa.com', 'luisF2024'),
('Ana', 'Morales', 'ana.morales@empresa.com', 'anaM2024'),
('Roberto', 'Santos', 'roberto.santos@empresa.com', 'robs123'),
('Elena', 'Vega', 'elena.vega@empresa.com', 'elenaV!'),
('Miguel', 'Domínguez', 'miguel.dominguez@empresa.com', 'miguelD'),
('Carmen', 'Ramos', 'carmen.ramos@empresa.com', 'carmenR'),
('Diego', 'Herrera', 'diego.herrera@empresa.com', 'diegoH'),
('Laura', 'Suárez', 'laura.suarez@empresa.com', 'lauraS2024'),
('Tomás', 'Gómez', 'tomas.gomez@empresa.com', 'tomasG!'),
('Marta', 'Cano', 'marta.cano@empresa.com', 'martaCano'),
('Iván', 'Luna', 'ivan.luna@empresa.com', 'ivanL2024'),
('Sara', 'Nieto', 'sara.nieto@empresa.com', 'saraN99'),
('Pablo', 'Gil', 'pablo.gil@empresa.com', 'pabloG'),
('Natalia', 'Flores', 'natalia.flores@empresa.com', 'nataliaF'),
('Adrián', 'Cortés', 'adrian.cortes@empresa.com', 'adrianC24');

-- Admin 
INSERT INTO Admins (nombreAdmin, contraAdmin, emailAdmin) VALUES 
('Administrador General', '$2b$10$TmQeliHWSy7HM1Y4WwxF8eWznWgfpi2sj3WzofN0wYpQ7Ws6hXIL2', 'admin@empresa.com');  

-- Permisos del admin
INSERT INTO Permisos (crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO, idEmpleado, idAdmin) 
VALUES (TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NULL, 1);

-- Fragancias
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Dior Sauvage Parfum x 100 ml', 'Una fragancia intensa y sofisticada.', 297973.00, 'Fragancias', 20, FALSE, TRUE),
('Giorgio Armani Acqua Di Gio Parfum x 100 ml', 'Aromático y refrescante.', 271800.00, 'Fragancias', 30, FALSE, TRUE),
('Giorgio Armani My Way Nectar Edp x 90 ml', 'Femenino y vibrante.', 269100.00, 'Fragancias', 25, FALSE, TRUE),
('Givenchy L''Interdit Rouge Ultime Edp x 80 ml', 'Audaz y cálida.', 259200.00, 'Fragancias', 15, FALSE, TRUE),
('Lancome La Vie Est Belle Edp x 75 ml', 'Dulce y floral.', 256742.90, 'Fragancias', 10, FALSE, TRUE),
('Paco Rabanne One Million Elixir Intense Edp x 200 ml', 'Intenso y envolvente.', 250863.00, 'Fragancias', 35, FALSE, TRUE),
('Miss Dior Parfum x 80 ml', 'Romántico y sofisticado.', 248670.00, 'Fragancias', 40, FALSE, TRUE),
('CK One Edt x 100 ml','Fragancia icónica unisex.',114345.00,'Fragancias',58, FALSE, TRUE),
('Paco Rabanne Invictus Edt x 100 ml','Aroma enérgico y masculino.',145800.00,'Fragancias',64, FALSE, TRUE),
('Carolina Herrera CH Men Edt x 100 ml','Elegante y cálida.',114300.00,'Fragancias',23, FALSE, TRUE),
('Carolina Herrera 212 NYC Men Edt x 100 ml','Urbano y moderno.',135000.00,'Fragancias',76, FALSE, TRUE),
('Lattafa Asad Zanzíbar Edp x 100 ml','Oriental amaderado.',80990.00,'Fragancias',12, FALSE, TRUE),
('Dolce and Gabbana Light Blue Pour Homme Edt x 50 ml','Fresco y mediterráneo.',143093.00,'Fragancias',14, FALSE, TRUE),
('Defy Men Edt x 50 ml','Audaz y contemporáneo.',111650.00,'Fragancias',24, FALSE, TRUE),
('Lattafa Badee Al Oud Noble Blush x 100 ml','Floral Frutal Gourmand.',99990,'Fragancias',7, FALSE, TRUE),
('Lattafa Badee Al Oud Sublime x 100 ml','Amaderada Aromática.',112700.00,'Fragancias',32, FALSE, TRUE),
('Cacharel Anais x 50 ml','Dulzura y feminidad.',99438.00,'Fragancias',23, FALSE, TRUE),
('Lattafa Yara x 100 ml','Jugosa y adictiva.',85990.00,'Fragancias',6, FALSE, TRUE),
('Lattafa Yara Candy x 100 ml','Frutas confitadas.',89930.00,'Fragancias',3, FALSE, TRUE),
('Armaf Club de Nuit Women x 105 ml','Femenina sofisticada.',110040.00,'Fragancias',10, FALSE, TRUE),
('Adolfo Dominguez Fresia Solar x 120 ml','Reivindicamos el ingrediente puro.',72900.00,'Fragancias',11, FALSE, TRUE);

-- Belleza
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Mascara de Pestanas Maybelline Falsies Surreal Very Black', 'Ideal para dar volumen.', 33985,'Belleza', 30, FALSE, TRUE),
('Sérum para Ojos L´Oréal Paris Revitalift Ácido Hialurónico x 20 ml', 'Hidrata profundamente.', 31999,'Belleza', 20, FALSE, TRUE),
('Máscara de Pestañas Maybelline Colossal Volum Express Black', 'A prueba de agua.', 23966,'Belleza', 15, FALSE, TRUE),
('Hidratante Facial en Gel Neutrogena Hydro Boost x 50 g', 'Hidratación intensa.', 20541,'Belleza', 25, FALSE, TRUE),
('Shampoo Elvive Glycolic Gloss x 400 ml', 'Reduce la porosidad.', 5687,'Belleza', 45, FALSE, TRUE),
('Acondicionador Elvive Reparación Total 5 x 400 ml', 'Fortalece y protege.', 5193,'Belleza', 35, FALSE, TRUE),
('Protector Térmico Tresemmé Spray x 120 ml', 'Protección hasta 230 C.', 5166,'Belleza', 10, FALSE, TRUE),
('Máscara de Pestañas Maybelline Sensational Sky High Waterproof Very Black x 7,2 ml','Alargamiento ilimitado.',24766.00,'Belleza',8, FALSE, TRUE),
('Corrector de Ojeras Rimmel The Multi-Tasker x 10 ml','Corrige, esculpe e ilumina.',16920.00,'Belleza',12, FALSE, TRUE),
('Corrector de Ojeras Maybelline Instant Age Rewind Eraser x 6 ml','Corrige e ilumina.',17914.00,'Belleza',23, FALSE, TRUE),
('Polvo de Maquillaje Rimmel Natural Bronzer x 14 g','Brillo cálido.',14832.00,'Belleza',3, FALSE, TRUE),
('Máscara de Pestañas Extreme Wavelash Tubing','Pestañas largas.',17990.00,'Belleza',4, FALSE, TRUE),
('Base Líquida de Maquillaje Maybelline Fit Me Matte Poreless Foundation x 30 ml','Cubre imperfecciones.',19195.00,'Belleza',7, FALSE, TRUE),
('Polvo Compacto Maybelline Fit Me Matte x 12 g','Unifica el color.',10916.00,'Belleza',9, FALSE, TRUE),
('Base Primer Rimmel 3 En 1 Multi Tasker x 30 ml','Base potenciadora.',22795.00,'Belleza',12, FALSE, TRUE),
('Lápiz Labial Rimmel Lasting Finish Extreme Matte 840 Mulberry','Larga duración.',19200.00,'Belleza',2, FALSE, TRUE),
('Lápiz Labial Extreme Going Silky x 4 g','Textura cremosa.',15990.00,'Belleza',5, FALSE, TRUE),
('Brillo Labial Rimmel Oh My Gloss! Lip Oil x 4,5 ml','Acabado brillante.',15500.00,'Belleza',23, FALSE, TRUE),
('Base Líquida Maybelline Fit Me Fresh Tint Spf 50','Alta cobertura FPS 50.',17400.00,'Belleza',12, FALSE, TRUE),
('Rubor Compacto Get the Look Silky & Natural','Realza y define.',17990.00,'Belleza',15, FALSE, TRUE);

-- Dermocosmética
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Sérum Hidratante Isdin Hyaluronic Concentrate x 30 ml', 'Ultrahidratante.', 77817,'Dermocosmética', 12, FALSE, TRUE),
('Aceite Limpiador Facial Isdin Essential Cleansing x 200 ml', 'Suave y ligero.', 67025,'Dermocosmética', 18, FALSE, TRUE),
('Crema Facial Isdin Isdinceutics Hyaluronic Moisture x 50 g', 'Hidratante intensiva.', 66616,'Dermocosmética', 20, FALSE, TRUE),
('Crema Facial de Noche Cetaphil Healty Renew x 48 g', 'Con péptidos.', 59920,'Dermocosmética', 22, FALSE, TRUE),
('Agua Micelar Avène Cleanance x 400 ml', 'Limpia suavemente.', 38780,'Dermocosmética', 24, FALSE, TRUE),
('Crema Antiage de día Caviahue x 50 g', 'Con ácido hialurónico.', 32000,'Dermocosmética', 25, FALSE, TRUE),
('Protector Solar Caviahue FPS 50+ x 150 g', 'Textura ligera.', 22000,'Dermocosmética', 28, FALSE, TRUE),
('Sérum Vichy Liftactiv Collagen x 30 ml', 'Rápida absorción.', 95228.00,'Dermocosmética',12, FALSE, TRUE),
('Contorno de Ojos Vichy Mineral 89 x 15 ml', 'Suaviza líneas de expresión.', 45983.00,'Dermocosmética',12, FALSE, TRUE),
('Agua Termal Volcánica 170ml.', 'Para piel sensible.', 20909.00,'Dermocosmética',12, FALSE, TRUE),
('Sérum Antiedad La Roche Posay Hyalu B5 Pieles Sensibles X 30 ml', 'Tratamiento antiarrugas.', 81119.00,'Dermocosmética',12, FALSE, TRUE),
('Reparador de Labios Eucerin S.O.S Aquaphor x 10 ml', 'Protege labios secos.', 24646.00,'Dermocosmética',12, FALSE, TRUE),
('Gel Limpiador CeraVe Espumoso x 236 ml', 'Para rostro y cuerpo.', 34068.00,'Dermocosmética',12, FALSE, TRUE),
('Concentrado Vichy Minéral 89 Fortificante y Reconstituyente x 50 ml', 'Refuerza barrera cutánea.', 56239.00,'Dermocosmética',12, FALSE, TRUE),
('Limpiador Corporal Cetaphil Pro Ad Control x 295 ml','Pieles secas.', 39260.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Combo Eucerin Aceite de Ducha pH5 x 200 ml + Crema pH5 Intensiva x 450 ml','Preserva las defensas naturales.', 53440.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Kit Aveno Limpieza + Hidratación + Protector Solar Fps 50','Humecta y protege.', 67940.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Combo Lambdapil Shampoo Anticaída x 200 ml + Suplemento Dietario Isdin Lambdapil Hairdensity x 60 Cáps','Ayuda al tratamiento.', 55450.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Leche Autobronceante Vichy Idéal Soleil x 100 ml','Auto-bronceador natural.', 49720.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Protector Solar La Roche Posay Anthelios UV 400 Anti Manchas Spf 50 + x 50 ml','Protector facial.', 44717.00 ,'Dermocosmética', 34, FALSE, TRUE);

-- Medicamentos con Receta
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Amoxicilina 500mg', 'Antibiótico', 3961,'Medicamentos con Receta', 15, TRUE, TRUE),
('Losartán 50mg', 'Antihipertensivo', 18256,'Medicamentos con Receta', 20, TRUE, TRUE),
('Metformina 850mg', 'Control de glucosa', 6244,'Medicamentos con Receta', 25, TRUE, TRUE),
('Sertralina 50mg', 'Antidepresivo', 6810,'Medicamentos con Receta', 12, TRUE, TRUE),
('Omeprazol 20mg', 'Para reflujo', 3021,'Medicamentos con Receta', 18, TRUE, TRUE),
('Meprednisona 20mg', 'Corticosteroide', 7777,'Medicamentos con Receta', 22, TRUE, TRUE),
('Clonazepam 2mg', 'Ansiolítico', 4025,'Medicamentos con Receta', 30, TRUE, TRUE),
('Amoxidal respiratorio 1 g iny.x 1 dosis', 'Antibiótico bactericida.', 7781.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Lotrial 20 mg comp.x 60', 'Hipertensión arterial.', 21071.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Rivotril 2 mg comp.x 60', 'Trastornos de ansiedad.', 19025.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Sertralina teva 50 mg comp.rec.x 30', 'Trastornos depresivos.', 6810.63,'Medicamentos con Receta',15, TRUE, TRUE),
('Aspirina prevent comp.cub.enterica x 50', 'Prevención de infartos.', 37481.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Ibupirac 600 capsula blanda 600 mg x 50', 'Analgésico y antiinflamatorio.', 35080.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Neuryl gts.x 20 ml', 'Trastornos psiquiátricos.', 11135.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Sertal compuesto comp.rec.x 20', 'Espasmolítico.', 12802.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Reliveran doxi 20/20mg x 14', 'Náuseas y vómitos.', 21956.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Omeprazol richet 20 mg caps.x 28', 'Para la acidez.', 16605.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Amlodipina richet 5 mg comp.x 30', 'Amlodipina.', 11859.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Atorvastan 10 mg comp.rec.x 30', 'Disminuye colesterol.', 30331.00,'Medicamentos con Receta',1, TRUE, TRUE),
('T4 montpellier 75 75 mcg comp.x 50', 'Reemplazo hormonal.', 16572.00,'Medicamentos con Receta',15, TRUE, TRUE);

-- Medicamentos Venta Libre
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Paracetamol 500mg', 'Analgésico', 3557,'Medicamentos Venta Libre', 30, FALSE, TRUE),
('Ibuprofeno 400mg', 'Antiinflamatorio', 2214,'Medicamentos Venta Libre', 35, FALSE, TRUE),
('Loratadina 10mg', 'Antihistamínico', 3650,'Medicamentos Venta Libre', 29, FALSE, TRUE),
('Ambroxol', 'Mucolítico', 7395,'Medicamentos Venta Libre', 33, FALSE, TRUE),
('Uvasal Naranja x 15 sobres dobles', 'Ardor estomacal', 13500,'Medicamentos Venta Libre', 27, FALSE, TRUE),
('Bengue Ultra Gel x 35g', 'Alivio muscular', 13951,'Medicamentos Venta Libre', 21, FALSE, TRUE),
('Alikal Limón x 30 sobres', 'Antiácido', 22500,'Medicamentos Venta Libre', 18, FALSE, TRUE),
('Sinamida Terbinafina Crema Antimicótica x 30 g', 'Hongos de la piel.', 10000.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Tafirolito Paracetamol Mascticable 160 mg x 20 comp', 'Tipo de Venta Libre.', 4797.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Geniol Paracetamol 500 mg x 16 Comp', 'Reumatismo.', 4278.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Enterogermina Plus Ampollas de 5 ml x 5 un', 'Probiótico.', 31800.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Buscapina Perlas x 20 Cáps', 'Espasmo doloroso.', 10560.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Resaquit x 12 Comp', 'Fórmula compuesta.', 6341.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Allerhit Spray Nasal x 10 ml', 'Congestión nasal.', 7990.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Alernix 24 Cetirizina x 10 Cáps', 'Rinitis alérgica.', 7114.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Acemuk 200 mg Acetilcisteína x 10 Tabletas Efervescentes', 'Secreción mucosa.', 11940.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Bisolvon Adultos Jarabe x 125 ml', 'Catarro bronquial.', 14415.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Empecid Crema Antimicótica x 20 g', 'Infecciones fúngicas.', 13748.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Melatol Plus Inductor de Sueño x 30 Comp', 'Inductor del sueño.', 19206.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Inductor de Sueño Armonil Noche x 3 mg x 30 Comp', 'Alteraciones del sueño.', 12276.00,'Medicamentos Venta Libre',30, FALSE, TRUE);

-- Cuidado Personal
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Desodorante Rexona Clinical Men en Crema x 48 g', 'Antitranspirante.', 11145,'Cuidado Personal', 40, FALSE, TRUE),
('Combo Colgate Clean Mint Limpieza Completa', 'Prevención bucal.', 10837,'Cuidado Personal', 44, FALSE, TRUE),
('Cepillos Interdentales Oral-B Micro x 10 Un', 'Limpieza profunda.', 10119,'Cuidado Personal', 46, FALSE, TRUE),
('Limpiador de Prótesis Corega Tabs 3 Minutos x 30 un', 'Elimina bacterias.', 7353,'Cuidado Personal', 23, FALSE, TRUE),
('Pasta Dental Colgate Luminous White Glow x 70 g', 'Blanqueamiento.', 4200,'Cuidado Personal', 33, FALSE, TRUE),
('Cepillo Dental Colgate Bamboo Carbón x 2 un', 'Cepillo ecológico.', 3158,'Cuidado Personal', 14, FALSE, TRUE),
('Oleo Pantene Nutritivo x 95 ml', 'Para cabello seco.', 8750.00,'Cuidado Personal',40, FALSE, TRUE),
('Shampoo Tio Nacho Anticanas x 415 ml', 'Anti-caída.', 8990.00,'Cuidado Personal',40, FALSE, TRUE),
('Kit Elvive Glycolic Gloss Rutina Brillo Intenso', 'Brillo intenso.', 28621.00,'Cuidado Personal',40, FALSE, TRUE),
('Kit Dove Bond Intense Repair', 'Cuidado capilar.', 28804.00,'Cuidado Personal',40, FALSE, TRUE),
('Enjuague Bucal Listerine Cuidado Total x 500 ml', 'Elimina gérmenes.', 6206,'Cuidado Personal',40, FALSE, TRUE),
('Enjuague Bucal Colgate Plax Odor Control x 500 ml', 'Aliento fresco.', 7521,'Cuidado Personal',40, FALSE, TRUE),
('Repelente para Mosquitos OFF! Defense Bebé x 100 ml', 'Apto bebés.', 12173,'Cuidado Personal',40, FALSE, TRUE),
('Repelente OFF! Defense Extreme Gel x 100 ml', 'Hasta 10 horas.', 11179,'Cuidado Personal',40, FALSE, TRUE),
('Repelente Off Extra Duración Aerosol x 170 g', 'Perfecto para playa.', 10691,'Cuidado Personal',40, FALSE, TRUE),
('Máquina Venus Recargable Área Íntima', 'Cuidado delicado.', 14466,'Cuidado Personal',40, FALSE, TRUE),
('Gel de Ducha Home Spa Live & Love x 115 ml', 'Despierta sentidos.', 3196,'Cuidado Personal',40, FALSE, TRUE),
('Cabezales Repuestos Oral-B Disney Cars x 2 un', 'Limpieza superior.', 7592,'Cuidado Personal',40, FALSE, TRUE),
('Óleo + Sérum Capilar Dove Bond Intense Repair x 110 ml', 'Repara daños.', 10296,'Cuidado Personal',40, FALSE, TRUE),
('Crema para Peinar Pantene Keratina x 300 ml', 'Protege de calor.', 10296,'Cuidado Personal',23, FALSE, TRUE);

-- Bebes y Niños
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Leche Infantil en Polvo Nutrilon 3 Pouch x 1,2 kg', 'A partir de 1 año.', 47116,'Bebes y Niños',40, FALSE, TRUE),
('Pañales Huggies Supreme Care Jumbo', 'Cuidado Natural.', 35579,'Bebes y Niños',50, FALSE, TRUE),
('Pañales Pampers Deluxe Protection RN+ x 56 un', 'Máxima absorción.', 31617,'Bebes y Niños',55, FALSE, TRUE),
('Vasos Avent Contenedores para Leche Materna x 10 un', 'Eficientes.', 40879,'Bebes y Niños',60, FALSE, TRUE),
('Shampoo Aveno Bebes y Niños x 250 ml', 'Limpia y protege.', 15444,'Bebes y Niños',25, FALSE, TRUE),
('Toallas Húmedas Farmacity Bebé Avena x 96', 'Antibacteriales.', 6900,'Bebes y Niños',33, FALSE, TRUE),
('Chupetes Avent Azul Ultra Soft 6 - 18 Meses x 2', 'Suaves y flexibles.', 18479,'Bebes y Niños',30, FALSE, TRUE),
('Fórmula Sancor Bebé Advanced 3 Estuche x 800 g', 'De 1 a 2 años.', 14938.00,'Bebes y Niños',40, FALSE, TRUE),
('Fórmula Láctea Polvo Nestlé Nidina 3 x 800 g', 'Con fibra.', 15132.00,'Bebes y Niños',40, FALSE, TRUE),
('Leche en Polvo Nestle Nido 3 x 370 g', 'Nutrientes esenciales.', 5744.00,'Bebes y Niños',40, FALSE, TRUE),
('Leche Infantil Líquida Nan 3 x 24', 'Líquida.', 51454.00,'Bebes y Niños',40, FALSE, TRUE),
('Leche Infantil Polvo Vital 3 12+ Meses x 800 g', 'Con Hierro y Zinc.', 28839.00,'Bebes y Niños',40, FALSE, TRUE),
('Pañales Pampers Deluxe Protection', 'Protección delicada.', 42426.00,'Bebes y Niños',40, FALSE, TRUE),
('Combo Huggies Natural Care', 'Suavidad insuperable.', 29221.00,'Bebes y Niños',40, FALSE, TRUE),
('Tetina Natural Feeling Chicco 6 m+ x 2 un', 'Doble válvula.', 14490.00,'Bebes y Niños',40, FALSE, TRUE),
('Mamadera NUK First Choice Mickey Mouse Gris x 300 ml', 'Tetina anatómica.', 26009.00,'Bebes y Niños',40, FALSE, TRUE),
('Crema Hipoglós Protección contra Paspaduras x 30 g', 'Cuidado diario.', 7162.00,'Bebes y Niños',40, FALSE, TRUE),
('Jabón en Barra Baby Dove Humectación Sensible x 75 g', 'Hipoalergénico.', 2011.00,'Bebes y Niños',40, FALSE, TRUE),
('Toallitas Húmedas Huggies Limpieza Diaria x 112 un', 'Previenen irritaciones.', 8117.00,'Bebes y Niños',40, FALSE, TRUE),
('Set Chupete NUK Mickey Mouse T2 x 2 un', 'Sensación agradable.', 15891.00,'Bebes y Niños',40, FALSE, TRUE);

-- Nutrición y Deportes
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Barra Pure Wellness Cookies and Cream', 'Complemento ideal.', 2490,'Nutrición y Deportes', 130, FALSE, TRUE),
('Ena Creatina Monohidrato en Polvo x 300 g', 'Mejora rendimiento.', 40000,'Nutrición y Deportes', 44, FALSE, TRUE),
('Barra Pure Wellness Banana Split', 'Snack saludable.', 2490,'Nutrición y Deportes', 120, FALSE, TRUE),
('Pure Wellness Creatina Power Monohidrato', 'Libre de gluten.', 19740,'Nutrición y Deportes', 23, FALSE, TRUE),
('Pure Wellness Colágeno x 500 g x 60 un', 'Cuida la piel.', 18900,'Nutrición y Deportes', 67, FALSE, TRUE),
('Ultraflex Lata x 300 g', 'Con Vitamina C.', 39900,'Nutrición y Deportes', 45, FALSE, TRUE),
('Zentro Citrato de Magnesio x 60 Comp', 'Fácil absorción.', 16848,'Nutrición y Deportes',124, FALSE, TRUE),
('Trb-Pharma Blue Vit B12 x 20 un', 'Apto vegano.', 11500,'Nutrición y Deportes',65, FALSE, TRUE),
('Probióticos Floragut B420 Metabolismo x 30 Cáps', 'Probiótico estable.', 59850,'Nutrición y Deportes',67, FALSE, TRUE),
('Pure Wellness Omega3 Fish Oil', 'Aceite de Pescado.', 15900,'Nutrición y Deportes',33, FALSE, TRUE),
('Creatina + electrolitos pink lemon 302 gr', 'Optimiza hidratación.', 30600,'Nutrición y Deportes',45, FALSE, TRUE),
('Creatina micronizada sabor naranja 342 gr', 'Mejora potencia.', 34000,'Nutrición y Deportes',15, FALSE, TRUE),
('Calcio + vitamina d pastilla de goma', 'Fortalece huesos.', 28195,'Nutrición y Deportes',89, FALSE, TRUE),
('Pure Wellness Omega Dual', 'Con aceite de chía.', 18900,'Nutrición y Deportes',53, FALSE, TRUE),
('Geonat Citrato de Magnesio 500 x 30 Comp', 'Relajación muscular.', 11490,'Nutrición y Deportes',56, FALSE, TRUE),
('Supradyn Magnesio 200 mg x 30 Comp', 'Reduce calambres.', 15664,'Nutrición y Deportes',76, FALSE, TRUE),
('Holo Magnesio Integral Sabor Naranja x 30 Sobres', 'Óptima absorción.', 18829,'Nutrición y Deportes',87, FALSE, TRUE),
('ISA +50 Resveratrol Ginkgo Biloba x 30 Comp', 'Antioxidante.', 12668,'Nutrición y Deportes',23, FALSE, TRUE),
('Ultraflex HMB 3000 Lata x 420 g', 'Con ácido hialurónico.', 49500,'Nutrición y Deportes',43, FALSE, TRUE),
('Panalab Valcatil Max x 120 Cápsulas Blandas', 'Cabellos y uñas.', 105727,'Nutrición y Deportes',16, FALSE, TRUE),
('Capskrill Omega 3 Aceite de Krill', 'Mejora perfil lipídico.', 95901,'Nutrición y Deportes',97, FALSE, TRUE),
('Pure Wellness Chía Oil', 'Mejora colesterol.', 15900,'Nutrición y Deportes',25, FALSE, TRUE),
('Metasitol x 60 Cáps', 'Estimulante insulínico.', 73900,'Nutrición y Deportes',65, FALSE, TRUE);

-- Cupones
INSERT INTO Cupones (codigo, tipoCupon, valorDescuento, descripcion, fechaInicio, fechaVencimiento, usoMaximo, tipoUsuario, montoMinimo) 
VALUES ('BIENVENIDA10-TEMPLATE', 'porcentaje', 10.00, 'Cupón de bienvenida - 10% de descuento en tu primera compra', NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY), 1, 'nuevo', 0.00);

-- Campañas
INSERT INTO campanas_ofertas (nombreCampana, descripcion, porcentajeDescuento, fechaInicio, fechaFin, esActiva, tipo, prioridad) 
VALUES ('Cyber Monday 2026', 'Descuentos del 25%', 25.00, NOW(), '2026-12-31 23:59:59', 1, 'EVENTO', 10);

-- Productos Campañas
INSERT INTO productos_campanas (idCampana, idProducto, esActivo) VALUES
(1, 1, 1), (1, 2, 1), (1, 3, 1), (1, 11, 1), (1, 12, 1), (1, 16, 1), (1, 26, 1);

-- ============================================================
-- 5. MENSAJES FINALES
-- ============================================================

SELECT '✅ Base de datos PIXEL SALUD refactorizada y creada exitosamente' AS Status;
SELECT CONCAT('📦 Total de productos: ', COUNT(*)) AS Productos FROM Productos;
SELECT CONCAT('👥 Total de clientes: ', COUNT(*)) AS Clientes FROM Clientes;