import Wallet from "../models/wallet"
import User from "../models/user"

export const createWallet = async (req, res) => {
    try {
        const id = req.user._id
        const user = await User.findById(id)
        if (!user.kycVerified) throw Error('first complete the kyc')

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

