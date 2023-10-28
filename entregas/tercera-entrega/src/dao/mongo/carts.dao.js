import cartModel from "./model/carts.js";
import { NotFoundError, CustomError } from '../../errors/custom.error.js';
import ProductsDAO from "./products.dao.js";


export default class CartsDAO {
    productsDAO;

    constructor() {
        this.productsDAO = new ProductsDAO();
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
            const cart = await cartModel.findById({ _id: id }).populate('products.idProduct').lean();
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