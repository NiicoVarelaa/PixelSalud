# 💊 Pixel Salud - Sistema de Gestión para Farmacias

Pixel Salud es una aplicación web moderna diseñada para la gestión de farmacias. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos, clientes y ventas de forma sencilla y eficiente. 

Este proyecto utiliza tecnologías actuales del stack moderno como **React**, **Tailwind CSS**, **Zustand** para el manejo de estado y **MySQL** como base de datos.

---

## 🚀 Tecnologías Utilizadas

- **React** – Biblioteca principal para la construcción de la interfaz.
- **Tailwind CSS** – Utilidad para estilos rápidos y responsivos.
- **Zustand** – Librería ligera para el manejo global del estado.
- **Node.js Express** – Para la API RESTful.
- **MySQL** – Base de datos relacional para almacenamiento persistente.

---

## 📦 Funcionalidades

- 📦 CRUD de productos.
- 👥 CRUD de clientes.
- 🧾 Gestión de ventas y facturación.
- 🔍 Búsqueda y filtrado de productos.
- 📈 Dashboard resumido de actividad.
- 🔒 Control de acceso.

---

## 🛠️ Instalación y Configuración

### 1. Clona el repositorio
```bash
git clone https://github.com/tuusuario/pixel-salud.git
cd pixel-salud
```

### 2. Instala las dependencias
```bash
npm install
```

### 3. Configura el entorno

Crea un archivo `.env` en la raíz del proyecto y define tus variables de entorno:

```env
VITE_API_URL=http://localhost:3001/api
```

Para la base de datos MySQL:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=pixelsalud
```

### 4. Inicializa la base de datos

Importa el archivo SQL (si tienes uno) a tu servidor MySQL o ejecuta los scripts necesarios para crear las tablas.

### 5. Ejecuta el servidor (si tienes backend)
```bash
cd backend
npm install
npm run dev
```

### 6. Levanta el frontend
```bash
npm run dev
```

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Puedes hacer un fork del proyecto, crear una nueva rama con tus cambios y hacer un pull request.

---

## 📬 Contacto

Para más información o soporte, contáctanos a:

📧 contacto@pixelsalud.com  
🌐 [www.pixelsalud.com](https://www.pixelsalud.com)
