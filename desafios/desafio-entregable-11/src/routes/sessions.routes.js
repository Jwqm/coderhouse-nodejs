import express from 'express';
import passport from "passport";
import { BadRequestError, UnauthorizedError } from '../errors/custom.error.js';
import * as SessionsValidators from '../validators/sessions.validator.js';
import ValidationErrorHandler from '../middlewares/validation.error.handler.js';
import { sendResponse } from '../middlewares/response.handler.js';
import passportCall from "../middlewares/passport.call.js";
import executePolicies from "../middlewares/execute.policies.js";
import jwt from "jsonwebtoken";
import config from '../config/config.js';
import MailerService from '../services/mailer.service.js';
import DMailTemplates from '../constants/dmail.templates.js';
import UserDTO from '../dao/dto/users.dto.js';
import { usersService } from "../services/repositories.service.js";
import authService from '../services/auth.js';

const router = express.Router();

router.post('/register', executePolicies(["NO_AUTH"]), SessionsValidators.registerBody, ValidationErrorHandler, passportCall("register", { strategyType: "LOCALS" }), async (req, res, next) => {
    return sendResponse(201, { message: 'Usuario registrado correctamente' })(req, res);
})

router.post('/login', executePolicies(["NO_AUTH"]), SessionsValidators.loginBody, ValidationErrorHandler, passportCall("login", { strategyType: "LOCALS" }), async (req, res, next) => {
    req.session.user = req.user;
    const tokenizedUser = UserDTO.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: "1d" });
    res.cookie(config.jwt.COOKIE, token);
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
})

router.get('/authFail', ValidationErrorHandler, (req, res, next) => {
    if (req.session.messages) {
        throw new UnauthorizedError(40000, req.session.messages[0]);
    } else {
        throw new UnauthorizedError(40001, "Error de input incompleto para estrategia de passport");
    }
})

router.get('/github', executePolicies(["NO_AUTH"]), passport.authenticate('github'), (req, res) => { })
router.get('/githubcallback', executePolicies(["NO_AUTH"]), passport.authenticate('github'), (req, res, next) => {
    req.session.user = req.user;
    res.redirect('/products');
})
router.get('/current', executePolicies(["AUTH"]), (req, res, next) => {
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
})

router.get('/google', executePolicies(["NO_AUTH"]), passportCall('google', { scope: ['profile', 'email'], strategyType: 'OAUTH' }), (req, res) => { })
router.get('/googlecallback', executePolicies(["NO_AUTH"]), passportCall('google', { strategyType: 'OAUTH' }), async (req, res, next) => {
    req.session.user = req.user;
    try {
        //Enviar un correo de bienvenida
        const mailService = new MailerService();
        const result = await mailService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user })
    }
    catch (error) {
        console.log(`Falló envío de correo para ${req.user.email}`)
    }
    const tokenizedUser = UserDTO.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1d' });
    res.cookie(config.jwt.COOKIE, token);
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
})

router.post('/passwordRestoreRequest', executePolicies(["PUBLIC"]), async (req, res, next) => {
    const { email } = req.body;
    const user = await usersService.getBy(UserDTO.build({ email }));
    if (!user) throw new UnauthorizedError(40010, 'Usuario no existe');
    const token = jwt.sign({ email }, config.jwt.SECRET, { expiresIn: '1h' });
    const mailerService = new MailerService();
    await mailerService.sendMail([email], DMailTemplates.PWD_RESTORE, { token });
    return sendResponse(200, { message: 'Mail enviado' })(req, res);
});

router.put('/password-restore', executePolicies(["PUBLIC"]), async (req, res, next) => {
    const { newPassword, token } = req.body;
    if (!newPassword || !token) throw new BadRequestError(40020, 'Valores incompletos');
    try {
        //El token es válido?
        const { email } = jwt.verify(token, config.jwt.SECRET);
        //El usuario sí está en la base?
        const user = await usersService.getBy(UserDTO.build({ email }));
        if (!user) throw new UnauthorizedError(40021, 'Usuario no existe');

        //¿No será la misma contraseña que ya tiene?
        const isSamePassword = await authService.validatePassword(newPassword, user.password);
        if (isSamePassword) throw new UnauthorizedError(40022, 'La nueva contraseña no puede ser igual a la anterior');
        //Hashear mi nuevo password
        const hashNewPassword = await authService.createHash(newPassword);
        await usersService.update( {_id: user._id}, UserDTO.build({ password: hashNewPassword }));
        return sendResponse(200, { message: 'Mail enviado' })(req, res);

    } catch (error) {
        console.log(error);
        next(error);
        //throw new BadRequestError(40025,'Token invalido');
    }
});

export default router;