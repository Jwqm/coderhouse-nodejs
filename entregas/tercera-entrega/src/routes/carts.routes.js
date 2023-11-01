import express from 'express';
import CartsManager from '../dao/mongo/managers/carts.manager.js';
import * as CartsValidators from '../validators/carts.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import { sendResponse } from '../middlewares/response.handler.js';
import CartsController from '../controllers/carts.controller.js';
import cartsController from '../controllers/carts.controller.js';

const router = express.Router();
const cartsManager = new CartsManager();

router.get('/', CartsValidators.limitParam, ValidationErrorHandler, CartsController.get);

router.get('/:cid', CartsValidators.idAndUnitsParam, ValidationErrorHandler, CartsController.getBy);

router.post('/', CartsValidators.creatCartValidator, ValidationErrorHandler, CartsController.create);

router.post('/:cid/products/:pid', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.updateBy);

router.post('/:cid/products/:pid/:units', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.updateBy);

router.post('/:cid/purchase', CartsValidators.idParam, CartsValidators.productsBody, ValidationErrorHandler, cartsController.purchase);

router.put('/:cid', CartsValidators.idParam, CartsValidators.productsBody, ValidationErrorHandler, cartsController.update);

router.put('/:cid/products/:pid', CartsValidators.idAndUnitsParam, CartsValidators.quantityBody, ValidationErrorHandler, async (req, res, next) => {
    try {
        const add = true;
        await cartsManager.updateCartAndProduct(req.params.cid, req.body.products, add);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/:cid', CartsValidators.idAndUnitsParam, ValidationErrorHandler, CartsController.remove);

router.delete('/:cid/products/:pid', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.removeBy);

router.delete('/:cid/products/:pid/:units', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.removeBy);

export default router;