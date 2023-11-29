import mongoose,{ Schema} from "mongoose";

const orderItemSchema = new Schema
(
    {
        quantity: {
            type: Number,
            required: true
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    {
        timestamps: true
    }
)

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);