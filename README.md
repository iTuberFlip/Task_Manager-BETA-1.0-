# TASK MANAGER

![GitHub repo size](https://img.shields.io/github/repo-size/tu-usuario/task-app-saas)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.x-blueviolet)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

Aplicación web tipo SaaS para gestionar tareas personales, con funcionalidades de **login multiusuario**, **crear, tachar, eliminar tareas**, **Drag & Drop**, y **actualización en tiempo real** con Socket.IO.

---

## 🚀 Funcionalidades

* Registro y login de usuarios con **autenticación JWT**.
* Crear tareas y verlas en tiempo real.
* Marcar tareas como completadas (tachado visual).*TACHADO NO FUNCIONA CORRECTAMENTE*
* Eliminar tareas.
* **Drag & Drop** para reorganizar tareas. *TODAVIA NO FUNCIONA CORRECTEMENTE*
* Actualización de tareas en tiempo real entre múltiples clientes.
* Separación de **login/registro** y la **app de tareas**.
* Frontend con paleta azul y CSS.
* Base de datos **PostgreSQL** con Prisma ORM.

---

## 🛠 Stack Tecnológico

**Frontend:**

* HTML5 + CSS3
* JavaScript (ES6+)
* Socket.IO-client
* Sortable.js para drag & drop

**Backend:**

* Node.js + Express
* Prisma ORM
* PostgreSQL
* Socket.IO
* Bcrypt para encriptar contraseñas
* JSON Web Token (JWT) para autenticación

---

## 📁 Estructura del Proyecto

```
backend/
│
├─ src/
│  ├─ controllers/
│  │  ├─ authController.js
│  │  └─ taskController.js
│  ├─ routes/
│  │  ├─ authRoutes.js
│  │  └─ taskRoutes.js
│  ├─ db/
│  │  └─ prisma.js
│  ├─ sockets/
│  │  └─ taskSocket.js
│  └─ server.js
│
├─ prisma/
│  └─ schema.prisma
│
frontend/
│  ├─ index.html
│  ├─ app.js
│  └─ style.css
│
.env
docker-compose.yml
README.md
```

---

## ⚡ Instalación

1. Clonar repositorio:

```bash
git clone https://github.com/tu-usuario/task-app-saas.git
cd task-app-saas/backend
```

2. Instalar dependencias backend:

```bash
npm install
```

3. Configurar variables de entorno en `.env`:

```env
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/taskapp
JWT_SECRET=tu_clave_secreta
```

4. Inicializar base de datos con Prisma:

```bash
npx prisma migrate dev --name init
```

5. Instalar dependencias frontend:

```bash
cd ../frontend
npm install
```

---

## 🏃‍♂️ Ejecución

1. Backend:

```bash
cd backend
npm start
```

2. Frontend:

* Abrir `index.html` en el navegador, o servirlo desde Node/Express según tu configuración.

3. Acceder a la aplicación:

```
http://localhost:3000
```

---

## 🔑 Uso

1. **Registro:** Crear un usuario con email y contraseña.
2. **Login:** Acceder con el email y contraseña registrados.
3. **Crear tareas:** Escribir el título y dar clic en "Add".
4. **Marcar como completada:** Seleccionar checkbox, se tachará.
5. **Eliminar tarea:** Clic en el botón 🗑.
6. **Drag & Drop:** Arrastrar tareas para reordenarlas.
7. **Tiempo real:** Las tareas se actualizan en todos los clientes conectados automáticamente.

---

## 🧩 Notas importantes

* Asegúrate de tener PostgreSQL corriendo y la URL correcta en `.env`.
* Prisma requiere que uses **BigInt o UUID** para IDs si vas a manejar muchos registros.
* Los tokens JWT se guardan en `localStorage` para autenticación en el frontend.

---

## 📦 Docker (opcional)

Si quieres usar Docker:

```bash
docker-compose up --build
```

Esto levantará:

* Servicio backend Node.js
* Base de datos PostgreSQL
* Configuración de redes internas

---

## 🔧 Contribuciones

Pull requests bienvenidos. Por favor abre un issue antes de cambios grandes.

---

## 📄 Licencia

MIT License
