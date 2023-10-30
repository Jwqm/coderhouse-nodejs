import TicketsDTO from "../../dao/dto/tickets.dto.js";
import { CustomError, NotFoundError } from "../../errors/custom.error.js";

export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    create = async (ticketDTO) => {
        try {
            if (ticketDTO) return TicketsDTO.fromDatabaseData(await this.dao.create(ticketDTO.toDatabaseData()));
            return TicketsDTO.fromDatabaseData(await this.dao.create({}));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(20151, 'Error al crear el ticket de compra');
        }
    }

}