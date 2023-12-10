import express from 'express';
import * as ProductsValidators from '../validators/products.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import passportCall from "../middlewares/passport.call.js";
import executePolicies from "../middlewares/execute.policies.js";
import usersController from '../controllers/users.controller.js';

const router = express.Router();

router.put('/premium', passportCall("jwt", { strategyType: "JWT" }), executePolicies(["USER", "PREMIUM"]), ValidationErrorHandler, usersController.update);

export default router;