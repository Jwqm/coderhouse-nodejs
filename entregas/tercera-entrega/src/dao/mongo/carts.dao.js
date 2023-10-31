import cartModel from "./model/carts.js";

export default class CartsDAO {
    get = () => {
        return cartModel.find().lean();
    }

    getBy = (cartDTO) => {
        return cartModel.findById(cartDTO).populate('products.product').lean();
    }

    create = (cartDTO) => {
        return cartModel.create(cartDTO);
    }

    delete = (cartDTO) => {
        return cartModel.findByIdAndDelete(cartDTO).lean();
    }

    update = (cartDTO) => {
        return cartModel.updateOne({ _id: cartDTO._id }, { $set: { products: cartDTO.products } });
    }

}