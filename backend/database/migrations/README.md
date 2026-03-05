# Migración: Ofertas Individuales en Productos

## Descripción

Esta migración agrega las columnas necesarias para gestionar ofertas individuales (10%, 15%, 20%) en productos, de manera independiente al sistema de campañas.

## Columnas agregadas

- `enOferta` (BOOLEAN): Indica si el producto tiene una oferta individual activa
- `porcentajeDescuento` (INT): Porcentaje de descuento (valores permitidos: 0, 10, 15, 20)

## Restricciones

- Solo se permiten descuentos de 0%, 10%, 15% o 20%
- Los productos en campañas activas NO pueden tener ofertas individuales simultáneamente
- Se agrega índice para optimizar consultas de productos en oferta

## Cómo ejecutar la migración

### Opción 1: Desde MySQL Workbench

1. Abre MySQL Workbench
2. Conecta a tu base de datos `pixel_salud`
3. Abre el archivo `add_ofertas_individuales.sql`
4. Ejecuta todo el script (Ctrl+Shift+Enter)

### Opción 2: Desde línea de comandos

```bash
# Navega a la carpeta de migraciones
cd backend/database/migrations

# Ejecuta el script
mysql -u tu_usuario -p pixel_salud < add_ofertas_individuales.sql
```

### Opción 3: Desde PowerShell (Windows)

```powershell
# Navega a la carpeta de migraciones
cd backend\database\migrations

# Ejecuta el script
Get-Content add_ofertas_individuales.sql | mysql -u tu_usuario -p pixel_salud
```

## Verificación

Después de ejecutar la migración, verifica que las columnas se agregaron correctamente:

```sql
USE pixel_salud;
DESCRIBE Productos;
```

Deberías ver las columnas `enOferta` y `porcentajeDescuento` en la tabla.

## Validación de datos

Para verificar que no hay productos con ofertas y en campañas simultáneamente:

```sql
-- Productos que tienen oferta individual
SELECT idProducto, nombreProducto, enOferta, porcentajeDescuento
FROM Productos
WHERE enOferta = TRUE;

-- Productos en campañas activas
SELECT DISTINCT p.idProducto, p.nombreProducto
FROM Productos p
JOIN productos_campanas pc ON p.idProducto = pc.idProducto
JOIN Campanas c ON pc.idCampana = c.idCampana
WHERE c.activa = TRUE;
```

## Rollback (si es necesario)

Si necesitas revertir la migración:

```sql
USE pixel_salud;

-- Eliminar el constraint
ALTER TABLE Productos DROP CONSTRAINT chk_porcentaje_valido;

-- Eliminar el índice
DROP INDEX idx_productos_enOferta ON Productos;

-- Eliminar las columnas
ALTER TABLE Productos
DROP COLUMN enOferta,
DROP COLUMN porcentajeDescuento;
```

## Notas importantes

⚠️ **Separación de responsabilidades:**

- **Ofertas individuales**: Descuentos aplicados a productos específicos (10%, 15%, 20%)
- **Campañas**: Grupos de productos con descuentos masivos gestionados por fecha

⚠️ **Conflictos:**

- Un producto NO puede estar en oferta individual y en campaña al mismo tiempo
- El frontend AdminOfertas valida esto automáticamente
- Los productos en campañas activas mostrarán un badge "En Campaña" y no permitirán activar ofertas

## Soporte

Si encuentras algún error durante la migración, verifica:

1. Que tienes permisos ALTER TABLE en la base de datos
2. Que no hay datos existentes que violen la restricción chk_porcentaje_valido
3. Que la base de datos `pixel_salud` existe y está activa
