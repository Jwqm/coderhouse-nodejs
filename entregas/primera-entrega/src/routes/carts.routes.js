const express = require('express');
const router = express.Router();
const CartsController = require('../controller/carts.controller.js');
const CartsValidators = require('../validators/carts.validators.js');
const ValidationErrorHandler = require('../middlewares/validation.error.handler.js');

router.get('/carts', CartsValidators.getCartValidator, ValidationErrorHandler, CartsController.getCards);
router.get('/carts/:cid', CartsValidators.getCartByIdValidator, ValidationErrorHandler, CartsController.getCartById);
router.post('/carts', CartsValidators.creatCartValidator, ValidationErrorHandler, CartsController.createCart);
router.post('/carts/:cid/product/:pid', CartsValidators.updateCartAndProduct, ValidationErrorHandler, CartsController.updateCartAndProduct);
router.post('/carts/:cid/product/:pid/:units', CartsValidators.updateCartAndProduct, ValidationErrorHandler, CartsController.updateCartAndProduct);
router.delete('/carts/:cid', CartsValidators.getCartByIdValidator, ValidationErrorHandler, CartsController.deleteCartById);
router.delete('/carts/:cid/product/:pid', CartsValidators.updateCartAndProduct, ValidationErrorHandler, CartsController.updateCartAndProduct);
router.delete('/carts/:cid/product/:pid/:units', CartsValidators.updateCartAndProduct, ValidationErrorHandler, CartsController.updateCartAndProduct);

module.exports = router;