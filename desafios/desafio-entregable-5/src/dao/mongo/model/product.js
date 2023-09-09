import mongoose from "mongoose";

const collection = "Products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    thumbnails: [String],
    code: String,
    stock: String
})

const productModel = mongoose.model(collection, productSchema);

export default productModel;