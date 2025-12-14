import { body } from "express-validator";
import { validator } from "./validator";

export const preLoginValidator = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email del usuario es obligatorio")
        .isEmail()
        .withMessage("Email inválido") // Verifica formato de email
        .normalizeEmail({ gmail_remove_dots: false }),

    body("password")
        .notEmpty()
        .withMessage("La contraseña del usuario es obligatoria")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener mínimo 8 caracteres"),

    validator
];

export const verifyLoginOtpValidator = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email del usuario es obligatorio")
        .isEmail()
        .withMessage("Email inválido") // Verifica formato de email
        .normalizeEmail({ gmail_remove_dots: false }),

    body("otp")
        .notEmpty()
        .withMessage("El otp es obligatorio")
        .isLength({ min: 6, max: 6 })
        .withMessage("El otp debe ser de 6 dígitos")
        .isNumeric()
        .withMessage("El otp solo debe contener números"),

    validator
];