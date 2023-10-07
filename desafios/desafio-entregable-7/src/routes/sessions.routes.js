import express from 'express';
import passport from "passport";
import { UnauthorizedError } from '../errors/custom.error.js';
import * as SessionsValidators from '../validators/sessions.validator.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import { sendResponse } from '../middlewares/response.handler.js';

const router = express.Router();

router.post('/register', SessionsValidators.registerBody, ValidationErrorHandler, passport.authenticate('register', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res, next) => {
    return sendResponse(201, { message: 'Usuario registrado correctamente' })(req, res);
})

router.post('/login', SessionsValidators.loginBody, ValidationErrorHandler, passport.authenticate('login', { failureRedirect: '/api/sessions/authFail', failureMessage: true }), async (req, res, next) => {
    req.session.user = req.user;
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
})

router.get('/authFail', ValidationErrorHandler, (req, res, next) => {
    //Si cayó a este endpoint, significa que falló.
    console.log(req.session.messages);
    if (req.session.messages) {
        throw new UnauthorizedError(40000, req.session.messages[0]);
    } else {
        throw new UnauthorizedError(40001, "Error de input incompleto para estrategia de passport");
    }
})

router.get('/github', passport.authenticate('github'), (req, res) => { })
router.get('/githubcallback', passport.authenticate('github'), (req, res, next) => {
    req.session.user = req.user;
    res.redirect('/products');
})

export default router;