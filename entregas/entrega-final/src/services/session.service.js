import { v4 as uuidv4 } from 'uuid';

export default class SessionService {
    constructor(session) {
        this.session = session;
    }

    static build(session) {
        this.#generateShoppingCart(session);
        return new SessionService(session);
    }

    static #generateShoppingCart(session) {
        if (!session.shoppingCart) {
            this.#initShoppingCart(session);
        }

        if (session.shoppingCart.expiration) {
            const minuteDifference = (Date.now() - session.shoppingCart.expiration) / (1000 * 60);
            if (minuteDifference > 5) this.#initShoppingCart(session);
        }

        if (!session.shoppingCart.idCart) session.shoppingCart.idCart = uuidv4();

        return session.shoppingCart;
    }

    static #initShoppingCart(session) {
        session.shoppingCart = {};
        session.shoppingCart.idCart = '';
        session.shoppingCart.products = [];
        session.shoppingCart.expiration = Date.now();
    }

    getShoppingCart() {
        return this.session.shoppingCart;
    }

    cleanShoppingCart() {
        SessionService.#initShoppingCart(this.session);
    }

    updateStockProducts(products) {
        if (this.session.shoppingCart && this.session.shoppingCart.products) {
            products.forEach(product => {
                const matchingProduct = this.session.shoppingCart.products.find(item => item.id === product.id);
                if (matchingProduct) {
                    product.stock = matchingProduct.stock;
                }
            });
        }
    }

    getProductBy(id) {
        return this.session.shoppingCart.products.find(item => item.id === id);
    }

    addToShoppingCart(product) {
        const existingProduct = this.session.shoppingCart.products.find(item => item.id === product.id);
        if (existingProduct && existingProduct.stock >= 1) {
            existingProduct.quantity += 1;
            existingProduct.stock -= 1;
        } else if (product.stock >= 1) {
            product.stock -= 1;
            product.quantity = 1;
            this.session.shoppingCart.products.push(product);
        }
    }
}