import { v4 as uuidv4 } from 'uuid';
import ProductsDTO from '../dao/dto/products.dto.js';

export default class SessionService {
    constructor(session) {
        this.session = session;
    }

    static build(session) {
        this.generateTemporaryCarts(session);
        return new SessionService(session);
    }

    static generateTemporaryCarts(session) {
        if (!session.temporaryCarts) {
            session.temporaryCarts = { idCart: '', products: [] };
        }

        if (session.temporaryCarts.expiration) {
            const minuteDifference = (Date.now() - session.temporaryCarts.expiration) / (1000 * 60);
            if (minuteDifference > 5) {
                session.temporaryCarts.products = [];
                session.temporaryCarts.idCart = '';
                session.temporaryCarts.expiration = Date.now();
            }
        } else {
            session.temporaryCarts.expiration = Date.now();
        }

        if (!session.temporaryCarts.idCart) session.temporaryCarts.idCart = uuidv4();

        return session.temporaryCarts;
    }

    getTemporaryCarts() {
        return this.session.temporaryCarts;
    }

    updateStockProducts(products) {
        if (this.session.temporaryCarts && this.session.temporaryCarts.products) {
            products.forEach(product => {
                const matchingProduct = this.session.temporaryCarts.products.find(item => item.id === product.id);
                if (matchingProduct) {
                    product.stock = matchingProduct.stock;
                }
            });
        }
    }

    getProductBy(id) {
        return this.session.temporaryCarts.products.find(item => item.id === id);
    }

    async getProductsAndCarts(req) {
        const products = await productsService.paginate(req.query);
        const temporaryCarts = this.getTemporaryCarts();
        this.updateStockProductsBySession(products.payload, temporaryCarts);
        return { products, temporaryCarts };
    }

    async getCartProductsAndTotalPrice(req) {
        let products = [];
        if (this.session.temporaryCarts) {
            products = await Promise.all(
                this.session.temporaryCarts.products.map(async (item) => {
                    const product = this.getProductBySession(item.id, this.session.temporaryCarts) || await productsService.getBy(ProductsDTO.build({ id: req.params.pid }));
                    if (!product.quantity) product.quantity = 0;
                    return product;
                })
            );
        }

        const totalPrice = products.reduce((total, product) => total + product.price, 0);
        return { products, totalPrice };
    }

    addProductToCart(product) {
        const existingProduct = this.session.temporaryCarts.products.find(item => item.id === product.id);
        if (existingProduct && existingProduct.stock >= 1) {
            existingProduct.quantity += 1;
            existingProduct.stock -= 1;
        } else if (product.stock >= 1) {
            product.stock -= 1;
            product.quantity = 1;
            this.session.temporaryCarts.products.push(product);
        }
    }
}