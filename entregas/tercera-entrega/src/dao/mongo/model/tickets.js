import mongoose from "mongoose";

const collection = "tickets";
const schema = new mongoose.Schema(
    {
        code: {
            type: String,
            unique: true,
            default: function () {
                return Math.random().toString(36).substring(7);
            },
        },
        purchase_datetime: {
            type: Date,
            default: Date.now,
        },
        amount: Number,
        purchaser: String,
    }
)

const ticketModel = mongoose.model(collection, schema);
export default ticketModel;