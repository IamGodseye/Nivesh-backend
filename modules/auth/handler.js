import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
import { hashPassword, comparePassword } from '../../utils/auth.js'

const prisma = new PrismaClient()
export const signup = async (req, reply) => {
    try {
        // extract body from request
        const { body } = req

        // extracting data from body
        const { email, name, ip, password } = body

        // pre-checks on data
        if (!email) throw Error('Email is not given')
        if (!name) throw Error('Name is not given')
        if (!password) throw Error('Password is not given')
        if (password.length < 6) throw Error('Password\'s minimum length should be 6')

        // check if user exist with the same email
        const userExist = await prisma.user.findUnique({
            where: {
                email
            },
        })
        console.log(userExist)
        if (userExist) throw Error('User is already exist with this email')

        // convert the password to hash
        const hashedPassword = await hashPassword(password);

        // generate user_id 
        const id = nanoid()

        // create new user in db
        const newUser = await prisma.user.create({
            data: {
                id,
                email,
                name,
                password: hashedPassword,
                ip
            }
        })

        // return new user
        return { success: true, user: newUser, message: 'User created successfully' }
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