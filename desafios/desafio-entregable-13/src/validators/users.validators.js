import { body, param } from 'express-validator';

export const idParamAndUserBody = [
    param('uid').isAlphanumeric().withMessage('El id del usuario debe ser un valor alfanumerico'),
    body('role').notEmpty().withMessage('El rol es obligatorio').isString().withMessage('El rol debe ser una cadena de texto'),
];


export const idParam = [
    param('uid').isAlphanumeric().withMessage('El id del usuario debe ser un valor alfanumerico'),
];