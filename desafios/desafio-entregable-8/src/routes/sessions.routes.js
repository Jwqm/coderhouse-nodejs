import express from 'express';
import passport from "passport";
import { UnauthorizedError } from '../errors/custom.error.js';
import * as SessionsValidators from '../validators/sessions.validator.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import { sendResponse } from '../middlewares/response.handler.js';
import passportCall from "../middlewares/passport.call.js";
import executePolicies from "../middlewares/execute.policies.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post('/register', executePolicies(["NO_AUTH"]), SessionsValidators.registerBody, ValidationErrorHandler, passportCall("register", { strategyType: "LOCALS" }), async (req, res, next) => {
    return sendResponse(201, { message: 'Usuario registrado correctamente' })(req, res);
})

router.post('/login', executePolicies(["NO_AUTH"]), SessionsValidators.loginBody, ValidationErrorHandler, passportCall("login", { strategyType: "LOCALS" }), async (req, res, next) => {
    req.session.user = req.user;
    const tokenizedUser = {
        name: `${req.user.firstName} ${req.user.lastName}`,
        id: req.user._id,
        role: req.user.role,
    };
    const token = jwt.sign(tokenizedUser, "jwtSecret", { expiresIn: "1d" });
    res.cookie("authCookie", token);
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
})

router.get('/authFail', ValidationErrorHandler, (req, res, next) => {
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

router.get('/current', executePolicies(["AUTH"]), (req, res, next) => {
    console.log(req.user);
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
})

export default router;