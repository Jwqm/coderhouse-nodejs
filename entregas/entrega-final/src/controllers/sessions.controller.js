import { BadRequestError, UnauthorizedError } from '../errors/custom.error.js';
import { sendResponse } from '../middlewares/response.handler.js';
import jwt from "jsonwebtoken";
import config from '../config/config.js';
import MailerService from '../services/mailer.service.js';
import DMailTemplates from '../constants/dmail.templates.js';
import UsersDTO from '../dao/dto/users.dto.js';
import { usersService } from "../services/repositories.service.js";
import authService from '../services/auth.js';

const register = async (req, res) => {
    return sendResponse(201, { message: 'Usuario registrado correctamente' })(req, res);
}

const login = async (req, res) => {
    const tokenizedUser = UsersDTO.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: "1d" });
    res.cookie(config.jwt.COOKIE, token);
    req.session.user = req.user;

    await usersService.update(tokenizedUser.id.toString(), UsersDTO.build({ last_connection: new Date() }));

    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
}

const logout = async (req, res) => {
    if (req.session.user) {
        const tokenizedUser = UsersDTO.getTokenDTOFrom(req.session.user);
        await usersService.update(tokenizedUser.id.toString(), UsersDTO.build({ last_connection: new Date() }));

        // Limpia la cookie
        res.clearCookie(config.jwt.COOKIE);
    }
    // Destruye la sesión
    req.session.destroy(err => {
        if (err) {
            console.error('Error al destruir la sesión:', err);
            return sendResponse(500, { error: 'Error interno del servidor' })(req, res);
        }
    });

    return sendResponse(200, { message: 'Usuario deslogueado correctamente' })(req, res);
}

const authFail = async (req, res, next) => {
    if (req.session.messages) {
        throw new UnauthorizedError(40000, req.session.messages[0]);
    } else {
        throw new UnauthorizedError(40001, "Error de input incompleto para estrategia de passport");
    }
}

const current = async (req, res) => {
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
}

const applyGoogleCallback = async (req, res) => {
    req.session.user = req.user;
    try {
        //Enviar un correo de bienvenida
        const mailerService = new MailerService();
        const result = await mailerService.sendMail([req.user.email], DMailTemplates.WELCOME, { user: req.user })
    }
    catch (error) {
        console.log(`Falló envío de correo para ${req.user.email}`)
    }
    const tokenizedUser = UsersDTO.getTokenDTOFrom(req.user);
    const token = jwt.sign(tokenizedUser, config.jwt.SECRET, { expiresIn: '1d' });
    res.cookie(config.jwt.COOKIE, token);
    return sendResponse(200, { message: 'Usuario logueado correctamente' })(req, res);
}

const passwordRestoreRequest = async (req, res) => {
    const { email } = req.body;
    const user = await usersService.getBy(UsersDTO.build({ email }));
    if (!user) throw new UnauthorizedError(40010, 'Usuario no existe');
    const token = jwt.sign({ email }, config.jwt.SECRET, { expiresIn: '1h' });
    const mailerService = new MailerService();
    await mailerService.sendMail([email], DMailTemplates.PWD_RESTORE, { token });
    return sendResponse(200, { message: 'Mail enviado' })(req, res);
};

const restorePassword = async (req, res, next) => {
    const { newPassword, token } = req.body;
    if (!newPassword || !token) throw new BadRequestError(40020, 'Valores incompletos');
    try {
        //El token es válido?
        const { email } = jwt.verify(token, config.jwt.SECRET);
        //El usuario sí está en la base?
        const user = await usersService.getBy(UsersDTO.build({ email }));
        if (!user) throw new UnauthorizedError(40021, 'Usuario no existe');

        //¿No será la misma contraseña que ya tiene?
        const isSamePassword = await authService.validatePassword(newPassword, user.password);
        if (isSamePassword) throw new UnauthorizedError(40022, 'La nueva contraseña no puede ser igual a la anterior');
        //Hashear mi nuevo password
        const hashNewPassword = await authService.createHash(newPassword);
        await usersService.update(user._id, UsersDTO.build({ password: hashNewPassword }));
        return sendResponse(200, { message: 'Mail enviado' })(req, res);

    } catch (error) {
        next(error);
    }
};

export default {
    applyGoogleCallback,
    current,
    login,
    logout,
    passwordRestoreRequest,
    register,
    restorePassword,
    authFail
}