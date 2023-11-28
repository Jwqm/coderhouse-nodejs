import { param, query, body } from 'express-validator';

export const creatCartValidator = [
];

export const idParam = [
    param('cid').isAlphanumeric().withMessage('El id del carrito de compras debe ser un valor alfanumerico'),
];

export const idAndIdProductParam = [
    param('cid').isAlphanumeric().withMessage('El id del carrito de compras debe ser un valor alfanumerico'),
    param('pid').isAlphanumeric().withMessage('El id de producto debe ser un valor alfanumerico'),
];

export const idAndIdProductOrUnitsParam = [
    param('cid').isAlphanumeric().withMessage('El id del carrito de compras debe ser un valor alfanumerico'),
    param('pid').isAlphanumeric().withMessage('El id de producto debe ser un valor alfanumerico'),
    param('units').optional()
        .isNumeric().withMessage('La cantidad de producto debe ser un numero')
        .isInt({ min: 1 }).withMessage('El campo cantidad debe ser un número entero mayor o igual a 1'),
];

export const limitParam = [
    query('limit').optional()
        .isInt({ min: 1 }).withMessage('El campo limit debe ser un número entero mayor o igual a 1'),
];

export const idAndUnitsParam = [
    param('cid').isAlphanumeric().withMessage('El id del carrito de compras debe ser un valor alfanumerico'),
    param('units').optional()
        .isNumeric().withMessage('La cantidad de producto debe ser un numero')
        .isInt({ min: 1 }).withMessage('El campo cantidad debe ser un número entero mayor o igual a 1'),
];

export const productsBody = [
    body('products')
        .isArray()
        .withMessage('La propiedad products debe ser un arreglo'),
    body('products.*.id')
        .isMongoId()
        .withMessage('El campo id debe ser un ID de MongoDB válido'),
    body('products.*.quantity')
        .isInt({ min: 1 })
        .withMessage('El campo quantity debe ser un número entero mayor o igual a 1'),
];

export const quantityBody = [
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('El campo quantity debe ser un número entero mayor o igual a 1'),
];