# Pixel Salud

Sistema web para gestion de farmacia con dos aplicaciones separadas:

- `backend/`: API REST con Node.js + Express + MySQL.
- `frontend/`: SPA con React + Vite + Tailwind.

## Que incluye el proyecto

- Arquitectura backend en 4 capas: Routes -> Controllers -> Services -> Repositories.
- Autenticacion JWT con roles y permisos.
- E-commerce con carrito, cupones, campanas y pagos con Mercado Pago.
- Modulos administrativos (ventas, reportes, auditoria, dashboard).
- Frontend modular por features.

## Stack tecnico

- Frontend: React, Vite, Zustand, Tailwind CSS, React Hook Form, Zod.
- Backend: Node.js, Express, MySQL, Zod, JWT, Nodemailer, Mercado Pago SDK.
- Infra complementaria: Cloudinary (imagenes), exportes Excel.

## Estructura del workspace

```txt
backend/
frontend/
```

## Requisitos

- Node.js 18+ recomendado
- npm 9+
- MySQL 8+

## Instalacion local

### 1) Clonar e instalar dependencias

```bash
git clone <tu-repo>
cd Pixel Salud

cd backend
npm install

cd ../frontend
npm install
```

### 2) Configurar variables de entorno

Backend:

```bash
cd backend
cp .env.example .env
```

Frontend:

```bash
cd frontend
cp .env.example .env
```

Completa ambos archivos `.env` segun tu entorno.

### 3) Base de datos

Importa el SQL disponible en:

- `backend/database/PIXEL_SALUD_ACTUALIZADO_2026.sql`

### 4) Ejecutar en desarrollo

Backend (terminal 1):

```bash
cd backend
npm run dev
```

Frontend (terminal 2):

```bash
cd frontend
npm run dev
```

## Scripts utiles

Backend:

- `npm run dev`: servidor con nodemon
- `npm start`: servidor en modo produccion
- `npm run verify-exports`: valida exports centralizados

Frontend:

- `npm run dev`: servidor de desarrollo
- `npm run lint`: analisis estatico
- `npm run build`: build de produccion
- `npm run preview`: preview local del build

## Documentacion por modulo

Backend:

- `backend/README.md`
- `backend/docs/TRANSACCIONES.md`
- `backend/docs/RATE_LIMITING.md`
- `backend/docs/CORS_CONFIGURATION.md`
- `backend/docs/AUDITORIA.md`
- `backend/docs/INTEGRACION_AUDITORIA.md`

Frontend:

- `frontend/README.md`

## Estado actual para portfolio

- Frontend con lint pasando.
- Backend con `verify-exports` pasando.
- Variables sensibles fuera de control de versiones (usar siempre `.env`).

## Nota

El backend actualmente no tiene suite de tests automatizados configurada por defecto.
