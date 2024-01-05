import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = "products";

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    thumbnails: [String],
    code: String,
    stock: Number,
    owner: {
        type: String,
        default: 'admin'
    }
})

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(collection, productSchema);

export default productModel;