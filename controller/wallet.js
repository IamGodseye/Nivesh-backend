import shortid from "shortid";
import Wallet from "../models/wallet"
import User from "../models/user"
import Transactions from "../models/transactions";
import Razorpay from 'razorpay'
import crypto from 'crypto'


var rz_instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});


export const createWallet = async (req, res) => {
    try {
        const id = req.user._id
        const user = await User.findById(id)
        if (!user.kycVerified) throw Error('first complete the kyc')
        const walletMatch = await Wallet.findOne({ userId: id })
        if (walletMatch) throw Error('wallet is already created')

        const wallet = new Wallet({ userId: id, balance: '0' })
        await wallet.save()
        const walletId = wallet._id
        await User.findByIdAndUpdate(id, {
            walletId
        })
        return res.status(200).json({ success: true, wallet, message: 'created wallet' })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}
export const addMoney = async (req, res) => {
    try {
        const { amount, id } = req.body
        // const { id } = req.body
        const uuid = shortid.generate()
        var options = {
            amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: uuid,
            payment_capture: true,
        };
        const order = await rz_instance.orders.create(options);
        const deposit = new Transactions({
            userId: id,
            razorpayDetails: {
                orderId: order.id,
            },
            typeOf: 'DEPOSIT',
            status: 'PAYMENT_INIT'
        });
        await deposit.save()
        const deposit_id = deposit.id
        await Wallet.findOneAndUpdate({ userId: id },
            {
                $push: { transactions: { _id: deposit_id } }
            })
        return res.status(200).json({ success: true, order_id: order.id, currency: 'INR', amount })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const verfiyPayment = async (req, res) => {
    try {

        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
            id,
            amount
        } = req.body;

        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
        console.log({ shasum })
        const digest = shasum.digest("hex");
        console.log({ digest })
        console.log({ razorpaySignature })

        console.log(digest === razorpaySignature)
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        await Transactions.findOneAndUpdate({ 'razorpayDetails.orderId': razorpayOrderId }, {
            razorpayDetails: {
                orderId: razorpayOrderId,
                paymentId: razorpayPaymentId,
                signature: razorpaySignature,
            },
            status: 'PAYMENT_RECEIVED'
        });
        const wallet = await Wallet.findOne({ userId: id })
        const balance = parseInt(wallet.balance)
        const updatedBalance = balance + parseInt(amount)
        await Wallet.findOneAndUpdate({ userId: id },
            { balance: updatedBalance })
        return res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
};