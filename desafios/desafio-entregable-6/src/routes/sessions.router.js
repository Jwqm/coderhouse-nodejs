import express from 'express';
import UserManager from "../dao/mongo/managers/userManager.js";
import { NotFoundError } from '../errors/custom.error.js';
import * as SessionsValidators from '../validators/sessions.validator.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import { sendResponse } from '../middlewares/response.handler.js';

const router = express.Router();
const userManager = new UserManager();

router.post('/register', SessionsValidators.registerBody, ValidationErrorHandler, async (req, res, next) => {
    try {
        await userManager.create(req.body);
        return sendResponse(201, { message: 'Usuario registrado correctamente' })(req, res);
    } catch (err) {
        next(err);
    }
})

router.post('/login', SessionsValidators.loginBody, ValidationErrorHandler, auth, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userManager.getBy({ email, password });
        if (!user) throw new NotFoundError(20031, 'Usuario no encontrado');
        req.session.user = user;
        return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
    } catch (err) {
        next(err);
    }
})

function auth(req, res, next) {
    if (req.body?.email === 'adminCoder@coder.com' && req.body?.password === 'adminCode3r123') {
        req.session.user = {
            firstName: 'admin',
            role: 'admin'
        }
        return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
    }
    return next();
}

export default router;