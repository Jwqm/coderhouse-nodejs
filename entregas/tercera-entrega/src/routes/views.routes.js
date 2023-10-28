import express from 'express';
import ProductsManager from '../dao/mongo/managers/products.manager.js';
import CartsManager from '../dao/mongo/managers/carts.manager.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

router.get("/products", auth, async (req, res, next) => {
    const result = await productsManager.getProductsPaginate(req.query);
    const products = result.payload;
    const currentPage = result.page;
    const { hasPrevPage, hasNextPage, prevPage, nextPage } = result;
    const temporaryCarts = getTemporaryCartsBySession(req.session);

    updateStockProductsBySession(products, temporaryCarts);

    res.render("products", {
        user: req.session.user,
        products,
        idCart: temporaryCarts.idCart,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    });
});

router.get('/carts/:cid', auth, async (req, res, next) => {
    let products = [];
    if (req.session.temporaryCarts) {
        const productIds = req.session.temporaryCarts.products;

        const productPromises = productIds.map(async (id) => {
            const product = getProductBySession(id, req.session.temporaryCarts) || await productsManager.getProductById(id);
            if (!product.quantity) product.quantity = 0;
            return product;
        });

        products = await Promise.all(productPromises);
    }

    const totalPrice = products.reduce((total, product) => total + product.price, 0);

    res.render("carts", { products, totalPrice });
});

router.get('/products/detail/:pid', auth, async (req, res, next) => {
    const product = getProductBySession(req.params.pid, req.session.temporaryCarts) || await productsManager.getProductById(req.params.pid);
    const { title, description, code, category, stock, price } = product;
    res.render("product", { title, description, code, category, stock, price });
});

router.post('/products/addToCart/:pid', auth, async (req, res, next) => {
    const temporaryCarts = getTemporaryCartsBySession(req.session);
    if (temporaryCarts.expiration) {
        const minuteDifference = (Date.now() - temporaryCarts.expiration) / (1000 * 60);
        if (minuteDifference > 5) {//Si supera los 5 minutos se hace limpieza del carrito de compras
            temporaryCarts.products = [];
            temporaryCarts.idCart = '';
            temporaryCarts.expiration = Date.now();
        }
    } else {
        temporaryCarts.expiration = Date.now();
    }
    if (!temporaryCarts.idCart) {
        temporaryCarts.idCart = uuidv4();
    }

    const product = await productsManager.getProductById(req.params.pid);
    product.id = product._id.toString();

    addProductToCartBySession(product, temporaryCarts);

    res.redirect(`/products`);
});

router.get('/', auth, async (req, res, next) => {
    res.render('profile', { user: req.session.user });
})

router.get('/register', async (req, res) => {
    res.render('register')
})

router.get('/login', async (req, res) => {
    res.render('login')
})

router.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        return res.redirect('/');
    });
})

function auth(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    return next();
}


function addProductToCartBySession(product, temporaryCarts) {
    const existingProduct = temporaryCarts.products.find(item => item.id === product.id);
    if (existingProduct && existingProduct.stock > 0) {
        existingProduct.quantity += 1;
        existingProduct.stock -= 1;
    } else if (product.stock > 0) {
        product.stock -= 1;
        product.quantity = 1;
        temporaryCarts.products.push(product);
    }
}

function updateStockProductsBySession(products, temporaryCarts) {
    if (temporaryCarts && temporaryCarts.products) {
        products.forEach(product => {
            const matchingProduct = temporaryCarts.products.find(item => item.id === product.id);
            if (matchingProduct) {
                product.stock = matchingProduct.stock;
            }
        });
    }
}

function getProductBySession(id, temporaryCarts) {
    return temporaryCarts.products.find(item => item.id === id);
}

function getTemporaryCartsBySession(session) {
    if (!session.temporaryCarts)
        session.temporaryCarts = { idCart: '', products: [] };
    return session.temporaryCarts;
}

export default router;
