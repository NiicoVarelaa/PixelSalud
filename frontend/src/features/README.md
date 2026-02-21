# 📁 Features

Esta carpeta contiene los **módulos principales organizados por dominio/rol**.

## Estructura:

### 🛒 `customer/`

Todas las funcionalidades del **e-commerce público** (cliente final)

- Catálogo de productos
- Carrito de compras
- Checkout y pagos
- Recetas médicas
- Perfil de usuario

### 🔐 `admin/`

Panel de **administración interno**

- Gestión de productos
- Gestión de ventas
- Gestión de clientes
- Gestión de empleados
- Reportes y estadísticas
- Ofertas y cupones

### 💊 `medical/`

Panel para **médicos**

- Crear recetas
- Ver mis recetas
- Panel de control médico

### 👤 `employee/`

Panel para **empleados de farmacia**

- Realizar ventas presenciales
- Editar ventas
- Gestión de productos en tienda

### 🔑 `auth/`

Sistema de **autenticación**

- Login/Registro
- Recuperación de contraseña
- Gestión de sesiones

## Principios:

- ✅ Cada feature es **independiente** (puede eliminarse sin romper otras)
- ✅ Facilita **lazy loading** por módulo
- ✅ Permite **code splitting** eficiente
- ✅ Simplifica **permisos y roles**
