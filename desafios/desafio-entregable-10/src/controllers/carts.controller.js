import { sendResponse } from '../middlewares/response.handler.js';
import { cartsService } from "../services/repositories.service.js";
import CartsDTO from '../dao/dto/carts.dto.js';

const get = async (req, res, next) => {
    try {
        const carts = await cartsService.get();
        let limit = req.query.limit;

        return sendResponse(200, limit ? { result: carts.slice(0, limit) } : { result: carts })(req, res);
    } catch (err) {
        next(err);
    }
}

const getBy = async (req, res, next) => {
    try {
        const result = await cartsService.getBy(CartsDTO.build({ id: req.params.cid }));

        return sendResponse(200, { result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await cartsService.create();
        return sendResponse(201, { message: 'Carrito de compra creado exitosamente', result: result })(req, res);
    } catch (err) {
        next(err);
    }
}

const updateBy = async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;

        const result = await cartsService.updateWithProduct(CartsDTO.build({ id: req.params.cid }), [{ idProduct: req.params.pid, quantity: units }], true);

        return sendResponse(200, result.update === true ?
            { message: 'Producto actualizado exitosamente al carrito de compras', result } :
            { message: 'Error al actualizar el producto al carrito de compras', result })(req, res);
    } catch (err) {
        next(err);
    }
}

const purchase = async (req, res, next) => {
    try {
        const result = await cartsService.updateWithProduct(CartsDTO.build({ id: req.params.cid }), req.body.products, true);

        return sendResponse(200, result.update === true ?
            { message: 'Se ortorgaron los productos del carrito de compras', result } :
            { message: 'Error al otorgar los productos al carrito de compras', result })(req, res);
    } catch (err) {
        next(err);
    }
}

const update = async (req, res, next) => {
    try {
        const result = await cartsService.updateWithProduct(CartsDTO.build({ id: req.params.cid }), req.body.products, true);

        return sendResponse(200, result.update === true ?
            { message: 'Producto actualizado exitosamente al carrito de compras', result } :
            { message: 'Error al actualizar el producto al carrito de compras', result })(req, res);
    } catch (err) {
        next(err);
    }
}

const remove = async (req, res, next) => {
    try {
        await cartsService.delete(CartsDTO.build({ id: req.params.cid }));

        return sendResponse(200, { message: 'Carrito de compras eliminado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
}

const removeBy = async (req, res, next) => {
    try {
        const units = parseInt(req.params.units) || 1;

        const result = await cartsService.updateWithProduct(CartsDTO.build({ id: req.params.cid }), [{ idProduct: req.params.pid, quantity: units }], false);

        return sendResponse(200, result.update === true ?
            { message: 'Producto actualizado exitosamente al carrito de compras', result } :
            { message: 'Error al actualizar el producto al carrito de compras', result })(req, res);
    } catch (err) {
        next(err);
    }
}

export default {
    get,
    getBy,
    create,
    purchase,
    remove,
    removeBy,
    update,
    updateBy,
};
