import { sendResponse } from '../middlewares/response.handler.js';
import { productsService } from "../services/repositories.service.js";
import ProductsDTO from '../dao/dto/products.dto.js';

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
        const result = await productsService.create(ProductsDTO.build(req.body));

        return sendResponse(201, { message: 'Producto creado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await productsService.update(ProductsDTO.build({ id: req.params.pid, ...req.body }));

        return sendResponse(201, { message: 'Producto actualizado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const remove = async (req, res, next) => {
    try {
        await productsManager.deleteProduct(req.params.pid);

        return sendResponse(201, { message: 'Producto eliminado exitosamente' })(req, res);
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
};
