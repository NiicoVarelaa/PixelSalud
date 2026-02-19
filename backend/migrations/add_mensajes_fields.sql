-- Script para agregar campos necesarios en la tabla MensajesClientes
-- Ejecutar este script en la base de datos si no existen los campos

-- Agregar campo leido (si no existe)
ALTER TABLE MensajesClientes 
ADD COLUMN IF NOT EXISTS leido BOOLEAN DEFAULT 0 COMMENT 'Indica si el mensaje fue leído por el admin';

-- Agregar campo respuesta (si no existe)
ALTER TABLE MensajesClientes 
ADD COLUMN IF NOT EXISTS respuesta TEXT NULL COMMENT 'Respuesta del administrador al mensaje';

-- Agregar campo fechaRespuesta (si no existe)
ALTER TABLE MensajesClientes 
ADD COLUMN IF NOT EXISTS fechaRespuesta DATETIME NULL COMMENT 'Fecha y hora en que se respondió el mensaje';

-- Agregar campo respondidoPor (si no existe)
ALTER TABLE MensajesClientes 
ADD COLUMN IF NOT EXISTS respondidoPor VARCHAR(100) NULL COMMENT 'Nombre del admin que respondió';

-- Actualizar estados válidos (si la columna estado es ENUM)
-- Si es VARCHAR, este comando fallará pero no es grave
-- ALTER TABLE MensajesClientes 
-- MODIFY COLUMN estado ENUM('nuevo', 'en_proceso', 'respondido', 'cerrado') DEFAULT 'nuevo';

-- Verificar estructura de la tabla
DESCRIBE MensajesClientes;
