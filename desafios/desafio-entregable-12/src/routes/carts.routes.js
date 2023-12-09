import express from 'express';
import * as CartsValidators from '../validators/carts.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import CartsController from '../controllers/carts.controller.js';

const router = express.Router();

router.get('/', CartsValidators.limitParam, ValidationErrorHandler, CartsController.get);

router.get('/:cid', CartsValidators.idAndUnitsParam, ValidationErrorHandler, CartsController.getBy);

router.post('/', CartsValidators.creatCartValidator, ValidationErrorHandler, CartsController.create);

router.post('/:cid/products/:pid', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.updateBy);

router.post('/:cid/products/:pid/:units', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.updateBy);

router.post('/:cid/purchase', CartsValidators.idParam, CartsValidators.productsBody, ValidationErrorHandler, CartsController.purchase);

router.put('/:cid', CartsValidators.idParam, CartsValidators.productsBody, ValidationErrorHandler, CartsController.update);

router.put('/:cid/products/:pid', CartsValidators.idAndUnitsParam, CartsValidators.quantityBody, ValidationErrorHandler, CartsController.update);

router.delete('/:cid', CartsValidators.idAndUnitsParam, ValidationErrorHandler, CartsController.remove);

router.delete('/:cid/products/:pid', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.removeBy);

router.delete('/:cid/products/:pid/:units', CartsValidators.idAndIdProductOrUnitsParam, ValidationErrorHandler, CartsController.removeBy);

export default router;