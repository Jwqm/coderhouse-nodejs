import mongoose from "mongoose";

const collection = "Messages";

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
});

const messageModel = mongoose.model(collection, messageSchema);

export default messageModel;