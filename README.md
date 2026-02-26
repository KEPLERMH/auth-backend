# 🔐 Auth User Backend API

Backend de aplicación de autenticación construido con **Node.js + Express + PostgreSQL**.

Este servicio maneja:

- Registro de usuarios
- Login con JWT
- Autenticación mediante cookies httpOnly
- Protección de rutas con middleware
- Conexión a base de datos PostgreSQL en la nube (Neon)

---

## 🚀 Tecnologías

- Node.js
- Express
- PostgreSQL
- pg (node-postgres)
- JWT (jsonwebtoken)
- bcrypt
- CORS
- cookie-parser
- dotenv

---

## 🌍 Arquitectura en Producción

```id="arch001"
Frontend (Vercel)
        ↓
Backend API (Render)
        ↓
Database (Neon - PostgreSQL)
```

- 🔹 Backend deployado en **Render**
- 🔹 Base de datos PostgreSQL alojada en **Neon**
- 🔹 Autenticación basada en JWT almacenado en cookies seguras

---

## 📁 Estructura del Proyecto

```id="struct001"
src/
 ├── controllers/
 ├── middleware/
 ├── routes/
 ├── config
 |       |
 |       db.js
 ├── server.js
```

---

## ⚙️ Variables de Entorno

En desarrollo crear un archivo `.env`:

```env id="env001"
PORT=5000
DATABASE_URL=postgresql://usuario:password@localhost:5432/pern_auth
JWT_SECRET=tu_clave_secreta
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

En producción (Render):

```env id="env002"
DATABASE_URL=postgresql://user:password@ep-xxxx.neon.tech/dbname?sslmode=require
JWT_SECRET=clave_super_segura
CLIENT_URL=https://tu-frontend.vercel.app
NODE_ENV=production
```

---

## 🗄 Base de Datos

Base de datos: **PostgreSQL**

Hosting: **Neon (Serverless Postgres)**

Tabla principal:

```sql id="sql001"
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Autenticación

El sistema utiliza:

- JWT firmados con `JWT_SECRET`
- Cookies httpOnly
- Middleware de protección (`protect`)
- Endpoint `/api/auth/me` para reconstrucción de sesión

### Configuración de cookie en producción:

```js id="cookie001"
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 30 * 24 * 60 * 60 * 1000,
};
```

### Configuración en desarrollo:

```js id="cookie002"
const cookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
};
```

---

## 🔐 Middleware de Protección

Las rutas protegidas utilizan un middleware que:

1. Lee el token desde `req.cookies`
2. Verifica el JWT
3. Consulta el usuario en la base de datos
4. Adjunta `req.user`
5. Permite continuar con `next()`

---

## 🌐 Endpoints Principales

```id="endpoints001"
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
POST   /api/auth/logout
```

---

## ▶️ Ejecutar en Desarrollo

```bash id="run001"
npm install
npm run dev
```

Servidor disponible en:

```id="run002"
http://localhost:5000
```

---

## 🛡 Seguridad Implementada

- Passwords hasheados con bcrypt
- JWT firmados y verificados
- Cookies httpOnly
- Protección contra acceso cross-site indebido mediante SameSite
- CORS configurado con `credentials: true`

---

## 📦 Deploy

Backend desplegado en **Render**
Base de datos en **Neon**

Se requiere:

- `NODE_ENV=production`
- `DATABASE_URL` con SSL
- `sameSite: "none"` y `secure: true` para cookies

---

## 🎯 Estado del Proyecto

API lista para producción con:

- Autenticación persistente
- Conexión segura a base de datos en la nube
- Arquitectura modular
- Separación clara de responsabilidades

Proyecto desarrollado con fines educativos y de práctica fullstack.
