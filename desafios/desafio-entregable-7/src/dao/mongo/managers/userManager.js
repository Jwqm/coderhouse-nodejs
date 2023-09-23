import userModel from "../model/user.js";

export default class UserManager {
    get = () => {
        return userModel.find().lean();
    }

    getBy = (params) => {
        return userModel.findOne(params).lean();
    }

    create = (body) => {
        return userModel.create(body);
    }
}