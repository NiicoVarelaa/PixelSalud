# 📐 AdminLayout - Guía de Uso

## 🎯 Objetivo

`AdminLayout` es un componente centralizado que estandariza la estructura, paddings, margins y layout de todos los módulos de administración, eliminando la duplicación de código y asegurando consistencia visual en toda la aplicación admin.

---

## ✅ Beneficios

- ✅ **Consistencia**: Todos los módulos admin tienen los mismos paddings/margins
- ✅ **Layout sin scroll**: Implementa el patrón `flex-1 h-full min-h-0` automáticamente
- ✅ **Accesibilidad**: Skip link incluido por defecto (WCAG 2.1 AAA)
- ✅ **Responsive**: Mobile-first design (320px → 1440px+)
- ✅ **Reutilización**: Elimina 50+ líneas de código repetitivo por módulo
- ✅ **Mantenibilidad**: Cambios en el layout se aplican en un solo lugar

---

## 📦 Props

| Prop               | Tipo        | Requerido | Default     | Descripción                                      |
| ------------------ | ----------- | --------- | ----------- | ------------------------------------------------ |
| `title`            | `string`    | ✅ Sí     | -           | Título del encabezado del módulo                 |
| `description`      | `string`    | ❌ No     | `undefined` | Descripción opcional bajo el título              |
| `children`         | `ReactNode` | ✅ Sí     | -           | Contenido principal del módulo (scrolleable)     |
| `headerAction`     | `ReactNode` | ❌ No     | `undefined` | Acción opcional en el header (ej: botón crear)   |
| `contentClassName` | `string`    | ❌ No     | `""`        | Clases CSS adicionales para el área de contenido |

---

## 🚀 Uso Básico

### Ejemplo Simple (sin acciones en header)

```jsx
import { AdminLayout } from "@features/admin/components/shared";

const MiModulo = () => {
  return (
    <AdminLayout
      title="Gestión de Productos"
      description="166 productos encontrados"
    >
      {/* Tu contenido aquí */}
      <div>
        <h2>Listado de productos</h2>
        {/* ... */}
      </div>
    </AdminLayout>
  );
};
```

### Ejemplo con Header Action

```jsx
import { AdminLayout } from "@features/admin/components/shared";
import { Plus } from "lucide-react";

const MiModulo = () => {
  const handleCrear = () => {
    // lógica para crear
  };

  return (
    <AdminLayout
      title="Gestión de Empleados"
      description="Administra los empleados de la farmacia"
      headerAction={
        <button
          onClick={handleCrear}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={20} /> Nuevo Empleado
        </button>
      }
    >
      {/* Tu contenido aquí */}
    </AdminLayout>
  );
};
```

### Ejemplo con Múltiples Acciones en Header

```jsx
import { AdminLayout } from "@features/admin/components/shared";
import { Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const MiModulo = () => {
  return (
    <AdminLayout
      title="Administración de Clientes"
      description="Gestiona los usuarios registrados"
      headerAction={
        <div className="flex gap-3">
          <button
            onClick={handleCrear}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus size={20} /> Nuevo Cliente
          </button>
          <Link
            to="/admin"
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} /> Volver
          </Link>
        </div>
      }
    >
      {/* Tu contenido aquí */}
    </AdminLayout>
  );
};
```

### Ejemplo con Content Classes Personalizadas

```jsx
import { AdminLayout } from "@features/admin/components/shared";

const MiModulo = () => {
  return (
    <AdminLayout
      title="Reportes y Estadísticas"
      description="Exporta reportes detallados"
      contentClassName="space-y-4 p-2" // Clases adicionales para el contenedor de contenido
    >
      <div>Sección 1</div>
      <div>Sección 2</div>
      <div>Sección 3</div>
    </AdminLayout>
  );
};
```

---

## 📐 Estructura del Layout

AdminLayout implementa automáticamente esta estructura:

```
┌──────────────────────────────────────────────────┐
│  Container Principal (flex-1 h-full min-h-0)    │
│  bg-gray-50 p-3 sm:p-4 lg:p-6                   │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Skip Link (Accesibilidad)                  │ │
│  └────────────────────────────────────────────┘ │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Wrapper (max-w-7xl mx-auto)                │ │
│  │                                            │ │
│  │ ┌────────────────────────────────────────┐ │ │
│  │ │ Header (shrink-0)                      │ │ │
│  │ │ - Título                               │ │ │
│  │ │ - Descripción                          │ │ │
│  │ │ - Actions (opcional)                   │ │ │
│  │ └────────────────────────────────────────┘ │ │
│  │                                            │ │
│  │ ┌────────────────────────────────────────┐ │ │
│  │ │ Área de Contenido (flex-1 overflow-y)  │ │ │
│  │ │                                        │ │ │
│  │ │ {children}                             │ │ │
│  │ │                                        │ │ │
│  │ │ ↕ Scrolleable                          │ │ │
│  │ │                                        │ │ │
│  │ └────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

---

## 🎨 Características de Diseño

### 1. Padding Responsivo

- Mobile (320px-640px): `p-3` (12px)
- Tablet (640px-1024px): `p-4` (16px)
- Desktop (1024px+): `p-6` (24px)

### 2. Layout Sin Scroll

- El container principal usa `flex-1 h-full min-h-0`
- El header es `shrink-0` (no se comprime)
- El contenido es `flex-1 overflow-y-auto min-h-0` (scrolleable)
- ✅ Resultado: Todo el contenido entra en la pantalla sin scroll en el body

### 3. Accesibilidad (a11y)

- Skip link visible al hacer focus (teclado)
- ARIA id `#main-content` para navegación
- WCAG 2.1 AAA compliance
- Focus ring visible: `ring-4 ring-green-300`

### 4. Mobile-First

- Breakpoints: 320px → 640px → 1024px → 1280px+
- Header apila verticalmente en móvil
- Actions del header se alinean horizontalmente en tablet+

---

## 🔄 Migración de Módulos Existentes

### Antes (código repetitivo):

```jsx
const MiModulo = () => {
  return (
    <div className="flex-1 h-full min-h-0 bg-gray-50 p-3 sm:p-4 lg:p-6 w-full flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only...">
        Saltar al contenido principal
      </a>
      <div
        className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0"
        id="main-content"
      >
        <div className="shrink-0">
          <PageHeader title="Mi Módulo" description="Descripción" />
        </div>
        <div className="flex-1 overflow-y-auto min-h-0">{/* contenido */}</div>
      </div>
    </div>
  );
};
```

### Después (con AdminLayout):

```jsx
import { AdminLayout } from "@features/admin/components/shared";

const MiModulo = () => {
  return (
    <AdminLayout title="Mi Módulo" description="Descripción">
      {/* contenido */}
    </AdminLayout>
  );
};
```

**Resultado**: ✅ ~50 líneas menos por módulo, mismo resultado visual

---

## 📋 Módulos Refactorizados

Los siguientes módulos ya usan `AdminLayout`:

- ✅ `AdminReportes` - Reportes y estadísticas
- ✅ `AdminMenu` - Dashboard principal
- ✅ `AdminProductos` - Gestión de productos
- ✅ `AdminClientes` - Gestión de clientes

### Módulos pendientes de migración:

- ⏳ `AdminCupones` - Gestión de cupones
- ⏳ `AdminEmpleados` - Gestión de empleados
- ⏳ `AdminVentasO` - Ventas online
- ⏳ `AdminVentasE` - Ventas empleados
- ⏳ `AdminCampanas` - Campañas
- ⏳ `AdminOfertas` - Ofertas
- ⏳ `AdminMedicos` - Gestión de médicos
- ⏳ `AdminAuditoria` - Auditoría

---

## 🛠️ Mantenimiento

### Para cambiar el padding global:

Edita: `frontend/src/features/admin/components/shared/AdminLayout.jsx`

```jsx
<div className="flex-1 h-full min-h-0 bg-gray-50 p-3 sm:p-4 lg:p-6 w-full flex flex-col">
//                                                    ↑ Aquí cambiar padding
```

### Para cambiar el max-width:

```jsx
<div className="w-full max-w-7xl mx-auto flex-1 flex flex-col min-h-0">
//                      ↑ Aquí cambiar max-width
```

### Para cambiar el color de fondo:

```jsx
<div className="flex-1 h-full min-h-0 bg-gray-50 p-3 sm:p-4 lg:p-6 w-full flex flex-col">
//                                    ↑ Aquí cambiar bg-color
```

---

## 💡 Buenas Prácticas

### ✅ DO (Hacer):

```jsx
// Usar AdminLayout para todos los módulos admin
<AdminLayout title="Título" description="Descripción">
  <MiContenido />
</AdminLayout>

// Agregar spacing dentro del contenido con contentClassName
<AdminLayout contentClassName="space-y-4">
  <Seccion1 />
  <Seccion2 />
</AdminLayout>

// Usar shrink-0 para elementos fijos (filtros, paginación)
<AdminLayout title="Productos">
  <div className="shrink-0">Filtros</div>
  <div className="flex-1 overflow-y-auto">Lista</div>
  <div className="shrink-0">Paginación</div>
</AdminLayout>
```

### ❌ DON'T (Evitar):

```jsx
// ❌ No duplicar el layout manualmente
<div className="flex-1 h-full min-h-0 bg-gray-50...">
  {/* usar AdminLayout en su lugar */}
</div>

// ❌ No agregar overflow-hidden al contenedor principal
<AdminLayout>
  <div className="overflow-hidden"> {/* ❌ Rompe el scroll */}
    ...
  </div>
</AdminLayout>

// ❌ No usar h-screen dentro de AdminLayout
<AdminLayout title="Título">
  <div className="h-screen"> {/* ❌ Expande el contenido */}
    ...
  </div>
</AdminLayout>
```

---

## 🐛 Troubleshooting

### Problema: El contenido no scrollea

**Causa**: Falta `flex-1 overflow-y-auto min-h-0` en el contenedor de tu contenido

**Solución**:

```jsx
<AdminLayout title="Título">
  <div className="flex-1 overflow-y-auto min-h-0">
    {/* tu contenido largo */}
  </div>
</AdminLayout>
```

### Problema: El layout se expande más allá de la pantalla

**Causa**: Usas clases como `h-screen` o `min-h-screen` dentro del AdminLayout

**Solución**: Remover esas clases, AdminLayout ya maneja el viewport

### Problema: Los filtros o paginación se scrollean

**Causa**: No usas `shrink-0` en elementos fijos

**Solución**:

```jsx
<AdminLayout title="Título">
  <div className="shrink-0">Filtros fijos</div>
  <div className="flex-1 overflow-y-auto min-h-0">Contenido scrolleable</div>
  <div className="shrink-0">Paginación fija</div>
</AdminLayout>
```

---

## 📚 Recursos

- **Archivo**: `frontend/src/features/admin/components/shared/AdminLayout.jsx`
- **Export**: `frontend/src/features/admin/components/shared/index.js`
- **Ejemplos**: Ver módulos `AdminReportes`, `AdminMenu`, `AdminProductos`, `AdminClientes`
- **Documentación Layout Pattern**: Ver comentarios en AdminLayout.jsx

---

## 🎉 Conclusión

`AdminLayout` centraliza toda la lógica de layout, padding, margins, accesibilidad y estructura para módulos admin. Úsalo en todos los módulos nuevos y migra los módulos existentes para mantener consistencia en toda la aplicación.

**Ahorro estimado**: ~50 líneas de código por módulo × 12 módulos = **600 líneas menos** ✅
