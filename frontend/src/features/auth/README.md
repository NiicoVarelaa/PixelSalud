# Auth Feature

Feature de autenticación que maneja todo lo relacionado con login, registro y recuperación de contraseñas.

## Estructura

```
auth/
├── components/        # Componentes específicos de auth
│   ├── ModalLogin.jsx
│   └── index.js
├── pages/            # Páginas de autenticación
│   ├── Login.jsx
│   ├── Registro.jsx
│   ├── RecuperarContraseña.jsx
│   ├── RestablecerContrasena.jsx
│   └── index.js
├── hooks/            # Hooks personalizados (futuro)
└── index.js          # Barrel export principal
```

## Uso

```jsx
// Importar páginas
import { LoginPage, RegistroPage } from "@features/auth/pages";

// Importar componentes
import { ModalLogin } from "@features/auth/components";
```

## Páginas

- **Login**: Página de inicio de sesión
- **Registro**: Página de registro de nuevos usuarios
- **RecuperarContraseña**: Formulario para solicitar recuperación
- **RestablecerContrasena**: Formulario para cambiar contraseña con token

## Componentes

- **ModalLogin**: Modal de login reutilizable
