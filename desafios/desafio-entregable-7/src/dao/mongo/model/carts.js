import mongoose from "mongoose";

const collection = 'carts';
const productSubSchema = new mongoose.Schema({
    idProduct: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'products',
    },
    quantity: {
        type: Number,
        default: 1,
    },
}, { _id: false });

const cartSchema = new mongoose.Schema(
    {
        products: {
            type: [productSubSchema],
            default: [],
        },
    },
    { timestamps: true }
);

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;