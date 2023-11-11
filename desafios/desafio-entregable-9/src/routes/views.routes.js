import express from 'express';
import { productsService } from "../services/repositories.service.js";
import ProductsDTO from '../dao/dto/products.dto.js';
import SessionService from '../services/session.service.js';
import { cartsService } from '../services/repositories.service.js';
import { purchaseService } from '../services/purchase.service.js';
import UserDTO from '../dao/dto/users.dto.js';

const router = express.Router();

router.use((req, res, next) => {
    req.sessionService = SessionService.build(req.session);
    next();
});

router.get("/products", auth(["NO_AUTH"]), products);

router.get('/carts/:cid', auth(["USER"]), cartBy);

router.get('/products/detail/:pid', auth(["USER"]), productDetail);

router.post('/products/addToShoppingCart/:pid', auth(["USER"]), addToShoppingCart);

router.post('/purchase', auth(["USER"]), purchase);

router.get('/', auth(["NO_AUTH"]), profile);

router.get('/register', renderRegisterPage);

router.get('/login', renderLoginPage);

router.get('/logout', logout);

function auth(role) {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        if (role[0] === "NO_AUTH") return next();
        if (!role.includes(req.session.user.role.toUpperCase())) {
            return res.redirect(`/products`);
        }
        return next();
    };
}

async function products(req, res, next) {
    const result = await productsService.paginate(req.query);
    req.sessionService.updateStockProducts(result.payload);
    const shoppingCart = req.sessionService.getShoppingCart();
    res.render("products", {
        user: req.session.user,
        products: result.payload,
        idCart: shoppingCart.products.length > 0 ? shoppingCart.idCart : undefined,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
    });
}

async function cartBy(req, res, next) {
    const shoppingCart = req.sessionService.getShoppingCart();
    let products = [];

    if (shoppingCart) {
        const productPromises = shoppingCart.products.map(async (item) => {
            const product = req.sessionService.getProductBy(item.id) || await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));
            if (!product.quantity) product.quantity = 0;
            return product;
        });

        products = await Promise.all(productPromises);
    }

    const totalPrice = products.reduce((total, product) => total + product.price, 0);

    res.render("carts", { products, totalPrice });
}

async function productDetail(req, res, next) {
    const product = req.sessionService.getProductBy(req.params.pid) || await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));
    res.render("product", product);
}

async function addToShoppingCart(req, res, next) {
    const productDTOSearch = req.sessionService.getProductBy(req.params.pid) || await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));
    req.sessionService.addToShoppingCart(productDTOSearch);
    res.redirect(`/products`);
}

async function purchase(req, res, next) {
    const shoppingCart = req.sessionService.getShoppingCart();
    let cartDTO;

    if (shoppingCart) {
        cartDTO = await cartsService.create();

        if (!cartDTO) {
            res.render("errors", { errorMessage: 'No se pudo crear el carrito.' });
        }

        const productsDTO = shoppingCart.products;
        const result = await purchaseService.purchase(cartDTO, productsDTO, true);

        if (result.update) {
            req.sessionService.cleanShoppingCart();
            const ticketDTO = await purchaseService.register(req.session.user, result.products);
            return res.render('ticket', { ticket: ticketDTO });
        } else {
            shoppingCart.products = [result.products];
        }

        return res.redirect(`/products`);
    } else {
        await cartsService.delete(cartDTO);
        res.render("errors", { errorMessage: 'No se pudo procesar la compra.' });
    }
}

function profile(req, res, next) {
    const userSession = req.session.user;
    const userDTO = UserDTO.build({ name: userSession.firstName, lastname: userSession.lastName, age: userSession.age, email: userSession.email });
    res.render('profile', { user: userDTO });
}

function renderRegisterPage(req, res) {
    res.render('register');
}

function renderLoginPage(req, res) {
    res.render('login');
}

function logout(req, res) {
    req.session.destroy(error => {
        return res.redirect('/');
    });
}

export default router;
