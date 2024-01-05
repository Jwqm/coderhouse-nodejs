import { sendResponse } from '../middlewares/response.handler.js';
import { productsService } from "../services/repositories.service.js";
import ProductsDTO from '../dao/dto/products.dto.js';
import { generateProduct } from '../mocks/products.js';
import MailerService from '../services/mailer.service.js';
import DMailTemplates from '../constants/dmail.templates.js';

const mock = async (req, res, next) => {
    try {
        const result = generateProduct();

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const get = async (req, res, next) => {
    try {
        const result = await productsService.paginate(req.query);

        return sendResponse(200, { result: result })(req, res);
    } catch (error) {
        next(err);
    }
}

const getBy = async (req, res, next) => {
    try {
        const result = await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await productsService.create(ProductsDTO.build({ owner: req.user.id, ...req.body }));

        const mailerService = new MailerService();
        await mailerService.sendMail([req.user.email], DMailTemplates.CREATE_PRODUCT, { user: req.user, product: result });

        return sendResponse(201, { message: 'Producto creado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await productsService.update(ProductsDTO.build({ id: req.params.pid, ...req.body }));

        return sendResponse(200, { message: 'Producto actualizado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const remove = async (req, res, next) => {
    try {
        const result = await productsService.delete(ProductsDTO.build({ id: req.params.pid }), req.user);

        const mailerService = new MailerService();
        await mailerService.sendMail([req.user.email], DMailTemplates.REMOVE_PRODUCT, { user: req.user, product: result });

        return sendResponse(200, { message: 'Producto eliminado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

export default {
    get,
    getBy,
    create,
    remove,
    update,
    mock,
};
