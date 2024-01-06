import UserDTO from "../../dao/dto/users.dto.js";
import { CustomError, NotFoundError } from "../../errors/custom.error.js";
import { errorCodes, errorMessages } from "../../dictionaries/errors.js"
export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        try {
            return (await this.dao.get()).map(user => UserDTO.fromDatabaseData({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                role: user.role
            }));
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER, errorMessages[errorCodes.ERROR_GET_USER]);
        }
    }

    getBy = (userDTO) => {
        try {
            return this.dao.getBy(userDTO.toDatabaseData());
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_GET_USER_WITH, errorMessages[errorCodes.ERROR_GET_USER_WITH]);
        }
    }

    create = async (userDTO) => {
        try {
            const existUser = await this.dao.getBy(UserDTO.build({ email: userDTO.email }));
            if (existUser) throw new CustomError(errorCodes.ERROR_CREATE_USER_MAIL_DUPLICATE, errorMessages[errorCodes.ERROR_CREATE_USER_MAIL_DUPLICATE]);

            return this.dao.create(userDTO.toDatabaseData());
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_CREATE_USER, errorMessages[errorCodes.ERROR_CREATE_USER]);
        }
    }

    update = (id, userDTO) => {
        try {
            return this.dao.update(id, userDTO.toDatabaseData());
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(errorCodes.ERROR_UPDATE_USER, errorMessages[errorCodes.ERROR_UPDATE_USER]);
        }
    }
}