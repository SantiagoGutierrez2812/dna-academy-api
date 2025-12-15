# DNA Academy API

Sistema de gestión académica para instituciones educativas. API REST desarrollada como prueba técnica para DNA Music.

## Descripción del Proyecto

DNA Academy es una plataforma de gestión académica que permite administrar estudiantes, materias, profesionales (profesores) y calificaciones. El sistema implementa autenticación con doble factor (OTP), manejo de roles y permisos, y refresh tokens para sesiones seguras.

### Características Principales

- Autenticación con OTP (código de verificación)
- Manejo de sesiones con Access Token y Refresh Token
- Control de acceso basado en roles (RBAC)
- CRUD completo para usuarios, estudiantes, materias y notas
- Integración con API externa para países (RestCountries)
- Soft delete para mantener integridad de datos

## Arquitectura

El proyecto sigue una arquitectura en capas:

```
src/
├── configs/          # Configuraciones (auth, app, database)
├── controllers/      # Controladores - manejan requests/responses
│   ├── academic/     # Controladores académicos (students, subjects, grades)
│   └── auth/         # Controlador de autenticación
├── docs/             # Documentación - Documentación de los endpoints con Swagger
├── dtos/             # Data Transfer Objects - validación de datos
├── errors/           # Clases de errores personalizados
├── middlewares/      # Middlewares (auth, roles, validators, errorHandler)
│   └── validators/   # Validadores con express-validator
├── repositories/     # Capa de acceso a datos (Prisma)
│   ├── academic/     # Repositorios académicos
│   └── auth/         # Repositorios de autenticación
├── routes/           # Definición de rutas
│   └── academic/     # Rutas académicas
├── services/         # Lógica de negocio
│   └── academic/     # Servicios académicos
├── types/            # Tipos e interfaces TypeScript
├── utils/            # Utilidades (jwt, password, prisma-errors)
├── app.ts            # Configuración de Express
├── server.ts         # Inicialización del servidor
└── index.ts          # Punto de entrada
```

### Patrón de Diseño

- **Repository Pattern**: Abstrae el acceso a datos
- **Service Layer**: Contiene la lógica de negocio
- **Controller Layer**: Maneja HTTP requests/responses
- **DTO Pattern**: Valida y transforma datos de entrada

## Tecnologías Utilizadas

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | 18+ | Runtime de JavaScript |
| Express | 5.x | Framework web |
| TypeScript | 5.9 | Superset tipado de JavaScript |
| Prisma | 6.19 | ORM para base de datos |
| PostgreSQL | 15+ | Base de datos relacional |
| JWT | - | Autenticación con tokens |
| bcrypt | 6.x | Hash de contraseñas |
| express-validator | 7.x | Validación de datos |
| Swagger | 5.x | Documentación de API |

## Pasos de Instalación

### Prerrequisitos

- Node.js 18 o superior
- PostgreSQL 15 o superior (o cuenta en Supabase)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/SantiagoGutierrez2812/dna-academy-api.git
cd dna-academy-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con los valores reales
```

4. **Ejecutar migraciones de Prisma**
```bash
npx prisma migrate dev
```

5. **Ejecutar seed (datos iniciales) para traer todos los países de la API externa y guardarlos en la BD**
```bash
npx prisma db seed
```

6. **Iniciar el servidor**
```bash
npm run dev
```

## Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@host:5432/dna_academy"

# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Seguridad
SALT_ROUNDS_PASSWORD=10

# Autenticación
LOGIN_LOCKOUT_MINUTES=15
OTP_EXPIRATION_MINUTES=15
AUTH_MAX_ATTEMPTS=5

# JWT
JWT_ACCESS_SECRET=tu_access_secret_seguro
JWT_ACCESS_EXP_MINUTES=15
JWT_REFRESH_SECRET=tu_refresh_secret_seguro
JWT_REFRESH_EXP_DAYS=7
```

### Descripción de Variables

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | - |
| `PORT` | Puerto del servidor | 3000 |
| `NODE_ENV` | Entorno de ejecución | development |
| `FRONTEND_URL` | URL del frontend (CORS) | http://localhost:5173 |
| `SALT_ROUNDS_PASSWORD` | Rondas de hash bcrypt | 10 |
| `LOGIN_LOCKOUT_MINUTES` | Minutos de bloqueo por intentos fallidos | 15 |
| `OTP_EXPIRATION_MINUTES` | Minutos de validez del OTP | 15 |
| `AUTH_MAX_ATTEMPTS` | Intentos máximos de login | 5 |
| `JWT_ACCESS_SECRET` | Secreto para access token | - |
| `JWT_ACCESS_EXP_MINUTES` | Expiración access token (minutos) | 15 |
| `JWT_REFRESH_SECRET` | Secreto para refresh token | - |
| `JWT_REFRESH_EXP_DAYS` | Expiración refresh token (días) | 7 |

## Modo de Ejecución

### Desarrollo
```bash
npm run dev
```
Inicia el servidor con hot-reload usando nodemon.

### Producción
```bash
npm run build
npm start
```
Compila TypeScript y ejecuta el código compilado.

### Comandos Prisma
```bash
# Generar cliente Prisma
npx prisma generate

# Crear migración
npx prisma migrate dev --name nombre_migracion

# Ejecutar seed
npx prisma db seed

# Abrir Prisma Studio
npx prisma studio
```

## Usuarios de Prueba

Se crearon los siguientes usuarios para pruebas:

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@gmail.com | Pa55w.rd | ADMINISTRATOR |
| coordinador@gmail.com | Pa55w.rd | COORDINATOR |
| profesor1@gmail.com | Pa55w.rd | PROFESSIONAL |
| profesor2@gmail.com | Pa55w.rd | PROFESSIONAL |
| profesor3@gmail.com | Pa55w.rd | PROFESSIONAL |

### Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **ADMINISTRATOR** | Acceso total al sistema |
| **COORDINATOR** | Gestión de usuarios, estudiantes, materias y notas |
| **PROFESSIONAL** | Ver sus materias asignadas y gestionar notas de sus estudiantes |

## Estructura del Repositorio

```
dna-academy-api/
├── prisma/
│   ├── schema/              # Modelos de Prisma separados
│   │   ├── academic/        # Modelos académicos
│   │   │   ├── student.prisma
│   │   │   ├── subject.prisma
│   │   │   ├── student-subject.prisma
│   │   │   └── grade.prisma
│   │   ├── auth/            # Modelos de autenticación
│   │   │   ├── otp.prisma
│   │   │   ├── refresh-token.prisma
│   │   │   └── login-attempts.prisma
│   │   ├── user.prisma
│   │   ├── country.prisma
│   │   └── schema.prisma    # Schema principal
│   ├── migrations/          # Migraciones de BD
│   └── seed.ts              # Datos iniciales
├── src/
│   ├── configs/
│   ├── controllers/
│   ├── docs/
│   ├── dtos/
│   ├── errors/
│   ├── middlewares/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── app.ts
│   ├── server.ts
│   └── index.ts
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## Documentación de la API

La documentación completa de la API está disponible en Swagger:

```
http://localhost:3000/api/docs
```

### Endpoints Principales

#### Autenticación (`/api/auth`)
- `POST /login` - Iniciar proceso de login (envía OTP)
- `POST /verify-otp-login` - Verificar OTP y completar login
- `POST /register` - Registrar nuevo profesional
- `POST /refresh` - Renovar access token
- `POST /logout` - Cerrar sesión
- `GET /me` - Obtener usuario autenticado

#### Usuarios (`/api/users`)
- `GET /` - Listar usuarios
- `GET /:id` - Obtener usuario
- `POST /` - Crear usuario
- `PATCH /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario

#### Estudiantes (`/api/students`)
- `GET /` - Listar estudiantes (soporta `?search=`)
- `GET /:id` - Obtener estudiante
- `POST /` - Crear estudiante
- `PATCH /:id` - Actualizar estudiante
- `DELETE /:id` - Eliminar estudiante
- `POST /:id/subjects` - Matricular en materia
- `DELETE /:id/subjects/:subjectId` - Desmatricular

#### Materias (`/api/subjects`)
- `GET /` - Listar materias
- `GET /my-subjects` - Mis materias (profesional)
- `GET /:id` - Obtener materia
- `POST /` - Crear materia
- `PATCH /:id` - Actualizar materia
- `DELETE /:id` - Eliminar materia
- `GET /:id/students` - Estudiantes de la materia
- `GET /:id/students/:studentId/grades` - Notas del estudiante

#### Notas (`/api/grades`)
- `POST /` - Crear nota
- `PATCH /:id` - Actualizar nota
- `DELETE /:id` - Eliminar nota

#### Países (`/api/countries`)
- `GET /` - Listar países (API externa)

## Licencia

Este proyecto fue desarrollado como prueba técnica para DNA Music.
