const { param, query } = require('express-validator');

exports.creatCartValidator = [
];

exports.updateCartAndProduct = [
    param('pid').isNumeric().withMessage('El id de producto debe ser un numero'),
    param('cid').isNumeric().withMessage('El id del carrito de compras debe ser un numero'),
    param('units').optional().isNumeric().withMessage('La cantidad de producto debe ser un numero'),
];

exports.getCartValidator = [
    query('limit').optional().isInt({ min: 1 }).toInt(),
];

exports.getCartByIdValidator = [
    param('cid').isNumeric().withMessage('El id del carrito de compras debe ser un numero'),
    param('units').optional().isNumeric().withMessage('La cantidad de producto debe ser un numero'),
];