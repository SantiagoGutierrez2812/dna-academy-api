import { body, param } from "express-validator";
import { validator } from "./validator";

export const createSubjectValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre de la materia es obligatorio")
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre de la materia debe tener entre 3 y 50 caracteres"),

    body("professionalId")
        .trim()
        .notEmpty()
        .withMessage("El id del profesional es obligatorio")
        .isInt(({ min: 1 }))
        .withMessage("El id del profesional debe ser numérico")
        .toInt(),

    validator
]

export const updateSubjectValidator = [
    param("id")
        .isInt(({ min: 1 }))
        .withMessage("El id de la materia debe ser numérico")
        .toInt(),

    body("name")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("El nombre de la materia debe tener entre 3 y 50 caracteres"),

    body("professionalId")
        .optional()
        .trim()
        .isInt(({ min: 1 }))
        .withMessage("El id del profesional debe ser numérico")
        .toInt(),

    validator
]

export const idSubjectValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El id de la materia debe ser numérico")
        .toInt(),

    validator
]

export const studentGradesValidator = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("El id de la materia debe ser numérico")
        .toInt(),

    param("studentId")
        .isInt({ min: 1 })
        .withMessage("El id del estudiante debe ser numérico")
        .toInt(),

    validator
]
