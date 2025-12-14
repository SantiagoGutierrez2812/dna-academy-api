import { body, param } from "express-validator";
import { validator } from "./validator";

export const createStudentValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre del estudiante es obligatorio")
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre del estudiante debe tener entre 3 y 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El nombre del estudiante solo puede contener letras"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email del estudiante es obligatorio")
        .isEmail()
        .withMessage("Email inválido") // Verifica formato de email
        .normalizeEmail({ gmail_remove_dots: false }),

    body("countryId")
        .trim()
        .notEmpty()
        .withMessage("El id del país es obligatorio")
        .isInt(({ min: 1 }))
        .withMessage("El id del país debe ser numérico")
        .toInt(),

    body("documentNumber")
        .trim()
        .notEmpty()
        .withMessage("El número de documento del estudiante es obligatorio")
        .isLength({ min: 5, max: 12 })
        .withMessage("El número de documento debe tener entre 5 y 12 números")
        .isNumeric()
        .withMessage("El documento solo debe contener números"),

    validator
]

export const updateStudentValidator = [
    param("id")
        .isInt(({ min: 1 }))
        .withMessage("El id del estudiante debe ser numérico")
        .toInt(),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre del estudiante debe tener entre 3 y 50 caracteres")
        .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .withMessage("El nombre del estudiante solo puede contener letras"),

    body("email")
        .optional()
        .trim()
        .isEmail()
        .withMessage("Email inválido") // Verifica formato de email
        .normalizeEmail({ gmail_remove_dots: false }),

    body("countryId")
        .optional()
        .trim()
        .isInt(({ min: 1 }))
        .withMessage("El id del país debe ser numérico")
        .toInt(),

    body("documentNumber")
        .optional()
        .trim()
        .isLength({ min: 5, max: 12 })
        .withMessage("El número de documento debe tener entre 5 y 12 números")
        .isNumeric()
        .withMessage("El documento solo debe contener números"),

    validator
]

export const idStudentValidator = [
    param("id")
        .isInt(({ min: 1 }))
        .withMessage("El id del estudiante debe ser numérico")
        .toInt(),

    validator
]

export const enrrollValidator = [
    param("id")
        .isInt(({ min: 1 }))
        .withMessage("El id del estudiante debe ser numérico")
        .toInt(),

    body("subjectId")
        .trim()
        .notEmpty()
        .withMessage("El id de la materia es obligatorio")
        .isInt(({ min: 1 }))
        .withMessage("El id de la materia debe ser numérico")
        .toInt(),

    validator
]

export const unenrrollValidator = [
    param("id")
        .isInt(({ min: 1 }))
        .withMessage("El id del estudiante debe ser numérico")
        .toInt(),

    param("subjectId")
        .isInt(({ min: 1 }))
        .withMessage("El id de la materia debe ser numérico")
        .toInt(),

    validator
]