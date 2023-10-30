
import ProductsDTO from "../dao/dto/products.dto.js";
import CartsDTO from "../dao/dto/carts.dto.js";
import { cartsService, productsService } from "../services/repositories.service.js";
import { CustomError } from "../errors/custom.error.js";

export default class PurchaseService {

    purchase = async (cartDTO, productsDTO, add) => {
        const suscessProducts = [];
        const failedProducts = [];
        for (const productUpdateDTO of productsDTO) {
            try {
                const productDTO = await productsService.getBy(ProductsDTO.build({ id: productUpdateDTO.id }));
                const cart = await cartsService.getBy(cartDTO);

                if (add) {
                    if (productDTO.stock < productUpdateDTO.quantity) {
                        failedProducts.push(productUpdateDTO);
                        //throw new CustomError(10015, `Error solo quedan en stock ${product.stock} productos`);
                    }
                    productDTO.stock -= productUpdateDTO.quantity;
                } else {
                    productDTO.stock += productUpdateDTO.quantity;
                }
                productDTO.quantity = productUpdateDTO.quantity;

                const productCartDTO = cart.products.find((x) => x.idProduct._id.toString() == productDTO.id.toString());
                if (!productCartDTO) {
                    cartsService.createBy(CartsDTO.build({ id: cart.id }), ProductsDTO.build({ id: productDTO.id, quantity: productDTO.quantity }));
                } else {
                    if (add) {
                        productCartDTO.quantity += productUpdateDTO.quantity;
                    } else {
                        if (productCartDTO.quantity < productUpdateDTO.quantity) {
                            failedProducts.push(productUpdateDTO);
                            //throw a CustomError(10016, `Error solo puede quitar ${productCart.quantity} productos del carrito de compras`);
                        }
                        productCartDTO.quantity -= productUpdateDTO.quantity;
                    }
                    if (productCartDTO.quantity === 0) {
                        cartsService.update(CartsDTO.build({ id: cart.id }), ProductsDTO.build({ id: productDTO.id }));
                    } else {
                        cartsService.updateBy(CartsDTO.build({ id: cart.id }), ProductsDTO.build({ id: productDTO.id, quantity: productDTO.quantity }));
                    }
                }

                await productsService.update(ProductsDTO.build({ id: productDTO.id, stock: productDTO.stock }));
                suscessProducts.push(productUpdateDTO);
            } catch (error) {
                failedProducts.push(productUpdateDTO);
                // throw new CustomError(20130, 'Error al actualizar el carrito de compra');
            }
            return { suscessProducts, failedProducts };
        }
    }

}

export const purchaseService = new PurchaseService();