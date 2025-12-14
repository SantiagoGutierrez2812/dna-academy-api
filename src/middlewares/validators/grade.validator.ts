import { body, param } from "express-validator";
import { validator } from "./validator";

export const createGradeValidator = [
    body("studentSubjectId")
        .notEmpty()
        .withMessage("El id de la inscripción es obligatorio")
        .isInt({ min: 1 })
        .withMessage("El id de la inscripción debe ser numérico")
        .toInt(),

    body("value")
        .notEmpty()
        .withMessage("El valor de la nota es obligatorio")
        .isFloat({ min: 0, max: 5 })
        .withMessage("El valor de la nota debe estar entre 0 y 5")
        .toFloat(),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("La descripción de la nota es obligatoria")
        .isLength({ min: 3, max: 50 })
        .withMessage("La descripción de la nota debe tener entre 3 y 50 caracteres"),

    validator
]

export const updateGradeValidator = [
    param("id")
        .isInt(({ min: 1 }))
        .withMessage("El id de la nota debe ser numérico")
        .toInt(),

    body("value")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage("El valor de la nota debe estar entre 0 y 5")
        .toFloat(),

    body("description")
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage("La descripción de la nota debe tener entre 3 y 50 caracteres"),

    validator
]

export const idGradeValidator = [
    param("id")
        .isInt(({ min: 1 }))
        .withMessage("El id de la nota debe ser numérico")
        .toInt(),

    validator
]
