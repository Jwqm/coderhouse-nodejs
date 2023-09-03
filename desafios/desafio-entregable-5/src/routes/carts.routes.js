import express from 'express';
import CartsManager from '../dao/mongo/managers/carts.manager.js';
import * as CartsValidators from '../validators/carts.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import sendResponse from '../middlewares/response.handler.js';

const router = express.Router();
const cartsManager = new CartsManager();

router.get('/carts', CartsValidators.getCartValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        const carts = await cartsManager.getCarts();
        let limit = req.query.limit;

        return sendResponse(200, limit ? carts.slice(0, limit) : carts)(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/carts/:cid', CartsValidators.getCartByIdValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        const cart = await cartsManager.getCartById(req.params.cid);

        return sendResponse(200, cart)(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/carts', CartsValidators.creatCartValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        await cartsManager.addCart();

        return sendResponse(201, { message: 'Carrito de compra creado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/carts/:cid/product/:pid', CartsValidators.updateCartAndProduct, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const addProduct = true;

        await cartsManager.updateCartAndProduct(req.params.cid, req.params.pid, units, addProduct);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/carts/:cid/product/:pid/:units', CartsValidators.updateCartAndProduct, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const addProduct = true;

        await cartsManager.updateCartAndProduct(req.params.cid, req.params.pid, units, addProduct);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/carts/:cid', CartsValidators.getCartByIdValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        await cartsManager.deleteCart(req.params.cid);

        return sendResponse(200, { message: 'Carrito de compras eliminado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/carts/:cid/product/:pid', CartsValidators.updateCartAndProduct, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const addProduct = false;

        await cartsManager.updateCartAndProduct(req.params.cid, req.params.pid, units, addProduct);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/carts/:cid/product/:pid/:units', CartsValidators.updateCartAndProduct, ValidationErrorHandler, async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;
        const addProduct = false;

        await cartsManager.updateCartAndProduct(req.params.cid, req.params.pid, units, addProduct);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;