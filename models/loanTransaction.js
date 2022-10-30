import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema
const loanTransactionSchema = new Schema(
    {
        typeOf: {
            type: String
        },
        userId: { type: ObjectId, ref: "User" },
        walletId: { type: ObjectId, ref: "Wallet" },
        order: {

        },
        status: {
            type: String,
            require: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("LoanTransactions", loanTransactionSchema);