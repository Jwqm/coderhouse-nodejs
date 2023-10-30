
import ProductsDTO from "../dao/dto/products.dto.js";
import CartsDTO from "../dao/dto/carts.dto.js";
import TicketsDTO from "../dao/dto/tickets.dto.js";
import { cartsService, productsService, ticketsService } from "../services/repositories.service.js";

export default class PurchaseService {

    purchase = async (cartDTO, productsDTO, add) => {
        const suscessProducts = [];
        const failedProducts = [];
        for (const productUpdateDTO of productsDTO) {
            try {
                const productDTOSearch = await productsService.getBy(ProductsDTO.build({ id: productUpdateDTO.id }));
                if (!productDTOSearch) continue;
                const cartDTOSearch = await cartsService.getBy(cartDTO);
                const quantity = parseInt(productUpdateDTO.quantity);
                if (add) {
                    if (productDTOSearch.stock < quantity) {
                        failedProducts.push(productUpdateDTO);
                        continue;
                    }
                    productDTOSearch.stock -= quantity;
                } else {
                    productDTOSearch.stock += quantity;
                }
                productDTOSearch.quantity = quantity;

                let productCartDTO = cartDTOSearch.products.find((item) => item.product._id.toString() == productDTOSearch.id.toString());
                if (!productCartDTO) {
                    productCartDTO = { id: productDTOSearch.id.toString(), quantity: 0 };
                    cartDTOSearch.products.push(productCartDTO);
                }
                if (add) {
                    productCartDTO.quantity += quantity;
                } else {
                    if (productCartDTO.quantity < quantity) {
                        failedProducts.push(productUpdateDTO);
                        continue;
                    }
                    productCartDTO.quantity -= productUpdateDTO.quantity;
                }

                await cartsService.update(cartDTOSearch);

                await productsService.update(ProductsDTO.build({ id: productDTOSearch.id, stock: productDTOSearch.stock }));

                suscessProducts.push(productUpdateDTO);
            } catch (error) {
                failedProducts.push(productUpdateDTO);
            }
        }
        return { suscessProducts, failedProducts };

    }

    register = async (user, products) => {
        const amount = products.reduce((total, product) => total + product.price, 0);
        const ticket = await ticketsService.create(TicketsDTO.build({ amount: amount, mail: user.email }));
        return { ticket };
    }

}

export const purchaseService = new PurchaseService();