-- =====================================================
-- TABLA DE AUDITORÍA
-- Registra todas las acciones críticas del sistema
-- =====================================================

CREATE TABLE IF NOT EXISTS auditoria (
  idAuditoria INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Información de la acción
  evento VARCHAR(100) NOT NULL COMMENT 'Tipo de evento (ej: VENTA_CREADA, PERMISO_MODIFICADO)',
  modulo VARCHAR(50) NOT NULL COMMENT 'Módulo del sistema (ventas, productos, permisos, etc)',
  accion VARCHAR(50) NOT NULL COMMENT 'Acción realizada (CREATE, UPDATE, DELETE, LOGIN, etc)',
  descripcion TEXT COMMENT 'Descripción detallada de la acción',
  
  -- Información del usuario que realizó la acción
  tipoUsuario ENUM('admin', 'empleado', 'medico', 'cliente', 'sistema') NOT NULL,
  idUsuario INT NOT NULL COMMENT 'ID del usuario que realizó la acción',
  nombreUsuario VARCHAR(100) COMMENT 'Nombre completo del usuario',
  emailUsuario VARCHAR(100) COMMENT 'Email del usuario',
  
  -- Datos de la acción
  entidadAfectada VARCHAR(50) COMMENT 'Nombre de la entidad afectada (ej: VentasOnlines, Productos)',
  idEntidad INT COMMENT 'ID del registro afectado',
  datosAnteriores JSON COMMENT 'Estado anterior del registro (para UPDATE/DELETE)',
  datosNuevos JSON COMMENT 'Estado nuevo del registro (para CREATE/UPDATE)',
  
  -- Metadatos
  ip VARCHAR(45) COMMENT 'Dirección IP del cliente',
  userAgent VARCHAR(255) COMMENT 'User agent del navegador',
  
  -- Timestamps
  fechaHora DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha y hora de la acción',
  
  -- Índices para mejorar búsquedas
  INDEX idx_evento (evento),
  INDEX idx_modulo (modulo),
  INDEX idx_usuario (tipoUsuario, idUsuario),
  INDEX idx_fecha (fechaHora),
  INDEX idx_entidad (entidadAfectada, idEntidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Registro de auditoría de acciones críticas';

-- =====================================================
-- EVENTOS DE AUDITORÍA PREDEFINIDOS
-- =====================================================
/*
MÓDULO: AUTENTICACIÓN
- LOGIN_EXITOSO
- LOGIN_FALLIDO
- LOGOUT
- RECUPERACION_CONTRASENA
- CAMBIO_CONTRASENA

MÓDULO: VENTAS
- VENTA_CREADA
- VENTA_MODIFICADA
- VENTA_CANCELADA
- VENTA_ANULADA

MÓDULO: PRODUCTOS
- PRODUCTO_CREADO
- PRODUCTO_MODIFICADO
- PRODUCTO_ELIMINADO
- PRODUCTO_STOCK_BAJO
- PRODUCTO_STOCK_ACTUALIZADO

MÓDULO: PERMISOS
- PERMISO_OTORGADO
- PERMISO_REVOCADO
- PERMISO_MODIFICADO

MÓDULO: USUARIOS
- USUARIO_CREADO
- USUARIO_MODIFICADO
- USUARIO_ELIMINADO
- USUARIO_DESACTIVADO
- USUARIO_ACTIVADO

MÓDULO: OFERTAS
- OFERTA_CREADA
- OFERTA_MODIFICADA
- OFERTA_ELIMINADA
- CAMPANA_CREADA
- CAMPANA_MODIFICADA

MÓDULO: MERCADOPAGO
- PAGO_RECIBIDO
- PAGO_RECHAZADO
- WEBHOOK_PROCESADO
*/
