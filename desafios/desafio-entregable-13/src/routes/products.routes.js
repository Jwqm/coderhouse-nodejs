import express from 'express';
import * as ProductsValidators from '../validators/products.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import passportCall from "../middlewares/passport.call.js";
import executePolicies from "../middlewares/execute.policies.js";
import ProductsController from '../controllers/products.controller.js';

const router = express.Router();

router.get('/mockingproducts', ProductsController.mock);

router.get('/', ProductsValidators.limitParam, ValidationErrorHandler, ProductsController.get);

router.get('/:pid', ProductsValidators.idParam, ValidationErrorHandler, ProductsController.getBy);

router.post('/', passportCall("jwt", { strategyType: "JWT" }), executePolicies(["ADMIN", "PREMIUM"]), ProductsValidators.productBody, ValidationErrorHandler, ProductsController.create);

router.put('/:pid', passportCall("jwt", { strategyType: "JWT" }), executePolicies(["ADMIN"]), ProductsValidators.idParamAndProductBody, ValidationErrorHandler, ProductsController.update);

router.delete('/:pid', passportCall("jwt", { strategyType: "JWT" }), executePolicies(["ADMIN", "PREMIUM"]), ProductsValidators.idParam, ValidationErrorHandler, ProductsController.remove);

export default router;