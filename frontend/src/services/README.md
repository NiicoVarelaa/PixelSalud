# 🌐 Services

Capa de **comunicación con el backend** (API calls).

## Estructura recomendada:

```javascript
// authService.js
export const authService = {
  login: async (credentials) => {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/registro", userData);
    return response.data;
  },

  logout: async () => {
    return api.post("/logout");
  },
};

// productService.js
export const productService = {
  getAll: async (filters) => {
    const response = await api.get("/productos", { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  create: async (productData) => {
    return api.post("/productos", productData);
  },
};

// cartService.js
export const cartService = {
  getCart: async (userId) => {
    return api.get(`/carrito/${userId}`);
  },

  addItem: async (userId, productId, quantity) => {
    return api.post("/carrito/agregar", { userId, productId, quantity });
  },

  removeItem: async (userId, productId) => {
    return api.delete(`/carrito/${userId}/${productId}`);
  },
};
```

## Principios:

- ✅ **Centraliza llamadas API** → Un solo lugar por endpoint
- ✅ **Abstrae axios/fetch** → Fácil cambiar implementación
- ✅ **Testeable** → Mockear servicios es simple
- ✅ **Reutilizable** → Múltiples componentes usan el mismo servicio
- ❌ **NO mezclar con lógica de UI** → Solo comunicación HTTP
