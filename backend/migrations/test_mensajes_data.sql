-- ==============================================
-- Script de Testing: Mensajes de Clientes
-- ==============================================
-- Este script inserta datos de prueba para el módulo de mensajes
-- Ejecutar después de la migración add_mensajes_fields.sql

-- Primero, verificar que los campos existen
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'MensajesClientes' 
AND TABLE_SCHEMA = 'pixel_salud';

-- ==============================================
-- Mensajes de Prueba
-- ==============================================

-- Mensaje 1: Nuevo (sin leer, sin responder)
INSERT INTO MensajesClientes (
  idCliente, nombre, email, asunto, mensaje, estado, leido
) VALUES (
  1, 
  'Juan Pérez', 
  'juan.perez@gmail.com',
  'Consulta sobre entrega',
  'Hola, quisiera saber cuánto tarda en llegar mi pedido. Compré hace 3 días y aún no tengo información de seguimiento. Mi número de orden es #1234. Muchas gracias.',
  'nuevo',
  0
);

-- Mensaje 2: En proceso (leído, sin responder)
INSERT INTO MensajesClientes (
  idCliente, nombre, email, asunto, mensaje, estado, leido
) VALUES (
  2,
  'María González',
  'maria.gonzalez@hotmail.com',
  'Problema con el pago',
  'Intenté pagar con tarjeta de crédito pero me da error. ¿Pueden ayudarme? Necesito realizar la compra urgente.',
  'en_proceso',
  1
);

-- Mensaje 3: Respondido (con respuesta completa)
INSERT INTO MensajesClientes (
  idCliente, nombre, email, asunto, mensaje, estado, leido, respuesta, fechaRespuesta, respondidoPor
) VALUES (
  3,
  'Carlos Rodríguez',
  'carlos.rodriguez@yahoo.com',
  '¿Tienen descuentos para clientes frecuentes?',
  'Compro regularmente en su farmacia. Me gustaría saber si tienen algún programa de puntos o descuentos especiales para clientes frecuentes.',
  'respondido',
  1,
  'Estimado Carlos, muchas gracias por su consulta. Nos complace informarle que sí contamos con un programa de fidelización. Por cada compra acumula puntos que puede canjear en futuras compras. Además, tenemos promociones exclusivas para clientes registrados. ¡Lo invitamos a revisar la sección "Mis Beneficios" en su perfil!',
  NOW() - INTERVAL 2 HOUR,
  'Admin Principal'
);

-- Mensaje 4: Cerrado/Archivado
INSERT INTO MensajesClientes (
  idCliente, nombre, email, asunto, mensaje, estado, leido, respuesta, fechaRespuesta, respondidoPor
) VALUES (
  1,
  'Ana Martínez',
  'ana.martinez@gmail.com',
  'Gracias por el excelente servicio',
  'Solo quería agradecer por la rapidez en la entrega y la calidad de los productos. ¡Definitivamente volveré a comprar!',
  'cerrado',
  1,
  '¡Muchas gracias Ana por tus palabras! Nos alegra mucho saber que tu experiencia fue positiva. Esperamos verte pronto.',
  NOW() - INTERVAL 1 DAY,
  'Soporte Pixel Salud'
);

-- Mensaje 5: Nuevo con asunto largo
INSERT INTO MensajesClientes (
  idCliente, nombre, email, asunto, mensaje, estado, leido
) VALUES (
  4,
  'Luis Fernández',
  'luis.fernandez@outlook.com',
  'Consulta sobre medicamento específico: ¿Tienen disponibilidad de Ibuprofeno 600mg?',
  'Buenos días, necesito comprar Ibuprofeno 600mg pero no lo encuentro en el catálogo online. ¿Tienen stock? ¿Necesito receta médica para comprarlo? Gracias por su atención.',
  'nuevo',
  0
);

-- Mensaje 6: Mensaje sin asunto (caso edge)
INSERT INTO MensajesClientes (
  idCliente, nombre, email, asunto, mensaje, estado, leido
) VALUES (
  2,
  'Sofía López',
  'sofia.lopez@gmail.com',
  'Sin Asunto',
  'Hola, solo quería dejar mi feedback positivo sobre la app. Es muy fácil de usar y los precios son competitivos.',
  'nuevo',
  0
);

-- Mensaje 7: Respondido recientemente
INSERT INTO MensajesClientes (
  idCliente, nombre, email, asunto, mensaje, estado, leido, respuesta, fechaRespuesta, respondidoPor
) VALUES (
  5,
  'Pedro Sánchez',
  'pedro.sanchez@gmail.com',
  'Devolución de producto',
  'Compré un termómetro pero vino defectuoso. ¿Cómo puedo hacer una devolución?',
  'respondido',
  1,
  'Estimado Pedro, lamentamos mucho el inconveniente. Para procesar la devolución, necesitamos que nos envíes fotos del producto defectuoso y tu número de orden al correo devoluciones@pixelsalud.com. Procesaremos tu reembolso en un plazo de 48 horas. Disculpa las molestias.',
  NOW() - INTERVAL 30 MINUTE,
  'Admin'
);

-- ==============================================
-- Verificar datos insertados
-- ==============================================

-- Ver todos los mensajes
SELECT 
  idMensaje,
  nombre,
  email,
  asunto,
  estado,
  leido,
  CASE WHEN respuesta IS NOT NULL THEN 'Sí' ELSE 'No' END AS TieneRespuesta,
  fechaEnvio
FROM MensajesClientes
ORDER BY idMensaje DESC;

-- Contar mensajes por estado
SELECT 
  estado,
  COUNT(*) AS cantidad,
  SUM(CASE WHEN leido = 1 THEN 1 ELSE 0 END) AS leidos,
  SUM(CASE WHEN respuesta IS NOT NULL THEN 1 ELSE 0 END) AS respondidos
FROM MensajesClientes
GROUP BY estado;

-- ==============================================
-- Limpiar datos de prueba (si necesitas borrar)
-- ==============================================

-- ⚠️ CUIDADO: Esto borra TODOS los mensajes de prueba
-- Descomentar solo si necesitas limpiar:

/*
DELETE FROM MensajesClientes 
WHERE email IN (
  'juan.perez@gmail.com',
  'maria.gonzalez@hotmail.com',
  'carlos.rodriguez@yahoo.com',
  'ana.martinez@gmail.com',
  'luis.fernandez@outlook.com',
  'sofia.lopez@gmail.com',
  'pedro.sanchez@gmail.com'
);
*/

-- ==============================================
-- Notas de Testing
-- ==============================================

-- Estados para probar:
-- ✅ nuevo (2 mensajes) - Mostrar como no leídos, permitir responder
-- ✅ en_proceso (1 mensaje) - Leído pero sin responder
-- ✅ respondido (2 mensajes) - Con respuesta visible, no permitir responder de nuevo
-- ✅ cerrado (1 mensaje) - Archivado, no permitir responder

-- Casos edge:
-- ✅ Asunto muy largo
-- ✅ Mensaje sin asunto ("Sin Asunto")
-- ✅ Respuesta reciente (30 minutos)
-- ✅ Respuesta antigua (1 día)

-- Testing checklist:
-- [ ] Filtrar por estado "nuevo" - debe mostrar 3
-- [ ] Filtrar por estado "respondido" - debe mostrar 2
-- [ ] Buscar "Ibuprofeno" - debe encontrar 1
-- [ ] Buscar por email "gmail.com" - debe encontrar varios
-- [ ] Marcar como leído un mensaje nuevo
-- [ ] Responder un mensaje en_proceso
-- [ ] Intentar responder un mensaje cerrado (debe estar bloqueado)
-- [ ] Ver respuesta existente en mensajes respondidos
-- [ ] Eliminar un mensaje
-- [ ] Archivar un mensaje (cambiar a cerrado)
