import mongoose from "mongoose"
const { Schema } = mongoose
const { ObjectId } = Schema
const userSchema = new Schema(
    {

        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 64,
        },
        role: {
            type: [String],
            default: ["User"],
            enum: ["User", "Manager", "Admin"],
        },
        pan: {
            type: String,
        },
        kycVerified: {
            type: Boolean,
            default: false
        },
        walletId: { type: ObjectId, ref: "Wallet" }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);