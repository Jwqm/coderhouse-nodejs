import UserDTO from "../../dao/dto/users.dto.js";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = () => {
        return this.dao.get();
    }

    getBy = (user) => {
        return this.dao.getBy(new UserDTO(user));
    }

    create = (user) => {
        return this.dao.create(new UserDTO(user));
    }
}