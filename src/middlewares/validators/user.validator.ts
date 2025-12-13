import { body } from "express-validator";
import { validator } from "./validator";
import { UserRole } from "@prisma/client";

const validRoles: string[] = Object.keys(UserRole);

export const createUserValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del usuario es obligatorio")
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre del usuario debe tener entre 3 y 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El nombre del usuario solo puede contener letras"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email del usuario es obligatorio")
        .isEmail()
        .withMessage("Email inválido") // Verifica formato de email
        .normalizeEmail({ gmail_remove_dots: false }),

    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("El número de teléfono del usuario es obligatorio")
        .isMobilePhone("es-CO")
        .withMessage("Número de teléfono colombiano inválido"),

    body("documentNumber")
        .trim()
        .notEmpty()
        .withMessage("El número de documento del usuario es obligatorio")
        .isLength({ min: 5, max: 12 })
        .withMessage("El número de documento debe tener entre 5 y 12 números")
        .isNumeric()
        .withMessage("El documento solo debe contener números"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña del usuario es obligatoria")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener mínimo 8 caracteres"),

    body("role")
        .trim()
        .notEmpty()
        .withMessage("El rol del usuario es obligatorio")
        .isIn(validRoles)
        .withMessage(`El rol debe ser uno de: ${validRoles.join(", ")}`),

    validator
]