
import ProductsDTO from "../dao/dto/products.dto.js";
import CartsDTO from "../dao/dto/carts.dto.js";
import TicketsDTO from "../dao/dto/tickets.dto.js";
import { cartsService, productsService, ticketsService } from "../services/repositories.service.js";

export default class PurchaseService {

    purchase = async (cartDTO, productsDTO, add) => {
        return await cartsService.updateWithProduct(cartDTO, productsDTO, true);
    }

    register = async (user, products) => {
        const amount = products.reduce((total, product) => total + product.price, 0);
        return await ticketsService.create(TicketsDTO.build({ amount: amount, mail: user.email }));
    }

}

export const purchaseService = new PurchaseService();