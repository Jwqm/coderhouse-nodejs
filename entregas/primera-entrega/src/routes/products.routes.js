const express = require('express');
const router = express.Router();
const ProductsController = require('../controller/products.controller.js');
const ProductsValidators = require('../validators/products.validators.js');
const ValidationErrorHandler = require('../middlewares/validation.error.handler.js');

router.get('/products', ProductsValidators.getProductsValidator, ValidationErrorHandler, ProductsController.getProducts);
router.get('/products/:pid', ProductsValidators.getProductByIdValidator, ValidationErrorHandler, ProductsController.getProductById);
router.post('/products', ProductsValidators.addProductValidator, ValidationErrorHandler, ProductsController.addProduct);
router.put('/products/:pid', ProductsValidators.updateProductValidator, ValidationErrorHandler, ProductsController.updateProduct);
router.delete('/products/:pid', ProductsValidators.getProductByIdValidator, ValidationErrorHandler, ProductsController.deleteProductById);

module.exports = router;