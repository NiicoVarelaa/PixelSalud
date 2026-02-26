-- ============================================================
-- PIXEL SALUD - BASE DE DATOS COMPLETA
-- Versión: 2026
-- Descripción: Script completo con estructura, datos demo y sistema de múltiples imágenes
-- Uso: Copiar y pegar este script completo en MySQL
-- ============================================================

-- Eliminar base de datos si existe (¡CUIDADO EN PRODUCCIÓN!)
DROP DATABASE IF EXISTS pixel_salud;

-- Crear base de datos
CREATE DATABASE pixel_salud CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pixel_salud;

-- ============================================================
-- TABLAS SIN DEPENDENCIAS (Sin Foreign Keys)
-- ============================================================

-- Tabla: Clientes
CREATE TABLE Clientes (
  idCliente INT PRIMARY KEY AUTO_INCREMENT,
  nombreCliente VARCHAR(30) NOT NULL,
  apellidoCliente VARCHAR(30) NOT NULL,
  contraCliente VARCHAR(255) NOT NULL,
  emailCliente VARCHAR(50) UNIQUE NOT NULL,
  dni INT UNIQUE,
  telefono VARCHAR(20) NULL,     
  direccion VARCHAR(100) NULL,   
  fecha_registro DATE DEFAULT (DATE(CURRENT_TIMESTAMP)),
  hora_registro TIME DEFAULT (TIME(CURRENT_TIMESTAMP)),
  rol VARCHAR(20) DEFAULT "cliente",
  activo BOOLEAN DEFAULT TRUE,
  tokenRecuperacion VARCHAR(255) NULL DEFAULT NULL,
  tokenExpiracion DATETIME NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Empleados
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

-- Tabla: Admins
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

-- Tabla: Medicos
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

-- Tabla: Productos (SIN campo 'img', ahora se usa ImagenesProductos)
CREATE TABLE Productos (
  idProducto INT PRIMARY KEY AUTO_INCREMENT,
  nombreProducto VARCHAR(200) NOT NULL,
  descripcion VARCHAR(500),
  precio DECIMAL(10,2),
  img TEXT NULL COMMENT 'DEPRECATED: Usar ImagenesProductos para nuevas imágenes. Mantenido por compatibilidad.',
  categoria VARCHAR(30),
  stock INT, 
  activo BOOL DEFAULT TRUE,
  requiereReceta BOOLEAN DEFAULT FALSE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: ImagenesProductos (NUEVA - Sistema de múltiples imágenes)
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT = 'Almacena múltiples imágenes por producto con orden y prioridad';

-- Tabla: Cupones
CREATE TABLE Cupones (
    idCupon INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    tipoCupon ENUM('porcentaje', 'monto_fijo') NOT NULL DEFAULT 'porcentaje',
    valorDescuento DECIMAL(10, 2) NOT NULL,
    descripcion VARCHAR(255),
    fechaInicio DATE NOT NULL,
    fechaVencimiento DATE NOT NULL,
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

-- Tabla: Campañas de Ofertas
CREATE TABLE campanas_ofertas (
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

-- ============================================================
-- TABLAS CON DEPENDENCIAS (Con Foreign Keys)
-- ============================================================

-- Tabla: Permisos
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

-- Tabla: Carrito
CREATE TABLE Carrito (
  idCarrito INT PRIMARY KEY AUTO_INCREMENT,
  idProducto INT,
  idCliente INT,
  cantidad INT,
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: VentasOnlines
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
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  FOREIGN KEY (idCuponAplicado) REFERENCES Cupones(idCupon) ON DELETE SET NULL,
  INDEX idx_cupon_aplicado (idCuponAplicado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: DetalleVentaOnline
CREATE TABLE DetalleVentaOnline (
  idDetalle INT PRIMARY KEY AUTO_INCREMENT,
  idVentaO INT NOT NULL,
  idProducto INT NOT NULL,
  cantidad INT NOT NULL,
  precioUnitario DECIMAL NOT NULL,
  FOREIGN KEY (idVentaO) REFERENCES VentasOnlines(idVentaO) ON DELETE CASCADE,
  FOREIGN KEY (idProducto) REFERENCES Productos(idProducto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: VentasEmpleados
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

-- Tabla: DetalleVentaEmpleado
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

-- Tabla: Recetas
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

-- Tabla: MensajesClientes
CREATE TABLE MensajesClientes (
  idMensaje INT PRIMARY KEY AUTO_INCREMENT,
  idCliente INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  asunto VARCHAR(100) DEFAULT 'Sin Asunto',
  mensaje TEXT NOT NULL,
  estado VARCHAR(20) DEFAULT 'nuevo',
  fechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
  leido TINYINT(1) DEFAULT 0,
  respuesta TEXT NULL,
  fechaRespuesta DATETIME NULL,
  respondidoPor VARCHAR(100) NULL,
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: Favoritos
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

-- Tabla: Ofertas (DEPRECATED - Usar campanas_ofertas)
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

-- Tabla: Productos de Campañas
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

-- Tabla: CuponesUsados
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

-- Tabla: Auditoría
CREATE TABLE auditoria (
  idAuditoria INT PRIMARY KEY AUTO_INCREMENT,
  evento VARCHAR(100) NOT NULL COMMENT 'Tipo de evento (ej: VENTA_CREADA, PERMISO_MODIFICADO)',
  modulo VARCHAR(50) NOT NULL COMMENT 'Módulo del sistema (ventas, productos, permisos, etc)',
  accion VARCHAR(50) NOT NULL COMMENT 'Acción realizada (CREATE, UPDATE, DELETE, LOGIN, etc)',
  descripcion TEXT COMMENT 'Descripción detallada de la acción',
  tipoUsuario ENUM('admin', 'empleado', 'medico', 'cliente', 'sistema') NOT NULL,
  idUsuario INT NOT NULL COMMENT 'ID del usuario que realizó la acción',
  nombreUsuario VARCHAR(100) COMMENT 'Nombre completo del usuario',
  emailUsuario VARCHAR(100) COMMENT 'Email del usuario',
  entidadAfectada VARCHAR(50) COMMENT 'Nombre de la entidad afectada (ej: VentasOnlines, Productos)',
  idEntidad INT COMMENT 'ID del registro afectado',
  datosAnteriores JSON COMMENT 'Estado anterior del registro (para UPDATE/DELETE)',
  datosNuevos JSON COMMENT 'Estado nuevo del registro (para CREATE/UPDATE)',
  ip VARCHAR(45) COMMENT 'Dirección IP del cliente',
  userAgent VARCHAR(255) COMMENT 'User agent del navegador',
  fechaHora DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la acción',
  
  INDEX idx_evento (evento),
  INDEX idx_modulo (modulo),
  INDEX idx_usuario (tipoUsuario, idUsuario),
  INDEX idx_fecha (fechaHora),
  INDEX idx_entidad (entidadAfectada, idEntidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci 
COMMENT='Registro de auditoría de acciones críticas';

-- ============================================================
-- VISTAS
-- ============================================================

-- Vista: Cupones Activos
CREATE OR REPLACE VIEW CuponesActivos AS
SELECT 
    c.*,
    (c.usoMaximo - c.vecesUsado) AS usosDisponibles,
    CASE 
        WHEN CURDATE() > c.fechaVencimiento THEN 'expirado'
        WHEN c.vecesUsado >= c.usoMaximo THEN 'agotado'
        ELSE c.estado
    END AS estadoReal
FROM Cupones c
WHERE c.estado = 'activo' 
  AND CURDATE() BETWEEN c.fechaInicio AND c.fechaVencimiento
  AND c.vecesUsado < c.usoMaximo;

-- ============================================================
-- INSERCIÓN DE DATOS - USUARIOS
-- ============================================================

-- CLIENTES
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

-- EMPLEADOS
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

-- ADMIN (contraseña: admin123)
INSERT INTO Admins (nombreAdmin, contraAdmin, emailAdmin) VALUES 
('Administrador General', '$2b$10$TmQeliHWSy7HM1Y4WwxF8eWznWgfpi2sj3WzofN0wYpQ7Ws6hXIL2', 'admin@empresa.com');

-- Permisos del admin
INSERT INTO Permisos (crear_productos, modificar_productos, modificar_ventasE, modificar_ventasO, ver_ventasTotalesE, ver_ventasTotalesO, idEmpleado, idAdmin) 
VALUES (TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, NULL, 1);

-- ============================================================
-- INSERCIÓN DE DATOS - PRODUCTOS (solo tabla Productos, sin imágenes aquí)
-- ============================================================

-- FRAGANCIAS
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Dior Sauvage Parfum x 100 ml', 'Una fragancia intensa y sofisticada con notas de bergamota, ámbar y madera, ideal para el hombre moderno y seguro de sí mismo.', 297973.00, 'Fragancias', 20, FALSE, TRUE),
('Giorgio Armani Acqua Di Gio Parfum x 100 ml', 'Aromático y refrescante, combina notas marinas, incienso y pachulí para un aroma elegante y atemporal.', 271800.00, 'Fragancias', 30, FALSE, TRUE),
('Giorgio Armani My Way Nectar Edp x 90 ml', 'Femenino y vibrante, mezcla flores blancas con melocotón y neroli, evocando libertad y autoexpresión.', 269100.00, 'Fragancias', 25, FALSE, TRUE),
('Givenchy L''Interdit Rouge Ultime Edp x 80 ml', 'Una fragancia audaz y cálida con jazmín, nardo y cacao, que expresa sensualidad y elegancia con un toque rebelde.', 259200.00, 'Fragancias', 15, FALSE, TRUE),
('Lancome La Vie Est Belle Edp x 75 ml', 'Dulce y floral, combina iris, pachulí y praliné para una sensación de felicidad y feminidad pura.', 256742.90, 'Fragancias', 10, FALSE, TRUE),
('Paco Rabanne One Million Elixir Intense Edp x 200 ml', 'Intenso y envolvente, con manzana, vainilla y maderas oscuras, es la elección perfecta para quienes quieren dejar huella.', 250863.00, 'Fragancias', 35, FALSE, TRUE),
('Miss Dior Parfum x 80 ml', 'Romántico y sofisticado, mezcla rosa centifolia, madera y vainilla, reflejando amor y feminidad con elegancia moderna.', 248670.00, 'Fragancias', 40, FALSE, TRUE),
('CK One Edt x 100 ml','Fragancia icónica unisex de Calvin Klein con notas frescas de té verde, bergamota y almizcle. Moderna, limpia y ligera, ideal para el uso diario.',114345.00,'Fragancias',58, FALSE, TRUE),
('Paco Rabanne Invictus Edt x 100 ml','Aroma enérgico y masculino que combina pomelo fresco, hojas de laurel y maderas marinas. Representa la fuerza, el éxito y la victoria.',145800.00,'Fragancias',64, FALSE, TRUE),
('Carolina Herrera CH Men Edt x 100 ml','Fragancia elegante y cálida con notas de cuero, vainilla y bergamota. Refleja el espíritu del hombre sofisticado y seguro.',114300.00,'Fragancias',23, FALSE, TRUE),
('Carolina Herrera 212 NYC Men Edt x 100 ml','Aroma urbano y moderno con notas de lavanda, pomelo y almizcle. Diseñado para hombres activos que viven intensamente la ciudad.',135000.00,'Fragancias',76, FALSE, TRUE),
('Lattafa Asad Zanzíbar Edp x 100 ml','Perfume oriental amaderado con toques de ámbar, especias y vainilla. Intenso y duradero, ideal para noches especiales.',80990.00,'Fragancias',12, FALSE, TRUE),
('Dolce and Gabbana Light Blue Pour Homme Edt x 50 ml','Fragancia fresca y mediterránea con notas de limón siciliano, romero y almizcle. Perfecta para climas cálidos y días soleados.',143093.00,'Fragancias',14, FALSE, TRUE),
('Defy Men Edt x 50 ml','Aroma audaz y contemporáneo con notas de lavanda, vetiver y ámbar. Representa la dualidad entre fuerza y vulnerabilidad.',111650.00,'Fragancias',24, FALSE, TRUE),
('Lattafa Badee Al Oud Noble Blush x 100 ml','Badee Al Oud Noble Blush de Lattafa Perfumes es una fragancia de la familia olfativa Floral Frutal Gourmand para Mujeres. Esta fragrancia es nueva. Noble Blush se lanzó en 2024. La Nota de Salida es Rose Milk; las Notas de Corazón son almendra y merengue; las Notas de Fondo son vainilla, sándalo y almizcle',99990,'Fragancias',7, FALSE, TRUE),
('Lattafa Badee Al Oud Sublime x 100 ml','Badee Al Oud Sublime de Lattafa Perfumes es una fragancia de la familia olfativa Amaderada Aromática para Hombres y Mujeres',112700.00,'Fragancias',32, FALSE, TRUE),
('Cacharel Anais x 50 ml','La fragancia de la dulzura, la feminidad y delicadeza. Anais Anaís es una fragancia mítica y revolucionaria para aquellas personas románticas, dulces y femeninas que sobrepasan las fronteras de la moda evocando al romanticismo, la delicadeza y la feminidad.',99438.00,'Fragancias',23, FALSE, TRUE),
('Lattafa Yara x 100 ml','Una fragancia jugosa, floral y adictiva que evoca suavidad y deja una huella imborrable. Yara es una atractiva mezcla de calidez tropical, cremosos florales y dulce indulgencia, dulce pero sofisticada, delicada pero adictiva, que combina orquídea, mandarina y vainilla en una fragancia alegre, soñadora y deliciosa.',85990.00,'Fragancias',6, FALSE, TRUE),
('Lattafa Yara Candy x 100 ml','Elaborada con los mejores ingredientes del corazón de Oriente Medio, Yara Candy es una mezcla armoniosa de deliciosas frutas confitadas y delicioso jarabe de vainilla.',89930.00,'Fragancias',3, FALSE, TRUE),
('Armaf Club de Nuit Women x 105 ml','Fragancia femenina sofisticada que combina notas florales y frutales con un fondo suave y amaderado, pensada para resaltar la elegancia femenina.',110040.00,'Fragancias',10, FALSE, TRUE),
('Adolfo Dominguez Fresia Solar x 120 ml','Un perfume es un olor. El resto sobra.Fresia Solar. Nada más. La colección de perfumes Adolfo Domínguez perduda más allá de las modas.Reivindicamos el ingrediente puro, desnudo. Una flor no necesita más quesu esencia. Respetamos la belleza de la naturaleza. Volvamos a la raíz,a nuestro origen. Fresia Solar tiene un 96% de ingredientes de origen natural y sepresenta en un envase hecho con materiales reciclados tan bonito quequerrás usarlo incluso cuando acabes el perfume.',72900.00,'Fragancias',11, FALSE, TRUE);


-- BELLEZA
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Mascara de Pestanas Maybelline Falsies Surreal Very Black', 'Luce tus pestañas con la Máscara The Falsies Surreal de la marca Maybelline, es ideal para darle más volumen mientras las cuidas.', 33985, 'Belleza', 30, FALSE, TRUE),
('Sérum para Ojos L´Oréal Paris Revitalift Ácido Hialurónico x 20 ml', 'Formulado con 1,5% de Ácido Hialurónico, activo que hidrata profundamente la piel del contorno de ojos y rellena las líneas de expresión que se ubican allí.', 31999, 'Belleza', 20, FALSE, TRUE),
('Máscara de Pestañas Maybelline Colossal Volum Express Black', 'La máscara a prueba de agua Volum´ Express® The Colossal® realza al instante las pestañas con un volumen dramático y sin grumos.', 23966, 'Belleza', 15, FALSE, TRUE),
('Hidratante Facial en Gel Neutrogena Hydro Boost x 50 g', 'Combina la hidratación intensa durante 48 horas con el exclusivo gel refrescante.', 20541, 'Belleza', 25, FALSE, TRUE),
('Shampoo Elvive Glycolic Gloss x 400 ml', 'Descubrí Elvive Glycolic Gloss, con su shampoo con 3% (complejo con Ácido Glicolico) que rellena los defectos de la fibra capilar reduciendo la porosidad.', 5687, 'Belleza', 45, FALSE, TRUE);

-- DERMOCOSMÉTICA
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Sérum Hidratante Isdin Hyaluronic Concentrate x 30 ml', 'Sérum facial ultrahidratante con ácido hialurónico puro.', 77817, 'Dermocosmética', 12, FALSE, TRUE),
('Aceite Limpiador Facial Isdin Essential Cleansing x 200 ml', 'Aceite limpiador facial suave y ligero de textura oil-to-milk.', 67025, 'Dermocosmética', 18, FALSE, TRUE),
('Crema Facial Isdin Isdinceutics Hyaluronic Moisture x 50 g', 'Crema hidratante intensiva de textura ligera y rápida absorción.', 66616, 'Dermocosmética', 20, FALSE, TRUE),
('Crema Facial de Noche Cetaphil Healty Renew x 48 g', 'Fórmula de Cetaphil Healthy Renew con péptidos purificados y vitaminas.', 59920, 'Dermocosmética', 22, FALSE, TRUE),
('Agua Micelar Avène Cleanance x 400 ml', 'Limpia suavemente, matifica y elimina las impurezas.', 38780, 'Dermocosmética', 24, FALSE, TRUE);

-- MEDICAMENTOS CON RECETA
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 3961, 'Medicamentos con Receta', 15, TRUE, TRUE),
('Losartán 50mg', 'Antihipertensivo', 18256, 'Medicamentos con Receta', 20, TRUE, TRUE),
('Metformina 850mg', 'Control de glucosa en sangre', 6244, 'Medicamentos con Receta', 25, TRUE, TRUE),
('Sertralina 50mg', 'Antidepresivo ISRS', 6810, 'Medicamentos con Receta', 12, TRUE, TRUE),
('Omeprazol 20mg', 'Tratamiento de reflujo gástrico', 3021, 'Medicamentos con Receta', 18, TRUE, TRUE);

-- MEDICAMENTOS VENTA LIBRE
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Paracetamol 500mg', 'Analgésico y antipirético', 3557, 'Medicamentos Venta Libre', 30, FALSE, TRUE),
('Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 2214, 'Medicamentos Venta Libre', 35, FALSE, TRUE),
('Loratadina 10mg', 'Antihistamínico para alergias', 3650, 'Medicamentos Venta Libre', 29, FALSE, TRUE),
('Ambroxol', 'Mucolítico para la tos', 7395, 'Medicamentos Venta Libre', 33, FALSE, TRUE),
('Uvasal Naranja x 15 sobres dobles', 'Alivio rápido del ardor estomacal', 13500, 'Medicamentos Venta Libre', 27, FALSE, TRUE);

-- CUIDADO PERSONAL
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Desodorante Rexona Clinical Men en Crema x 48 g', 'Antitranspirante con 3x más protección que uno común.', 11145, 'Cuidado Personal', 40, FALSE, TRUE),
('Combo Colgate Clean Mint Limpieza Completa', 'Prevención avanzada de problemas bucales con fórmula patentada.', 10837, 'Cuidado Personal', 44, FALSE, TRUE),
('Cepillos Interdentales Oral-B Micro x 10 Un', 'Cerdas flexibles que eliminan comida y placa entre dientes.', 10119, 'Cuidado Personal', 46, FALSE, TRUE),
('Limpiador de Prótesis Corega Tabs 3 Minutos x 30 un', 'Elimina el 99,9% de las bacterias que causan mal olor.', 7353, 'Cuidado Personal', 23, FALSE, TRUE),
('Pasta Dental Colgate Luminous White Glow x 70 g', 'Remueve más de 10 años de manchas gracias al peróxido de hidrógeno.', 4200, 'Cuidado Personal', 33, FALSE, TRUE);

-- BEBES Y NIÑOS
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Leche Infantil en Polvo Nutrilon 3 Pouch x 1,2 kg', 'Leche modificada en polvo, con prebióticos, fortificada con hierro, calcio, zinc, vitaminas A, D y C, con ácidos grasos poliinsaturados de cadena larga, para niños a partir de 1 año. Libre de gluten. Complementa la alimentación de niños mayores de 1 año. No es un sucedáneo de la leche materna.', 47116, 'Bebes y Niños',40, FALSE, TRUE),
('Pañales Huggies Supreme Care Jumbo', 'El nuevo Huggies® Supreme Care, Cuidado Natural para su delicada piel tiene la máxima protección de Huggies: hecho con fibras naturales, 0% fragancia y parabenos, ofreciendo máxima sequedad y suavidad tipo algodón.', 35579, 'Bebes y Niños',50, FALSE, TRUE),
('Pañales Pampers Deluxe Protection RN+ x 56 un', 'Pampers Deluxe Protection Recién Nacido cuenta con la máxima absorción y suavidad de Pampers para proteger delicadamente la piel de tu bebé desde el primer día.', 31617, 'Bebes y Niños',55, FALSE, TRUE),
('Vasos Avent Contenedores para Leche Materna x 10 un', 'Ideal para guardar y darle al bebé la leche materna sea más eficiente, con nuestro nuevo vaso de almacenamiento. Podrá esterilizarlo y reutilizarlo junto con el extractor de Philips Avent.', 40879, 'Bebes y Niños',60, FALSE, TRUE),
('Shampoo Aveno Bebes y Niños x 250 ml', 'El shampoo Aveno Infantil limpia, humecta y protege hasta los cueros cabelludos mas sensibles y reactivos de los niños. Gracias a los beneficios de la avena, es hidratante, protector y emoliente. Otorga docilidad, brillo y suavidad al cabello.', 15444, 'Bebes y Niños',25, FALSE, TRUE);

-- ============================================================
-- INSERCIÓN DE IMÁGENES (4-5 por producto)
-- ============================================================

-- FRAGANCIAS - Producto 1: Dior Sauvage
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(1, 'https://farmaciasdelpueblo.vtexassets.com/arquivos/ids/209550-1200-1200?v=638848253885570000&width=1200&height=1200&aspect=true', 1, TRUE, 'Dior Sauvage Parfum - Vista frontal'),
(1, 'https://www.perfumeriarocher.com/wp-content/uploads/2019/10/sauvage-parfum-dior-perfume-hombre-1.jpg', 2, FALSE, 'Dior Sauvage Parfum - Detalle del frasco'),
(1, 'https://acdn.mitiendanube.com/stores/001/151/835/products/perfume-dior-sauvage-edp-100ml-11-fa1ad60a25ce34577815896698850875-1024-1024.jpg', 3, FALSE, 'Dior Sauvage Parfum - Vista lateral'),
(1, 'https://images-na.ssl-images-amazon.com/images/I/51DH5zB+IKL._AC_.jpg', 4, FALSE, 'Dior Sauvage Parfum - Caja'),
(1, 'https://www.imperialdeperfumes.com/wp-content/uploads/2021/08/DIOR-SAVAGE-PARFUM.jpg', 5, FALSE, 'Dior Sauvage Parfum - Presentación completa');

-- FRAGANCIAS - Producto 2: Giorgio Armani Acqua Di Gio
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(2, 'https://farmaciasdelpueblo.vtexassets.com/arquivos/ids/209578-1200-1200?v=638848257426500000&width=1200&height=1200&aspect=true', 1, TRUE, 'Giorgio Armani Acqua Di Gio - Vista principal'),
(2, 'https://perfumeriasarguisjuel.com.ar/wp-content/uploads/2023/08/91hpgY7YVZL._SX679_.jpg', 2, FALSE, 'Giorgio Armani Acqua Di Gio - Detalles'),
(2, 'https://http2.mlstatic.com/D_NQ_NP_796156-MLU72519991458_102023-O.webp', 3, FALSE, 'Giorgio Armani Acqua Di Gio - Empaque'),
(2, 'https://www.macys.com/shop/product/giorgio-armani-mens-acqua-di-gio-profumo-eau-de-parfum-spray-2.5-oz?ID=12207889', 4, FALSE, 'Giorgio Armani Acqua Di Gio - Spray');

-- FRAGANCIAS - Producto 3: Giorgio Armani My Way Nectar
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(3, 'https://farmaciasdelpueblo.vtexassets.com/arquivos/ids/209710-1200-1200?v=638850825320830000&width=1200&height=1200&aspect=true', 1, TRUE, 'Giorgio Armani My Way Nectar - Principal'),
(3, 'https://http2.mlstatic.com/D_NQ_NP_985883-MLU72576881878_112023-O.webp', 2, FALSE, 'Giorgio Armani My Way Nectar - Vista 360'),
(3, 'https://www.giorgioarmanibeauty-usa.com/dw/image/v2/AANG_PRD/on/demandware.static/-/Sites-armani-beauty-master/default/dw37e3c3b3/images/my-way/MY-WAY-NECTAR.jpg', 3, FALSE, 'Giorgio Armani My Way Nectar - Frasco'),
(3, 'https://acdn.mitiendanube.com/stores/001/491/755/products/5-5e75652c11bb5f8be516846885086789-1024-1024.png', 4, FALSE, 'Giorgio Armani My Way Nectar - Caja y frasco');

-- FRAGANCIAS - Producto 4: Givenchy L'Interdit Rouge
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(4, 'https://farmaciasdelpueblo.vtexassets.com/arquivos/ids/197998-1200-1200?v=638591721766500000&width=1200&height=1200&aspect=true', 1, TRUE, 'Givenchy L''Interdit Rouge - Vista principal'),
(4, 'https://acdn.mitiendanube.com/stores/001/201/365/products/givenchy-linterdit-rouge-ultime-800x800-1-d42c14e7aa51d2f82516936742534524-1024-1024.webp', 2, FALSE, 'Givenchy L''Interdit Rouge - Close up'),
(4, 'https://www.givenchy.com/dw/image/v2/AJQG_PRD/on/demandware.static/-/Sites-masterCatalog_Givenchy/default/dwa9a77b5c/3274872446885_Givenchy_INTERDIT_ROUGE_ULTIME_EDP_80mlF_L1.jpg', 3, FALSE, 'Givenchy L''Interdit Rouge - Glamour'),
(4, 'https://www.sephora.com/productimages/sku/s2551417-main-zoom.jpg', 4, FALSE, 'Givenchy L''Interdit Rouge - Packaging'),
(4, 'https://beautytestbox.com.ar/wp-content/uploads/2023/06/2-15.jpg', 5, FALSE, 'Givenchy L''Interdit Rouge - Lifestyle');

-- FRAGANCIAS - Producto 5: Lancome La Vie Est Belle
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(5, 'https://farmaciasdelpueblo.vtexassets.com/arquivos/ids/209706-1200-1200?v=638850824104530000&width=1200&height=1200&aspect=true', 1, TRUE, 'Lancome La Vie Est Belle - Principal'),
(5, 'https://www.lancome.com.ar/dw/image/v2/BJSK_PRD/on/demandware.static/-/Sites-lancome-ar-master-catalog/default/dw1c9c9a9e/images/101/101-600x600.jpg', 2, FALSE, 'Lancome La Vie Est Belle - Detalle'),
(5, 'https://http2.mlstatic.com/D_NQ_NP_746534-MLA50467912766_062022-O.webp', 3, FALSE, 'Lancome La Vie Est Belle - Empaque'),
(5, 'https://acdn.mitiendanube.com/stores/001/159/672/products/la-vie-est-belle-75ml-edp-31-cf2be89b2b7e01f7a316608433085618-1024-1024.jpg', 4, FALSE, 'Lancome La Vie Est Belle - Frasco');

-- BELLEZA - Producto 11: Mascara Maybelline Falsies
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(11, 'https://farmacityar.vtexassets.com/arquivos/ids/253663-1200-auto?v=638471593825730000&width=1200&height=auto&aspect=true', 1, TRUE, 'Mascara Maybelline Falsies Surreal - Principal'),
(11, 'https://images-na.ssl-images-amazon.com/images/I/51VPGmXGJBL._AC_.jpg', 2, FALSE, 'Mascara Maybelline Falsies Surreal - Cepillo'),
(11, 'https://www.maybelline.com.ar/media/catalog/product/cache/7fb0d28f5d326a36e57fa6295c6f2b4c/7/5/751c4d_41554553306_v2_735x735.jpg', 3, FALSE, 'Mascara Maybelline Falsies Surreal - Aplicación'),
(11, 'https://http2.mlstatic.com/D_NQ_NP_639988-MLA52838174625_122022-O.webp', 4, FALSE, 'Mascara Maybelline Falsies Surreal - Packaging');

-- BELLEZA - Producto 12: Serum L'Oreal
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(12, 'https://farmacityar.vtexassets.com/arquivos/ids/284973-1200-auto?v=638972732399630000&width=1200&height=auto&aspect=true', 1, TRUE, 'Serum L''Oreal Revitalift - Principal'),
(12, 'https://www.loreal-paris.com.ar/-/media/project/loreal/brand-sites/oap/americas/ar/pdp/skin-care/revitalift/serum-acido-hialuronico-1_5-30-ml/serum-acido-hialuronico-1_5-30-ml-1.jpg', 2, FALSE, 'Serum L''Oreal Revitalift - Textura'),
(12, 'https://acdn.mitiendanube.com/stores/001/203/169/products/revitalift-serum-acido-hialuronico-30-ml-21-8f51f5e6b8fb06368416632857865125-1024-1024.jpg', 3, FALSE, 'Serum L''Oreal Revitalift - Aplicación'),
(12, 'https://images-na.ssl-images-amazon.com/images/I/51eK9%2B7r2HL._AC_.jpg', 4, FALSE, 'Serum L''Oreal Revitalift - Detalle'),
(12, 'https://www.loreal-paris.com.ar/dw/image/v2/BJSS_PRD/on/demandware.static/-/Sites-oap-ar-master/default/dwd4e6a3a3/101-500x500.jpg', 5, FALSE, 'Serum L''Oreal Revitalift - Empaque');

-- DERMOCOSMÉTICA - Producto 16: Serum Isdin
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(16, 'https://farmacityar.vtexassets.com/arquivos/ids/208853-1200-auto?v=637527137448370000&width=1200&height=auto&aspect=true', 1, TRUE, 'Isdin Hyaluronic Concentrate - Principal'),
(16, 'https://www.isdin.com/wp-content/uploads/2021/05/hyaluronic-concentrate-intensive-serum-main-image.jpg', 2, FALSE, 'Isdin Hyaluronic Concentrate - Frasco'),
(16, 'https://acdn.mitiendanube.com/stores/001/190/365/products/isdin-hyaluronic-concentrate-30-ml-1-b9fc1f7f2f4a4f6d5716318433598756-1024-1024.jpg', 3, FALSE, 'Isdin Hyaluronic Concentrate - Textura'),
(16, 'https://images-na.ssl-images-amazon.com/images/I/41RKzXVGNQL._AC_.jpg', 4, FALSE, 'Isdin Hyaluronic Concentrate - Packaging');

-- MEDICAMENTOS CON RECETA - Producto 21: Amoxicilina
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(21, 'https://fcityrepoimagenes.farmacity.net/imagenes/Medicamentos/Imagenes/7798006300936_1.jpg', 1, TRUE, 'Amoxicilina 500mg - Principal'),
(21, 'https://www.farmaciacostamaragata.com.ar/wp-content/uploads/2020/08/amoxicilina-500-1.jpg', 2, FALSE, 'Amoxicilina 500mg - Caja'),
(21, 'https://images-na.ssl-images-amazon.com/images/I/41LYh7P0IYL._AC_.jpg', 3, FALSE, 'Amoxicilina 500mg - Blister'),
(21, 'https://http2.mlstatic.com/D_NQ_NP_948956-MLA45223614268_032021-O.webp', 4, FALSE, 'Amoxicilina 500mg - Información');

-- MEDICAMENTOS VENTA LIBRE - Producto 26: Paracetamol
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(26, 'https://fcityrepoimagenes.farmacity.net/imagenes/Medicamentos/Imagenes/7795347942719_1.jpg', 1, TRUE, 'Paracetamol 500mg - Principal'),
(26, 'https://www.farmaciasanpablo.com.mx/assets/images/productos/7501318612075.jpg', 2, FALSE, 'Paracetamol 500mg - Empaque'),
(26, 'https://images-na.ssl-images-amazon.com/images/I/51Y7F8TZ8WL._AC_.jpg', 3, FALSE, 'Paracetamol 500mg - Tabletas'),
(26, 'https://http2.mlstatic.com/D_NQ_NP_639988-MLA45223614268_032021-O.webp', 4, FALSE, 'Paracetamol 500mg - Caja'),
(26, 'https://www.farmaciadegua rdia.com.ar/wp-content/uploads/2020/08/paracetamol-500-1.jpg', 5, FALSE, 'Paracetamol 500mg - Detalle');

-- CUIDADO PERSONAL - Producto 31: Rexona Clinical
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(31, 'https://farmacityar.vtexassets.com/arquivos/ids/194986-1200-auto?v=637170243111400000&width=1200&height=auto&aspect=true', 1, TRUE, 'Rexona Clinical Men - Principal'),
(31, 'https://www.rexona.com/content/dam/unilever/rexona/argentina/pack_shot/clinical/8850006495476_clinical_men_crema_50g_-8850006495476-1231859-png.png', 2, FALSE, 'Rexona Clinical Men - Crema'),
(31, 'https://images-na.ssl-images-amazon.com/images/I/41YGLqX8M3L._AC_.jpg', 3, FALSE, 'Rexona Clinical Men - Textura'),
(31, 'https://acdn.mitiendanube.com/stores/001/123/456/products/rexona-clinical-1-a9f7e3c5a9f7e3c5-1024-1024.jpg', 4, FALSE, 'Rexona Clinical Men - Aplicación');

-- BEBES Y NIÑOS - Producto 36: Nutrilon
INSERT INTO ImagenesProductos (idProducto, urlImagen, orden, esPrincipal, altText) VALUES
(36, 'https://farmacityar.vtexassets.com/arquivos/ids/281980-1200-auto?v=638938850631300000&width=1200&height=auto&aspect=true', 1, TRUE, 'Nutrilon 3 Pouch - Principal'),
(36, 'https://www.nutricia.com.ar/content/dam/nutricia-ar/nutrilon-3/nutrilon-3-sachet-1200g.jpg', 2, FALSE, 'Nutrilon 3 Pouch - Detalle'),
(36, 'https://images-na.ssl-images-amazon.com/images/I/71LRqX8M3L._AC_.jpg', 3, FALSE, 'Nutrilon 3 Pouch - Preparación'),
(36, 'https://acdn.mitiendanube.com/stores/001/234/567/products/nutrilon-3-1-b9f7e3c5a9f7e3c5-1024-1024.jpg', 4, FALSE, 'Nutrilon 3 Pouch - Tabla nutricional'),
(36, 'https://http2.mlstatic.com/D_NQ_NP_948956-MLA50328174625_122022-O.webp', 5, FALSE, 'Nutrilon 3 Pouch - Lifestyle');

-- ============================================================
-- INSERCIÓN DE DATOS - CUPONES Y OFERTAS
-- ============================================================

-- Cupón de bienvenida
INSERT INTO Cupones (codigo, tipoCupon, valorDescuento, descripcion, fechaInicio, fechaVencimiento, usoMaximo, tipoUsuario, montoMinimo) 
VALUES ('BIENVENIDA10-TEMPLATE', 'porcentaje', 10.00, 'Cupón de bienvenida - 10% de descuento en tu primera compra', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 60 DAY), 1, 'nuevo', 0.00);

-- Campaña Cyber Monday
INSERT INTO campanas_ofertas (nombreCampana, descripcion, porcentajeDescuento, fechaInicio, fechaFin, esActiva, tipo, prioridad) 
VALUES ('Cyber Monday 2026', 'Descuentos especiales del 25% en productos seleccionados', 25.00, NOW(), '2026-12-31 23:59:59', 1, 'EVENTO', 10);

-- Productos en campaña Cyber Monday (algunos ejemplos)
INSERT INTO productos_campanas (idCampana, idProducto, esActivo) VALUES
(1, 1, 1),  -- Dior Sauvage
(1, 2, 1),  -- Giorgio Armani Acqua Di Gio
(1, 3, 1),  -- Giorgio Armani My Way
(1, 11, 1), -- Mascara Maybelline
(1, 12, 1), -- Serum L'Oreal
(1, 16, 1), -- Serum Isdin
(1, 26, 1); -- Paracetamol

-- ============================================================
-- MENSAJES FINALES
-- ============================================================

SELECT '✅ Base de datos PIXEL SALUD creada exitosamente' AS Status;
SELECT CONCAT('📦 Total de productos: ', COUNT(*)) AS Productos FROM Productos;
SELECT CONCAT('🖼️ Total de imágenes: ', COUNT(*)) AS Imagenes FROM ImagenesProductos;
SELECT CONCAT('👥 Total de clientes: ', COUNT(*)) AS Clientes FROM Clientes;
SELECT CONCAT('👨‍💼 Total de empleados: ', COUNT(*)) AS Empleados FROM Empleados;
SELECT CONCAT('🎟️ Total de cupones: ', COUNT(*)) AS Cupones FROM Cupones;
SELECT CONCAT('🎉 Total de campañas: ', COUNT(*)) AS Campañas FROM campanas_ofertas;

-- Verificar imágenes por producto
SELECT 
  p.idProducto,
  p.nombreProducto,
  COUNT(i.idImagen) AS total_imagenes,
  SUM(CASE WHEN i.esPrincipal = TRUE THEN 1 ELSE 0 END) AS imagenes_principales
FROM Productos p
LEFT JOIN ImagenesProductos i ON p.idProducto = i.idProducto
GROUP BY p.idProducto, p.nombreProducto
ORDER BY p.idProducto;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
