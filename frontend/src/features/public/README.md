# Public Feature

Feature que agrupa todas las páginas públicas accesibles sin autenticación.

## Estructura

```
public/
├── components/        # Componentes específicos de páginas públicas
├── pages/            # Páginas públicas
│   ├── Inicio.jsx
│   ├── Productos.jsx
│   ├── Producto.jsx
│   ├── SobreNosotros.jsx
│   ├── Contacto.jsx
│   ├── Sucursales.jsx
│   ├── PreguntasFrecuentes.jsx
│   ├── TerminosCondiciones.jsx
│   ├── LegalesPromocion.jsx
│   └── index.js
└── index.js          # Barrel export principal
```

## Uso

```jsx
// Importar páginas públicas
import {
  InicioPage,
  ProductosPage,
  ContactoPage,
} from "@features/public/pages";
```

## Páginas

- **Inicio**: Landing page principal
- **Productos**: Catálogo de productos
- **Producto**: Detalle de producto individual
- **SobreNosotros**: Información de la empresa
- **Contacto**: Formulario de contacto
- **Sucursales**: Ubicaciones de sucursales
- **PreguntasFrecuentes**: FAQ
- **TerminosCondiciones**: Términos legales
- **LegalesPromocion**: Información legal de promociones
