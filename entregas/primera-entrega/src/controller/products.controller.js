const ProductsManager = require('../manager/products.manager.js');
const sendResponse = require('../middlewares/response.handler.js');

const controller = {};
controller.name = "Products"
const productsManager = new ProductsManager();


controller.getProducts = async (req, res, next) => {
    try {
        const products = await productsManager.getProducts();
        const limit = req.query.limit;

        return sendResponse(200, limit ? products.slice(0, limit) : products)(req, res);
    } catch (err) {
        next(err);
    }
};

controller.getProductById = async (req, res, next) => {
    try {
        const pid = parseInt(req.params.pid);
        const product = await productsManager.getProductById(pid);

        return sendResponse(200, product)(req, res);
    } catch (err) {
        next(err);
    }
};

controller.addProduct = async (req, res, next) => {
    try {
        await productsManager.addProduct(req.body);

        return sendResponse(201, { message: 'Producto creado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
};

controller.updateProduct = async (req, res, next) => {
    try {
        const pid = parseInt(req.params.pid);
        await productsManager.updateProduct({ ...req.body, id: pid });

        return sendResponse(201, { message: 'Producto actualizado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
};

controller.deleteProductById = async (req, res, next) => {
    try {
        const pid = parseInt(req.params.pid);
        await productsManager.deleteProduct(pid);

        return sendResponse(201, { message: 'Producto eliminado exitosamente' })(req, res);
    } catch (err) {
        next(err);
    }
};

module.exports = controller;