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
        /*const productDTO = cartDTO.products[0];
        return cartModel.findOneAndUpdate(
            { _id: cartDTO._id },
            {
                $addToSet: {
                    products: {
                        product: productDTO.product,
                        quantity: productDTO.quantity,
                    },
                },
            },
            { new: true },
        );*/
        return cartModel.updateOne({ _id: cartDTO._id }, { $set: { products: cartDTO.products } });
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
                        product: productDTO._id,
                        quantity: productDTO.quantity,
                    },
                },
            },
            { new: true },
        );
    }
}