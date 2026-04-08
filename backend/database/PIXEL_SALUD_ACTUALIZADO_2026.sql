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
('Mascara de Pestanas Maybelline Falsies Surreal Very Black', 'Luce tus pestañas con la Máscara The Falsies Surreal de la marca Maybelline, es ideal para darle más volumen mientras las cuidas.', 33985,'Belleza', 30, FALSE, TRUE),
('Sérum para Ojos L´Oréal Paris Revitalift Ácido Hialurónico x 20 ml', 'Formulado con 1,5% de Ácido Hialurónico, activo que hidrata profundamente la piel del contorno de ojos y rellena las líneas de expresión que se ubican allí.', 31999,'Belleza', 20, FALSE, TRUE),
('Máscara de Pestañas Maybelline Colossal Volum Express Black', 'La máscara a prueba de agua Volum´ Express® The Colossal® realza al instante las pestañas con un volumen dramático y sin grumos.', 23966,'Belleza', 15, FALSE, TRUE),
('Hidratante Facial en Gel Neutrogena Hydro Boost x 50 g', 'Combina la hidratación intensa durante 48 horas con el exclusivo gel refrescante.', 20541,'Belleza', 25, FALSE, TRUE),
('Shampoo Elvive Glycolic Gloss x 400 ml', 'Descubrí Elvive Glycolic Gloss, con su shampoo con 3% (complejo con Ácido Glicolico) que rellena los defectos de la fibra capilar reduciendo la porosidad.', 5687,'Belleza', 45, FALSE, TRUE),
('Acondicionador Elvive Reparación Total 5 x 400 ml', 'Nuestro Acondicionador Reparador, ahora con 11% de concentrado reparador con KERATINxs y sin sal°, instantáneamente repara, fortalece y protege la fibra capilar.', 5193,'Belleza', 35, FALSE, TRUE),
('Protector Térmico Tresemmé Spray x 120 ml', 'Protección hasta 230 C. Cabello estilizado, protegido del frizz y daños.', 5166,'Belleza', 10, FALSE, TRUE),
('Máscara de Pestañas Maybelline Sensational Sky High Waterproof Very Black x 7,2 ml','Máscara de pestañas Sky High que alarga y da volumen sensacional llevando a tus pestañas hasta los cielos. Máscara de larga duración que proporciona un volumen total y un alargamiento ilimitado.',24766.00,'Belleza',8, FALSE, TRUE),
('Corrector de Ojeras Rimmel The Multi-Tasker x 10 ml','El corrector Multi-Tasker de Rimmel London, corrige, esculpe e ilumina. Con el corrector Multi-Tasker de Rimmel London, difumina e ilumina las ojeras, oculta imperfecciones o cubre para igualar el tono de tu piel.',16920.00,'Belleza',12, FALSE, TRUE),
('Corrector de Ojeras Maybelline Instant Age Rewind Eraser x 6 ml','Conocé los nuevos tonos de Instant Age Rewind, verde para corregir rojeces, naranja para contrarrestar decoloración en pieles medias a oscuras, neutralizer para difuminar imperfecciones y brightener que corrige ojeras e ilumina para tonos claros a medios.',17914.00,'Belleza',23, FALSE, TRUE),
('Polvo de Maquillaje Rimmel Natural Bronzer x 14 g','Este bronceador Rimmel London Natural Bronzer está diseñado para proporcionar un brillo cálido en todo el cuerpo y un aspecto natural y bronceado.',14832.00,'Belleza',3, FALSE, TRUE),
('Máscara de Pestañas Extreme Wavelash Tubing','Pestañas largas, definidas y resistentes. Durabilidad sin grumos ni manchas.',17990.00,'Belleza',4, FALSE, TRUE),
('Base Líquida de Maquillaje Maybelline Fit Me Matte Poreless Foundation x 30 ml','¡Olvidate de los poros y el brillo de la piel! Ideal para piel normal a grasa, la base Fit Me Matte + Poreless cubre imperfecciones, desvanece los poros y controla el brillo para darle a tu rostro un efecto natural e impecable.',19195.00,'Belleza',7, FALSE, TRUE),
('Polvo Compacto Maybelline Fit Me Matte x 12 g','El polvo compacto Fit Me matte + poreless controla el exceso de brillo y unifica el color de la piel para un acabado fresco y natural.',10916.00,'Belleza',9, FALSE, TRUE),
('Base Primer Rimmel 3 En 1 Multi Tasker x 30 ml','¡Hola, la mejor piel de todas! Mejor que un filtro, brilla con tu mejor piel. Brilla de manera real, mejor que un filtro, con el Multi-Tasker 3 en 1: primer para la piel, base potenciadora de luminosidad e iluminador ¡Mejor que los filtros!',22795.00,'Belleza',12, FALSE, TRUE),
('Lápiz Labial Rimmel Lasting Finish Extreme Matte 840 Mulberry','Lasting Matte Lipstick de Rimmel es una barra de labios de larga duración con una fácil aplicación y un suave acabado mate natural.',19200.00,'Belleza',2, FALSE, TRUE),
('Lápiz Labial Extreme Going Silky x 4 g','Lápiz labial con textura cremosa y suave como la seda, de larga duración, mantendrá tus labios frescos e hidratados, su fórmula ultra cremosa le otorgara a tus labios un color más intenso que se deslizara otorgándote un trazo uniforme.',15990.00,'Belleza',5, FALSE, TRUE),
('Brillo Labial Rimmel Oh My Gloss! Lip Oil x 4,5 ml','Hidrata tus labios con una explosión jugosa de brillo nutritivo utilizando el nuevo Oh My Gloss! ¡Una sensación adictiva y híbrida en los labios! Restaura tus labios con un aceite rico que combina el acabado brillante de un brillo labial con el impulso de hidratación de un bálsamo labial, dejando un toque de color transparente e irresistible en 5 sabores jugosos y deliciosos.',15500.00,'Belleza',23, FALSE, TRUE),
('Base Líquida Maybelline Fit Me Fresh Tint Spf 50','Fit Me Fresh Tint, la nueva base de maquillaje de larga duración con alta cobertura y protector solar FPS 50, creada para todo tipo de piel y cuenta con ingredientes que controlan la grasa de la piel!',17400.00,'Belleza',12, FALSE, TRUE),
('Rubor Compacto Get the Look Silky & Natural','El Rubor Get The Look Silky & Natural compacto realza y define tus pómulos. De suaves y sedosas texturas, acentúa tus mejillas y le da vitalidad a tu rostro.',17990.00,'Belleza',15, FALSE, TRUE);

-- DERMOCOSMÉTICA
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Sérum Hidratante Isdin Hyaluronic Concentrate x 30 ml', 'Sérum facial ultrahidratante con ácido hialurónico puro.', 77817,'Dermocosmética', 12, FALSE, TRUE),
('Aceite Limpiador Facial Isdin Essential Cleansing x 200 ml', 'Aceite limpiador facial suave y ligero de textura oil-to-milk.', 67025,'Dermocosmética', 18, FALSE, TRUE),
('Crema Facial Isdin Isdinceutics Hyaluronic Moisture x 50 g', 'Crema hidratante intensiva de textura ligera y rápida absorción.', 66616,'Dermocosmética', 20, FALSE, TRUE),
('Crema Facial de Noche Cetaphil Healty Renew x 48 g', 'Fórmula de Cetaphil Healthy Renew con péptidos purificados y vitaminas.', 59920,'Dermocosmética', 22, FALSE, TRUE),
('Agua Micelar Avène Cleanance x 400 ml', 'Limpia suavemente, matifica y elimina las impurezas.', 38780,'Dermocosmética', 24, FALSE, TRUE),
('Crema Antiage de día Caviahue x 50 g', 'Con ácido hialurónico y agua termal volcánica.', 32000,'Dermocosmética', 25, FALSE, TRUE),
('Protector Solar Caviahue FPS 50+ x 150 g', 'Protege contra rayos UVA/UVB, textura ligera, libre de TACC.', 22000,'Dermocosmética', 28, FALSE, TRUE),
('Sérum Vichy Liftactiv Collagen x 30 ml', 'Serum Vichy Liftactiv Collagen x 30 ml, textura ligera y de rápida absorción. Fórmula no grasa y sin perfume. Apto para todo tipo de pieles.', 95228.00,'Dermocosmética',12, FALSE, TRUE),
('Contorno de Ojos Vichy Mineral 89 x 15 ml', 'Minéral 89 Contorno de ojos refuerza la función de barrera de la piel en el contorno de los ojos, suaviza las líneas de expresión con 24 horas de hidratación y reduce las ojeras para una mirada más iluminada. Es tu dosis de fuerza para una mirada más luminosa.', 45983.00,'Dermocosmética',12, FALSE, TRUE),
('Agua Termal Volcánica 170ml.', 'Con alta concentración de minerales y oligoelementos. Para piel sensible. Sin parabenos.', 20909.00,'Dermocosmética',12, FALSE, TRUE),
('Sérum Antiedad La Roche Posay Hyalu B5 Pieles Sensibles X 30 ml', 'Es el primer tratamiento antiarrugas con máxima tolerancia en pieles sensibles, y máxima eficacia antiedad.', 81119.00,'Dermocosmética',12, FALSE, TRUE),
('Reparador de Labios Eucerin S.O.S Aquaphor x 10 ml', 'El Reparador de labios Eucerin S.O.S Aquaphor ayuda a restaurar y proteger los labios secos y agrietados, dando una sensación de alivio en 60 segundos.', 24646.00,'Dermocosmética',12, FALSE, TRUE),
('Gel Limpiador CeraVe Espumoso x 236 ml', 'Desarrollado por dermatólogos, el Gel Limpiador espumoso de CeraVe crea espuma suave para limpiar profundamente el rostro y el cuerpo, sin alterar la barrera natural de la piel.', 34068.00,'Dermocosmética',12, FALSE, TRUE),
('Concentrado Vichy Minéral 89 Fortificante y Reconstituyente x 50 ml', 'El concentrado Mineral 89 de Vichy refuerza la barrera cutánea para fortalecerla y hacerla más resistente frente a las agresiones internas y externas.', 56239.00,'Dermocosmética',12, FALSE, TRUE),
('Limpiador Corporal Cetaphil Pro Ad Control x 295 ml','Limpiador corporal especialmente formulado para pieles extremadamente secas y sensibles, con tendencia atópica.', 39260.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Combo Eucerin Aceite de Ducha pH5 x 200 ml + Crema pH5 Intensiva x 450 ml','El Aceite de ducha pH5 Eucerin de uso diario preserva las defensas naturales de la piel y previene su sequedad, incluso después de la ducha.', 53440.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Kit Aveno Limpieza + Hidratación + Protector Solar Fps 50','El gel de limpieza Aveno humecta y protege hasta las pieles mas sensibles y reactivas con tendencia atópica y/o deshidratadas. Puede ser utilizado en pieles grasas, mixtas o secas.', 67940.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Combo Lambdapil Shampoo Anticaída x 200 ml + Suplemento Dietario Isdin Lambdapil Hairdensity x 60 Cáps','El shampoo Isdin Lambdapil Anticaída, ayuda al tratamiento de la caída excesiva del cabello para hombres y mujeres.', 55450.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Leche Autobronceante Vichy Idéal Soleil x 100 ml','Ideal Soleil Leche Autobronceante. Auto-bronceador natural, hidratante 8h.', 49720.00 ,'Dermocosmética', 34, FALSE, TRUE),
('Protector Solar La Roche Posay Anthelios UV 400 Anti Manchas Spf 50 + x 50 ml','La Roche-Posay Anthelios UVMune 400 Fluido Antimanchas SPF 50+ es un protector solar facial de alta eficacia diseñado para prevenir y reducir la aparición de manchas y la hiperpigmentación.', 44717.00 ,'Dermocosmética', 34, FALSE, TRUE);

-- MEDICAMENTOS CON RECETA
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 3961,'Medicamentos con Receta', 15, TRUE, TRUE),
('Losartán 50mg', 'Antihipertensivo', 18256,'Medicamentos con Receta', 20, TRUE, TRUE),
('Metformina 850mg', 'Control de glucosa en sangre', 6244,'Medicamentos con Receta', 25, TRUE, TRUE),
('Sertralina 50mg', 'Antidepresivo ISRS', 6810,'Medicamentos con Receta', 12, TRUE, TRUE),
('Omeprazol 20mg', 'Tratamiento de reflujo gástrico', 3021,'Medicamentos con Receta', 18, TRUE, TRUE),
('Meprednisona 20mg', 'Corticosteroide antiinflamatorio', 7777,'Medicamentos con Receta', 22, TRUE, TRUE),
('Clonazepam 2mg', 'Ansiolítico bajo receta', 4025,'Medicamentos con Receta', 30, TRUE, TRUE),
('Amoxidal respiratorio 1 g iny.x 1 dosis', 'Es un antibiótico bactericida de amplio espectro. Antitusivo. Secretolítico. Expectorante.', 7781.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Lotrial 20 mg comp.x 60', 'LOTRIAL está indicado en todos los grados de la hipertensión arterial esencial, en la hipertensión renovascular y en la insuficiencia cardíaca congestiva, en la que mejora los síntomas, reduce la mortalidad y disminuye la frecuencia de hospitalizaciones, cualquiera sea el grado de su sintomatología.', 21071.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Rivotril 2 mg comp.x 60', 'Trastornos de ansiedad. Trastornos de angustia (ataque de pánico) con o sin agorafobia. Trastornos comiciales: indicado solo o como adyuvante, en el tratamiento del síndrome de Lennox Gastaut (variante del petit mal), crisis convulsivas acinéticas y mioclónicas. Puede ser empleado en pacientes con crisis de ausencia (petit mal) refractarias a las succinimidas. Rivotril está indicado como fármaco de segunda elección en los espasmos infantiles (síndrome de West).', 19025.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Sertralina teva 50 mg comp.rec.x 30', 'Sertralina está indicada en el tratamiento de: Episodios depresivos mayores. Prevención de reaparición de episodios depresivos mayores. Trastorno de angustia, con o sin agorafobia. Trastorno obsesivo-compulsivo (TOC) en adultos y pacientes pediátricos de 6-17 años. Trastorno de ansiedad social (fobia social). Trastorno por estrés post-traumático (TEPT).', 6810.63,'Medicamentos con Receta',15, TRUE, TRUE),
('Aspirina prevent comp.cub.enterica x 50', 'Aspirina Prevent está indicada para los siguientes usos: Reducción del riesgo de mortalidad en pacientes con sospecha de infarto agudo de miocardio.', 37481.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Ibupirac 600 capsula blanda 600 mg x 50', 'Analgésico y antiinflamatorio para el alivio del dolor y la inflamación de origen muscular, articular o fiebre.', 35080.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Neuryl gts.x 20 ml', 'Hipersensibilidad conocida al clonazepam u otras benzodiazepinas, o a algunos de los componentes de la formulación. Pacientes con antecedentes de farmacodependencia, abuso de drogas o alcoholismo. Pacientes con evidencia clínica o bioquímica de enfermedad hepática. Pacientes con glaucoma de ángulo estrecho. Pacientes afectados de miastenia gravis.', 11135.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Sertal compuesto comp.rec.x 20', 'Es un medicamento espasmolítico analgésico destinado a la terapéutica patogénica y sintomática de los síndromes espasmódicos de origen gastrointestinal, hepatobiliar, urinario o genital, cualquiera sea su grado de intensidad y evolución.', 12802.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Reliveran doxi 20/20mg x 14', 'RELIVERAN DOXI® está indicado para el tratamiento de las náuseas y los vómitos del embarazo en mujeres que no responden al manejo conservador.', 21956.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Omeprazol richet 20 mg caps.x 28', 'Está indicado para adultos y mayores de 18 años con acidez frecuente, o sea, cuando padecen acidez durante 1 a 4 días por semana.', 16605.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Amlodipina richet 5 mg comp.x 30', 'Cada comprimido contiene: AMLODIPINA RICHET 10mg: cada comprimido contiene: amlodipina (como besilato) 10mg. Excipientes cs. AMLODIPINA RICHET 5 mg: cada comprimido contiene: amlodipina (como besilato) 5 mg. Excipientes cs.', 11859.00,'Medicamentos con Receta',15, TRUE, TRUE),
('Atorvastan 10 mg comp.rec.x 30', 'Tratamiento adyuvante a la dieta para disminuir los niveles elevados de colesterol total, LDL-colesterol, apobetalipoproteínas y triglicéridos en pacientes con hipercolesterolemia primaria y en la dislipemia mixta. Aumenta los receptores LDL-colesterol. Antiinflamatorio a nivel de la placa ateromatosa. Preventivo de la atero y arteriosclerosis.', 30331.00,'Medicamentos con Receta',1, TRUE, TRUE),
('T4 montpellier 75 75 mcg comp.x 50', 'Como terapia de reemplazo o suplemento en pacientes con hipotiroidismo de cualquier etiología (excepto el hipotiroidismo transitorio durante la fase de recuperación de la tiroiditis subaguda): hipotiroidismo primario resultante de disfunción tiroidea, atrofia primaria, o ausencia parcial o total de la glándula tiroides, efectos de cirugía, radiación o drogas, con o sin la presencia de bocio; hipotiroidismo secundario (pituitario); e hipotiroidismo terciario (hipotalámico).', 16572.00,'Medicamentos con Receta',15, TRUE, TRUE);

-- MEDICAMENTOS VENTA LIBRE
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Paracetamol 500mg', 'Analgésico y antipirético', 3557,'Medicamentos Venta Libre', 30, FALSE, TRUE),
('Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 2214,'Medicamentos Venta Libre', 35, FALSE, TRUE),
('Loratadina 10mg', 'Antihistamínico para alergias', 3650,'Medicamentos Venta Libre', 29, FALSE, TRUE),
('Ambroxol', 'Mucolítico para la tos', 7395,'Medicamentos Venta Libre', 33, FALSE, TRUE),
('Uvasal Naranja x 15 sobres dobles', 'Alivio rápido del ardor estomacal', 13500,'Medicamentos Venta Libre', 27, FALSE, TRUE),
('Bengue Ultra Gel x 35g', 'Alivio del dolor muscular', 13951,'Medicamentos Venta Libre', 21, FALSE, TRUE),
('Alikal Limón x 30 sobres', 'Combinación efervescente antiácida y analgésica.', 22500,'Medicamentos Venta Libre', 18, FALSE, TRUE),
('Sinamida Terbinafina Crema Antimicótica x 30 g', 'Tratamiento de rápida acción de todos los hongos de la piel.', 10000.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Tafirolito Paracetamol Mascticable 160 mg x 20 comp', 'Tipo de Venta: Venta Libre.', 4797.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Geniol Paracetamol 500 mg x 16 Comp', 'Tratamiento de enfermedades reumáticas crónicas inflamatorias tales como artritis reumatoide, espondilitis anquilosante, artrosis, espóndilo-artritis. Reumatismo extraarticular. Tratamiento sintomático del ataque agudo de gota. Tratamiento sintomático de la dismenorrea primaria. Tratamiento de inflamaciones y tumefacciones postraumáticas.', 4278.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Enterogermina Plus Ampollas de 5 ml x 5 un', 'Enterogermina® Plus es el probiótico más vendido en el mundo, constituido por esporas Bacillus clausii, microorganismos que son bacterias con efecto benéfico al individuo (“bacterias buenas”) que llegan vivas al intestino y contribuyen al equilibrio de la flora1,2,3,6.', 31800.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Buscapina Perlas x 20 Cáps', 'Alivio temporario del malestar producido por espasmo doloroso del tubo digestivo, vía biliar y aparato genitourinario.', 10560.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Resaquit x 12 Comp', 'Cada comprimido bicapo contiene: Acido acetilsalicílico 255,22 mg, Paracetamol 194,00 mg, Cafeína 33,00 mg, Hidróxido de aluminio 25,00 mg, Hidróxido de magnesio 50,00 mg.', 6341.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Allerhit Spray Nasal x 10 ml', 'Alivia la congestión nasal producida por el resfrío y la alergia. Se utiliza para desbloquear la nariz tapada provocada por rinitis alérgica, sinusitis, resfríos y gripe. Gracias a su fórmula y presentación alivia rápidamente la congestión nasal en pocos segundos y su efecto se mantiene hasta por 12 horas sin resecar la zona.', 7990.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Alernix 24 Cetirizina x 10 Cáps', 'En rinitis alérgica: para el tratamiento de sus síntomas o manifestaciones: secreción nasal, picazón de ojos, nariz y/o garganta, lagrimeo, nariz roja, estornudos. En alergias de piel e incluso en urticarias de larga duración de origen desconocido (urticaria crónica idiopática), previo diagnóstico médico.', 7114.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Acemuk 200 mg Acetilcisteína x 10 Tabletas Efervescentes', 'Para el tratamiento de todas las enfermedades de las vías respiratorias que presentan una alta secreción mucosa.', 11940.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Bisolvon Adultos Jarabe x 125 ml', 'Alivia los síntomas del catarro bronquial y la tos, por fluidificación, facilitando la expectoración.', 14415.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Empecid Crema Antimicótica x 20 g', 'EMPECID® se usa para el tratamiento de micosis causadas por hongos. Este medicamento está indicado para el tratamiento de las infecciones superficiales de la piel: tiña del pie (pie de atleta), tiña de las manos, tiña del cuerpo, tiña inguinal', 13748.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Melatol Plus Inductor de Sueño x 30 Comp', 'Inductor del sueño y sedante que combina melatonina con valeriana, passiflora y tilo, extractos de origen natural para cuadros de insomnio asociados a estados de inquietud o intranquilidad.', 19206.00,'Medicamentos Venta Libre',30, FALSE, TRUE),
('Inductor de Sueño Armonil Noche x 3 mg x 30 Comp', 'Tratamiento de las alteraciones del sueño asociadas a viajes transmeridianos (Jet-Lag) y en pacientes con dificultad para conciliar el sueño.', 12276.00,'Medicamentos Venta Libre',30, FALSE, TRUE);

-- CUIDADO PERSONAL
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Desodorante Rexona Clinical Men en Crema x 48 g', 'Antitranspirante con 3x más protección que uno común.', 11145,'Cuidado Personal', 40, FALSE, TRUE),
('Combo Colgate Clean Mint Limpieza Completa', 'Prevención avanzada de problemas bucales con fórmula patentada.', 10837,'Cuidado Personal', 44, FALSE, TRUE),
('Cepillos Interdentales Oral-B Micro x 10 Un', 'Cerdas flexibles que eliminan comida y placa entre dientes.', 10119,'Cuidado Personal', 46, FALSE, TRUE),
('Limpiador de Prótesis Corega Tabs 3 Minutos x 30 un', 'Elimina el 99,9% de las bacterias que causan mal olor.', 7353,'Cuidado Personal', 23, FALSE, TRUE),
('Pasta Dental Colgate Luminous White Glow x 70 g', 'Remueve más de 10 años de manchas gracias al peróxido de hidrógeno.', 4200,'Cuidado Personal', 33, FALSE, TRUE),
('Cepillo Dental Colgate Bamboo Carbón x 2 un', 'Cepillo ecológico hecho a base de bamboo.', 3158,'Cuidado Personal', 14, FALSE, TRUE),
('Oleo Pantene Nutritivo x 95 ml', 'Para cabello seco y sin vida ~ opaco, con frizz y difícil de manejar.', 8750.00,'Cuidado Personal',40, FALSE, TRUE),
('Shampoo Tio Nacho Anticanas x 415 ml', 'Anti-Caída-La Jalea Real es reconocida por su alto contenido de vitaminas y aminoácidos los cuales ayudan a rejuvenecer el cabello aportando brillo, fortaleza y menos caída.', 8990.00,'Cuidado Personal',40, FALSE, TRUE),
('Kit Elvive Glycolic Gloss Rutina Brillo Intenso', 'Descubre el nuevo Elvive Glycolic Gloss de LOréal Paris, nuestra primera línea que mejora visiblemente la calidad del pelo y le da 3x más brillo* inmediato.', 28621.00,'Cuidado Personal',40, FALSE, TRUE),
('Kit Dove Bond Intense Repair Shampoo x 400 ml + Acondicionador x 250 ml + Sérum Capilar x 110 ml + Máscara de Tratamiento x 250 g', 'El nuevo shampoo Dove Bond Intense Repair es un producto específicamente diseñado para el cuidado capilar, diseñado para reparar la estructura interna del cabello a nivel molecular gracias a su tecnología patentada y Péptido Complex.', 28804.00,'Cuidado Personal',40, FALSE, TRUE),
('Enjuague Bucal Listerine Cuidado Total Frescura Suave Sin Alcohol x 500 ml', 'Fórmula exclusiva con agentes antibacterianos que eliminan hasta el 99,9% de los gérmenes que causan placa, gingivitis y mal aliento en solo 30 segundos.', 6206,'Cuidado Personal',40, FALSE, TRUE),
('Enjuague Bucal Colgate Plax Odor Control x 500 ml', 'Con ayuda de la fórmula del Enjuague bucal Plax odor control que ofrece Colgate, podrás mantener un aliento fresco en todo momento.', 7521,'Cuidado Personal',40, FALSE, TRUE),
('Repelente para Mosquitos OFF! Defense Bebé x 100 ml', 'GEL repelente con Icaridina, apto para niños mayores a 3 meses de edad : Su fórmula no grasa deja mejor sensación en la piel. Perfecto para: Parque de juegos, Jugar, Relajarse.', 12173,'Cuidado Personal',40, FALSE, TRUE),
('Repelente para Mosquitos OFF! Defense Extreme Gel x 100 ml', 'Nuevo gel repelente con Icaridina, que brinda hasta 10 horas de protección contra los mosquitos. Su fórmula no grasa deja mejor sensación en la piel.', 11179,'Cuidado Personal',40, FALSE, TRUE),
('Repelente Off Extra Duración Aerosol x 170 g', 'Perfecto para: Jardín, Playa, Camping, Pesca, Senderismo, Organización de eventos.', 10691,'Cuidado Personal',40, FALSE, TRUE),
('Máquina para Afeitar Venus Recargable Especial para Área Íntima', 'La nueva máquina de afeitar reutilizable Gillette Venus Especial para el Área Íntima fue diseñada para cuidar y proteger la piel delicada del área íntima con nuestra mejor tecnología anti-irritación.', 14466,'Cuidado Personal',40, FALSE, TRUE),
('Gel de Ducha Home Spa Live & Love x 115 ml', 'Gel de Ducha Home Spa Live & Love x 115 ml. Te presentamos la exquisita línea Live & Love de Home Spa, que promete llevarte lejos de la rutina y despertar los sentidos.', 3196,'Cuidado Personal',40, FALSE, TRUE),
('Cabezales de Repuestos Para Cepillo Dental Eléctrico Oral-B Disney Cars x 2 un', 'Cerdas suaves redondeadas, delicadas con dientes y encías. - Cerdas Indicator que se decoloran hasta la mitad mostrando el momento de cambiar el cepillo. - Cabezal redondo que rodea cada diente para una limpieza superior.', 7592,'Cuidado Personal',40, FALSE, TRUE),
('Óleo + Sérum Capilar Dove Bond Intense Repair x 110 ml', 'El nuevo Óleo + Serum Bifásico Dove Bond Intense Repair de 110 ml es una innovadora solución para el cuidado del cabello, diseñada para mujeres que buscan reparar los daños acumulados en su pelo.', 10296,'Cuidado Personal',40, FALSE, TRUE),
('Crema para Peinar Pantene Keratina x 300 ml', 'La colección Pantene Keratina Repara & Protege, es libre de sal y su fórmula con Keratina, Aminoácido y Pro Vitamina B5, detecta, repara y previene el daño ocasionado por herramientas de calor.', 10296,'Cuidado Personal',23, FALSE, TRUE);

-- BEBES Y NIÑOS
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Leche Infantil en Polvo Nutrilon 3 Pouch x 1,2 kg', 'Leche modificada en polvo, con prebióticos, fortificada con hierro, calcio, zinc, vitaminas A, D y C, con ácidos grasos poliinsaturados de cadena larga, para niños a partir de 1 año. Libre de gluten. Complementa la alimentación de niños mayores de 1 año. No es un sucedáneo de la leche materna.', 47116,'Bebes y Niños',40, FALSE, TRUE),
('Pañales Huggies Supreme Care Jumbo', 'El nuevo Huggies® Supreme Care, Cuidado Natural para su delicada piel tiene la máxima protección de Huggies: hecho con fibras naturales, 0% fragancia y parabenos, ofreciendo máxima sequedad y suavidad tipo algodón.', 35579,'Bebes y Niños',50, FALSE, TRUE),
('Pañales Pampers Deluxe Protection RN+ x 56 un', 'Pampers Deluxe Protection Recién Nacido cuenta con la máxima absorción y suavidad de Pampers para proteger delicadamente la piel de tu bebé desde el primer día.', 31617,'Bebes y Niños',55, FALSE, TRUE),
('Vasos Avent Contenedores para Leche Materna x 10 un', 'Ideal para guardar y darle al bebé la leche materna sea más eficiente, con nuestro nuevo vaso de almacenamiento. Podrá esterilizarlo y reutilizarlo junto con el extractor de Philips Avent.', 40879,'Bebes y Niños',60, FALSE, TRUE),
('Shampoo Aveno Bebes y Niños x 250 ml', 'El shampoo Aveno Infantil limpia, humecta y protege hasta los cueros cabelludos mas sensibles y reactivos de los niños. Gracias a los beneficios de la avena, es hidratante, protector y emoliente. Otorga docilidad, brillo y suavidad al cabello.', 15444,'Bebes y Niños',25, FALSE, TRUE),
('Toallas Húmedas Farmacity Bebé Cuidado Diario Avena x 96', 'Toallas húmedas antibacteriales para niños con Avena.', 6900,'Bebes y Niños',33, FALSE, TRUE),
('Chupetes Avent Azul Ultra Soft 6 - 18 Meses x 2', 'Cuida La Delicada Piel De Tu Bebé Con El Chupete Ultrasuave De Philips Avent. Nuestra Boquilla Increíblemente Suave Y Flexible Sigue Los Contornos Naturales De Su Rostro, Dejando Menos Marcas Y Menos Irritación En La Piel De Su Bebé.', 18479,'Bebes y Niños',30, FALSE, TRUE),
('Fórmula Sancor Bebé Advanced 3 Estuche x 800 g', 'SanCor Bebé Advanced 3 está indicada para la alimentación de niños de 1 a 2 años de edad en caso de que la lactancia materna no sea posible o para su complementación. Libre de gluten.', 14938.00,'Bebes y Niños',40, FALSE, TRUE),
('Fórmula Láctea Polvo Nestlé Nidina 3 x 800 g', 'Nueva rectea con más fibra, acidps grasos esenciales para el crecimeinto y formación del crebro. Proteínas de alto valor biologico fundamentales para un óptimo desarrollo.', 15132.00,'Bebes y Niños',40, FALSE, TRUE),
('Leche en Polvo Nestle Nido 3 x 370 g', 'Leche en Polvo Nestle Nido 3 x 370 g. Esta leche está desarrollada para niños a partir de 1 año con los nutrientes esenciales para mantener fuerte su sistema inmunológico, a una mejor digestión y a fortalecer sus huesos y músculos.', 5744.00,'Bebes y Niños',40, FALSE, TRUE),
('Leche Infantil Líquida Nan 3 x 24', 'Leche Infantil Líquida Nan 3 x 24 un.', 51454.00,'Bebes y Niños',40, FALSE, TRUE),
('Leche Infantil Polvo Vital 3 12+ Meses x 800 g', 'Leche modificada en polvo, para niños después del año. Fortificada con Hierro y Zinc. Libre de gluten.Sin T.A.C.C.', 28839.00,'Bebes y Niños',40, FALSE, TRUE),
('Pañales Pampers Deluxe Protection', 'Pampers Deluxe Protection cuenta con la máxima absorción y suavidad de Pampers para proteger delicadamente la piel de tu bebé.', 42426.00,'Bebes y Niños',40, FALSE, TRUE),
('Combo Huggies Natural Care Pañales Talle RN + Toallitas Húmedas Triple Protección con Óleo Calcáreo', 'El nuevo Huggies® Natural Care -Suavidad Insuperable- es cuidado superior* para su piel. Nuestra máxima protección de Huggies: suave como el algodón, super absorbción y sin fragancias, parabenos ni sustancias nocivas.', 29221.00,'Bebes y Niños',40, FALSE, TRUE),
('Tetina Natural Feeling Chicco Flujo Rápido 6 m+ x 2 un', 'Tetina de silicona con doble válvula anti-cólicos para los biberones NaturalFeeling. La única línea de biberones que simula una lactancia intuitiva como el pecho de la madre', 14490.00,'Bebes y Niños',40, FALSE, TRUE),
('Mamadera NUK First Choice Mickey Mouse Gris x 300 ml', 'La mamadera First Choice tiene una tetina anatómica diseñada con dentistas y matronas para imitar la forma del pezón materno al succionar.', 26009.00,'Bebes y Niños',40, FALSE, TRUE),
('Crema Hipoglós Protección contra Paspaduras x 30 g', 'Hipoglós pomada cuidado diario alivia los síntomas en la piel irritada y enrojecida, contribuyendo a su regeneración, devolviéndole la humectación y suavidad natural.', 7162.00,'Bebes y Niños',40, FALSE, TRUE),
('Jabón en Barra Baby Dove Humectación Sensible x 75 g', 'Suave y delicado, este jabón hipoalergénico ayuda a cuidar la piel sensible del bebé minimizando las alergias y logrando una piel más suave ¿Sabías que la piel del bebé pierde humedad hasta cinco veces más rápido que la de un adulto? Durante los primeros meses de su vida, los pequeños tienen una piel especialmente delicada.', 2011.00,'Bebes y Niños',40, FALSE, TRUE),
('Toallitas Húmedas Huggies Limpieza Diaria x 112 un', 'Dermatológicamente probadas, ayudan a prevenir irritaciones con el uso y limpieza diaria.', 8117.00,'Bebes y Niños',40, FALSE, TRUE),
('Set Chupete NUK Mickey Mouse T2 Rojo/Gris x 2 un', 'La tetina plana y la parte inferior suave aseguran una sensación agradable en la boca y le dan a la lengua suficiente espacio para movimientos de succión naturales.', 15891.00,'Bebes y Niños',40, FALSE, TRUE);

-- NUTRICIÓN Y DEPORTES
INSERT INTO Productos (nombreProducto, descripcion, precio, categoria, stock, requiereReceta, activo) VALUES
('Barra Protéica Pure Wellness Sabor Cookies and Cream x 46 g', 'Las barritas protéicas Pure Wellness son el complemento ideal de cualquier entrenamiento. Ricas en sabor y a nivel nutricional. Con un 35% de proteínas de alta calidad, son ricas en fibras, con bajo aporte de carbohidratos y azúcares. No aportan grasas trans', 2490,'Nutrición y Deportes', 130, FALSE, TRUE),
('Suplemento Deportivo Ena Creatina Monohidrato en Polvo x 300 g', 'Suplemento dietario creatina para ayudarte a que rindas mucho más durante el entrenamiento y la competencia.', 40000,'Nutrición y Deportes', 44, FALSE, TRUE),
('Barra Protéica Pure Wellness Sabor Banana Split x 46 g', 'Las barritas protéicas Pure Wellness son el complemento ideal de cualquier entrenamiento. Ricas en sabor y a nivel nutricional.', 2490,'Nutrición y Deportes', 120, FALSE, TRUE),
('Suplemento Deportivo Pure Wellness Creatina Power Monohidrato x 250 g', 'Creatina Pure Wellness Power Monohid x 250 gr. Suplemento dietario a base de Creatina Monohidrato en polvo. Libre de gluten. SIN T.A.C.C. Alto rendimiento.', 19740,'Nutrición y Deportes', 23, FALSE, TRUE),
('Suplemento Dietario Pure Wellness Colágeno x 500 g x 60 un', 'Colágeno Pure Wellness es un suplemento dietario en comprimidos a base de Colágeno Hidrolizado y Vitamina E, fórmula tradicionalmente utilizada para ayudar a cuidar la piel, los cabellos, las uñas y las articulaciones.', 18900,'Nutrición y Deportes', 67, FALSE, TRUE),
('Suplemento Dietario Ultraflex Lata x 300 g', 'A base de Vitamina C con colágeno hidrolizado de origen francés . Con sabor a limón. Cada lata alcanza para un mes de tratamiento. Contiene proteínas que se digieren con facilidad. Protege los tejidos conectivos. Disminuye el riesgo de lesiones. Disolver 2 cucharadas al ras (10 gramos) en un vaso de agua (200 ml aprox.), revolver unos minutos hasta su completa disolución.', 39900,'Nutrición y Deportes', 45, FALSE, TRUE),
('Suplemento Dietario Zentro Citrato de Magnesio x 60 Comp', 'Suplemento dietario en comprimidos que aporta magnesio en forma de citrato, reconocido por su alta biodisponibilidad y fácil absorción. Cada caja contiene 60 comprimidos, asegurando un suministro adecuado para tu rutina diaria.', 16848,'Nutrición y Deportes',124, FALSE, TRUE),
('Suplemento Dietario Trb-Pharma Blue Vit B12 x 20 un', 'Blue Vit B12 es un suplemento dietario que aporta 2.000mcg de Cianocobalamina (Vitamina B12) por comprimido masticable, sabor ananá, 100% apto vegano. Esta es la dosis recomendada tanto para lograr una reposición de las reservas (déficit diagnosticado), como para el mantenimiento y prevención del déficit de Vitamina B12.', 11500,'Nutrición y Deportes',65, FALSE, TRUE),
('Probióticos Floragut B420 Metabolismo x 30 Cáps', 'Floragut® Metabolismo es un probiótico formulado con Bifidobacterium animalis ssp. lactis B420, un probiótico de alta estabilidad, eficacia y seguridad, respaldado por múltiples estudios científicos.', 59850,'Nutrición y Deportes',67, FALSE, TRUE),
('Suplemento Dietario Pure Wellness Omega3 Fish Oil x 1000 g x 50 Cápsulas Blandas', 'Omega 3 Fish Oil Pure Wellness es un suplemento dietario en cápsulas blandas a base de Aceite de Pescado. Los Omega 3 de aceite de pescado tienen las concentraciones más altas de DHA y EPA, que son ácidos grasos poliinsaturados esenciales para nuestro organismo y que el mismo no produce.', 15900,'Nutrición y Deportes',33, FALSE, TRUE),
('Creatina + electrolitos pink lemon 302 gr', 'Aumenta la fuerza y potencia muscular. Mejora la recuperación. Optimiza la hidratación al reponer sales minerales.', 30600,'Nutrición y Deportes',45, FALSE, TRUE),
('Creatina micronizada sabor naranja 342 gr', 'CREATINA MICRONIZADA es un excelente suplemento pre entrenamiento que colabora en la formación de los componentes energéticos, mejora la potencia muscular y retrasa la fatiga muscular, preparando al cuerpo para un mejor rendimiento físico. Ha sido demostrado que apoya el crecimiento del tamaño de los músculos y el aumento de fuerza y poder cuando se combina con actividades de alta intensidad', 34000,'Nutrición y Deportes',15, FALSE, TRUE),
('Suplemento dietario calcio + vitamina d (60 pastilla de goma)', 'Simple Calcio + Vitamina D es el secreto para fortalecer tus huesos y dientes. Es muy fácil de ingerir, gracias a su fórmula creada en pastillas de goma de agradable sabor a frutos rojos.', 28195,'Nutrición y Deportes',89, FALSE, TRUE),
('Suplemento Dietario Pure Wellness Omega Dual x 2000 g x 60 un', 'Omega Dual Pure Wellness es un sumplemento dietario en cápsulas blandas a base de aceite de pescado y aceite de chía.', 18900,'Nutrición y Deportes',53, FALSE, TRUE),
('Suplemento Dietario Geonat Citrato de Magnesio 500 x 30 Comp', 'Contribuye con el fortalecimiento de los huesos. Ayuda a la relajación y contracción muscular. Tecnología de máxima absorción. Colabra con el balance digestivo. Ayuda a reducir stress, fatiga, ansiedad e insomnio.', 11490,'Nutrición y Deportes',56, FALSE, TRUE),
('Suplemento Dietario Supradyn Magnesio 200 mg x 30 Comp', 'Supradyn® Magnesio con 200 mg de Magnesio por porción contiene nutrientes que ayudan a un mayor rendimiento muscular reduciendo calambres, colaborando con el buen descanso y ayudando a combatir el stress.', 15664,'Nutrición y Deportes',76, FALSE, TRUE),
('Suplemento Dietario Holo Magnesio Integral Sabor Naranja x 30 Sobres', 'Holomagnesio Integral en sobres es un suplemento dietario con trimagnesio de óptima absorción. Su fórmula única en polvo para diluir contiene 220 mg de citrato de magnesio: que corresponde con el 85% de la dosis diaria recomendada. Sabor naranja. Rinde 30 días.', 18829,'Nutrición y Deportes',87, FALSE, TRUE),
('Suplemento Dietario ISA +50 Resveratrol Ginkgo Biloba y Complejo B x 30 Comp', 'El reverastrol cumple un acción antioxidante, anticancerígena, antiviral, protectora, antiinflamatoria, neuroprotector, fitoestrogénico y antienvejecimiento.', 12668,'Nutrición y Deportes',23, FALSE, TRUE),
('Suplemento Dietario Ultraflex HMB 3000 Lata x 420 g', 'Colágeno Hidrolizado + A.Hialurónico + Vit. C.Nutrición interior para articulaciones y huesos. Suplemento dietario a base de Vitamina C con Colágeno Hidrolizado de origen francés y Ácido Hialurónico.La dosis más eficaz de colágeno, con aval científico.', 49500,'Nutrición y Deportes',43, FALSE, TRUE),
('Suplemento Dietario Panalab Valcatil Max x 120 Cápsulas Blandas', 'Valcatil Max es un Suplemento Dietario a base de Aminoácidos, Vitaminas y Minerales esenciales para la formación de cabellos y uñas. Diversos factores externos e internos pueden afectar la salud de los mismos, Valcatil Max aporta los nutrientes necesarios para mejorar la cantidad y calidad del cabello e incrementar el crecimiento y dureza de las uñas.', 105727,'Nutrición y Deportes',16, FALSE, TRUE),
('Suplemento Dietario Capskrill Omega 3 Aceite de Krill x 40 Cáps Blandas', 'El Omega 3 de CAPSKRILL contribuye a mejorar el perfil lipídico plasmático, mejorando la relación entre el colesterol bueno y el malo y reduciendo los triglicéridos.', 95901,'Nutrición y Deportes',97, FALSE, TRUE),
('Suplemento Dietario Pure Wellness Chía Oil x 1000 g x 30 Cápsulas Blandas', 'Ayuda a mejorar la relación colesterol HDL/LDL. Ayuda a reducir los niveles de colesterol y triglicéridos. Ayuda a prevenir enfermedades cardiovasculares e hipertensión.', 15900,'Nutrición y Deportes',25, FALSE, TRUE),
('Suplemento Estimulante Insulínico Metasitol x 60 Cáps', 'Metasitol Es un complemento de la alimentación que ayuda aumentar la acción de la insulina en pacientes con síndrome de ovario poliquístico (SOP), mejorando así la función ovulatoria (favoreciendo la fertilidad), controlando el peso corporal, disminuyendo los trastornos cutáneos, los parámetros de riesgo cardiovascular, el hiperandrogenismo (acné, cabello no deseado) y la hiperinsulinemia.', 73900,'Nutrición y Deportes',65, FALSE, TRUE);

-- ===========================================================
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








SET @fk_name := (
SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'MensajesClientes'
AND COLUMN_NAME = 'idCliente'
AND REFERENCED_TABLE_NAME = 'Clientes'
LIMIT 1
);

SET @drop_fk_sql := IF(
@fk_name IS NOT NULL,
CONCAT('ALTER TABLE MensajesClientes DROP FOREIGN KEY ', @fk_name),
'SELECT 1'
);

PREPARE stmt FROM @drop_fk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Ajustes de columnas base
ALTER TABLE MensajesClientes
MODIFY COLUMN idCliente INT NULL,
MODIFY COLUMN asunto VARCHAR(200) DEFAULT 'Sin Asunto';

-- Agregar tipoConsulta solo si no existe (compatible con versiones sin IF NOT EXISTS)
SET @has_tipo_consulta := (
SELECT COUNT(*)
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'MensajesClientes'
AND COLUMN_NAME = 'tipoConsulta'
);

SET @add_col_sql := IF(
@has_tipo_consulta = 0,
"ALTER TABLE MensajesClientes ADD COLUMN tipoConsulta ENUM('general', 'pedido', 'receta', 'facturacion', 'otro') DEFAULT 'general' AFTER asunto",
'SELECT 1'
);

PREPARE stmt FROM @add_col_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Re-crear FK con SET NULL
-- Garantiza compatibilidad incluso si se ejecuta este bloque de forma aislada
ALTER TABLE MensajesClientes
MODIFY COLUMN idCliente INT NULL;

SET @has_fk_target := (
SELECT COUNT(*)
FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
WHERE CONSTRAINT_SCHEMA = DATABASE()
AND TABLE_NAME = 'MensajesClientes'
AND CONSTRAINT_NAME = 'fk_mensajes_cliente'
);

SET @add_fk_sql := IF(
@has_fk_target = 0,
'ALTER TABLE MensajesClientes ADD CONSTRAINT fk_mensajes_cliente FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE SET NULL',
'SELECT 1'
);

PREPARE stmt FROM @add_fk_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Índices recomendados para bandeja de soporte
SET @has_idx_estado_fecha := (
SELECT COUNT(*)
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'MensajesClientes'
AND INDEX_NAME = 'idx_mensajes_estado_fecha'
);

SET @create_idx_estado_fecha_sql := IF(
@has_idx_estado_fecha = 0,
'CREATE INDEX idx_mensajes_estado_fecha ON MensajesClientes (estado, fechaEnvio)',
'SELECT 1'
);

PREPARE stmt FROM @create_idx_estado_fecha_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_idx_tipo := (
SELECT COUNT(*)
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'MensajesClientes'
AND INDEX_NAME = 'idx_mensajes_tipo'
);

SET @has_col_tipo := (
SELECT COUNT(*)
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'MensajesClientes'
AND COLUMN_NAME = 'tipoConsulta'
);

SET @create_idx_tipo_sql := IF(
@has_idx_tipo = 0 AND @has_col_tipo = 1,
'CREATE INDEX idx_mensajes_tipo ON MensajesClientes (tipoConsulta)',
'SELECT 1'
);

PREPARE stmt FROM @create_idx_tipo_sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

ALTER TABLE Clientes
ADD COLUMN fechaNacimiento DATE NULL AFTER dni;

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


ALTER TABLE campanas_ofertas
  MODIFY COLUMN tipo ENUM('EVENTO', 'DESCUENTO', 'LIQUIDACION', 'TEMPORADA', '2X1') DEFAULT 'DESCUENTO';


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
  fechaCreacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (idCliente) REFERENCES Clientes(idCliente) ON DELETE CASCADE,
  INDEX idx_direcciones_cliente (idCliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

SET SQL_SAFE_UPDATES = 0;

UPDATE DireccionesClientes dc
JOIN (
SELECT MIN(idDireccion) AS idDireccion
FROM DireccionesClientes
GROUP BY idCliente
) primeras ON primeras.idDireccion = dc.idDireccion
SET dc.esPredeterminada = TRUE
WHERE dc.idDireccion = primeras.idDireccion;

CREATE INDEX idx_direcciones_cliente_predeterminada
ON DireccionesClientes (idCliente, esPredeterminada);

SET SQL_SAFE_UPDATES = 1;

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
