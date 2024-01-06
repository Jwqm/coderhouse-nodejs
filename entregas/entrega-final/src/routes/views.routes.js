import express from 'express';
import { usersService, productsService, cartsService } from "../services/repositories.service.js";
import ProductsDTO from '../dao/dto/products.dto.js';
import SessionService from '../services/session.service.js';
import { purchaseService } from '../services/purchase.service.js';
import UsersDTO from '../dao/dto/users.dto.js';
import config from '../config/config.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.use((req, res, next) => {
    req.sessionService = SessionService.build(req.session);
    next();
});

router.get("/products", auth(["NO_AUTH"]), products);

router.get("/users", auth(["ADMIN"]), users);

router.get('/carts/:cid', auth(["USER"]), cartBy);

router.get('/products/detail/:pid', auth(["USER"]), productDetail);

router.post('/products/addToShoppingCart/:pid', auth(["USER"]), addToShoppingCart);

router.post('/purchase', auth(["USER"]), purchase);

router.get('/', auth(["PUBLIC"]), profile);

router.get('/register', renderRegisterPage);

router.get('/login', renderLoginPage);

router.get('/logout', logout);

router.get('/password-restore', auth(["NO_AUTH"]), passwordRestore);

function auth(role) {
    return (req, res, next) => {
        if (role[0] === "NO_AUTH" || role[0] === "PUBLIC") return next();
        if (!req.session.user) {
            return res.redirect('/login');
        }
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
        isAdmin: (req.session.user?.role === 'admin') || false,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevPage: result.prevPage,
        nextPage: result.nextPage
    });
}

async function users(req, res, next) {
    const result = await usersService.get();
    res.render('users', { users: result });
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

async function passwordRestore(req, res) {
    const { token } = req.query;
    if (!token) return res.render('RestorePasswordError', { error: 'Ruta inválida, favor de solicitar un nuevo link de restablecimiento' });
    //El hecho de que me pase un token, NO SIGNIFICA QUE YA SEA VÁLIDO, falta corroborar:
    //1. ¿El token está expirado?
    //2. ¿El token siquiera es válido?
    try {
        jwt.verify(token, config.jwt.SECRET);
        res.render('PasswordRestore');
    } catch (error) {
        if (error.expiredAt) {
            return res.render('RestorePasswordError', { error: "El link de este correo expiró, favor de solicitar un nuevo correo" });
        }
        res.render('RestorePasswordError', { error: 'Link inválido o corrupto, favor de solicitar un nuevo correo' });
    }
}

function profile(req, res, next) {
    const userSession = req.session.user;
    if (!userSession) return res.redirect('/login');
    const usersDTO = UsersDTO.build({ firstname: userSession.firstName, lastname: userSession.lastName, age: userSession.age, email: userSession.email });
    res.render('profile', { user: usersDTO });
}

function renderRegisterPage(req, res) {
    res.render('register');
}

function renderLoginPage(req, res) {
    res.render('login');
}

async function logout(req, res) {
    if (req.session.user) {
        const tokenizedUser = UsersDTO.getTokenDTOFrom(req.session.user);
        await usersService.update(tokenizedUser.id.toString(), UsersDTO.build({ last_connection: new Date() }));

        // Limpia la cookie
        res.clearCookie(config.jwt.COOKIE);
    }

    // Destruye la sesión
    req.session.destroy(err => {
        return res.redirect('/');
    });
}

export default router;
