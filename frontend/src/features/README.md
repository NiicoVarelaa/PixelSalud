# 📁 Features

Esta carpeta contiene los **módulos principales organizados por dominio/rol** (feature-based architecture).

## 🏗️ Estructura Completa:

### 🔐 `admin/`

Panel de **administración interno**

- **Pages**: Administrador, AdminMensajes
- **Components**: Productos, Ofertas, Cupones, Clientes, Empleados, Ventas, Reportes, Auditoría
- **Layout**: NavbarAdmin, SiderbarAdmin

### 🔑 `auth/`

Sistema de **autenticación**

- **Pages**: Login, Registro, RecuperarContraseña, RestablecerContrasena
- **Components**: ModalLogin
- **Hooks**: (futuro) useAuth, useLogin

### 🛒 `customer/`

Funcionalidades del **e-commerce público** (cliente final)

- **Pages**: Perfil, PerfilDirecciones, PerfilFavoritos, MisCompras, Carrito, Checkout
- **Components**:
  - Cart: CardCompra, CardResumen, MainCarrito
  - Checkout: CheckoutForm, CheckoutSuccess
  - Products: CardProductos, ProductCarousel, ProductInfo
  - Profile: DashboardCliente, MenuClientes
  - Payment: Modales de pago
  - Prescription: Recetas médicas

### 👤 `employee/`

Panel para **empleados de farmacia**

- **Pages**: PanelEmpleados
- **Components**:
  - Sales: EmpleadoRealizarVenta, EmpleadoListaVentas, EmpleadoEditarVenta
  - Products: EmpleadosProductos
- **Layout**: NavbarEmpleado, SidebarEmpleado

### 💊 `medical/`

Panel para **médicos**

- **Pages**: PanelMedico
- **Components**: MedicoNuevaReceta, MedicoMisRecetas, VistaMenuMedico, PanelMedicos
- **Layout**: SidebarMedico

### 🌐 `public/`

**Páginas públicas** del sitio (sin autenticación)

- **Pages**: Inicio, Productos, Producto, SobreNosotros, Contacto, Sucursales, PreguntasFrecuentes, TerminosCondiciones, LegalesPromocion
- **Components**: (componentes públicos reutilizables)

## 📦 Convenciones de Uso

### Imports Correctos

```jsx
// ✅ Correcto - Import desde feature
import { LoginPage, RegistroPage } from "@features/auth/pages";
import { AdminMenu, AdminProductos } from "@features/admin";
import { CarritoPage, CheckoutPage } from "@features/customer";

// ❌ Evitar - Import directo
import LoginPage from "@features/auth/pages/Login";
```

### Estructura de Archivos

```
feature-name/
├── components/        # Componentes específicos del feature
│   ├── subfolder/    # Agrupados por funcionalidad
│   │   ├── Component.jsx
│   │   └── index.js  # Barrel export
├── pages/            # Páginas principales del feature
│   ├── Page.jsx
│   └── index.js      # Barrel export
├── hooks/            # Hooks personalizados (opcional)
├── layout/           # Layout específico (opcional)
├── index.js          # Barrel export principal
└── README.md         # Documentación (opcional)
```

## 🎯 Migración Completada

**Antes**: 24 archivos mezclados en `pages/`  
**Después**: 1 archivo en `pages/` (Error404.jsx - global)

**Redistribución**:

- ✅ 4 páginas → `auth/pages/`
- ✅ 9 páginas → `public/pages/`
- ✅ 6 páginas → `customer/pages/`
- ✅ 2 páginas → `admin/pages/`
- ✅ 1 página → `employee/pages/`
- ✅ 1 página → `medical/pages/`

## 💡 Beneficios

- **Escalabilidad**: Fácil agregar nuevos features
- **Mantenibilidad**: Código organizado por dominio
- **Colaboración**: Equipos trabajan en features independientes
- **Testing**: Tests aislados por feature

## Principios:

- ✅ Cada feature es **independiente** (puede eliminarse sin romper otras)
- ✅ Facilita **lazy loading** por módulo
- ✅ Permite **code splitting** eficiente
- ✅ Simplifica **permisos y roles**
