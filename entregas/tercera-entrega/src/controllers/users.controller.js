import { sendResponse } from '../middlewares/response.handler.js';
import { usersService } from "../services/repositories.service.js";
import UsersDTO from '../dao/dto/users.dto.js';

const get = async (req, res, next) => {
    try {
        const result = await usersService.get();

        return sendResponse(200, { result: result })(req, res);
    } catch (error) {
        next(err);
    }
}

const getBy = async (req, res, next) => {
    try {
        const result = await usersService.getBy(UsersDTO.build({ name: req.params.name }));

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await usersService.create(UsersDTO.build(req.body));

        return sendResponse(201, { message: 'Usuario creado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

export default {
    get,
    getBy,
    create,
};
