import cartModel from "../model/carts.js";
import { NotFoundError, CustomError } from '../../../errors/custom.error.js';
import ProductsManager from "./products.manager.js";


export default class CartsManager {
    productsManager;

    constructor() {
        this.productsManager = new ProductsManager();
    }

    updateCartAndProduct = async (idCard, productsUpdate, add) => {
        try {
            await productsUpdate.forEach(async (productUpdate) => {
                const product = await this.productsManager.getProductById(productUpdate.idProduct);
                const cart = await this.getCartById(idCard);

                if (add) {
                    if (product.stock < productUpdate.quantity) {
                        throw new CustomError(10015, `Error solo quedan en stock ${product.stock} productos`);
                    }
                    product.stock -= productUpdate.quantity;
                } else {
                    product.stock += productUpdate.quantity;
                }

                const productCart = cart.products.find((x) => x.idProduct.toString() == product._id.toString());

                if (!productCart) {
                    await cartModel.findOneAndUpdate(
                        { _id: idCard },
                        {
                            $addToSet: {
                                products: {
                                    idProduct: product._id,
                                    quantity: productUpdate.quantity,
                                },
                            },
                        },
                        { new: true },
                    );
                }
                else {
                    if (add) {
                        productCart.quantity += productUpdate.quantity;
                    } else {
                        if (productCart.quantity < productUpdate.quantity) {
                            throw new CustomError(10016, `Error solo puede quitar ${productCart.quantity} productos del carrito de compras`);
                        }
                        productCart.quantity -= productUpdate.quantity;
                    }
                    if (productCart.quantity === 0) {
                        await cartModel.updateOne(
                            { _id: cart._id },
                            {
                                $pull: {
                                    products: { idProduct: productCart.idProduct },
                                },
                            }
                        );
                    } else {
                        await cartModel.updateOne(
                            { _id: cart._id, 'products.idProduct': productCart.idProduct },
                            {
                                $set: {
                                    'products.$.quantity': productCart.quantity,
                                }
                            });
                    }
                }

                await this.productsManager.updateProduct({ id: product._id, stock: product.stock });
            });
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20130, 'Error al actualizar el carrito de compra');
        }
    }

}