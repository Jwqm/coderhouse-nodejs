import { body, param, query } from 'express-validator';

export const productBody = [
    body('title').notEmpty().withMessage('El título es obligatorio').isString().withMessage('El título debe ser una cadena de texto'),
    body('description').notEmpty().withMessage('La descripción es obligatoria').isString().withMessage('La descripción debe ser una cadena de texto'),
    body('code').notEmpty().withMessage('El código es obligatorio').isString().withMessage('El código debe ser una cadena de texto'),
    body('price').notEmpty().withMessage('El precio es obligatorio').isFloat().withMessage('El precio debe ser un número decimal'),
    body('status').notEmpty().withMessage('El estado ser obligatorio').isBoolean().withMessage('El estado debe ser un valor booleano').default(true),
    body('stock').notEmpty().withMessage('El stock es obligatorio').isNumeric().withMessage('El stock debe ser un número'),
    body('category').notEmpty().withMessage('La categoría es obligatorio').isString().withMessage('La categoría debe ser una cadena de texto'),
    body('thumbnails').isArray().withMessage('Los thumbnails deben ser un arreglo'),
];

export const idParamAndProductBody = [
    param('pid').isAlphanumeric().withMessage('El id debe ser un numero'),
    body('title').optional().isString().withMessage('El título debe ser una cadena de texto'),
    body('description').optional().isString().withMessage('La descripcion debe ser una cadena de texto'),
    body('code').optional().isString().withMessage('El código debe ser una cadena de texto'),
    body('price').optional().isFloat().withMessage('El precio debe ser un número decimal'),
    body('status').optional().isBoolean().withMessage('El estado debe ser un valor booleano'),
    body('stock').optional().isNumeric().withMessage('El stock debe ser un número'),
    body('category').optional().isString().withMessage('La categoría debe ser una cadena de texto'),
    body('thumbnails').optional().isArray().withMessage('Los thumbnails deben ser un arreglo')
];

export const limitParam = [
    query('limit').optional()
        .isInt({ min: 1 }).withMessage('El campo limit debe ser un número entero mayor o igual a 1'),
];

export const idParam = [
    param('pid').isAlphanumeric().withMessage('El id de producto debe ser un valor alfanumerico'),
];