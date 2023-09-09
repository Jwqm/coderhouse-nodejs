import mongoose from "mongoose";

const collection = "Carts";

const cartSchema = new mongoose.Schema({
    detailCart: [
        {
            _id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Products'
            },
            quantity: Number
        }
    ]
});

const cartModel = mongoose.model(collection, cartSchema);

export default cartModel;