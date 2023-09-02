import { param, query } from 'express-validator';

export const creatCartValidator = [
];

export const updateCartAndProduct = [
    param('pid').isNumeric().withMessage('El id de producto debe ser un numero'),
    param('cid').isNumeric().withMessage('El id del carrito de compras debe ser un numero'),
    param('units').optional().isNumeric().withMessage('La cantidad de producto debe ser un numero'),
];

export const getCartValidator = [
    query('limit').optional().isInt({ min: 1 }).toInt(),
];

export const getCartByIdValidator = [
    param('cid').isNumeric().withMessage('El id del carrito de compras debe ser un numero'),
    param('units').optional().isNumeric().withMessage('La cantidad de producto debe ser un numero'),
];