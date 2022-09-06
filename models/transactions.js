import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema
const transactionSchema = new Schema(
    {
        typeOf: {
            type: String
        },
        userId: { type: ObjectId, ref: "User" },
        walletId: { type: ObjectId, ref: "Wallet" },
        razorpayDetails: {
            orderId: {
                type: String,
                require: true
            },
            paymentId: {
                type: String,
                // require: true
            },
            signature: {
                type: String,
                // require: true
            }
        },
        status: {
            type: String,
            require: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("Transactions", transactionSchema);