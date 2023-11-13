import UserDTO from "../../dao/dto/users.dto.js";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = () => {
        return this.dao.get();
    }

    getBy = (userDTO) => {
        return this.dao.getBy(userDTO.toDatabaseData());
    }

    create = (userDTO) => {
        return this.dao.create(userDTO.toDatabaseData());
    }
}