import express from 'express';
import ProductsManager from '../manager/products.manager.js';
import * as ProductsValidators from '../validators/products.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import sendResponse from '../middlewares/response.handler.js';

const router = express.Router();
const productsManager = new ProductsManager();

router.get('/products', ProductsValidators.getProductsValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        const products = await productsManager.getProducts();
        const limit = req.query.limit;

        return sendResponse(200, limit ? products.slice(0, limit) : products)(req, res);
    } catch (err) {
        next(err);
    }
});

router.get('/products/:pid', ProductsValidators.getProductByIdValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productsManager.getProductById(pid);

        return sendResponse(200, product)(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/products', ProductsValidators.addProductValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        await productsManager.addProduct(req.body);

        return sendResponse(201, { message: 'Producto creado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.put('/products/:pid', ProductsValidators.updateProductValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        const pid = parseInt(req.params.pid);
        await productsManager.updateProduct({ ...req.body, id: pid });

        return sendResponse(201, { message: 'Producto actualizado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/products/:pid', ProductsValidators.getProductByIdValidator, ValidationErrorHandler, async (req, res, next) => {
    try {
        const pid = parseInt(req.params.pid);
        await productsManager.deleteProduct(pid);

        return sendResponse(201, { message: 'Producto eliminado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;