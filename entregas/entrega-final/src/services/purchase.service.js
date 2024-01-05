import TicketsDTO from "../dao/dto/tickets.dto.js";
import { cartsService, ticketsService } from "../services/repositories.service.js";
import MailerService from '../services/mailer.service.js';
import DMailTemplates from '../constants/dmail.templates.js';

export default class PurchaseService {

    purchase = async (cartDTO, productsDTO, add) => {
        return await cartsService.updateWithProduct(cartDTO, productsDTO, true);
    }

    register = async (user, products) => {
        const amount = products.reduce((total, product) => total + product.price, 0);
        const ticket = await ticketsService.create(TicketsDTO.build({ amount: amount, mail: user.email }));

        const mailerService = new MailerService();
        await mailerService.sendMail([user.email], DMailTemplates.PURCHASE, { user, ticket, products });

        return ticket;
    }

}

export const purchaseService = new PurchaseService();