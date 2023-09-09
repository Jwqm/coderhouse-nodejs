import cartModel from "../model/carts.js";
import { NotFoundError, CustomError } from '../../../errors/custom.error.js';
import ProductsManager from "./products.manager.js";


export default class CartsManager {
    productsManager;

    constructor() {
        this.productsManager = new ProductsManager();
    }

    addCart = async () => {
        try {
            return await cartModel.create({});
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20101, 'Error al crear el carrito de compra');
        }
    }

    getCartById = async (id) => {
        try {
            const cart = await cartModel.findById({ _id: id }).lean();
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20112, 'Error al obtener el carrito de compra');
        }
    }

    getCarts = async () => {
        try {
            return await cartModel.find().lean();
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20110, 'Error al obtener el carrito de compra');
        }
    }

    updateCartAndProduct = async (idCard, idProduct, quantity, addProduct) => {
        try {
            const product = await this.productsManager.getProductById(idProduct);
            const cart = await this.getCartById(idCard);

            if (addProduct) {
                if (product.stock < quantity) {
                    throw new CustomError(10015, `Error solo quedan en stock ${product.stock} productos`);
                }
                product.stock -= quantity;
            } else {
                product.stock += quantity;
            }

            if (!cart.detailCart || cart.detailCart.length === 0) {
                await cartModel.updateOne({ _id: idCard }, {
                    $set: {
                        detailCart: {
                            _id: product._id,
                            quantity: quantity,
                        }
                    }
                });
            }
            else {
                const detailCart = cart.detailCart[0];
                if (addProduct) {
                    detailCart.quantity += quantity;
                } else {
                    if (detailCart.quantity < units) {
                        throw new CustomError(10016, `Error solo puede quitar ${detailCart.quantity} productos del carrito de compras`);
                    }
                    detailCart.quantity -= quantity;
                }
                await cartModel.updateOne({ _id: cart._id, 'detailCart._id': detailCart._id }, {
                    $set: {
                        'detailCart.$.quantity': detailCart.quantity,
                    }
                });
            }

            await this.productsManager.updateProduct({ id: product._id, stock: product.stock });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra');
        }
    }

    deleteCart = async (id) => {
        try {
            const cart = await cartModel.findByIdAndDelete({ _id: id }).lean();
            if (!cart) throw new NotFoundError(20111, 'Carrito de compra no encontrado');

            return cart;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20140, 'Error al eliminar el carrito de compra');
        }
    }

}