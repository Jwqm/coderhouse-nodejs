import express from 'express';
import CartsManager from '../dao/mongo/managers/carts.manager.js';
import * as CartsValidators from '../validators/carts.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import { sendResponse } from '../middlewares/response.handler.js';

const router = express.Router();
const cartsManager = new CartsManager();

router.get('/', CartsValidators.limitParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const carts = await cartsManager.getCarts();
        let limit = req.query.limit;

        return sendResponse(200, limit ? carts.slice(0, limit) : carts)(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/:cid', CartsValidators.idAndUnitsParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const cart = await cartsManager.getCartById(req.params.cid);

        return sendResponse(200, cart)(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/', CartsValidators.creatCartValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        await cartsManager.addCart();

        return sendResponse(201, { message: 'Carrito de compra creado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/:cid/products/:pid', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const add = true;

        await cartsManager.updateCartAndProduct(req.params.cid, [{ idProduct: req.params.pid, quantity: units }], add);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/:cid/products/:pid/:units', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const add = true;

        await cartsManager.updateCartAndProduct(req.params.cid, [{ idProduct: req.params.pid, quantity: units }], add);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.put('/:cid', CartsValidators.idParam, CartsValidators.productsBody, ValidationErrorHandler, async (req, res, next) => {
    try {
        const add = true;
        await cartsManager.updateCartAndProduct(req.params.cid, req.body.products, add);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.put('/:cid/products/:pid', CartsValidators.idAndUnitsParam, CartsValidators.quantityBody, ValidationErrorHandler, async (req, res, next) => {
    try {
        const add = true;
        await cartsManager.updateCartAndProduct(req.params.cid, req.body.products, add);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/:cid', CartsValidators.idAndUnitsParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        await cartsManager.deleteCart(req.params.cid);

        return sendResponse(200, { message: 'Carrito de compras eliminado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/:cid/products/:pid', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const add = false;

        await cartsManager.updateCartAndProduct(req.params.cid, [{ idProduct: req.params.pid, quantity: units }], add);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/:cid/products/:pid/:units', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const add = false;

        await cartsManager.updateCartAndProduct(req.params.cid, [{ idProduct: req.params.pid, quantity: units }], add);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;