import ticketModel from "./model/tickets.js";

export default class UsersDAO {
    get = () => {
        return ticketModel.find().lean();
    }

    getBy = (ticketDTO) => {
        return ticketModel.findOne(ticketDTO).lean();
    }

    create = (ticketDTO) => {
        return ticketModel.create(ticketDTO);
    }
}