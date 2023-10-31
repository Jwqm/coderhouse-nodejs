import express from 'express';
import { productsService } from "../services/repositories.service.js";
import ProductsDTO from '../dao/dto/products.dto.js';
import SessionService from '../services/session.service.js';
import { cartsService } from '../services/repositories.service.js';
import { purchaseService } from '../services/purchase.service.js';
import UserDTO from '../dao/dto/users.dto.js';

const router = express.Router();

router.get("/products", auth, async (req, res, next) => {
    const result = await productsService.paginate(req.query);
    const products = result.payload;
    const currentPage = result.page;
    const { hasPrevPage, hasNextPage, prevPage, nextPage } = result;
    const sessionService = SessionService.build(req.session);
    sessionService.updateStockProducts(products);
    const temporaryCarts = sessionService.getTemporaryCarts();

    res.render("products", {
        user: req.session.user,
        products,
        idCart: temporaryCarts.products.length > 0 ? temporaryCarts.idCart : undefined,
        page: currentPage,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage
    });
});

router.get('/carts/:cid', auth, async (req, res, next) => {
    const sessionService = SessionService.build(req.session);
    let products = [];
    if (req.session.temporaryCarts) {
        const productPromises = req.session.temporaryCarts.products.map(async (item) => {
            const product = sessionService.getProductBy(item.id) || await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));
            if (!product.quantity) product.quantity = 0;
            return product;
        });

        products = await Promise.all(productPromises);
    }

    const totalPrice = products.reduce((total, product) => total + product.price, 0);

    res.render("carts", { products, totalPrice });
});

router.get('/products/detail/:pid', auth, async (req, res, next) => {
    const product = SessionService.build(req.session).getProductBy(req.params.pid) || await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));
    res.render("product", product);
});

router.post('/products/addToCart/:pid', auth, async (req, res, next) => {
    const sessionService = SessionService.build(req.session);
    const productDTOSearch = sessionService.getProductBy(req.params.pid) || await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));
    sessionService.addProductToCart(productDTOSearch);

    res.redirect(`/products`);
});

router.post('/purchase', auth, async (req, res, next) => {
    const sessionService = SessionService.build(req.session);
    const temporaryCarts = sessionService.getTemporaryCarts();
    let cartDTO;
    if (temporaryCarts) {
        cartDTO = await cartsService.create();
        if (!cartDTO) res.render("errors", { errorMessage: 'No se pudo crear el carrito.' });
        const productsDTO = temporaryCarts.products;
        const result = await purchaseService.purchase(cartDTO, productsDTO, true);
        if (result) {
            sessionService.getTemporaryCarts().products = result.failedProducts;
            if (result.suscessProducts) {
                const ticket = await purchaseService.register(req.session.user, result.suscessProducts);
                const { code, mail, amount, date } = ticket;
                return res.render("ticket", { code, amount, mail, date });
            }
        }
        return res.redirect(`/products`);
    } else {
        await cartsService.delete(cartDTO);
        res.render("errors", { errorMessage: 'No se pudo procesar la compra.' });
    }
});

router.get('/', auth, async (req, res, next) => {
    const userSession = req.session.user;
    const userDTO = UserDTO.build({ name: userSession.firstName, lastname: userSession.lastName, age: userSession.age, email: userSession.email })
    res.render('profile', { user: userDTO });
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
