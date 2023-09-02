import express from 'express';
import ProductsManager from '../manager/products.manager.js';

const router = express.Router();
const productsManager = new ProductsManager();

router.get("/", async (req, res) => {
    const productsList = await productsManager.getProducts();
    res.render("home", { productsList });
});

router.get("/realTimeProducts", async (req, res) => {
    const productsList = await productsManager.getProducts();
    res.render("realTimeProducts", { productsList });
});

export default router;
