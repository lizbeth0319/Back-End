# Sistema de Gestión de Aprendices - Backend

## 📋 Descripción del Proyecto

Backend API desarrollado con **Node.js** y **Express** para un sistema integral de gestión de aprendices en una institución educativa. La aplicación permite la administración de usuarios (aprendices, instructores, enfermería y portería), autenticación segura, generación de documentos PDF y gestión de permisos.

## 🎯 Características Principales

- ✅ Autenticación y autorización con JWT
- ✅ Gestión de usuarios con diferentes roles
- ✅ Sistema completo de aprendices (crear, leer, actualizar, eliminar)
- ✅ Búsqueda avanzada de aprendices por múltiples criterios
- ✅ Gestión de permisos y autorizaciones
- ✅ Generación de documentos PDF
- ✅ Carga y almacenamiento de imágenes en Cloudinary
- ✅ Validación de datos con express-validator
- ✅ Manejo seguro de contraseñas con bcryptjs
- ✅ CORS habilitado para comunicación con frontend

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|----------|
| Node.js | 16+ | Runtime de JavaScript |
| Express | 5.1.0 | Framework web |
| Mongoose | 8.18.1 | ODM para MongoDB |
| MongoDB Atlas | - | Base de datos en la nube |
| JWT | 9.0.2 | Autenticación token-based |
| bcryptjs | 3.0.2 | Encriptación de contraseñas |
| Cloudinary | 2.7.0 | Almacenamiento de imágenes |
| PDFMake | 0.2.20 | Generación de PDFs |
| Nodemailer | 7.0.9 | Envío de correos |
| CORS | 2.8.5 | Control de solicitudes entre dominios |

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v16 o superior)
- **npm** (gestor de paquetes)
- **MongoDB Atlas** (cuenta y base de datos configurada)
- **Cloudinary** (cuenta para almacenamiento de imágenes)
- Variables de entorno configuradas

## 🚀 Instalación

### 1. Clonar o descargar el proyecto
```bash
git clone <url-del-repositorio>
cd Backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3000

# Base de datos MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<nombre-db>

# Cloudinary
CLOUDINARY_NAME=<tu-cloud-name>
CLOUDINARY_KEY=<tu-api-key>
CLOUDINARY_SECRET=<tu-api-secret>

# JWT
JWT_SECRET=<tu-clave-secreta-jwt>
JWT_EXPIRE=7d
```

### 4. Ejecutar el servidor

**Desarrollo:**
```bash
node app.js
```

**Con nodemon (recomendado para desarrollo):**
```bash
npx nodemon app.js
```

El servidor estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
Backend/
├── app.js                    # Archivo principal de la aplicación
├── package.json              # Dependencias del proyecto
├── README.md                 # Este archivo
│
├── config/                   # Configuraciones
│   ├── db-atlas.js          # Conexión MongoDB Atlas
│   ├── db-compass.js        # Conexión MongoDB Compass (local)
│   └── cloudinary.js        # Configuración de Cloudinary
│
├── controllers/              # Controladores (lógica de negocio)
│   ├── Authentication.js    # Autenticación y registro
│   ├── User.js              # Gestión de usuarios
│   ├── Aprendiz.js          # Gestión de aprendices
│   ├── Permiso.js           # Gestión de permisos
│   └── Estado.js            # Gestión de estados
│
├── models/                   # Esquemas MongoDB
│   ├── User.js              # Modelo de usuario
│   ├── Aprendiz.js          # Modelo de aprendiz
│   └── Permiso.js           # Modelo de permiso
│
├── routers/                  # Rutas de la API
│   ├── Authentication.js    # Rutas de autenticación
│   ├── User.js              # Rutas de usuarios
│   ├── Aprendiz.js          # Rutas de aprendices
│   ├── Permiso.js           # Rutas de permisos
│   └── Estado.js            # Rutas de estados
│
├── middleware/               # Middleware de Express
│   ├── generar-jwt.js       # Generación de tokens JWT
│   ├── validar-jwt.js       # Validación de tokens JWT
│   ├── validar-campo.js     # Validación de campos
│   └── validar-rol.js       # Validación de roles
│
├── helpers/                  # Funciones auxiliares
│   ├── Authentication.js    # Helpers de autenticación
│   ├── User.js              # Helpers de usuarios
│   ├── Permiso.js           # Helpers de permisos
│   ├── Aprendiz.js          # Helpers de aprendices
│   └── pdf-services/        # Generación de PDFs
│       ├── generate-pdf.js
│       ├── pdf-template.js
│       ├── styles.js
│       ├── fonts.js
│       └── get-base64.js
│
├── img-sign/                 # Imágenes de firmas almacenadas localmente
└── public/                   # Archivos estáticos
    └── index.html
```

## 🔐 Roles y Acceso

El sistema cuenta con los siguientes roles de usuario:

| Rol | Descripción |
|-----|-------------|
| **aprendiz** | Estudiante que puede ver sus documentos y permisos |
| **instructor** | Docente que gestiona aprendices y genera documentos |
| **enfermeria** | Personal de salud con acceso a registros de salud |
| **porteria** | Personal de entrada que valida accesos |

## 📡 Endpoints Principales

### 🔑 Autenticación

```
POST /api/register
- Crear nuevo usuario
- Body: { nombre, email, password, rol, imagen(opcional) }

POST /api/login
- Iniciar sesión
- Body: { email, password }
- Response: { usuario, token }
```

### 👥 Usuarios

```
GET /api/user/obtenerusuarios
- Obtener todos los usuarios (requiere JWT)

GET /api/user/obtenerusuario/:id
- Obtener usuario específico (requiere JWT)

PUT /api/user/actualizarusuario/:id
- Actualizar datos de usuario (requiere JWT)

DELETE /api/user/eliminarprograma/:id
- Eliminar usuario (requiere JWT)
```

### 🎓 Aprendices

```
POST /api/aprendiz/crearaprendiz
- Crear nuevo aprendiz (requiere JWT)
- Body: { nombre, ficha, programa, email, tipo_programa }

GET /api/aprendiz/obteneraprendices
- Obtener todos los aprendices (requiere JWT)

GET /api/aprendiz/obteneraprendiz/:nombre
- Buscar aprendiz por nombre (requiere JWT)

GET /api/aprendiz/aprendices/search?nombre=&ficha=&programa=
- Búsqueda avanzada de aprendices con múltiples filtros (requiere JWT)

PUT /api/aprendiz/actualizaraprendiz/:id
- Actualizar datos de aprendiz (requiere JWT)

DELETE /api/aprendiz/eliminarprograma/:id
- Eliminar aprendiz (requiere JWT)
```

### 🔒 Permisos

```
POST /api/permiso/crearPermiso
- Crear nuevo permiso (requiere JWT)

GET /api/permiso/obtenerpermisos
- Obtener todos los permisos (requiere JWT)

GET /api/permiso/obtenerpermiso/:id
- Obtener permiso específico (requiere JWT)

PUT /api/permiso/actualizarpermiso/:id
- Actualizar permiso (requiere JWT)

DELETE /api/permiso/eliminarpermiso/:id
- Eliminar permiso (requiere JWT)
```

## 🔍 Ejemplos de Uso

### Registrar un Usuario

```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "rol": "aprendiz"
  }'
```

### Iniciar Sesión

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

### Crear un Aprendiz (requiere token JWT)

```bash
curl -X POST http://localhost:3000/api/aprendiz/crearaprendiz \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token_jwt>" \
  -d '{
    "nombre": "Carlos",
    "ficha": "2458123",
    "programa": "Técnico en Salud",
    "email": "carlos@example.com",
    "tipo_programa": "Presencial"
  }'
```

### Buscar Aprendices con Filtros

```bash
curl -X GET "http://localhost:3000/api/aprendiz/aprendices/search?nombre=Carlos&ficha=2458123" \
  -H "Authorization: Bearer <tu_token_jwt>"
```

## 📝 Funciones Importantes

### obtenerAprendicesSearch()

Función ubicada en `/controllers/Aprendiz.js` que permite buscar aprendices con múltiples criterios de filtrado.

**Explicación de componentes:**

- **$or**: Operador lógico que devuelve documentos que cumplan **cualquiera** de las condiciones
- **{ campo: regex }**: Estructura para cada condición en la consulta
- **campo**: Nombre del campo en la base de datos (nombre, ficha, programa)
- **regex**: Expresión regular para búsqueda flexible en cadenas de texto
- **[...]**: Array de condiciones evaluadas con $or

**Ejemplo de consulta:**
```javascript
db.aprendices.find({
  $or: [
    { nombre: /Carlos/i },
    { ficha: /2458123/i },
    { programa: /Salud/i }
  ]
})
```

## 🔐 Seguridad

- ✅ Contraseñas encriptadas con bcryptjs
- ✅ Autenticación mediante JWT (JSON Web Tokens)
- ✅ Validación de campos en todas las rutas
- ✅ CORS configurado para controlar accesos
- ✅ Variables de entorno para datos sensibles
- ✅ Validación de roles para rutas protegidas

## 📦 Dependencias Principales

```json
{
  "express": "5.1.0",
  "mongoose": "8.18.1",
  "jsonwebtoken": "9.0.2",
  "bcryptjs": "3.0.2",
  "express-validator": "7.2.1",
  "cloudinary": "2.7.0",
  "pdfmake": "0.2.20",
  "nodemailer": "7.0.9",
  "cors": "2.8.5",
  "dotenv": "17.2.2"
}
```

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que la URI en `.env` sea correcta
- Asegúrate de estar conectado a internet
- Valida que tu IP esté en la lista blanca de MongoDB Atlas

### Error de autenticación JWT
- Verifica que el token sea válido y no haya expirado
- Revisa que la cabecera `Authorization` incluya `Bearer <token>`

### Errores de Cloudinary
- Verifica que las credenciales en `.env` sean correctas
- Asegúrate de que la imagen cumpla los requisitos de tamaño

## 👨‍💻 Desarrollo

### Estructura de archivos recomendada para agregar nuevas funcionalidades

1. **Crear el modelo** en `models/`
2. **Crear el controller** en `controllers/`
3. **Crear helpers** en `helpers/` si es necesario
4. **Crear las rutas** en `routers/`
5. **Agregar validaciones** con middleware

## 📞 Soporte

Para reportar problemas o sugerencias, contáctate con el equipo de desarrollo.

---

**Última actualización:** Diciembre 2025
**Versión:** 1.0.0