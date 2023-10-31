import express from 'express';
import * as ProductsValidators from '../validators/products.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import { sendResponse } from '../middlewares/response.handler.js';
import { productsService } from "../services/repositories.service.js";
import ProductsDTO from '../dao/dto/products.dto.js';

const router = express.Router();

router.get('/', ProductsValidators.limitParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const result = await productsService.paginate(req.query);

        return sendResponse(200, result)(req, res);
    } catch (error) {
        next(err);
    }
});

router.get('/:pid', ProductsValidators.idParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        const product = await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));

        return sendResponse(200, product)(req, res);
    } catch (err) {
        next(err);
    }
});

router.post('/', ProductsValidators.productBody, ValidationErrorHandler, async (req, res, next) => {
    try {
        await productsService.create(ProductsDTO.build(req.body));

        return sendResponse(201, { message: 'Producto creado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.put('/:pid', ProductsValidators.idParamAndProductBody, ValidationErrorHandler, async (req, res, next) => {
    try {
        await productsService.update(ProductsDTO.build({ id: req.params.pid, ...req.body }));

        return sendResponse(201, { message: 'Producto actualizado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

router.delete('/:pid', ProductsValidators.idParam, ValidationErrorHandler, async (req, res, next) => {
    try {
        await productsManager.deleteProduct(req.params.pid);

        return sendResponse(201, { message: 'Producto eliminado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
});

export default router;