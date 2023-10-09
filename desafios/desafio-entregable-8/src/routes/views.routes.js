import express from 'express';
import ProductsManager from '../dao/mongo/managers/products.manager.js';
import CartsManager from '../dao/mongo/managers/carts.manager.js';

const router = express.Router();
const productsManager = new ProductsManager();
const cartsManager = new CartsManager();

router.get("/products", auth, async (req, res, next) => {
    const result = await productsManager.getProductsPaginate(req.query);
    const products = result.payload;
    const currentPage = result.page;
    const { hasPrevPage, hasNextPage, prevPage, nextPage } = result;
    const idCart = req.session.temporaryCarts ? req.session.temporaryCarts.idCart : '';

    res.render("products", {
        user: req.session.user,
        products,
        idCart,
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
            const product = await productsManager.getProductById(id);
            return product;
        });

        products = await Promise.all(productPromises);
    }

    const totalPrice = products.reduce((total, product) => total + product.price, 0);

    res.render("carts", { products, totalPrice });
});

router.get('/products/detail/:pid', auth, async (req, res, next) => {
    const product = await productsManager.getProductById(req.params.pid);
    const { title, description, code, category, stock, price } = product;
    res.render("product", { title, description, code, category, stock, price });
});

router.post('/products/addToCart/:pid', auth, async (req, res, next) => {
    if (!req.session.temporaryCarts) {
        req.session.temporaryCarts = {
            idCart: '',
            products: []
        };
    }
    if (req.session.temporaryCarts.expiration) {
        const minuteDifference = (Date.now() - req.session.temporaryCarts.expiration) / (1000 * 60);
        if (minuteDifference > 5) {//Si supera los 5 minutos se hace limpieza del carrito de compras
            req.session.temporaryCarts.products = [];
            await cartsManager.deleteCart(req.session.temporaryCarts.idCart);
            req.session.temporaryCarts.idCart = '';
        }
    } else {
        req.session.temporaryCarts.expiration = Date.now();
    }
    if (!req.session.temporaryCarts.idCart) {
        const result = await cartsManager.addCart();
        req.session.temporaryCarts.idCart = result._id;
    }


    req.session.temporaryCarts.products.push(req.params.pid);

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

export default router;
