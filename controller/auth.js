import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import { hashPassword, comparePassword } from '../utils/auth.js'


export const signup = async (req, res) => {
    try {
        // email, password combo to register a user, hash of the password is stored instead of plain text
        // check: if email already exist?

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
        // find the hash of password from email, 
        // compare both passwords, if true send JWT and user-data without hash of password

        const { email, password } = req.body
        const user = await User.findOne({ email })
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
        // 

        const { panNumber, dateOfBirth } = req.body
        const id = req.user._id
        const panRegex = /[A-Z]{5}[0-9]{4}[A-Z]{1}/
        if (!panRegex.test(panNumber)) throw Error('Pan card not as per format')


        await User.findByIdAndUpdate(id,
            {
                pan: panNumber,
                dob: dateOfBirth
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