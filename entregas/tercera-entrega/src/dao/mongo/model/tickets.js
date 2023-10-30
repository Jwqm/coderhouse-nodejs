import mongoose from "mongoose";

const collection = "tickets";
const schema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            codeTicket,
        },
        purchase_datetime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        amount: Number,
        purchaser: String,
    }
)

const ticketModel = mongoose.model(collection, schema);
export default ticketModel;