import UserDTO from "../../dao/dto/users.dto.js";

export default class UsersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    get = async () => {
        return (await this.dao.get()).map(user => UserDTO.fromDatabaseData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            role: user.role
        }));
    }

    getBy = (userDTO) => {
        return this.dao.getBy(userDTO.toDatabaseData());
    }

    create = (userDTO) => {
        return this.dao.create(userDTO.toDatabaseData());
    }

    update = (id, userDTO) => {
        return this.dao.update(id, userDTO.toDatabaseData());
    }
}