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

export const registerValidator = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("El nombre es obligatorio")
        .isLength({ min: 2, max: 100 })
        .withMessage("El nombre debe tener entre 2 y 100 caracteres"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("El email es obligatorio")
        .isEmail()
        .withMessage("Email inválido")
        .normalizeEmail({ gmail_remove_dots: false }),

    body("phoneNumber")
        .trim()
        .notEmpty()
        .withMessage("El teléfono es obligatorio")
        .isLength({ min: 7, max: 20 })
        .withMessage("El teléfono debe tener entre 7 y 20 caracteres"),

    body("documentNumber")
        .trim()
        .notEmpty()
        .withMessage("El número de documento es obligatorio")
        .isLength({ min: 5, max: 20 })
        .withMessage("El documento debe tener entre 5 y 20 caracteres"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener mínimo 8 caracteres"),

    validator
];