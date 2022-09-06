import User from '../models/user'
import jwt from 'jsonwebtoken'
import { hashPassword, comparePassword } from '../utils/auth.js'


export const signup = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) throw Error('error in payload')
        const hashedPassword = await hashPassword(password)
        const match = await User.findOne({ email })
        if (match) throw Error('a user has already registered using this email')
        const user = new User({ email, password: hashedPassword })

        await user.save()

        return res.status(200).json({ success: true, message: 'user is saved in the databse' })

    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // find the user with the email
        const user = await User.findOne({ email })

        // check if the password is matching or not
        const match = await comparePassword(password, user.password);
        if (!match) throw Error('wrong password...')
        const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
            expiresIn: "7d",
        });
        user.password = undefined;

        return res.status(200).json({ success: true, user, token, message: 'user has logged in successfully' })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}

export const doKyc = async (req, res) => {
    try {
        const { panNumber } = req.body
        const id = req.user._id

        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
        if (!panRegex.test(panNumber)) throw Error('Pan card not as per format')


        await User.findByIdAndUpdate(id,
            {
                pan: panNumber
            }
        )

        return res.status(200).json({ success: true, message: 'kyc done' })

    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}
export const verifyKyc = async (req, res) => {
    try {
        const id = req.user._id
        await User.findByIdAndUpdate(id,
            {
                kycVerified: true
            }
        )

        return res.status(200).json({ success: true, message: 'kyc verified' })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}