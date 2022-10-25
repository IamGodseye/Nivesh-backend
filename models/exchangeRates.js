import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = Schema
const exchangeRateSchema = new Schema(
    {
        rates: {
        },
        status: {
            type: String,

        },
        data: {

        }
    },
    { timestamps: true }
);

export default mongoose.model("ExchangeRates", exchangeRateSchema);