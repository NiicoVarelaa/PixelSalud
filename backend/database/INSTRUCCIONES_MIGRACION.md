# 📋 INSTRUCCIONES DE MIGRACIÓN - Sistema de Campañas

## ⚠️ IMPORTANTE ANTES DE EMPEZAR

1. **HACER BACKUP DE LA BASE DE DATOS**

   ```sql
   mysqldump -u root -p pixel_salud > backup_antes_migracion.sql
   ```

2. **Verificar que tienes datos en la tabla ofertas:**
   ```sql
   SELECT COUNT(*) FROM ofertas;
   ```

---

## 🔄 PASOS DE MIGRACIÓN

### **PASO 1: Ejecutar el script SQL**

Abre MySQL Workbench o tu cliente SQL favorito y ejecuta el archivo:

```
backend/database/migration_campanas_ofertas.sql
```

O desde terminal:

```bash
mysql -u root -p pixel_salud < backend/database/migration_campanas_ofertas.sql
```

---

### **PASO 2: Verificar la migración**

Ejecuta estas consultas para confirmar que todo se migró correctamente:

```sql
-- Ver campañas creadas
SELECT * FROM campanas_ofertas;

-- Total productos por campaña
SELECT c.nombreCampana, COUNT(pc.idProducto) as total_productos
FROM campanas_ofertas c
LEFT JOIN productos_campanas pc ON c.idCampana = pc.idCampana
GROUP BY c.idCampana;

-- Comparar totales (deben coincidir)
SELECT 'Tabla antigua' as origen, COUNT(*) as total FROM ofertas_old_backup
UNION ALL
SELECT 'Tabla nueva' as origen, COUNT(*) as total FROM productos_campanas;
```

Si los totales **NO coinciden**, DETENTE y revisa.

---

### **PASO 3: ¿Qué pasó con la tabla "ofertas"?**

✅ **La tabla se renombró a `ofertas_old_backup`** (no se eliminó)

**Razón:** Por seguridad. Si algo sale mal, podemos hacer rollback fácilmente.

**Opciones:**

**A) TODO FUNCIONÓ BIEN (después de 1 semana de pruebas):**

```sql
-- Eliminar backup
DROP TABLE ofertas_old_backup;
```

**B) ALGO SALIÓ MAL (rollback inmediato):**

```sql
-- Restaurar tabla original
DROP TABLE IF EXISTS campanas_ofertas;
DROP TABLE IF EXISTS productos_campanas;
RENAME TABLE ofertas_old_backup TO ofertas;
```

---

### **PASO 4: Actualizar el código backend**

Después de migrar la BD, hay que actualizar el código NodeJS:

1. ✅ Crear **CampanasRepository.js**
2. ✅ Crear **ProductosCampanasRepository.js**
3. ✅ Crear **CampanasService.js**
4. ✅ Crear **CampanasController.js**
5. ✅ Crear **CampanasRoutes.js**
6. ✅ Crear **CampanasSchemas.js**
7. ✅ Actualizar **index.js** (registrar rutas)

**¿Quieres que genere estos archivos ahora?** Dime y los creo todos.

---

### **PASO 5: Actualizar el frontend**

**AdminOfertas.jsx** → **AdminCampanas.jsx**

Nueva interfaz:

```
┌─────────────────────────────────────────┐
│  CREAR NUEVA CAMPAÑA                    │
├─────────────────────────────────────────┤
│ Nombre: [Cyber Week 2026        ]      │
│ Descuento: [25]%                        │
│ Inicio: [2026-11-20] Fin: [2026-11-27] │
│                                         │
│ PRODUCTOS (68 seleccionados):           │
│ ☑ Fragancias (45 productos)            │
│ ☑ Dermocosmetica (23 productos)        │
│ ☐ Medicamentos (0 productos)           │
│                                         │
│        [Crear Campaña]                  │
└─────────────────────────────────────────┘
```

---

## 📊 RESULTADO FINAL

### **Antes (modelo antiguo):**

```
ofertas
├── idOferta: 1, idProducto: 1, descuento: 25%
├── idOferta: 2, idProducto: 2, descuento: 25%
├── idOferta: 3, idProducto: 3, descuento: 25%
└── ... (50 filas duplicadas)
```

### **Después (modelo nuevo):**

```
campanas_ofertas
└── idCampana: 1 "Cyber Monday" 25%

productos_campanas
├── id: 1, idCampana: 1, idProducto: 1
├── id: 2, idCampana: 1, idProducto: 2
├── id: 3, idCampana: 1, idProducto: 3
└── ... (50 filas, pero sin duplicar fechas/descuento)
```

**Beneficio:** Cambiar el descuento de toda la campaña = 1 UPDATE en lugar de 50

---

## 🚨 CHECKLIST ANTES DE CONTINUAR

- [ ] Hice backup de la base de datos
- [ ] Ejecuté el script de migración
- [ ] Verifiqué que los totales coinciden
- [ ] La tabla ofertas_old_backup existe
- [ ] Puedo hacer rollback si algo falla

**¿Todo listo?** Avísame y creo el código backend completo.
