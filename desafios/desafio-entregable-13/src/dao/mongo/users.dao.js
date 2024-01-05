import userModel from "./model/user.js";

export default class UsersDAO {
    get = () => {
        return userModel.find().lean();
    }

    getBy = (userDTO) => {
        return userModel.findOne(userDTO).lean();
    }

    create = (userDTO) => {
        return userModel.create(userDTO);
    }

    update = (id, userDTO) => {
        return userModel.updateOne({ _id: id }, { $set: userDTO });
    }
}