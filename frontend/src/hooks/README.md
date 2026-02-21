# 🪝 Hooks

Custom hooks **reutilizables** para lógica de React.

## Ejemplos de hooks que deberían estar aquí:

```javascript
// useAuth.js
export const useAuth = () => {
  // Lógica de autenticación
  const { user } = useAuthStore();
  const login = (credentials) => { ... };
  const logout = () => { ... };
  return { user, login, logout };
};

// useCart.js
export const useCart = () => {
  // Lógica del carrito
  const { items, total } = useCartStore();
  const addItem = (product) => { ... };
  return { items, total, addItem };
};

// useToast.js
export const useToast = () => {
  // Notificaciones toast
  const show = (message, type) => { ... };
  return { show };
};

// useProducts.js
export const useProducts = () => {
  // Manejo de productos
  const { data, loading } = useQuery(...);
  return { products: data, loading };
};
```

## Principios:

- ✅ **Encapsula lógica reutilizable** de React
- ✅ **Separa UI de lógica** → componentes más limpios
- ✅ **DRY** → No repetir código en múltiples componentes
- ✅ **Testeable** → Hooks pueden testearse por separado
