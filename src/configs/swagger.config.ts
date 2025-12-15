import type { SwaggerDefinition } from "swagger-jsdoc";

const swaggerDefinition: SwaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "DNA Academy API",
        version: "1.0.0",
        description: `
## Sistema de Gestión Académica

API REST para la gestión de estudiantes, materias, calificaciones y usuarios.

### Autenticación

La API utiliza autenticación basada en cookies con JWT:
- **Access Token**: Token de corta duración (15 min) para autenticar requests
- **Refresh Token**: Token de larga duración (7 días) para renovar el access token
- **OTP**: Código de verificación enviado al email durante el login

### Roles y Permisos

| Rol | Descripción |
|-----|-------------|
| ADMINISTRATOR | Acceso total al sistema |
| COORDINATOR | Gestión de usuarios, estudiantes, materias y notas |
| PROFESSIONAL | Gestión de notas en sus materias asignadas |

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 400 | Bad Request - Datos de entrada inválidos |
| 401 | Unauthorized - No autenticado o token expirado |
| 403 | Forbidden - Sin permisos para este recurso |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (ej: email duplicado) |
| 500 | Internal Server Error - Error del servidor |
        `,
        contact: {
            name: "DNA Academy",
            email: "soporte@dnaacademy.com"
        }
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Servidor de desarrollo"
        }
    ],
    tags: [
        { name: "Auth", description: "Autenticación y gestión de sesiones" },
        { name: "Users", description: "Gestión de usuarios del sistema" },
        { name: "Students", description: "Gestión de estudiantes" },
        { name: "Subjects", description: "Gestión de materias" },
        { name: "Grades", description: "Gestión de calificaciones" },
        { name: "Countries", description: "Consulta de países (API externa)" }
    ],
    paths: {
        // ==================== AUTH ====================
        "/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Iniciar proceso de login",
                description: "Envía las credenciales del usuario y genera un código OTP.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/PreLoginRequest" },
                            example: { email: "admin@gmail.com", password: "Pa55w.rd" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "OTP generado exitosamente",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Se ha enviado un código de verificación a tu email",
                                    data: { otp: "123456" }
                                }
                            }
                        }
                    },
                    "400": { description: "Credenciales inválidas" },
                    "403": { description: "Usuario bloqueado o inactivo" }
                }
            }
        },
        "/auth/verify-otp-login": {
            post: {
                tags: ["Auth"],
                summary: "Verificar OTP y completar login",
                description: "Verifica el código OTP y establece cookies de autenticación.",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/VerifyOtpRequest" },
                            example: { email: "admin@gmail.com", otp: "123456" }
                        }
                    }
                },
                responses: {
                    "200": {
                        description: "Login exitoso",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Login exitoso",
                                    data: {
                                        user: {
                                            id: 1,
                                            name: "Admin",
                                            email: "admin@gmail.com",
                                            role: "ADMINISTRATOR"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": { description: "OTP inválido o expirado" }
                }
            }
        },
        "/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Registrar nuevo profesional",
                description: "Registra un nuevo usuario con rol PROFESSIONAL (queda inactivo).",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" },
                            example: {
                                name: "Juan Pérez",
                                email: "juan@example.com",
                                password: "Pa55w.rd",
                                documentNumber: "1234567890",
                                phoneNumber: "+573001234567"
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Profesional registrado exitosamente" },
                    "400": { description: "Datos de entrada inválidos" },
                    "409": { description: "Email o documento ya registrado" }
                }
            }
        },
        "/auth/refresh": {
            post: {
                tags: ["Auth"],
                summary: "Renovar access token",
                description: "Genera un nuevo access token usando el refresh token de las cookies.",
                responses: {
                    "200": { description: "Access token renovado exitosamente" },
                    "401": { description: "Refresh token inválido o expirado" }
                }
            }
        },
        "/auth/logout": {
            post: {
                tags: ["Auth"],
                summary: "Cerrar sesión",
                description: "Invalida el refresh token y limpia las cookies.",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": { description: "Sesión cerrada exitosamente" },
                    "401": { description: "No autenticado" }
                }
            }
        },
        "/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Obtener usuario autenticado",
                description: "Retorna la información del usuario actualmente autenticado.",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Usuario obtenido exitosamente",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                user: { $ref: "#/components/schemas/User" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "No autenticado" }
                }
            }
        },

        // ==================== USERS ====================
        "/users": {
            get: {
                tags: ["Users"],
                summary: "Listar usuarios",
                description: "Obtiene todos los usuarios. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Lista de usuarios",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                users: {
                                                    type: "array",
                                                    items: { $ref: "#/components/schemas/User" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" }
                }
            },
            post: {
                tags: ["Users"],
                summary: "Crear usuario",
                description: "Crea un nuevo usuario. **Roles:** ADMINISTRATOR",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateUserRequest" }
                        }
                    }
                },
                responses: {
                    "201": { description: "Usuario creado exitosamente" },
                    "400": { description: "Datos inválidos" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "409": { description: "Email o documento duplicado" }
                }
            }
        },
        "/users/{id}": {
            get: {
                tags: ["Users"],
                summary: "Obtener usuario",
                description: "Obtiene un usuario por ID. **Roles:** ADMINISTRATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID del usuario" }
                ],
                responses: {
                    "200": { description: "Usuario obtenido" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Usuario no encontrado" }
                }
            },
            patch: {
                tags: ["Users"],
                summary: "Actualizar usuario",
                description: "Actualiza un usuario. **Roles:** ADMINISTRATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateUserRequest" }
                        }
                    }
                },
                responses: {
                    "200": { description: "Usuario actualizado" },
                    "400": { description: "Datos inválidos" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Usuario no encontrado" }
                }
            },
            delete: {
                tags: ["Users"],
                summary: "Eliminar usuario",
                description: "Elimina un usuario (soft delete). **Roles:** ADMINISTRATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                responses: {
                    "200": { description: "Usuario eliminado" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Usuario no encontrado" }
                }
            }
        },

        // ==================== STUDENTS ====================
        "/students": {
            get: {
                tags: ["Students"],
                summary: "Listar estudiantes",
                description: "Obtiene todos los estudiantes con búsqueda opcional. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    {
                        name: "search",
                        in: "query",
                        required: false,
                        schema: { type: "string" },
                        description: "Buscar por nombre, email o documento"
                    }
                ],
                responses: {
                    "200": {
                        description: "Lista de estudiantes",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                students: {
                                                    type: "array",
                                                    items: { $ref: "#/components/schemas/Student" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" }
                }
            },
            post: {
                tags: ["Students"],
                summary: "Crear estudiante",
                description: "Crea un nuevo estudiante. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateStudentRequest" }
                        }
                    }
                },
                responses: {
                    "201": { description: "Estudiante creado" },
                    "400": { description: "Datos inválidos" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "409": { description: "Email o documento duplicado" }
                }
            }
        },
        "/students/{id}": {
            get: {
                tags: ["Students"],
                summary: "Obtener estudiante",
                description: "Obtiene un estudiante por ID. **Roles:** ADMINISTRATOR, COORDINATOR, PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                responses: {
                    "200": { description: "Estudiante obtenido" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Estudiante no encontrado" }
                }
            },
            patch: {
                tags: ["Students"],
                summary: "Actualizar estudiante",
                description: "Actualiza un estudiante. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateStudentRequest" }
                        }
                    }
                },
                responses: {
                    "200": { description: "Estudiante actualizado" },
                    "400": { description: "Datos inválidos" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Estudiante no encontrado" }
                }
            },
            delete: {
                tags: ["Students"],
                summary: "Eliminar estudiante",
                description: "Elimina un estudiante (soft delete). **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                responses: {
                    "200": { description: "Estudiante eliminado" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Estudiante no encontrado" }
                }
            }
        },
        "/students/{id}/subjects": {
            post: {
                tags: ["Students"],
                summary: "Matricular estudiante",
                description: "Matricula un estudiante en una materia. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID del estudiante" }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/EnrollRequest" },
                            example: { subjectId: 1 }
                        }
                    }
                },
                responses: {
                    "201": { description: "Estudiante matriculado" },
                    "400": { description: "Estudiante o materia no existe" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "409": { description: "Ya está matriculado" }
                }
            }
        },
        "/students/{id}/subjects/{subjectId}": {
            delete: {
                tags: ["Students"],
                summary: "Desmatricular estudiante",
                description: "Elimina la matrícula (las notas se eliminan en cascada). **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID del estudiante" },
                    { name: "subjectId", in: "path", required: true, schema: { type: "integer" }, description: "ID de la materia" }
                ],
                responses: {
                    "200": { description: "Estudiante desmatriculado" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Matrícula no encontrada" }
                }
            }
        },

        // ==================== SUBJECTS ====================
        "/subjects": {
            get: {
                tags: ["Subjects"],
                summary: "Listar materias",
                description: "Obtiene todas las materias. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": {
                        description: "Lista de materias",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        message: { type: "string" },
                                        data: {
                                            type: "object",
                                            properties: {
                                                subjects: {
                                                    type: "array",
                                                    items: { $ref: "#/components/schemas/Subject" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" }
                }
            },
            post: {
                tags: ["Subjects"],
                summary: "Crear materia",
                description: "Crea una nueva materia. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateSubjectRequest" }
                        }
                    }
                },
                responses: {
                    "201": { description: "Materia creada" },
                    "400": { description: "Datos inválidos" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" }
                }
            }
        },
        "/subjects/my-subjects": {
            get: {
                tags: ["Subjects"],
                summary: "Mis materias",
                description: "Obtiene las materias asignadas al profesional autenticado. **Roles:** PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                responses: {
                    "200": { description: "Materias del profesional" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" }
                }
            }
        },
        "/subjects/{id}": {
            get: {
                tags: ["Subjects"],
                summary: "Obtener materia",
                description: "Obtiene una materia por ID. **Roles:** ADMINISTRATOR, COORDINATOR, PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                responses: {
                    "200": { description: "Materia obtenida" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Materia no encontrada" }
                }
            },
            patch: {
                tags: ["Subjects"],
                summary: "Actualizar materia",
                description: "Actualiza una materia. **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateSubjectRequest" }
                        }
                    }
                },
                responses: {
                    "200": { description: "Materia actualizada" },
                    "400": { description: "Datos inválidos" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Materia no encontrada" }
                }
            },
            delete: {
                tags: ["Subjects"],
                summary: "Eliminar materia",
                description: "Elimina una materia (soft delete). **Roles:** ADMINISTRATOR, COORDINATOR",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                responses: {
                    "200": { description: "Materia eliminada" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Materia no encontrada" }
                }
            }
        },
        "/subjects/{id}/students": {
            get: {
                tags: ["Subjects"],
                summary: "Estudiantes de una materia",
                description: "Obtiene los estudiantes matriculados. **Roles:** ADMINISTRATOR, COORDINATOR, PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID de la materia" }
                ],
                responses: {
                    "200": { description: "Lista de estudiantes" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos (PROFESSIONAL solo ve sus materias)" },
                    "404": { description: "Materia no encontrada" }
                }
            }
        },
        "/subjects/{id}/students/{studentId}/grades": {
            get: {
                tags: ["Subjects"],
                summary: "Notas de un estudiante",
                description: "Obtiene las notas de un estudiante en una materia. **Roles:** ADMINISTRATOR, COORDINATOR, PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" }, description: "ID de la materia" },
                    { name: "studentId", in: "path", required: true, schema: { type: "integer" }, description: "ID del estudiante" }
                ],
                responses: {
                    "200": {
                        description: "Notas del estudiante",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Notas obtenidas exitosamente",
                                    data: {
                                        studentSubjectId: 1,
                                        grades: [
                                            { id: 1, value: 4.5, description: "Parcial 1" }
                                        ]
                                    }
                                }
                            }
                        }
                    },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Materia o estudiante no encontrado" }
                }
            }
        },

        // ==================== GRADES ====================
        "/grades": {
            post: {
                tags: ["Grades"],
                summary: "Crear nota",
                description: "Crea una nueva nota. **Roles:** ADMINISTRATOR, COORDINATOR, PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateGradeRequest" },
                            example: {
                                value: 4.5,
                                description: "Examen parcial",
                                studentSubjectId: 1
                            }
                        }
                    }
                },
                responses: {
                    "201": { description: "Nota creada" },
                    "400": { description: "Datos inválidos (valor debe ser 0-5)" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos (PROFESSIONAL solo en sus materias)" },
                    "404": { description: "Matrícula no encontrada" }
                }
            }
        },
        "/grades/{id}": {
            patch: {
                tags: ["Grades"],
                summary: "Actualizar nota",
                description: "Actualiza una nota. **Roles:** ADMINISTRATOR, COORDINATOR, PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateGradeRequest" },
                            example: { value: 4.8, description: "Parcial corregido" }
                        }
                    }
                },
                responses: {
                    "200": { description: "Nota actualizada" },
                    "400": { description: "Datos inválidos" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Nota no encontrada" }
                }
            },
            delete: {
                tags: ["Grades"],
                summary: "Eliminar nota",
                description: "Elimina una nota (soft delete). **Roles:** ADMINISTRATOR, COORDINATOR, PROFESSIONAL",
                security: [{ cookieAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                responses: {
                    "200": { description: "Nota eliminada" },
                    "401": { description: "No autenticado" },
                    "403": { description: "Sin permisos" },
                    "404": { description: "Nota no encontrada" }
                }
            }
        },

        // ==================== COUNTRIES ====================
        "/countries": {
            get: {
                tags: ["Countries"],
                summary: "Listar países",
                description: "Obtiene todos los países (datos de API externa RestCountries).",
                responses: {
                    "200": {
                        description: "Lista de países",
                        content: {
                            "application/json": {
                                example: {
                                    message: "Países obtenidos exitosamente",
                                    data: {
                                        countries: [
                                            { id: 1, name: "Colombia", code: "CO" },
                                            { id: 2, name: "Argentina", code: "AR" }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        securitySchemes: {
            cookieAuth: {
                type: "apiKey",
                in: "cookie",
                name: "accessToken",
                description: "JWT almacenado en cookie HttpOnly"
            }
        },
        schemas: {
            PreLoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "admin@gmail.com" },
                    password: { type: "string", minLength: 6, example: "Pa55w.rd" }
                }
            },
            VerifyOtpRequest: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                    email: { type: "string", format: "email", example: "admin@gmail.com" },
                    otp: { type: "string", example: "123456" }
                }
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password", "documentNumber", "phoneNumber"],
                properties: {
                    name: { type: "string", example: "Juan Pérez" },
                    email: { type: "string", format: "email", example: "juan@example.com" },
                    password: { type: "string", example: "Pa55w.rd" },
                    documentNumber: { type: "string", example: "1234567890" },
                    phoneNumber: { type: "string", example: "+573001234567" }
                }
            },
            User: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Admin User" },
                    email: { type: "string", example: "admin@gmail.com" },
                    role: { type: "string", enum: ["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"] },
                    documentNumber: { type: "string", example: "1234567890" },
                    phoneNumber: { type: "string", example: "+573001234567" },
                    active: { type: "boolean", example: true },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            CreateUserRequest: {
                type: "object",
                required: ["name", "email", "password", "role", "documentNumber", "phoneNumber"],
                properties: {
                    name: { type: "string", example: "Nuevo Usuario" },
                    email: { type: "string", example: "nuevo@example.com" },
                    password: { type: "string", example: "Pa55w.rd" },
                    role: { type: "string", enum: ["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"] },
                    documentNumber: { type: "string", example: "9876543210" },
                    phoneNumber: { type: "string", example: "+573009876543" },
                    active: { type: "boolean", example: true }
                }
            },
            UpdateUserRequest: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "string", enum: ["ADMINISTRATOR", "COORDINATOR", "PROFESSIONAL"] },
                    documentNumber: { type: "string" },
                    phoneNumber: { type: "string" },
                    active: { type: "boolean" }
                }
            },
            Student: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "María García" },
                    email: { type: "string", example: "maria@student.com" },
                    documentNumber: { type: "string", example: "1122334455" },
                    countryId: { type: "integer", example: 1 },
                    createdBy: { type: "integer", example: 1 },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            CreateStudentRequest: {
                type: "object",
                required: ["name", "email", "documentNumber", "countryId"],
                properties: {
                    name: { type: "string", example: "Pedro López" },
                    email: { type: "string", example: "pedro@student.com" },
                    documentNumber: { type: "string", example: "5566778899" },
                    countryId: { type: "integer", example: 1 }
                }
            },
            UpdateStudentRequest: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    email: { type: "string" },
                    documentNumber: { type: "string" },
                    countryId: { type: "integer" }
                }
            },
            EnrollRequest: {
                type: "object",
                required: ["subjectId"],
                properties: {
                    subjectId: { type: "integer", example: 1 }
                }
            },
            Subject: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Matemáticas" },
                    professionalId: { type: "integer", example: 3 },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            CreateSubjectRequest: {
                type: "object",
                required: ["name", "professionalId"],
                properties: {
                    name: { type: "string", example: "Física" },
                    professionalId: { type: "integer", example: 3 }
                }
            },
            UpdateSubjectRequest: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    professionalId: { type: "integer" }
                }
            },
            Grade: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    value: { type: "number", example: 4.5 },
                    description: { type: "string", example: "Examen parcial" },
                    studentSubjectId: { type: "integer", example: 1 },
                    createdAt: { type: "string", format: "date-time" },
                    updatedAt: { type: "string", format: "date-time" }
                }
            },
            CreateGradeRequest: {
                type: "object",
                required: ["value", "description", "studentSubjectId"],
                properties: {
                    value: { type: "number", minimum: 0, maximum: 5, example: 4.0 },
                    description: { type: "string", example: "Quiz 1" },
                    studentSubjectId: { type: "integer", example: 1 }
                }
            },
            UpdateGradeRequest: {
                type: "object",
                properties: {
                    value: { type: "number", minimum: 0, maximum: 5 },
                    description: { type: "string" }
                }
            },
            Country: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 1 },
                    name: { type: "string", example: "Colombia" },
                    code: { type: "string", example: "CO" }
                }
            }
        }
    }
};

export const swaggerSpec = swaggerDefinition;
