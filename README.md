# BloodLink - Plataforma de Donación de Sangre

Una plataforma moderna, rápida y emocional para conectar donantes de sangre voluntarios con quienes más los necesitan. Creada con React (Vite) en el frontend y Node/Express en el backend.

## 🚀 Tecnologías

- **Frontend**: React, Vite, React Router, Lucide Icons, Vanilla CSS (Variables, Theme).
- **Backend**: Node.js, Express, Cors.
- **Base de Datos**: PostgreSQL (Schema proporcionado).

## 🛠️ Cómo Correr el Proyecto (Localmente)

### 1. Iniciar el Frontend (React + Vite)
Desde la carpeta raíz del proyecto:
```bash
cd frontend
npm install
npm run dev
```
La aplicación web estará disponible en `http://localhost:5173`. Las rutas disponibles para probar el MVP son:
- `/` - Landing Page
- `/login` - Iniciar Sesión (Mock Auth)
- `/dashboard` - Panel principal de Donante
- `/requests` - Explorar solicitudes activas de sangre
- `/admin` - Panel de control para centros de salud

### 2. Iniciar el Backend API (Node + Express)
En una nueva terminal, desde la carpeta raíz del proyecto:
```bash
cd backend
npm install
node server.js
```
El servidor backend mock (API) correrá en `http://localhost:5000`. Incluye los siguientes endpoints mockeados:
- `GET /api/requests`
- `POST /api/requests`
- `GET /api/donors`
- `PATCH /api/donors/:id/availability`
- `GET /api/stats`

### 3. Base de Datos
El diseño completo de base de datos se encuentra especificado en `backend/schema.sql`. Puedes ejecutar esto en cualquier entorno de PostgreSQL para inicializar las tablas necesarias (`users`, `blood_requests`, `donations`, `notifications`).

## 🎨 Diseño UI/UX
La plataforma aplica microinteracciones, glassmorphism con blur, sombras suaves y una paleta de colores limpia (Blanco, Gris Claro y Rojo Suave "#FF5252") enfocada al ecosistema de Startups modernas.

Dispone de _Modo Oscuro_ habilitado por defecto a nivel de sistema, el cual ajusta inmediatamente todas las páginas y componentes del MVP a tonos elegantes y legibles.
