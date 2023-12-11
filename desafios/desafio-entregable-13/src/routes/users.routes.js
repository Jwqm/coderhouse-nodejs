import express from 'express';
import * as ProductsValidators from '../validators/products.validators.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import passportCall from "../middlewares/passport.call.js";
import executePolicies from "../middlewares/execute.policies.js";
import usersController from '../controllers/users.controller.js';
import uploader from '../services/upload.service.js';
const router = express.Router();
router.get('/', usersController.get);
router.put('/premium/:uid', passportCall("jwt", { strategyType: "JWT" }), executePolicies(["USER", "PREMIUM"]), ValidationErrorHandler, usersController.update);
router.post('/:uid/documents', passportCall("jwt", { strategyType: "JWT" }), executePolicies(["PUBLIC"]), uploader.fields([
    { name: 'documents', maxCount: 3 },
    { name: 'profiles', maxCount: 3 },
    { name: 'products', maxCount: 3 },
    { name: 'otherFiles', maxCount: 5 },
]), ValidationErrorHandler, usersController.upload);
export default router;