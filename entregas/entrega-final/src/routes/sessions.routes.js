import express from 'express';
import passport from "passport";
import * as SessionsValidators from '../validators/sessions.validator.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import passportCall from "../middlewares/passport.call.js";
import executePolicies from "../middlewares/execute.policies.js";
import SessionsController from '../controllers/sessions.controller.js';


const router = express.Router();

router.post('/register', executePolicies(["NO_AUTH"]), SessionsValidators.registerBody, ValidationErrorHandler, passportCall("register", { strategyType: "LOCALS" }), SessionsController.register);

router.post('/login', executePolicies(["NO_AUTH"]), SessionsValidators.loginBody, ValidationErrorHandler, passportCall("login", { strategyType: "LOCALS" }), SessionsController.login);

router.post('/logout', SessionsValidators.loginBody, ValidationErrorHandler, passportCall("login", { strategyType: "LOCALS" }), SessionsController.logout);

router.get('/authFail', ValidationErrorHandler, SessionsController.authFail);

router.get('/github', executePolicies(["NO_AUTH"]), passport.authenticate('github'), (req, res) => { })
router.get('/githubcallback', executePolicies(["NO_AUTH"]), passport.authenticate('github'), (req, res, next) => {
    req.session.user = req.user;
    res.redirect('/products');
})

router.get('/current', executePolicies(["AUTH"]), SessionsController.current);

router.get('/google', executePolicies(["NO_AUTH"]), passportCall('google', { scope: ['profile', 'email'], strategyType: 'OAUTH' }), (req, res) => { })
router.get('/googlecallback', executePolicies(["NO_AUTH"]), passportCall('google', { strategyType: 'OAUTH' }), SessionsController.applyGoogleCallback);

router.post('/passwordRestoreRequest', executePolicies(["PUBLIC"]), SessionsController.passwordRestoreRequest);

router.put('/password-restore', executePolicies(["PUBLIC"]), SessionsController.restorePassword);

export default router;