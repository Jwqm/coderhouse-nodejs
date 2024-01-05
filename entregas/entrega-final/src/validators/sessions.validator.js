import { body, param, query } from 'express-validator';

export const loginBody = [
    body('email').notEmpty().withMessage('El email es obligatorio').isString().withMessage('El título debe ser una cadena de texto'),
    body('password').notEmpty().withMessage('La password es obligatoria').isString().withMessage('La descripción debe ser una cadena de texto'),
];

export const registerBody = [
    body('firstname').notEmpty().withMessage('El nombre es obligatorio').isString().withMessage('El nombre debe ser una cadena de texto'),
    body('lastname').notEmpty().withMessage('El apellido es obligatorio').isString().withMessage('El apellido debe ser una cadena de texto'),
    body('email').notEmpty().withMessage('El email es obligatorio').isString().withMessage('El título debe ser una cadena de texto'),
    body('age').notEmpty().withMessage('La edad es obligatoria').isNumeric().withMessage('La edad debe ser un numero'),
    body('password').notEmpty().withMessage('La password es obligatoria').isString().withMessage('La descripción debe ser una cadena de texto'),
];