import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema
const walletSchema = new Schema(
    {
        balance: {
            type: String,
        },
        userId: { type: ObjectId, ref: "User" },
        transactions: [{ type: ObjectId, ref: "Transactions" }],
    },
    { timestamps: true }
);

export default mongoose.model("Wallet", walletSchema);