import cartModel from "./model/carts.js";

export default class CartsDAO {
    get = () => {
        return cartModel.find().lean();
    }

    getBy = (cartDTO) => {
        return cartModel.findById(cartDTO).populate('products.idProduct').lean();
    }

    create = (cartDTO) => {
        return cartModel.create(cartDTO);
    }

    delete = (cartDTO) => {
        return cartModel.findByIdAndDelete(cartDTO).lean();
    }

    update = (cartDTO, productDTO) => {
        return cartModel.updateOne(
            { _id: cartDTO.id },
            {
                $pull: {
                    products: { idProduct: productDTO._id },
                },
            }
        );
    }

    updateBy = (cartDTO, productDTO) => {
        return cartModel.updateOne(
            { _id: cartDTO._id, 'products.idProduct': productDTO._id },
            {
                $set: {
                    'products.$.quantity': productDTO.quantity,
                }
            });
    }

    createBy = (cartDTO, productDTO) => {
        return cartModel.findOneAndUpdate(
            { _id: cartDTO._id },
            {
                $addToSet: {
                    products: {
                        idProduct: productDTO._id,
                        quantity: productDTO.quantity,
                    },
                },
            },
            { new: true },
        );
    }
}