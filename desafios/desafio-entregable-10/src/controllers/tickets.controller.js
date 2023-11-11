import { sendResponse } from '../middlewares/response.handler.js';
import { ticketsService } from "../services/repositories.service.js";
import TicketsDTO from '../dao/dto/tickets.dto.js';

const get = async (req, res, next) => {
    try {
        const result = await ticketsService.get();

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const getBy = async (req, res, next) => {
    try {
        const result = await ticketsService.getBy(TicketsDTO.build({ id: req.params.id }));

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await ticketsService.create(TicketsDTO.build(req.body));

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
