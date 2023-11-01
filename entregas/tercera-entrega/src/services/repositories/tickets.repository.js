import TicketsDTO from "../../dao/dto/tickets.dto.js";
import { CustomError } from "../../errors/custom.error.js";
import { errorCodes, errorMessages } from "../../dictionaries/errors.js"

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
            throw new CustomError(errorCodes.ERROR_CREATE_TICKET, errorMessages[errorCodes.ERROR_CREATE_TICKET]);
        }
    }

}