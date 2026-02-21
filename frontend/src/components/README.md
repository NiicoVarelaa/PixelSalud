# 🧩 Components (Atomic Design)

Componentes de UI **reutilizables** organizados según Atomic Design.

## Estructura:

### ⚛️ `atoms/`

**Elementos básicos indivisibles** (los más pequeños)

- Botones
- Inputs
- Iconos
- Loaders
- Badges

**Ejemplo:** `LoadingState.jsx`, `IconCard.jsx`

### 🧬 `molecules/`

**Combinaciones simples de atoms**

- Cards
- Breadcrumbs
- Navegación
- Botones compuestos

**Ejemplo:** `CardSkeleton.jsx`, `Breadcrumbs.jsx`

### 🦠 `organisms/`

**Componentes complejos** (combinan molecules + atoms)

- Header/Navbar
- Footer
- Banners
- Formularios complejos

**Ejemplo:** `Header.jsx`, `BannerCarrusel.jsx`, `Footer.jsx`

### 📄 `templates/`

**Layouts y wrappers generales**

- Layout principal
- Protected Routes
- Scroll handlers

**Ejemplo:** `Layout.jsx`, `ProtectedRoute.jsx`

## Principios:

- ✅ **Reutilización máxima** → Un componente usado en múltiples lugares
- ✅ **UI consistente** → Mismo estilo en toda la app
- ✅ **Testeable** → Componentes aislados fáciles de testear
- ❌ **NO incluir lógica de negocio** → Solo presentación
