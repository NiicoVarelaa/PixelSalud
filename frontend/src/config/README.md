# ⚙️ Config

Archivos de **configuración global** de la aplicación.

## Archivos recomendados:

### `api.js` - Configuración de Axios

```javascript
import axios from "axios";

// Instancia de axios configurada
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token a todas las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir a login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

### `constants.js` - Constantes globales

```javascript
export const ROLES = {
  ADMIN: "admin",
  CLIENTE: "cliente",
  MEDICO: "medico",
  EMPLEADO: "empleado",
};

export const PAYMENT_METHODS = {
  EFECTIVO: "efectivo",
  TARJETA: "tarjeta",
  TRANSFERENCIA: "transferencia",
};

export const ORDER_STATUS = {
  PENDIENTE: "pendiente",
  PAGADO: "pagado",
  CANCELADO: "cancelado",
  RETIRADO: "retirado",
};

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/productos",
  CART: "/carrito",
  CHECKOUT: "/checkout",
  ADMIN: "/admin",
  MEDICO: "/medico",
  EMPLEADO: "/empleado",
};
```

### `routes.js` - Configuración de rutas

```javascript
import { lazy } from "react";

export const publicRoutes = [
  { path: "/", component: lazy(() => import("@/pages/HomePage")) },
  { path: "/productos", component: lazy(() => import("@/pages/ProductsPage")) },
];

export const customerRoutes = [
  {
    path: "/perfil",
    component: lazy(() => import("@/features/customer/pages/ProfilePage")),
  },
];

export const adminRoutes = [
  {
    path: "/admin",
    component: lazy(() => import("@/features/admin/pages/AdminDashboard")),
  },
];
```

## Principios:

- ✅ **Configuración centralizada** → Variables en un solo lugar
- ✅ **Fácil de mantener** → Cambios globales rápidos
- ✅ **Environment-aware** → Usa variables de entorno
