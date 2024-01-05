import mongoose from "mongoose";

const collection = "users";
const schema = new mongoose.Schema(
    {
        firstName: String,
        lastName: String,
        email: {
            type: String,
            unique: true,
        },
        age: Number,
        password: String,
        role: {
            type: String,
            enum: ['user', 'admin', 'premium'],
            default: 'user'
        },
        cart: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "carts",
        },
        documents: [
            {
                name: {
                    type: String,
                },
                reference: {
                    type: String,
                },
            }
        ],
        last_connection: {
            type: Date,
        },
    }
)

const userModel = mongoose.model(collection, schema);
export default userModel;