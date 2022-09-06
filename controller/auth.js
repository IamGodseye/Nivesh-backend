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
        reply.code(400).send({ success: false, message: error.message })
    }
}
export const login = async (req, reply) => {
    try {
        // extract body from req
        const { body } = req

        // extract data from body
        const { email, password } = body

        // find the user with the email
        const user = await prisma.user.findUnique({
            where: {
                email
            },
        })

        // check if the password is matching or not
        const match = await comparePassword(password, user.password);
        if (!match) throw Error('Wrong Password...')

        //
        return { success: true, user, message: 'User has logged in successfully' }
    }
    catch (error) {
        reply.code(400).send({ success: false, message: error.message })
    }

}