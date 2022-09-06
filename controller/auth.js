import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth.js'


export const signup = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) throw Error('error in payload')
        const hashedPassword = await hashPassword(password)
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
        if (!match) throw Error('Wrong Password...')


        return res.status(200).json({ success: true, user, message: 'User has logged in successfully' })
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message })
    }
}