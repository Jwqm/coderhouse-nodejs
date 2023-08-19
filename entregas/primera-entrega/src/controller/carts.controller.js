const CartsManager = require('../manager/carts.manager.js');
const ProductsManager = require('../manager/products.manager.js');
const sendResponse = require('../middlewares/response.handler.js');


const controller = {};
controller.name = "Carts"
const cartsManager = new CartsManager();
const productsManager = new ProductsManager();

controller.createCart = async (req, res, next) => {
    try {
        await cartsManager.createCart();

        return sendResponse(201, { message: 'Carrito de compra creado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
};

controller.getCards = async (req, res, next) => {
    try {
        const carts = await cartsManager.getCarts();
        let limit = req.query.limit;

        return sendResponse(200, limit ? carts.slice(0, limit) : carts)(req, res);
    } catch (err) {
        next(err);
    }
};

controller.getCartById = async (req, res, next) => {
    try {
        const cid = parseInt(req.params.cid);
        const cart = await cartsManager.getCartById(cid);

        return sendResponse(200, cart)(req, res);
    } catch (err) {
        next(err);
    }
};

controller.updateCartAndProduct = async (req, res, next) => {
    try {
        const pid = parseInt(req.params.pid);
        const cid = parseInt(req.params.cid);
        const units = parseInt(req.params.units) || 1;
        const addProduct = req.method === 'POST' ? true : false;

        await cartsManager.updateCartAndProduct(cid, pid, units, addProduct);

        return sendResponse(200, { message: 'Producto actualizado exitosamente al carrito de compras' })(req, res);
    } catch (err) {
        next(err);
    }
};

controller.deleteCartById = async (req, res, next) => {
    try {
        const cid = parseInt(req.params.cid);
        await cartsManager.deleteCart(cid);

        return sendResponse(200, { message: 'Carrito de compras eliminado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
};

module.exports = controller;