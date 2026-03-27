-- Habilita contacto público en MensajesClientes
-- 1) idCliente pasa a nullable
-- 2) FK cambia a ON DELETE SET NULL
-- 3) agrega tipoConsulta para clasificar tickets
-- 4) amplía asunto a 200 caracteres

USE pixel_salud;

-- Eliminar FK actual si existe (nombre dinámico por entorno)
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

-- Ajustes de columnas
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
